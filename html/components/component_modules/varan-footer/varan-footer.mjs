export default async (obj, func, ...args) =>{
  return new Promise( function (resolve, reject) {
    let out = (obj) => {
      resolve(obj)}
    let err = (error) => {
      console.log('~~~ err ssr ~~~>', error)
      reject(error)}
    switch (func) {
      case 'getObject':
        (async (obj, props, url, self) => {
          try {
            upload['getObject'](self)
            out('test')
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2], args[3])
        break
      case 'router':
        (async (obj, props, url) => {

          out('test')
        })(obj, args[0], args[1], args[2], args[3])
        break
      case 'pageSsr':
        (async (obj, props, url, host) => {
          try {

            out('test')
          } catch (e) { err(e) }
        })(obj, args[0], args[1], args[2], args[3])
        break
      default:
        err(`новая функция ${func}`)
        break
    }
  })
}


