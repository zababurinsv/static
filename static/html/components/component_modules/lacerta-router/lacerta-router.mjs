import router from '/static/html/components/component_modules/router/router.mjs'
import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {

        /**
         * возможно надо убрать в админ
         */
        await  staticProperty({
            input:'lacerta-moderator',
            type:'all',
            store:config['store']
        },'set', 'type')

          router({
            input:'varan-router',
            this: config['store']['lacerta-router'][0]['this'],
            type:'listener'
        }, 'link', 'type')
    })
})()
