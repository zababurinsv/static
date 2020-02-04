function getOptions (object){
    return new Promise(async (resolve, reject) => {
        let htmlOptions = ``
        if(object === 'null'){
            htmlOptions = htmlOptions + `<option value="0">0</option>`
        }else{
            object = object.split(',')
            let temp = []
            for(let i =0; i < object.length;i++){
             let tempObj = object[i].replace(/[^-0-9]/gim,'')
                if(tempObj.length !== 0){
                    if(tempObj.length > 1){
                        console.warn('слишком большое колличество символов')
                    }else{
                        temp.push(tempObj)
                    }
                }

            }
            for(let i=0; i < temp.length; i++){
                // console.assert(false, temp)
                htmlOptions = htmlOptions + `<option value="${temp[i]}">${temp[i]}</option> \n`
            }
        }
        resolve(htmlOptions)
    })
}
function getOptionsPrice(object){
    return new Promise(async (resolve, reject) => {
        let htmlOptions = ``
        if(object === 'null'){
            htmlOptions = htmlOptions + `<option value="0">0</option>`
        }else{
            object = object.split(',')
            for(let i=0; i < object.length; i++){

                object[i] = object[i].replace(/^\s*(.*)\s*$/, '$1')
                htmlOptions = htmlOptions + `<option value="${object[i]}">${object[i]}</option> \n`
            }
        }
        resolve(htmlOptions)
    })
}

export default (item)=>{
    return new Promise(async (resolve, reject) => {
       let out = (obj)=>{
            resolve(obj)
        }
        let err = (obj)=>{
            reject(obj)
        }
        let options = await getOptions(item['plans'])
        let optionsPrice = await getOptionsPrice(item['price'])
        switch(parseInt(item['city'], 10)){
            case 0:
                item['city'] = 'неизвестный'
                break
            case 1:
                item['city'] = 'Москва'
                break
            case 2:
                item['city'] = 'Санкт-Петербург'
                break
            default:
                item['city'] = 'неизвестный'
                break
        }
        out(`
<tr>
<td class="id">${item['id']}</td>
<td class="city">${item['city']}</td>
<td class="name">${item['name']}</td>
<td class="object">${item['object']}</td>
<td class="dateExperiences">${item['dateExperiences']}</td>
<td class="class">${item['class']}</td>
<td class="type">${item['type']}</td>
<td class="metro">${item['metro']}</td>
<td class="geo">${item['geo']}</td>
<td class="plan"><select class  ="form-control search_input_plan" name="plan">${options}</select></td>
<td class="price"><select class  ="form-control search_input_plan" name="price">${optionsPrice}</select></td>
<td class="finish">${item['finish']}</td>
<td class="addition">${item['description']}</td>
<td>
<a class="button button-lg btn-lg edit" title="Edit">
<i class="fa fa-save" title="Save"></i></a> 
<a class="button btn-lg button-lg delete" title="Delete">
<i class="fa fa-trash"></i>
</a>
</td>
</tr>`)
    })
}