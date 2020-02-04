import modal from '/static/html/components/component_modules/varan-modal/varan-modal-1.0.mjs'
import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
import createObject from '/static/html/components/component_modules/varan-object/varan-object.mjs'
Number.isNaN = Number.isNaN || function (value) {
  return typeof value === 'number' && isNaN(value)
}
let count = {}
count.staticProperty = 0
function colorLog (message, color, ...args) {
  color = color || 'black'
  switch (color) {
    case 'success':
      color = 'firebrick'
      break
    case 'info':
      color = 'DodgerBlue'
      break
    case 'error':
      color = 'Red'
      break
    case 'warning':
      color = 'Orange'
      break
    case 'events-out':
      color = 'blue'
      break
    case 'violet':
      color = 'violet'
      break
    default:
  }
  console.log('%c' + message, 'color:' + color, ...args)
}
function pause (obj) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(obj)
    }, 100)
  })
}
let pagination = {}
let object = {}
let state = {}
pagination['func'] = {}
object['staticProperty'] = {}
state['staticProperty'] = {}
state['staticProperty'] = 0

pagination['func']['listener'] = function (obj) {
  if (!obj['pagination']['btn_next']) {
  } else {
    obj['pagination']['btn_next'].addEventListener('click', (event) => {
      object['staticProperty']['pagination']['func']['nextPage'](object['staticProperty']['pagination'])
    })
  }
  if (!obj['pagination']['btn_prev']) {

  } else {
    obj['pagination']['btn_prev'].addEventListener('click', (event) => {
      object['staticProperty']['pagination']['func']['prevPage'](object['staticProperty']['pagination'])
    })
  }
}
let timeStamp = 0
pagination['func']['prevPage'] = function (obj) {
  if (timeStamp !== event.timeStamp) {
    if (obj['page'] > 1) {
      obj['page']--
      obj['func']['changePage'](obj)
    }
    timeStamp = event.timeStamp
  }
}
pagination['func']['nextPage'] = function (obj) {
  if (timeStamp !== event.timeStamp) {
    obj = obj['func']['numPages'](obj)
    if (obj['page'] < obj['numPages']) {
      obj['page']++
      obj['func']['changePage'](obj)
    }
    timeStamp = event.timeStamp
  }
}

pagination['func']['numPages'] = function (obj) {
  obj['numPages'] = Math.ceil(obj['objJson'].length / obj['records_per_page'])
  return obj
}

pagination['func']['changePage'] = async function (obj) {
  if (obj['page'] < 1) obj['page'] = 1
  obj = obj['func']['numPages'](obj)
  if (obj['page'] > obj['numPages']) obj['page'] = obj['numPages']
  obj = (await createObject['init'](obj))
  if (obj['slider'] === true) {
    for (let key in obj['type']) {
      switch (key) {
        case 'sliderNews':
          if (obj['type'][key] === true) {
            obj['numSlider'] = obj['objJson'].length
            obj['listing_table'].innerHTML = ''
            obj['numSlider'] = obj['numPages']
            for (let i = 1; i < obj['numSlider'] + 1; i++) {
              let item = document.createElement('section')
              item.className = obj['listing_table_item'].className
              item.setAttribute('page', `${i}`)
              for (let i = (obj['page'] - 1) * obj['records_per_page']; i < (obj['page'] * obj['records_per_page']) && i < obj['objJson'].length; i++) {
                obj['object'] = obj['objJson'][i]
                item.appendChild(obj['$create'](obj))
                obj['listing_table'].appendChild(item)
              }
              obj['page']++
            }
            let style = document.createElement('style')
            style.setAttribute('scoped', '')
            style.innerText = `@import '/static/html/components/varan-news/shadow/varan-news.css';`
            obj['listing_table'].appendChild(style)
          }
          break
        case 'sliderText':
          if (obj['type'][key] === true) {
            obj['numSlider'] = obj['objJson'].length
            obj['listing_table'].innerHTML = ''
            for (let i = 1; i < obj['numSlider'] + 1; i++) {
              let item = document.createElement('section')
              if (obj['numSlider'] > 1) {
                item.className = `ql-editor ${obj['slot']}`
              } else {
                item.className = obj['listing_table_item'].className
              }

              item.setAttribute('page', `${i}`)
              colorLog(`<${obj['slot']}-out> object['$create'] </${obj['slot']}-out>`, 'firebrick')

              item.innerHTML = obj['objJson'][i - 1]['content']
              obj['listing_table'].appendChild(item)
            }
          }
          break
        default:
          if (obj['type'][key] === true) {
            obj['numSlider'] = obj['objJson'].length
            obj['listing_table'].innerHTML = ''
            obj['numSlider'] = obj['numPages']
            for (let i = 1; i < obj['numSlider'] + 1; i++) {
              let item = document.createElement('section')
              item.className = obj['listing_table_item'].className
              item.setAttribute('page', `${i}`)
              for (let i = (obj['page'] - 1) * obj['records_per_page']; i < (obj['page'] * obj['records_per_page']) && i < obj['objJson'].length; i++) {
                obj['object'] = obj['objJson'][i]
                item.appendChild(obj['$create'](obj))
                obj['listing_table'].appendChild(item)
              }
              obj['page']++
            }
            // let style = document.createElement('style')
            // style.setAttribute('scoped', '')
            // console.assert(false, obj['object']['object'])
            // style.innerText = `@import '/static/html/components/varan-editor/template/${obj['object']['object']}.css';`
            // obj['listing_table'].appendChild(style)
            colorLog('[-]~~~~~~default~~pagination~~~~~~', 'firebrick', key)
          }
          break
      }
    }
  } else {
    for (let key in obj['type']) {
      switch (key) {
        case 'blog':
          obj['listing_table'].innerHTML = ''
          if (obj['type'][key] === true) {
            for (let i = (obj['page'] - 1) * obj['records_per_page']; i < (obj['page'] * obj['records_per_page']) && i < obj['objJson'].length; i++) {
              obj['object'] = obj['objJson'][i]
              obj['listing_table'].appendChild(obj['$create'](obj))
            }
          }
          break
        default:
          if (obj['type'][key] === true) {
            obj['listing_table'].innerHTML = ''
            for (let i = (obj['page'] - 1) * obj['records_per_page']; i < (obj['page'] * obj['records_per_page']) && i < obj['objJson'].length; i++) {
              obj['object'] = obj['objJson'][i]
              obj['listing_table'].appendChild(obj['$create'](obj))
            }
            if (obj['slot'] === 'varan-slider-news') {
              console.assert(true, obj['listing_table'])
              let style = document.createElement('style')
              style.setAttribute('scoped', '')
              style.innerText = `@import '/static/html/components/varan-news/shadow/varan-news.css';`
              obj['listing_table'].appendChild(style)
            }
          }
          break
      }
    }
  }
  for (let key = 0; key < object['staticProperty']['pagination']['listing_table'].children.length; key++) {
    object['staticProperty']['pagination']['listing_table'].children[key].addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON') {
        if (event.target.innerText.toLowerCase() === 'удалить') {
          var del = confirm('Вы точно хотите удалить файл ?')
          if (del === true) {
            let delObj = {}
            delObj['id'] = event.target.id
            delObj['component'] = event.target.getAttribute('class')
            object['staticProperty']['delObj'] = delObj
            matcher['database']['request']['functions']['delImages'](object['staticProperty'])
              .then((obj) => {
                for (let i = 0; i < obj['this'].querySelector('.section').children.length; i++) {
                  if (event.target.id === obj['this'].querySelector('.section').children[i].id) {
                    obj['this'].querySelector('.section').removeChild(obj['this'].querySelector('.section').children[i])
                  }
                }
                obj['mongo'] = null
                action(obj)
              })
          }
        } else {
          if (event.target.className.split(':').length > 1) {
            if (event.target.className.split(':')[1].toLowerCase() === 'activeitem') {
              if (event.target.innerText.toLowerCase() === 'добавить') {
                event.target.innerText = 'убрать'
                let activeItem = new CustomEvent('activeItem', {
                  detail: {
                    id: event.target.id,
                    object: event.target.className.split(':')[0],
                    status: true
                  }
                })
                document.dispatchEvent(activeItem)
              } else {
                event.target.innerText = 'добавить'
                let activeItem = new CustomEvent('activeItem', {
                  detail: {
                    id: event.target.id,
                    object: event.target.className.split(':')[0],
                    status: false
                  }
                })
                document.dispatchEvent(activeItem)
              }
            }
          } else {
            let updObj = {}
            updObj['id'] = event.target.id
            updObj['component'] = event.target.getAttribute('class')
            object['staticProperty']['upload'] = updObj
            matcher['database']['request']['functions']['getImageById'](object['staticProperty'])
              .then((obj) => {
                obj['upload']['url'] = obj['upload']['file-url'] // костыль, надо убрать
                obj['namespace'] = {}
                obj['namespace']['modal'] = obj['this'].querySelector('.modal')
                obj['this'].querySelector('.modal').style.display = 'block'
                modal['init'](obj).then((obj) => {
                  matcher['external']['func']['crop']['cropUrl'](obj)
                    .then((obj) => {
                      colorLog(`~~~~~~~~~~~<varan-pagination-update>~~~~~~~~~~~`, 'firebrick')

                      let name = {}
                      if (!obj['slot']) {
                        name = obj['parent']
                      } else {
                        if (obj['slot'] === 'edit') {
                          name = obj['parent']
                        } else if (obj['slot'] === 'view') {
                          name = obj['parent']
                        } else {
                          name = obj['slot']
                        }
                      }
                      let upload = obj['upload']
                      obj['upload'] = {}
                      obj['upload'][name] = upload
                      obj['upload']['object'] = name
                      obj['upload']['id'] = upload['id']
                      matcher['database']['request']['functions']['updImage'](obj)
                        .then((obj) => {
                          obj['this'].querySelector('.modal').style.display = 'none'
                          matcher['database']['request']['functions']['getObject'](obj)
                            .then((obj) => {
                              action(obj)
                            })
                          console.log('~~~~pagination~~update~~~~~~~~~~', obj)
                        })
                    })
                })
              })
          }
        }
      }
    })
  }
  if (Number.isNaN(obj['numPages']) === true) {
    obj['pagination'].style.display = 'none'
  } else {
    obj['pagination'].style.display = 'flex'
  }
  // console.assert(false, obj['pagination'])
  if (!obj['page_span']) {

  } else {
    obj['page_span'].innerHTML = obj['page'] + '/' + obj['numPages']
    obj['page_span'].style.visibility = 'visible'
    if (obj['page'] === 1) {
      obj['btn_prev'].style.visibility = 'hidden'
    } else {
      obj['btn_prev'].style.visibility = 'visible'
    }
    if (obj['page'] === obj['numPages']) {
      obj['btn_next'].style.visibility = 'hidden'
    } else {
      obj['btn_next'].style.visibility = 'visible'
    }
  }
}

function init (obj, num) {
  obj['paginationArguments'] = {}
  obj['paginationArguments']['type'] = {}
  obj['paginationArguments']['type']['sliderNews'] = false
  obj['paginationArguments']['type']['sliderText'] = false
  obj['paginationArguments']['type']['blog'] = false
  colorLog('[->]pagination.init', 'firebrick', obj, num)
  for (let key = 0; key < obj['type'].length; key++) {
    switch (obj['type'][key]) {
      case 'slider-news':
        obj['paginationArguments']['type']['sliderNews'] = true
        break
      case 'blog':
        obj['paginationArguments']['type']['blog'] = true
        break
      default:
        break
    }
  }
  if (obj['verify']['sliderText'] === true) {
    obj['paginationArguments']['numPage'] = 1
    obj['paginationArguments']['type']['sliderText'] = true
  }
  // console.assert(false, obj)

  if (!num) {
    let name = {}
    if (!obj['slot']) {
      name = obj['parent']
    } else {
      name = obj['slot']
    }
    if (name === 'varan-slider-news') {
      obj['paginationArguments']['numPage'] = 2
    } else {
      obj['paginationArguments']['numPage'] = 3
    }
  }
  for (let i = 0; i < obj['type'].length; i++) {
    if (obj['type'][i].split('-').length > 1) {
      for (let j = 0; j < obj['type'][i].split('-').length; j++) {
        switch (obj['type'][i].split('-')[j]) {
          case 'blog':
            obj['paginationArguments']['type']['blog'] = true
            obj['paginationArguments']['numPage'] = obj['type'][i].split('-')[1]
            break
          default:
            break
        }
      }
    }
  }
  if (!obj['slider-template']) {
    obj['paginationArguments']['slider'] = false
    obj['paginationArguments']['template'] = obj['this'].querySelector('.section')
  } else {
    obj['paginationArguments']['template'] = obj['slider-template']
    obj['paginationArguments']['slider'] = true
  }
  obj['paginationArguments']['slot'] = obj['slot']
  colorLog('[<-]pagination.init', 'firebrick', obj['paginationArguments'])
  return obj
}

async function action (obj) {
  colorLog('[->]pagination.action', 'SaddleBrown', obj)
  let json = []
  let name = {}
  obj['pagination'] = {}
  if (!obj['slot']) {
    name = obj['parent']
  } else {
    name = obj['slot']
  }
  if (!obj['get']) {
    pagination['objJson'] = 0
  } else {
    if (obj['get'][name] === undefined) {
      while (!obj['get']) {
        console.warn('Ждём get pagination объект')
        obj = await pause(obj)
      }

      switch (name) {
        case 'varan-slider-news':
          for (let key in obj['get'][`${obj['slot']}`]) {
            json.push(obj['get'][name][key]['feed'])
          }
          pagination['objJson'] = json[0]
          break
        default:
          colorLog('[-]стандартное поведение', 'firebrick', name)
          for (let key in obj['get'][name]) {
            json.push(obj['get'][name][key])
          }
          pagination['objJson'] = json
          break
      }
      console.assert(false, 'нет воходных данных')
    } else {
      switch (name) {
        case 'varan-slider-news':
          for (let key in obj['get'][`${obj['slot']}`]) {
            json.push(obj['get'][name][key]['feed'])
          }
          pagination['objJson'] = json[0]
          break
        default:
          colorLog('[-]стандартное поведение', 'firebrick', name)
          for (let key in obj['get'][name]) {
            json.push(obj['get'][name][key])
          }
          pagination['objJson'] = json
          break
      }
      console.log('~~~~~~~~~~~pagination[\'objJson\']~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', pagination['objJson'])
    }
  }
  pagination['current_page'] = 1
  pagination['btn_next'] = ''
  pagination['btn_prev'] = ''
  pagination['page'] = 1
  pagination['numPages'] = 1
  pagination['numSlider'] = 1
  pagination['listing_table'] = obj['paginationArguments']['template']
  pagination['records_per_page'] = 3
  pagination['slider'] = obj['paginationArguments']['slider']
  if (obj.hasOwnProperty('paginationArguments')) {
    switch (obj['paginationArguments']['slot']) {
      // case 'varan-slider-work':
      //   if (pagination['slider'] === true) {
      //     pagination['listing_table'] = obj['paginationArguments']['template'].querySelector('.peppermint')
      //     pagination['listing_table_item'] = obj['paginationArguments']['template'].querySelector('.ql-editor')
      //   }
      //   break
      default:
        colorLog('[->]default', 'SaddleBrown', obj['paginationArguments']['slot'])
        if (pagination['slider'] === true) {
          pagination['listing_table'] = obj['paginationArguments']['template'].querySelector('.peppermint')
          pagination['listing_table_item'] = obj['paginationArguments']['template'].querySelector('.ql-editor')
        }
        break
    }
  } else {
    console.assert(false, 'нет paginationArguments нужна инициализация')
  }
  pagination['type'] = {}
  pagination['type']['sliderNews'] = obj['paginationArguments']['type']['sliderNews']
  pagination['type']['sliderText'] = obj['paginationArguments']['type']['sliderText']
  pagination['type']['blog'] = obj['paginationArguments']['type']['blog']
  pagination['type']['default'] = true
  for (let key in obj['paginationArguments']['type']) {
    if (obj['paginationArguments']['type'][key] === true) {
      pagination['type']['default'] = false
    }
  }
  pagination['records_per_page'] = obj['paginationArguments']['numPage']
  pagination['numSlider'] = obj['paginationArguments']['numSlide']
  pagination['slot'] = obj['paginationArguments']['slot']
  pagination['page_span'] = ''
  pagination['btn_next'] = obj['this'].querySelector('#next')
  pagination['btn_prev'] = obj['this'].querySelector('#prev')
  pagination['page_span'] = obj['this'].querySelector('.page')
  pagination['pagination'] = obj['this'].querySelector('.menu')

  object['staticProperty'] = {}
  obj['pagination'] = pagination
  object['staticProperty'] = obj
  object['staticProperty']['pagination']['func']['listener'](obj)
  object['staticProperty']['pagination']['func']['changePage'](object['staticProperty']['pagination'])
  colorLog('[<-]pagination.action', 'SaddleBrown', obj['pagination']['listing_table'])
  return obj
}
export default {
  init: obj => { return init(obj) },
  action: obj => { return action(obj) }
}
