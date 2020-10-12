import colorLog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import {pixelToVW} from '/static/html/components/component_modules/convert/convert.mjs'
import Storage from '/static/html/components/component_modules/storage/index.mjs'
let storage = Storage()
let slot = async (v,p,c,obj,r) => {
    let imageSlot = {}
    switch (p._) {
        case 'image':
            imageSlot = document.createElement('slot')
            imageSlot.name = `${p.name}`
            obj.preset.container.appendChild(imageSlot)
            break
        case 'txt':
obj.preset.container.insertAdjacentHTML('beforeend',`
<label for="${p.name}">
 <select>
     <option>text</option>
     <option>link</option>
 </select>
<slot name="${p.name}"></slot>
<input
     id="${p.name}"
     type="submit"
     onclick="window.location='https://zababurinsv.github.io/ide-design/';"
     style="display: none"
/>
</label>
            
            `)

            // imageSlot = document.createElement('slot')
            // imageSlot.name = `${p.name}`
            // obj.preset.container.appendChild(imageSlot)
            break
        default:
            console.warn('неисвестный тип данных', p)
            break
    }
    return true
}

export default async (v,p,c,obj,r) => {
    // console.log('########33333##########',await (await storage).customEvent(v,p,c,obj,'/storage/set/item'))
    switch (p._) {
        case 'image':
            colorLog(v,p.class,'orange',p,r)
            let image = p.canvas
            let styleImage = obj['this'].querySelector('style')
            styleImage.insertAdjacentHTML('beforeend',`
            .${p.class} {  
                    position:absolute;
                    width:${pixelToVW(p.width)}vw;
                    top:${pixelToVW(p.top)}vw;
                    left:${pixelToVW(p.marginLeft)}vw;
                }
            `)
            image.classList.add(`${p.class}`)
            image.setAttribute('slot',`${p['slot']}`)
            // image.style.marginLeft = `${pixelToVW(p.marginLeft)}vw`
            // image.style.width = `${pixelToVW(p.width)}vw`
            // image.style.position = 'absolute'
            // image.style.left = '0'
            // image.style.top = `${pixelToVW(p.top)}vw`
            if(p.name !== 'bg') {
                obj.PSD.container.appendChild(image)
                slot(v,p,c,obj,r)
            }
            break
        case 'txt':
            colorLog(v,p.class,'green',p,r)
            let paragraph = document.createElement('p')
            paragraph.classList.add(`${p.class}`)
            paragraph.setAttribute('slot',`${p['slot']}`)
            paragraph.innerText = p.text
            obj.PSD.container.appendChild(paragraph)
            let style = obj['this'].querySelector('style')
            style.insertAdjacentHTML('beforeend',`
            .${p.class} {
                white-space:pre-wrap;
                font-family:${p.style.fontFamily};
                font-size:${pixelToVW(p.style.fontSize)}vw;
                color: ${p.style.color};
                position:absolute;
                top:${pixelToVW(p.top)}vw;
                left:${pixelToVW(p.marginLeft)}vw;
                }
            `)
            console.log({
                "class":p.class,
                "white-space":"pre-wrap",
                "font-family":`${p.style.fontFamily}`,
                "font-size":`${pixelToVW(p.style.fontSize)}vw`,
                "color": p.style.color,
                "position":'absolute',
                "top":`${pixelToVW(p.top)}vw`,
                "left":`${pixelToVW(p.marginLeft)}vw`

            })
            // paragraph.style.whiteSpace = 'pre-wrap'
            // paragraph.style.fontFamily = p.style.fontFamily
            // paragraph.style.fontSize = `${pixelToVW(p.style.fontSize)}vw`
            // paragraph.style.color = p.style.color
            // paragraph.style.marginLeft =
            // paragraph.style.position = 'absolute'
            // paragraph.style.left = `${pixelToVW(p.marginLeft)}vw`
            // paragraph.style.top = `${pixelToVW(p.top)}vw`
            slot(v,p,c,obj,r)
            break
        default:
            colorLog(v,p,'yellow',obj,r)
            console.warn('неисвестный тип данных', p)
            break
    }
    colorLog(false,'end', c, obj, r)
}