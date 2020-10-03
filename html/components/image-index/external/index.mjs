import psd from '/static/html/components/component_modules/bundle/psd/docs.mjs'
import events from '/static/html/components/image-index/external/events.mjs'
let config = {
    slot:['header','body','footer','components']
}
export default async (v,p,c,obj,r) => {
    events(v,p,c,obj,r)
    let include = obj.this.shadowRoot.querySelector('.design-property-layout')
    include['attachShadow']({mode: 'open'})
    let shadow = obj.this.shadowRoot.querySelector('.design-property-layout-main')
    include.shadowRoot.appendChild(shadow)
    // let main = document.createElement('div')
    // let header = obj['this']['shadowRoot'].querySelector('.design-property-views-header')
    // let body = obj['this']['shadowRoot'].querySelector('.design-property-views-body')
    // let footer = obj['this']['shadowRoot'].querySelector('.design-property-views-footer')
    // header['attachShadow']({mode: 'open'})
    // body['attachShadow']({mode: 'open'})
    // footer['attachShadow']({mode: 'open'})
    // let shadowHeader = header.querySelector('.root')
    // let shadowBody = body.querySelector('.root')
    // let shadowFooter = footer.querySelector('.root')
    // header.shadowRoot.appendChild(shadowHeader)
    // body.shadowRoot.appendChild(shadowBody)
    // footer.shadowRoot.appendChild(shadowFooter)
    // obj.views = {}
    // obj.views.header = header
    // obj.views.body = body
    // obj.views.footer = footer
    // for(let item of config.slot) {
    //     let div = document.createElement('div')
    //     let slot = document.createElement('slot')
    //     slot.name = item
    //     div.appendChild(slot)
    //     main.appendChild(div)
    // }
    // include.shadowRoot.appendChild(main)
    // obj.this.shadowRoot.querySelector('#psd-file').addEventListener('change',async (event)=>{
    //     let reader = new FileReader();
    //     reader.onload = (data) => {
    //         let arrayBuffer = reader.result
    //         console.assert(false)
    //         psd.upload(true,arrayBuffer,'red',obj,'psd-upload')
    //     }
    //     reader.readAsArrayBuffer(event.path[0].files[0]);
    // }, false)
    await psd.write(true,'','red',obj,'psd-write')
}