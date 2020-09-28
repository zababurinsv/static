import psd from '/static/html/components/component_modules/bundle/psd/docs.mjs'
let config = {
    slot:['header','body', 'footer', 'components']
}
export default async (v,p,c,obj,r) =>{
    let include = obj.this.shadowRoot.querySelector('.design-property-views')
    include['attachShadow']({mode: 'open'})
    let main = document.createElement('div')

    for(let item of config.slot){
        let div = document.createElement('div')
        let slot = document.createElement('slot')
        slot.name = item
        div.appendChild(slot)
        main.appendChild(div)
    }
    include.shadowRoot.appendChild(main)

    let obj01 = await psd.init(true,['psd'],'red',obj,'psd')
    let obj02 = await psd.write(true,['psd'],'red',obj,'psd-write')
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',include)
}