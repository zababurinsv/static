export default (obj, func, ...args) => {
  return new Promise(async function (resolve, reject) {
    let out = (obj) => {
      console.log('@@@@@@@@@@@@@@@@ out  @@@@@@@@@@@@@@@@')
      resolve(obj)
    }
    let err = (error) => {
      console.log('@@@@@@@@@@@@@@@@ err  @@@@@@@@@@@@@@@@', error)
      reject(error)
    }
    switch (func) {
      case 'uploadEvent':
        (async (obj, props, target) => {
          try {
            target.addEventListener('uploadEvent', function uploadEvent (event) {
              console.assert(false)
            })
            console.log(obj['input'])
            out(obj)
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2], args[3])
        break
      case 'focusBlur':
        (async (obj, props, data) => {
          try {

            obj[props].addEventListener('focus', function (e) {

              console.log('~~~~ focus ~~~~', e)

            }, true)
            obj[props].addEventListener('blur', function (e) {

              console.log('~~~~ blur ~~~~', e)

            }, true)
            out({listener:true})
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2], args[3])
        break
      default:
        err(`новая функция ${func}`)
        break
    }
  })
}
