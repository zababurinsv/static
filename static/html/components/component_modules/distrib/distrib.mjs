import utils from '/static/html/components/component_modules/utils/utils.mjs'
export default (obj, func, ...args) => {
  return new Promise(function (resolve, reject) {
    bundle['default']('distrib', '', async function (error, bundle) {
      // console.assert(false, obj['distrib']['htmlToImage'])
      let out = (obj) => {
        console.log('~~~ out distrib ~~~')
        resolve(obj)
      }
      let err = (error) => {
        console.log('~~~ err distrib ~~~', error)
        reject(error)
      }
      switch (func) {
        case 'htmlToImage':
          (async (obj, props, data) => {
            try {
              console.log(`${obj['input']}[(utils)${obj[props]}]`)
              bundle['distrib']['htmlToImage'].toJpeg(data, { quality: 0.95 })
                .then((dataUrl) => {
                  utils({
                    input: 'distrib',
                    distrib: 'download',
                    out: 'end'
                  }, `${obj[props]}`, 'out', dataUrl)
                    .then((obj) => {
                      out(obj)
                    })
                })
            } catch (e) { err(e) }
          })(obj, args[0], args[1], args[2], args[3])
          break
        case 'certText':
          (async (obj, props, render) => {
            try {
              out(obj)
            } catch (e) { err(e) }
          })(obj, args[0], args[1], args[2])
          break
        case 'createDocument':
          (async (obj) => {
            try {
              out(obj)
            } catch (e) { err(e) }
          })(obj, args[0], args[1], args[2])
          break
        default:
          err(`новая функция ${func}`)
          break
      }
    })
  })
}
