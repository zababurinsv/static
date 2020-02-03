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
let lib = {}
lib['info'] = function (obj) {
  colorLog('<create-object-in>lib[`info`]</create-object-in>', 'burlywood', obj)
  let section = document.createElement('section')
  section.className = 'ql-editor info'
  let figcaption = document.createElement('figcaption')
  figcaption.innerText = 'Lorem ipsum dolor sit amet.'
  let figure = document.createElement('figure')
  let a = document.createElement('a')
  a.href = './static/images/us/1.svg'
  let img = document.createElement('img')
  img.setAttribute('alt', 'preview')
  img.src = obj['object']['url']
  img.alt = 'info'
  a.appendChild(img)
  figure.appendChild(figcaption)
  figure.appendChild(a)
  section.appendChild(figure)
  colorLog('<create-object-out>lib[`info`]</create-object-out>', 'burlywood', section)
  return section
}
export default {
  info: (obj) => { return lib['info'](obj) }
}
