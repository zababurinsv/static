import heap from '/static/html/components/component_modules/heap/heap.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs'
export default {
    set:(view,property,color,substrate,relation)=>{
        return new Promise(function (resolve, reject) {
            console.log(`${emoji('moon')[1][0]}`, relation)
            heap(view, property,color,substrate ,relation, (event)=>{
                console.log(`    ${emoji('moon')[2][0]}`, event)
                resolve(event)
            })
        })
    },
    get:(view,property,color,substrate,relation, callback)=>{
        console.log(`${emoji('moon')[0][0]}`, relation)
        return heap(view, 'await',color,{property, substrate} ,relation, callback)
    },
    list:async (view,property,color,substrate,relation, callback) => {
        let list = await heap(view, 'list')
        console.log(`${emoji('moon')[0][1]}`, list)
        return list
    },
    close:async (view,property,color,substrate,relation, callback)=>{
        let remove = await heap(view,'close',color,substrate,relation)
        console.log(`${emoji('moon')[0][3]}`, remove)
        return true
    }
}