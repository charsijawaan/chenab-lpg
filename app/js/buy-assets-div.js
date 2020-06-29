showBuyAssetsDiv = () => {
    hideAllDivs()
    $(`#buy-assets-div`).html(``)
    $(`#buy-assets-div`).append(`
        <div>
            <h2>Buy Assets</h2>
        </div>
    `)
    getAllTypesOfCylinders((err, cylinderTypes)=> {
        getAllPlants((err, allPlants)=>{
            let str = ''
            str += `<select name="plant" id="select-plant-buy-assets-div">`
            for(let i = 0; i < allPlants.length; i++) {
                str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`                
            }
            str += '</select>'
            $(`#buy-assets-div`).append(str)
            for(let i = 0; i < cylinderTypes.length; i++) {
                $('#buy-assets-div').append(`
                
                <div style="display: flex;">
                    <div style="text-align: center;" style="display: flex;">
                        <div class="mt-4" style="display: flex;align-items: center;">

                        <ul style="margin: 8px 0px;">
                            <li>
                            <input id="${cylinderTypes[i].weight}kg-buy-assets-checkbox" type="checkbox" 
                            class="switch" onchange="enableBuyAssetsFields(${cylinderTypes[i].weight})">
                            <label for="s1">${cylinderTypes[i].weight} Kg</label>
                            </li>
                        </ul>

                            <label for="inp" class="inp mr-3 ml-4">
                            <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');handleBuyAssetsTotal()" 
                            min="1" required id="buy-assets-${cylinderTypes[i].weight}kg-rate" disabled>
                            <span class="label">Enter Rate</span>
                            <span class="focus-bg"></span>
                            </label>
                
                            <label for="inp" class="inp mr-3">
                            <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');handleBuyAssetsTotal()"
                             min="1" 
                            required id="buy-assets-${cylinderTypes[i].weight}kg-cylinders" disabled>
                            <span class="label">Number of Cylinders</span>
                            <span class="focus-bg"></span>
                            </label>    
                        </div>                           
                    </div>                    
                </div>                       
                `)
            }
            $('#buy-assets-div').append(`
            <div style="margin-top: 30px">
                <h3 id="buy-assets-total">Total = 0 Rs</h3>
            </div>
            <div class="mt-3">
                <button class="btn btn-primary" onclick="buyAssets()">Buy Assets</button>                
            </div>   
            `)
        })
    })
    $(`#buy-assets-div`).css('display', 'flex')
}

enableBuyAssetsFields = (weight) => {
    if($(`#${weight}kg-buy-assets-checkbox`).prop('checked')) {
        $(`#buy-assets-${weight}kg-rate`).prop('disabled', false)
        $(`#buy-assets-${weight}kg-cylinders`).prop('disabled', false)
    }
    else {
        $(`#buy-aseets-${weight}kg-rate`).prop('disabled', true)
        $(`#buy-assets-${weight}kg-cylinders`).prop('disabled', true)
        $(`#buy-assets-${weight}kg-rate`).val('')
        $(`#buy-assets-${weight}kg-cylinders`).val('')
        updateBuyAssetsTotal()
    }
}

handleBuyAssetsTotal = () => {
    updateBuyAssetsTotal()
}

handleBuyAssetsTotal = () => {
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        let total = 0
        for(let i = 0; i < cylinderTypes.length; i++) {            
            total = total + (Number($(`#buy-assets-${cylinderTypes[i].weight}kg-rate`).val())  * Number($(`#buy-assets-${cylinderTypes[i].weight}kg-cylinders`).val()))
        }        
        $('#buy-assets-total').html(`Total =  ${total} Rs`)
    })
}

buyAssets = () => {
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        let checked = false
        for(let i = 0; i < cylinderTypes.length; i++) {
            if($(`#${cylinderTypes[i].weight}kg-buy-assets-checkbox`).prop('checked')) {
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
        else {
            let total = 0
            for(let i = 0; i < cylinderTypes.length; i++) {
                if(!($(`#${cylinderTypes[i].weight}kg-buy-assets-checkbox`).prop('checked')))
                    continue
                let rate = $(`#buy-assets-${cylinderTypes[i].weight}kg-rate`).val()
                let numberOfCylinders = $(`#buy-assets-${cylinderTypes[i].weight}kg-cylinders`).val()            
                total = total + (Number(rate) * Number(numberOfCylinders))
            }
            let date = new Date()
            let plantID = $('#select-plant-buy-assets-div').children('option:selected').val()
            insertIntoBuyAssets(plantID, total, date.getTime(), ()=>{
                getLastBuyAssetsID((err, lastRow)=>{
                    for(let i = 0; i < cylinderTypes.length; i++) {
                        if(!($(`#${cylinderTypes[i].weight}kg-buy-assets-checkbox`).prop('checked')))
                            continue
                        let rate = $(`#buy-assets-${cylinderTypes[i].weight}kg-rate`).val()
                        let numberOfCylinders = $(`#buy-assets-${cylinderTypes[i].weight}kg-cylinders`).val()
                        let subTotal = Number(rate) * Number(numberOfCylinders) 

                        if($(`#buy-assets-${cylinderTypes[i].weight}kg-cylinders`).val() == '') {
                            rate = 0
                            numberOfCylinders = 0
                            subTotal = 0
                        }

                        insertIntoBuyAssetsDetails(lastRow.buy_assets_id, rate, numberOfCylinders, subTotal, cylinderTypes[i].weight, ()=>{
                            if(!(Number(numberOfCylinders) == 0)) {
                                updateMainWindowGUI()
                                resetBuyAssetsDiv()                                    
                            }
                            else {
                                updateMainWindowGUI()
                                resetBuyAssetsDiv()
                            }                             
                        })
                    }
                })
            })
        }
    })
}

resetBuyAssetsDiv = () => {
    $('#buy-assets-div').html('')
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            $(`#${cylinderTypes[i].weight}kg-buy-assets-checkbox`).prop('checked', false)
            $(`#buy-assets-${cylinderTypes[i].weight}kg-rate`).prop('disabled', true)
            $(`#buy-assets-${cylinderTypes[i].weight}kg-cylinders`).prop('disabled', true)
            $(`#buy-assets-${cylinderTypes[i].weight}kg-cylinders`).val('')
            $(`#buy-assets-${cylinderTypes[i].weight}kg-rate`).val('')
        }
        $('#buy-assets-total').html('Total = 0 Rs')
    })
}