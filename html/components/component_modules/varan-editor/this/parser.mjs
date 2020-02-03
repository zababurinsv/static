import matcher from '/static/html/components/component_modules/matcher/module.js'
import pagination from '/static/html/components/component_modules/varan-pagination/varan-pagination.js'
import Slider from '/static/html/components/component_modules/varan-slider/varan-slider.js'
import tick from '/static/html/components/component_modules/lacerta-tick/lacerta-tick.js'
function colorLog (message, color, ...args) {
  color = color || 'black'
  switch (color) {
    case 'success':
      color = 'Green'
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
    default:
      color = color
  }
  console.log('%c' + message, 'color:' + color, ...args)
}
if (!Object.keys) {
  Object.keys = function (o) {
    if (o !== Object(o)) { throw new TypeError('Object.keys called on a non-object') }
    var k = []; var p
    for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p)
    return k
  }
}
let parser = {}
parser['this'] = {}
parser['this']['tag'] = []
parser['this']['tag']['in'] = []
parser['this']['tag']['out'] = []
parser['this']['tag'].push('div')
parser['this']['tag'].push('section')
parser['this']['tag'].push('style')
parser['this']['tag'].push('script')
parser['this']['tag'].push('varan-editor')
parser['this']['tag']['in'].push('&lt;div')
parser['this']['tag']['in'].push('&lt;/div')
parser['this']['tag']['in'].push('&lt;style')
parser['this']['tag']['in'].push('&lt;/style')
parser['this']['tag']['in'].push('&lt;section')
parser['this']['tag']['in'].push('/section&gt;')
parser['this']['tag']['in'].push('&lt;article')
parser['this']['tag']['in'].push('/article&gt;')
parser['this']['tag']['in'].push('&lt;time')
parser['this']['tag']['in'].push('/time&gt;')
parser['this']['tag']['in'].push('&lt;/script')
parser['this']['tag']['in'].push('&lt;script')
parser['this']['tag']['out'].push('&lt;p')
parser['this']['tag']['out'].push('&lt;/p')
parser['this']['tag']['out'].push('&lt;style')
parser['this']['tag']['out'].push('&lt;/style')
parser['this']['tag']['out'].push('&lt;section')
parser['this']['tag']['out'].push('/section&gt;')
parser['this']['tag']['out'].push('&lt;article')
parser['this']['tag']['out'].push('/article&gt;')
parser['this']['tag']['out'].push('&lt;time')
parser['this']['tag']['out'].push('/time&gt;')

parser['func'] = {}
parser['func']['parserIn'] = async function (obj, component) {
  if (!obj['tick']) {
    obj['tick'] = tick
  }
  if (!obj['tick']['parserIn']) {
    obj['tick']['parserIn'] = 0
  } else {
    console.assert(true, `приходит второй раз`)
  }
  obj['tick'](obj, 'parserIn', '', -1)
    .then((obj) => {
      console.log(`parserIn ->`, obj)
      console.assert(false, obj)
    })
  obj['tick']['parserIn']++
  for (let key = 0; key < obj['type'].length; key++) {
    switch (obj['type'][key]) {
      case 'text':
        colorLog(`~~~~~~~~~~~~~set (wall).innerHTML)~~~~~~~~~~~~`, 'info', component)
        obj['upload'] = {}
        obj['this'].querySelector('.wall').innerHTML = ''
        obj['this'].querySelector('.wall').innerHTML = component['content']
        matcher['database']['request']['functions']['getObject'](obj)
          .then((obj) => {
            colorLog(`~~~~~~~~~~~~~set (wall).innerHTML)~~~~~~~~~~~~`, 'info', obj)
            if (!obj['get']) {
              obj['upload'] = component
              obj['upload']['content'] = component['content']
              matcher['database']['request']['functions']['setImages'](obj)
                .then((obj) => { })
            } else {
              colorLog(`~~~~~~~~~~~~~set (wall).innerHTML)~~~~~~get~~~~~~`, 'info', obj)
              let name = {}
              if (!obj['slot']) {
                name = obj['parent']
              } else {
                name = obj['slot']
              }
              for (let key = 0; key < obj['get_n'].length; key++) {
                obj['upload'] = obj['get_n'][key][name]
                obj['upload']['content'] = component['content']
                obj['upload']['edit-delta'] = component['edit-delta']
                matcher['database']['request']['functions']['updImage'](obj)
                  .then((obj) => {

                  })
              }
            }
          })

        break
      case 'slider-one-text':
        obj['upload'] = null
        matcher['database']['request']['functions']['getObject'](obj)
          .then((obj) => {
            if (!obj['get']) {
              obj['upload'] = component
              obj['upload']['content'] = component['edit-content']
              matcher['database']['request']['functions']['setImages'](obj)
                .then((obj) => {
                  if (obj['this'].querySelector('.peppermint-slides') === null) {
                    obj['this'].querySelector('.ql-view').innerHTML = component['content']
                  } else {
                    obj['this'].querySelector('.peppermint-slides').children[obj['slider']['getCurrentPos']()].innerHTML = component['content']
                  }
                })
            } else {
              // let key = Object.keys(obj['get'][`${obj['slot']}`])[obj['slider']['getCurrentPos']()]
              // component['id'] = key
              let name = {}
              if (!obj['slot']) {
                name = obj['parent']
              } else {
                name = obj['slot']
              }
              let position = obj['slider']['getCurrentPos']()
              let sort = []
              for (let i = 0; i < obj['get_n'].length; i++) {
                sort.push(obj['get_n'][i][name]['view-slider-pos'])
              }
              sort.sort(function (a, b) {
                return a - b
              })
              for (let i = 0; i < obj['get_n'].length; i++) {
                if (obj['get_n'][i][name]['view-slider-pos'] === sort[position]) {
                  obj['get_n'][i][name]['content'] = component['content']
                  obj['get_n'][i][name]['edit-delta'] = component['edit-delta']
                  obj['upload'] = obj['get_n'][i]
                }
              }
              obj['get'] = null
              obj['get_n'] = null
              matcher['database']['request']['functions']['updImage'](obj)
                .then((obj) => {
                  obj['upload'] = null
                  obj['update'] = null
                  if (obj['this'].querySelector('.peppermint-slides') === null) {
                    colorLog(`~~~~~~['functions']['updImage']~~~~~  ${component['content']}`, 'info', component['content'])
                    obj['this'].querySelector('.ql-view').innerHTML = component['content']
                  } else {
                    colorLog(`~~~~~~['functions']['updImage']~~~slider~~  ${component['content']}`, 'info', component['content'])
                    obj['this'].querySelector('.peppermint-slides').children[obj['slider']['getCurrentPos']()].innerHTML = component['content']
                  }
                })
            }
          })
        break
      default:
        break
    }
  }
  // console.log('~~~~~~~~~parserIn~~~~~~~~~~~~~~', component)
  // let doc = document.createElement('div')
  // console.log('~~~~~~~~~parserIn~~~~~~~~~~~~~~', component['edit-content'])
  // console.log('~~~~~~~~~parserIn~~~~~~~~~~~~~~', obj['this'].querySelector('.wall'))
  // doc.innerHTML = component['edit-content']
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
  // console.log('@@@@@1@@@@', tmpScript, verify, verifyScript)
  // } else if (verifyScript === 47) {
  //   tmpScript = tmpScript + doc.children[key].innerText
  //   console.log('@@@@@3@@@@', tmpScript, verify, verifyScript)
  // } else {
  //   templete = templete + doc.children[key].innerText
  // }
  // } else {
  //   if (verifyStyle === true) {
  //     templete = templete + doc.children[key].innerText
  //   } else if (verifyScript === true) {
  //     tmpScript = tmpScript + doc.children[key].innerText
  //     console.log('@@@@@2@@@@', tmpScript, verify, verifyScript)
  //   } else {
  //     templete = templete + doc.children[key].outerHTML
  //   }
  // }
  // }
  // }
  // console.log(tmpScript)
  // component[`view`] = templete
  // contentView.innerHTML = templete
  // contentView.innerHTML = contentView.innerHTML + tmpScript
  // asset['default']['asset']['$children'][0]['$children'][0]['update'](component)
}
parser['func']['parserOut'] = async function (component) {
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
  //         console.log('@@@@@1@@@@', tmpScript, verify, verifyScript)
  //       } else if (verifyScript === 47) {
  //         tmpScript = tmpScript + doc.children[key].innerText
  //         console.log('@@@@@3@@@@', tmpScript, verify, verifyScript)
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
  // component[`view`] = templete
  // contentView.innerHTML = templete
  // contentView.innerHTML = contentView.innerHTML + tmpScript
  // asset['default']['asset']['$children'][0]['$children'][0]['update'](component)
}
let init = async function (obj) {
  // console.log('~~~~~~parser~~~~~~~~', parser)

  return parser
}

export default new Promise(async resolve => {
  resolve({
    init: function (obj) {
      return init(obj)
    }
  })
})
