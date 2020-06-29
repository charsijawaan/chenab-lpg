showBuyAssetsDiv = () => {
    hideAllDivs()
    $(`#buy-assets-div`).html(``)
    $(`#buy-assets-div`).append(`
        <div>
            <h2>Buy Assets</h2>
        </div>
    `)
    getAllTypesOfCylinders((err, cylinderTypes)=> {
        getAllPlants((err, allPlants)=>{
            let str = ''
            str += `<select name="plant" id="select-plant-buy-assets-div">`
            for(let i = 0; i < allPlants.length; i++) {
                str += `<option value="${allPlants[i].plant_id}">${allPlants[i].plant_name}</option>`                
            }
            str += '</select>'
            $(`#buy-assets-div`).append(str)
            for(let i = 0; i < cylinderTypes.length; i++) {
                $('#buy-assets-div').append(`
                
                <div style="display: flex;">
                    <div style="text-align: center;" style="display: flex;">
                        <div class="mt-4" style="display: flex;align-items: center;">

                        <ul style="margin: 8px 0px;">
                            <li>
                            <input id="${cylinderTypes[i].weight}kg-buy-assets-checkbox" type="checkbox" 
                            class="switch" onchange="">
                            <label for="s1">${cylinderTypes[i].weight} Kg</label>
                            </li>
                        </ul>

                            <label for="inp" class="inp mr-3 ml-4">
                            <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');handleBuyGasTotal()" 
                            min="1" required id="buy-assets-${cylinderTypes[i].weight}kg-rate" disabled>
                            <span class="label">Enter Gas Rate</span>
                            <span class="focus-bg"></span>
                            </label>
                
                            <label for="inp" class="inp mr-3">
                            <input type="number" placeholder="&nbsp;" oninput="validity.valid||(value='');handleBuyGasTotal()"
                             min="1" 
                            required id="buy-aseets-${cylinderTypes[i].weight}kg-cylinders" disabled>
                            <span class="label">Number of Cylinders</span>
                            <span class="focus-bg"></span>
                            </label>    
                        </div>                           
                    </div>                    
                </div>                       
                `)
            }
            $('#buy-assets-div').append(`
            <div style="margin-top: 30px">
                <h3 id="buy-assets-total">Total = 0 Rs</h3>
            </div>
            <div class="mt-3">
                <button class="btn btn-primary" onclick="">Buy Assets</button>                
            </div>   
            `)
        })
    })
    $(`#buy-assets-div`).css('display', 'flex')
}