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
    list:(view,property,color,substrate,relation, callback)=>{
        console.log(`${emoji('moon')[0][1]}`, relation)
        return true
    },
    close:(view,property,color,substrate,relation, callback)=>{
        console.log(`${emoji('moon')[0][3]}`, relation)
        return true
    }
}