import task from '/static/html/components/component_modules/heap/index.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']
let object = {}
object.staticProperty = {}
object.staticProperty.class = undefined
object['fee'] = 0.003
export default (()=>{
        let Class = class Dex {
            constructor() {
                // e = second
                // u = third
                // w = first
                this.orderbook = this.orderbook.bind(this)
                this.denormalize = this.denormalize.bind(this)
                this.buy = this.buy.bind(this)
                this.fb_fs = this.fb_fs.bind(this)
                this.fb_ft = this.fb_ft.bind(this)
                this.sb_sf = this.sb_sf.bind(this)
                this.sb_tf = this.sb_tf.bind(this)
                this.fs_fs = this.fs_fs.bind(this)
                this.fb_ts = this.fb_ts.bind(this)
                this.fs_ft = this.fs_ft.bind(this)
                this.fb_st = this.fb_st.bind(this)

                this.sell = this.sell.bind(this)
                this.fix = this.fix.bind(this)
            }
            orderbook(amountAsset, priceAsset) {
                return new Promise( async (resolve, reject) => {
                    try {
                        let url = `${config['matcher'][`W`]}/matcher/orderbook/${amountAsset}/${priceAsset}?depth=10`
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
            denormalize(price, amountAssetDecimals, priceAssetDecimals, ){
                let wvsPrice = 10 ** (priceAssetDecimals - amountAssetDecimals + 8)
                return price/wvsPrice
            }
            fb_st(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['s','t']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            assets.head.orders.W[`buy(${r})`] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                assets.head.orders.W[`buy(${r})`] = undefined
                                verify = false
                            } else {
                                if(p.orderbook.bids[count] !== undefined) {
                                    bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]/askPrice))

                                let cur1 = Symbol(`p.amount.${currency[0]}`)
                                let cur2 = Symbol(`p.amount.${currency[1]}`)
                                // console.assert(false, {
                                //     [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[1]}`]} / ${askPrice}`,
                                //     askAmount: askAmount,
                                //     askPrice: askPrice,
                                //     bidAmount: bidAmount,
                                //     bidPrice: bidPrice,
                                //     [cur1]: p.amount[`${currency[0]}`],
                                //     [cur2]: p.amount[`${currency[1]}`],
                                //     "verify": (bidAmount - p.amount[`${currency[0]}`])
                                // })
                                if((bidAmount - p.amount[`${currency[0]}`]) < 0) {
                                    console.warn(`невозможно купить ${currency[1]}`,{
                                        askAmount: askAmount,
                                        "amount": p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    let s = assets.head.assets.W.second
                                    let t = assets.head.assets.W.third
                                    p.self.orders.W.ffs[2][`buy(${r})`][`amount`][`${currency[0]}`] = this.fix(p.amount[`${currency[0]}`])
                                    p.self.orders.W.ffs[2][`buy(${r})`][`amount`][`${currency[1]}`] = p.amount[`${currency[1]}`]
                                    p.self.orders.W.ffs[2][`buy(${r})`][`amount`]['_'] = this.fix(p.amount[`${currency[0]}`] - p.fee[`${currency[0]}`])
                                    p.self.orders.W.ffs[2][`buy(${r})`]['price'] = bidPrice
                                    let out = p.self.orders.W.ffs[2][`buy(${r})`][`amount`]['_']
                                    p.view.innerHTML = `${t}=>${s}[(${p.amount[`${currency[1]}`]}*)${out}]`
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
            }
            fs_ft(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['f','t']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            assets.head.orders.W[`buy(${r})`] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                assets.head.orders.W[`buy(${r})`] = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[1]}`] = ((p.amount[`${currency[0]}`]*bidPrice))

                                // let cur1 = Symbol(`p.amount.${currency[0]}`)
                                // let cur2 = Symbol(`p.amount.${currency[1]}`)
                                // console.assert(false, {
                                //     [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[0]}`]} * ${bidPrice}`,
                                //     askAmount: askAmount,
                                //     askPrice: askPrice,
                                //     bidAmount: bidAmount,
                                //     bidPrice: bidPrice,
                                //     [cur1]: p.amount[`${currency[0]}`],
                                //     [cur2]: p.amount[`${currency[1]}`],
                                //     "verify": (bidAmount - p.amount[`${currency[1]}`])
                                // })
                                if((bidAmount - p.amount[`${currency[1]}`]) < 0) {
                                    console.warn(`невозможно купить ${currency[1]}`,{
                                        askAmount: askAmount,
                                        "amount": p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    let t = assets.head.assets.W.third
                                    let f = assets.head.assets.W.first
                                    p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`${currency[0]}`] = p.amount[`${currency[0]}`]
                                    p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`${currency[1]}`] = this.fix(p.amount[`${currency[1]}`])
                                    p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`_`] = this.fix(p.amount[`${currency[1]}`] - p.fee[`${currency[1]}`])
                                    let out = p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`_`]
                                    p.view.innerHTML = `${f}=>${t}[(${p.amount[`${currency[0]}`]}*)${out}]`
                                    p.self.orders.W.ffs[1][`sell(${r})`]['price'] = bidPrice
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
            }
            fb_ts(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['t','s']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            assets.head.orders.W[`buy(${r})`] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                assets.head.orders.W[`buy(${r})`] = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]*bidPrice))

                                let cur1 = Symbol(`p.amount.${currency[0]}`)
                                let cur2 = Symbol(`p.amount.${currency[1]}`)
                                // console.assert(false, {
                                //     [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[1]}`]} * ${bidPrice}`,
                                //     askAmount: askAmount,
                                //     askPrice: askPrice,
                                //     bidAmount: bidAmount,
                                //     bidPrice: bidPrice,
                                //     [cur1]: p.amount[`${currency[0]}`],
                                //     [cur2]: p.amount[`${currency[1]}`],
                                //     "verify": (bidAmount - p.amount[`${currency[0]}`])
                                // })
                                if((bidAmount - p.amount[`${currency[0]}`]) < 0) {
                                    console.warn(`невозможно купить ${currency[1]}`,{
                                        askAmount: askAmount,
                                        "amount": p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    p.amount[`${currency[0]}`] = p.amount[`${currency[0]}`] - p.fee[`${currency[0]}`]
                                    p.amount[`${currency[0]}`] = this.fix(p.amount[`${currency[0]}`])
                                    let s = assets.head.assets.W.second
                                    let t = assets.head.assets.W.third
                                    p.view.innerHTML = `${s}=>${t}[(${p.amount[`${currency[1]}`]}*)${p.amount[`${currency[0]}`]}]`
                                    p.self.orders.W.fft[2][`buy(${r})`][`amount`][`${currency[0]}`] = p.amount[`${currency[0]}`]
                                    p.self.orders.W.fft[2][`buy(${r})`][`amount`][`${currency[1]}`] = p.amount[`${currency[1]}`]
                                    p.self.orders.W.fft[2][`buy(${r})`]['price'] = bidPrice
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
            }
            fs_fs(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['f','s']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            // console.assert(false,p)
                            // p.self.orders.W.fft[1][`sell(${r})`][`amount`][`${currency[0]}`] = undefined
                            // p.self.orders.W.fft[1][`sell(${r})`][`amount`][`${currency[1]}`] = undefined
                            // p.self.orders.W.fft[1][`sell(${r})`][`amount`][`_`] = this.fix(p.amount[`${currency[1]}`])
                            p.self.orders.W.fft[1] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                assets.head.orders.W[`buy(${r})`] = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[1]}`] = ((p.amount[`${currency[0]}`]*bidPrice))

                                // let cur1 = Symbol(`p.amount.${currency[0]}`)
                                // let cur2 = Symbol(`p.amount.${currency[1]}`)
                                // console.assert(false, {
                                //     [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[0]}`]} * ${bidPrice}`,
                                //     askAmount: askAmount,
                                //     askPrice: askPrice,
                                //     bidAmount: bidAmount,
                                //     bidPrice: bidPrice,
                                //     [cur1]: p.amount[`${currency[0]}`],
                                //     [cur2]: p.amount[`${currency[1]}`],
                                //     "verify": (bidAmount - p.amount[`${currency[1]}`])
                                // })
                                if((bidAmount - p.amount[`${currency[1]}`]) < 0) {
                                    console.warn(`невозможно купить ${currency[1]}`,{
                                        askAmount: askAmount,
                                        "amount": p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    let out = this.fix(p.amount[`${currency[1]}`] - p.fee[`${currency[1]}`])
                                    let s = assets.head.assets.W.second
                                    let f = assets.head.assets.W.first
                                    p.view.innerHTML = `${f}=>${s}[(${p.amount[`${currency[0]}`]}*)${out}]`
                                    p.self.orders.W.fft[1][`sell(${r})`][`amount`][`${currency[0]}`] = p.amount[`${currency[0]}`]
                                    p.self.orders.W.fft[1][`sell(${r})`][`amount`][`${currency[1]}`] = this.fix(p.amount[`${currency[1]}`])
                                    p.self.orders.W.fft[1][`sell(${r})`]['price'] = bidPrice
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
            }
            sb_tf(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    console.assert(false)
                    let verify = true
                    let count = 0
                    let currency = ['t','f']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            assets.head.orders.W[`buy(${r})`] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                assets.head.orders.W[`buy(${r})`] = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]*bidPrice))

                                let cur1 = Symbol(`p.amount.${currency[0]}`)
                                let cur2 = Symbol(`p.amount.${currency[1]}`)
                                console.assert(false, {
                                    [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}*${bidPrice}`,
                                    askAmount: askAmount,
                                    askPrice: askPrice,
                                    bidAmount: bidAmount,
                                    bidPrice: bidPrice,
                                    [cur1]: p.amount[`${currency[0]}`],
                                    [cur2]: p.amount[`${currency[1]}`],
                                    "verify": (bidAmount - p.amount[`${currency[1]}`])
                                })
                                if((bidAmount - p.amount[`${currency[1]}`]) < 0) {
                                    console.warn(`невозможно купить ${currency[1]}`,{
                                        askAmount: askAmount,
                                        "amount": p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    let t = assets.head.assets.W.third
                                    let f = assets.head.assets.W.first
                                    p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`${currency[0]}`] = p.amount[`${currency[0]}`]
                                    p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`${currency[1]}`] = this.fix(p.amount[`${currency[1]}`])
                                    p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`_`] = this.fix(p.amount[`${currency[1]}`] - p.fee[`${currency[1]}`])
                                    let out = p.self.orders.W.ffs[1][`sell(${r})`][`amount`][`_`]
                                    p.view.innerHTML = `${f}=>${t}[(${p.amount[`${currency[0]}`]}*)${out}]`
                                    p.self.orders.W.ffs[1][`sell(${r})`]['price'] = bidPrice
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
            }
            sb_sf(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['s','f']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            p.self.orders.W.ssf[0] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.bids[count] === undefined) {
                                p.self.orders.W.ssf[0] = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]*bidPrice))

                                // let cur1 = Symbol(`p.amount.${currency[0]}`)
                                // let cur2 = Symbol(`p.amount.${currency[1]}`)
                                // console.assert(false, {
                                //     [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}*${bidPrice}`,
                                //     askAmount: askAmount,
                                //     askPrice: askPrice,
                                //     bidAmount: bidAmount,
                                //     bidPrice: bidPrice,
                                //     [cur1]: p.amount[`${currency[0]}`],
                                //     [cur2]: p.amount[`${currency[1]}`],
                                //     "verify": (bidAmount - p.amount[`${currency[1]}`])
                                // })
                                if((bidAmount - p.amount[`${currency[1]}`]) < 0) {
                                    console.warn(`невозможно купить ${currency[0]}`,{
                                        askAmount: askAmount,
                                        "amount": p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    let out = this.fix(p.amount[`${currency[0]}`] - p.fee[`${currency[0]}`])
                                    let s = assets.head.assets.W.second
                                    let f = assets.head.assets.W.first
                                    p.view.innerHTML = `${f}=>${s}[(${p.amount[`${currency[1]}`]}*)${out}]`
                                    p.self.orders.W.ssf[0][`buy(${r})`][`amount`][`${currency[0]}`] = p.amount[`${currency[0]}`]
                                    p.self.orders.W.ssf[0][`buy(${r})`][`amount`][`${currency[1]}`] = p.amount[`${currency[1]}`]
                                    p.self.orders.W.ssf[0][`buy(${r})`][`amount`][`_`] = out
                                    p.self.orders.W.ssf[0][`buy(${r})`]['price'] = bidPrice
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
            }
            fb_ft(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['f','t']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            assets.head.orders.W[`buy(${r})`] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                assets.head.orders.W[`buy(${r})`] = undefined
                                verify = false
                            } else {
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]/askPrice))
                                // let cur1 = Symbol(`p.amount.${currency[0]}`)
                                // let cur2 = Symbol(`p.amount.${currency[1]}`)
                                // console.assert(false, {
                                //     [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}*${bidPrice}`,
                                //     askAmount: askAmount,
                                //     askPrice: askPrice,
                                //     bidAmount: bidAmount,
                                //     bidPrice: bidPrice,
                                //     [cur1]: p.amount[`${currency[0]}`],
                                //     [cur2]: p.amount[`${currency[1]}`],
                                //     "verify": (bidAmount - p.amount[`${currency[1]}`])
                                // })
                                if((askAmount - p.amount[`${currency[0]}`]) < 0) {
                                    console.warn('невозможно купить f',{
                                        askAmount: askAmount,
                                        "amount.f":p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    let t = assets.head.assets.W.third
                                    let f = assets.head.assets.W.first
                                    p.self.orders.W.fft[0][`buy(${r})`]['amount'][`${currency[0]}`] = this.fix(p.amount[`${currency[0]}`])
                                    p.self.orders.W.fft[0][`buy(${r})`]['amount'][`${currency[1]}`] = p.amount[`${currency[1]}`]
                                    p.self.orders.W.fft[0][`buy(${r})`]['amount'][`_`] = this.fix(p.amount[`${currency[0]}`] - p.fee[`${currency[0]}`])
                                    p.self.orders.W.fft[0][`buy(${r})`]['price'] = askPrice
                                    let out = p.self.orders.W.fft[0][`buy(${r})`]['amount'][`_`]
                                    p.view.innerHTML = `${t}=>${f}[(${p.amount[`${currency[1]}`]}*)${out}]`
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
            }
            fb_fs(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['f','s']
                    while (verify) {
                        console.log('~~~~~~~~~~~@@@', count)
                        if(count >= 10) {
                            verify = false
                            assets.head.orders.W[`buy(${r})`] = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                assets.head.orders.W[`buy(${r})`] = undefined
                                verify = false
                            } else {
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]/askPrice))
                                // let cur1 = Symbol(`p.amount.${currency[0]}`)
                                // let cur2 = Symbol(`p.amount.${currency[1]}`)
                                // console.assert(false, {
                                //     [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}/${askPrice}`,
                                //     askAmount: askAmount,
                                //     askPrice: askPrice,
                                //     bidAmount: bidAmount,
                                //     bidPrice: bidPrice,
                                //     [cur1]: p.amount[`${currency[0]}`],
                                //     [cur2]: p.amount[`${currency[1]}`],
                                //     "verify": (bidAmount - p.amount[`${currency[1]}`])
                                // })
                                if((askAmount - p.amount[`${currency[0]}`]) < 0) {
                                    console.warn('невозможно купить f',{
                                        askAmount: askAmount,
                                        "amount.f":p.amount.f,
                                        count: count
                                    })
                                    count++
                                } else {
                                    let s = assets.head.assets.W.second
                                    let f = assets.head.assets.W.first
                                    p.self.orders.W.ffs[0][`buy(${r})`]['amount'][`${currency[0]}`] = this.fix(p.amount[`${currency[0]}`])
                                    p.self.orders.W.ffs[0][`buy(${r})`]['amount'][`${currency[1]}`] = p.amount[`${currency[1]}`]
                                    p.self.orders.W.ffs[0][`buy(${r})`]['amount'][`_`] = this.fix(p.amount[`${currency[0]}`] - p.fee[`${currency[0]}`])
                                    p.self.orders.W.ffs[0][`buy(${r})`]['price'] = askPrice
                                    let out = p.self.orders.W.ffs[0][`buy(${r})`]['amount'][`_`]
                                    p.view.innerHTML = `${s}=>${f}[(${p.amount[`${currency[1]}`]}*)${out}]`
                                    verify = false
                                }
                            }
                            count ++
                        }
                    }
                    resolve(assets)
                })
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
            get self() {
                return object
            }
        }
        return isEmpty(object.staticProperty.class)
          ? object.staticProperty.class = new Class()
          : object.staticProperty.class
})();