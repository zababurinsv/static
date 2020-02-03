let timeStamp = 0
function once (obj) {
    timeStamp = obj
    once = function (obj) { return obj }
}
export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            console.log('~~~ out  ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err  ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'set':
                (async (obj, props,data) => {
                    try {
                        console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'addEventListener':
                                (async (obj, props,data) => {
                                    try {


                                        var supportsPassive = false
                                        try {
                                            var opts = Object.defineProperty({}, 'passive', {
                                                get: function () {
                                                    supportsPassive = true
                                                }
                                            })
                                            window.addEventListener('testPassive', null, opts)
                                            window.removeEventListener('testPassive', null, opts)
                                        } catch (e) {}
                                        obj['this'].addEventListener('click', event => {
                                            let mode = {}
                                            once(event.timeStamp)
                                            if ((event.timeStamp - timeStamp) > 160 || (event.timeStamp - timeStamp) === 0) {
                                                if (event.target.getAttribute('class') === 'button xlarge circle black' || event.target.getAttribute('class') === 'btn btn-primary') {
                                                    obj.this.querySelector('.button').style.backgroundColor = 'black'
                                                    obj.this.querySelector('.button').disabled = false
                                                    let parentNodes = {}
                                                    if (obj['this'].getAttribute('mode') === 'view') {
                                                        obj['this'].setAttribute('mode', 'edit')
                                                        if (!obj['parent']) { console.assert(false, 'Установите obj[parent]', obj) }
                                                        obj['this'].getElementsByTagName('p')[1].style.display = 'block'
                                                        obj['this'].getElementsByTagName('p')[0].style.display = 'block'
                                                        event.target.style.backgroundColor = '#62bcd7'
                                                        event.target.disabled = true
                                                        mode = new CustomEvent('mode', {
                                                            detail: {
                                                                mode: 'edit',
                                                                slot: obj['parent']
                                                            }
                                                        })
                                                        document.dispatchEvent(mode)
                                                    } else {
                                                        if (!obj['parent']) { console.assert(false, 'Установите obj[parent]', obj) }
                                                        obj['this'].setAttribute('mode', 'view')




                                                        switch (obj['this'].getElementsByTagName('p')[0].className) {
                                                            case 'view':

                                                                obj['this'].getElementsByTagName('p')[0].style.display = 'block'
                                                                break
                                                            case 'edit':
                                                                obj['this'].getElementsByTagName('p')[0].style.display = 'none'
                                                                break
                                                            default:
                                                                console.assert(false, 'неизвестный тип' )
                                                                break
                                                        }

                                                        switch (obj['this'].getElementsByTagName('p')[1].className) {
                                                            case 'view':
                                                                obj['this'].getElementsByTagName('p')[1].style.display = 'block'
                                                                break
                                                            case 'edit':

                                                                obj['this'].getElementsByTagName('p')[1].style.display = 'none'

                                                                break
                                                            default:
                                                                console.assert(false, 'неизвестный тип' )
                                                                break
                                                        }
                                                        // obj['this'].getElementsByTagName('p')[1].style.display = 'none'
                                                        // obj['this'].getElementsByTagName('p')[0].style.display = 'block'
                                                        event.target.style.backgroundColor = '#62bcd7'
                                                        event.target.disabled = true
                                                        mode = new CustomEvent('mode', {
                                                            detail: {
                                                                mode: 'none',
                                                                slot: obj['parent']
                                                            }
                                                        })
                                                        document.dispatchEvent(mode)
                                                    }
                                                }
                                            }
                                            timeStamp = event.timeStamp
                                            setTimeout(function tick () {
                                                obj.this.querySelector('.button').style.backgroundColor = 'black'
                                                obj.this.querySelector('.button').disabled = false
                                                let parentNodes = {}
                                                let slot = obj['this'].querySelectorAll('slot')
                                                for (let key = 0; key < slot.length; key++) {
                                                    if (slot[key].length === 0) {

                                                    } else {
                                                        if (slot[key].assignedNodes().length === 0) {

                                                        } else {
                                                            for (let i = 0; i < slot[key].assignedNodes().length; i++) {
                                                                switch (slot[key].assignedNodes()[i].tagName) {
                                                                    case 'VARAN-CROP':
                                                                        parentNodes = slot[key].assignedNodes()[i].parentNode
                                                                        break
                                                                    case 'DIV':
                                                                        if (parentNodes.tagName === 'VARAN-EDITOR') {
                                                                        } else {
                                                                            parentNodes = slot[key].assignedNodes()[i].parentNode
                                                                        }
                                                                        break
                                                                    case 'SECTION':
                                                                        if (parentNodes.tagName === 'VARAN-EDITOR') {
                                                                        } else {
                                                                            parentNodes = slot[key].assignedNodes()[i].parentNode
                                                                        }
                                                                        break
                                                                    default:
                                                                        console.log(`!!!!!!!!!!!!!!!!!!!!!`, slot[key].assignedNodes()[i].tagName)
                                                                        break
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                parentNodes = parentNodes.querySelector('.preloader')
                                                if (obj['this'].getAttribute('mode') === 'view') {
                                                    if (parentNodes.classList.contains('done')) {
                                                        parentNodes.classList.remove('done')
                                                    }
                                                } else {
                                                    if (!parentNodes.classList.contains('done')) {
                                                        parentNodes.classList.add('done')
                                                    }
                                                }
                                            }, 3000)
                                        })
                                        obj['this'].addEventListener('touchstart', event => {

                                        }, supportsPassive ? { passive: true } : false)



                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            default:
                err(`new function ${func}`)
                break
        }
    })
}
