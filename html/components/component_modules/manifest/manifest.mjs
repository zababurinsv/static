export default async (obj, func, ...args)=>{
    bundle['default'](obj,null, async function (error, config) {
        return new Promise(async function (resolve, reject) {
            let out = (obj) => {
                // //console.log('~~~ out router ~~~')
                resolve(obj)
            }
            let err = (error) => {
                console.log('~~~ err router ~~~', error)
                reject(error)
            }
            switch (func) {
                case 'request':
                    (async (obj, props,state, server) => {
                        try {





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
