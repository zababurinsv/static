export default async (obj)=>{
    return new Promise((resolve, reject) => {
        bundle['default'](obj,'export', async function (error, config) {
            let object = {}
            object.statticProperty = []
            object['count'] = 0
            object['updateChatLastMessage'] = async (obj, data)=>{

                let privateChat =  sessionStorage.getItem('PrivateChat');
                privateChat = parseInt(privateChat, 10)
                let me =  sessionStorage.getItem('id');
                me = parseInt(me, 10)
                // console.assert(false, data['id'])
                // console.log(privateChat)
                // console.log(me)
                // console.log( data['data'])
                // console.assert(false, data['data']['last_message']['sender_user_id'])
                // console.log(privateChat, data['chat_id'])
                if(privateChat === data['chat_id']){
                    if(privateChat === me){
                        let message_id =  sessionStorage.getItem('message_id');
                        if(config['isEmpty'](message_id)){
                            sessionStorage.setItem('message_id', data['id']);
                        }else{
                            if(message_id === data['id']){}else{
                                sessionStorage.setItem('message_id', data['id']);
                                if(config['isEmpty'](data['data']['last_message']['sending_state'] )){
                                    if(me === data['data']['last_message']['sender_user_id']){
                                        obj['this']['shadowRoot'].querySelector('#panel').insertAdjacentHTML('afterbegin', `
                    <div class="messageLeft"><p>${data['content']}</p></div>`)
                                        return obj
                                    }else if(privateChat === data['data']['last_message']['sender_user_id']){
                                        obj['this']['shadowRoot'].querySelector('#panel').insertAdjacentHTML('afterbegin', `
                     <div class="messageRight"><p>${data['content']}</p></div>`)
                                        return obj
                                    }
                                }
                            }
                        }

                    }else{

                        let message_id =  sessionStorage.getItem('message_id');
                        if(config['isEmpty'](message_id)){
                            sessionStorage.setItem('message_id', data['id']);
                        }else{
                            if(message_id === data['id']){}else{
                                if(config['isEmpty'](data['data']['last_message']['sending_state'] )){
                                    sessionStorage.setItem('message_id', data['id']);
                                    if(me === data['data']['last_message']['sender_user_id']){
                                        obj['this']['shadowRoot'].querySelector('#panel').insertAdjacentHTML('afterbegin', `
                    <div class="messageLeft"><p>${data['content']}</p></div>`)
                                        return obj
                                    }else if(privateChat === data['data']['last_message']['sender_user_id']){
                                        obj['this']['shadowRoot'].querySelector('#panel').insertAdjacentHTML('afterbegin', `
                     <div class="messageRight"><p>${data['content']}</p></div>`)
                                        return obj
                                    }
                                }

                            }
                        }
                    }

                }
            }

            object['setMessage'] = async (obj, data)=>{
                return obj
            }
            object['template'] = async (obj, data) =>{

                object.statticProperty['id'] = data
                obj['this']['shadowRoot'].querySelector('#chat').innerHTML = ''
                obj['this']['shadowRoot'].querySelector('#chat').insertAdjacentHTML('afterbegin',`
<div id="panel">
    
                
</div>
                
                `)
            }
            object['template'].id = 'right'
            object['template'].className = 'sidebar'

            object['class'] = class Chat {
                constructor(name) {
                    this.webComponents = obj['name'];
                    this.template = this.template.bind(this)
                    this.setMessage = this.setMessage.bind(this)
                    this.updateChatLastMessage =  this.updateChatLastMessage.bind(this)
                }
                self() {
                    return object
                }
                template(obj, data) {
                    object['template'](obj, data).then((obj)=>{
                        return obj
                    })

                }
                setMessage(obj, data) {
                    object['setMessage'](obj, data).then((obj)=>{
                        return obj
                    })
                }
                updateChatLastMessage(obj, data) {
                     object['updateChatLastMessage'](obj, data).then((obj)=>{
                         return obj
                     })
                }
            }
            resolve(object)
        })
    })
}