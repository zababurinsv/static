import system from '/static/html/components/component_modules/system/system.mjs'
let listener = {}

listener['func'] = {}
listener['this'] = {}
listener['this']['style'] = {}
listener['this']['card'] = {}
listener['this']['editor'] = {}
listener['this']['template'] = {}

listener['func']['crop'] = async function (obj) {
    listener['this']['system'] = await system['init'](obj)
    return listener['this']['system']['func']
}

listener['listen'] = async function (obj, type) {
    obj.addEventListener('click', (event) => {
        // console.log('~~~~~~~~~~~editor~create~~~~~~~~~~~~~~~~', event.target)
    })
}

listener['func']['editor'] = async function (obj) {
    // console.log('~~~~~~Listener~~~~~~~~', obj)
    let scroll = []

    function setCoords (object) {
        scroll = object
    }

    function getCoords () {
        return scroll
    }

    obj['this'].querySelector('.createObject').addEventListener('click', (event) => {
        console.log('~~~~~~~~~~~editor~create~~~~~~~~~~~~~~~~', event.target)
        listener['this']['editor'] = listener['func']['createObject'](obj, event)
        listener['this']['editor'].then((obj) => {
            for (let key = 0; key < obj['this'].querySelectorAll('section').length; key++) {
                if (obj['this'].querySelectorAll('section')[key].slot === 'edit') {
                    obj['listener-create'].slot = 'edit'
                    obj['this'].querySelectorAll('section')[key].slot = ''
                }
                if (obj['this'].querySelectorAll('section')[key].slot === 'view') {
                    obj['this'].querySelectorAll('varan-crop')[0].slot = 'view'
                    obj['this'].querySelectorAll('section')[key].slot = ''
                }
            }
        })
    })

    obj['this'].addEventListener('keydown', (event) => {
        if (event.ctrlKey === true) {
            if (event.key === 'c') {
                setCoords(document.documentElement.scrollTop)
            }
            if (event.key === 'v') {
                setCoords(document.documentElement.scrollTop)
            }
        }
    })
    obj['this'].addEventListener('keypress', (event) => {
        if (event.key === 'v') {
            setCoords(-1)
        }
    })
    obj['this'].addEventListener('keyup', (event) => {
        if (event.ctrlKey === true) {
            if (event.key === 'c') {
            }
            if (event.key === 'v') {
                let out = getCoords()
                out = out + 100
                document.documentElement.scrollTop = out
            }
        } else {
            if (event.key === 'v' && getCoords() !== -1) {
                let out = getCoords()
                out = out + 100
                document.documentElement.scrollTop = out
            }
        }
    })
    return obj
}
listener['func']['template'] = function (obj) {
    return new Promise(function (resolve, reject) {
        listener['this']['template'] = `/static/html/components/${obj['component']}/template/create/${obj.slot.split('-')[1]}/${obj.slot.split('-')[2]}.html`
        console.log('~~~~~~~template~~~~~~~~~~', listener['this']['template'])
        fetch(listener['this']['template'])
            .then(function (response) {
                if (response.ok) {
                    return response.text()
                }
            }).then(function (body) {
            let parser = new DOMParser()
            let doc = parser.parseFromString(body, 'text/html')
            listener['this']['template'] = doc.getElementsByTagName('template')[0].content.cloneNode(true)
            resolve(listener['this']['template'])
        })
            .catch(error => {
                return error
            })
    })
}
listener['func']['style'] = function (obj) {
    return new Promise(function (resolve, reject) {
        listener['this']['style-path'] = `@import '/static/html/components/${obj['component']}/template/create/${obj.slot.split('-')[1]}/${obj.slot.split('-')[2]}.css';`
        resolve(listener['this']['style-path'])
    })
}
let init = async function (obj) {
    // console.log('~~~~~~~~listener~~~~~~~', obj)

    return listener
}

export default {
    init: obj => { return init(obj) }
}
