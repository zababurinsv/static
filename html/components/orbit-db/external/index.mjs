// import events from '/static/html/components/lib-markdown/external/events.mjs'
// import IDBFS from '/static/html/components/lib-markdown/external/wasm/idbfs.mjs'
// import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
// import Parser from '/static/html/components/component_modules/bundle/html2json/html2json.index.mjs'
// import * as md2html from  '/static/html/components/lib-markdown/external/wasm/markdown.es.mjs'
// import OrbitDb from '/static/html/components/component_modules/bundle/orbit/orbit.index.mjs'
export default async (v,p,c,obj,r) => {
    const target = {
        notProxied: "original value",
        proxied: "original value"
      };
    const handler = {
    get: function(target, prop, receiver) {
        if (prop === "proxied") {
            return "replaced value";
        }
            return Reflect.get(...arguments);
        }
    };

    let system = {
        _scriptDir: import.meta.url,
        ptr: {},
        validation: {
            key: (...args) =>{ return system.validation.value },
            value: { onhashchange:("onhashchange" in window)}
        },
        pull: {
            "resolve": async (item) => {
                let pull = {}
                try {
                    pull = await fetch(`https://zababurinsv.github.io/markdown/${item? item: 'index'}.md`)
                        .catch((e)=>{
                            console.warn({ "error":e })
                        })
                    if(pull.status === 404) {
                        return false
                    } else {
                        pull = await pull.text();
                        system.value = pull
                        return pull
                    }
                }catch (e) {
                    return false
                }

            } 
        },
        location: location,
        value: {},
        json: {
            "ok":false,
            "status":false,
            "type": "main",
            "tagName": `${obj.this.tagName}`,
            "attributes": [{ "key": "href", "value": "#" }],
            "swap":[],
            "children": ''
        },
        proxy: new Proxy(target, handler),
        worker_main: { }
    }

    console.log('system', system)
}