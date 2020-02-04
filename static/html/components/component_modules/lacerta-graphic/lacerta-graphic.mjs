import router from '/static/html/components/component_modules/router/router.mjs'
import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {

        router({
            input:'lacerta-graphic',
            this: config['store']['lacerta-graphic'][0]['this'],
            type:'listener'
        }, 'link', 'type')

    })
})()
