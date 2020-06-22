updateStockNumberGUI = () => {

    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            getTotalNumberOfCylindersInStock( (i+1), (err, data) => {
                if(data == null) {
                    data = 0
                }
                $(`#stock-number-of-cylinders-${cylinderTypes[i].weight}-kg`).html(`${cylinderTypes[i].weight} Kg = ${data} Cylinders`)        
            })        
        }
    })
}

updatePlantMoneyNumberGUI = () => {

    getAllPlants((err, allPlants)=>{
        for(let i = 0; i < allPlants.length; i++) {
            getTotalPlantMoney((i+1), (err, data) => {
                $(`#plant-money-${allPlants[i].plant_name}`).html(`${allPlants[i].plant_name} = ${data} Rs/-`)
                let plantName = capitalizeFLetter(`plant-money-${allPlants[i].plant_name}`)
                $(`#plant-money-${allPlants[i].plant_name}`).html(plantName)
            })
        }
    })
    
}

updateMarketMoneyNumberGUI = () => {
    getTotalMoneyInMarket((err, data) => {
        $(`#total-money-in-market`).html(`${data[0].pending_amount} Rs/-`)
        getAllTypesOfCylinders((err, cylinderTypes) => {
            for(let i = 0; i < cylinderTypes.length; i++) {                
                getTotalCylindersInMarket(cylinderTypes[i].weight, (err, data) => {
                    if(data[0].total_cylinders == null) {
                        data[0].total_cylinders = 0
                    }
                    $(`#market-number-of-cylinders-${cylinderTypes[i].weight}-kg`).html(`${cylinderTypes[i].weight} Kg = ${data[0].total_cylinders} Cylinders`)
                })
            }
        })
    })            
}

updateMainWindowGUI = () => {
    updateStockNumberGUI()
    updatePlantMoneyNumberGUI()
    updateMarketMoneyNumberGUI()
}

// when ever a button is pressed all the extra divs are hided
hideAllDivs = () => {
    for(let i = 0; i < allDivs.length; i++) {
        allDivs[i].style.display = 'none'
    }
    $('#view-buy-history-table').html('')
    $('#view-buy-history-date-checkbox').prop('checked', false)
    $('#view-buy-history-from').prop('disabled', true)
    $('#view-buy-history-to').prop('disabled', true)
    $('#view-buy-history-from').val('')
    $('#view-buy-history-to').val('')
    $('#view-buy-history-datepicker-btn').prop('disabled', true)
    $('#pay-money-to-plant-form').trigger('reset')
    
    resetViewPaymentHistory()
    resetBuyGasDiv()
}

capitalizeFLetter = (id) => { 
    var string = $(`#${id}`).html()
    return string[0].toUpperCase() + string.slice(1)
} 

showMsgDialog = (msg) => {
    let options = {
        type: 'info',
        buttons: ['Okay'],
        message: msg,
        normalizeAccessKeys: true
    }
    dialog.showMessageBox(options, i => {
        if (i == 0) {
            return
        }
    })
}