showMarketDetailsDiv = () => {
    hideAllDivs()
    resetMarketDetailsDiv()
    $('#market-details-div').append(`
    <div style="text-align: center;">
        <h2>Market Details</h2>
    </div>
    <div>
        <div style="text-align: center;">
            <div class="mt-2">
                <label for="inp" class="inp">
                <input type="text" placeholder="&nbsp;" required id="company-name-field-market-details"
                 onkeydown="getCustomersFromDatabase('company-name-field-market-details')">
                <span class="label">Enter Customer Name</span>
                <span class="focus-bg"></span>
                </label>                
            </div>
        </div>
        <div style="text-align: center;display: flex; flex-direction: column;" id="select-company-div-wrapper">
            <!-- html changes here while searching -->
        </div>
    </div>
    <div class="mt-3 mb-4">
        <button class="btn btn-primary" style="text-align: center;" onclick="getMarketInfo()">Search</button>
    </div>
    <div id="market-details-customer-div">
    </div>
    `)
    $('#market-details-div').css('display', 'flex')
}

resetMarketDetailsDiv = () => {
    $('#market-details-div').html(``)
}

getMarketInfo = () => {
    $('#market-details-customer-div').html('')
    let companyName = $('#company-name-field-market-details').val()
    if(companyName === '') {
        showMsgDialog('Enter company name')
    }
    getCustomer(companyName, (err, customerData) => {
        if(customerData.length < 1) {
            showMsgDialog('No company with this name was found')
            return
        }
        else {
            getAllTypesOfCylinders((err, cylinderTypes) => {
                for(let i = 0; i < cylinderTypes.length; i++) {
                    getNumberOfCylindersinPossesion(customerData[0].customer_id, cylinderTypes[i].weight, (err, data) => {
                        for(let j = 0; j < data.length; j++) {
                            let plantName
                            if(data[j].plant_id === 1) {
                                plantName = 'Chenab'
                            }
                            else if(data[j].plant_id === 2) {
                                plantName = 'Super'
                            }
                            $('#market-details-customer-div').append(`
                            <div style="display: flex;justify-content: space-between" class="mt-3">
                            <h3 class="mr-3">
                                ${cylinderTypes[i].weight} Kg = ${data[j].number_of_cylinders} Cylinders (${plantName})
                            </h3>
                            </div>                            
                            `)
                        }                        
                    }) 
                }
                getTotalPendingMoneyOfACustomer(customerData[0].customer_id, (err, data) => {
                    $('#market-details-customer-div').append(`
                        <div class="mt-3">
                            <h3>Pending Amount = ${data[0].total_pending_amount} Rs/-</h3>            
                        </div>                        
                    `)
                })
            })            
        }
    })

}