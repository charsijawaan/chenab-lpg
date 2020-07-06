let db = require('./../database/databaseConnection')

// get cylinder types
getAllTypesOfCylinders = (cb) => {
    db.all(`SELECT * FROM CylinderTypes`, [], (err, cylinderTypes) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, cylinderTypes)
        }
    })
}

// stock functions
getTotalNumberOfCylindersInStock = (cylinderID, cb) => {
    db.get(`SELECT SUM(number_of_cylinders) as number_of_cylinders FROM Stock WHERE cylinder_id = ${cylinderID}`, [], (err, row) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, row.number_of_cylinders)
        }
    })
}

increaseCylindersStock = (numberOfCylinders, id, cb) => {
    db.run('UPDATE Stock SET number_of_cylinders = number_of_cylinders + ? WHERE id = ?', [numberOfCylinders, id], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

decreaseCylindersStock = (numberOfCylinders, id, cb) => {
    db.run('UPDATE Stock SET number_of_cylinders = number_of_cylinders - ? WHERE id = ?', [numberOfCylinders, id], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

updateStock = (cylinderID, numberOfCylinders, weight, buyRate, plantID, cb) => {

    db.all(`SELECT * FROM Stock WHERE cylinder_id = ${cylinderID} AND buy_rate = ${buyRate} 
            AND cylinder_weight = ${weight} AND plant_id = ${plantID}`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            if (data.length == 0) {
                db.run(`INSERT INTO Stock('cylinder_id', 'number_of_cylinders', 'cylinder_weight', 'buy_rate', 'plant_id') 
                        VALUES(?,?,?,?,?)`, [cylinderID, numberOfCylinders, weight, buyRate, plantID], (err, res) => {
                    if (err) {
                        console.log(err.message)
                    }
                    else {
                        cb(null, res)
                    }
                })
            }
            else {
                db.run(`UPDATE Stock SET number_of_cylinders = number_of_cylinders + ${numberOfCylinders} 
                        WHERE cylinder_id = ${cylinderID} AND buy_rate = ${buyRate} AND cylinder_weight = ${weight} 
                        AND plant_id = ${plantID}`, [], (err, res) => {
                    if (err) {
                        console.log(err.message)
                    }
                    else {
                        cb(null, res)
                    }
                })
            }
        }
    })
}

// buy history functions
getAllBuyHistory = (cb) => {
    db.all(`SELECT fillings_id, plant_id, strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch')) AS date,
            total_price FROM Fillings ORDER BY Fillings.date DESC`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

getThisMonthBuyHistory = (cb) => {
    let date = new Date()
    let month = String(date.getMonth() + 1)
    if (month.length == 1) {
        month = '0' + month
    }
    let fullMonth = `${date.getFullYear()}-${month}`
    db.all(`SELECT fillings_id, plant_id, strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch'))
             as date, strftime('%Y-%m', datetime(Fillings.date/1000, 'unixepoch')) as month,
             total_price FROM Fillings WHERE month = '${fullMonth}' ORDER BY Fillings.date DESC`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

getSpecificBuyHistory = (fromDate, toDate, cb) => {
    db.all(`SELECT fillings_id, plant_id,strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch')) 
            as date, total_price FROM Fillings WHERE strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch'))
             >= '${fromDate}' AND strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch'))
              <= '${toDate}' ORDER BY Fillings.date DESC`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

// payment history functions
getAllPaymentHistory = (cb) => {
    db.all(`SELECT PlantTransactions.*, Plants.plant_name FROM PlantTransactions 
            INNER JOIN Plants ON PlantTransactions.plant_id = Plants.plant_id ORDER BY date DESC`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    });
}

getThisMonthPaymentHistory = (cb) => {
    let date = new Date()
    let month = String(date.getMonth() + 1)
    if (month.length == 1) {
        month = '0' + month
    }
    let fullMonth = `${date.getFullYear()}-${month}`
    db.all(`SELECT PlantTransactions.*,strftime('%Y-%m', datetime(PlantTransactions.date/1000, 'unixepoch'))
            AS month, Plants.plant_name FROM PlantTransactions INNER JOIN Plants ON 
            PlantTransactions.plant_id = Plants.plant_id WHERE month = '${fullMonth}' 
            ORDER BY date DESC`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

getSpecificPaymentHistory = (fromDate, toDate, cb) => {
    db.all(`SELECT PlantTransactions.*, Plants.plant_name FROM PlantTransactions 
    INNER JOIN Plants ON PlantTransactions.plant_id = Plants.plant_id
    WHERE strftime('%Y-%m-%d', datetime(PlantTransactions.date/1000, 'unixepoch')) >= '${fromDate}' 
    AND strftime('%Y-%m-%d', datetime(PlantTransactions.date/1000, 'unixepoch')) <= '${toDate}' 
    ORDER BY PlantTransactions.date DESC`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

// plant money functions
getTotalPlantMoney = (plantID, cb) => {
    db.get(`SELECT * FROM PlantMoney WHERE plant_id = ${plantID}`, [], (err, row) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, row.total_plant_money)
        }
    })
}

increasePlantMoney = (totalPrice, plantID, cb) => {
    db.run('UPDATE PlantMoney SET total_plant_money = total_plant_money + ? WHERE plant_id = ?', [totalPrice, plantID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

decreasePlantMoney = (amountToPay, plantID, cb) => {
    db.run(`UPDATE PlantMoney SET total_plant_money = total_plant_money - ? WHERE plant_id = ?`, [amountToPay, plantID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}


function insertIntoFillings(date, totalPrice, plantID, cb) {
    db.run(`INSERT INTO Fillings('date','total_price','plant_id') VALUES(?,?,?)`, [date, totalPrice, plantID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getLastFillingsID(cb) {
    db.get(`SELECT * FROM Fillings WHERE fillings_id = (SELECT MAX(fillings_id) FROM Fillings)`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}


function insertIntoPlantTransactions(amountToPay, date, plantID, cb) {
    db.run(`INSERT INTO PlantTransactions('amount', 'date', 'plant_id') VALUES(?,?,?)`, [amountToPay, date, plantID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    });
}

function getPlantTransactionByID(id, cb) {
    db.get(`SELECT * FROM PlantTransactions WHERE transaction_id = ?`, [id], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function updatePlantTransaction(id, newAmount, cb) {
    getPlantTransactionByID(id, (err, row) => {
        let oldAmount = row.amount
        db.run(`UPDATE PlantTransactions SET amount = ? WHERE transaction_id = ?`, [newAmount, id], (err, res) => {
            if (err) {
                console.log(err.message)
            }
            else {
                if (oldAmount > newAmount) {
                    increasePlantMoney((oldAmount - newAmount), id, (err, res) => {

                    })
                }
                else {
                    decreasePlantMoney((newAmount - oldAmount), id, (err, res) => {

                    })
                }
                cb(null, res)
            }
        })
    })

}

function getFIllingsDetailsByID(id, cb) {
    db.all(`SELECT * FROM FillingsDetails WHERE fillings_id = ?`, [id], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function insertIntoFillingsDetails(id, gasRate, numberOfCylinders, totalPrice, cylinderWeight, cb) {
    db.run(`INSERT INTO FillingsDetails('fillings_id', 'gas_rate', 'number_of_cylinders', 'total_price', 'cylinder_weight')
         VALUES(?,?,?,?,?)`, [id, gasRate, numberOfCylinders, totalPrice, cylinderWeight], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}


function updateFillings(id, cb) {
    db.run(`UPDATE Fillings SET total_price = ( SELECT SUM(total_price) FROM FillingsDetails 
            WHERE fillings_id = ${id} GROUP BY fillings_id) WHERE fillings_id = ${id}`, [], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getFillingsTotalPriceByID(id, cb) {
    db.all(`SELECT SUM(total_price) AS total_price, fillings_id FROM Fillings WHERE fillings_id = ${id} GROUP BY fillings_id`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data[0].total_price)
        }
    })
}

function updateFillingsDetails(id, gasRate, numberOfCylinders, subTotal, weight, cb) {
    db.run(`UPDATE FillingsDetails Set gas_rate = ${gasRate}, number_of_cylinders = ${numberOfCylinders},
    total_price = ${subTotal} WHERE fillings_id = ${id} AND cylinder_weight = ${weight}`, [], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getAllPlants(cb) {
    db.all(`SELECT * FROM Plants`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function addNewCustomerInDatabase(companyName, customerName, phoneNumber, limit, cb) {
    db.run(`INSERT INTO Customers('company_name', 'customer_name', 'phone_number', 'limit') VALUES(?,?,?,?)`,
            [companyName, customerName, phoneNumber, limit], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getCustomersByName(companyName, cb) {
    db.all(`SELECT * FROM Customers WHERE company_name LIKE '${companyName}%'`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAvailableStock(cylinderWeight, cb) {
    db.all(`SELECT * FROM Stock WHERE cylinder_weight = ${cylinderWeight} AND number_of_cylinders != 0`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAvailableStockByPlantID(cylinderWeight, plantID, cb) {
    db.all(`SELECT * FROM Stock WHERE cylinder_weight = ${cylinderWeight} AND number_of_cylinders != 0
            AND plant_id = ${plantID}`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAvailableStockByPlantIDandBuyRate(cylinderWeight, plantID, buyRate, cb) {
    db.all(`SELECT * FROM Stock WHERE cylinder_weight = ${cylinderWeight} AND number_of_cylinders != 0
            AND plant_id = ${plantID} AND buy_rate = ${buyRate}`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getCustomer(companyName, cb) {
    db.all(`SELECT * FROM Customers WHERE company_name = '${companyName}'`, [], (err, customerData) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, customerData)
        }
    })
}

function insertIntoSales(customerID, date, total, profit, costPrice, plantID, cb) {
    db.run(`INSERT INTO Sales('customer_id','date','total','profit','cost_price','plant_id') 
            VALUES(?,?,?,?,?,?)`, [customerID, date, total, profit, costPrice, plantID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getLastSalesID(cb) {
    db.get(`SELECT * FROM Sales WHERE sales_id = (SELECT MAX(sales_id) FROM Sales)`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function insertIntoSalesDetails(salesID, cylinderWeight, numberOfCylinders, subTotal, subCost, subProfit, plantID, customerID, cb) {
    db.run(`INSERT INTO SalesDetails('sales_id','cylinder_weight','number_of_cylinders','sub_total','sub_cost', 
            'sub_profit', 'plant_id', 'customer_id') VALUES(?,?,?,?,?,?,?,?)`,
            [salesID, cylinderWeight, numberOfCylinders, subTotal, subCost, subProfit, plantID, customerID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getTotalMoneyInMarket(cb) {
    db.all(`SELECT SUM(total_pending_amount) as pending_amount FROM CustomersPendingAmount`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTodayMoneyInMarket(cb) {
    db.all(``, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTotalCylindersInMarket(cylinderWeight, cb) {
    db.all(`SELECT SUM(number_of_cylinders) as total_cylinders FROM CylindersInMarket 
            WHERE cylinder_weight = ${cylinderWeight}`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getNumberOfCylindersinPossesion(customerID, cylinderWeight, cb) {
    db.all(`SELECT SUM(number_of_cylinders) AS number_of_cylinders, plant_id 
            FROM CylindersInMarket WHERE number_of_cylinders != 0 AND customer_id = ${customerID} 
            AND cylinder_weight = ${cylinderWeight} GROUP BY plant_id`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTotalPendingMoneyOfACustomer(customerID, cb) {
    db.all(`SELECT * FROM CustomersPendingAmount WHERE customer_id = ${customerID}`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function receivePaymentFromCustomer(customerID, customerName, amount, date, cb) {
    db.run(`INSERT INTO CustomerTransactions('customer_id','customer_name', 'amount', 'date') 
            VALUES(?,?,?,?)`, [customerID, customerName, amount, date], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function receiveCylinder(number, cylinderWeight, customerID, plantID, cb) {
    db.run(`UPDATE CylindersInMarket SET number_of_cylinders = number_of_cylinders - ? 
            WHERE cylinder_weight = ? AND customer_id = ? AND plant_id = ?`, [number, cylinderWeight, customerID, plantID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function insertIntoCylinderTransactions(customerID, plantID, cylinderWeight, numberOfCylinders, date, cb) {
    db.run(`INSERT INTO CylinderTransactions('customer_id','plant_id','cylinder_weight','number_of_cylinders','date') 
            VALUES(?,?,?,?,?)`, [customerID, plantID, cylinderWeight, numberOfCylinders, date], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getCylinderTransactionsByCompanyName(companyName, cb) {
    db.all(`SELECT CylinderTransactions.plant_id, CylinderTransactions.cylinder_weight, 
            CylinderTransactions.number_of_cylinders, strftime('%Y-%m-%d', datetime(CylinderTransactions.date/1000, 'unixepoch')) 
            AS date, Customers.company_name FROM CylinderTransactions INNER JOIN Customers ON CylinderTransactions.customer_id = 
            Customers.customer_id WHERE Customers.company_name = '${companyName}'`, [], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getSalesByCustomer(customerID, cb) {
    db.all(`SELECT *, strftime('%Y-%m-%d ', datetime(Sales.date/1000, 'unixepoch')) 
            as sale_date FROM Sales WHERE customer_id = ?`, [customerID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getCustomerTransactionsByCustomer(customerID, cb) {
    db.all(`SELECT *, strftime('%Y-%m-%d ', datetime(CustomerTransactions.date/1000, 'unixepoch'))
            as transaction_date FROM CustomerTransactions WHERE customer_id = ?`, [customerID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getSalesDetailsBySalesID(salesID, cb) {
    db.all(`SELECT * FROM SalesDetails WHERE sales_id = ?`, [salesID], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function updateSalesDetails(salesID, numberOfCylinders, newSubTotal, newSubProfit, customerID, cylinderWeight, newSubCost, cb) {
    db.run(`UPDATE SalesDetails SET number_of_cylinders = ?, sub_total = ?, sub_profit = ?, sub_cost = ?
            WHERE sales_id = ? AND customer_id = ? AND cylinder_weight = ?`,
            [numberOfCylinders, newSubTotal, newSubProfit, newSubCost, salesID, customerID, cylinderWeight], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getAllCustomers(cb) {
    db.all(`SELECT * FROM Customers`, [], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getAllCustomersWithPendingAmount(cb) {
    db.all(`SELECT Customers.*,
            CustomersPendingAmount.total_pending_amount FROM Customers INNER JOIN CustomersPendingAmount 
            ON Customers.customer_id = CustomersPendingAmount.customer_id ORDER BY Customers.company_name ASC`, [], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function insertIntoBuyAssets(plantID, total, date, cb) {
    db.run(`INSERT INTO BuyAssets('plant_id','total','date') VALUES(?,?,?)`, [plantID, total, date], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function insertIntoBuyAssetsDetails(buyAssetsID, rate, numberOfCylinders, total, cylinderWeight, cb) {
    db.run(`INSERT INTO BuyAssetsDetails('buy_assets_id','rate','number_of_cylinders','total','cylinder_weight') 
            VALUES(?,?,?,?,?)`, [buyAssetsID, rate, numberOfCylinders, total, cylinderWeight], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getLastBuyAssetsID(cb) {
    db.get(`SELECT * FROM BuyAssets WHERE buy_assets_id = (SELECT MAX(buy_assets_id) FROM BuyAssets)`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTotalNumberOfCylindersInAssets(cylinderID, cb) {
    db.all(`SELECT SUM(number_of_cylinders) as number_of_cylinders FROM Assets WHERE cylinder_id = ${cylinderID}`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAvailableAssetsByPlantID(cylinderWeight, plantID, cb) {
    db.all(`SELECT SUM(number_of_cylinders) AS number_of_cylinders FROM Assets WHERE cylinder_weight = ${cylinderWeight} AND number_of_cylinders != 0
            AND plant_id = ${plantID}`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getThisMonthSaleDetails(cb) {
    db.all(`SELECT SalesDetails.cylinder_weight, SalesDetails.number_of_cylinders, SalesDetails.sub_profit, SalesDetails.sub_total FROM Sales INNER JOIN SalesDetails 
    ON Sales.sales_id = SalesDetails.sales_id 
    WHERE strftime('%Y-%m', datetime(Sales.date/1000, 'unixepoch')) = strftime('%Y-%m', date('now'))
    `, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getThisMonthTotalExpenses(cb) {
    db.get(`SELECT SUM(expense_price) as total_expenses FROM Expenses 
            WHERE strftime('%Y-%m', datetime(Expenses.expense_date/1000, 'unixepoch')) = 
            strftime('%Y-%m', date('now'))`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getThisMonthFillingsPrice(cb) {
    db.all(`SELECT FillingsDetails.cylinder_weight, FillingsDetails.number_of_cylinders, 
            FillingsDetails.total_price FROM Fillings INNER JOIN FillingsDetails ON 
            Fillings.fillings_id = FillingsDetails.fillings_id
            WHERE strftime('%Y-%m', datetime(Fillings.date/1000, 'unixepoch')) = strftime('%Y-%m', date('now'))`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getThisMonthPaymentReceived(cb) {
    db.get(`SELECT SUM(amount) as amount FROM CustomerTransactions 
            WHERE strftime('%Y-%m', datetime(CustomerTransactions.date/1000, 'unixepoch')) 
            = strftime('%Y-%m', date('now'))`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function insertIntoExpenses(exName, exPrice, exDate, cb) {
    db.run(`INSERT INTO Expenses('expense_name','expense_price','expense_date') VALUES(?,?,?)`,
            [exName, exPrice, exDate], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getAllSaleDetails(cb) {
    db.all(`SELECT SalesDetails.cylinder_weight, SalesDetails.number_of_cylinders, 
            SalesDetails.sub_total, SalesDetails.sub_profit  FROM Sales INNER JOIN SalesDetails 
            ON Sales.sales_id = SalesDetails.sales_id
    `, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAllTotalExpenses(cb) {
    db.get(`SELECT SUM(expense_price) as total_expenses FROM Expenses`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAllFillingsPrice(cb) {
    db.all(`SELECT FillingsDetails.cylinder_weight, FillingsDetails.number_of_cylinders, 
            FillingsDetails.total_price FROM Fillings INNER JOIN FillingsDetails ON 
            Fillings.fillings_id = FillingsDetails.fillings_id
            `, [], (err, data) => {
            if (err) {
                console.log(err.message)
            }
            else {
                cb(null, data)
            }
    })
}

function getAllPaymentReceived(cb) {
    db.get(`SELECT SUM(amount) as amount FROM CustomerTransactions`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getSpecificSaleDetails(fromDate, toDate, cb) {
    db.all(`SELECT SalesDetails.cylinder_weight, SalesDetails.number_of_cylinders,
            SalesDetails.sub_total, SalesDetails.sub_profit FROM Sales INNER JOIN SalesDetails 
            ON Sales.sales_id = SalesDetails.sales_id WHERE 
            strftime('%Y-%m-%d', datetime(Sales.date/1000, 'unixepoch')) >= '${fromDate}'
            AND strftime('%Y-%m-%d', datetime(Sales.date/1000, 'unixepoch')) <= '${toDate}'`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getSpecificTotalExpenses(fromDate, toDate, cb) {
    db.get(`SELECT SUM(expense_price) as total_expenses FROM Expenses 
            WHERE strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) >= 
            '${fromDate}' AND strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) <= '${toDate}' `, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getSpecificFillingsPrice(fromDate, toDate, cb) {
    db.all(`SELECT FillingsDetails.cylinder_weight, FillingsDetails.number_of_cylinders, 
            FillingsDetails.total_price FROM Fillings INNER JOIN FillingsDetails ON 
            Fillings.fillings_id = FillingsDetails.fillings_id
            WHERE strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch')) >= '${fromDate}' AND 
            strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch')) <= '${toDate}'`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getSpecificPaymentReceived(fromDate, toDate, cb) {
    db.get(`SELECT SUM(amount) as amount FROM CustomerTransactions 
            WHERE strftime('%Y-%m-%d', datetime(CustomerTransactions.date/1000, 'unixepoch')) >= '${fromDate}' AND
            strftime('%Y-%m-%d', datetime(CustomerTransactions.date/1000, 'unixepoch')) <= '${toDate}'`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getCompanyByName(companyName, cb) {
    db.get(`SELECT * FROM Customers WHERE company_name = ?`, [companyName], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getCashInHand(cb) {
    db.get(`SELECT * FROM CurrentCash WHERE cash_id = 1`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getCurrentCashInHand(cb) {
    db.get(`SELECT * FROM CurrentCash`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getSpecificDateCashInHand(fromDate, toDate, cb) {
    fromDate += ` 23:59:59`
    console.log(fromDate)
    db.all(`SELECT *, strftime('%Y-%m-%d 23:59:59', datetime(Cash.cash_date/1000, 'unixepoch')) 
            as date FROM Cash WHERE date = strftime('${fromDate}', datetime(Cash.cash_date/1000, 'unixepoch')) 
            ORDER BY cash_id DESC`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTodaySaleDetails(cb) {
    db.all(`SELECT SalesDetails.cylinder_weight, SalesDetails.number_of_cylinders, SalesDetails.sub_profit, SalesDetails.sub_total FROM Sales INNER JOIN SalesDetails 
    ON Sales.sales_id = SalesDetails.sales_id 
    WHERE strftime('%Y-%m-%d', datetime(Sales.date/1000, 'unixepoch')) = strftime('%Y-%m-%d', date('now'))
    `, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTodayTotalExpenses(cb) {
    db.get(`SELECT SUM(expense_price) as total_expenses FROM Expenses 
            WHERE strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) = 
            strftime('%Y-%m-%d', date('now'))`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTodayFillingsPrice(cb) {
    db.all(`SELECT FillingsDetails.cylinder_weight, FillingsDetails.number_of_cylinders, 
            FillingsDetails.total_price FROM Fillings INNER JOIN FillingsDetails ON 
            Fillings.fillings_id = FillingsDetails.fillings_id
            WHERE strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch')) = strftime('%Y-%m-%d', date('now'))`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTodayPaymentReceived(cb) {
    db.get(`SELECT SUM(amount) as amount FROM CustomerTransactions 
            WHERE strftime('%Y-%m-%d', datetime(CustomerTransactions.date/1000, 'unixepoch')) 
            = strftime('%Y-%m-%d', date('now'))`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getThisMonthExpenseHistory(cb) {
    db.all(`SELECT *, strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) 
            AS date FROM Expenses WHERE strftime('%Y-%m', datetime(Expenses.expense_date/1000, 'unixepoch'))
            = strftime('%Y-%m', date('now'))`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAllExpenseHistory(cb) {
    db.all(`SELECT *, strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) 
            AS date FROM Expenses`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getSpecificExpenseHistory(fromDate, toDate, cb) {
    db.all(`SELECT *, strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) 
            AS date FROM Expenses WHERE strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) 
            >= '${fromDate}' AND strftime('%Y-%m-%d', datetime(Expenses.expense_date/1000, 'unixepoch')) <= '${toDate}'`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function editCompanyDetails(customerID, companyName, customerName, companyNumber, companyLimit, cb) {
    if(companyNumber === ``) {
        companyNumber = null
    }
    db.run(`UPDATE Customers SET company_name = '${companyName}', 
            customer_name = '${customerName}', phone_number = ${companyNumber}, 
            [limit] = ${companyLimit} WHERE customer_id = ${customerID}`, [], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function editCompanyDetailsExceptName(customerID, customerName, companyNumber, companyLimit, cb) {
    if(companyNumber === ``) {
        companyNumber = null
    }
    db.run(`UPDATE Customers SET customer_name = '${customerName}', phone_number = ${companyNumber}, 
            [limit] = ${companyLimit} WHERE customer_id = ${customerID}`, [], (err, res) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, res)
        }
    })
}

function getAllPlantMoney(cb) {
    db.get(`SELECT SUM(total_plant_money) AS plant_money FROM PlantMoney`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getAllExpenses(cb) {
    db.get(`SELECT SUM(expense_price) AS total_expenses_money FROM Expenses`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTodayExpenses(cb) {
    db.get(``, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}

function getTotalStockMoney(cb) {
    db.get(`SELECT SUM(number_of_cylinders * buy_rate) as stock_money FROM Stock;`, [], (err, data) => {
        if (err) {
            console.log(err.message)
        }
        else {
            cb(null, data)
        }
    })
}