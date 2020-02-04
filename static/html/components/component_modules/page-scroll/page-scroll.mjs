import router from '/static/html/components/component_modules/router/router.mjs'
import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import scroll from '/static/html/components/component_modules/scroll/scroll.mjs'
(async ()=>{
    bundle['default']({
        input:'page-scroll'
    },null, async function (error, config) {

        router({
            input:'page-scroll',
            this: config['store']['page-scroll'][0]['obj']['this'],
            type:'listener'
        }, 'link', 'type')
        // await staticProperty({
        //     input:'page-scroll',
        //     type:'store',
        //     store: config['store']
        // }, 'set', 'type')

        // console.assert(false, config['store']['page-scroll'][0])
        scroll({
            input:'page-scroll',
            type:'scroll',
            this:config['store']['page-scroll'][0]['this']
        },'set','type')
        let coord = document['body'].getBoundingClientRect()
        if(coord.y < 350){

            config['store']['page-scroll'][0]['obj']['this'].style.display = 'none'
        }
    })
})()
