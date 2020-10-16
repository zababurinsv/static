import colorLog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import {pixelToVW} from '/static/html/components/component_modules/convert/convert.mjs'
import Storage from '/static/html/components/component_modules/storage/index.mjs'
let storage = Storage()
let downloads = true
let buttonTogle = true
let html =  document.createElement('div')
html.classList.add(`design-property-layout-main`)
let style = document.createElement('style')
style.insertAdjacentHTML('beforeend',`
@font-face {
    font-family: 'GothamPro';
    src: url('GothamPro.eot');
    src: url('GothamPro.eot?#iefix') format('embedded-opentype'),
    url('GothamPro.woff') format('woff'),
    url('GothamPro.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: 'GothamPro-Bold';
    src: url('GothamPro-Bold.eot?') format('eot'),
    url('GothamPro-Bold.otf')  format('opentype'),
    url('GothamPro-Bold.woff') format('woff'),
    url('GothamPro-Bold.ttf')  format('truetype'),
    url('GothamPro-Bold.svg#GothamPro-Bold') format('svg');
}
body {
    margin:0;
}
p {
    margin:0;
}
p:first-letter {
    margin-left: -0.06em;
}
.design-property-layout-main {
    width: 100%;
    position: relative;
}`)

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
async function imgTemplate(v,p,c,obj,r) {
    return `
<template>
${obj.html}
<style>
${obj.style}
</style>
</template>`
}
async function imgTag(v,p,c,obj,r) {
    let img = document.createElement('img')
    let dataURL = p.canvas.toDataURL();
    img.src = dataURL
    img.classList.add(`${p.class}`)
    img.setAttribute('slot',`${p['slot']}`)
    return img
}
async function imgViews(v,p,c,obj,r) {
return `
<!DOCTYPE html>
<html lang="ru">
<head>
    <title>Design</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=3.0, minimum-scale=0.86">
    <meta property="og:site_name" content="design"/>
    <meta property="og:locale" content="ru_RU"/>
    <meta property="og:type" content="contract"/>
    <meta property="og:title" content="design"/>
    <meta property="og:description" content="design"/>
    <meta property="og:url" content="https://zababurinsv.github.io/ide-design/"/>
    <meta property="og:image" content="https://i.imgur.com/pSrPUkJ.jpg"/>
    <meta property="og:image:width" content="537"/>
    <meta property="og:image:height" content="240"/>
</head>
<body>
${obj.html}
</body>
<style>
${obj.style}
</style>
</html>`
}
let slot = async (v,p,c,obj,r) => {
    let imageSlot = {}
    switch (p._) {
        case 'image':
            imageSlot = document.createElement('slot')
            imageSlot.name = `${p.name}`
            imageSlot.classList.add(`${p.class}`)
            obj.preset.container.appendChild(imageSlot)
            break
        case 'txt':
            // onclick="window.location='https://zababurinsv.github.io/ide-design/';"

            obj.preset.container.insertAdjacentHTML('beforeend',`
                <label for="${p.name}" class="${p.class}">
                    <slot name="${p.name}"></slot>
                         <select>
                             <option>text</option>
                             <option>link</option>
                         </select>
                        <input
                             id="${p.name}"
                             type="submit"
                             style="display: none"
                        />
                </label>`)
            break
        default:
            console.warn('неисвестный тип данных', p)
            break
    }
    return true
}

export default async (v,p,c,obj,r) => {
   if(buttonTogle){
       let button = obj['this']['shadowRoot'].querySelector('.design-property-layout_button')
       button.addEventListener('click',async (event)=>{
           storage = await storage
           let imgV = await imgViews(v,p,c,{
               style:style.innerHTML,
               html:html.outerHTML,
           })
           let imgT = await imgTemplate(v,p,c,{
               style:style.innerHTML,
               html:html.outerHTML,
           })
           storage.set(true, {
               style:style.innerHTML,
               html:html.outerHTML,
               template: imgT,
               views: imgV
           },'green',html.className,'set')
           download(`${imgV}`,'index.html', "txt")
       })
       buttonTogle = false
   }
    switch (p._) {
        case 'image':
            let styleLight = obj['this'].querySelector('style')
            style.insertAdjacentHTML('beforeend',`
            .${p.class} {
                position:absolute;
                width:${pixelToVW(p.width)}vw;
                top:${pixelToVW(p.top)}vw;
                left:${pixelToVW(p.left)}vw;
            }`)
            styleLight.insertAdjacentHTML('beforeend',`
            .${p.class} {
                position:absolute;
                width:${pixelToVW(p.width)}vw;
                top:${pixelToVW(p.top)}vw;
                left:${pixelToVW(p.left)}vw;
            }`)
            if(p.name !== "background") {
                let img = await imgTag(v,{
                    canvas:p.canvas,
                    class: `${p.class}`,
                    slot: `${p.slot}`
                },c,obj,p.name)
                obj.PSD.container.appendChild(img)
                if(downloads) {
                    let out = img.cloneNode(true);
                    html.appendChild(out)
                }
                slot(v,p,c,obj,r)
            }
            break
        case 'txt':
            let paragraph = document.createElement('p')
            paragraph.classList.add(`${p.class}`)
            paragraph.setAttribute('slot',`${p['slot']}`)
            paragraph.innerText = p.text
            obj.PSD.container.appendChild(paragraph)
            let styleShadow = obj['this']['shadowRoot'].querySelector('style')
            style.insertAdjacentHTML('beforeend',`
            .${p.class} {
                white-space:${(p.name === "contacts") ?'pre-wrap':'none'};
                font-family:${p.style.fontFamily};
                font-size:${pixelToVW(p.style.fontSize)}vw;
                color: ${p.style.color};
                position:absolute;
                top:${pixelToVW(p.top)}vw;
                left:${pixelToVW(p.left)}vw;
            }`)
            styleShadow.insertAdjacentHTML('beforeend',`
            .${p.class} {
                white-space:${(p.name === "contacts") ?'pre-wrap':'none'};
                font-family:${p.style.fontFamily};
                font-size:${pixelToVW(p.style.fontSize)}vw;
                color: ${p.style.color};
                position:absolute;
                top:${pixelToVW(p.top)}vw;
                left:${pixelToVW(p.left)}vw;
            }`)
            if(downloads) {
                let out = paragraph.cloneNode(true);
                html.appendChild(out)
            }
            slot(v,p,c,obj,r)
            break
        case 'hover':
            style.insertAdjacentHTML('beforeend',`
            .${p.class} {
                filter:${p.dropShadow};
                cursor: pointer;
            }`)
            let filterCss = obj['this'].querySelector('style')
            filterCss.insertAdjacentHTML('beforeend',`
            .${p.class} {
                filter:${p.dropShadow};
                cursor: pointer;
            }`)
            break
        case 'active':
            style.insertAdjacentHTML('beforeend',`
            .${p.class} {
                filter:${p.dropShadow};
                cursor: pointer;
            }`)
            let filterCssActive = obj['this'].querySelector('style')
            filterCssActive.insertAdjacentHTML('beforeend',`
            .${p.class} {
                filter:${p.dropShadow};
            }`)
            break
        default:
            console.warn('неисвестный тип данных', p)
            break
    }
    colorLog(false,'end', c, obj, r)
}