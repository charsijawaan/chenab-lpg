showAddExpenseDiv = () => {
    hideAllDivs()
    $(`#add-expenses-div`).html(``)
    $(`#add-expenses-div`).append(`
        <div>
            <h2>Add Expense</h2>
        </div>

        <div style="text-align: center;">
            <div class="mt-2">

                <div>
                    <label for="inp" class="inp">
                    <input type="text" placeholder="&nbsp;" required id="expense-name-field">
                    <span class="label">Expense Name</span>
                    <span class="focus-bg"></span>
                    </label>
                </div>      
                
                <div>
                    <label for="inp" class="inp">
                    <input type="number" placeholder="&nbsp;" required id="expense-price-field">
                    <span class="label">Price</span>
                    <span class="focus-bg"></span>
                    </label>
                </div>                
                
            </div>
            <div class="mt-3">
                <button class="btn btn-primary" onclick="addExpense()">Add</button>
            </div>                    
        </div>
    `)
    $(`#add-expenses-div`).css('display', 'flex')
}

addExpense = () => {
    let exName = $(`#expense-name-field`).val()
    let exPrice = $(`#expense-price-field`).val()
    let date = new Date()

    if(exName === '' || exPrice === '') {
        showMsgDialog('Fill Both Fields')
    }   
    else {
        insertIntoExpenses(exName, exPrice, date.getTime(), (err, res) => {
            showMsgDialog(`Expense Added`)        
            resetAddExpensesDiv()
            updateMainWindowGUI()
        })
    }
}

resetAddExpensesDiv = () => {
    $(`#expense-name-field`).val(``)
    $(`#expense-price-field`).val(``)
}