customElements.define('audio-drums',
  class extends HTMLElement {
    constructor () {
      super()
      let white = []
      let property = []
      let tag = []
      let tags = []
      let typeSupported = []
      let words = []
      let tagEditor = []

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



        //////////////////////////////////////////

        /*
  Johan Karlsson 2018
  https://twitter.com/DonKarlssonSan
  Released under the MIT License


  Knobs by Kyle Shanks:

  Copyright (c) 2018 by Kyle Shanks (https://codepen.io/mavrK/pen/erQPvP)

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

        const app = new Vue({
            el: "#app",
            methods: {
                selectKnob: function(knob, event) {
                    knob.selected = true;
                    this.currentY = event.pageY;
                },
                unselectKnobs: function() {
                    for(var i in this.knobs) { this.knobs[i].selected = false; }
                    for(var i in this.effects) {
                        for(var j in this.effects[i].knobs) { this.effects[i].knobs[j].selected = false; }
                        this.effects[i].selected = false;
                    }
                },
                start: function() {
                    this.isPlaying = true;
                    this.intervalId = setInterval(() => {
                        this.play();
                        this.current = (this.current + 1) % 16;
                    }, 200);
                },
                stop: function() {
                    this.isPlaying = false;
                    clearInterval(this.intervalId);
                },
                rewind: function() {
                    this.current = 0;
                },
                clear: function() {
                    this.notes.forEach(column => column.forEach(note => note.value = false));
                    debugger;
                },
                play: function() {
                    for (let y = 0; y < 8; y++) {
                        let column = this.notes[y][this.current];
                        if (column.value) {
                            let osc = this.context.createOscillator();
                            osc.type = this.oscillatorType;
                            let hops = this.scale[y];
                            osc.frequency.value = 220 * Math.pow(Math.pow(2, 1 / 12), hops);
                            let peak = 0.7;
                            let time = this.context.currentTime;
                            let a = this.envelope.a / 1000;
                            let d = this.envelope.d / 1000;
                            let s = this.envelope.s / 1000;
                            let r = this.envelope.r / 1000;
                            let sl = this.envelope.sl / 100;
                            let gain = this.context.createGain();
                            osc.connect(gain);
                            gain.connect(this.context.destination);
                            gain.gain.setValueAtTime(0, time);
                            gain.gain.linearRampToValueAtTime(peak, time + a);
                            gain.gain.linearRampToValueAtTime(sl * peak, time + a + s + d);
                            let stopAt = time + a + s + d + r;
                            gain.gain.linearRampToValueAtTime(0.0001, stopAt);
                            osc.start(time);
                            osc.stop(stopAt);
                        }
                    }
                }
            },
            data: function() {
                // C Major
                let scale = [0, 2, 4, 5, 7, 9, 11, 12];
                let notes = [];
                for (let y = 0; y < 8; y++) {
                    notes.push([]);
                    for (let x = 0; x < 16; x++) {
                        notes[y].push({ value: false });
                    }
                }
                return {
                    envelope:  {
                        a: 5,
                        d: 100,
                        s: 100,
                        r: 600,
                        sl: 10
                    },
                    isPlaying: false,
                    oscillatorType: "sine",
                    scale: scale,
                    notes: notes,
                    current: 0,
                    context: undefined,
                    intervalId: undefined,
                    colorArray: [
                        "#23CDE8",
                        "#23F376",
                        "#FFFB43",
                        "#FA9C34",
                        "#21CD92",
                        "#ED31A2",
                        "#E22"
                    ],
                    effects: [
                        {
                            id: 0,
                            label: "Envelope",
                            knobs: [
                                {
                                    label: "Attack",
                                    rotation: -13,
                                    selected: false,
                                    setValue: (val) => this.envelope.a = (val + 132)/255*1000,
                                },
                                {
                                    label: "Delay",
                                    rotation: -132,
                                    selected: false,
                                    setValue: (val) => this.envelope.d = (val + 132)/255*1000
                                },
                                {
                                    label: "Sustain",
                                    rotation: -132,
                                    selected: false,
                                    setValue: (val) => this.envelope.s = (val + 132)/255*1000,
                                },
                                {
                                    label: "Sustain Level",
                                    rotation: -132,
                                    selected: false,
                                    setValue: (val) => this.envelope.sl = (val + 132)/255*100,
                                },
                                {
                                    label: "Release",
                                    rotation: -132,
                                    selected: false,
                                    setValue: (val) => this.envelope.r = (val + 132)/255*1000,
                                }
                            ],
                            active: true,
                            selected: false,
                            color: "#23F376",
                            knobStyle: 1
                        }
                    ],
                    currentY: 0,
                    mousemoveFunction: function(e) {
                        var selectedEffect = app.effects.filter(function(i) {
                            return i.selected === true;
                        })[0];
                        if (selectedEffect) {
                            var selectedKnob = selectedEffect.knobs.filter(function(i) {
                                return i.selected === true;
                            })[0];
                        }
                        if (selectedKnob) {
                            // Knob Rotation
                            if (e.pageY - app.currentY !== 0) {
                                selectedKnob.rotation -= e.pageY - app.currentY;
                            }
                            app.currentY = e.pageY;

                            // Setting Max rotation
                            if (selectedKnob.rotation >= 132) {
                                selectedKnob.rotation = 132;
                            } else if (selectedKnob.rotation <= -132) {
                                selectedKnob.rotation = -132;
                            }

                            // Knob method to update parameters based on the known rotation
                            selectedKnob.setValue(selectedKnob.rotation);
                        }
                    }
                };
            },
            mounted: function() {
                let AudioContext = window.AudioContext || window.webkitAudioContext;
                this.context = new AudioContext();
            }
        });

        window.addEventListener('mousemove', app.mousemoveFunction);



        /////////////////////////////////////////
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
                if (obj['verify']['preset'] === true) {
                  obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${obj['preset']}/${obj['component']}-${obj['preset']}.css';`
                }
                styleS.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
                break
              case 'light':
                if (obj['verify']['preset'] === true) {
                  obj[`path-style-${obj['state'][state]}-preset`] = `@import '/static/html/components/${obj['component']}/template/${obj['preset']}/${obj['component']}-${obj['preset']}.css';`
                }
                styleL.innerText = obj[`path-style-${obj['state'][state]}`] + obj[`path-style-${obj['state'][state]}-preset`]
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
          for (let key in verify) {
            obj['verify'][key] = verify[key]
          }
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
          obj['verify'] = []
          if (!obj['this'].getAttribute('preset')) {
            obj['path-template'] = `/static/html/components/${obj['component']}/${obj['component']}.html`
            obj['verify']['preset'] = false
          } else {
            obj['path-template'] = `/static/html/components/${obj['component']}/template/${obj['this'].getAttribute('preset')}/${obj['component']}-${obj['this'].getAttribute('preset')}.html`
            obj['preset'] = `${obj['this'].getAttribute('preset')}`
            obj['verify']['preset'] = true
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
          fetch(`/static/html/components/varan-slider/template/${obj['slot']}.html`)
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
              if (slider.querySelectorAll('.ql-editor').length === 0) {
                resolve(obj)
              } else {
                for (let key = 0; key < slider.querySelectorAll('.ql-editor').length; key++) {
                  if (slider.querySelectorAll('.ql-editor')[key].children.length === 0) {

                  } else {
                    for (let type = 0; type < slider.querySelectorAll('.ql-editor')[key].children.length; type++) {
                      if (slider.querySelectorAll('.ql-editor')[key].children[type].tagName.split('-').length > 1) {
                        scriptTemplate(slider.querySelectorAll('.ql-editor')[key].children[type])
                      }
                    }
                  }
                }
              }
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
                  listener(obj)
                  return obj
                })
              return obj
            })
          return obj
        })
      async function listener (obj) {
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', obj, '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
        obj['template-editor'] = []
        obj['parser-property'] = tag
        tag.push('&lt;div')
        tag.push('&lt;/div')
        tag.push('&lt;style')
        tag.push('&lt;/style')
        tag.push('&lt;section')
        tag.push('/section&gt;')
        tag.push('&lt;article')
        tag.push('/article&gt;')
        tag.push('&lt;time')
        tag.push('/time&gt;')
        tag.push('&lt;/script')
        tag.push('&lt;script')
        tagEditor.push('&lt;p')
        tagEditor.push('&lt;/p')
        tagEditor.push('&lt;style')
        tagEditor.push('&lt;/style')
        tagEditor.push('&lt;section')
        tagEditor.push('/section&gt;')
        tagEditor.push('&lt;article')
        tagEditor.push('/article&gt;')
        tagEditor.push('&lt;time')
        tagEditor.push('/time&gt;')
        tags.push('div')
        tags.push('section')
        tags.push('style')
        tags.push('script')
        tags.push('varan-editor')
        let quillEditor = []
        let form = []
        let contentEditor = []
        let contentView = []
        let contentViewSlider = []
        let toolbarOptions = [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],
          [{'header': 1}, {'header': 2}], // custom button values
          [{'list': 'ordered'}, {'list': 'bullet'}],
          [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript
          [{'indent': '-1'}, {'indent': '+1'}], // outdent/indent
          [{'size': ['small', false, 'large', 'huge']}], // custom dropdown
          [{'header': [1, 2, 3, 4, 5, 6, false]}],
          [{'color': []}, {'background': []}], // dropdown with defaults from theme
          [{'font': []}],
          [{'align': []}],
          ['clean'] // remove formatting button
        ]
        contentView = obj['this'].getElementsByClassName('wall')[0]
        form = obj['this'].getElementsByTagName('form')[0]
        quillEditor = obj['this'].getElementsByClassName('editor')[0]
        contentViewSlider = obj['this'].getElementsByClassName('peppermint-slides')[0]

        let quill = new Quill(quillEditor, {
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'Введите сообщение...',
          theme: 'snow'
        })
        let component = []
        component['id'] = obj['this']['slot']
        component['url'] = location.hostname
        component['component'] = obj['this'].tagName.toLowerCase()
        component['user'] = 'anonymous'
        component['view-wall'] = ''
        component['view-slider'] = ''
        component['edit-content'] = contentEditor
        component['editor-delta'] = JSON.stringify(quill.getContents())
        component['editor-type'] = 'public'
        component['captcha'] = ''
        component['init'] = false
        component['count'] = 0
        component['status'] = -1
        component['online'] = false
        component['Timestamp'] = ''
        component['view-slider-pos'] = 0
        component['view-slider-db-Id'] = 0

        // let localStore = localStorage.getItem(`${obj['component']}-${obj['slot']}`)
        // if (!localStore) {
        //   asset['default']['asset']['$children'][0]['$children'][0]['get'](component)
        //     .then((data) => {
        //       localStore = localStorage.getItem(`${obj['component']}-${obj['slot']}`)
        //       localStore = JSON.parse(localStore)
        //       for (let key in component) {
        //         let x = key
        //         let remove = true
        //         for (let key in localStore) {
        //           if (x === key) {
        //             remove = false
        //           }
        //         }
        //         if (remove === true) {
        //           if (localStore[`${key}`] === undefined) {
        //             console.log(`~~~~~~~~~~~~~~~~~~~~ОТСУТСТВУЕТ В ~~localStore~~~~~~~~~~~~~~ ${key}`)
        //             localStore[`${key}`] = component[key]
        //           } else {
        //             (
        //               console.log(`~~~~~~~~~~~~~~~~~~~~ОТСУТСТВУЕТ В ~~component~~~~~~~~~~~~~~ ${key}`)
        //             )
        //           }
        //         }
        //         if (key !== 'component') {
        //           component[key] = localStore[`${key}`]
        //         }
        //       }
        //       let cccc = []
        //       cccc = JSON.parse(component['delta'])
        //       console.log(`~~~~~~~~${obj}~~~~localStore~~~~`)
        //       quill.setContents(cccc)
        //       contentView.innerHTML = component['view']
        //     })
        // } else {
        //   console.log('нужно проще написать')
        //   asset['default']['asset']['$children'][0]['$children'][0]['get'](component)
        //     .then((data) => {
        //       localStore = localStorage.getItem(`${obj['component']}-${obj['slot']}`)
        //       localStore = JSON.parse(localStore)
        //       for (let key in component) {
        //         let x = key
        //         let remove = true
        //         for (let key in localStore) {
        //           if (x === key) {
        //             remove = false
        //           }
        //         }
        //         if (remove === true) {
        //           if (localStore[`${key}`] === undefined) {
        //             console.log(`~~~~~~~~~~~~~~~~~~~~ОТСУТСТВУЕТ В ~~localStore~~~~~~~~~~~~~~ ${key}`)
        //             localStore[`${key}`] = component[key]
        //           } else {
        //             (
        //               console.log(`~~~~~~~~~~~~~~~~~~~~ОТСУТСТВУЕТ В ~~component~~~~~~~~~~~~~~ ${key}`)
        //             )
        //           }
        //         }
        //         if (key !== 'component') {
        //           component[key] = localStore[`${key}`]
        //         }
        //       }
        //       let cccc = []
        //       cccc = JSON.parse(component['delta'])
        //       quill.setContents(cccc)
        //       contentView.innerHTML = component['view']
        //     })
        // }
        // quill.on('selection-change', function (range, oldRange, source) {
        //   if (range) {
        //     if (range.length === 0) {
        //       console.log('User cursor is on', range.index)
        //     } else {
        //       let text = quill.getText(range.index, range.length)
        //     }
        //   } else {
        //   }
        // })
        // function getElement (obj) {
        //   return new Promise(function (resolve, reject) {
        //     for (let type in white['parser-property']) {
        //       if (obj.outerHTML.indexOf(white['parser-property'][type]) !== -1) {
        //         console.log('obj--', obj)
        //         resolve(obj.innerText)
        //       }
        //     }
        //     resolve(obj)
        //   })
        // }
        async function parser (component) {
        // let doc = document.createElement('div')
        // doc.innerHTML = component[`edit`]
        // let templete = ''
        // let verifyStyle = false
        // let verifyScript = false
        // let script = []
        // let tmpScript = []
        // for (let key in doc.children) {
        //   let verify = false
        //   if (typeof (doc.children[key]) === 'object') {
        //     for (let type in white['parser-property']) {
        //       if (doc.children[key].outerHTML.indexOf(white['parser-property'][type]) !== -1) {
        //         if (white['parser-property'][type] === '&lt;style') {
        //           verifyStyle = true
        //         }
        //         if (white['parser-property'][type] === '&lt;/style') {
        //           verifyStyle = false
        //         }
        //         if (white['parser-property'][type] === '&lt;script') {
        //           verifyScript = true
        //         }
        //         if (white['parser-property'][type] === '&lt;/script') {
        //           verifyScript = 47
        //         }
        //         verify = true
        //         break
        //       }
        //     }
        //     if (verify === true) {
        //       if (verifyScript === true) {
        //         tmpScript = tmpScript + doc.children[key].innerText
        //       } else if (verifyScript === 47) {
        //         tmpScript = tmpScript + doc.children[key].innerText
        //       } else {
        //         templete = templete + doc.children[key].innerText
        //       }
        //     } else {
        //       if (verifyStyle === true) {
        //         templete = templete + doc.children[key].innerText
        //       } else if (verifyScript === true) {
        //         tmpScript = tmpScript + doc.children[key].innerText
        //         console.log('@@@@@2@@@@', tmpScript, verify, verifyScript)
        //       } else {
        //         templete = templete + doc.children[key].outerHTML
        //       }
        //     }
        //   }
        // }
        // console.log(tmpScript)
          contentViewSlider.children[obj['slider'].getCurrentPos()].innerHTML = quill.root.innerHTML
          contentView.innerHTML = quill.root.innerHTML
          // component[`view`] = templete
          // contentView.innerHTML = templete
          // contentView.innerHTML = contentView.innerHTML + tmpScript
        // asset['default']['asset']['$children'][0]['$children'][0]['update'](component)
        }

        form.onsubmit = function () {
          component[`id`] = obj['slot']
          component[`editor-delta`] = JSON.stringify(quill.getContents())
          component[`edit-content`] = quill.root.innerHTML
          component['view-slider'] = 0
          component['view-slider-pos'] = obj['slider'].getCurrentPos()
          component['view-slider-db-Id'] = `${0}-${obj['slider'].getCurrentPos()}`
          component[`url`] = location.hostname
          parser(component)
          return false
        }
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
      }
    }
  })
