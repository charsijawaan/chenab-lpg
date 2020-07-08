showReceiveCylindersDiv = () => {
    hideAllDivs()
    resetReceiveCylindersDiv()
    $('#receive-cylinders-div').append(`
        <div>
            <h2>Receive Cylinders</h2>
        </div>
        <div>
            <div style="text-align: center;">
                <div class="mt-2">
                    <label for="inp" class="inp">
                    <input type="text" placeholder="&nbsp;" required id="customer-name-field-receive-cylinders"
                    onkeydown="getCustomersFromDatabase('customer-name-field-receive-cylinders', 'select-company-div-wrapper-receive-cylinders')">
                    <span class="label">Enter Company Name</span>
                    <span class="focus-bg"></span>
                    </label>                
                </div>
            </div>
            <div style="text-align: center;display: flex; flex-direction: column;" id="select-company-div-wrapper-receive-cylinders">
                <!-- html changes here while searching -->
            </div>
        </div>
        <div class="mt-3 mb-4">
            <button class="btn btn-primary" style="text-align: center;" onclick="receiveCylindersSearchButton()">Search</button>
        </div>
        <div id="receive-cylinders-customer-details-div" style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
        </div>        
        
    `)
    $('#receive-cylinders-div').css('display', 'flex')
}

resetReceiveCylindersDiv = () => {
    $(`#receive-cylinders-div`).html(``)
}

receiveCylindersSearchButton = () => {
    $('#receive-cylinders-customer-details-div').html('')
    let companyName = $('#customer-name-field-receive-cylinders').val()
    if(companyName === '') {
        showMsgDialog('Enter customer name')
    }
    getCustomer(companyName, (err, customerData) => {
        if(customerData.length < 1) {
            showMsgDialog('No customer with this name was found')
            return
        }
        else {
            getAllTypesOfCylinders((err, cylinderTypes) => {
                for(let i = 0; i < cylinderTypes.length; i++) {
                    getNumberOfCylindersinPossesion(customerData[0].customer_id, cylinderTypes[i].weight, (err, data) => {
                        for(let j = 0; j < data.length; j++) {
                            let plantName
                            if(data[j].plant_id === 1) {
                                plantName = 'Chenab'
                            }
                            else if(data[j].plant_id === 2) {
                                plantName = 'Super'
                            }
                            $('#receive-cylinders-customer-details-div').append(`
                            <div style="display: flex;justify-content: space-between" class="mt-3">
                                <h3 class="mr-3">
                                    ${cylinderTypes[i].weight} Kg = ${data[j].number_of_cylinders} Cylinders (${plantName})
                                </h3>
                                <input type="number" min="1" max="${data[j].number_of_cylinders}" 
                                oninput="validity.valid||(value='');" id="${cylinderTypes[i].weight}kg-receive-cylinders-field-${data[j].plant_id}" 
                                data-plantID="${data[j].plant_id}">
                            </div>                                                        
                            `)
                        }                        
                    }) 
                    addBtn(()=>{
                        $(`#receive-cylinders-btn-wrapper`).css('display', 'block')
                    })
                }
                           
            })            
        }
    })
}

receiveCylindersButton = () => {
    let companyName = $('#customer-name-field-receive-cylinders').val()
    if(companyName === '') {
        showMsgDialog('Enter customer name')
    }
    else {
        getCustomer(companyName, (err, customerData) => {
            if(customerData.length < 1) {
                showMsgDialog('No customer with this name was found')
                return
            }
            else {                
                getAllTypesOfCylinders((err, cylinderTypes)=> {
                    for(let i = 0; i < cylinderTypes.length; i++) {
                        getAllPlants((err, data)=>{
                            for(let j = 0; j < data.length; j++) {
                                let num = $(`#${cylinderTypes[i].weight}kg-receive-cylinders-field-${data[j].plant_id}`).val()
                                let plantID = $(`#${cylinderTypes[i].weight}kg-receive-cylinders-field-${data[j].plant_id}`).attr('data-plantID')
                                let date = new Date()
                                if(num === undefined) {
                                    continue
                                }                        
                                if(num === '') {
                                    num = 0
                                }                                
                                insertIntoCylinderTransactions(customerData[0].customer_id, plantID, cylinderTypes[i].weight, num, date.getTime(), ()=>{
                                    
                                })
                                // receiveCylinder(num, cylinderTypes[i].weight, customerData[0].customer_id, plantID, (err)=>{
                                // })
                            }
                            
                        })                                                 
                    }
                    setTimeout(()=>{
                        resetReceiveCylindersDiv()
                        showMsgDialog('Cylinders Received')
                        updateMainWindowGUI()
                    },1000)                           
                })    
            }
        })
    }
}

function addBtn(cb) {
    $(`#receive-cylinders-div`).append(`
        <div class="mt-3" style="display: none" id="receive-cylinders-btn-wrapper">
            <button class="btn btn-primary" onclick="receiveCylindersButton()">Receive</button>
        </div>
    `)
    cb(null)
}