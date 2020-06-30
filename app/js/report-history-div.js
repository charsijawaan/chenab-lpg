showReportHistoryDiv = () => {
    hideAllDivs()
    $(`#report-history-div`).html(``)
    $(`#report-history-div`).append(`
        <div>
            <h2>Report</h2>
        </div>

        <div class="mt-3" style="text-align: center;">
        <div>
            <button class="btn btn-primary" onclick="updateViewReportHistory('thisMonth')">This Month</button>
            <button class="btn btn-primary" onclick="updateViewReportHistory('fetchAll')">Fetch All</button>
        </div>
        <div class="mt-3" style="display: flex;justify-content: center;align-items: center;">
            <ul style="margin-right: 10px;">
                <li>
                    <input id="view-report-history-date-checkbox" type="checkbox" class="switch" onchange="enableReportHistoryDates();">
                    <label for="s1">Use Date</label>                    
                </li>
            </ul>
            <input type="date" id="view-report-history-from" disabled>
            <input type="date" class="ml-2" id="view-report-history-to" disabled>
            <button class="btn btn-primary ml-2" id="view-report-history-datepicker-btn" onclick="updateViewReportHistory('datepicker')" disabled>Fetch</button>
        </div>                
    
    </div>
    <div id="report" class="mt-3">
    </div>
    `)
    $(`#report-history-div`).css('display', 'flex')
}


updateViewReportHistory = (status) => {
    $('#report').html('')    
    if (status == 'thisMonth') {
        getThisMonthSaleDetails((err, saleDetails) => {
            let totalSalePrice = 0
            let kg11Sold = 0
            let kg15Sold = 0
            let kg45Sold = 0

            let totalFillingsPrice = 0
            let kg11Fill = 0
            let kg15Fill = 0
            let kg45Fill = 0

            let expensesPrice = 0

            let paymentRec = 0

            let netProfit

            for(let i = 0; i < saleDetails.length; i++) {
                totalSalePrice += saleDetails[i].sub_total
                if(saleDetails[i].cylinder_weight === 11) {
                    kg11Sold += saleDetails[i].number_of_cylinders
                }
                else if(saleDetails[i].cylinder_weight === 15) {
                    kg15Sold += saleDetails[i].number_of_cylinders
                }
                else {
                    kg45Sold += saleDetails[i].number_of_cylinders
                }
            }

            getThisMonthTotalExpenses((err, expenses)=>{
                expensesPrice += expenses.total_expenses

                getThisMonthFillingsPrice((err, fillingsData)=>{
                    for(let i = 0; i < fillingsData.length; i++) {
                        totalFillingsPrice += fillingsData[i].total_price
                        if(fillingsData[i].cylinder_weight === 11) {
                            kg11Fill += fillingsData[i].number_of_cylinders
                        }
                        else if(fillingsData[i].cylinder_weight === 15) {
                            kg15Fill += fillingsData[i].number_of_cylinders
                        }
                        else {
                            kg45Fill += fillingsData[i].number_of_cylinders
                        }
                    }

                    getThisMonthPaymentReceived((err, paymentReceived)=>{
                        paymentRec += paymentReceived.amount

                        setTimeout(()=>{
                            netProfit = totalSalePrice - totalFillingsPrice - expensesPrice
                            $(`#report`).append(`
                            <div class="mt-3">
                                <p>11 Kg from Plant = ${kg11Fill}</p>
                                <p>15 Kg from Plant = ${kg15Fill}</p>
                                <p>45 Kg from Plant = ${kg45Fill}</p>                                
                            </div>
                            
                            <div class="mt-3">
                                <p style="margin-top: 40px">11 Kg sold = ${kg11Sold}</p>
                                <p>15 Kg sold = ${kg15Sold}</p>
                                <p>45 Kg sold = ${kg45Sold}</p>
                            </div>

                            <div class="mt-3">
                                <p style="margin-top: 40px">Gas bought = ${totalFillingsPrice}</p>
                                <p>Sold = ${totalSalePrice}</p>
                                <p>Payment Received = ${paymentRec}</p>
                                <p>Expenses = ${expensesPrice}</p>                                
                                <p>Profit = ${netProfit}</p>                        
                            </div>                                    
                            `)
                        }, 1000)                        
                    })                    
                })
                
            })

        })
    }
    else if(status == 'fetchAll') {
        getAllSaleDetails((err, saleDetails) => {
            let totalSalePrice = 0
            let kg11Sold = 0
            let kg15Sold = 0
            let kg45Sold = 0

            let totalFillingsPrice = 0
            let kg11Fill = 0
            let kg15Fill = 0
            let kg45Fill = 0

            let expensesPrice = 0

            let paymentRec = 0

            let netProfit

            for(let i = 0; i < saleDetails.length; i++) {
                totalSalePrice += saleDetails[i].sub_total
                if(saleDetails[i].cylinder_weight === 11) {
                    kg11Sold += saleDetails[i].number_of_cylinders
                }
                else if(saleDetails[i].cylinder_weight === 15) {
                    kg15Sold += saleDetails[i].number_of_cylinders
                }
                else {
                    kg45Sold += saleDetails[i].number_of_cylinders
                }
            }

            getAllTotalExpenses((err, expenses)=>{
                expensesPrice += expenses.total_expenses

                getAllFillingsPrice((err, fillingsData)=>{
                    for(let i = 0; i < fillingsData.length; i++) {
                        totalFillingsPrice += fillingsData[i].total_price
                        if(fillingsData[i].cylinder_weight === 11) {
                            kg11Fill += fillingsData[i].number_of_cylinders
                        }
                        else if(fillingsData[i].cylinder_weight === 15) {
                            kg15Fill += fillingsData[i].number_of_cylinders
                        }
                        else {
                            kg45Fill += fillingsData[i].number_of_cylinders
                        }
                    }

                    getAllPaymentReceived((err, paymentReceived)=>{
                        paymentRec += paymentReceived.amount

                        setTimeout(()=>{
                            netProfit = totalSalePrice - totalFillingsPrice - expensesPrice
                            $(`#report`).append(`
                            <div class="mt-3">
                                <p>11 Kg from Plant = ${kg11Fill}</p>
                                <p>15 Kg from Plant = ${kg15Fill}</p>
                                <p>45 Kg from Plant = ${kg45Fill}</p>                                
                            </div>
                            
                            <div class="mt-3">
                                <p style="margin-top: 40px">11 Kg sold = ${kg11Sold}</p>
                                <p>15 Kg sold = ${kg15Sold}</p>
                                <p>45 Kg sold = ${kg45Sold}</p>
                            </div>

                            <div class="mt-3">
                                <p style="margin-top: 40px">Gas bought = ${totalFillingsPrice}</p>
                                <p>Sold = ${totalSalePrice}</p>
                                <p>Payment Received = ${paymentRec}</p>
                                <p>Expenses = ${expensesPrice}</p>                                
                                <p>Profit = ${netProfit}</p>                        
                            </div>                                    
                            `)
                        }, 1000)                        
                    })                    
                })
                
            })

        })
    }
    else if(status == 'datepicker') {
        let fromDate = $('#view-report-history-from').val()
        let toDate = $('#view-report-history-to').val()
    }
}

enableReportHistoryDates = () => {
    if($('#view-report-history-date-checkbox').prop('checked')) {
        $('#view-report-history-from').prop('disabled', false)
        $('#view-report-history-to').prop('disabled', false)
        $('#view-report-history-datepicker-btn').prop('disabled', false)
    }
    else {
        $('#view-report-history-from').prop('disabled', true)
        $('#view-report-history-to').prop('disabled', true)
        $('#view-report-history-datepicker-btn').prop('disabled', true)   
    }
}