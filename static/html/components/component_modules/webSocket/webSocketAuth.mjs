import config from '/static/html/components/component_modules/config/index.mjs'
let object = {}
object['staticProperty'] = []
object['staticProperty']['socket'] = undefined
object['staticProperty']['verify'] = true
object['staticProperty']['create'] = (url) =>{
    if(object['staticProperty']['socket'] === undefined){
        object['staticProperty']['verify'] = false
        object['staticProperty']['socket'] = new WebSocket(`${url}`);
    }else{
        object['staticProperty']['verify'] = true
    }
    return object['staticProperty']['socket']
}
export default async (obj)=>{
    return new Promise((resolve, reject) => {
        object['socketProtocol'] =  'wss'
        object['class'] = class WebSocket {
            constructor(name) {

                //ws://ws-authorization.herokuapp.com
                //http://localhost:7007/

                this.socket = object['staticProperty']['create']("ws://localhost:7007");
                if( object['staticProperty']['verify'] === true){

                }else{
                    this.socket.onopen = function() {
                        console.log('connect web socket is open')
                        let openConnect = new CustomEvent('openConnect', {
                            detail: {
                                data:'openConnect'
                            }
                        })
                        document.dispatchEvent(openConnect)
                    };
                    this.socket.onclose = function(event) {
                        if (event.wasClean) {
                            // alert('Соединение закрыто чисто');
                            console.log('Соединение закрыто чисто')
                            object['staticProperty']['socket'] = undefined
                        } else {
                            console.log('Обрыв соединения')
                            object['staticProperty']['socket'] = undefined
                        }
                        console.log('Код: ' + event.code )
                        // alert('Код: ' + event.code + ' причина: ' + event.reason);
                    };
                    this.socket.onerror = function(error) {
                       console.warn("Ошибка " + error)
                    };
                    this.socket.addEventListener('message', function (event) {
                        let object = JSON.parse(event['data'])
                        console.log('response~~~~~~~',object['_'],object)
                        switch (object['_']) {
                            case 'WebRTC':
                                document.cookie = `webRTC= ${object['id']}`;
                                sessionStorage.setItem('uid',object['id']);
                                break
                            default:
                                console.warn('необрабатывается', object)
                                break
                        }
                    });
                }
            }

            self() {
                return object
            }
        }
        resolve(object)
    })
}