import dex from '/static/html/components/component_modules/dex/dex.mjs'
import classDex from '/static/html/components/component_modules/dex/dex_c.mjs'
import iframe from '/static/html/components/component_modules/iframe/iframe.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs'
import events from '/static/html/components/component_modules/CustomEvent/index.mjs'
import Waves from '/static/html/components/component_modules/waves/waves.mjs'
customElements.define('crypto-dex',
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
                let methods = await classDex()
                let relation = {}
                let wallet = {}
                let waves = await (await Waves())

                document.addEventListener('iframe',async (event)=>{
                    if(event.detail === 'http://localhost:4999'){
                        iframe.post(event.detail, {
                            view:true,
                            property:'прослушиваем получение кошелька',
                            color:'6',
                            substrate:{},
                            relation:'await-wallet'
                        },async (event)=>{

                            console.log('--->>>>>', event)
                        })
                    }
                })

                obj['this'].shadowRoot.querySelector('#fswe').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                   await navigator.clipboard.writeText(value)
                   let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#fswe').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#fbwe').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#fbwe').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#fbue').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#fbue').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                })
                obj['this'].shadowRoot.querySelector('#fbeu').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#fbeu').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                })
                obj['this'].shadowRoot.querySelector('#fbwu').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                   
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#fbwu').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#fswu').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#fswu').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                obj['this'].shadowRoot.querySelector('#sbew').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#sbew').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#sbwe').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#sbwe').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#sseu').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#sseu').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#ssue').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#ssue').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#sbwu').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#sbwu').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#sbuw').addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let value =  event.currentTarget.innerHTML
                    value = value.split('*')[0].split('(')[1]
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        obj['this'].shadowRoot.querySelector('#sbuw').style.background = 'transparent'
                        clearTimeout(timer);
                    }, 250);
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#left').addEventListener('input',async (e)=>{
                    relation['w'] =  e.target.value
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#center').addEventListener('input',async (e)=>{
                    relation['u'] =  e.target.value
                },{passive:true})
                obj['this'].shadowRoot.querySelector('#right').addEventListener('input',async (e)=>{
                    relation['e'] =  e.target.value
                },{passive:true})

                let description = {
                    wavesEuro:{
                        amountAsset:'474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
                        priceAsset:'WAVES',
                        tickSize:undefined,
                    },
                    euroUsd:{
                        amountAsset:'474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
                        priceAsset:'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
                        tickSize:undefined
                    },
                    wavesUsd:{
                        amountAsset:'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
                        priceAsset:'WAVES',
                        tickSize:undefined
                    },
                    details:{},
                    name:{},
                    fee:{},
                    assetId:['474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu','DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p']
                }
                let itemDetails = {}
                for(let item of description['assetId']){
                    itemDetails[`${item}`] = await events.eventListener.set(true,'w','8',item,'/assets/details/{assetId}')
                    description['details'][`${item}`] = itemDetails[`${item}`]['decimals']
                    description['name'][`${item}`] = itemDetails[`${item}`]['name']
                }
                description['details'][`WAVES`] = 8
                description['name'][`WAVES`] = `WAVES`

                for(let key in description){
                  switch (key) {
                      case 'wavesEuro':
                          obj['this'].shadowRoot.querySelector('[for="left"]').insertAdjacentHTML('beforeend', `${description['name'][`${description[key]['amountAsset']}`]}`)
                          obj['this'].shadowRoot.querySelector('#preview-left').innerText =`${description['name'][`${description[key]['amountAsset']}`]}/${description['name'][`${description[key]['priceAsset']}`]}`
                          break
                      case 'euroUsd':
                          obj['this'].shadowRoot.querySelector('[for="center"]').insertAdjacentHTML('beforeend', `${description['name'][`${description[key]['priceAsset']}`]}`)
                          obj['this'].shadowRoot.querySelector('#preview-center').innerText =`${description['name'][`${description[key]['amountAsset']}`]}/${description['name'][`${description[key]['priceAsset']}`]}`
                          break
                      case 'wavesUsd':
                          obj['this'].shadowRoot.querySelector('[for="right"]').insertAdjacentHTML('beforeend', `${description['name'][`${description[key]['priceAsset']}`]}`)
                          obj['this'].shadowRoot.querySelector('#preview-right').innerText =`${description['name'][`${description[key]['amountAsset']}`]}/${description['name'][`${description[key]['priceAsset']}`]}`
                          break
                      default:
                          break
                  }
                }
                
                relation['w'] = 10
                relation['u'] = 10
                relation['e'] = 0.1
                relation['decimals'] = description['details']
                relation['fee'] = {}
                relation['description'] = []

                    // let wavesEuro = await dex['get']({type:'wavesEuro',pair:description['wavesEuro']}, obj)
                // let euroWaves = wavesEuro
                // let wavesUsd = await  dex['get']({type:'wavesUsd',pair:description['wavesUsd']}, obj)
                // let usdWaves = wavesUsd
                // let euroUsd =  await  dex['get']({type:'eurUsd',pair:description['euroUsd']}, obj)
                // let usdEuro =  euroUsd

                // console.assert(false, wavesEuro)
                // console.log('~~~1~~~~~',eurUsd)
                // console.log('~~~~~2~~~',wavesUsd)
                // console.assert(false, wavesEuro)
                // console.log(wavesUsd['bids'][i]['amount']/wvsAmount)

                let priceAssetDecimals =  {}
                let amountAssetDecimals = {}
                let timerId = setTimeout(async  function tick() {
                    relation['eue'] = undefined
                    relation['ueu'] = undefined
                    relation['wew'] = undefined
                    relation['wuw'] = undefined

                    let wavesEuro = await dex['get']({type:'wavesEuro',pair:description['wavesEuro']}, obj)
                    let euroWaves = wavesEuro
                    let wavesUsd = await  dex['get']({type:'wavesUsd',pair:description['wavesUsd']}, obj)
                    let usdWaves = wavesUsd
                    let euroUsd =  await  dex['get']({type:'eurUsd',pair:description['euroUsd']}, obj)
                    let usdEuro =  euroUsd

                    let priceAssetDecimalsEuro =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
                    let amountAssetDecimalsEuro = description['details'][`${wavesEuro['pair']['amountAsset']}`]
                    let priceAssetDecimalsUsd =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
                    let amountAssetDecimalsUsd = description['details'][`${wavesUsd['pair']['amountAsset']}`]
                    relation['fee']['euro'] = ( 1/methods.denormalize(wavesEuro.asks[0]['price'],priceAssetDecimalsEuro,  amountAssetDecimalsEuro))*0.003
                    relation['fee']['usd'] = ( 1/methods.denormalize(wavesUsd.asks[0]['price'],priceAssetDecimalsUsd,  amountAssetDecimalsUsd))*0.003
                    
                    relation = await methods.buy(wavesUsd, relation['u'], relation, 'wavesUsd')
                    obj['this'].shadowRoot.querySelector('#fbwu').innerHTML = `${description['name'][`${wavesUsd.pair.priceAsset}`]}=>${description['name'][`${wavesUsd.pair.amountAsset}`]}[(${relation['u']}*)${relation['buy(wavesUsd)']}]`
                    relation = await methods.sell(wavesEuro, relation['buy(wavesUsd)'], relation, 'wavesEuro')
                    obj['this'].shadowRoot.querySelector('#fswe').innerHTML = `${description['name'][`${wavesEuro.pair.priceAsset}`]}=>${description['name'][`${wavesEuro.pair.amountAsset}`]}[(${relation['buy(wavesUsd)']}*)${relation['sell(wavesEuro)']}]`
                    relation = await methods.buy(usdEuro, relation['sell(wavesEuro)'], relation, 'usdEuro')
                    obj['this'].shadowRoot.querySelector('#fbue').innerHTML = `${description['name'][`${usdEuro.pair.amountAsset}`]}=>${description['name'][`${usdEuro.pair.priceAsset}`]}[(${relation['sell(wavesEuro)']}*)${relation['buy(usdEuro)']}]`

                    // console.assert(false, relation)
                    relation['description']['ueu'] = []
                    relation['description']['ueu'].push(relation['u'])
                    relation['description']['ueu'].push(relation['buy(wavesUsd)'])
                    relation['description']['ueu'].push(relation['sell(wavesEuro)'])
                    relation['description']['ueu'].push(relation['buy(usdEuro)'])
                    relation['buy(wavesUsd)'] = {}
                    relation['sell(wavesEuro)'] ={}
                    relation['buy(usdEuro)'] = {}
                    relation = await methods.buy(wavesEuro, relation['e'], relation, 'wavesEuro')
                    obj['this'].shadowRoot.querySelector('#fbwe').innerHTML = `${description['name'][`${wavesEuro.pair.amountAsset}`]}=>${description['name'][`${wavesEuro.pair.priceAsset}`]}[(${relation['e']}*)${relation['buy(wavesEuro)']}]`
                    relation = await methods.sell(wavesUsd,relation['buy(wavesEuro)'], relation, 'wavesUsd')
                    obj['this'].shadowRoot.querySelector('#fswu').innerHTML = `${description['name'][`${wavesUsd.pair.amountAsset}`]}=>${description['name'][`${wavesUsd.pair.priceAsset}`]}[(${relation['buy(wavesEuro)']}*)${relation['sell(wavesUsd)']}]`
                    relation = await methods.buy(euroUsd,relation['sell(wavesUsd)'], relation, 'euroUsd')
                    obj['this'].shadowRoot.querySelector('#fbeu').innerHTML = `${description['name'][`${euroUsd.pair.priceAsset}`]}=>${description['name'][`${euroUsd.pair.amountAsset}`]}[(${relation['sell(wavesUsd)']}*)${relation['buy(euroUsd)']}]`

                    relation['description']['eue'] = []
                    relation['description']['eue'].push(relation['e'])
                    relation['description']['eue'].push(relation['buy(wavesEuro)'])
                    relation['description']['eue'].push(relation['sell(wavesUsd)'])
                    relation['description']['eue'].push(relation['buy(euroUsd)'])
                    relation['buy(wavesEuro)'] = {}
                    relation['sell(wavesUsd)'] ={}
                    relation['buy(euroUsd)'] = {}
                    relation = await methods.buy(euroWaves, relation['w'], relation, 'euroWaves')
                    obj['this'].shadowRoot.querySelector('#sbew').innerHTML = `${description['name'][`${euroWaves.pair.priceAsset}`]}=>${description['name'][`${euroWaves.pair.amountAsset}`]}[(${relation['w']}*)${relation['buy(euroWaves)']}]`
                    relation = await methods.sell(euroUsd,relation['buy(euroWaves)'], relation, 'euroUsd')
                    obj['this'].shadowRoot.querySelector('#sseu').innerHTML = `${description['name'][`${euroUsd.pair.amountAsset}`]}=>${description['name'][`${euroUsd.pair.priceAsset}`]}[(${relation['buy(euroWaves)']}*)${relation['sell(euroUsd)']}]`
                    relation = await methods.buy(wavesUsd,relation['sell(euroUsd)'], relation, 'wavesUsd')
                    obj['this'].shadowRoot.querySelector('#sbwu').innerHTML = `${description['name'][`${wavesUsd.pair.priceAsset}`]}=>${description['name'][`${wavesUsd.pair.amountAsset}`]}[(${relation['sell(euroUsd)']}*)${relation['buy(wavesUsd)']}]`

                    relation['description']['wuw'] = []
                    relation['description']['wuw'].push(relation['w'])
                    relation['description']['wuw'].push(relation['buy(euroWaves)'])
                    relation['description']['wuw'].push(relation['sell(euroUsd)'])
                    relation['description']['wuw'].push(relation['buy(wavesUsd)'])
                    relation['buy(euroWaves)'] = {}
                    relation['sell(euroUsd)'] ={}
                    relation['buy(wavesUsd)'] = {}

                    relation = await methods.buy(usdWaves, relation['w'], relation, 'usdWaves')
                    obj['this'].shadowRoot.querySelector('#sbuw').innerHTML = `${description['name'][`${usdWaves.pair.amountAsset}`]}=>${description['name'][`${usdWaves.pair.priceAsset}`]}[(${relation['w']}*)${relation['buy(usdWaves)']}]`
                    relation = await methods.sell(usdEuro,relation['buy(usdWaves)'], relation, 'usdEuro')
                    obj['this'].shadowRoot.querySelector('#ssue').innerHTML = `${description['name'][`${usdEuro.pair.priceAsset}`]}=>${description['name'][`${usdEuro.pair.amountAsset}`]}[(${relation['buy(usdWaves)']}*)${relation['sell(usdEuro)']}]`
                    relation = await methods.buy(wavesEuro,relation['sell(usdEuro)'], relation, 'wavesEuro')
                    obj['this'].shadowRoot.querySelector('#sbwe').innerHTML = `${description['name'][`${wavesEuro.pair.amountAsset}`]}=>${description['name'][`${wavesEuro.pair.priceAsset}`]}[(${relation['sell(usdEuro)']}*)${relation['buy(wavesEuro)']}]`

                    relation['description']['wew'] = []
                    relation['description']['wew'].push(relation['w'])
                    relation['description']['wew'].push(relation['buy(usdWaves)'])
                    relation['description']['wew'].push(relation['sell(usdEuro)'])
                    relation['description']['wew'].push(relation['buy(wavesEuro)'])
                    relation['buy(usdWaves)'] = {}
                    relation['sell(usdEuro)'] ={}
                    relation['buy(wavesEuro)'] = {}

                    let seed = 'tone leg hidden system tenant aware desk clap body robust debris puppy ecology scan runway thing second metal cousin ocean liberty banner garment rice feel'
                    let publicKey = 'HrMWJVXDkjpzkMA3LnzurfmXMtRTtip4uS2236NvW6AR'
                    let timestamp = Date.now();
                    let signature = await events.eventListener.set(true,'w','8',{
                        seed:seed,
                        publicKey:publicKey,
                        timestamp:timestamp
                    },'/assets/signature/{assetId}')

                    let getOrders = await  events.eventListener.set(true, {
                        timestamp:timestamp,
                        signature:signature
                    },'7',{
                        property:'получаем ордера',
                        publicKey:publicKey,
                        substrate:publicKey,
                        relation:'t'
                    },'/matcher/orderbook/{publicKey}')



                    let idbOrders = await events.eventListener.set(true, 't','7','monopoly','/storage/get/all')
                    if(getOrders.length > 2){
                        let object = JSON.stringify({
                            sender: publicKey,
                            timestamp: timestamp,
                            signature: signature,
                            orderId: null
                        })
                        await events.eventListener.set(true, 't','7',object,'/matcher/orderbook/cancel')
                        await events.eventListener.set(true, 't','7',{},'/storage/delete/all')
                    }else{
                            let order = await events.eventListener.set(true,'t','8',relation['system']['items']['eue']['substrate'],'/matcher/orderbook/set')
                          await events.eventListener.set(true, 't','7',order,'/storage/set/item')
                    }
                    //  console.log('###################', requestSet)
                    if(relation['description']['ueu'][0] - relation['description']['ueu'][3] < 0){
                        relation['description']['ueu'].push(new Date().toString())
                        relation['description']['ueu'].push('first')
                        obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['ueu'], null, 2)}</p>`)
                        obj['this'].shadowRoot.querySelector('div.fbwu').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.fswe').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.fbue').style.background ='#f476b673'
                    }else{
                        obj['this'].shadowRoot.querySelector('div.fbwu').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.fswe').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.fbue').style.background ='#7694f473'
                    }
                    if(relation['description']['eue'][0] - relation['description']['eue'][3] < 0){
                        relation['description']['eue'].push(new Date().toString())
                        relation['description']['eue'].push('second')
                        obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['eue'], null, 2)}</p>`)
                        obj['this'].shadowRoot.querySelector('div.fbwe').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.fswu').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.fbeu').style.background ='#f476b673'
                    }else{
                        obj['this'].shadowRoot.querySelector('div.fbwe').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.fswu').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.fbeu').style.background ='#7694f473'
                    }
                    if(relation['description']['wuw'][0] - relation['description']['wuw'][3] < 0){
                        relation['description']['wuw'].push(new Date().toString())
                        relation['description']['wuw'].push('fird')
                        obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wuw'], null, 2)}</p>`)
                        obj['this'].shadowRoot.querySelector('div.sbew').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.sseu').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.sbwu').style.background ='#f476b673'
                    }else{
                        obj['this'].shadowRoot.querySelector('div.sbew').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.sseu').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.sbwu').style.background ='#7694f473'
                    }
                    if(relation['description']['wew'][0] - relation['description']['wew'][3] < 0){
                        relation['description']['wew'].push(new Date().toString())
                        relation['description']['wew'].push('fourth')
                        obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wew'], null, 2)}</p>`)
                        obj['this'].shadowRoot.querySelector('div.sbuw').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.ssue').style.background ='#f476b673'
                        obj['this'].shadowRoot.querySelector('div.sbwe').style.background ='#f476b673'
                    }else{
                        obj['this'].shadowRoot.querySelector('div.sbuw').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.ssue').style.background ='#7694f473'
                        obj['this'].shadowRoot.querySelector('div.sbwe').style.background ='#7694f473'
                    }
                    // console.log('~~~~>>', relation)
                    // relation.timestamp =  new Date();
                    // if((relation['buy(usdEuro)'] - relation['u']) > 0){

                    //  }
                    // if((relation['buy(euroUsd)'] - relation['e']) > 0){
                    //     obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`
                    //          <p class="euroUsd">${JSON.stringify(relation, null, 2)}</p> `)
                    // }
                    // methods.buy(euroUsd)

    
    
                    for(let i=0; i < 10;i++){
                        if(wavesEuro['asks'][i] === undefined){
                        }else{
                            priceAssetDecimals =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
                            amountAssetDecimals = description['details'][`${wavesEuro['pair']['amountAsset']}`]
                            obj['this'].shadowRoot.querySelector('#wavesEuroAsk').children[i].innerText = `${ waves.denormalize(wavesEuro['asks'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
                        }
                        if(wavesEuro['bids'][i] === undefined){
                        }else{
                            priceAssetDecimals =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
                            amountAssetDecimals = description['details'][`${wavesEuro['pair']['amountAsset']}`]
                            obj['this'].shadowRoot.querySelector('#wavesEuroBid').children[i].innerText = `${ waves.denormalize(wavesEuro['bids'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
                        }

                        if(wavesUsd['asks'][i] === undefined){
                        }else{
                            priceAssetDecimals =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
                            amountAssetDecimals = description['details'][`${wavesUsd['pair']['amountAsset']}`]
                            obj['this'].shadowRoot.querySelector('#wavesUsdAsk').children[i].innerText = `${ waves.denormalize(wavesUsd['asks'][i]['price'],priceAssetDecimals,amountAssetDecimals ) }`
                        }
                        if(wavesUsd['bids'][i] === undefined){
                        }else{
                            priceAssetDecimals =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
                            amountAssetDecimals = description['details'][`${wavesUsd['pair']['amountAsset']}`]
                            obj['this'].shadowRoot.querySelector('#wavesUsdBid').children[i].innerText =  `${ waves.denormalize(wavesUsd['bids'][i]['price'],priceAssetDecimals,amountAssetDecimals ) }`
                        }

                        if(euroUsd['asks'][i] === undefined){
                        }else{
                            priceAssetDecimals =  description['details'][`${euroUsd['pair']['priceAsset']}`]
                            amountAssetDecimals = description['details'][`${euroUsd['pair']['amountAsset']}`]
                            obj['this'].shadowRoot.querySelector('#euroUsdAsk').children[i].innerText =  `${ waves.denormalize(euroUsd['asks'][i]['price'],priceAssetDecimals, amountAssetDecimals) }`
                        }
                        if(euroUsd['bids'][i] === undefined){

                        }else{
                            priceAssetDecimals =  description['details'][`${euroUsd['pair']['priceAsset']}`]
                            amountAssetDecimals = description['details'][`${euroUsd['pair']['amountAsset']}`]
                            obj['this'].shadowRoot.querySelector('#euroUsdBid').children[i].innerText = `${ waves.denormalize(euroUsd['bids'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
                        }


                        obj['this'].shadowRoot.querySelector('#wavesEuroTimestamp').innerText = wavesEuro['timestamp']
                        obj['this'].shadowRoot.querySelector('#wavesEuroDelta').innerText = Date.now() - wavesEuro['timestamp']
                        obj['this'].shadowRoot.querySelector('#wavesUsdTimestamp').innerText = wavesUsd['timestamp']
                        obj['this'].shadowRoot.querySelector('#wavesUsdDelta').innerText = Date.now() - wavesUsd['timestamp']
                        obj['this'].shadowRoot.querySelector('#euroUsdTimestamp').innerText = euroUsd['timestamp']
                        obj['this'].shadowRoot.querySelector('#euroUsdDelta').innerText = Date.now() - euroUsd['timestamp']
                    }
                timerId = setTimeout(tick, 3000);
                }, 3000);
            }
        }
    })
