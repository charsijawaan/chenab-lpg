showAddNewCustomerDiv = () => {
    hideAllDivs()
    $(`#add-new-customer-div`).html('')
    $(`#add-new-customer-div`).append(`
    <div style="text-align: center;">
        <h2>Add New Customer</h2>
    </div>
    <div style="text-align: center;">
            <div class="mt-2">
                <label for="inp" class="inp">
                <input type="text" placeholder="&nbsp;" required id="add-new-customer-field">
                <span class="label">Enter Customer Name</span>
                <span class="focus-bg"></span>
                </label>
                
            </div>
            <div class="mt-3">
                <button style="width:8%" class="btn btn-primary" onclick="addNewCustomer()">Add</button>
            </div>                    
        </div>
    `)    
    $('#add-new-customer-div').css('display', 'flex')
}

addNewCustomer = () => {
    let newCustomerName = $(`#add-new-customer-field`).val()
    addNewCustomerInDatabase(newCustomerName.toLowerCase(), (err)=>{
        $(`#add-new-customer-field`).val('')
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