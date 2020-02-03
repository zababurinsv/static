import system from '/static/html/components/component_modules/system/system.mjs'

let object = {}
object['this'] = {}
object['func'] = {}

object['func']['listener'] = function (obj) {
  console.log('~~~~~~~~~~~~~~modal~~~~~~~~~~~~~~~~~', obj['this'])
  let modal = obj['this'].querySelector('.modal')
  let close = obj['this'].querySelector('.close')
  close.onclick = function () {
    modal.style.display = 'none'
  }
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
  }
}
let init = async function (obj) {
  console.log(`a{['system'])t-${system}`, system['init'](obj))

  object['this'] = obj['this']
  let modal = object['this'].querySelector('#myModal')

  let btn = object['this'].querySelector('#myBtn')

  let span = object['this'].querySelector('.close')

  btn.onclick = function () {
    modal.style.display = 'block'
  }

  span.onclick = function () {
    modal.style.display = 'none'
  }

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
    }
  }

  return object
}

export default new Promise(async resolve => {
  resolve({
    init: function (obj) {
      return init(obj)
    },
    object
  })
})
