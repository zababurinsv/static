let object = {}

let init = async function (obj) {
  console.log('~~~~~~modal~~init~~~~~~~~~~', obj['this'].querySelector('.modal'))
  console.log('~~~~~~modal~~init~~~~~~~~~~', obj['this'].querySelector('.close'))
  console.log('~~~~~~modal~~init~~~~~~~~~~', obj)
  object['this'] = obj['this']
  // obj['this'].shadowRoot.querySelector('.circle').style.zIndex = 0

  // let mod = obj['this'].shadowRoot.querySelector('.circle')
  let modal = obj['this'].querySelector('.modal')
  let span = obj['this'].querySelector('.close')

  span.onclick = function () {
    modal.style.display = 'none'
    // mod.style.zIndex = 2
  }

  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none'
      // mod.style.zIndex = 2
    }
  }
  obj['modal'] = object
  return obj
}

export default {
  init: obj => { return init(obj) }
}
