import router from '/static/html/components/component_modules/router/router.mjs'
(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {

        if(config['store']['varan-gallery'][0]['this'].shadowRoot.querySelector('.video') === null){

        }else{
            config['store']['varan-gallery'][0]['this'].shadowRoot.querySelector('.video').addEventListener('click', function() {

                if(config['store']['varan-gallery'][0]['this'].shadowRoot.querySelector('.video').paused === true){
                    config['store']['varan-gallery'][0]['this'].shadowRoot.querySelector('.video').play();
                }else{
                    config['store']['varan-gallery'][0]['this'].shadowRoot.querySelector('.video').pause()
                }
            });
        }
        router({
            input:'varan-gallery',
            this: config['store']['varan-gallery'][0]['this'],
            type:'listener'
        }, 'link', 'type')
    })
})()
