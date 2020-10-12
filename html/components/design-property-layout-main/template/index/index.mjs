import colorLog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import {pixelToVW} from '/static/html/components/component_modules/convert/convert.mjs'

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
    switch (p._) {
        case 'image':
            colorLog(v,p.class,'orange',p,r)
            let image = p.canvas
            image.setAttribute('slot',`${p['slot']}`)
            image.style.marginLeft = `${pixelToVW(p.marginLeft)}vw`
            image.style.width = `${pixelToVW(p.width)}vw`
            image.style.position = 'absolute'
            image.style.left = '0'
            image.style.top = `${pixelToVW(p.top)}vw`
            if(p.name !== 'bg') {
                obj.PSD.container.appendChild(image)
                slot(v,p,c,obj,r)
            }
            break
        case 'txt':
            colorLog(v,p.class,'green',p,r)
            let paragraph = document.createElement('p')
            paragraph.classList.add(`${p.class.split(' ')[0]}`)
            paragraph.style.whiteSpace = 'pre-wrap'
            paragraph.innerText = p.text
            paragraph.style.fontFamily = p.style.fontFamily
            paragraph.style.fontSize = `${pixelToVW(p.style.fontSize)}vw`
            paragraph.setAttribute('slot',`${p['slot']}`)
            paragraph.style.color = p.style.color
            paragraph.style.marginLeft = `${pixelToVW(p.marginLeft)}vw`
            paragraph.style.width = p.width
            paragraph.style.position = 'absolute'
            paragraph.style.left = '0'
            paragraph.style.top = `${pixelToVW(p.top)}vw`
            obj.PSD.container.appendChild(paragraph)
            slot(v,p,c,obj,r)
            break
        default:
            colorLog(v,p,'yellow',obj,r)
            console.warn('неисвестный тип данных', p)
            break
    }
    // console.log('~~~~~~~~~~~~~~~',out)
    // out.setAttribute('slot',`${p['slot']}`)
    // out.style.marginLeft = p.marginLeft
    // out.style.width = p.width
    // out.style.position = 'absolute'
    // out.style.left = '0'
    // out.style.top = p.top
    // obj['PSD']['container'].appendChild(out)
    // console.log('p--->', p)
    // let item = document.createElement('div')
    // item.classList.add("mystyle");
    // let container = obj['this']['shadowRoot'].querySelector('.design-property-layout-main')
    // container.insertAdjacentHTML('beforeend',`
    //   <slot name="layout-main"></slot>
    //         <slot name="Zababurin Sergey       email: s.zababurin.v@gmail.com       pho"></slot>
    //         <div class="design-property-layout-main-elements-dev">
    //             <select>
    //                 <option>text</option>
    //                 <option>link</option>
    //             </select>
    //             <label for="homepage">
    //                 <slot name="DEV"></slot>
    //                 <input
    //                         id="homepage"
    //                         type="submit"
    //                         value="Go to my link location"
    //                         onclick="window.location='/my/link/location';"
    //                 />
    //             </label>
    //             <p><a href="http://localhost:2222/"><slot name="DEV"></slot></a></p>
    //         </div>
    //         <div class="design-property-layout-main-elements-prod">
    //             <slot name="PROD"></slot>
    //         </div>
    //         <div class="design-property-layout-main-elements-lab">
    //             <slot name="LAB"></slot>
    //         </div>
    //         <!--            <slot name="HELP"></slot>-->
    //         <!--            <slot name="ERASE"></slot>-->
    //         <!--            <slot name="|"></slot>-->
    //         <slot name="Web"></slot>
    //         <slot name="Dashboard"></slot>
    //         <slot name="line"></slot>
    //         <slot name="ORG"></slot>
    //         <slot name="red"></slot>
    //         <slot name="green"></slot>
    //         <slot name="Localhost"></slot>
    //         <slot name="yellow"></slot>
    //         <slot name="LAB"></slot>
    //
    // `)
    colorLog(false,'end', c, obj, r)
}