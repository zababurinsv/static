import isEmpty from "/static/html/components/component_modules/isEmpty/isEmpty.mjs";

function color(item) {
    let txt = false
    let rgb = {}
    if(!isEmpty(item.text)) {
        txt = true
        if(item.text.style.hasOwnProperty('fillColor')) {
            rgb = `${item.text.style.fillColor.r},${item.text.style.fillColor.g},${item.text.style.fillColor.b},${item.text.style.fillColor.a}`
        } else if (item.text.style.hasOwnProperty('strokeColor')) {
            rgb = `${item.text.style.strokeColor.r},${item.text.style.strokeColor.g},${item.text.style.strokeColor.b},${item.text.style.strokeColor.a}`
        } else {
            console.assert(false, item.text.style)
        }
    }
    return {
        status: txt,
        color: rgb
    }
}

function element(v,item,c,obj,r) {
    let out = {}
    if(isEmpty(obj['preset']['action'])) {
        console.warn('не выбран action для preset -а')
    } else {
        obj['preset']['action'](v,item,c,obj,r)
    }
    // if(item._ === 'txt') {
    //     let txt = document.createElement('p')
    //     out = txt
    //     txt.style.whiteSpace = 'pre-wrap'
    //     txt.innerText = item.text
    //     txt.style.fontFamily = item.style.fontFamily
    //     txt.style.fontSize = item.style.fontSize
    //     txt.setAttribute('slot',`${item['slot']}`)
    //     txt.style.color = `rgb(${item.style.color})`
    // } else if (item._ === 'image') {
    //     out = item.canvas
    // }
    // out.setAttribute('slot',`${item['slot']}`)
    // out.style.marginLeft = item.marginLeft
    // out.style.width = item.width
    // out.style.position = 'absolute'
    // out.style.left = '0'
    // out.style.top = item.top
    // obj['PSD']['container'].appendChild(out)
}
export default (v,p,c,obj,r) =>{
    return new Promise(async (resolve, reject)=>{
        for(let item of p) {
            if(isEmpty(item.canvas)) {
                console.warn('нет canvas', item)
            } else {
                let txt = color(item)
                switch (item['name'].split(' ').length) {
                    case 1:
                        element(v, txt.status ? {
                            _: 'txt',
                            name:item['name'],
                            text: item.text.text,
                            slot:item['name'],
                            class:`${r}-${item['name']}`,
                            top:`${item.top * obj['PSD']['layout']['size']['WidthWindow']}px`,
                            width:`${item.canvas.width}px`,
                            marginLeft:`${item.left * obj['PSD']['layout']['size']['WidthWindow']}px`,
                            style: {
                                name:item.text.style.font.name,
                                fontFamily:`${item.text.style.font.name}, serif`,
                                fontSize: `${(item.text.style.fontSize * item.text.transform[0] * obj['PSD']['layout']['size']['WidthWindow']).toFixed(1)}px`,
                                LineHeight: item.text.style.fontSize + (item.text.style.leading / 2),
                                transform: item.text.transform,
                                color: txt.color,
                                whiteSpace:'pre-wrap'
                            },
                            orientation: item.text.orientation
                        } : {
                            _: 'image',
                            name:item['name'],
                            slot:item['name'],
                            top:`${item.top * obj['PSD']['layout']['size']['WidthWindow']}px`,
                            canvas:item.canvas,
                            width:`${item.canvas.width}px`,
                            marginLeft:`${item.left * obj['PSD']['layout']['size']['WidthWindow']}px`
                        }, c, obj, r)
                        break
                    default:
                        console.warn('нет обработчкика данных компонентов', item['name'])
                        break
                }
            }
        }
    })
}