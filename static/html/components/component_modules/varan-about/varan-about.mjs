import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import action from '/static/html/components/component_modules/action/action.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'

(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {

        // for(let m = 0; m < config['store']['varan-about'].length; m++){
        //     switch (config['store']['varan-about'][m]['slot']) {
        //         case 'about-admin':
        //
        //             break
        //         case 'varan-about':
        //
        //
        //             break
        //         default:
        //             break
        //     }
        // }
        await action({
            input:'varan-about',
            target:config['store']['varan-about'][0]['this'].shadowRoot.querySelector('section'),
            this: config['store']['varan-about'][0]['this'],
            type:'IntersectionObserver'
        },'set','type')
        let about = await matcher['webdav']({
            input:'varan-about',
            type:'about',
            path:'/about'
        },'get','type')

        if(config['store']['varan-about'][0]['this'].shadowRoot.querySelector('.main') === null){


        }else{
            config['store']['varan-about'][0]['this'].shadowRoot.querySelector('.main').innerHTML = ''
            config['store']['varan-about'][0]['this'].shadowRoot.querySelector('.main').insertAdjacentHTML('afterbegin', about)

            config['store']['varan-about'][0]['this'].shadowRoot.querySelector('.video').addEventListener('click', function() {


                if(config['store']['varan-about'][0]['this'].shadowRoot.querySelector('.video').paused === true){
                    config['store']['varan-about'][0]['this'].shadowRoot.querySelector('.video').play();
                }else{
                    config['store']['varan-about'][0]['this'].shadowRoot.querySelector('.video').pause()
                }
            });
        }

    })
})()
