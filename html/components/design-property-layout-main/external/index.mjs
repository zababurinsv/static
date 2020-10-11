import psd from '/static/html/components/component_modules/bundle/psd/docs.mjs'
import index from '/static/html/components/design-property-layout-main/template/index/index.mjs'
export default async (v,p,c,obj,r) => {
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
    await psd.write(true,'','red',obj,'design-property-layout-main')
}