showViewBuyHistoryDiv = () => {
    hideAllDivs()
    $('#view-buy-history-div').html('')
    $('#view-buy-history-div').append(`
    <div style="text-align: center;">
        <h2>View Buy History</h2>
    </div>            
    <div class="mt-3" style="text-align: center;">
        <div>
            <button class="btn btn-primary" onclick="updateViewBuyHistory('thisMonth')">This Month</button>
            <button class="btn btn-primary" onclick="updateViewBuyHistory('fetchAll')">Fetch All</button>
        </div>
        <div class="mt-3" style="display: flex;justify-content: center;align-items: center;">
            <ul style="width: 15%;margin 8px 0px;">
                <li>
                    <input id="view-buy-history-date-checkbox" type="checkbox" class="switch" onchange="enablePaymentHistoryDates();">
                    <label for="s1">Use Date</label>                    
                </li>
            </ul>
            <input type="date" id="view-buy-history-from" disabled>
            <input type="date" class="ml-2" id="view-buy-history-to" disabled>
            <button class="btn btn-primary ml-2" id="view-buy-history-datepicker-btn" onclick="updateViewBuyHistory('datepicker')" disabled>Fetch</button>
        </div>                
    
    </div>
    <div class="mt-4">
        <table class="table" style="color: #ffffff;text-align: center;">
            <thead>
                <tr>
                    <th scope="col">Date <span style="font-size: 13px;">(YYYY-MM-DD)</span></th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Plant</th>
                </tr>
            </thead>
            <tbody id="view-buy-history-table">                                       
        </tbody>
      </table>
    </div>          
    `)
    $('#view-buy-history-div').css('display', 'flex')
}

// this function in turns call the below function to generate tables dunamilcally
updateViewBuyHistory = (status) => {
    $('#view-buy-history-table').html('')    
    if (status == 'thisMonth') {
        getThisMonthBuyHistory( (err, data) => {
            generateBuyHistoryTable(data, 'thisMonth')
        })
    }
    else if(status == 'fetchAll') {
        getAllBuyHistory( (err, allBuyHistory) => {         
            generateBuyHistoryTable(allBuyHistory, 'fetchAll')
        })
    }
    else if(status == 'datepicker') {
        let fromDate = $('#view-buy-history-from').val()
        let toDate = $('#view-buy-history-to').val()
        getSpecificBuyHistory( fromDate, toDate, (err, data) => {
            generateBuyHistoryTable(data, 'datepicker')        
        })
    }
}

generateBuyHistoryTable = (buyHistory, mode) => {
    $('#view-buy-history-table').html('')
    if (buyHistory.length == 0) {
        return
    }
    let row
    for(let i = 0; i < buyHistory.length; i++) {        
        var d = new Date(buyHistory[i].date);
        let month = String(d.getMonth() + 1)
        let date = String(d.getUTCDate())
        let plantName = ''
        if(month.length == 1) {
            month = `0` + month
        }
        if(date.length == 1) {
            date = `0` + date
        }
        if(buyHistory[i].plant_id === 1) {
            plantName = 'Chenab'
        }
        else {
            plantName = 'Super'
        }
        row += `
        <tr data-id=${buyHistory[i].fillings_id} style="cursor: pointer;" data-toggle="modal" data-mode=${mode} data-target="#edit-buy-history-table-modal"
            data-date=${d.getFullYear() + '-' + month + '-' + date}
        >
            <td>${d.getFullYear() + '-' + month + '-' + date}</td>
            <td>${buyHistory[i].total_price}</td>
            <td>${plantName}</td>
        </tr>
        `
    }
    $('#view-buy-history-table').append(row)
}

// add info to the modal dynamically
$('#edit-buy-history-table-modal').on('show.bs.modal', (e) => {
    $(`#edit-buy-history-menu`).html('')
    let opener = e.relatedTarget
    let date = $(opener).attr('data-date')
    let mode = $(opener).attr('data-mode')
    let id = $(opener).attr('data-id')

    $(`#edit-buy-history-id`).attr("data-id", id)

    $('#edit-buy-history-mode').attr('data-mode', mode)
    
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        $(`#edit-buy-history-menu`).append(`
            <div style="display: flex;">
                <p class="mr-3">Date</p>             
                <input type="date" id="edit-buy-history-date" disabled>
            </div>                      
        `)
        for(let i = 0; i < cylinderTypes.length; i++) {
            $(`#edit-buy-history-menu`).append(`
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Kg</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-kg-number-of-cylinders">
            </div>
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">${cylinderTypes[i].weight} Kg Rate</p>
                <input type="number" id="edit-${cylinderTypes[i].weight}-kg-rate">
            </div>
            `)
        }
        $(`#edit-buy-history-menu`).append(`
            <div style="display: flex;" class="mt-2">
                <p class="mr-3">Total</p>
                <input type="number" id="edit-buy-history-total" disabled>
            </div>      
        `)
        getFIllingsDetailsByID(id, (err, data) => {
            $(`#edit-buy-history-date`).val(date)            
            for(let i = 0; i < data.length; i++) {
                $(`#edit-${data[i].cylinder_weight}-kg-number-of-cylinders`).val(data[i].number_of_cylinders)
                $(`#edit-${data[i].cylinder_weight}-kg-rate`).val(data[i].gas_rate)
                getFillingsTotalPriceByID(id, (err, total)=>{
                    $(`#edit-buy-history-total`).val(total)
                })
            }
            for(let i = 0; i < cylinderTypes.length; i++) {
                if($(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).val() === '') {
                    $(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).prop('disabled', true)
                }
                if($(`#edit-${cylinderTypes[i].weight}-kg-rate`).val() === '') {
                    $(`#edit-${cylinderTypes[i].weight}-kg-rate`).prop('disabled', true)
                }
            }
        })
    })    
})

enablePaymentHistoryDates = () => {
    if($('#view-buy-history-date-checkbox').prop('checked')) {
        $('#view-buy-history-from').prop('disabled', false)
        $('#view-buy-history-to').prop('disabled', false)
        $('#view-buy-history-datepicker-btn').prop('disabled', false)
    }
    else {
        $('#view-buy-history-from').prop('disabled', true)
        $('#view-buy-history-to').prop('disabled', true)
        $('#view-buy-history-datepicker-btn').prop('disabled', true)   
    }
}

updateEditBuyHistory = () => {
    let id = $('#edit-buy-history-id').attr('data-id')
    let mode = $('#edit-buy-history-mode').attr('data-mode')
    getAllTypesOfCylinders((err, cylinderTypes) => {        
        for(let i = 0; i < cylinderTypes.length; i++) {
            let numberOfCylinders = $(`#edit-${cylinderTypes[i].weight}-kg-number-of-cylinders`).val()
            let gasRate = $(`#edit-${cylinderTypes[i].weight}-kg-rate`).val()
            let subTotal = (Number(numberOfCylinders) * Number(gasRate))
            updateFillingsDetails(id, gasRate, numberOfCylinders, subTotal, cylinderTypes[i].weight, (err)=>{
                updateFillings(id, (err) => {
                    updateViewBuyHistory(mode)
                    updateMainWindowGUI()
                })
                $('#edit-buy-history-close-btn').click()
            })
        }
    })
}