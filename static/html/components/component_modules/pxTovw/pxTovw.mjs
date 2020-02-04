export default async (obj, func, ...args) =>{
    return new Promise(async function (resolve, reject) {
        let out = (obj) => {
            console.log('~~~ out pxToVw ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err pxToVw ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'pixelToVH':
                (async (obj, value) => {
                        out(((100 * value) / window.innerHeight))
                })(obj, args[0], args[1], args[2])
                break
            case 'pixelToVW':
                (async (obj, value) => {

                        out(((100 * value) / window.innerWidth))

                })(obj, args[0], args[1], args[2])
                break
            case 'vhToPixel':
                (async (obj, value) => {
                    out(((window.innerHeight * value) / 100))
                })(obj, args[0], args[1], args[2])
                break
            case 'vwToPixel':
                (async (obj, value) => {
                        out(((window.innerWidth * value) / 100))
                })(obj, args[0], args[1], args[2])
                break
            case 'cleanPx':
                (async (obj, value) => {

                        out( value.substr(0, value.length - 2))

                })(obj, args[0], args[1], args[2])
                break
            default:
                err(`новая функция ${func}`)
                break
        }
    })

}
