showStockDetailsDiv = () => {
    hideAllDivs()
    resetStockDetailsDiv()
    $('#stock-details-div').append(`
        <h2>Stock Details</h2>
    `)
    getAllPlants((err, allPlants)=>{
        let str = ''
        str += `
            <div style="text-align: center" class="">
                <select name="plant" id="select-plant-stock-details-div" onchange="updateStockDetailsGUI()">`
        for(let i = 0; i < allPlants.length; i++)
            str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`                
        str += `</select>
            </div>`
        $(`#stock-details-div`).append(str)

        $(`#stock-details-div`).append(`
            <div id="stock-details-by-plant"></div>
        `)
        updateStockDetailsGUI()
    })
    $('#stock-details-div').css('display', 'flex')
}

resetStockDetailsDiv = () => {
    $('#stock-details-div').html('')
}

updateStockDetailsGUI = () => {
    $(`#stock-details-by-plant`).html('')
    let plantID = $(`#select-plant-stock-details-div`).find(':selected').val()
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            getAvailableStockByPlantID(cylinderTypes[i].weight, plantID, (err, availStock)=>{
                for(let j = 0; j < availStock.length; j++) {
                    $('#stock-details-by-plant').append(`
                        <h2>${cylinderTypes[i].weight} Kg (${availStock[j].buy_rate} Rs/-) = ${availStock[j].number_of_cylinders} Cylinders</h2>
                    `)
                }                
            })
        }
    })
}