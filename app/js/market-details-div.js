showMarketDetailsDiv = () => {
    hideAllDivs()
    resetMarketDetailsDiv()
    $('#market-details-div').append(`
    <div style="text-align: center;">
        <h2>Market Details</h2>
    </div>
    <div class="mt-4" style="width: 100%">
        <table class="table" style="color: #ffffff;text-align: center;">
            <thead>
                <tr>
                    <th scope="col">Company Name</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Pending Amount</th>
                    <th scope="col">11 Kg Chenab</th>
                    <th scope="col">15 Kg Chenab</th>
                    <th scope="col">45 Kg Chenab</th>
                    <th scope="col">11 Kg Super</th>
                    <th scope="col">15 Kg Super</th>
                    <th scope="col">45 Kg Super</th>
                </tr>
            </thead>
            <tbody id="view-market-details-table">                                       
            </tbody>
        </table>
    </div>
    `)
    generateMarketTable()
    $('#market-details-div').css('display', 'flex')
}

resetMarketDetailsDiv = () => {
    $('#market-details-div').html(``)
}

generateMarketTable = () => {    
    getAllCustomersWithPendingAmount((err, data) => {        
        for(let i = 0; i < data.length; i++) {
            let record = {
                'company_name': '--',
                'customer_name': '--',
                'total_pending_amount': '--',
                '11_kg_cylinders_chenab': '--',
                '15_kg_cylinders_chenab': '--',
                '45_kg_cylinders_chenab': '--',
                '11_kg_cylinders_super': '--',
                '15_kg_cylinders_super': '--',
                '45_kg_cylinders_super': '--'
            }
            getNumberOfCylindersinPossesion(data[i].customer_id, 11, (err,num)=>{
                if(num[0].plant_id === 1) {
                    record['11_kg_cylinders_chenab'] = num[0].number_of_cylinders
                }
                if(num[0].plant_id === 2) {
                    record['11_kg_cylinders_super'] = num[0].number_of_cylinders
                }
                if(num[1].plant_id === 1) {
                    record['11_kg_cylinders_chenab'] = num[1].number_of_cylinders
                }
                if(num[1].plant_id === 2) {
                    record['11_kg_cylinders_super'] = num[2].number_of_cylinders
                }
            })
            getNumberOfCylindersinPossesion(data[i].customer_id, 15, (err,num)=>{
                if(num[0].plant_id === 1) {
                    record['15_kg_cylinders_chenab'] = num[0].number_of_cylinders
                }
                if(num[0].plant_id === 2) {
                    record['15_kg_cylinders_super'] = num[0].number_of_cylinders
                }
                if(num[1].plant_id === 1) {
                    record['15_kg_cylinders_chenab'] = num[1].number_of_cylinders
                }
                if(num[1].plant_id === 2) {
                    record['15_kg_cylinders_super'] = num[2].number_of_cylinders
                }
            })
            getNumberOfCylindersinPossesion(data[i].customer_id, 45, (err,num)=>{
                if(num[0].plant_id === 1) {
                    record['45_kg_cylinders_chenab'] = num[0].number_of_cylinders
                }
                if(num[0].plant_id === 2) {
                    record['45_kg_cylinders_super'] = num[0].number_of_cylinders
                }
                if(num[1].plant_id === 1) {
                    record['45_kg_cylinders_chenab'] = num[1].number_of_cylinders
                }
                if(num[1].plant_id === 2) {
                    record['45_kg_cylinders_super'] = num[2].number_of_cylinders
                }
            })

            record['company_name'] = data[i].company_name
            if(data[i].customer_name != null) {
                record['customer_name'] = data[i].customer_name
            }            
            record['total_pending_amount'] = data[i].total_pending_amount

            setTimeout(()=>{
                $(`#view-market-details-table`).append(`
                <tr>
                    <td>${record['company_name']}</td>
                    <td>${record['customer_name']}</td>
                    <td>${record['total_pending_amount']}</td>
                    <td>${record['11_kg_cylinders_chenab']}</td>
                    <td>${record['15_kg_cylinders_chenab']}</td>
                    <td>${record['45_kg_cylinders_chenab']}</td>
                    <td>${record['11_kg_cylinders_super']}</td>
                    <td>${record['15_kg_cylinders_super']}</td>
                    <td>${record['45_kg_cylinders_super']}</td>
                </tr>
            `)
            }, 1000)            
        }
    })
}