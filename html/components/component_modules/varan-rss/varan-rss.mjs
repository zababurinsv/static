import template from '/static/html/components/component_modules/template/template.mjs'
export default async (obj, func, ...args)=>{
  bundle['default'](obj,null, async function (error, config) {
    return new Promise(async function (resolve, reject) {
      let out = (obj) => {
        //console.log('~~~ out router ~~~')
        resolve(obj)
      }
      let err = (error) => {
        console.log('~~~ err router ~~~', error)
        reject(error)
      }
      switch (func) {
        case 'test':
          (async (obj, props,state, server) => {
            try {
              console.log(`${obj['input']}[(request)${obj[props]}]`)




            } catch (e) { err(e) }
          })(obj, args[0], args[1], args[2], args[3])
          break
        default:
          err(`новая функция ${func}`)
          break
      }
    })
  })
}
