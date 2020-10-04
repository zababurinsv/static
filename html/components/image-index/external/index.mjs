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
    await psd.write(true,'','red',obj,'psd-write')
}