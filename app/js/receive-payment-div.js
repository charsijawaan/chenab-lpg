showReceivePaymentDiv = () => {
    hideAllDivs()
    resetReceivePaymentDiv()
    $(`#receive-payment-div`).append(`
        <div>
            <h2>Receive Payment</h2>
        </div>
        <div>
            <div style="text-align: center;">
                <div class="mt-2">
                    <label for="inp" class="inp">
                    <input type="text" placeholder="&nbsp;" required id="customer-name-field-receive-payment"
                    onkeydown="getCustomersFromDatabase('customer-name-field-receive-payment', 'select-company-div-wrapper-receive-payment')">
                    <span class="label">Enter Company Name</span>
                    <span class="focus-bg"></span>
                    </label>                
                </div>
            </div>
            <div style="text-align: center;display: flex; flex-direction: column;" id="select-company-div-wrapper-receive-payment">
                <!-- html changes here while searching -->
            </div>
        </div>
        <div class="mt-3 mb-4">
            <button class="btn btn-primary" style="text-align: center;" onclick="receivePaymentSearchButton()">Search</button>
        </div>
        <div id="receive-payment-customer-details-div" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
        </div>
    `)
    $('#receive-payment-div').css('display', 'flex')
}

resetReceivePaymentDiv = () => {
    $(`#receive-payment-div`).html(``)
}

receivePaymentSearchButton = () => {
    $('#receive-payment-customer-details-div').html('')
    let companyName = $('#customer-name-field-receive-payment').val()
    if(companyName === '') {
        showMsgDialog('Enter customer name')
    }
    getCustomer(companyName, (err, customerData) => {
        if(customerData.length < 1) {
            showMsgDialog('No customer with this name was found')
            return
        }
        else {                
            getTotalPendingMoneyOfACustomer(customerData[0].customer_id, (err, data) => {
                $('#receive-payment-customer-details-div').append(`
                    <div class="mt-3">
                        <h3>Pending Amount = ${data[0].total_pending_amount} Rs/-</h3>            
                    </div>
                    <div class="mt-2">
                        <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');" 
                        min="1" max="${data[0].total_pending_amount}" id="receive-payment-field">
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary" onclick="receivePayment()">Receive</button>
                    </div>                 
                `)
            })        
        }
    })
}

receivePayment = () => {
    let amount = $(`#receive-payment-field`).val()
    let customerName = $('#customer-name-field-receive-payment').val()
    if(amount === '') {
        showMsgDialog('Enter amount')
        return
    }
    else {
        getCustomer(customerName, (err, customerData) => {
            if(customerData.length < 1) {
                showMsgDialog('No customer with this name was found')
                return
            }
            else {    
                let date = new Date()            
                receivePaymentFromCustomer(customerData[0].customer_id, customerName, amount, date.getTime(), (err) => {
                    showMsgDialog('Payment Received')
                    resetReceivePaymentDiv()
                    updateMainWindowGUI()
                })     
            }
        })
    }
    
}