import task from '/static/html/components/component_modules/heap/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'

let axios = Axios['default']
let object = {}
object.staticProperty = {}
object.staticProperty.class = undefined
object['fee'] = 0.003
export default (()=>{
        let Class = class Dex {
            constructor() {
                this.fix = this.fix.bind(this)
                this.buy = this.buy.bind(this)
                this.sell = this.sell.bind(this)
                this.denormalize = this.denormalize.bind(this)
                this.end = this.end.bind(this)
                this.wavesUsd = this.wavesUsd.bind(this)
                this.eurUsd = this.eurUsd.bind(this)
                this.wavesEuro = this.wavesEuro.bind(this)
                document.addEventListener('typeScript-end-dex', this.end)
            }
            wavesUsd(obj, self) {
                return new Promise( async (resolve, reject) => {
                    try {
                        let url = `${config['matcher'][`${obj.net}`]}/matcher/orderbook/${obj['pair']['amountAsset']}/${obj['pair']['priceAsset']}?depth=10`
                        let json = {}
                        let response = await axios.get(url,{
                            method: `GET`,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                      resolve( {
                          _scriptDir: import.meta.url,
                          status: '',
                          success: true,
                          message: response.data
                      })
                    } catch (e) {
                        resolve({
                            _scriptDir: import.meta.url,
                            status: '',
                            success: false,
                            message: e
                        })
                    }
                })
            }
            eurUsd(obj, self) {
                return new Promise( async (resolve, reject) => {
                    try {
                        let url = `${config['matcher'][`${obj.net}`]}/matcher/orderbook/${obj['pair']['amountAsset']}/${obj['pair']['priceAsset']}?depth=10`
                        let json = {}
                        let response = await axios.get(url,{
                            method: `GET`,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        resolve( {
                            _scriptDir: import.meta.url,
                            status: '',
                            success: true,
                            message: response.data
                        })
                    } catch (e) {
                        resolve({
                            _scriptDir: import.meta.url,
                            status: false,
                            success: false,
                            message: e
                        })
                    }
                })
            }
            wavesEuro(obj, self) {
                return new Promise( async (resolve, reject) => {
                    try {
                        let url = `${config['matcher'][`${obj.net}`]}/matcher/orderbook/${obj['pair']['amountAsset']}/${obj['pair']['priceAsset']}?depth=10`
                        let json = {}
                        let response = await axios.get(url,{
                            method: `GET`,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        resolve( {
                            _scriptDir: import.meta.url,
                            status: '',
                            success: true,
                            message: response.data
                        })
                    } catch (e) {
                        resolve({
                            _scriptDir: import.meta.url,
                            status: '',
                            success: false,
                            message: e
                        })
                    }
                })
            }
            denormalize(price, priceAssetDecimals, amountAssetDecimals){
                let wvsPrice = 10 ** (priceAssetDecimals - amountAssetDecimals + 8)
                return price/wvsPrice
            }
            buy(pair,Amount, obj,name) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let outAmount = undefined
                    let amount = Amount
                    switch (name) {
                        case 'wavesEuro':
                            while(verify){
                                if(count >= 10){
                                    verify = false
                                    obj['buy(wavesEuro)'] = undefined
                                }else{
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['asks'][count] === undefined){
                                        obj['buy(wavesEuro)'] = undefined
                                        verify = false

                                    }else{
                                        if(pair['asks'][count] !== undefined){
                                            askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['priceAsset'] }`])
                                        bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        outAmount = amount/askPrice - object['fee']
                                        // console.log('result1 --->', amount*askPrice -object['fee'], '----->', count)
                                        // console.log('result2 --->', amount*bidPrice -object['fee'], '----->', count)
                                        // console.log('bidAmount --->', bidAmount,'askAmount --->',askAmount, 'count--->',count)
                                        // console.log('----->', askAmount, outAmount)
                                        if((bidAmount - amount) <= 0){
                                            // console.warn('невозможно купить wavesEuro','askAmount:',askAmount,'outAmount:',outAmount, 'count:', count )
                                            count++
                                        } else {
                                            // if(obj['eue'] === undefined) {
                                            //     const params = {
                                            //         amount: 10000000,
                                            //         price:  516000,
                                            //         amountAsset: 'WAVES',
                                            //         priceAsset: '3KFXBGGLCjA5Z2DuW4Dq9fDDrHjJJP1ZEkaoajSzuKsC',
                                            //         matcherPublicKey: "8QUAqtTckM5B8gvcuP7mMswat9SjKUuafJMusEoSn1Gy",
                                            //         orderType: 'sell'
                                            //     }
                                            //     obj['system'] = {
                                            //         items:{
                                            //             id:'avy',
                                            //             eue:{
                                            //                 property:{ },
                                            //                 substrate: [ ],
                                            //                 relation:'',
                                            //             }
                                            //         }
                                            //     }
                                            // let order = await task.set(true,'W','8',params,'/matcher/get/order')
                                            // obj['eue'] = {}
                                            // obj['eue']['buy(wavesEuro)'] = {}
                                            // obj['eue']['buy(wavesEuro)']['amount'] = amount
                                            // obj['eue']['buy(wavesEuro)']['price'] = bidPrice
                                            // obj['eue']['buy(wavesEuro)']['amount_reverse']
                                            // obj['system']['items']['eue']['substrate'].push(order)
                                            // }
                                            obj['buy(wavesEuro)'] = amount*bidPrice -object['fee']
                                            obj['buy(wavesEuro)'] = this.fix(obj['buy(wavesEuro)'])
                                            if(obj['wew'] !== undefined) {
                                                obj['wew']['buy(wavesEuro)'] = {}
                                                obj['wew']['buy(wavesEuro)']['amount'] = amount
                                                obj['wew']['buy(wavesEuro)']['price'] = bidPrice
                                                obj['wew']['buy(wavesEuro)']['amount_reverse'] = obj['buy(wavesEuro)']
                                            }
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case 'wavesUsd':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['buy(wavesUsd)'] = undefined
                                } else {
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}

                                    if(pair['asks'][count] === undefined) {
                                        obj['buy(wavesUsd)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['bids'][count] !== undefined) {
                                            bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                       // console.assert(false, amount, askPrice)
                                        outAmount = amount/askPrice
                                        // console.log('result1 --->', amount/askPrice -object['fee'], '----->', count)
                                        // console.log('result2 --->', amount/bidPrice -object['fee'], '----->', count)
                                        // console.log('askAmount --->', askAmount,'-','bidAmount --->',bidAmount, 'count--->',count)
                                        if((askAmount - outAmount) <= 0) {
                                            // console.warn('невозможно купить wavesUsd','askAmount:',askAmount,'-', 'outAmount:', outAmount, 'count-->', count)
                                            count++
                                        } else {
                                            obj['buy(wavesUsd)'] = amount/askPrice - object['fee']
                                            obj['buy(wavesUsd)'] = this.fix(obj['buy(wavesUsd)'])
                                            if(obj['ueu'] === undefined) {
                                                obj['ueu'] = {}
                                                obj['ueu']['buy(wavesUsd)'] = {}
                                                obj['ueu']['buy(wavesUsd)']['amount'] = amount
                                                obj['ueu']['buy(wavesUsd)']['price'] = askPrice
                                                obj['ueu']['buy(wavesUsd)']['amount_reverse'] = obj['buy(wavesUsd)']
                                            }
                                            if(obj['wuw'] !== undefined) {
                                                obj['wuw']['buy(wavesUsd)'] = {}
                                                obj['wuw']['buy(wavesUsd)']['amount'] = amount
                                                obj['wuw']['buy(wavesUsd)']['price'] = bidPrice
                                                obj['wuw']['buy(wavesUsd)']['amount_reverse'] = obj['buy(wavesUsd)']
                                            }
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case 'usdWaves':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['buy(usdWaves)'] = undefined
                                } else {
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['bids'][count] === undefined) {
                                        obj['buy(usdWaves)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['asks'][count] !== undefined) {
                                            askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }

                                        bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount*bidPrice
                                        // console.log('result1 --->', amount*askPrice, '----->', count)
                                        // console.log('result2 --->', amount*bidPrice, '----->', count)
                                        // console.log('bidAmount --->', bidAmount,'askAmount --->',askAmount, 'count--->',count)

                                        if((bidAmount - outAmount) <= 0) {
                                            // console.warn('невозможно купить')
                                            count++
                                        } else {
                                            obj['wew'] = {}
                                            obj['wew']['buy(usdWaves)'] = {}
                                            obj['wew']['buy(usdWaves)']['amount'] = amount
                                            obj['wew']['buy(usdWaves)']['price'] = bidPrice
                                            obj['buy(usdWaves)'] =(amount - object['fee'])*bidPrice
                                            obj['buy(usdWaves)'] = this.fix(obj['buy(usdWaves)'])
                                            obj['wew']['buy(usdWaves)']['amount_reverse'] = obj['buy(usdWaves)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case 'usdEuro':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['buy(usdEuro)'] = undefined
                                } else {
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['bids'][count] === undefined) {
                                        obj['buy(usdEuro)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['asks'][count] !== undefined){
                                            askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['priceAsset'] }`])
                                        bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount*bidPrice
                                        // console.log('result1 --->', amount*askPrice, '----->', count)
                                        // console.log('result2 --->', amount*bidPrice, '----->', count)
                                        // console.log('bidPrice --->', bidPrice,'askPrice --->',askPrice, 'count--->',count)

                                        if((bidAmount - amount) <= 0) {
                                            // console.warn('невозможно купить')
                                            count++
                                        } else {
                                            obj['ueu']['buy(usdEuro)'] = {}
                                            obj['ueu']['buy(usdEuro)']['amount'] = amount
                                            obj['ueu']['buy(usdEuro)']['price'] = bidPrice
                                            // console.assert(false, {
                                            //     amount: amount,
                                            //     bidPrice: bidPrice,
                                            //     fee: obj['fee']['usd']
                                            // })
                                            obj['buy(usdEuro)'] = amount*bidPrice - obj['fee']['usd']
                                            obj['buy(usdEuro)'] = this.fix(obj['buy(usdEuro)'])
                                            obj['ueu']['buy(usdEuro)']['amount_reverse'] = obj['buy(usdEuro)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case 'euroUsd':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['buy(euroUsd)'] = undefined
                                }else {
                                    let bidAmount = undefined
                                    let bidPrice = undefined
                                    let askAmount = undefined
                                    let askPrice = undefined
                                    if(pair['asks'][count] === undefined) {
                                        obj['buy(euroUsd)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['bids'][count] !== undefined){
                                            bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['priceAsset'] }`])
                                            bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount/askPrice
                                        // console.log('result1 --->', amount/askPrice, '----->', count)
                                        // console.log('result2 --->', amount/bidPrice, '----->', count)
                                        // console.log('askAmount --->', askAmount,'outAmount --->',outAmount, 'count--->',count)

                                        // console.assert(false,  pair['asks'][count], askAmount)
                                        if((askAmount - outAmount) <= 0) {
                                            // console.warn('невозможно купить euroUsd', 'askAmount:', askAmount,'outAmount:',outAmount )
                                            count++
                                        } else {
                                            obj['eue']['buy(euroUsd)'] = {}
                                            obj['eue']['buy(euroUsd)']['amount'] = amount
                                            obj['eue']['buy(euroUsd)']['price'] = bidPrice
                                            obj['buy(euroUsd)'] = amount/askPrice - obj['fee']['euro']
                                            obj['buy(euroUsd)'] = this.fix(obj['buy(euroUsd)'])
                                            obj['eue']['buy(euroUsd)']['amount_reverse'] = obj['buy(euroUsd)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case 'euroWaves':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['buy(euroWaves)'] = undefined
                                } else {
                                    let bidAmount = undefined
                                    let bidPrice = undefined
                                    let askAmount = undefined
                                    let askPrice = undefined
                                    if(pair['asks'][count] === undefined) {
                                        obj['buy(euroWaves)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['bids'][count] !== undefined) {
                                            bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['priceAsset'] }`])
                                            bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount/askPrice
                                        // console.log('result1 --->', (amount)/askPrice, '----->', count)
                                        // console.log('result2 --->', (amount)/bidPrice, '----->', count)
                                        // console.log('askAmount --->', askAmount,'outAmount --->',outAmount, 'count--->',count)
                                        // console.assert(false,  pair['asks'][count], askAmount)
                                        if((askAmount - outAmount) <= 0) {
                                            // console.warn('невозможно купить euroWaves', 'askAmount:', askAmount,'outAmount:',outAmount )
                                            count++
                                        } else {
                                            obj['wuw'] = { }
                                            obj['wuw']['buy(euroWaves)'] = { }
                                            obj['wuw']['buy(euroWaves)']['amount'] = amount
                                            obj['wuw']['buy(euroWaves)']['price'] = bidPrice
                                            obj['buy(euroWaves)'] = (amount-0.003)/askPrice
                                            obj['buy(euroWaves)'] = this.fix(obj['buy(euroWaves)'])
                                            obj['wuw']['buy(euroWaves)']['amount_reverse'] = obj['buy(euroWaves)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        default:
                            // console.warn('имя не обрабатывается --->', name)
                            break
                    }
                    resolve(obj)
                })
            }
            sell(pair,amount, obj,name) {
                return new Promise( (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let outAmount = undefined
                    switch (name) {
                        case 'wavesUsd':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['sell(wavesUsd)'] = undefined
                                } else {
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['bids'][count] === undefined) {
                                        verify = false
                                        obj['sell(wavesUsd)'] = undefined
                                    } else {
                                        if(pair['asks'][count] !== undefined) {
                                            askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['priceAsset'] }`])
                                        bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount*bidPrice
                                        // console.log('result1 --->',amount*bidPrice, '----->', count)
                                        // console.log('result2 --->',amount*askPrice, '----->', count)
                                        // console.log('bidAmount --->', bidAmount,'amount --->',amount, 'count--->',count)

                                        if((bidAmount - amount) <= 0) {
                                            // console.warn('невозможно купить', 'bidAmount:',bidAmount,'- amount:',amount,'count:',count)
                                            count++
                                        } else {
                                            if(obj['eue'] === undefined) {
                                                obj['eue'] = {}
                                            }
                                            obj['eue']['sell(wavesUsd)'] = {}
                                            obj['eue']['sell(wavesUsd)']['amount'] = amount
                                            obj['eue']['sell(wavesUsd)']['price'] = bidPrice
                                            obj['sell(wavesUsd)'] = (amount- object['fee'])*bidPrice
                                            obj['sell(wavesUsd)'] = this.fix(obj['sell(wavesUsd)'])
                                            obj['eue']['sell(wavesUsd)']['amount_reverse'] = obj['sell(wavesUsd)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case 'usdWaves':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['sell(wavesUsd)'] = undefined
                                } else {
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['asks'][count] === undefined) {
                                        obj['sell(usdWaves)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['bids'][count] !== undefined) {
                                            bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['priceAsset'] }`])
                                            bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount/askPrice

                                        // console.log('result1 --->', amount/askPrice - object['fee'], '----->', count)
                                        // console.log('result2 --->', amount/bidPrice - object['fee'], '----->', count)
                                        // console.log('bidPrice --->', bidPrice,'askPrice --->',askPrice, 'count--->',count)
                                        // console.log(amount/bidPrice -object['fee'], 'bidAmount --->', bidAmount)
                                        // console.log(amount/askPrice -object['fee'])
                                        // console.log('$$$$$$$$$$$$', askAmount, outAmount)
                                        if((askAmount - outAmount) <= 0) {
                                            // console.warn('невозможно купить')
                                            count++
                                        } else {
                                            obj['sell(usdWaves)'] = amount/askPrice - object['fee']
                                            obj['sell(usdWaves)'] = this.fix(obj['sell(usdWaves)'])
                                            verify = false
                                        }

                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case'wavesEuro':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['sell(wavesEuro)'] = undefined
                                } else {
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['bids'][count] === undefined) {
                                        obj['sell(wavesEuro)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['asks'][count] !== undefined){
                                            askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['priceAsset'] }`])
                                        bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount/bidPrice
                                        // console.log('result1 --->', amount/askPrice, '----->', count)
                                        // console.log('result2 --->', amount/bidPrice, '----->', count)
                                        // console.log('askAmount --->', askAmount,'-','outAmount --->',outAmount,'bidAmount--->',bidAmount, 'count--->', count)
                                        // console.log('bidAmount --->', bidAmount,'askAmount --->',askAmount, 'count--->',count)
                                        if((bidAmount - outAmount) <= 0) {
                                            console.warn('wavesEuro невозможно купить','bidAmount:',bidAmount,'-', 'outAmount:',outAmount, 'count-->', count)
                                            count++
                                        } else {

                                            if(obj['ueu'] === undefined) {
                                                obj['ueu'] = {}
                                            }
                                            obj['ueu']['sell(wavesEuro)'] = {}
                                            obj['ueu']['sell(wavesEuro)']['amount'] = amount
                                            obj['ueu']['sell(wavesEuro)']['price'] = askPrice
                                            obj['sell(wavesEuro)'] = (amount - object['fee'])/askPrice
                                            obj['sell(wavesEuro)'] = this.fix(obj['sell(wavesEuro)'])
                                            obj['ueu']['sell(wavesEuro)']['amount_reverse'] = obj['sell(wavesEuro)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case'euroUsd':
                            while(verify) {
                                if(count >= 10) {
                                    verify = false
                                    obj['sell(euroUsd)'] = undefined
                                } else {
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['bids'][count] === undefined) {
                                        obj['sell(euroUsd)'] = undefined
                                        verify = false
                                    } else {
                                        if(pair['asks'][count] !== undefined) {
                                            askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])

                                        outAmount = amount*bidPrice
                                        // console.log('result1 --->', amount*askPrice, '----->', count)
                                        // console.log('result2 --->', amount*bidPrice, '----->', count, obj['fee']['euro'])
                                        // console.log('askAmount --->', askAmount,'-','outAmount --->',outAmount,'bidAmount--->',bidAmount, 'count--->', count)
                                        // console.log('bidAmount --->', bidAmount,'askAmount --->',askAmount, 'count--->',count)
                                        if((bidAmount - amount) <= 0){
                                            // console.warn('невозможно купить euroUsd','bidAmount:',bidAmount,'-', 'outAmount:',outAmount, 'count-->', count)
                                            count++
                                        }else{
                                            obj['wuw']['sell(euroUsd)'] = {}
                                            obj['wuw']['sell(euroUsd)']['amount'] = amount
                                            obj['wuw']['sell(euroUsd)']['price'] = bidPrice
                                            obj['sell(euroUsd)'] = (amount - obj['fee']['euro'])*bidPrice
                                            obj['sell(euroUsd)'] = this.fix(obj['sell(euroUsd)'])
                                            obj['wuw']['sell(euroUsd)']['amount_reverse'] = obj['sell(euroUsd)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        case'usdEuro':
                            while(verify){
                                if(count >= 10){
                                    verify = false
                                    obj['sell(usdEuro)'] = undefined
                                }else{
                                    let bidAmount = {}
                                    let bidPrice = {}
                                    let askAmount = {}
                                    let askPrice = {}
                                    if(pair['asks'][count] === undefined){
                                        obj['sell(usdEuro)'] = undefined
                                        verify = false
                                    }else{
                                        if(pair['bids'][count] !== undefined){
                                            bidAmount = pair['bids'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                            bidPrice = this.denormalize(pair['bids'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        }
                                        askAmount = pair['asks'][count]['amount']/(10**obj['decimals'][`${ pair['pair']['amountAsset'] }`])
                                        askPrice = this.denormalize(pair['asks'][count]['price'],obj['decimals'][`${ pair['pair']['priceAsset'] }`],obj['decimals'][`${ pair['pair']['amountAsset'] }`])


                                        outAmount = amount/bidPrice
                                        // console.log('result1 --->', amount/askPrice, '----->', count)
                                        // console.log('result2 --->', amount/bidPrice, '----->', count)
                                        // console.log('askAmount --->', askAmount,'-','outAmount --->',outAmount,'bidAmount--->',bidAmount, 'count--->', count)
                                        // console.log('bidAmount --->', bidAmount,'askAmount --->',askAmount, 'count--->',count)
                                        if((bidAmount - outAmount) <= 0){
                                            // console.warn('невозможно купить usdEuro','bidAmount:',bidAmount,'-', 'outAmount:',outAmount, 'count-->', count)
                                            count++
                                        }else{
                                            if(obj['wew'] === undefined) {
                                                obj['wew'] = {}
                                            }
                                            obj['wew']['sell(usdEuro)'] = {}
                                            obj['wew']['sell(usdEuro)']['amount'] = amount
                                            obj['wew']['sell(usdEuro)']['price'] = askPrice
                                            obj['sell(usdEuro)'] = (amount - obj['fee']['usd'])/askPrice
                                            obj['sell(usdEuro)'] = this.fix(obj['sell(usdEuro)'])
                                            obj['wew']['sell(usdEuro)']['amount_reverse'] = obj['sell(usdEuro)']
                                            verify = false
                                        }
                                    }
                                }
                            }
                            resolve(obj)
                            break
                        default:
                            // console.warn('имя не обрабатывается --->', name)
                            break

                    }


                    resolve(obj)
                })
            }
            fix(number){
                return parseFloat(number.toFixed(3))
            }
            end(event){
                console.log('RRRRRRRRRRRRRRR end RRRRRRRRRRRRRRRRR')
                // queue(event['detail']['console'], '~end',event['detail']['color'],event['detail']['substrate'],event['detail']['relation']).then((data)=>{
                //
                //     colorlog(true, 'stat','stat',data, 'статистика')
                //
                // })
            }
            get self() {
                return object
            }
        }
        return isEmpty(object.staticProperty.class)
          ? object.staticProperty.class = new Class()
          : object.staticProperty.class
})();