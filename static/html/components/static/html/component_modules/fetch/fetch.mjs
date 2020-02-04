export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
        let out = (obj) => {
            console.log('~~~ out  ~~~')
            resolve(obj)
        }
        let err = (error) => {
            console.log('~~~ err  ~~~', error)
            reject(error)
        }
        switch (func) {
            case 'get':
                (async (obj, props,data) => {
                    try {
                        console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        switch (obj[props]) {
                            case 'auth':
                                (async (obj, props,data) => {
                                    try {
                                        console.assert(false, obj)
                                        fetch('https://waves.zababurinsv.now.sh/verify', {
                                            method: `POST`,
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'mode': 'no-cors'
                                            },
                                            body: JSON.stringify({
                                                auth:obj,
                                                id:'waves',
                                                object:'auth'
                                            })
                                        }).then(function (response) {
                                            if (!response.ok) {
                                                throw new Error('HTTP error, status = ' + response.status)
                                            } else {
                                                return response.json()
                                            }
                                        })
                                            .then(function (json) {
                                                if(json === true){
                                                    // console.log("Waves Keeper data:");
                                                    // console.log(json);
                                                    out(json)
                                                }else{
                                                    document['body'].innerHTML = ''
                                                    document['body'].insertAdjacentHTML('afterbegin', `${json}`);
                                                    out(false)
                                                }
                                            })
                                            .catch(function (error) {
                                                console.assert(false, 'auth', error)
                                            })
                                    } catch (e) { err(e) }
                                })(obj, args[0], args[1], args[2], args[3])
                                break
                            default:
                                err(`new type [(${func})${obj[props]}]`)
                                break
                        }
                    } catch (e) { err(e) }
                })(obj, args[0], args[1], args[2], args[3])
                break
            default:
                err(`new function ${func}`)
                break
        }
    })
}
