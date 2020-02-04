import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import action from '/static/html/components/component_modules/action/action.mjs'
import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import addEventListener from '/static/html/components/component_modules/addEventListener/addEventListener.mjs'
(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {
        for(let j = 0; j < config['store']['lacerta-moderator'].length; j ++){
            switch (config['store']['lacerta-moderator'][j]['slot']) {
                case 'moderator-admin':
                    config['store']['lacerta-moderator'][j]['img'] = config['store']['lacerta-moderator'][j]['this'].shadowRoot.querySelector('.moderator')


                    await  staticProperty({
                        input:'lacerta-moderator',
                        type:'store',
                        store:config['store']['lacerta-moderator']
                    },'set', 'type')

                    config['store']['lacerta-moderator'][j]['this'].shadowRoot.querySelector('#image').onchange = function (event) {
                        let crop = new CustomEvent('sideBarCrop', {
                            detail: {
                                id: 'lacerta-moderator',
                                slot: config['store']['lacerta-moderator'][j]['slot'],
                                file: event.target.files[0]
                            }
                        })
                        document.dispatchEvent(crop)
                        event.target.value = '';
                    }

                    break
                case 'lacerta-moderator':

                        let template =   await matcher['webdav']({
                            input:'varan-moderator',
                            type:'list',
                            data:{
                                type: 'moderator'
                            },
                            path:'/list'
                        },'post', 'type')
                        if(template.length === 0){

                        }else{
                            config['store']['lacerta-moderator'][j]['this'].shadowRoot.querySelector('.main').innerHTML = ''
                            for(let i = 0; i < template.length; i ++){

                                // console.assert(false, obj['this'].shadowRoot.querySelector('.main'))
                                // console.assert(false, template[i])


                                config['store']['lacerta-moderator'][j]['this'].shadowRoot.querySelector('.main').insertAdjacentHTML('beforeend',template[i] )
                                let item = config['store']['lacerta-moderator'][j]['this'].shadowRoot.querySelector(`.item_${i}`)
                                let timestamp = item.querySelector(`.timestamp`).innerText
                                timestamp = +timestamp

                                item.addEventListener('click', (event) => {
                                    if(window['location']['pathname'] === '/admin' || window['location']['pathname'] === '/admin/'){

                                    }else{
                                        if(event.target.tagName === 'P' && event.target.parentNode.tagName === 'SUMMARY' ||
                                            event.target.tagName === 'SPAN' && event.target.parentNode.tagName === 'P' && event.target.parentNode.parentNode.tagName === 'SUMMARY' ||
                                            event.target.tagName === 'EM' && event.target.parentNode.tagName === 'P' ){

                                        }else{

                                            event.preventDefault();
                                            event.target.open = false
                                        }
                                    }
                                })

                                item.querySelector('.delete').addEventListener('click', async (event) => {
                                    let target = event.target
                                    let verify = false
                                    while (!verify) {
                                        if(target.tagName === 'DETAILS' && target.className.indexOf('item') > -1){
                                            verify = true
                                        }else{
                                            target = target.parentNode
                                        }
                                    }

                                    let dateVery =  target.querySelector('.timestamp').innerText
                                    dateVery = +dateVery
                                    await action({
                                        input:'lacerta-moderator',
                                        this: config['store']['lacerta-moderator'][0]['this'],
                                        date:dateVery,
                                        remove:target,
                                        type:'moderator'
                                    }, 'delete', 'type')
                                    target.remove()
                                })


                                item.querySelector('.change').addEventListener('click', async (event) => {
                                    let target = event.target
                                    let verify = false
                                    while (!verify) {
                                        if(target.tagName === 'DETAILS' && target.className.indexOf('item') > -1){
                                            verify = true
                                        }else{
                                            target = target.parentNode
                                        }
                                    }
                                    let dateVery =  target.querySelector('.timestamp').innerText
                                    dateVery = +dateVery
                                    let editor =  await staticProperty({
                                        input:'action',
                                        type: 'all'
                                    }, 'get', 'type')

                                    // editor['varan-editor'] = config['store']['varan-editor']
                                    event.target.innerText = 'данные добавляются в редактор'
                                    event.target.disabled = true;
                                    for(let i = 0; i < editor['varan-editor'].length; i++){
                                        switch (editor['varan-editor'][i].slot) {
                                            case 'moderator':
                                                // console.assert(false, target.querySelector('.preview').innerHTML)
                                                editor['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML =''
                                                editor['varan-editor'][i]['obj']['this'].querySelector('.wall').insertAdjacentHTML('afterbegin', target.querySelector('.preview').innerHTML);
                                                editor['varan-editor'][i]['editor']['quill'].root.innerHTML = ''
                                                editor['varan-editor'][i]['editor']['quill'].root.innerHTML = target.querySelector('.preview').innerHTML


                                                let convert_t = {}
                                                let update_t = {}
                                                if(editor['varan-editor'][i]['obj']['this'].querySelector('.menu-convert') === null){
                                                    convert_t = editor['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                                                    convert_t =   convert_t.shadowRoot.querySelector('.menu-convert')
                                                }else{
                                                    convert_t = editor['varan-editor'][i]['obj']['this'].querySelector('.menu-convert')
                                                }
                                                if(editor['varan-editor'][i]['obj']['this'].querySelector('.update') === null){
                                                    update_t = editor['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                                                    update_t =   update_t.shadowRoot.querySelector('.update')
                                                }else{
                                                    update_t = editor['varan-editor'][i]['obj']['this'].querySelector('.update')
                                                }

                                                if(update_t !== null){
                                                    update_t.remove()
                                                }
                                                convert_t.insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)

                                                if(editor['varan-editor'][i]['obj']['this'].querySelector('.update') === null){
                                                    update_t = editor['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                                                    update_t =   update_t.shadowRoot.querySelector('.update')
                                                }else{
                                                    update_t = editor['varan-editor'][i]['obj']['this'].querySelector('.update')
                                                }
                                                addEventListener({
                                                    input:'lacerta-moderator',
                                                    type:'menu-update',
                                                    data: update_t
                                                }, 'add', 'type')
                                                break
                                            case 'moderatorContent':
                                                editor['varan-editor'][i]['obj']['this'].querySelector('.wall').innerHTML = ''
                                                editor['varan-editor'][i]['obj']['this'].querySelector('.wall').insertAdjacentHTML('afterbegin',  target.querySelector('.content').innerHTML);
                                                // editor['varan-editor'][i]['editor']['quill'].root.innerHTML = ''
                                                editor['varan-editor'][i]['obj']['this'].querySelector('.ql-editor').innerHTML =  target.querySelector('.content').innerHTML

                                                let convert = {}
                                                let update = {}
                                                if(editor['varan-editor'][i]['obj']['this'].querySelector('.menu-convert') === null){
                                                    convert = editor['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                                                    convert =   convert.shadowRoot.querySelector('.menu-convert')
                                                }else{
                                                    convert = editor['varan-editor'][i]['obj']['this'].querySelector('.menu-convert')
                                                }
                                                convert.insertAdjacentHTML('afterend', `<button class="update" type="button">update</button>`)
                                                if(editor['varan-editor'][i]['obj']['this'].querySelector('.update') === null){
                                                    update = editor['varan-editor'][i]['obj']['this'].querySelector('varan-menu')
                                                    update =   update.shadowRoot.querySelector('.update')
                                                }else{
                                                    update = editor['varan-editor'][i]['obj']['this'].querySelector('.update')
                                                }

                                                addEventListener({
                                                    input:'lacerta-moderator',
                                                    type:'menu-update',
                                                    data: update
                                                }, 'add', 'type')
                                                break
                                            default:
                                                break

                                        }
                                    }
                                    for(let i = 0; i < config['store']['lacerta-moderator'].length; i++){
                                        switch (config['store']['lacerta-moderator'][i].slot) {
                                            case 'moderator-admin':
                                                config['store']['lacerta-moderator'][i]['obj']['this'].shadowRoot.querySelector('.timestamp').innerText = target.querySelector('.timestamp').innerText
                                                config['store']['lacerta-moderator'][i]['obj']['this'].shadowRoot.querySelector('#titleItem').value =  target.querySelector('h2').innerText
                                                config['store']['lacerta-moderator'][i]['obj']['this'].shadowRoot.querySelector('.moderator').src = target.querySelector('.moderator').src
                                                break
                                            case 'moderatorContent':

                                                break
                                            default:
                                                break

                                        }
                                    }
                                    event.target.innerText = 'данные в редакторе'
                                    setTimeout(()=>{
                                        obj['button'].innerText = 'изменить'
                                        obj['button'].disabled = false;
                                    }, 2000);
                                })

                            }
                        }
                    break
                default:
                    break

            }
        }
    })
})()
