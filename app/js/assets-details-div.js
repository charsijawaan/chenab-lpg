showAssetsDetailsDiv = () => {
    hideAllDivs()
    $(`#assets-details-div`).html(``)
    $(`#assets-details-div`).append(`
        <div>
            <h2>Assets Details</h2>
        </div>
    `)
    getAllPlants((err, allPlants)=>{
        let str = ''
        str += `
            <div style="text-align: center" class="">
                <select name="plant" id="select-plant-assets-details-div" onchange="updateAssetsDetailsGUI()">`
        for(let i = 0; i < allPlants.length; i++)
            str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`                
        str += `</select>
            </div>`
        $(`#assets-details-div`).append(str)

        $(`#assets-details-div`).append(`
            <div id="assets-details-by-plant"></div>
        `)
        updateAssetsDetailsGUI()
    })
    $(`#assets-details-div`).css('display', 'flex')
}

updateAssetsDetailsGUI = () => {
    $(`#assets-details-by-plant`).html('')
    let plantID = $(`#select-plant-assets-details-div`).find(':selected').val()
    let plantName
    getAllTypesOfCylinders((err, cylinderTypes)=>{
        for(let i = 0; i < cylinderTypes.length; i++) {
            getAvailableAssetsByPlantID(cylinderTypes[i].weight, plantID, (err, availAssets)=>{
                if(availAssets[0].number_of_cylinders == null) {
                    availAssets[0].number_of_cylinders = 0
                }
                if(plantID == 1) {
                    plantName = 'Chenab'
                }
                else {
                    plantName = 'Super'
                }
                $('#assets-details-by-plant').append(`
                    <h2>${cylinderTypes[i].weight} Kg = ${availAssets[0].number_of_cylinders} Cylinders (${plantName})</h2>
                `)
            })
        }
    })
}