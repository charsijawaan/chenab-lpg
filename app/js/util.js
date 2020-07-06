updateStockNumberGUI = () => {

    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            getTotalNumberOfCylindersInStock( (i+1), (err, data) => {
                if(data == null) {
                    data = 0
                }
                $(`#stock-number-of-cylinders-${cylinderTypes[i].weight}-kg`).html(`${cylinderTypes[i].weight} Kg = ${data}`)        
            })        
        }
    })
}

updatePlantMoneyNumberGUI = () => {

    getAllPlants((err, allPlants)=>{
        for(let i = 0; i < allPlants.length; i++) {
            getTotalPlantMoney((i+1), (err, data) => {
                $(`#plant-money-${allPlants[i].plant_name}`).html(`${allPlants[i].plant_name} = ${data} Rs/-`)
                let plantName = capitalizeFLetter(`plant-money-${allPlants[i].plant_name}`)
                $(`#plant-money-${allPlants[i].plant_name}`).html(plantName)
            })
        }
    })
    
}

updateMarketMoneyNumberGUI = () => {
    getTotalMoneyInMarket((err, data) => {
        if(data[0].pending_amount === null) {
            data[0].pending_amount = 0
        }
        $(`#total-money-in-market`).html(`${data[0].pending_amount} Rs/-`)
        getAllTypesOfCylinders((err, cylinderTypes) => {
            for(let i = 0; i < cylinderTypes.length; i++) {                
                getTotalCylindersInMarket(cylinderTypes[i].weight, (err, data) => {
                    if(data[0].total_cylinders == null) {
                        data[0].total_cylinders = 0
                    }
                    $(`#market-number-of-cylinders-${cylinderTypes[i].weight}-kg`).html(`${cylinderTypes[i].weight} Kg = ${data[0].total_cylinders}`)
                })
            }
        })
    })            
}

updateAssetsNumberGUI = () => {
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            getTotalNumberOfCylindersInAssets( (i+1), (err, data) => {
                if(data[0].number_of_cylinders == null) {
                    data[0].number_of_cylinders = 0
                }
                $(`#assets-number-of-cylinders-${cylinderTypes[i].weight}-kg`).html(`${cylinderTypes[i].weight} Kg = ${data[0].number_of_cylinders}`)        
            })        
        }
    })
}

updateProfitNumberGUI = () => {
    getThisMonthSaleDetails((err, saleDetails) => {

        let totalSaleProfit = 0
        let kg11Sold = 0
        let kg15Sold = 0
        let kg45Sold = 0

        let totalFillingsPrice = 0
        let kg11Fill = 0
        let kg15Fill = 0
        let kg45Fill = 0

        let expensesPrice = 0

        let netProfit

        for(let i = 0; i < saleDetails.length; i++) {
            totalSaleProfit += saleDetails[i].sub_profit
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

        getThisMonthTotalExpenses((err, expenses) => {

            expensesPrice += expenses.total_expenses

            getThisMonthFillingsPrice((err, fillingsData) => {

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

                netProfit = totalSaleProfit - expensesPrice
                if(netProfit > 0) {
                    $(`#this-month-profit`).css('color', 'green')
                }
                else {
                    $(`#this-month-profit`).css('color', 'red')
                }
                $(`#this-month-profit`).html(`${netProfit} Rs/-`)

            })
            
        })

    })
}

updateBusinessNumberInGUI = () => {
    let totalMarketMoney = 0
    let totalPlantMoney = 0
    let totalExpenses = 0
    let cashInHand = 0
    let totalStockMoney = 0

    let business = 0

    getTotalMoneyInMarket((err, data) => {
        totalMarketMoney += data[0].pending_amount
        getAllPlantMoney((err, data) => {
            totalPlantMoney += data.plant_money
            getAllExpenses((err, data) => {
                totalExpenses = data.total_expenses_money
                getCurrentCashInHand((err, data) => {
                    cashInHand += data.current_cash
                    getTotalStockMoney((err, data) => {
                        totalStockMoney += data.stock_money

                        let revenue = totalMarketMoney + cashInHand + totalStockMoney
                        let investment = totalPlantMoney + totalExpenses

                        business = revenue - investment

                        if(business > 0) {
                            $(`#business`).css('color', 'white')
                            $(`#business`).html(`
                                In Profit : 
                                ${business}
                            `)
                        }
                        else {
                            $(`#business`).html(`
                            In Loss :
                                ${business}
                            `)
                            $(`#business`).css('color', 'red')
                        }
                    })
                })
            })
        })
    })
}

updateMainWindowGUI = () => {
    updateStockNumberGUI()
    updatePlantMoneyNumberGUI()
    updateMarketMoneyNumberGUI()
    updateAssetsNumberGUI()
    updateProfitNumberGUI()
    updateBusinessNumberInGUI()
}

// when ever a button is pressed all the extra divs are hided
hideAllDivs = () => {
    for(let i = 0; i < allDivs.length; i++) {
        allDivs[i].style.display = 'none'
    }
    $('#view-buy-history-table').html('')
    $('#view-buy-history-date-checkbox').prop('checked', false)
    $('#view-buy-history-from').prop('disabled', true)
    $('#view-buy-history-to').prop('disabled', true)
    $('#view-buy-history-from').val('')
    $('#view-buy-history-to').val('')
    $('#view-buy-history-datepicker-btn').prop('disabled', true)
    $('#pay-money-to-plant-form').trigger('reset')
    
    resetViewPaymentHistory()
    resetBuyGasDiv()
}

capitalizeFLetter = (id) => { 
    var string = $(`#${id}`).html()
    return string[0].toUpperCase() + string.slice(1)
} 

showMsgDialog = (msg) => {
    let options = {
        type: 'info',
        buttons: ['Okay'],
        message: msg,
        normalizeAccessKeys: true
    }
    dialog.showMessageBox(options, i => {
        if (i == 0) {
            return
        }
    })
}

getCustomersFromDatabase = (id, wrapperID) => {
    $(`#${wrapperID}`).html('')
    let name = $(`#${id}`).val()
    getCustomersByName(name, (err, names) => {
        for (let i = 0; i < names.length; i++) {
            $(`#${wrapperID}`).append(`
            <div style="color: #000; background-color: #fff;border: 3px solid black;">
                <span data-id="${names[i].customer_id}" data-name="${names[i].company_name}" 
                style="cursor: pointer;" onclick="selectCustomer(this, '${id}', '${wrapperID}')">${names[i].company_name}</span>
            </div>                
            `)
        }
    })
}


selectCustomer = (customerSpan, id, wrapperID) => {
    let customerID = $(customerSpan).attr('data-id')
    let customerName = $(customerSpan).attr('data-name')
    $(`#${id}`).val(customerName)
    $(`#${wrapperID}`).html('')
}

function titleCase(str) {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
}