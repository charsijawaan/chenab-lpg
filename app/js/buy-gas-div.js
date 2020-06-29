

// function shows the buy gas dynamically
showBuyGasDiv = () => {
    hideAllDivs()
    $('#buy-gas-div').append(`
        <h2>Buy Gas</h2>
    `)

    getAllTypesOfCylinders((err, cylinderTypes)=> {
        getAllPlants((err, allPlants)=>{
            let str = ''
            str += `<select name="plant" id="select-plant-buy-gas-div">`
            for(let i = 0; i < allPlants.length; i++) {
                str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`                
            }
            str += '</select>'
            $(`#buy-gas-div`).append(str)
            for(let i = 0; i < cylinderTypes.length; i++) {
                $('#buy-gas-div').append(`
                
                <div style="display: flex;">
                    <div style="text-align: center;" style="display: flex;">
                        <div class="mt-4" style="display: flex;align-items: center;">

                        <ul style="margin: 8px 0px;">
                            <li>
                            <input id="${cylinderTypes[i].weight}kg-buy-gas-checkbox" type="checkbox" 
                            class="switch" onchange="enableBuyBasFields(${cylinderTypes[i].weight})">
                            <label for="s1">${cylinderTypes[i].weight} Kg</label>
                            </li>
                        </ul>

                            <label for="inp" class="inp mr-3 ml-4">
                            <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');handleBuyGasTotal()" 
                            min="1" required id="buy-gas-${cylinderTypes[i].weight}kg-gas-rate" disabled>
                            <span class="label">Enter Gas Rate</span>
                            <span class="focus-bg"></span>
                            </label>
                
                            <label for="inp" class="inp mr-3">
                            <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');handleBuyGasTotal()"
                             min="1" 
                            required id="buy-gas-${cylinderTypes[i].weight}kg-cylinders" disabled>
                            <span class="label">Number of Cylinders</span>
                            <span class="focus-bg"></span>
                            </label>

                            
                        </div>
                                                               
                    </div>                    
                </div>       
                
                `)
            }
            $('#buy-gas-div').append(`
            <div style="margin-top: 30px">
                <h3 id="buy-gas-total">Total = 0 Rs</h3>
            </div>
    
            <div class="mt-3">
                <button class="btn btn-primary" onclick="buyGasFromPlant()" id="buy-gas-from-plant-btn">Buy Gas</button>                
            </div>   
            
            `)
        })
        
    })
    $('#buy-gas-div').css('display', 'flex')
}

// handles the input fields and checkboxes in buy gas div
enableBuyBasFields = (weight) => {
    if($(`#${weight}kg-buy-gas-checkbox`).prop('checked')) {
        $(`#buy-gas-${weight}kg-gas-rate`).prop('disabled', false)
        $(`#buy-gas-${weight}kg-cylinders`).prop('disabled', false)
    }
    else {
        $(`#buy-gas-${weight}kg-gas-rate`).prop('disabled', true)
        $(`#buy-gas-${weight}kg-cylinders`).prop('disabled', true)
        $(`#buy-gas-${weight}kg-gas-rate`).val('')
        $(`#buy-gas-${weight}kg-cylinders`).val('')
        updateBuyGasTotal()
    }
}

// make changes to total if input fields value changes
handleBuyGasTotal = () => {
    updateBuyGasTotal()
}

// resets the buy gas div
resetBuyGasDiv = () => {
    $('#buy-gas-div').html('')
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            $(`#${cylinderTypes[i].weight}kg-buy-gas-checkbox`).prop('checked', false)
            $(`#buy-gas-${cylinderTypes[i].weight}kg-gas-rate`).prop('disabled', true)
            $(`#buy-gas-${cylinderTypes[i].weight}kg-cylinders`).prop('disabled', true)
            $(`#buy-gas-${cylinderTypes[i].weight}kg-cylinders`).val('')
            $(`#buy-gas-${cylinderTypes[i].weight}kg-gas-rate`).val('')
        }
        $('#buy-gas-from-plant-btn').prop('disabled', true)
        $('#buy-gas-total').html('Total = 0 Rs')
    })
}


// buys gas btn in buy gas div to purchase gas
buyGasFromPlant = () => {
    let plantID = $('#select-plant-buy-gas-div').children('option:selected').val()
    let assetsAvailable = true
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        let checked = false
        for(let i = 0; i < cylinderTypes.length; i++) {
            if($(`#${cylinderTypes[i].weight}kg-buy-gas-checkbox`).prop('checked')) {
                checked = true
            }
        }
        if(!checked) {
            let options = {
                type: 'info',
                buttons: ['Okay'],
                message: `Please turn on at least one checkbox`,
                normalizeAccessKeys: true
            }
            dialog.showMessageBox(options, i => {
                if (i == 0) {
                    return
                }
            })
        }
        let iter = 0
        for(let i = 0; i < cylinderTypes.length; i++) {
            if(!($(`#${cylinderTypes[i].weight}kg-buy-gas-checkbox`).prop('checked'))){
                iter++
                continue
            }                
            let numberOfCylinders = Number($(`#buy-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
            getAvailableAssetsByPlantID(cylinderTypes[i].weight, plantID, (err, availAssets)=>{
                iter++
                if(numberOfCylinders > availAssets[0].number_of_cylinders || availAssets[0].number_of_cylinders === null) {
                    assetsAvailable = false
                }
                if(iter === cylinderTypes.length) {
                    if(!assetsAvailable) {
                        let options = {
                            type: 'info',
                            buttons: ['Okay'],
                            message: `There are not enough Assets`,
                            normalizeAccessKeys: true
                        }
                        dialog.showMessageBox(options, i => {
                            if (i == 0) {
                                return
                            }
                        })
                    }
                    else {
                        let total = 0
                        for(let i = 0; i < cylinderTypes.length; i++) {
                            if(!($(`#${cylinderTypes[i].weight}kg-buy-gas-checkbox`).prop('checked')))
                                continue
                            let gasRate = $(`#buy-gas-${cylinderTypes[i].weight}kg-gas-rate`).val()
                            let numberOfCylinders = $(`#buy-gas-${cylinderTypes[i].weight}kg-cylinders`).val()            
                            total = total + (Number(gasRate) * Number(numberOfCylinders))
                        }
                        let date = new Date()            
                        insertIntoFillings(date.getTime(), total, plantID, (err)=>{
                            getLastFillingsID((err, lastRow)=>{
                                for(let i = 0; i < cylinderTypes.length; i++) {
                                    if(!($(`#${cylinderTypes[i].weight}kg-buy-gas-checkbox`).prop('checked')))
                                        continue
                                    let gasRate = $(`#buy-gas-${cylinderTypes[i].weight}kg-gas-rate`).val()
                                    let numberOfCylinders = $(`#buy-gas-${cylinderTypes[i].weight}kg-cylinders`).val()
                                    let subTotal = Number(gasRate) * Number(numberOfCylinders) 
            
                                    if($(`#buy-gas-${cylinderTypes[i].weight}kg-cylinders`).val() == '') {
                                        gasRate = 0
                                        numberOfCylinders = 0
                                        subTotal = 0
                                    }
            
                                    insertIntoFillingsDetails(lastRow.fillings_id, gasRate, numberOfCylinders, subTotal, cylinderTypes[i].weight,(err)=>{                            
                                        if(!(Number(numberOfCylinders) == 0)) {
                                            updateStock(cylinderTypes[i].id, numberOfCylinders, cylinderTypes[i].weight, gasRate, plantID, (err)=>{                                    
                                                updateMainWindowGUI()
                                                resetBuyGasDiv()                                    
                                            })
                                        }
                                        else {
                                            updateMainWindowGUI()
                                            resetBuyGasDiv()
                                        }                             
                                    })
                                }
                                let options = {
                                    type: 'info',
                                    buttons: ['Okay'],
                                    message: `Gas has been bought`,
                                    normalizeAccessKeys: true
                                }
                                dialog.showMessageBox(options, i => {
                                    if (i == 0) {
                                        return
                                    }
                                })
                            })
                        })
                    } 
                }
            })
        }            
    })    
}

updateBuyGasTotal = () => {
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        let total = 0
        for(let i = 0; i < cylinderTypes.length; i++) {            
            total = total + (Number($(`#buy-gas-${cylinderTypes[i].weight}kg-gas-rate`).val())  * Number($(`#buy-gas-${cylinderTypes[i].weight}kg-cylinders`).val()))
        }        
        $('#buy-gas-total').html(`Total =  ${total} Rs`)
    })
}