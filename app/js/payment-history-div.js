// function shows the payment history div
showPaymentHistoryDiv = () => {
    hideAllDivs()
    $('#view-payment-history-div').html('')
    $('#view-payment-history-div').append(`
    <div style="text-align: center;">
        <h2>View Payment History</h2>
    </div>
    <div class="mt-3" style="text-align: center;">
        <div>
            <button class="btn btn-primary" onclick="updateViewPaymentHistory('thisMonth')">This Month</button>
            <button class="btn btn-primary" onclick="updateViewPaymentHistory('fetchAll')">Fetch All</button>
        </div>
        <div class="mt-3" style="display: flex;justify-content: center;align-items: center;">

            <ul style="width: 15%;margin 8px 0px;">
                <li>
                    <input id="view-payment-history-date-checkbox" type="checkbox" class="switch" onchange="enableViewPaymentHistoryCheckbox()">
                    <label for="s1">Use Date</label>                    
                </li>
            </ul>

            <input type="date" id="view-payment-history-from" disabled>
            <input class="ml-2" type="date" id="view-payment-history-to" disabled>
            <button class="btn btn-primary ml-2" id="view-payment-history-datepicker-btn" onclick="updateViewPaymentHistory('datepicker')" disabled>Fetch</button>
        </div>                
    
    </div>
    <div class="mt-4">
        <table class="table" style="color: #ffffff;text-align: center;">
            <thead>
            <tr>
                <th scope="col">Date <span style="font-size: 13px;">(YYYY-MM-DD)</span></th>
                <th scope="col">Amount</th>
                <th scope="col">Plant Name</th>
            </tr>
            </thead>
            <tbody id="view-payment-history-table">                                          
            </tbody>
        </table>
    </div>    
    `)
    $('#view-payment-history-div').css('display', 'flex')
}

updateViewPaymentHistory = (status) => {
    $('#view-payment-history-table').html('')    
    if (status == 'thisMonth') {
        getThisMonthPaymentHistory( (err, data) => {
            generatePaymentHistoryTable(data, 'thisMonth')
        })
    }
    else if(status == 'fetchAll') {
        getAllPaymentHistory( (err, data) => {
            generatePaymentHistoryTable(data, 'fetchAll')     
        })
    }
    else if(status == 'datepicker') {
        let fromDate = $('#view-payment-history-from').val()
        let toDate = $('#view-payment-history-to').val()
        getSpecificPaymentHistory( fromDate, toDate, (err, data) => {
            generatePaymentHistoryTable(data, 'datepicker')      
        })
    }
}

generatePaymentHistoryTable = (data, mode) => {
    $('#view-payment-history-table').html('')
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
        $('#view-payment-history-table').append(`
            <tr data-plantid=${data[i].plant_id} data-toggle="modal" data-mode=${mode} data-id="${data[i].transaction_id}" data-target="#edit-payment-history-table-modal" 
            data-amount="${data[i].amount}" data-date="${d.getFullYear() + '-' + month + 
            '-' + date}" style="cursor: pointer;">                        
            <td>${d.getFullYear() + '-' + month + 
            '-' + date}</td>
            <td>${data[i].amount} Rs/-</td>
            <td id="${data[i].plant_name}-pay-histoy-row-${i}">${data[i].plant_name}</td>
            </tr>
        `)
        // capitalizing plant name in all rows
        $(`#${data[i].plant_name}-pay-histoy-row-${i}`).html(capitalizeFLetter(`${data[i].plant_name}-pay-histoy-row-${i}`))   
    }
}

$('#edit-payment-history-table-modal').on('show.bs.modal', (e) => {
    // when edit payment modal is opened
    // data from table row is passed to the modal
    let opener = e.relatedTarget
    let amount = $(opener).attr('data-amount')
    let date = $(opener).attr('data-date')
    let id = $(opener).attr('data-id')
    let mode = $(opener).attr('data-mode')
    let plantID = $(opener).attr('data-plantid')

    $('#edit-payment-history-amount').val(amount)
    $('#edit-payment-history-date').val(date)
    $('#edit-payment-history-id').attr('data-id', id)
    $('#edit-payment-history-date').prop("disabled", true)
    $('#edit-payment-history-mode').attr('data-mode', mode)
    $(`#edit-buy-history-table-modal`).attr('data-plantid', plantID)
    $(`#edit-buy-history-table-modal`).attr('data-oldamount', amount)
})

resetViewPaymentHistory = () => {
    $('#view-payment-history-date-checkbox').prop('checked', false)
    $('#view-payment-history-from').prop('disabled', true)
    $('#view-payment-history-to').prop('disabled', true)
    $('#view-payment-history-from').val('')
    $('#view-payment-history-to').val('')
    $('#view-payment-history-datepicker-btn').prop('disabled', true)
    $('#view-payment-history-table').html('')
}

enableViewPaymentHistoryCheckbox = () => {
    if($('#view-payment-history-date-checkbox').prop('checked')) {
        $('#view-payment-history-from').prop('disabled', false)
        $('#view-payment-history-to').prop('disabled', false)
        $('#view-payment-history-datepicker-btn').prop('disabled', false)
    }
    else {
        $('#view-payment-history-from').prop('disabled', true)
        $('#view-payment-history-to').prop('disabled', true)
        $('#view-payment-history-datepicker-btn').prop('disabled', true)
    }
}

resetEditPaymentHistoryModal = () => {
    $('#edit-payment-history-amount').val('')
}

updateEditPaymentHistory = () => {
    // getting data from modal that was passed to modal from row
    let plantID = $(`#edit-buy-history-table-modal`).attr('data-plantid')
    let oldAmount = $(`#edit-buy-history-table-modal`).attr('data-oldamount')
    let transactionID = $('#edit-payment-history-id').attr('data-id')    
    let mode = $('#edit-payment-history-mode').attr('data-mode')
    let newAmount = $('#edit-payment-history-amount').val()

    getTotalPlantMoney(plantID, (err, plantMoney)=>{
        if( (newAmount - oldAmount) > plantMoney) {
            let options = {
                type: 'info',
                buttons: ['Okay'],
                message: `Please pay the right amount`,
                normalizeAccessKeys: true
            }
            dialog.showMessageBox(options, i => {
                if (i == 0) {
                    $('#edit-payment-history-close-btn').click()
                    return
                }
            })
        }
        else {
            updatePlantTransaction(transactionID, newAmount, (err, res) => {
                updateViewPaymentHistory(mode)
                updateMainWindowGUI()
                $('#edit-payment-history-close-btn').click()
            })        
        }
    })

    

}