export default async (obj)=>{
    return new Promise((resolve, reject) => {
        bundle['default'](obj,'export', async function (error, config) {
            let object = {}
            object['count'] = 0
            object['template'] = async (obj, data)=>{

            }
            object['txt'] = async (obj, data)=>{
                obj['this']['shadowRoot'].querySelector('#microphone').innerHTML = ''
                obj['this']['shadowRoot'].querySelector('#microphone').insertAdjacentHTML('afterbegin', `
                <img class="message" src="./static/html/components/telegram-message/images/send_svg.svg">
                `)
            }
            object['null'] = async (obj, data)=>{

                obj['this']['shadowRoot'].querySelector('#microphone').innerHTML = ''
                obj['this']['shadowRoot'].querySelector('#microphone').insertAdjacentHTML('afterbegin', `
                <img class="microphone" src="./static/html/components/telegram-message/images/microphone_svg.svg">
                `)
            }

            object['class'] = class Message {
                constructor(name) {
                    this.webComponents = obj['name'];
                    this.template = this.template.bind(this)
                    this.message = this.message.bind(this)
                    this.null = this.null.bind(this)

                }
                self() {
                    return object
                }
                template(obj, data) {
                    return object['template'](obj, data) ;
                }
                message(obj, data) {
                    return object['txt'](obj, data) ;
                }
                null(obj, data) {
                    return object['null'](obj, data) ;
                }
            }
            resolve(object)
        })
    })
}