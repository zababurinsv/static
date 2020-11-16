import events from '/static/html/components/varan-header/external/events.mjs'
export default async (v,p,c,obj,r) => {
    events(v,p,c,obj,r)
    if(obj.preset.status) {
      let template = (await import(`/static/html/components/varan-header/template/${obj.preset.name}/${obj.preset.name}.mjs`))['default']
        template(v,p,c,obj,r)
    }
}