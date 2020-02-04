import authtorize from '/static/html/components/component_modules/fetch/fetch.mjs'
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
            case 'auth':
                (async (obj, props,data) => {
                    try {
                        console.log(`app(${func}[(${obj['input']})${obj[props]}]property)`)
                        // console.assert(false,window,'dddddddddddddddd')
                        switch (obj[props]) {
                            case 'this':
                                (async (obj, props,data) => {
                                    try {
                                        if(window['location']['pathname'] === '/admin' ||window['location']['pathname'] === '/admin/' ){
                                            if (window.WavesKeeper) {
                                                window.WavesKeeper.initialPromise
                                                    .then((keeperApi) => {
                                                        keeperApi.publicState().then( async (state) => {



                                                          let verify = await authtorize({
                                                                input:'auth',
                                                                type:'auth',
                                                                data:state
                                                            },'get','type')
                                                        //

                                                        }).catch(error => {
                                                            window.WavesKeeper.auth({ data: "Auth on my  site" })
                                                                .then( (data) => {
                                                                    fetch('https://waves.zababurinsv.now.sh/verify', {
                                                                        method: `POST`,
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                            'mode': 'no-cors'
                                                                        },
                                                                        body: JSON.stringify({
                                                                            auth:data,
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
                                                                                console.log("Waves Keeper data:");
                                                                                console.log(json);
                                                                                out(json)
                                                                            }else{
                                                                                document['body'].innerHTML = ''
                                                                                document['body'].insertAdjacentHTML('afterbegin', eval(`${json}`));
                                                                                out(false)
                                                                            }
                                                                        })
                                                                        .catch(function (error) {
                                                                            console.assert(false, 'auth', error)
                                                                        })
                                                                }).catch(error => {
                                                                console.log('~~~~~~~~~~~~~~~~~~~~')
                                                                console.error( error );
                                                            })
                                                        })
                                                    })
                                            } else {
                                                alert("To Auth WavesKeeper should be installed.")
                                            }

                                        }else{
                                            out(true)
                                        }


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
