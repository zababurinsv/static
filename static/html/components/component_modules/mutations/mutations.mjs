// import varanPictures from '/static/html/components/component_modules/varan-pictures/varan-pictures.mjs'

export default (obj, node) => {
  return new Promise(async function (resolve, reject) {
    let config = { attributes: true, childList: true, characterData: true }
    let target = node
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        switch (mutation.type) {
          case 'childList':
            if (mutation.target.innerText.indexOf('@import') !== -1) {} else {
              if (mutation.target.innerText === ''){} else {
                // varanPictures(obj, 'action', mutation.target.innerText)
              }
            }
            break
          default:
            break
        }
      })
    })
    observer.observe(target, config)
    resolve(obj)
  })
}
