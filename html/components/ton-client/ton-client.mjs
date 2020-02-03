import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
customElements.define('ton-client',
    class extends HTMLElement {
      static get observedAttributes () {
        return ['feed']
      }
      constructor () {
        super()
        let white = []
        let property = []

        let typeSupported = []
        let words = []

        property.push('component-id')
        property.push('script')
        property.push('component-action')
        typeSupported.push('h1')
        typeSupported.push('innerText')
        words.push('shadowRoot')
        words.push('head')
        words.push('shadow')
        words.push('light')
        words.push('lightDom')
        words.push('editor')
        words.push('слайдер')
        words.push('swap')
        white['this'] = this
        white['type-supported'] = typeSupported

        function style (obj) {
          return new Promise(function (resolve, reject) {
            let styleS = document.createElement('style')
            let styleL = document.createElement('style')
            let name = {}
            if (!obj['slot']) {
              name = obj['parent']
            } else {
              name = obj['slot']
            }
            if (!name) {
              console.assert(false, 'не установленны ни слот ни парент')
            }

            for (let key = 0; key < obj['type'].length; key++) {
              if (obj['type'][key] === 'swap') {
                if (obj['type'][key] === 'scoped') {
                  styleS.setAttribute('scoped', '')
                }
              } else {
                if (obj['type'][key] === 'scoped') {
                  styleL.setAttribute('scoped', '')
                }
              }
            }
            for (let state = 0; state < obj['state'].length; state++) {
              obj[`path-style-${obj['state'][state]}`] = `@import '/static/html/components/${obj['component']}/${obj['state'][state]}/${obj['component']}.css'; @import '/static/html/components/${obj['component']}/${obj['state'][state]}/${obj['component']}-custom.css';`
              switch (obj['state'][state]) {
                case 'shadow':
                  if (obj['verify']['preset'] === true) {
                    obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${name}.css';`
                  }
                  styleS.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
                  break
                case 'light':
                  if (obj['verify']['preset'] === true) {
                    obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${name}.css';`
                  }
                  styleL.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
                  break
                default:
                  // //console.log(`новый тип`, obj['state'][state])
                  break
              }
              if (obj['state'][state] === 'swap') {
                if (obj['shadowRoot'] === true) {
                  obj['this']['shadowRoot'].appendChild(styleL)
                  obj['this'].appendChild(styleS)
                  resolve(obj)
                } else {
                  obj['this'].appendChild(styleS)
                }
              } else {
                if (obj['shadowRoot'] === true) {
                  obj['this']['shadowRoot'].appendChild(styleS)
                  obj['this'].appendChild(styleL)
                  resolve(obj)
                } else {
                  obj['this'].appendChild(styleL)
                }
              }
            }
            resolve(obj)
          })
        }
        function objectProperty (obj) {
          return new Promise(function (resolve, reject) {
            let black = []
            black['staticProperty'] = []
            black['staticProperty']['c'] = 0
            black['state'] = []
            black['state'].push('shadow')
            black['state'].push('light')
            black['words'] = words
            black['parent'] = false
            black[`type-swap`] = false
            black[`type-external`] = false
            black[`document-offsetWidth`] = document['body'].offsetWidth
            let verifyLight = false
            black[`getAttribute`] = (obj, type, property) => {
              if (property === 'template') {
                if (!obj.getAttribute('type')) {
                  // //console.log('не установлен тип ставим default')
                  obj.setAttribute('type', 'default')
                  return false
                } else {
                  for (let key = 0; key < obj.getAttribute('type').split('-').length; key++) {
                    if (obj.getAttribute('type').split('-')[key] === type) {
                      verifyLight = true
                    }
                  }
                }
                return verifyLight
              } else {
                // //console.log(obj['this'].getAttribute('type'))
                obj[`verify-${type}`] = false
                if (obj['this'].getAttribute('type').split('-').length === 0) {
                  return false
                } else {
                  for (let key = 0; key < obj['this'].getAttribute('type').split('-').length; key++) {
                    if (obj['this'].getAttribute('type').split('-')[key] === type) {
                      obj[`verify-${type}`] = true
                    } else {
                      obj[`verify-${type}`] = false
                    }
                  }
                }
                console.assert(false, obj)
                return obj[`verify-${type}`]
              }
            }
            if (!obj.tagName.toLowerCase()) {
              // //console.log('что то пошло не так middleware js objectProperty', '')
            } else {
              black[`component`] = obj.tagName.toLowerCase()
            }
            if (typeof (obj) !== 'object') {
              // //console.log('objectProperty middleware.js пришёл не объект')
            } else {
              if (!obj.getAttribute('type')) {
                black[`type`] = ['default']
                // //console.log('нет типа ставим default')
                obj.setAttribute('type', 'default')
              } else {
                black[`type`] = obj.getAttribute('type').split('-')
                for (let type = 0; type < black[`type`].length; type++) {
                  black[`type`][type] = black[`type`][type].replace(/:/g, '-')
                }
                for (let key in black[`type`]) {
                  switch (black[`type`][key]) {
                    case 'swap':
                      black[`type-swap`] = true
                      break
                    case 'external':
                      black[`type-external`] = true
                      break
                    default:
                      // //console.log(`дополнительные типы`, black[`type`][key])
                      break
                  }
                }
              }
              if (!obj.slot) {
                obj.slot = obj.tagName.toLowerCase()
                black[`slot`] = obj.slot
              } else {
                black[`slot`] = obj.slot
              }
              if (!obj.getAttribute('type')) {
              } else {
                let veryfiStyle = false
                for (let key in obj.getAttribute('type').split('-')) {
                  if (obj.getAttribute('type').split('-')[key].indexOf('style:') !== -1) {
                    // //console.log('устанавливаются пути к стилям')
                    veryfiStyle = true
                  }
                }
                if (veryfiStyle === true) {
                  black['style-custom'] = 'not-default'
                } else {
                  black['style-custom'] = 'default'
                }
              }
            }
            black['shadowRoot'] = false
            black['this'] = obj
            resolve(black)
          })
        }

        function externalProperty (obj) {
          return new Promise(function (resolve, reject) {
            obj['external-property'] = white['external-property']
            let object = []
            let component = []
            let a = []
            for (let key = 0; key < obj['external'].length; key++) {
              for (let type = 0; type < obj['external'][key].children.length; type++) {
                switch (obj['external'][key].children[type].tagName) {
                  case 'SCRIPT':
                    if (!obj['external'][key].getAttribute('id')) {
                      // //console.log('у компонента нет id нужно в external property script  получить id для загрузки скрипта')
                    } else {
                      component['script'] = obj['external'][key]['children'][type]
                    }
                    break
                  case 'COMPONENT-ID':
                    component['id'] = obj['external'][key]['children'][type].innerText
                    break
                  case 'COMPONENT-ACTION':
                    for (let action = 0; action < obj['external'][key]['children'][type]['children'].length; action++) {
                      a.push(obj['external'][key]['children'][type]['children'][action].innerText)
                    }
                    component['actions'] = a
                    break
                  default:
                    // //console.log(`Не отслеживается, по мере надобности добавляются [${obj['external'][key].children[type].tagName.toLowerCase()}]`)
                    break
                }
              }
              object.push(component)
              component = []
            }
            obj['external-property'] = object
            resolve(obj)
          })
              .catch(error => {
                // //console.log('здесь я перехватывал отсутствие страницы но это убрал', error)
              })
        }


        function getTemplate (obj, swap, external) {
          return new Promise(function (resolve, reject) {
            obj['template-shadow'] = []
            obj['template-light'] = []
            let verify = []
            verify['swap'] = false
            verify['blog'] = false
            verify['external'] = false
            verify['light'] = false
            verify['slider'] = false
            verify['one'] = false
            verify['sliderText'] = false
            verify['text'] = false
            for (let type = 0; type < obj['type'].length; type++) {
              if (obj['type'][type].indexOf('slider') !== -1) {
                if (obj['type'][type].split('-').length > 1) {
                  verify['slider'] = true
                  for (let key in obj['type'][type].split('-')) {
                    switch (obj['type'][type].split('-')[key]) {
                      case 'one':
                        verify['one'] = true
                        break
                      default:
                        // //console.log(`~~~дополнительное свойство~~~`, obj['type'][type].split('-')[key])
                        break
                    }
                  }
                }
              }
              if (obj['type'][type].length) {
                if (obj['type'][type].split('-').length > 1) {
                  switch (obj['type'][type].split('-')[0]) {
                    case 'blog':
                      verify['blog'] = true
                      break
                    default:
                      console.log(`типы не отслеживаются`, obj['type'][type])
                      break
                  }
                } else {
                  switch (obj['type'][type]) {
                    case 'swap':
                      verify['swap'] = true
                      break
                    case 'external':
                      verify['external'] = true
                      break
                    case 'light':
                      verify['light'] = true
                      break
                    case 'slider':
                      verify['slider'] = true
                      break
                    case 'sliderText':
                      verify['sliderText'] = true
                      break
                    case 'text':
                      verify['text'] = true
                      break
                    default:
                      // //console.log(`типы не отслеживаются`, obj['type'][type])
                      break
                  }
                }
              }
            }

            /**
             * цикл this
             * цикл template
             */
            /**
             * устанавливается свойство parent если его нет у родителя ставится по родителю
             *
             */
            if(obj['this'].getAttribute('parent')){
              obj['parent'] = obj['this'].getAttribute('parent')
            }
            if (verify['swap'] === true) {
              for (let key = 0; key < obj['this'].children.length; key++) {
                // //console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
                if (obj['this'].children[key].tagName.split('-').length === 1) {
                  if (obj['this'].children[key].slot === 'view') {
                    obj['this'].children[key].className = 'wall'
                  }
                  obj['template-light'].push(obj['this'].children[key])
                } else {
                  if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                    obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }

                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-light'].push(obj['this'].children[key])
                  } else {
                    obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                    /**
                     * устанавливается свойство parent если его нет у родителя ставится по родителю
                     *
                     */
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }
                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-shadow'].push(obj['this'].children[key])
                  }
                }
              }
              for (let key = 0; key < obj['template'].children.length; key++) {
                // //console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
                if (obj['template'].children[key].tagName.split('-').length === 1) {
                  if (obj['template'].children[key].slot === 'view') {
                    obj['template'].children[key].className = 'wall'
                  }
                  obj['template-light'].push(obj['template'].children[key])
                } else {
                  if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                    obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-light'].push(obj['template'].children[key])
                  } else {
                    obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-shadow'].push(obj['template'].children[key])
                  }
                }
              }
            } else {
              for (let key = 0; key < obj['this'].children.length; key++) {
                // //console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
                if (obj['this'].children[key].tagName.split('-').length === 1) {
                  if (obj['this'].children[key].slot === 'view') {
                    obj['this'].children[key].className = 'wall'
                  }
                  obj['template-shadow'].push(obj['this'].children[key])
                } else {
                  if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }
                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-shadow'].push(obj['this'].children[key])
                  } else {
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }
                    scriptTemplate(obj['this'].children[key], obj)
                    obj['template-light'].push(obj['this'].children[key])
                  }
                }
              }
              for (let key = 0; key < obj['template'].children.length; key++) {
                // //console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
                if (obj['template'].children[key].tagName.split('-').length === 1) {
                  if (obj['template'].children[key].slot === 'view') {
                    obj['template'].children[key].className = 'wall'
                  }
                  obj['template-shadow'].push(obj['template'].children[key])
                } else {
                  if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-shadow'].push(obj['template'].children[key])
                  } else {
                    if(obj['parent'] === false){
                      if(!obj['slot']){
                        obj['this'].children[key].setAttribute('parent', `${obj['component']}`)
                      }else{
                        obj['this'].children[key].setAttribute('parent', `${obj['slot']}`)
                      }
                    }else{
                      obj['this'].children[key].setAttribute('parent', `${obj['parent']}`)
                    }
                    scriptTemplate(obj['template'].children[key], obj)
                    obj['template-light'].push(obj['template'].children[key])
                  }
                }
              }
            }
            for (let key in verify) {
              obj['verify'][key] = verify[key]
            }
            resolve(obj)
          })
        }
        function template (obj, type) {
          return new Promise(function (resolve, reject) {
            obj['verify'] = []

            if (!obj['this'].getAttribute('preset')) {
              obj['path-template'] = `/static/html/components/${obj['component']}/${obj['component']}.html`
              obj['verify']['preset'] = false
            } else {
              switch(obj['this'].getAttribute('preset')){
                case 'default':
                  obj['path-template'] = `/static/html/components/${obj['component']}/template/${obj['component']}.html`
                  obj['preset'] = `${obj['this'].getAttribute('preset')}`
                  obj['verify']['preset'] = true
                  break
                default:
                  obj['path-template'] = `/static/html/components/${obj['component']}/template/${obj['this'].getAttribute('preset')}.html`
                  obj['preset'] = `${obj['this'].getAttribute('preset')}`
                  obj['verify']['preset'] = true
                  break
              }
            }
            fetch(obj['path-template'])
                .then(function (response) {
                  if (response.ok) {
                    return response.text()
                  }
                }).then(function (body) {
              let parser = new DOMParser()
              let doc = parser.parseFromString(body, 'text/html')
              obj['template'] = doc.getElementsByTagName('template')[0].content.cloneNode(true)
              external(obj)
                  .then((obj) => {
                    getTemplate(obj, obj['type-swap'], obj['type-external'])
                        .then((obj) => {
                          if (obj['verify']['swap'] === true) {

                            if (obj['template-light'].length !== 0) {
                              for (let key = 0; key < obj['template-light'].length; key++) {
                                //console.log('2222222222111111111111222222222222', obj['template-light'][key])
                                obj['this']['prepend'](obj['template-light'][key])
                                // console.assert(false, obj['template-light'][key])
                              }
                            }
                            if (obj['template-shadow'].length !== 0) {
                              obj['this']['attachShadow']({mode: 'open'})
                              obj['shadowRoot'] = true
                              for (let key = 0; key < obj['template-shadow'].length; key++) {

                                obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                              }
                            }

                          } else {
                            if (obj['template-light'].length !== 0) {
                              for (let key in obj['template-light']) {
                                obj['this']['appendChild'](obj['template-light'][key])
                              }
                            }
                            if (obj['template-shadow'].length !== 0) {
                              obj['this']['attachShadow']({mode: 'open'})
                              obj['shadowRoot'] = true
                              for (let key in obj['template-shadow']) {
                                obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                              }
                            }

                          }
                          resolve(obj)
                        })
                  })
            })
                .catch(error => {
                  return error
                })
          })
        }

        function renderExternal (obj) {
          return new Promise(function (resolve, reject) {
            obj['words-action'] = []
            let wordsAction = []
            for (let key = 0; key < obj['external-property'].length; key++) {
              for (let words = 0; words < obj['external-property'][key]['actions'].length; words++) {
                for (let verify = 0; verify < obj['words'].length; verify++) {
                  if (obj['external-property'][key]['actions'][words].indexOf(obj['words'][verify]) !== -1) {
                    if (obj['words'][verify] === 'shadowRoot' || obj['words'][words] === 'shadow') {
                      wordsAction['shadow'] = true
                    }
                    if (obj['words'][verify] === 'light' || obj['words'][words] === 'лайт') {
                      wordsAction['light'] = true
                    }
                    if (obj['words'][verify] === 'editor') {
                      wordsAction['editor'] = true
                    }
                    if (obj['words'][verify] === 'слайдер') {
                      wordsAction['editor-slider'] = true
                    }
                    if (obj['words'][verify] === 'swap') {
                      wordsAction['swap'] = true
                    }
                  }
                }
              }
              obj['words-action'] = wordsAction

              for (let key in obj['external-property']) {
                for (let type in obj['external-property'][key]) {
                  switch (type) {
                    case 'id':
                      let doc = document.createElement(obj['external-property'][key][type])
                      doc.setAttribute('type', 'external')
                      obj['this'].appendChild(doc)
                      break
                    default:
                      // //console.log(`какой то неизвестный тип`, type)
                      break
                  }
                }
              }
              resolve(obj)
            }
          })
        }

        function external (obj) {
          return new Promise(function (resolve, reject) {
            obj['path-external'] = `/static/html/components/${obj['component']}/external/${obj['component']}-external.html`
            fetch(obj['path-external'])
                .then(function (response) {
                  if (response.ok === false) {
                    return response.ok
                  } else {
                    return response.text()
                  }
                })
                .then(function (data) {
                  if (data === false) {
                  } else {
                    let parser = new DOMParser()
                    let doc = parser.parseFromString(data, 'text/html')
                    obj['external'] = doc.querySelectorAll('section')
                    externalProperty(obj)
                        .then((obj) => {
                          if (obj['external-property'].length === 0) {
                            resolve(obj)
                          } else {
                            renderExternal(obj)
                                .then((obj) => {
                                  resolve(obj)
                                })
                          }
                        })
                  }
                })
                .catch(error => {
                  throw error
                })
          })
        }
        function getElementsByClassName (obj, type) {
          return new Promise(function (resolve, reject) {
            for (let state = 0; state < obj['state'].length; state++) {
              for (let key = 0; key < obj[`template-${obj['state'][state]}`].length; key++) {
                if (obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type).length === 0) {

                } else {
                  obj['slider'] = obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type)[0]
                  resolve(obj[`template-${obj['state'][state]}`][key].getElementsByClassName(type)[0])
                }
              }
            }
          })
        }
        function scriptTemplate (obj, parent) {
          return new Promise(function (resolve, reject) {
            let verify = false
            for (let i = 0; i < document.querySelectorAll('script').length; i++) {
              if (document.querySelectorAll('script')[i].src.indexOf(obj.tagName.toLowerCase()) !== -1) {
                verify = true
              }
            }
            if (verify === true) {
              console.log('модуль загружен')
            } else {
              const script = document.createElement('script')
              script.src = `/static/html/components/${obj.tagName.toLowerCase()}/${obj.tagName.toLowerCase()}.mjs`
              script.type = 'module'
              script.setAttribute('async', '')
              script.onload = resolve
              script.onerror = reject

              parent['this'].appendChild(script)
            }
          })
        }
        objectProperty(this)
            .then((obj) => {
              template(obj)
                  .then((obj) => {
                    style(obj)
                        .then((obj) => {
                          modules(obj)
                        })
                  })
            })
        function getCookie(cookie, name) {
          let value = "; " + cookie;
          let parts = value.split("; " + name + "=");
          if (parts.length == 2) return parts.pop().split(";").shift();
        }
        async function modules (obj) {
              await store({
              input:'ton-client',
              this:obj['this'],
              obj: obj,
              slot: obj['this'].slot,
              type:'obj'
            }, 'set', 'type')

          obj['this']['shadowRoot'].querySelector('#hidden').addEventListener('click',async ()=>{

            obj['this']['shadowRoot'].querySelector('#hidden').classList.toggle('close')
            if(obj['this']['shadowRoot'].querySelector('#hidden').classList.contains('close')){
              obj['this']['shadowRoot'].querySelector('#connect').style.display = 'none'
              obj['this']['shadowRoot'].querySelector('#content').style.display = 'none'
              obj['this']['shadowRoot'].querySelector('#console').style.display = 'none'
            }else{
              obj['this']['shadowRoot'].querySelector('#connect').style.display = 'flex'
              obj['this']['shadowRoot'].querySelector('#content').style.display = 'flex'
              obj['this']['shadowRoot'].querySelector('#console').style.display = 'flex'
            }
          })
          obj['this']['shadowRoot'].querySelector('label.name').addEventListener('click', async (e)=>{

            let id = getCookie(document.cookie, 'webRTC')
            if(id) {
              let formData = new FormData();
              formData.append('name', e.target.parentNode.querySelector('input.name').value);
              e.target.parentNode.querySelector('input.name').value = ''
              let id = await fetch(`http://localhost:7777/createWallet`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
              })
              if (!id.ok) {
                throw new Error('HTTP error, status = ' + id.status)
              } else {
                id =  await id.json()
              }
              console.log('~~~~id~~~~', id)
            }else{


            }
          })


          obj['this']['shadowRoot'].querySelector('label.address').addEventListener('click', async (e)=>{

            let id = getCookie(document.cookie, 'webRTC')
            if(id) {
              let formData = new FormData();
              formData.append('address', e.target.parentNode.querySelector('input.address').value);
              // e.target.parentNode.querySelector('input.address').value = ''
              let id = await fetch(`http://localhost:7777/show-add`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
              })
              if (!id.ok) {
                throw new Error('HTTP error, status = ' + id.status)
              } else {
                id =  await id.json()
              }
              console.log('~~~~id~~~~', id)
            }else{


            }
          })
          obj['this']['shadowRoot'].querySelector('label.account').addEventListener('click', async (e)=>{

            let id = getCookie(document.cookie, 'webRTC')
            if(id) {
              let formData = new FormData();
              formData.append('account', e.target.parentNode.querySelector('input.account').value);
              // e.target.parentNode.querySelector('input.account').value = ''
              let id = await fetch(`http://localhost:7777/getaccount`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
              })
              if (!id.ok) {
                throw new Error('HTTP error, status = ' + id.status)
              } else {
                id =  await id.json()
              }
              console.log('~~~~id~~~~', id)
            }else{


            }
          })
          obj['this']['shadowRoot'].querySelector('label.runmethod').addEventListener('click', async (e)=>{

            let id = getCookie(document.cookie, 'webRTC')
            if(id) {
              let formData = new FormData();
              formData.append('account', e.target.parentNode.querySelector('input.runmethod').value);
              // e.target.parentNode.querySelector('input.account').value = ''
              let id = await fetch(`http://localhost:7777/time`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
              })
              if (!id.ok) {
                throw new Error('HTTP error, status = ' + id.status)
              } else {
                id =  await id.json()
              }
              console.log('~~~~id~~~~', id)
            }else{


            }
          })
          obj['this']['shadowRoot'].querySelector('input.help').addEventListener('click', async (e)=>{

            let id = getCookie(document.cookie, 'webRTC')
            if(id) {
              let id = await fetch(`http://localhost:7777/help`, {
                method: 'GET',
                credentials: 'include'
              })
              if (!id.ok) {
                throw new Error('HTTP error, status = ' + id.status)
              } else {
                id =  await id.json()
              }
              console.log('~~~~id~~~~', id)
            }else{


            }
          })
          obj['this']['shadowRoot'].querySelector('input.time').addEventListener('click', async (e)=>{

            let id = getCookie(document.cookie, 'webRTC')
            if(id) {
              let id = await fetch(`http://localhost:7777/time`, {
                method: 'GET',
                credentials: 'include'
              })
              if (!id.ok) {
                throw new Error('HTTP error, status = ' + id.status)
              } else {
                id =  await id.json()
              }
              console.log('~~~~id~~~~', id)
            }else{


            }
          })
          obj['this']['shadowRoot'].querySelector('#erase').addEventListener('click', async (e)=>{

            obj['this']['shadowRoot'].querySelector('#console').innerHTML = ''
          })
          obj['this']['shadowRoot'].querySelector('input.last').addEventListener('click', async (e)=>{

            let id = getCookie(document.cookie, 'webRTC')
            if(id) {
              let id = await fetch(`http://localhost:7777/last`, {
                method: 'POST',
                credentials: 'include'
              })
              if (!id.ok) {
                throw new Error('HTTP error, status = ' + id.status)
              } else {
                id =  await id.json()
              }
              console.log('~~~~id~~~~', id)
            }else{


            }
          })
          document.addEventListener('init',async (e)=>{
            let out = e['detail']['data']['init']
            if( obj['this']['shadowRoot'].querySelector('#console').children.length > 40){
              for(let i =0 ; i < obj['this']['shadowRoot'].querySelector('#console').children.length; i++){

                if(i < 35){
                  obj['this']['shadowRoot'].querySelector('#console').children[i].remove()

                }
              }
            }
            for(let i =0; i < out.length;i++){
              let p = document.createElement('p')
              obj['this']['shadowRoot'].querySelector('#console').insertAdjacentHTML('beforeend',`
                <p>${out[i]}</p>
                `)
            }
          })

            let ringPing = new CustomEvent('ringPing', {
                detail: {
                    data:''
                }
            })
            document.dispatchEvent(ringPing)
          /*

    document.querySelector('.client-address').addEventListener('click',async (event)=>{

        let formData = new FormData();

        formData.append("address", event.target.parentNode.querySelector('#client-address').value)

        fetch(`http://localhost:7777/show-add`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                // console.log('~~~~~~~~~~~~',app)
                // document.querySelector('#client-info').innerHTML = ''
                // document.querySelector('#client-message').innerHTML = ''
                // document.querySelector('#client-info').innerHTML = app['info']
                // document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })

    document.querySelector('.client-testgiver').addEventListener('click',async (event)=>{

        let formData = new FormData();

        formData.append("address", event.target.parentNode.querySelector('#client-testgiver').value)
        formData.append("name", event.target.parentNode.querySelector('#client-accountName').value)

        fetch(`http://localhost:7777/testgiver`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                // console.log('~~~~~~~~~~~~',app)
                // document.querySelector('#client-info').innerHTML = ''
                // document.querySelector('#client-message').innerHTML = ''
                // document.querySelector('#client-info').innerHTML = app['info']
                // document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('.client-sendfile').addEventListener('click',async (event)=>{

        let formData = new FormData();
        formData.append("name", event.target.parentNode.querySelector('#client-sendfile').value)

        fetch(`http://localhost:7777/sendfile`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
        .then(function (app) {
            // console.log('~~~~~~~~~~~~',app)
            // document.querySelector('#client-info').innerHTML = ''
            // document.querySelector('#client-message').innerHTML = ''
            // document.querySelector('#client-info').innerHTML = app['info']
            // document.querySelector('#client-message').innerHTML = app['msg']
        })
        .catch(function (error) {
            console.warn( 'error', error)
        })

    })

    document.querySelector('.fift-createWallet').addEventListener('click',async (event)=>{
        // console.assert(false, event.target.parentNode.querySelector('#client-getaccount').value)
        let formData = new FormData();
        // console.assert(false, event.target.parentNode.querySelector('#fift-createWallet').value)
        formData.append("name", event.target.parentNode.querySelector('#fift-createWallet').value)

        // console.log('ddddddddddddddddddddddd')

        fetch(`http://localhost:7777/createWallet`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                // document.querySelector('#client-info').innerHTML = ''
                // document.querySelector('#client-message').innerHTML = ''
                // document.querySelector('#client-info').innerHTML = app['info']
                // document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-run').addEventListener('click',async (event)=>{


    })
    document.querySelector('#client-quit').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/quit`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })

    document.querySelector('#client-account').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/account`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {

              console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-help').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/help`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-time').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/time`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-remote-version').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/remote-version`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-last').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/last`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })


    document.querySelector('#client-status').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/status`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('.client-getaccount').addEventListener('click',async (event)=>{

        // console.assert(false, event.target.parentNode.querySelector('#client-getaccount').value)

        let formData = new FormData();


        formData.append("account", event.target.parentNode.querySelector('#client-getaccount').value);

        fetch(`http://localhost:7777/getaccount`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('.client-runmethod').addEventListener('click',async (event)=>{

        let formData = new FormData();
        formData.append("account", event.target.parentNode.querySelector('#client-runmethod').value);
        fetch(`http://localhost:7777/runmethod`, {
            method: 'POST',
            body:formData
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-allshards').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/allshards`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })

    document.querySelector('#client-getconfig').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getconfig`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-getconfigfrom').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getconfigfrom`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-saveconfig').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/saveconfig`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-gethead').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/gethead`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-getblock').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getblock`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-dumpblock').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/dumpblock`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-getstate').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/getstate`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-dumpstate ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/dumpstate `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-dumptrans ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/dumptrans `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-lasttrans ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/lasttrans `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-listblocktrans ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/listblocktrans `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-blkproofchain ').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/blkproofchain `, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-byseqno').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/byseqno`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-bylt').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/bylt`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-byutime').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/byutime`, {
            method: 'POST'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
    document.querySelector('#client-quit').addEventListener('click',async (event)=>{
        fetch(`http://localhost:7777/quit`, {
            method: 'GET'
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('HTTP error, status = ' + response.status)
            } else {
                return response.json()
            }
        })
            .then(function (app) {
                console.log('~~~~~~~~~~~~',app)
                document.querySelector('#client-info').innerHTML = ''
                document.querySelector('#client-message').innerHTML = ''
                document.querySelector('#client-info').innerHTML = app['info']
                document.querySelector('#client-message').innerHTML = app['msg']
            })
            .catch(function (error) {
                console.warn( 'error', error)
            })

    })
           */
        }
      }
    })
