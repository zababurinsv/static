import psd from '/static/html/components/component_modules/bundle/psd/psd.index.mjs'
import index from '/static/html/components/design-property-layout-main/template/index/index.mjs'
import Zip from '/static/html/components/component_modules/bundle/zip/zip.index.mjs'
let PSD = {
    file: false,
    block: false,
    render: false,
    save: false
}
export default async (v,p,c,obj,r) => {
    obj.this.shadowRoot.querySelector('#psd-file').addEventListener('input',async (event)=>{
        let reader = new FileReader();
        reader.onload = function() {
            PSD.file = this.result
        }
        reader.readAsArrayBuffer(event.path[0].files[0]);
    })
    obj.this.shadowRoot.querySelector('#psd-block').addEventListener('input',async (event)=>{
        PSD.block = event.target.value
    })
    obj.this.shadowRoot.querySelector('#psd-render').addEventListener('click',async (event)=>{
        if(!PSD.file || !PSD.block) {
            console.warn('выберете файл для обработки и введите название блока')
        } else {
            if(obj['preset']['status']) {
                switch (obj['preset']['name']) {
                    case 'index':
                        obj['preset']['action'] = index
                        obj['preset']['container'] = obj['this']['shadowRoot'].querySelector('.design-property-layout-main')
                        break
                    default:
                        console.warn('пресет не обрабатывается', obj['preset']['name'])
                        break
                }
            }
            await psd.write(true,PSD.file,'red',obj,`${PSD.block}`)
        }
    })
}