import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import action from '/static/html/components/component_modules/action/action.mjs'
import addEventListener from '/static/html/components/component_modules/addEventListener/addEventListener.mjs'

(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {
        action({
            input:'lacerta-request',
            target: config['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('section'),
            this: config['store']['lacerta-request'][0]['this'],
            type:'IntersectionObserver'
        },'set','type')

        action({
            input:'lacerta-request',
            target:config['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('section'),
            this: config['store']['lacerta-request'][0]['this'],
            type:'IntersectionObserver'
        },'set','type')

        // console.assert(false , obj['this'].shadowRoot.querySelector('#request'))
        addEventListener({
            input:'lacerta-request',
            type:'lacerta-request',
            data: config['store']['lacerta-request'][0]['this'].shadowRoot.querySelector('.request')
        },'set', 'type')

    })
})()
