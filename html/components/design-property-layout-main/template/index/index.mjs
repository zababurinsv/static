import colorLog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import {pixelToVW} from '/static/html/components/component_modules/convert/convert.mjs'
import Storage from '/static/html/components/component_modules/storage/index.mjs'
import Zip from '/static/html/components/component_modules/bundle/zip/zip.index.mjs'
let storage = Storage()
let buttonTogle = true
let styleFonts = (v,p,c,obj,r) => {
return`@font-face {
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
`
}
let output = {
    out: false,
    light: false,
    shadow: false,
    html: document.createElement('div'),
    parent: (v,p,c,obj,r) => {
        return`p {
    margin:0;
}
p:first-letter {
    margin-left: -0.06em;
}
.${obj.PSD.layout.parentClass} {
    width: 100%;
    position: relative;
}
`}
}

let pseudo = {
    elements: [
        "after",
        "before",
        "cue",
        "cueRegion",
        "firstLetter",
        "firstLine",
        "fileSelectorButton",
        "selection",
        "slotted",
    ],
    classes: [
        "active",
        "left",
        "link",
        "checked",
        "not",
        "default",
        "defined",
        "disabled",
        "empty",
        "enabled",
        "focus",
        "aiming",
        "focusWithin",
        "host",
        "hover",
        "indeterminate",
        "inRange",
        "invalid",
        "lang",
        "valid",
        "visited",
        "target",
    ]
}

async function pseudoElement(v,p,c,obj,r) {
    if(pseudo.elements.some(item => (p.name.indexOf(item) > -1))) {
        return true
    } else {
        return false
    }
}

async function pseudoClass(v,p,c,obj,r) {
    if(pseudo.classes.some(item => (p.name.indexOf(item) > -1 ))) {
        return true
    } else {
        return false
    }
}

async function style(v,p,c,obj,r) {
    if(!output.out) {
        output.out = output.parent(v,p,c,obj,r)
    }
    if(!output.light) {
        output.light = obj['this'].querySelector('style')
    }
    if(!output.shadow) {
        output.shadow = obj['this']['shadowRoot'].querySelector('style')
    }
    switch (r) {
        case 'light':
            output.light.insertAdjacentHTML('beforeend',
                `.${p.class} {
                position:absolute;
                width:${pixelToVW(p.width)}vw;
                top:${pixelToVW(p.top)}vw;
                left:${pixelToVW(p.left)}vw;
                z-index:${(p.name === "background")?-1:10};
            }
            `)
            output.out = output.out +
`.${p.class} {
    position:absolute;
    width:${pixelToVW(p.width)}vw;
    top:${pixelToVW(p.top)}vw;
    left:${pixelToVW(p.left)}vw;
    z-index:${(p.name === "background")?-1:10};
}
`
            break
        case 'shadow':
            output.shadow.insertAdjacentHTML('beforeend',
                `.${p.class} {
                white-space:${(p.name === "contacts") ?'pre-wrap':'unset'};
                font-family:${p.style.fontFamily};
                font-size:${pixelToVW(p.style.fontSize)}vw;
                color: ${p.style.color};
                position:absolute;
                top:${pixelToVW(p.top)}vw;
                left:${pixelToVW(p.left)}vw;
            }`)
            output.out = output.out +
`.${p.class} {
    white-space:${(p.name === "contacts") ?'pre-wrap':'unset'};
    font-family:${p.style.fontFamily};
    font-size:${pixelToVW(p.style.fontSize)}vw;
    color: ${p.style.color};
    position:absolute;
    top:${pixelToVW(p.top)}vw;
    left:${pixelToVW(p.left)}vw;
}
`
            break
        default:
            console.warn('неизвестное состояние', r)
            break
    }
    return true
}

async function imgTag(v,p,c,obj,r) {
    let img = document.createElement('img')
    let dataURL = p.canvas.toDataURL();
    img.src = dataURL
    img.classList.add(`${p.class}`)
    img.setAttribute('slot',`${p['slot']}`)
    return img
}

async function outputTemplate(v,p,c,obj,r) {
    return`
<template>
${obj.html}
<style>
${obj.style}
</style>
</template>
`}

async function outputViews(v,p,c,obj,r) {
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
${obj.style.fonts}${obj.style.import}
</style>
</html>
`}

async function duplicateChildNodesAndCreateViewsAndCreateTemplate (v,p,c,obj,r) {
    output.html.classList.add(`${obj.parentClass}`);
    NodeList.prototype.forEach = Array.prototype.forEach;
    let removePageExternal = obj.html.querySelector('page-external')
    removePageExternal.remove()
    let removeStyle = obj.html.querySelector('style')
    removeStyle.remove()
    let children = obj.html.childNodes;
    children.forEach(function(item){
        let cln = item.cloneNode(true);
        if(cln.tagName !== undefined) {
            output.html.appendChild(cln);
        }
    });
    let views = await outputViews(v,p,c,{
        style:{
            fonts: obj.style.fonts,
            import: obj.style.import
        },
        html: output.html.outerHTML,
    })
    let template = await outputTemplate(v,p,c,{
        style: obj.style.import,
        html: output.html.outerHTML,
    })
    return {
        template: template,
        views: views,
    }
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
           let zip = new Zip['default']['JSZip']
           zip.file("index.css", output.out);
           let fonts = await fetch('/css/GothamPro/GothamPro.ttf')
           fonts = fonts.blob()
           zip.file("GothamPro.ttf", fonts);
           fonts = await fetch('/css/GothamPro-Bold/GothamPro-Bold.ttf')
           fonts = fonts.blob()
           zip.file("GothamPro-Bold.ttf", fonts);
           let html = obj['this'].cloneNode(true);
           let out = await duplicateChildNodesAndCreateViewsAndCreateTemplate(v,p,c,{
               parentClass:obj.PSD.layout.parentClass,
               style:{
                   fonts: styleFonts(v,p,c, obj, r),
                   import: output.out
               },
               html: html,
           }, r)
           zip.file("template", out.template);
           zip.file("index.html", out.views);
           zip.generateAsync({type: "blob"}).then(function(content) {
               Zip['default']['FileSaver'].saveAs(content, "download.zip");
           });
           // storage = await storage
           // storage.set(true, {
           //     style:style.innerHTML,
           //     html:html.outerHTML,
           //     template: imgT,
           //     views: imgV
           // },'green',html.className,'set')
           // download(`${imgV}`,'index.html', "txt")
       })
       buttonTogle = false
   }
    pseudo.elements.some(item => p.name.indexOf(item) )
    console.log('------------------',{
        all:p.name,
        elements: pseudo.elements.some(item => (p.name.indexOf(item) > -1)),
        classes: pseudo.classes.some(item => (p.name.indexOf(item) > -1 ))
    })
    switch (p._) {
        case 'image':
            style(v,p,c,obj,'light')
            let img = await imgTag(v,{
                canvas:p.canvas,
                class: `${p.class}`,
                slot: `${p.slot}`
            },c,obj,p.name)
            obj.PSD.container.appendChild(img)
            slot(v,p,c,obj,r)
            break
        case 'txt':
          let pseudoEl = await pseudoElement(v,p,c,obj,r)
          let pseudoCl = await pseudoClass(v,p,c,obj,r)
            if(pseudoEl || pseudoCl) {
                console.log('~~~~~~~~~~~~~>', p)
            } else {
                let paragraph = document.createElement('p')
                paragraph.classList.add(`${p.class}`)
                paragraph.setAttribute('slot',`${p['slot']}`)
                paragraph.innerText = p.text
                obj.PSD.container.appendChild(paragraph)
                style(v,p,c,obj,'shadow')
                slot(v,p,c,obj,r)
            }
            break
        case 'hover':
            let filterCss = obj['this'].querySelector('style')
            filterCss.insertAdjacentHTML('beforeend',`
            .${p.class} {
                filter:${p.dropShadow};
                cursor: pointer;
            }`)
            break
        case 'active':
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