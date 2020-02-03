export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
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
                (async (obj, props,data) => {
                    try {
                        console.log(`${func}[(${obj['input']})${obj[props]}]`)

                        switch (obj[props]) {
                            case 'test':
                                (async (obj, props,data) => {
                                    try {


                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'culture':

                                (async (obj, props,data) => {
                                    try {


                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])

                                break
                            default:
                                err(`новая функция ${func}`)
                                break
                        }

                        out(obj)
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            case 'culture':

                (async (obj, props,data) => {
                    try {
                        console.log(`${func}[(${obj['input']})${obj[props]}]`)
                        switch (obj[props]) {
                            case 'test':
                                (async (obj, props,data) => {
                                    try {


                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            case 'culture':

                                (async (obj, props,data) => {
                                    try {


                                        out(obj)
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])

                                break
                            default:
                                err(`новая функция ${func}`)
                                break
                        }
                        out(obj)
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])

                break
            default:
                err(`новая функция ${func}`)
                break
        }
    })
}
