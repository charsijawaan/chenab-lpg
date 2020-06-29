showCustomerDetailsDiv = () => {
    hideAllDivs()
    resetCustomerDetailsDiv()
    $(`#customer-details-div`).append(`
        <div>
            <h2>Customer Details</h2>
        </div>
        <div>
        <div style="text-align: center;">
            <div class="mt-2">
                <label for="inp" class="inp">
                <input type="text" placeholder="&nbsp;" required id="customer-name-field-customer-details"
                 onkeydown="getCustomersFromDatabase('customer-name-field-customer-details')">
                <span class="label">Enter Company Name</span>
                <span class="focus-bg"></span>
                </label>                
            </div>
        </div>
        <div style="text-align: center;display: flex; flex-direction: column;" id="select-company-div-wrapper">
            <!-- html changes here while searching -->
        </div>
    </div>
    <div class="mt-3 mb-4">
        <button class="btn btn-primary" type="button" style="text-align: center;" onclick="showCompanyDetails()" data-toggle="modal" data-target="company-details-modal">Comapny Details</button>
        <button class="btn btn-primary" style="text-align: center;" onclick="showSaleDetails()">Sale Details</button>
        <button class="btn btn-primary" style="text-align: center;" onclick="showPaymentDetails()">Payment Details</button>
        <button class="btn btn-primary" style="text-align: center;" onclick="showCylinderDetails()">Cylinder Details</button>
    </div>
    <div style="width: 100%;">
        <table class="table" style="color: #ffffff;text-align: center;">
            <thead id="customer-details-table-thead">
            </thead>
            <tbody id="customer-details-table-tbody">                                          
            </tbody>
    </table>
    </div>
    `)
    $(`#customer-details-div`).css('display', 'flex')
}

resetCustomerDetailsDiv = () => {
    $(`#customer-details-div`).html(``)
}

showCompanyDetails = () => {
    $(`#customer-details-table-thead`).html(``)
    $(`#customer-details-table-tbody`).html(``)
    let companyName = $(`#customer-name-field-customer-details`).val()
    if(companyName === ''){
        showMsgDialog('Enter Customer name')
        return
    }
    getCustomer(companyName, (err, customerData) => {
        if(customerData.length < 1) {
            showMsgDialog('No customer with this name was found')
            return
        }
        $(`#company-details-menu`).html(``)
        for(let i = 0; i < customerData.length; i++) {
            if(customerData[0].customer_name === null) {
                customerData[0].customer_name = ''
            }
            if(customerData[0].phone_number === null) {
                customerData[0].phone_number = ''
            }
            $(`#company-details-menu`).append(`
                <div style="display: flex;" class="mt-2">
                    <p class="mr-3">Company Name</p>
                    <input type="text" value="${customerData[0].company_name}">
                </div>
                <div style="display: flex;" class="mt-2">
                    <p class="mr-3">Customer Name</p>
                    <input type="text" value="${customerData[0].customer_name}">
                </div>
                <div style="display: flex;" class="mt-2">
                    <p class="mr-3">Phone Number</p>
                    <input type="number" value="${customerData[0].phone_number}">
                </div>
                <div style="display: flex;" class="mt-2">
                    <p class="mr-3">Limit</p>
                    <input type="number" value="${customerData[0].limit}">
                </div>
            `)
        }
        $('#company-details-modal').modal('show')
    })
}

showSaleDetails = () => {
    $(`#customer-details-table-thead`).html(``)
    $(`#customer-details-table-tbody`).html(``)
    let companyName = $(`#customer-name-field-customer-details`).val()
    if(companyName === ''){
        showMsgDialog('Enter Customer name')
        return
    }
    getCustomer(companyName, (err, customerData) => {
        if(customerData.length < 1) {
            showMsgDialog('No customer with this name was found')
            return
        }
        $(`#customer-details-table-thead`).append(`
            <tr>
                <th scope="col">Customer Name</th>
                <th scope="col">Date</th>
                <th scope="col">Total</th>
                <th scope="col">Profit</th>
                <th scope="col">Cost Price</th>
                <th scope="col">Plant</th>
            </tr>
        `)
        getSalesByCustomer(customerData[0].customer_id, (err, salesDetails)=>{
            for(let i = 0; i < salesDetails.length; i++) {
                let plantName
                if(salesDetails[i].plant_id == 1) {
                    plantName = 'Chenab'
                }
                else {
                    plantName = 'Super'
                }
                $(`#customer-details-table-tbody`).append(`
                    <tr style="cursor: pointer;" data-toggle="modal" data-target="#edit-sale-history-table-modal" 
                        data-salesid=${salesDetails[i].sales_id} data-customerid=${customerData[0].customer_id} 
                        data-companyname=${companyName} data-saleDate=${salesDetails[i].sale_date} data-total=${salesDetails[i].total} 
                        data-profit=${salesDetails[i].profit} data-costPrice=${salesDetails[i].cost_price} 
                        data-plantID=${salesDetails[i].plant_id} data-plantName=${plantName}>

                        <td>${companyName}</td>
                        <td>${salesDetails[i].sale_date}</td>
                        <td>${salesDetails[i].total}</td>
                        <td>${salesDetails[i].profit}</td>
                        <td>${salesDetails[i].cost_price}</td>
                        <td>${plantName}</td>
                    </tr>
                `)
            }
        })
    })
}

showPaymentDetails = () => {
    $(`#customer-details-table-thead`).html(``)
    $(`#customer-details-table-tbody`).html(``)
    let companyName = $(`#customer-name-field-customer-details`).val()
    if(companyName === ''){
        showMsgDialog('Enter Customer name')
        return
    }
    getCustomer(companyName, (err, customerData) => {
        if(customerData.length < 1) {
            showMsgDialog('No customer with this name was found')
            return
        }
        $(`#customer-details-table-thead`).append(`
            <tr>
                <th scope="col">Customer Name</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
            </tr>
        `)
        getCustomerTransactionsByCustomer(customerData[0].customer_id, (err, transactionsData)=>{
            for(let i = 0; i < transactionsData.length; i++) {
                $(`#customer-details-table-tbody`).append(`
                    <tr style="cursor: pointer;">
                        <td>${companyName}</td>
                        <td>${transactionsData[i].transaction_date}</td>
                        <td>${transactionsData[i].amount}</td>
                    </tr>
                `)
            }
        })
    })
}

showCylinderDetails = () => {
    $(`#customer-details-table-thead`).html(``)
    $(`#customer-details-table-tbody`).html(``)
    let companyName = $(`#customer-name-field-customer-details`).val()
    if(companyName === ''){
        showMsgDialog('Enter Customer name')
        return
    }
    getCustomer(companyName, (err, customerData) => {
        if(customerData.length < 1) {
            showMsgDialog('No customer with this name was found')
            return
        }
        $(`#customer-details-table-thead`).append(`
            <tr>
                <th scope="col">Customer Name</th>
                <th scope="col">Date</th>
                <th scope="col">Cylinder Weight</th>
                <th scope="col">Number of cylinders</th>
            </tr>
        `)
    })
}

$('#edit-sale-history-table-modal').on('show.bs.modal', (e) => {
    $(`#edit-sale-history-menu`).html('')
    let opener = e.relatedTarget
    let companyName = $(opener).attr('data-companyname')
    let customerID = $(opener).attr('data-customerid')
    let salesID = $(opener).attr('data-salesid')
    let saleDate = $(opener).attr('data-saledate')
    let total = $(opener).attr('data-total')
    let profit = $(opener).attr('data-profit')
    let costPrice = $(opener).attr('data-costprice')
    let plantID = $(opener).attr('data-plantid')
    let plantName = $(opener).attr('data-plantname')

    $(`#edit-sale-history-table-modal`).attr('sales-id', salesID)
    $(`#edit-sale-history-table-modal`).attr('customer-id', customerID)
    
    getAllTypesOfCylinders((err, cylinderTypes) => {

        for(let i = 0; i < cylinderTypes.length; i++) {
            $(`#edit-sale-history-menu`).append(`
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Kg</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-kg-number-of-cylinders" 
                oninput="validity.valid||(value='');numberOfCylindersValidation(this,${cylinderTypes[i].weight},${plantID}, ${costPrice});">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Kg Buy Rate</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-kg-rate">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Sub Cost</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-sub-cost">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Sub Sale Rate/Cylinder</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-sub-sale-rate-per-cylinder" oninput="rateFieldValidation(this,${cylinderTypes[i].weight},${plantID}, ${costPrice})">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Sub Total</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-sub-total">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Sub Profit</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-sub-profit">
            </div>
            `)            
        }        

        getSalesDetailsBySalesID(salesID, (err, salesData) => {
            for(let i = 0; i < salesData.length; i++) {
                $(`#edit-${salesData[i].cylinder_weight}-kg-number-of-cylinders`).val(salesData[i].number_of_cylinders)
                $(`#edit-${salesData[i].cylinder_weight}-kg-rate`).val((salesData[i].sub_cost / salesData[i].number_of_cylinders))
                $(`#edit-${salesData[i].cylinder_weight}-sub-cost`).val(salesData[i].sub_cost)
                $(`#edit-${salesData[i].cylinder_weight}-sub-sale-rate-per-cylinder`).val((salesData[i].sub_total / salesData[i].number_of_cylinders))
                $(`#edit-${salesData[i].cylinder_weight}-sub-total`).val(salesData[i].sub_total)
                $(`#edit-${salesData[i].cylinder_weight}-sub-profit`).val(salesData[i].sub_profit)
                $(`#edit-sale-history-table-modal`).attr(`old-number-of-cylinders-${salesData[i].cylinder_weight}`, salesData[i].number_of_cylinders)
            }

            for(let i = 0; i < cylinderTypes.length; i++) {
                if($(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).val() === '') {
                    $(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).prop('disabled', true)
                }
                if($(`#edit-${cylinderTypes[i].weight}-sub-sale-rate-per-cylinder`).val() === ``) {
                    $(`#edit-${cylinderTypes[i].weight}-sub-sale-rate-per-cylinder`).prop('disabled', true)
                }
                $(`#edit-${cylinderTypes[i].weight}-kg-rate`).prop('disabled', true)
                $(`#edit-${cylinderTypes[i].weight}-sub-cost`).prop('disabled', true)
                $(`#edit-${cylinderTypes[i].weight}-sub-total`).prop('disabled', true)
                $(`#edit-${cylinderTypes[i].weight}-sub-profit`).prop('disabled', true)
            }
        })
    })        
})

updateEditSaleHistory = () => {
    let salesID = $('#edit-sale-history-table-modal').attr('sales-id')
    let customerID = $(`#edit-sale-history-table-modal`).attr('customer-id')

    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            let oldNumberOfCylinders = $(`#edit-sale-history-table-modal`).attr(`old-number-of-cylinders-${cylinderTypes[i].weight}`)
            let subCostPrice = $(`#edit-${cylinderTypes[i].weight}-sub-cost`).val()
            
            let singleCylinderCostPrice = (subCostPrice / oldNumberOfCylinders)

            let newNumberOfCylinders = $(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).val()
            let newSaleRatePerCylinder = $(`#edit-${cylinderTypes[i].weight}-sub-sale-rate-per-cylinder`).val()
            
            let newSubTotal = newNumberOfCylinders * newSaleRatePerCylinder
            let newSubProfit = newSubTotal - (newNumberOfCylinders * singleCylinderCostPrice)

            let newSubCost = newNumberOfCylinders * singleCylinderCostPrice
            

            updateSalesDetails(salesID, newNumberOfCylinders, newSubTotal, newSubProfit, customerID, cylinderTypes[i].weight, newSubCost, ()=>{
                updateMainWindowGUI()
            })            
        }
        $('#edit-sale-history-close-btn').click()
    })
}

numberOfCylindersValidation = (field, cylinderWeight, plantID, costPrice) => {
    let numberOfCylinders = Number($(`#edit-sale-history-table-modal`).attr(`old-number-of-cylinders-${cylinderWeight}`))
    getAvailableStockByPlantIDandBuyRate(cylinderWeight, plantID, (costPrice / numberOfCylinders), (err, stock) => {
        if(Number(field.value) < 1) {
            field.value = 1
        }
        if(Number(field.value) > stock[0].number_of_cylinders + numberOfCylinders) {
            field.value = 1
        }    
    })
}

rateFieldValidation = (field, cylinderWeight, plantID, costPrice) => {
    let numberOfCylinders = Number($(`#edit-sale-history-table-modal`).attr(`old-number-of-cylinders-${cylinderWeight}`))
    getAvailableStockByPlantIDandBuyRate(cylinderWeight, plantID, (costPrice / numberOfCylinders), (err, stock) => {
        if(Number(field.value) < stock[0].buy_rate) {
            field.value = stock[0].buy_rate
        }
    })
}