import staticProperty  from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import setText from '/static/html/components/component_modules/setText/setText.mjs'
import addEventListener from '/static/html/components/component_modules/addEventListener/addEventListener.mjs'
import templateItem from '/static/html/components/component_modules/template/template.mjs'
import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import action from '/static/html/components/component_modules/action/action.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
customElements.define('varan-card-news',
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
      async function modules (obj) {
        bundle['default'](obj,null, async function (error, config) {
          function msConversion(millis) {
            let sec = Math.floor(millis / 1000);
            let hrs = Math.floor(sec / 3600);
            sec -= hrs * 3600;
            let min = Math.floor(sec / 60);
            sec -= min * 60;

            sec = '' + sec;
            sec = ('00' + sec).substring(sec.length);

            if (hrs > 0) {
              if(min < 10){
                min = '0' + min;
              }else{
                min = '' + min;
              }

              min = ('00' + min).substring(min.length);
              return hrs + ":" + min + ":" + sec;
            }
            else {
              if(min < 10){
                min = '0' + min;
              }else{
                min = '' + min;
              }
              return '00:'+min + ":" + sec;
            }
          }
          function setTimer (obj){
            return new Promise( async function (resolve, reject) {
              let timerId = setTimeout(async function tick() {
                let timer = await matcher['server']({
                  path:`/timer/${obj['id']}`,
                  type:'timer'
                },'get', 'type')

                if(timer['mongo']['time']  <= 0){
                  obj['data'].innerText = `завершён`
                  let bid = 0
                  console.log(timer['mongo'])
                  for(let i = 0; i < timer['mongo']['auction']['count'].length; i++){
                    if(timer['mongo']['auction']['count'][i] ===timer['mongo']['auction']['winner']){
                      bid++
                    }
                  }
                  let winner = timer['mongo']['auction']['winner']
                  let price = +timer['mongo']['auction']['lotAmount'] * 10
                  let tx = await matcher['server']({
                    path:`/winner`,
                    type:'winner',
                    data:{
                        auctionId:timer['mongo']['auction']['auctionId'],
                        winner:winner,
                        endHeight: timer['mongo']['auction']['endHeight'],
                        lotAmount: price,
                        bid:bid
                    }
                  },'set', 'type')
                  await window['wt']['nodeInteraction']['waitForTx'](tx['mongo']['id'],{
                    apiBase:'https://nodes-testnet.wavesnodes.com'
                  })

                  let data = await  WavesKeeper.publicState()
                  let lots =   await matcher['server']({
                      input:'waves-auth',
                      path:`/winner/${data['account']['address']}`,
                      type:'winner'
                    },'get','type')



                  if(lots['mongo'].length > 0){
                    let object = document.createElement('div')
                    object.className = 'winner'
                    for(let i = 0; i < lots['mongo'].length;i++){
                      let price =  (+lots['mongo'][i]['winner']['payment'][0]['amount']/100000000) + 0.014
                      price = price.toFixed(3)
                      let temp = `<div class="info">
                                    <div> Лот: ${lots['mongo'][i]['object']}</div>
                                    <div class="priceLot"> Стоимость лота: ${price} Waves</div>
                                    <button class="pay ${lots['mongo'][i]['object']}">Оплатить</button>
                              </div>`
                      object.insertAdjacentHTML('beforeend', temp);
                    }
                  let allObject =  await store({
                      input:'varan-card-news',
                      type:'all'
                    }, 'get', 'type')

                    allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').style.display = 'flex'
                    allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').innerHTML = ''
                    allObject['waves-auth'][0]['this'].shadowRoot.querySelector('#winner').appendChild(object);
                    let button = allObject['waves-auth'][0]['this'].shadowRoot.querySelectorAll('.pay')
                    for(let j = 0; j < button.length;j++){
                      await addEventListener({
                        input:'waves-auth',
                        data:button[j],
                        type:'payLot'
                      },'set', 'type')
                    }

                  }else{}


                  clearTimeout(timerId);
                  resolve(obj['data'].innerText)
                }else{
                  let news = timer['mongo']
                  let price = +news['lotAmount']
                  price = price.toFixed(1)
                  obj['info']['name'].innerText = `${news['winner']}`
                  obj['info']['price'].innerText = `Waves: ${price}`
                  let bid = 0
                  for(let i =0; i < news['count'].length; i++){
                    if(news['count'][i] === news['winner']){
                      bid++
                    }
                  }
                  let lotAmount = +news['lotAmount']
                  let outPrice = lotAmount + 0.014
                  outPrice = outPrice.toFixed(3)

                  obj['info']['outPrice'].innerText = `Waves: ${outPrice }`

                  obj['data'].innerText = msConversion(news['time'])
                  timerId = setTimeout(tick, 900); // (*)
                }
              }, 900);

            })
          }
        async function polling(){
          let timerId = setTimeout(async function tick() {

            let list  = await matcher['server']({
              path:`/auction`,
              type:'auctions'
            },'get', 'type')

            let items =obj['this'].shadowRoot.querySelectorAll('.item')

            for(let i =0; i < items.length;i++){
              if(items[i].className.indexOf('timer') > -1){}else{

                // console.assert(false, items[i].className.split('_')[1])

                for(let m =0; m < list['mongo'].length; m++){

                  if(parseInt(list['mongo'][m]['object'], 10) === parseInt(items[i].className.split('_')[1], 10)){

                    // console.assert(false, list['mongo'][m]['auction'])

                    items[i].querySelector('.outPrice').innerText =  `Waves: ${list['mongo'][m]['auction']['lotAmount']}`
                    items[i].querySelector('.name').innerText = list['mongo'][m]['auction']['winer']
                    items[i].querySelector('.sellButton').innerText = 'Аукцион'
                    items[i].querySelector('.sellButton').disabled = true
                    items[i].querySelector('.timer').innerText = msConversion(parseInt(list['mongo'][m]['auction']['endHeight'], 10) - Date.now())

                    items[i].classList.add("timer")
                    setTimer({
                      id: list['mongo'][m]['object'],
                      data: items[i].querySelector('.timer'),
                      this: items[i],
                      info:{
                        name:  items[i].querySelector('.name'),
                        price: items[i].querySelector('.price'),
                        outPrice: items[i].querySelector('.outPrice')

                      }
                    }).then((data)=>{
                      items[i].querySelector('.sellButton').innerText = 'Старт'
                    })
                  }
                }
              }
            }



            timerId = setTimeout(tick, 1000); // (*)
          }, 1000);
        }
          let verify = false
          for(let i =0; i< obj['this'].slot.split('-').length; i++){
            if(obj['this'].slot.split('-')[i] === 'admin'){
              verify = true

            }
          }


          // console.assert(false, feeds)
          let itemHtml = {}
          if(verify){
            await store({
              input:'varan-card-news',
              this:obj['this'],
              img: obj['this'].shadowRoot.querySelector('.imgBidAdmin'),
              slot:obj.slot,
              parent: obj['this'].getAttribute('parent'),
              type:'obj'
            }, 'set', 'type')

           let  itemsBid = await action({
              input:'lacerta-card-news',
              type:'itemsBid',
              name:'itemsBid'
            }, 'get', 'type')
            if(config['isEmpty'](itemsBid['mongo'])){
              console.warn('нет объектов')
            }else{
              obj['this'].shadowRoot.querySelector('.section').innerHTML = ''
              for(let m =0; m < itemsBid['mongo'].length; m++){

                let outAdmin =  await templateItem({
                  input:'varan-cards-news-admin',
                  data:itemsBid['mongo'][m]['item'],
                  type:'cardAdmin'
                },'get', 'type')
                obj['this'].shadowRoot.querySelector('.section').insertAdjacentHTML('beforeend', outAdmin)
                let item = obj['this'].shadowRoot.querySelector(`.timestamp_${Date.parse(itemsBid['mongo'][m]['item']['date_modified'])}`)

                item.querySelector('.change').addEventListener('click', async (event) => {
                  let target = event.target
                  let verify = false
                  while (!verify) {
                    if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
                      verify = true
                    }else{
                      target = target.parentNode
                    }
                  }
                  let date = {}
                  date['timestamp'] = +target.className.split('_')[1]
                  date['iso'] =  (new Date(date['timestamp'])).toISOString()
                  date['utc'] =  (new Date(date['timestamp'])).toUTCString()
                  let time = await matcher['server']({
                    path:`/timer/${date['timestamp']}`,
                    type:'timer'
                  },'get', 'type')
                  if(time['mongo']['time'] === -2){

                    target.querySelector('.change').innerText = `данные добавляются`
                    target.querySelector('.change').disabled = true;
                    staticProperty({
                      type:'task',
                      task: {
                        button: target.querySelector('.change'),
                        type:'update',
                        date:date,
                        this:obj['this']
                      },
                      name:'bid'
                    },'task', 'type')
                  }else{
                    alert('Проходит аукцион, редактирование невозможно')
                  }
                  })


                  item.querySelector('.delete').addEventListener('click', async (event) => {
                  let target = event.target
                  let verify = false
                  while (!verify) {
                    if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
                      verify = true
                    }else{
                      target = target.parentNode
                    }
                  }
                  let date = {}
                  date['timestamp'] = +target.className.split('_')[1]
                  date['iso'] =  (new Date(date['timestamp'])).toISOString()
                  date['utc'] =  (new Date(date['timestamp'])).toUTCString()
                    let time = await matcher['server']({
                      path:`/timer/${date['timestamp']}`,
                      type:'timer'
                    },'get', 'type')
                    if(time['mongo']['time'] === -2){

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
                          },
                          name:'bid'
                        },'task', 'type')
                      }else{

                      }
                    }else{
                      alert('Проходит аукцион, вы не можете удалить товар')
                    }
                })
              }
            }
            obj['this'].shadowRoot.querySelector('#image').onchange = function (event) {
              // console.assert(false, obj)
              let crop = new CustomEvent('sideBarCrop', {
                detail: {
                  id: obj['component'],
                  slot: obj['slot'],
                  file: event.target.files[0]
                }
              })
              document.dispatchEvent(crop)
              event.target.value = '';
            }
          }else{
            await store({
              input:'varan-card-news',
              this:obj['this'],
              img: obj['this'].shadowRoot.querySelector('.imgBidAdmin'),
              slot:obj.slot,
              parent: obj['this'].getAttribute('parent'),
              type:'obj'
            }, 'set', 'type')
            let feeds = {}
               feeds = await action({
              input:'lacerta-card-news',
              type:'itemsBid',
              name:'itemsBid'
            }, 'get', 'type')
            // let eventSource;
            // if (!window.EventSource) {
              // Internet Explorer или устаревшие браузеры
              // alert("Ваш браузер не поддерживает EventSource.");
              // return;
            // }
            // eventSource = new window.EventSource(`${matcher['config']['account']['sse']}`);
            // eventSource.addEventListener('message', async function (event) {
            //
            //   let msg = JSON.parse(event['data'])
            //   let obj = JSON.parse(msg['msg'])
            //
            //  let card =  await store({
            //     input:'varan-card-news',
            //     type:'object'
            //   }, 'get', 'type')
            //   console.assert(false)
            //   for(let i =0; i < card.length; i++){
            //   switch (card[i]['slot']) {
            //     case 'varan-card-news':
            //       let outPrice = parseInt(obj['data']['auction']['lotAmount'], 10) + 0.05
            //       console.assert(false)
            //       let time = parseInt(obj['data']['auction']['endHeight'], 10) - Date.now()
            //
            //         let items = card[i]['this'].shadowRoot.querySelector('.section')
            //
            //         for(let j = 0; j < items.children.length; j++){
            //
            //           let name = items.children[j].className.split('_')[1]
            //           if(parseInt(name, 10) === parseInt(obj['data']['object'], 10)){
            //            let item = items.children[j]
            //
            //             item.querySelector('.outPrice').innerText = `Waves: ${outPrice}`
            //             item.querySelector('.name').innerText = obj['data']['auction']['winner']
            //             item.querySelector('.sellButton').innerText = 'Аукцион начался'
            //             item.querySelector('.timer').innerText = msConversion(time )
            //             setTimer({
            //               id:parseInt(name, 10),
            //               data:   item.querySelector('.timer'),
            //               this: item,
            //               info:{
            //                 name:  item.querySelector('.name'),
            //                 price: item.querySelector('.price'),
            //                 outPrice: item.querySelector('.outPrice')
            //               }
            //             }).then((data)=>{
            //               item.querySelector('.sellButton').innerText = 'Старт'
            //             })
            //           }
            //         }
            //       break
            //     default:
            //       break
            //     }
            //   }
            // });



            if(config['isEmpty'](feeds)){
              console.warn('нет объектов')
            }else{

              obj['this'].shadowRoot.querySelector('.section').innerHTML = ''

              for(let m =0; m < feeds['mongo'].length; m++){
                 itemHtml =  await templateItem({
                  input:'bid_card',
                  data:feeds['mongo'][m]['item'],
                  type:'card'
                },'get', 'type')
                obj['this'].shadowRoot.querySelector('.section').insertAdjacentHTML('beforeend', itemHtml)

              let nameAuction = Date.parse(feeds['mongo'][m]['item']['date_modified'])

                let item = obj['this'].shadowRoot.querySelector(`.timestamp_${nameAuction}`)

                let time = await matcher['server']({
                  path:`/timer/${nameAuction}`,
                  type:'timer'
                },'get', 'type')
                if(time['mongo']['time'] === -2){

                }else if(time['mongo']['time'] === -1 ){
                  console.assert(false)

                }else{

                  item.querySelector('.outPrice').innerText =  `Waves: ${time['mongo']['lotAmount']}`
                  item.querySelector('.name').innerText = time['mongo']['winer']
                  item.querySelector('.sellButton').innerText = 'Аукцион'
                  item.querySelector('.sellButton').disabled = true
                  item.querySelector('.timer').innerText = msConversion(time['mongo']['time'])

                  item.classList.add("timer")
                  setTimer({
                    id: nameAuction,
                    data: item.querySelector('.timer'),
                    this: item,
                    info:{
                      name:  item.querySelector('.name'),
                      price: item.querySelector('.price'),
                      outPrice: item.querySelector('.outPrice')

                    }
                  }).then((data)=>{
                    item.querySelector('.sellButton').innerText = 'Старт'
                  })
                }


                item.querySelector('.bidButton').addEventListener('click', async (event) => {
                  let target = event.target
                  let verify = false
                  while (!verify) {
                    if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
                      verify = true
                    }else{
                      target = target.parentNode
                    }
                  }

                  target.querySelector('.bidButton').innerText = 'делается ставка'
                  target.querySelector('.bidButton').disabled = true
                  let time = await matcher['server']({
                    path:`/timer/${nameAuction}`,
                    type:'timer'
                  },'get', 'type')
                  if(time['mongo']['time'] === -2){

                    alert('Аукцион ещё не начался')
                    target.querySelector('.bidButton').innerText = 'ставка'
                    target.querySelector('.bidButton').disabled = false
                  }else if(time['mongo']['time'] === -1 ){
                    alert('Аукцион ещё не начался')
                    target.querySelector('.bidButton').innerText = 'ставка'
                    target.querySelector('.bidButton').disabled = false
                  }else{
                    try{
                      let data = await  WavesKeeper.publicState()
                      let bid = {}
                      if(data['account']['balance']['available'] < 100000000){
                        alert('У вас недостаточно средств, что бы сделать ставку')
                        target.querySelector('.bidButton').innerText = 'ставка'
                        target.querySelector('.bidButton').disabled = false
                      }else{
                        let id  = target.className.split('_')[1]
                        id  = id.split(' ')[0]
                        id = +id
                        let cheked = await matcher['server']({
                          path:`/timer/${id}`,
                          type:'timer'
                        },'get', 'type')

                        let bid = 0
                        for(let i =0; i < cheked['mongo']['count'].length; i++){

                          if(cheked['mongo']['count'][i] === data['account']['address']){

                            bid++
                          }
                        }
                        let checkedPrice =  0.014 + 1
                        let Waves = +data['account']['balance']['available'] / 100000000
                        if(Waves < checkedPrice){
                          alert('у вас не достаточно средств для ставки')
                          target.querySelector('.bidButton').innerText = 'ставка'
                          target.querySelector('.bidButton').disabled = false
                        }else{

                          let checkedTimer = await matcher['server']({
                            path:`/checked/${id}`,
                            type:'account',
                            data:{
                              account:data['account']['address']
                            }
                          },'checked', 'type')
                          // console.assert(false, timer['mongo']['data']['auction']['startHeight'])
                          if(checkedTimer['mongo']['update'] === -3){
                            alert('Вы уже сделали последнюю ставку')
                            target.querySelector('.bidButton').innerText = 'ставка'
                            target.querySelector('.bidButton').disabled = false
                          }else{
                            let bid = 0

                            for(let i =0; i < checkedTimer['mongo']['auction']['count'].length; i++){

                              if(checkedTimer['mongo']['auction']['count'][i] === checkedTimer['mongo']['auction']['winner']){

                                bid++
                              }
                            }


                            let price = parseInt((+checkedTimer['mongo']['auction']['lotAmount']*10), 10)

                            let auctionId =  checkedTimer['mongo']['auction']['auctionId']
                            let endHeight = +checkedTimer['mongo']['auction']['endHeight']
                            try {
                              let request = {}
                              let fee = await fetch(`https://nodes-testnet.wavesnodes.com/addresses/scriptInfo/${data['account']['address']}`)
                              fee = await fee.json()
                              fee = fee['extraFee']/100000000 + 0.005
                              fee = parseFloat(fee.toFixed(4), 10)
                              request = {
                                type: 16,
                                data: {
                                  fee: {
                                    "tokens": `${fee}`,
                                    "assetId": "WAVES"
                                  },
                                  dApp: window['wt']['dappaddress'],
                                  call: {
                                    function:"bid",
                                    args: [
                                      {type:"string", value:  auctionId},
                                      {type:"integer", value:  bid},
                                      {type:"integer", value: price},
                                      {type:"integer", value: endHeight}]
                                  },
                                  payment: [
                                    {amount: 100000000, assetId:null }
                                  ]
                                }
                              }
                              target.querySelector('.bidButton').innerText = 'завершение процесса'
                              let tx = await   WavesKeeper.signAndPublishTransaction(request)
                              let timer = await matcher['server']({
                                path:`/timer/${id}`,
                                type:'account',
                                data:{
                                  account:data['account']['address']
                                }
                              },'update', 'type')
                              tx = JSON.parse(tx)
                              await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
                                apiBase:'https://nodes-testnet.wavesnodes.com'
                              })
                              target.querySelector('.name').innerText = `${timer['mongo']['data']['auction']['winner']}`
                              target.querySelector('.price').innerText = `Waves: ${timer['mongo']['data']['auction']['lotAmount'].toFixed(1)}`
                              let outPrice = timer['mongo']['data']['auction']['lotAmount'] + 0.05
                              outPrice = outPrice.toFixed(3)
                              target.querySelector('.outPrice').innerText = `Waves: ${outPrice }`
                              target.querySelector('.bidButton').innerText = 'ставка'
                              target.querySelector('.bidButton').disabled = false
                            }catch (e) {
                              console.warn('ошибка', e)
                            }
                          }
                        }
                      }
                    }catch (e) {
                      alert('У вас не установлен Waves Keepper, работа без него в процессе разработки')
                      target.querySelector('.bidButton').innerText = 'ставка'
                      target.querySelector('.bidButton').disabled = false
                    }

                  }
                })
                item.querySelector('.sellButton').addEventListener('click', async (event) => {
                  let target = event.target
                  let verify = false
                  while (!verify) {
                    if(target.tagName === 'DIV' && target.className.indexOf('item') > -1){
                      verify = true
                    }else{
                      target = target.parentNode
                    }
                  }
                  let timeFeedBid = +target.className.split('_')[1]
                  try{
                    let data = await  WavesKeeper.publicState()
                    let timePlus = target.querySelector('.timer').innerText
                    timePlus = timePlus.split(':')
                    timePlus = parseInt(timePlus[0], 10) * 60 + parseInt(timePlus[1], 10)
                    timePlus = timePlus.toString()
                    let time = await matcher['server']({
                      path:`/timer/${nameAuction}`,
                      type:'timer'
                    },'get', 'type')
                    if(time['mongo']['time'] === -2){
                      if(timePlus.toLowerCase() === 'завершён'){
                        alert('Аукцион прошёл, войдите в панель администратора, что создать новый')
                      }else{
                        timePlus = +timePlus
                        timePlus = timePlus * 60000
                        let Waves = data['account']['balance']['available'] / 100000000
                        if(Waves < 1.05){
                          alert('У вас недостаточно средств для создания аукциона')
                        }else{
                          let tx = {}
                          target.querySelector('.sellButton').innerText = 'Создаётся аукцион'
                          target.querySelector('.sellButton').disabled = true
                          try {
                            let nft = await matcher['server']({
                              input:'caran-card-news',
                              type:'nft',
                              data:{
                                id:`${timeFeedBid}`,
                                dApp: window['wt']['dappaddress'],
                              },
                              path:'/nft'
                            },'get','type')
                            await window['wt']['nodeInteraction']['waitForTx'](nft['mongo']['id'],{
                              apiBase:'https://nodes-testnet.wavesnodes.com'
                            })
                            let price = target.querySelector('.price').innerText
                            price = parseInt(price.split(':')[1], 10)
                            let auction= {}
                            auction['organizer'] = data['account']['address']
                            auction['lotAssetId'] = "WAVES"
                            auction['lotAmount'] = price
                            auction['startPrice'] = price
                            auction['priceAssetId'] = "WAVES"
                            auction['winner'] = data['account']['address']
                            auction['winAmount'] = price
                            auction['startHeight'] = nft['mongo']['timestamp']
                            auction['startTime'] = timePlus
                            auction['endHeight'] = nft['mongo']['timestamp'] + timePlus
                            auction['count'] = []
                            auction['count'].push(data['account']['address'])
                            auction['count'] = JSON.stringify(auction['count'])
                            auction['name'] = timeFeedBid


                            let fee = await fetch(`https://nodes-testnet.wavesnodes.com/addresses/scriptInfo/${data['account']['address']}`)
                            fee = await fee.json()
                            fee = fee['extraFee']/100000000 + 0.005
                            fee = parseFloat(fee.toFixed(4), 10)
                            try {
                              let request = {
                                type: 16,
                                data: {
                                  fee: {
                                    "tokens": `${fee}`,
                                    "assetId": "WAVES"
                                  },
                                  dApp: window['wt']['dappaddress'],
                                  call: {
                                    function:"startAuction",
                                    args: [
                                      {type:"integer", value:  auction['endHeight']},
                                      {type:"integer", value: auction['startPrice']},
                                      {type:"string", value: nft['mongo']['id']},
                                      {type:"string", value: "WAVES"}]
                                  },
                                  payment: [
                                    {amount: 100000000, assetId:null }
                                  ]
                                }
                              }
                              try{
                                let tx = await   WavesKeeper.signAndPublishTransaction(request)
                                tx = JSON.parse(tx)
                                await window['wt']['nodeInteraction']['waitForTx'](tx.id,{
                                  apiBase:'https://nodes-testnet.wavesnodes.com'
                                })
                                // auction['auctionId'] = {}
                                // auction['auctionId'] = nft['mongo']['id']


                                auction['auctionId'] = nft['mongo']['id']


                                let outTime =  await matcher['server']({
                                  path:'/auction',
                                  type:'auction',
                                  data: auction
                                },'set', 'type')

                                let outPrice = parseInt(auction['lotAmount'],10) + 0.005
                                let time = parseInt(outTime['mongo']['data']['auction']['endHeight'], 10) - Date.now()

                                target.querySelector('.outPrice').innerText = `Waves: ${outPrice}`
                                target.querySelector('.name').innerText = data['account']['address']
                                target.querySelector('.sellButton').innerText = 'Аукцион'
                                target.querySelector('.timer').innerText = msConversion(time )

                                target.classList.add("timer")
                                setTimer({
                                  id:   auction['name'],
                                  data:  target.querySelector('.timer'),
                                  this: target,
                                  info:{
                                    name:  target.querySelector('.name'),
                                    price: target.querySelector('.price'),
                                    outPrice: target.querySelector('.outPrice')
                                  }
                                }).then((data)=>{
                                  target.querySelector('.sellButton').innerText = 'Старт'
                                })
                              }catch (e) {
                                console.warn(e)
                                target.querySelector('.sellButton').innerText = 'Старт'
                                target.querySelector('.sellButton').disabled = false
                              }


                            }catch (e) {
                              console.warn(e)
                              target.querySelector('.sellButton').innerText = 'Старт'
                              target.querySelector('.sellButton').disabled = false
                            }


                          }catch (e) {
                            console.warn(e)
                            target.querySelector('.sellButton').innerText = 'Старт'
                            target.querySelector('.sellButton').disabled = false
                          }

                        }
                      }
                    }else{
                      alert('Аукцион уже проходит')
                    }

                  }catch (e) {
                    alert('У вас не установлен Waves Keepper, работа без него в процессе разработки')
                  }
                })

              }
              polling()

            }
          }
        })
      }
    }
  })
