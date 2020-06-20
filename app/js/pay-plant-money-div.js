// function to show the pay plant money div
showPayPlantMoneyDiv = () => {
    hideAllDivs()
    $('#pay-plant-money-div').html('')

    $('#pay-plant-money-div').append(`<div style="text-align: center;">
    <h2>Pay Plant Money</h2>
</div>`)
    getAllPlants((err, allPlants)=>{
        let str = ''
        str += `<div style="text-align: center" class=""><select name="plant" id="select-plant-pay-gas-div">`
        for(let i = 0; i < allPlants.length; i++) {
            str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`                
        }
        str += '</select></div>'
        $(`#pay-plant-money-div`).append(str)

        $(`#pay-plant-money-div`).append(`
        
        <div style="text-align: center;">
            <div class="">
                <label for="inp" class="inp">
                <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');" min="1" required id="pay-amount-field">
                <span class="label">Enter Amount</span>
                <span class="focus-bg"></span>
                </label>
                
            </div>
            <div class="mt-4">
                <button style="width:8%" class="btn btn-primary" onclick="payMoneyToPlant()">Pay</button>
            </div>                    
        </div>
    `)
    })
    
    $('#pay-plant-money-div').css('display', 'flex')
}

// btn to pay money to plant
payMoneyToPlant = () => {
    let amountToPay = $(`#pay-amount-field`).val()
    let plantID = $('#select-plant-pay-gas-div').children('option:selected').val()
    if(amountToPay == '') {
        return
    }
    getTotalPlantMoney(plantID, (err, plantMoney)=>{
        if(plantMoney < 1) {
            let options = {
                type: 'info',
                buttons: ['Okay'],
                message: `You don't owe any money to this plant`,
                normalizeAccessKeys: true
            }
            dialog.showMessageBox(options, i => {
                if (i == 0) {
                    return
                }
            })
        }
        else if(amountToPay > plantMoney) {
            let options = {
                type: 'info',
                buttons: ['Okay'],
                message: `Please pay the right amount`,
                normalizeAccessKeys: true
            }
            dialog.showMessageBox(options, i => {
                if (i == 0) {
                    return
                }
            })
        }
        else {
            let options = {
                type: 'question',
                buttons: ['Yes', 'No'],
                message: 'Do you really want to Pay?',
                normalizeAccessKeys: true
            }
            dialog.showMessageBox(options, i => {
                if (i == 0) {                    
                    let date = new Date()
                    insertIntoPlantTransactions(amountToPay, date.getTime(), plantID, (err, res) => {
                        decreasePlantMoney(amountToPay, plantID, (err, res) => {
                            resetPayMoneyToPlantDiv()
                            updateMainWindowGUI()
                        })
                    })      
                }
                else if(i == 1) {
                    resetPayMoneyToPlantDiv()
                    return
                }
            })
        }
    })
}

// resets the pay plant money div
resetPayMoneyToPlantDiv = () => {
    $('#pay-amount-field').val('')
}