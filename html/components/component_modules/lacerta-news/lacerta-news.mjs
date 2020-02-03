import action from '/static/html/components/component_modules/action/action.mjs'
import staticProperty from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'

(async ()=>{
    bundle['default']({
        input:'object'
    },null, async function (error, config) {
        for(let m = 0; m < config['store']['lacerta-news'].length; m++){
            switch (config['store']['lacerta-news'][m]['slot']) {
                case 'news-admin':
                    config['store']['lacerta-news'][m]['img'] = config['store']['lacerta-news'][m]['this'].shadowRoot.querySelector('.gallery')
                    break
                default:
                    break
            }

        }


        await  staticProperty({
            input:'lacerta-news',
            type:'store',
            store:config['store']['lacerta-news']
        },'set', 'type')
        for(let m = 0; m < config['store']['lacerta-news'].length; m++){
            switch (config['store']['lacerta-news'][m]['slot']) {
                case 'news-admin':
                    config['store']['lacerta-news'][m]['this'].shadowRoot.querySelector('#image').onchange = function (event) {

                        let crop = new CustomEvent('sideBarCrop', {
                            detail: {
                                id: 'lacerta-news',
                                slot: config['store']['lacerta-news'][m]['slot'],
                                file: event.target.files[0]
                            }
                        })
                        document.dispatchEvent(crop)
                        event.target.value = '';
                    }
                    break
                case 'lacerta-news':
                    let feeds = await action({
                        input:'lacerta-news',
                        type:'template'
                    }, 'get', 'type')


                    // console.assert(false,feeds )
                    if(!feeds['items']){
                    }else{
                        if(feeds['items'].length === 0){
                        }else{
                            config['store']['lacerta-news'][m]['this'].shadowRoot.querySelector('#news').innerHTML = ''
                            for(let i = 0; i < feeds['items'].length; i ++){
                                config['store']['lacerta-news'][m]['this'].shadowRoot.querySelector('#news').insertAdjacentHTML('beforeend',feeds['items'][i] )
                                let item = config['store']['lacerta-news'][m]['this'].shadowRoot.querySelector(`.item_${i}`)
                                let parent = item.querySelector('.date').parentNode
                                let timestamp = item.querySelector('.timestamp').innerText
                                timestamp = +timestamp
                                let date = new Date(timestamp);
                                date = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear()
                                parent.querySelector('.date').style.display = 'none'
                                parent.querySelector('.title').insertAdjacentHTML('afterend', `<h3>${date}</h3>`)

                                item.addEventListener('click', (event) => {
                                    if(window['location']['pathname'] === '/admin' || window['location']['pathname'] === '/admin/'){
                                        event.target.open = true
                                    }else{
                                        if(event.target.parentNode.parentNode.tagName === 'SUMMARY' &&  event.target.parentNode.tagName === 'SECTION'){
                                            if(event.target.tagName === 'DIV' && event.target.parentNode.tagName === 'SECTION'){
                                                event.preventDefault();
                                                event.target.open = false

                                            }else{

                                            }
                                        }else  if(event.target.parentNode.tagName === 'SUMMARY' && event.target.tagName === 'P' ||
                                            event.target.tagName === 'SPAN' && event.target.parentNode.tagName === 'P' && event.target.parentNode.parentNode.tagName === 'SUMMARY' ||
                                            event.target.tagName === 'EM' && event.target.parentNode.tagName === 'P' ){


                                        }else{
                                            if(event.target.tagName === 'A' && event.target.parentNode.tagName === 'P'){
                                                console.log('dddddddddddd4444ddddd')

                                            }else{
                                                event.preventDefault();
                                                event.target.open = false
                                            }


                                        }


                                    }
                                })

                                item.querySelector('.delete').addEventListener('click', (event) => {
                                    let target = event.target
                                    let verify = false
                                    while (!verify) {
                                        if(target.tagName === 'DETAILS' && target.className.indexOf('item') > -1){
                                            verify = true
                                        }else{
                                            target = target.parentNode
                                        }
                                    }
                                    let date = {}
                                    date['timestamp'] = target.querySelector('.timestamp').innerText
                                    date['timestamp'] = +date['timestamp']
                                    date['iso'] =  target.querySelector('.date').innerText
                                    date['utc'] =  (new Date(date['timestamp'])).toUTCString()
                                    let result = confirm('Вы точно хотите удалить новость ?');
                                    if(result){
                                        target.querySelector('.change').remove()
                                        target.querySelector('.delete').innerText = 'Идёт процесс удаления'
                                        target.querySelector('.delete').style.backgroundColor = 'red'
                                        target.querySelector('.delete').disabled = true

                                        staticProperty({
                                            type:'task',
                                            task: {
                                                type:'delete',
                                                date:date,
                                                remove:target
                                            }
                                        },'task', 'type')
                                    }else{


                                    }

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
                                    event.target.innerText = 'данные добавляются в редактор'
                                    event.target.disabled = true;
                                    let date = {}
                                    date['timestamp'] = target.querySelector('.timestamp').innerText
                                    date['timestamp'] = +date['timestamp']
                                    date['iso'] =  target.querySelector('.date').innerText
                                    date['utc'] =  (new Date(date['timestamp'])).toUTCString()

                                    staticProperty({
                                        type:'task',
                                        task: {
                                            button:  event.target,
                                            type:'update',
                                            date:date,
                                            this:target
                                        }
                                    },'task', 'type')
                                })
                            }

                        }
                    }
                    break
                default :
                    break

            }

        }
    })
})()
