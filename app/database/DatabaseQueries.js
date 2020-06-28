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
    db.all(`SELECT fillings_id, plant_id, strftime('%Y-%m-%d', datetime(Fillings.date/1000, 'unixepoch'))
             as date, strftime('%m', datetime(Fillings.date/1000, 'unixepoch')) as month,
             total_price FROM Fillings WHERE month = '${month}' ORDER BY Fillings.date DESC`, [], (err, data) => {
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
    db.all(`SELECT PlantTransactions.*,strftime('%m', datetime(PlantTransactions.date/1000, 'unixepoch'))
            AS month, Plants.plant_name FROM PlantTransactions INNER JOIN Plants ON 
            PlantTransactions.plant_id = Plants.plant_id WHERE month = '${month}' 
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
            WHERE strftime('%Y-%m-%d ', datetime(PlantTransactions.date/1000, 'unixepoch')) >= '${fromDate}' 
            AND strftime('%Y-%m-%d ', datetime(PlantTransactions.date/1000, 'unixepoch')) <= '${toDate}' 
            ORDER BY date DESC`, [], (err, data) => {
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