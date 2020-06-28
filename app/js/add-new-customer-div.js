showAddNewCustomerDiv = () => {
    hideAllDivs()
    $(`#add-new-customer-div`).html('')
    $(`#add-new-customer-div`).append(`
    <div style="text-align: center;">
        <h2>Add New Customer</h2>
    </div>
    <div style="text-align: center;">
            <div class="mt-2">

                <div>
                    <label for="inp" class="inp">
                    <input type="text" placeholder="&nbsp;" required id="add-new-customer-company-name-field">
                    <span class="label">Company Name</span>
                    <span class="focus-bg"></span>
                    </label>
                </div>      
                
                <div>
                    <label for="inp" class="inp">
                    <input type="text" placeholder="&nbsp;" required id="add-new-customer-customer-name-field">
                    <span class="label">Customer Name (Optional)</span>
                    <span class="focus-bg"></span>
                    </label>
                </div>                

                <div>
                    <label for="inp" class="inp">
                    <input type="number" placeholder="&nbsp;" required id="add-new-customer-phone-number-field">
                    <span class="label">Number (Optional)</span>
                    <span class="focus-bg"></span>
                    </label>
                </div>                
                
                <div>
                    <label for="inp" class="inp">
                    <input type="number" placeholder="&nbsp;" required id="add-new-customer-limit-field">
                    <span class="label">Limit (Optional)</span>
                    <span class="focus-bg"></span>
                    </label>
                </div>                
                
            </div>
            <div class="mt-3">
                <button style="width:8%" class="btn btn-primary" onclick="addNewCustomer()">Add</button>
            </div>                    
        </div>
    `)    
    $('#add-new-customer-div').css('display', 'flex')
}

addNewCustomer = () => {
    let newCompanyName = $(`#add-new-customer-company-name-field`).val()
    let newCustomerName = $(`#add-new-customer-customer-name-field`).val()
    let newPhoneNumber = $(`#add-new-customer-phone-number-field`).val()
    let newLimit = $(`#add-new-customer-limit-field`).val()

    if(newCompanyName.length < 1) {
        showMsgDialog(`Enter Company Name`)
        return
    }
    if(newCustomerName == '') {
        newCustomerName = null
    }
    if(newPhoneNumber == '') {
        newPhoneNumber = null
    }
    if(newLimit == '') {
        newLimit = 2000000
    }
    addNewCustomerInDatabase(newCompanyName.toLowerCase(), newCustomerName, newPhoneNumber, newLimit, (err)=>{
        $(`#add-new-customer-company-name-field`).val('')
        $(`#add-new-customer-customer-name-field`).val('')
        $(`#add-new-customer-phone-number-field`).val('')
        $(`#add-new-customer-limit-field`).val('')
        let options = {
            type: 'info',
            buttons: ['Okay'],
            message: `New customer has been added`,
            normalizeAccessKeys: true
        }
        dialog.showMessageBox(options, i => {
            if (i == 0) {
                return
            }
        })
    })
}