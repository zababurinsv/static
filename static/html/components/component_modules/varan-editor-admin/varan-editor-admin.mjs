import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'

(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {
        await  staticProperty({
            input:'varan-editor-admin',
            type:'store',
            store:config['store']['varan-editor-admin']
        },'set', 'type')
    })
})()
