import isEmpty from "../isEmpty/isEmpty";

function first(v,p,c,obj,r) {

}
export default (v,p,c,obj,r) =>{
    return new Promise(async (resolve, reject)=>{
        for(let item of p) {
            if(isEmpty(item.canvas)) {
                console.warn('нет canvas', item)
            } else {
                let out = {}
                if(!isEmpty(item.text)) {
                    console.log(`<slot name=${item.name}> </slot>`,`text`,  {
                        text: item.text.text,
                        style: {
                            name222:item,
                            name:item.text.style.font.name,
                            fontSize: item.text.style.fontSize,
                            LineHeight: item.text.style.fontSize + (item.text.style.leading / 2)
                        },
                        orientation: item.text.orientation
                    })

                    let txt = document.createElement('p')
                    out = txt
                    txt.style.whiteSpace = 'pre-wrap'
                    txt.innerText = item.text.text
                    txt.style.fontFamily = `${item.text.style.font.name}, serif`
                    txt.style.fontSize = `${item.text.style.fontSize * 0.432}px`
                    txt.setAttribute('slot',`${item['name']}`)
                } else {
                    console.log(`<slot name=${item.name}> </slot>`)
                    out = item.canvas
                }

                out.setAttribute('slot',`${item['name']}`)
                out.style.marginLeft = `${item.left * obj['PSD']['layout']['size']['WidthWindow']}px`
                out.style.width = `${obj['PSD']['layout']['size']['WidthWindow'] * item.canvas.width}px`
                out.style.position = 'absolute'
                out.style.background = 'yellow'
                out.style.left = '0'
                out.style.top = `${item.top * obj['PSD']['layout']['size']['WidthWindow']}px`
                obj['PSD']['container'].appendChild(out)
            }
        }
    })
}