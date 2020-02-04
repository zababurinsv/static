import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
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
                        switch (obj[props]) {
                            case 'login':
                                (async (obj, props,data) => {
                                    try {

                                        if (WavesKeeper) {
                                            WavesKeeper.initialPromise
                                                .then((keeperApi) => {
                                                    keeperApi.publicState().then(async (state) => {
                                                     // let auth =  await matcher['mongo']({
                                                     //        input:'waves',
                                                     //        type:'auth',
                                                     //        data:state['account']
                                                     //    },'create','type')
                                                        let auth =  await matcher['mongo']({
                                                            input:'waves',
                                                            type:'auth',
                                                            data:state['account']
                                                        },'set','type')

                                                        if(auth['mongo'] === true){
                                                            console.log("Waves Keeper data:");
                                                            console.log(state);
                                                            out(auth )
                                                        }else{
                                                            out(auth )
                                                        }

                                                    }).catch(error => {
                                                        console.error(error);
                                                        WavesKeeper.auth( obj['data'] )
                                                            .then(async (data) => {
                                                                let auth =  await matcher['mongo']({
                                                                    input:'waves',
                                                                    type:'auth',
                                                                    data:state['account']
                                                                },'set','type')

                                                                if(auth['mongo'] === true){
                                                                    out(auth['mongo'] )

                                                                }else{
                                                                    out(auth['mongo'] )
                                                                }
                                                            }).catch(error => {
                                                            console.error( error );
                                                        })
                                                    })
                                                })
                                        } else {
                                            alert("To Auth WavesKeeper should be installed.")
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
