/* eslint-disable no-undef */

function initLayout (obj) {
  return new Promise(function (resolve, reject) {
    let blacksDiv
    let numBlacks = obj['keybord']['property']['blacks'].length

    if (obj['verify']['swap'] === false) {
      if (obj['shadowRoot'] === true) {
        obj['this']['shadowRoot'].removeChild(obj['this']['shadowRoot'].children[0])
        // obj['this']['shadowRoot'].innerHTML = ''
        // obj['this']['shadowRoot'].classList.add('keyboard')
        blacksDiv = document.createElement('div')
        blacksDiv.className = 'blacks'
        obj['this']['shadowRoot'].appendChild(blacksDiv)
      }
    }
    // console.log('22222222222', obj['keybord']['property']['numOctaves'])
    // вв
    for (let i = 0; i < obj['keybord']['property']['numOctaves']; i++) {
      for (var j = 0; j < numBlacks; j++) {
        var isBlack = obj['keybord']['property']['blacks'][j]

        var keyDiv = document.createElement('div')

        var index = j + numBlacks * i

        var label = obj['keybord']['property']['keyboardLayout'][ index ]

        keyDiv.className = isBlack ? obj['keybord']['property']['keyBlackClass'] : obj['keybord']['property']['keyClass']
        keyDiv.innerHTML = label
        keyDiv.dataset.index = index

        keyDiv.addEventListener('mousedown', makeCallback(obj['this'], onDivMouseDown), false)
        keyDiv.addEventListener('mouseup', makeCallback(obj['this'], onDivMouseUp), false)

        obj['keybord']['property']['keys'].push(keyDiv)

        if (isBlack) {
          blacksDiv.appendChild(keyDiv)

          if (j >= 2 && !obj['keybord']['property']['blacks'][j - 1] && !obj['keybord']['property']['blacks'][j - 2] || (j === 1 && i > 0)) {
            keyDiv.classList.add('prevwhite')
          }
        } else {
          if (obj['verify']['swap'] === false) {
            if (obj['shadowRoot'] === true) {
              obj['this']['shadowRoot'].appendChild(keyDiv)
            }
          }
        }
      }
    }
    resolve(obj)
  })
}

function makeCallback (kb, fn) {
  let cb = function (e) {
    console.log('dddddddddd', fn)
    fn(kb, e)
  }

  return cb
}

function onDivMouseDown (keyboard, ev) {
  if (keyboard.keyPressed) {
    return
  }

  var key = ev.target

  dispatchNoteOn(keyboard, key.dataset.index)
}

function onDivMouseUp (keyboard, ev) {
  if (keyboard['shadowRoot'].keyPressed) {
    dispatchNoteOff(keyboard['shadowRoot'])
  }
}

function onKeyDown (keyboard, e) {
  var index = findKeyIndex(keyboard, e)

  if (keyboard.keyPressed) {
    return
  }

  if (index === -1 || e.altKey || e.altGraphKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    // no further processing
    return
  }

  dispatchNoteOn(keyboard, index)
}

function onKeyUp (keyboard, e) {
  // Only fire key up if the key is in the defined layout
  if (findKeyIndex(keyboard, e) !== -1) {
    dispatchNoteOff(keyboard)
  }
}

function findKeyIndex (keyboard, e) {
  var keyCode = e.keyCode || e.which

  var keyChar = String.fromCharCode(keyCode)

  var index = keyboard.keyboardLayout.indexOf(keyChar)

  return index
}

function dispatchNoteOn (keyboard, index) {
  keyboard['shadowRoot']['keyPressed'] = true
  let key = keyboard.shadowRoot.querySelectorAll('div')[index]
  let currentClass = key.className
  key.classList.add('active')
  let evt = document.createEvent('CustomEvent')
  evt.initCustomEvent('noteon', false, false, { index: index })
  keyboard['shadowRoot'].dispatchEvent(evt)
}

function dispatchNoteOff (keyboard) {
  let activeKey = keyboard.querySelector('.active')

  if (activeKey) {
    activeKey.classList.remove('active')
  }

  keyboard.keyPressed = false

  var evt = document.createEvent('CustomEvent')
  evt.initCustomEvent('noteoff', false, false, null)
  keyboard.dispatchEvent(evt)
}

(function () {
  var noteMap = {}
  var noteNumberMap = []
  var notes = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ]

  for (var i = 0; i < 127; i++) {
    var index = i

    var key = notes[index % 12]

    var octave = ((index / 12) | 0) - 1 // MIDI scale starts at octave = -1

    if (key.length === 1) {
      key = key + '-'
    }

    key += octave

    noteMap[key] = i
    noteNumberMap[i] = key
  }

  function getBaseLog (value, base) {
    return Math.log(value) / Math.log(base)
  }

  var MIDIUtils = {

    noteNameToNoteNumber: function (name) {
      return noteMap[name]
    },

    noteNumberToFrequency: function (note) {
      return 440.0 * Math.pow(2, (note - 69.0) / 12.0)
    },

    noteNumberToName: function (note) {
      return noteNumberMap[note]
    },

    frequencyToNoteNumber: function (f) {
      return Math.round(12.0 * getBaseLog(f / 440.0, 2) + 69)
    }

  }

  // Make it compatible for require.js/AMD loader(s)
  if (typeof define === 'function' && define.amd) {
    define(function () { return MIDIUtils })
  } else if (typeof module !== 'undefined' && module.exports) {
    // And for npm/node.js
    module.exports = MIDIUtils
  } else {
    this.MIDIUtils = MIDIUtils
  }
}).call(this)

function OscillatorVoice (context) {
  var internalOscillator = null
  var output = context.createGain()
  var frequency = 440.0
  var type = 'sine'
  var gain = 1.0

  //

  // TODO attribute wave type
  Object.defineProperties(this, {
    frequency: {
      set: setFrequency,
      get: function () {
        return frequency
      }
    },
    type: {
      set: setType,
      get: function () {
        return type
      }
    },
    gain: {
      set: setGain,
      get: function () {
        return gain
      }
    }
  })

  function setFrequency (v) {
    frequency = v
    if (internalOscillator !== null) {
      internalOscillator.frequency.value = v
    }
  }

  function setType (v) {
    type = v
    if (internalOscillator !== null) {
      internalOscillator.type = v
    }
  }

  function setGain (v) {
    gain = v
    output.gain.value = v
  }

  //

  this.output = output

  this.start = function (when) {
    when = when !== undefined ? when : 0

    // The oscillator node is recreated here "on demand",
    // and all the parameters are set too.
    if (internalOscillator === null) {
      internalOscillator = context.createOscillator()
      internalOscillator.type = type
      internalOscillator.connect(output)
    }

    internalOscillator.frequency.value = frequency
    internalOscillator.start(when)
  }

  this.stop = function (when) {
    if (internalOscillator === null) {
      return
    }

    when = when !== undefined ? when : 0

    internalOscillator.stop(when)
    internalOscillator = null
  }
}

function TagPrototype (audioContext) {
  this.classList.add('audio')

  // input: splitter?
  this.input = audioContext.createGain()
  // output: gain
  this.output = audioContext.createGain()

  this.start = function (when) {
    console.log('prototype start', when)
  }

  this.stop = function (when) {
    console.log('prototype stop', when)
  }
  this.initChildren = function (audioContext) {
    var self = this

    Array.prototype.slice.call(this.children, 0).forEach(function (child, index) {
      self.initChild(audioContext, child, index)
    })
  }

  this.initChild = function (audioContext, child, index) {
    if (child.init) {
      child.init(audioContext)
      child.output.connect(this.output)
    } else {
      console.log('no child init', child)
    }
  }

  this.initAttributes = function (which) {
    var self = this
    which.forEach(function (attr) {
      var value = self.getAttribute(attr)
      if (value !== null) {
        self[attr] = value
      }
    })
  }
}
customElements.define('audio-keyboard',
  class extends HTMLElement {
    constructor () {
      super()
      let white = []
      let property = []
      let typeSupported = []
      let words = []
      let osc = []
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
      let waves = []
      waves['sine'] = {}
      waves['square'] = {}
      waves['sawtooth'] = {}
      waves['triangle'] = {}

      function init () {
        let AudioContext = window.AudioContext || window.webkitAudioContext
        let audioCtx = new AudioContext()
        return audioCtx
      }

      // Array.prototype.slice.call(this.children, 0).forEach(function (child) {
      //   if (child.init) {
      //     child.init(audioContext)
      //     child.output.connect(audioContext.destination)
      //   } else {
      //     console.log('no child init', child)
      //   }
      // })
      function keybord (obj) {
        return new Promise(function (resolve, reject) {
          obj['keybord'] = []
          let keybord = []
          obj['keybord'] = keybord
          keybord['octaves'] = []
          keybord['property'] = []
          keybord['create'] = function () {
            keybord['property']['keyClass'] = 'key'
            keybord['property']['keyBlackClass'] = 'key black'
            keybord['property']['keyboardLayout'] = 'CcDdEFfGgAaHCCcDdEFfGgAaH'.split('')
            keybord['property']['blacks'] = [ false, true, false, true, false, false, true, false, true, false, true, false ]
            keybord['rebuildKeyboard']()
          }
          keybord['rebuildKeyboard'] = function () {
            keybord['property']['keys'] = []
            keybord['property']['numOctaves'] = obj['this'].getAttribute('octaves')
            initLayout(obj)
          }

          keybord['octaves']['set'] = function () {
            let cappedValue = value !== null ? Math.min(2, parseInt(value, 10)) : 1
            obj['this'].setAttribute('octaves', cappedValue)
            obj['this'].rebuildKeyboard()
          }
          keybord['create']()

          resolve(obj)
        })
      }
      function style (obj) {
        return new Promise(function (resolve, reject) {
          let styleS = document.createElement('style')
          let styleL = document.createElement('style')
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
                styleS.innerText = obj[`path-style-${obj['state'][state]}`]
                break
              case 'light':
                styleL.innerText = obj[`path-style-${obj['state'][state]}`]
                break
              default:
                console.log(`новый тип`, obj['state'][state])
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
          black['state'] = []
          black['state'].push('shadow')
          black['state'].push('light')
          black['words'] = words
          black[`type-swap`] = false
          black[`type-external`] = false
          black[`document-offsetWidth`] = document['body'].offsetWidth
          let verifyLight = false
          black[`getAttribute`] = (obj, type, property) => {
            if (property === 'template') {
              if (!obj.getAttribute('type')) {
                console.log('не установлен тип ставим default')
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
              console.log(obj['this'].getAttribute('type'))
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
              return obj[`verify-${type}`]
            }
          }
          if (!obj.tagName.toLowerCase()) {
            console.log('что то пошло не так middleware js objectProperty', '')
          } else {
            black[`component`] = obj.tagName.toLowerCase()
          }
          if (typeof (obj) !== 'object') {
            console.log('objectProperty middleware.js пришёл не объект')
          } else {
            if (!obj.getAttribute('type')) {
              black[`type`] = ['default']
              console.log('нет типа ставим default')
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
                    console.log(`дополнительные типы`, black[`type`][key])
                    break
                }
              }
            }
            if (!obj.slot) {
              console.log('отсутствует слот, ставится- по тегу ', obj.tagName.toLowerCase())
              obj.slot = obj.tagName.toLowerCase()
              black[`slot`] = obj.slot
            } else {
              black[`slot`] = obj.slot
            }
            if (!obj.getAttribute('type')) {
              console.log(' почему то нет атрибутов')
            } else {
              let veryfiStyle = false
              for (let key in obj.getAttribute('type').split('-')) {
                if (obj.getAttribute('type').split('-')[key].indexOf('style:') !== -1) {
                  console.log('устанавливаются пути к стилям')
                  veryfiStyle = true
                }
              }
              if (veryfiStyle === true) {
                black['style-custom'] = 'not-default'
              } else {
                console.log('устанавливается стиль по default')
                black['style-custom'] = 'default'
              }
            }
          }
          black['shadowRoot'] = false
          black['this'] = obj

          console.log(black['this'])
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
                    console.log('у компонента нет id нужно в external property script  получить id для загрузки скрипта')
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
                  console.log(`Не отслеживается, по мере надобности добавляются [${obj['external'][key].children[type].tagName.toLowerCase()}]`)
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
            return console.log('здесь я перехватывал отсутствие страницы но это убрал', error)
          })
      }

      function getTemplate (obj, swap, external) {
        return new Promise(function (resolve, reject) {
          let doc = []
          obj['template-shadow'] = []
          obj['template-light'] = []
          let verify = []
          verify['swap'] = false
          verify['external'] = false
          verify['light'] = false
          verify['slider'] = false
          verify['one'] = false
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
                      console.log(`~~~дополнительное свойство~~~`, obj['type'][type].split('-')[key])
                      break
                  }
                }
              }
            }
            if (obj['type'][type].length) {
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
                default:
                  console.log(`типы не отслеживаются`, obj['type'][type])
                  break
              }
            }
          }
          /**
                     * цикл this
                     * цикл template
                     */
          if (verify['swap'] === true) {
            for (let key = 0; key < obj['this'].children.length; key++) {
              console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
              if (obj['this'].children[key].tagName.split('-').length === 1) {
                if (obj['this'].children[key].slot === 'view') {
                  obj['this'].children[key].className = 'wall'
                }
                obj['template-light'].push(obj['this'].children[key])
              } else {
                if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                  obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                  scriptTemplate(obj['this'].children[key])
                  obj['template-light'].push(obj['this'].children[key])
                } else {
                  obj['this'].children[key].setAttribute('type', `${obj['this'].children[key].getAttribute('type')}-external`)
                  scriptTemplate(obj['this'].children[key])
                  obj['template-shadow'].push(obj['this'].children[key])
                }
              }
            }
            for (let key = 0; key < obj['template'].children.length; key++) {
              console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
              if (obj['template'].children[key].tagName.split('-').length === 1) {
                if (obj['template'].children[key].slot === 'view') {
                  obj['template'].children[key].className = 'wall'
                }
                obj['template-light'].push(obj['template'].children[key])
              } else {
                if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                  obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                  scriptTemplate(obj['template'].children[key])
                  obj['template-light'].push(obj['template'].children[key])
                } else {
                  obj['template'].children[key].setAttribute('type', `${obj['template'].children[key].getAttribute('type')}-external`)
                  scriptTemplate(obj['template'].children[key])
                  obj['template-shadow'].push(obj['template'].children[key])
                }
              }
            }
          } else {
            for (let key = 0; key < obj['this'].children.length; key++) {
              console.log('~~~~~~this~~~~~~~', obj['this'].children[key].tagName)
              if (obj['this'].children[key].tagName.split('-').length === 1) {
                if (obj['this'].children[key].slot === 'view') {
                  obj['this'].children[key].className = 'wall'
                }
                obj['template-shadow'].push(obj['this'].children[key])
              } else {
                if (obj['getAttribute'](obj['this'].children[key], 'light', 'template') === true) {
                  scriptTemplate(obj['this'].children[key])
                  obj['template-shadow'].push(obj['this'].children[key])
                } else {
                  scriptTemplate(obj['this'].children[key])
                  obj['template-light'].push(obj['this'].children[key])
                }
              }
            }
            for (let key = 0; key < obj['template'].children.length; key++) {
              console.log('~~~~~~template~~~~~~~', obj['template'].children[key].tagName)
              if (obj['template'].children[key].tagName.split('-').length === 1) {
                if (obj['template'].children[key].slot === 'view') {
                  obj['template'].children[key].className = 'wall'
                }
                obj['template-shadow'].push(obj['template'].children[key])
              } else {
                if (obj['getAttribute'](obj['template'].children[key], 'light', 'template') === true) {
                  scriptTemplate(obj['template'].children[key])
                  obj['template-shadow'].push(obj['template'].children[key])
                } else {
                  scriptTemplate(obj['template'].children[key])
                  obj['template-light'].push(obj['template'].children[key])
                }
              }
            }
          }
          obj['verify'] = verify
          if (obj['verify']['slider'] === true) {
            getSliderTemplate(obj)
              .then((obj) => {
                obj['template-light'].push(obj['slider'])
                obj['this']['appendChild'](obj['slider'])
                setExternalComponent(obj, 'slider')
                  .then((obj) => {
                    if (obj['verify']['one'] === true) {
                      for (let state = 0; state < obj['state'].length; state++) {
                        for (let key = 0; key < obj[`template-${obj['state'][state]}`].length; key++) {
                          console.log(obj[`template-${obj['state'][state]}`][key])
                          if (obj[`template-${obj['state'][state]}`][key]['className'] === 'wall') {
                            obj[`template-${obj['state'][state]}`].splice(key, 1)
                            resolve(obj)
                          }
                        }
                      }
                    } else {
                      resolve(obj)
                    }
                  })
              })
          } else {
            resolve(obj)
          }
        })
      }
      function template (obj, type) {
        return new Promise(function (resolve, reject) {
          obj['path-template'] = `/static/html/components/${obj['component']}/${obj['component']}.html`
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
                        if (obj['template-shadow'].length !== 0) {
                          obj['this']['attachShadow']({mode: 'open'})
                          obj['shadowRoot'] = true
                          for (let key = 0; key < obj['template-shadow'].length; key++) {
                            obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                          }
                        }
                        if (obj['template-light'].length !== 0) {
                          for (let key = 0; key < obj['template-light'].length; key++) {
                            obj['this']['appendChild'](obj['template-light'][key])
                          }
                        }
                      } else {
                        if (obj['template-shadow'].length !== 0) {
                          obj['this']['attachShadow']({mode: 'open'})
                          obj['shadowRoot'] = true
                          for (let key in obj['template-shadow']) {
                            obj['this']['shadowRoot']['appendChild'](obj['template-shadow'][key])
                          }
                        }
                        if (obj['template-light'].length !== 0) {
                          for (let key in obj['template-light']) {
                            obj['this']['appendChild'](obj['template-light'][key])
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

      function getSliderTemplate (obj) {
        return new Promise(function (resolve, reject) {
          fetch(`/static/html/components/varan-slider/varan-slider.html`)
            .then(function (response) {
              if (response.ok) {
                return response.text()
              }
            }).then(function (body) {
              let parser = new DOMParser()
              let doc = parser.parseFromString(body, 'text/html')
              obj['slider'] = doc.getElementsByTagName('template')[0].content.cloneNode(true)
              let slider = document.createElement('section')
              slider.className = 'slider'
              slider.slot = 'view'
              slider.appendChild(obj['slider'])
              obj['slider'] = slider
              resolve(obj)
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
                    console.log(`какой то неизвестный тип`, type)
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
      function setSlider (obj) {
        return new Promise(function (resolve, reject) {
          resolve(Peppermint(obj, {
            dots: false,
            slideshow: false,
            speed: 500,
            slideshowInterval: 5000,
            stopSlideshowAfterInteraction: true,
            onSetup: function (n) {
              console.log('Peppermint setup done. Slides found: ' + n)
            }
          }))
        })
      }
      function scriptTemplate (obj) {
        return new Promise(function (resolve, reject) {
          const script = document.createElement('script')
          let verify = false
          for (let key in document['head'].getElementsByTagName('script')) {
            if (typeof (document['head'].getElementsByTagName('script')[key]) === 'object') {
              if (document['head'].getElementsByTagName('script')[key].outerHTML.indexOf(obj.tagName.toLowerCase()) !== -1) {
                verify = true
              }
            }
          }
          if (verify === true) {
            console.log('script уже загруже')
          } else {
            script.src = `/static/html/components/${obj.tagName.toLowerCase()}/${obj.tagName.toLowerCase()}.js`
            script.onload = resolve
            script.onerror = reject
            document['head'].appendChild(script)
          }
        })
      }

      function setExternalComponent (obj, type, nObj) {
        return new Promise(function (resolve, reject) {
          if (!type) {
            resolve(obj)
          } else {
            switch (type) {
              case 'slider': {
                getElementsByClassName(obj, 'peppermint')
                  .then((slider) => {
                    setSlider(slider)
                      .then((slider) => {
                        obj['slider'] = slider
                        resolve(obj)
                      })
                  })
              }
                break
              default:
                console.log(`какой то неизвестный тип`, type)
                break
            }
            resolve(obj)
          }
        })
      }
      objectProperty(this)
        .then((obj) => {
          template(obj)
            .then((obj) => {
              style(obj)
                .then((obj) => {
                  keybord(obj)
                    .then((obj) => {
                      listener(obj)
                    })
                  return obj
                })
              return obj
            })
          return obj
        })
      async function listener (obj) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', obj, '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

        obj['this']['shadowRoot'].addEventListener('keydown', makeCallback(obj['this']['shadowRoot'], onKeyDown), false)
        obj['this']['shadowRoot'].addEventListener('keyup', makeCallback(obj['this']['shadowRoot'], onKeyUp), false)

        window.addEventListener('storage', function (events) {

        })
        let scroll = []
        function setCoords (object) {
          scroll = object
        }

        function getCoords () {
          return scroll
        }
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
    }
  })
