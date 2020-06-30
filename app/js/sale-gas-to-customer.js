var globalEnoughCylinders
showSaleGasToCustomerDiv = () => {
    hideAllDivs()
    $(`#sale-gas-to-customer-div`).html('')

    getAllTypesOfCylinders((err, cylinderTypes) => {
        getAllPlants((err, allPlants) => {
            $(`#sale-gas-to-customer-div`).append(`

                <div style="text-align: center;">
                    <h2>Sale Gas</h2>
                </div>
                
                <div style="text-align: center;">
                    <div class="mt-2">
                        <label for="inp" class="inp">
                        <input type="text" placeholder="&nbsp;" required id="customer-name-field-sale-gas"
                        onkeydown="getCustomersFromDatabase('customer-name-field-sale-gas', 'select-company-div-wrapper-sale-gas')">
                        <span class="label">Enter Company Name</span>
                        <span class="focus-bg"></span>
                        </label>                
                    </div>

                    <div style="text-align: center;display: flex; flex-direction: column;" id="select-company-div-wrapper-sale-gas">
                        <!-- html changes here while searching -->
                    </div>
                </div>

            `)

            // select plant portion starts here
            let str = ''
            str += `
                <center>
                    <select name="plant" id="select-plant-sale-gas-to-customer-div" onchange="updateSaleGasToCustomerGUI()">`
            for (let i = 0; i < allPlants.length; i++) {
                str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`
            }
            str += `</select>
                </center>`
            $(`#sale-gas-to-customer-div`).append(str)


            $(`#sale-gas-to-customer-div`).append(`
                <div id="sale-gas-by-plant"></div>
            `)

            updateSaleGasToCustomerGUI()

            $('#sale-gas-to-customer-div').append(`
                <center>
                    <div>
                        <button class="btn btn-primary mt-3" id="sale-gas-to-customer-btn" 
                        onclick="saleGasToCustomer()" style="width: 100px; text-align: center;">Sale</button>
                    </div>
                    <div class="mt-4">
                        <h2 id="sale-gas-total">Total = 0</h2>
                    </div>
                    <div class="mt-3">
                        <h2 id="sale-gas-profit">Profit = 0</h2>
                    </div>
                </center>
            `)
        })

    })
    $('#sale-gas-to-customer-div').css('display', 'flex')
}


updateSaleGasToCustomerGUI = () => {
    $(`#sale-gas-by-plant`).html('')
    let plantID = $(`#select-plant-sale-gas-to-customer-div`).find(':selected').val()

    getAllTypesOfCylinders((err, cylinderTypes) => {
        for (let i = 0; i < cylinderTypes.length; i++) {
            getAvailableStockByPlantID(cylinderTypes[i].weight, plantID, (err, availStock) => {
                $(`#sale-gas-by-plant`).append(`
                <div style="display: flex;justify-content: center">
                <div style="text-align: center;" style="display: flex;">
                    <div class="mt-4" style="display: flex;align-items: center;">

                        <!-- enable/disable checkbox -->
                        <ul style="margin: 8px 0px;">
                            <li>
                            <input id="${cylinderTypes[i].weight}kg-sale-gas-checkbox" type="checkbox" 
                            class="switch" onchange="handleSaleGasCheckBoxes(${cylinderTypes[i].weight})">
                            <label for="s1">${cylinderTypes[i].weight} Kg</label>
                            </li>
                        </ul>

                        <!-- select which cylinder to sale -->
                        <select id="${cylinderTypes[i].weight}kg-available-gas-rates" onchange="calculateTotalAndProfit()"></select>
                        <span class="mr-4" style="width: 150px">${cylinderTypes[i].weight} Kg</span>

                        <!-- enter sale gas rate input -->
                        <label for="inp" class="inp mr-3">
                        <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');calculateTotalAndProfit();" min="1"
                        required id="sale-gas-${cylinderTypes[i].weight}kg-gas-rate" disabled>
                        <span class="label">Enter Sale Rate</span>
                        <span class="focus-bg"></span>
                        </label>
            
                        <!-- enter number of cylinders input -->
                        <label for="inp" class="inp mr-3">
                        <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');calculateTotalAndProfit();" min="1" 
                        required id="sale-gas-${cylinderTypes[i].weight}kg-cylinders" disabled>
                        <span class="label">Number of Cylinders</span>
                        <span class="focus-bg"></span>
                        </label>
                    </div>
                                                           
                </div>
            </div>       
                `)

                getAvailableStockByPlantID(cylinderTypes[i].weight, plantID, (err, availStock) => {
                    for (let j = 0; j < availStock.length; j++) {
                        $(`#${cylinderTypes[i].weight}kg-available-gas-rates`).append(`
                            <option>${availStock[j].buy_rate}</option>  
                        `)
                    }
                })
            })
        }
    })
}


handleSaleGasCheckBoxes = (weight) => {
    calculateTotalAndProfit()
    if ($(`#${weight}kg-sale-gas-checkbox`).prop('checked')) {
        $(`#sale-gas-${weight}kg-cylinders`).prop('disabled', false)
        $(`#sale-gas-${weight}kg-gas-rate`).prop('disabled', false)
    }
    else {
        $(`#sale-gas-${weight}kg-cylinders`).prop('disabled', true)
        $(`#sale-gas-${weight}kg-gas-rate`).prop('disabled', true)
        $(`#sale-gas-${weight}kg-cylinders`).val('')
        $(`#sale-gas-${weight}kg-gas-rate`).val('')
    }
}

calculateTotalAndProfit = () => {
    getAllTypesOfCylinders((err, cylinderTypes) => {
        let total = 0
        let profit = 0
        let costPrice = 0
        for (let i = 0; i < cylinderTypes.length; i++) {
            if (!($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked')))
                continue
            total += Number($(`#sale-gas-${cylinderTypes[i].weight}kg-gas-rate`).val()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
            costPrice += Number($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
        }
        profit = total - costPrice
        $(`#sale-gas-total`).html(`
            Total = ${total} Rs/-
        `)
        $(`#sale-gas-profit`).html(`
            Profit = ${profit} Rs/-
        `)
    })
}

saleGasToCustomer = () => {
    let customerName = $('#customer-name-field-sale-gas').val()
    let plantID = $('#select-plant-sale-gas-to-customer-div').children('option:selected').val()

    if (checkCustomerNameField(customerName)) {

        getCustomer(customerName, (err, customerData) => {

            if (checkCustomerNameInDatabase(customerData)) {

                getAllTypesOfCylinders((err, cylinderTypes) => {

                    if (checkSaleGasCheckboxes(cylinderTypes)) {
                                            
                        // checking if there are enough cylinders
                        checkIfEnoughCylinders(cylinderTypes, plantID)                        
                        setTimeout(()=>{
                            if (globalEnoughCylinders) {
                                let total = 0
                                let profit = 0
                                let costPrice = 0
                                let date = new Date()
    
                                for (let i = 0; i < cylinderTypes.length; i++) {
                                    if (!($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked')))
                                        continue
                                    total += Number($(`#sale-gas-${cylinderTypes[i].weight}kg-gas-rate`).val()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                    costPrice += Number($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                }
                                profit = total - costPrice
    
                                insertIntoSales(customerData[0].customer_id, date.getTime(), total, profit, costPrice, plantID, (err) => {
                                    getLastSalesID((err, lastRow) => {
                                        for (let i = 0; i < cylinderTypes.length; i++) {
                                            if (!($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked'))) {
                                                continue
                                            }                                        
                                            let numberOfCylinders = Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                            let subTotal = Number($(`#sale-gas-${cylinderTypes[i].weight}kg-gas-rate`).val()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                            let subCost = Number($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text()) * Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val())
                                            let subProfit = subTotal - subCost
                                            insertIntoSalesDetails(lastRow.sales_id, cylinderTypes[i].weight,
                                                 numberOfCylinders, subTotal, subCost, subProfit, plantID, customerData[0].customer_id, (err) => {                                                    
                                                updateMainWindowGUI()
                                            })                                        
                                        }
                                        showMsgDialog('Cylinder sold to customer')
                                        resetSaleGasDiv()
                                        updateMainWindowGUI()
                                    })
    
                                })
                            }                
                            else {
                                showMsgDialog('Not enough cylinders available to sale')
                            }
                        }, 500)                       
                    }

                })
            }


        })
    }
}

resetSaleGasDiv = () => {
    $(`#sale-gas-to-customer-div`).html('')
}

checkCustomerNameField = (customerName) => {
    if (customerName === '') {
        showMsgDialog('Enter customer name')
        return false
    }
    return true
}

checkCustomerNameInDatabase = (customerData) => {
    if (customerData.length < 1) {
        showMsgDialog('No customer with this name was found')
        return false
    }
    return true
}

checkSaleGasCheckboxes = (cylinderTypes) => {
    let checked = false
    for (let i = 0; i < cylinderTypes.length; i++) {
        if ($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked')) {
            checked = true
        }
    }
    if (!checked) {
        showMsgDialog('Please turn on at least one checkbox')
        return false
    }
    return true
}

checkIfEnoughCylinders = (cylinderTypes, plantID) => {
    let enoughCylinders = true
    for (let i = 0; i < cylinderTypes.length; i++) {

        // skip where checkbox is disabled
        if (!($(`#${cylinderTypes[i].weight}kg-sale-gas-checkbox`).prop('checked')))
            continue
        // skip the cylinders where buy rate is not available
        if ($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text() === '')
            continue

        getAvailableStockByPlantIDandBuyRate(cylinderTypes[i].weight, plantID, Number($(`#${cylinderTypes[i].weight}kg-available-gas-rates`).find(":selected").text()), (err, availStock) => {
            if (Number($(`#sale-gas-${cylinderTypes[i].weight}kg-cylinders`).val()) > availStock[0].number_of_cylinders) {
                enoughCylinders = false
            }                                
        })
    }
    setTimeout(()=>{
        globalEnoughCylinders = enoughCylinders
    }, 500)
}