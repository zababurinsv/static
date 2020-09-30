import psd from '/static/html/components/component_modules/bundle/psd/docs.mjs'
let config = {
    slot:['header','body','footer','components']
}

export default async (v,p,c,obj,r) => {
    let include = obj.this.shadowRoot.querySelector('.design-property-views')
    include['attachShadow']({mode: 'open'})
    let main = document.createElement('div')
    let header = obj['this']['shadowRoot'].querySelector('.design-property-views-header')
    let body = obj['this']['shadowRoot'].querySelector('.design-property-views-body')
    let footer = obj['this']['shadowRoot'].querySelector('.design-property-views-footer')
    header['attachShadow']({mode: 'open'})
    body['attachShadow']({mode: 'open'})
    footer['attachShadow']({mode: 'open'})
    let shadowHeader = header.querySelector('.root')
    let shadowBody = body.querySelector('.root')
    let shadowFooter = footer.querySelector('.root')
    header.shadowRoot.appendChild(shadowHeader)
    body.shadowRoot.appendChild(shadowBody)
    footer.shadowRoot.appendChild(shadowFooter)
    obj.views = {}
    obj.views.header = header
    obj.views.body = body
    obj.views.footer = footer
    for(let item of config.slot) {
        let div = document.createElement('div')
        let slot = document.createElement('slot')
        slot.name = item
        div.appendChild(slot)
        main.appendChild(div)
    }
    include.shadowRoot.appendChild(main)
    await psd.init(true,['psd'],'red',obj,'psd')
    await psd.write(true,['psd'],'red',obj,'psd-write')
}