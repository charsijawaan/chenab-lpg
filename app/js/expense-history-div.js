showExpenseHistoryDiv = () => {
    hideAllDivs()
    $(`#expense-history-div`).html(``)
    $(`#expense-history-div`).append(`
        <div>
            <h2>
                Expenses History
            </h2>
        </div>
        <div class="mt-3" style="text-align: center;">
        <div>
            <button class="btn btn-primary" onclick="updateViewExpenseHistory('thisMonth')">This Month</button>
            <button class="btn btn-primary" onclick="updateViewExpenseHistory('fetchAll')">Fetch All</button>
        </div>
        <div class="mt-3" style="display: flex;justify-content: center;align-items: center;">

            <ul style="margin-right: 10px;">
                <li>
                    <input id="view-expense-history-date-checkbox" type="checkbox" class="switch" onchange="enableViewExpenseHistoryCheckbox()">
                    <label for="s1">Use Date</label>                    
                </li>
            </ul>

            <input type="date" id="view-expense-history-from" disabled>
            <input class="ml-2" type="date" id="view-expense-history-to" disabled>
            <button class="btn btn-primary ml-2" id="view-expense-history-datepicker-btn" onclick="updateViewExpenseHistory('datepicker')" disabled>Fetch</button>
        </div>                
    
    </div>
    <div class="mt-4" style="width: 100%;">
        <table class="table" style="color: #ffffff;text-align: center;">
            <thead>
            <tr>
                <th scope="col">Date <span style="font-size: 13px;">(YYYY-MM-DD)</span></th>
                <th scope="col">Expense Name</th>
                <th scope="col">Amount</th>                
            </tr>
            </thead>
            <tbody id="view-expense-history-table">                                          
            </tbody>
        </table>
    </div>    
    `)
    $(`#expense-history-div`).css('display', 'flex')
}

updateViewExpenseHistory = (status) => {
    $('#view-expense-history-table').html('')    
    if (status == 'thisMonth') {
        getThisMonthExpenseHistory( (err, data) => {
            generateExpenseHistoryTable(data, 'thisMonth')
        })
    }
    else if(status == 'fetchAll') {
        getAllExpenseHistory( (err, data) => {
            generateExpenseHistoryTable(data, 'fetchAll')     
        })
    }
    else if(status == 'datepicker') {
        let fromDate = $('#view-expense-history-from').val()
        let toDate = $('#view-expense-history-to').val()
        getSpecificExpenseHistory( fromDate, toDate, (err, data) => {
            generateExpenseHistoryTable(data, 'datepicker')      
        })
    }
}

generateExpenseHistoryTable = (data, mode) => {
    $('#view-expense-history-table').html('')
    for(let i = 0; i < data.length; i++) {
        var d = new Date(data[i].date);
        let month = String(d.getMonth() + 1)
        let date = String(d.getUTCDate())
        if(month.length == 1) {
            month = `0` + month
        }
        if(date.length == 1) {
            date = `0` + date
        }
        $('#view-expense-history-table').append(`
            <tr>                        
            <td>${d.getFullYear() + '-' + month + '-' + date}</td>
            <td>${data[i].expense_name}</td>
            <td>${data[i].expense_price} Rs/-</td>            
            </tr>
        `)
    }
}

enableViewExpenseHistoryCheckbox = () => {
    if($('#view-expense-history-date-checkbox').prop('checked')) {
        $('#view-expense-history-from').prop('disabled', false)
        $('#view-expense-history-to').prop('disabled', false)
        $('#view-expense-history-datepicker-btn').prop('disabled', false)
    }
    else {
        $('#view-expense-history-from').prop('disabled', true)
        $('#view-expense-history-to').prop('disabled', true)
        $('#view-expense-history-datepicker-btn').prop('disabled', true)
    }
}