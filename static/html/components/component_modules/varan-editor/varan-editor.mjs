import Editor from '/static/html/components/component_modules/editor/editor.mjs'
import Slider from '/static/html/components/component_modules/varan-slider/varan-slider.mjs'
import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import modalButton from '/static/html/components/component_modules/varan-modal-button/varan-modal-button.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'

(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {
for (let i = 0 ; i< config['store']['varan-editor'].length; i++){
    if(!config['store']['varan-editor'][i]['this'].querySelector('varan-menu')){
        console.assert(false, 'в редакторе должно быть меню')
    }
    let button = config['store']['varan-editor'][i]['this'].shadowRoot.querySelector('varan-modal-button')
    await  modalButton({
        input:'varan-editor',
        type:'addEventListener',
        this: button,
        parent: button.getAttribute('parent')
    },'set','type')
    let quill =  await  Editor({
        input:'varan-editor',
        export:'matcher, pagination, crop',
        this: config['store']['varan-editor'][i]['this'],
        slot:config['store']['varan-editor'][i]['slot'],
        parent:config['store']['varan-editor'][i]['parent'],
        menu:config['store']['varan-editor'][i]['this'].querySelector('varan-menu'),
        type:'editor'
    }, 'get', 'type')

    if(config['store']['varan-editor'][i]['slot'] === 'about'){

        let about = await matcher['webdav']({
            input:'varan-about',
            type:'aboutString',
            path:'/about',
            template: 'none'
        },'get','type')


        let store =  await staticProperty({
            input:'action',
            type: 'all'
        }, 'get', 'type')
        for(let i =0; i < store['varan-editor'].length; i++){
            if(store['varan-editor'][i]['slot'] === 'about'){

                store['varan-editor'][i]['editor']['quill'].root.innerHTML = about
            }
            console.log(store['varan-editor'][i]['slot'])
        }
        config['store']['varan-editor'][i]['this'].querySelector('.wall').insertAdjacentHTML('afterbegin', about)
            }
        }
    })
})()
