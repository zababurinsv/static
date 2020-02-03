export default async (obj)=>{
    return new Promise((resolve, reject) => {
        bundle['default'](obj,'export', async function (error, config) {
            let object = {}
            object['count'] = 0
            object['template'] = document.createElement('div')
            object['template'].id = 'right'
            object['template'].className = 'sidebar'
            object['User'] = async (obj, info = {})=>{


                // console.assert(false, info)
                let object = {}
                // info['first_name']
                // info['last_name']
                // info['last_name']['status']['_']
                // info['phone_number']
                // info['username']
                if(info['profile_photo']){
                    object['photo']  = info['profile_photo']['big']['remote']['id']
                }
                object['bio'] = info['bio']
                object['fullName'] = `${info['first_name']} ${info['last_name']}`
                object['status'] =  info['status']['_']
                object['username'] = info['username']
                object['phoneNumber'] = info['phone_number']
                // console.log(e['detail']['data']['RightPanel'])
                obj['this']['shadowRoot'].querySelector('#preview').innerHTML = ''
                obj['this']['shadowRoot'].querySelector('#preview').insertAdjacentHTML('afterbegin', `
             <div id="photo">
                <img src="./static/images/no_image.jpg">
            </div>
            <div id="fullName">${object['fullName']}</div>
            <div id="status">${object['status']}</div>
          `)

                obj['this']['shadowRoot'].querySelector('#info').innerHTML = ''
                obj['this']['shadowRoot'].querySelector('#info').insertAdjacentHTML('afterbegin', `
            <div class="info">
                <img src="./static/html/components/telegram-sidebar-right/images/info_svg.svg">
                <div class="data">
                    <p class="a">${object['bio']}</p>
                    <p class="b">Bio</p>
                </div>
            </div>
            <div class="info">
                <img src="./static/html/components/telegram-sidebar-right/images/username_svg.svg">
                <div class="username">
                    <p class="a">${object['username']}</p>
                    <p class="b">Username</p>
                </div>
            </div>
            <div class="info">
                <img src="./static/html/components/telegram-sidebar-right/images/phone_svg.svg">
                <div class="phone">
                    <p class="a">${object['phoneNumber']}</p>
                    <p class="b">Phone</p>
                </div>
            </div>
            <div class="info">
                <img src="./static/html/components/telegram-sidebar-right/images/checkboxon_svg.svg">
                <div class="notifications">
                    <p class="a">Notifications</p>
                    <p class="b">Enabled</p>
                </div>
            </div>
          `)


                obj['this']['shadowRoot'].querySelector('#data').innerHTML = ''
                obj['this']['shadowRoot'].querySelector('#data').insertAdjacentHTML('afterbegin', ` <div id="top"><slot name="telegram-sidebar-right-top"></slot></div>
            <div id="userData">
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
                <div class="userData">
                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">
                </div>
            </div>`)

            }
            object['class'] = class sidebar {
                constructor(name) {
                    this.webComponents = obj['name'];
                    this.setUser = this.setUser.bind(this)
                    this.rightPanel = this.rightPanel.bind(this)
                }
                self() {
                    return object
                }
                setUser(obj, data) {
                    object['User'](obj, data).then((obj)=>{
                        return obj
                    })
                }
                rightPanel(obj, data){
                    let info = {}
                    info['status'] = {}
                    info['status']['_'] ={}
                    info['profile_photo'] ={}
                    info['profile_photo']['big'] ={}
                    info['profile_photo']['big']['remote'] ={}
                    info['profile_photo']['big']['remote']['id'] ={}
                    for(let key in data ){
                        switch (key) {
                            case 'getUser':
                                info['status']['_'] = data[key]['status']['_']
                                info['first_name'] = data[key]['first_name']
                                info['last_name'] = data[key]['last_name']
                                info['username'] =  data[key]['username']
                                info['phone_number'] = data[key]['phone_number']
                                break
                            case 'getUserFullInfo':
                                info['bio'] = data[key]['bio']
                                break
                            case 'etUserProfilePhotos':
                                info['profile_photo']['big']['remote']['id'] =  data[key]['getUserProfilePhotos']['photos'][0]['sizes'][0]['photo']['remote']['id']
                                break
                            default:
                                console.warn('необрабатывается ключ',key)
                                break
                        }
                    }
                    object['User'](obj, info).then((obj)=>{
                        return obj
                    })
                }
            }
            resolve(object)
        })
    })
}