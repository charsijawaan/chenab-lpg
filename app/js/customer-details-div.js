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
                <span class="label">Enter Customer Name</span>
                <span class="focus-bg"></span>
                </label>                
            </div>
        </div>
        <div style="text-align: center;display: flex; flex-direction: column;" id="select-customer-div-wrapper">
            <!-- html changes here while searching -->
        </div>
    </div>
    <div class="mt-3 mb-4">
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

showSaleDetails = () => {
    $(`#customer-details-table-thead`).html(``)
    $(`#customer-details-table-tbody`).html(``)
    let customerName = $(`#customer-name-field-customer-details`).val()
    if(customerName === ''){
        showMsgDialog('Enter Customer name')
        return
    }
    getCustomer(customerName, (err, customerData) => {
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
                        data-customerName=${customerName} data-saleDate=${salesDetails[i].sale_date} data-total=${salesDetails[i].total} 
                        data-profit=${salesDetails[i].profit} data-costPrice=${salesDetails[i].cost_price} 
                        data-plantID=${salesDetails[i].plant_id} data-plantName=${plantName}>

                        <td>${customerName}</td>
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
    let customerName = $(`#customer-name-field-customer-details`).val()
    if(customerName === ''){
        showMsgDialog('Enter Customer name')
        return
    }
    getCustomer(customerName, (err, customerData) => {
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
                        <td>${customerName}</td>
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
    let customerName = $(`#customer-name-field-customer-details`).val()
    if(customerName === ''){
        showMsgDialog('Enter Customer name')
        return
    }
    getCustomer(customerName, (err, customerData) => {
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
    let customerName = $(opener).attr('data-customername')
    let customerID = $(opener).attr('data-customerid')
    let salesID = $(opener).attr('data-salesid')
    let saleDate = $(opener).attr('data-saledate')
    let total = $(opener).attr('data-total')
    let profit = $(opener).attr('data-profit')
    let costPrice = $(opener).attr('data-costprice')
    let plantID = $(opener).attr('data-plantid')
    let plantName = $(opener).attr('data-plantname')
    
    getAllTypesOfCylinders((err, cylinderTypes) => {

        for(let i = 0; i < cylinderTypes.length; i++) {
            $(`#edit-sale-history-menu`).append(`
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Kg</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-kg-number-of-cylinders">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Kg Rate</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-kg-rate">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Sub Cost</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-sub-cost">
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
                $(`#edit-${salesData[i].cylinder_weight}-sub-total`).val(salesData[i].sub_total)
                $(`#edit-${salesData[i].cylinder_weight}-sub-profit`).val(salesData[i].sub_profit)
            }

            for(let i = 0; i < cylinderTypes.length; i++) {
                if($(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).val() === '') {
                    $(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).prop('disabled', true)
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
    // START CODE HERE
}