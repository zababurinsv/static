import lazy from '/static/html/components/component_modules/lazy/lazy.mjs'
import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import IntersectionObserver from '/static/html/components/component_modules/IntersectionObserver/IntersectionObserver.mjs'
import action from '/static/html/components/component_modules/action/action.mjs'

(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {

        let json = await action({
            input:'lacerta-gallery',
            type:'jsonPhoto'
        },'get', 'type')
        await action({
            input:'lacerta-gallery',
            type:'jsonPhoto',
            data: json['mongo'],
            this: config['store']['lacerta-gallery'][0]['this']
        },'create', 'type')

        let img = await lazy({
            input:'lacerta-gallery',
            this: config['store']['lacerta-gallery'][0]['this'],
            type:'img'
        },'get', 'type')

        await IntersectionObserver({
            input:'lacerta-gallery',
            data:img,
            type: 'lazy'
        }, 'get', 'type')


        action({
            input:'lacerta-gallery',
            target:config['store']['lacerta-gallery'][0]['this'].shadowRoot.querySelector('details'),
            this: config['store']['lacerta-gallery'][0]['this'],
            type:'IntersectionObserver'
        },'set','type')
    })
})()
