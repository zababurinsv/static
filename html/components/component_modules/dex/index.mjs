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
                this.orderbook = this.orderbook.bind(this)
                this.denormalize = this.denormalize.bind(this)
                this.fix = this.fix.bind(this)
                this.fb_fs = this.fb_fs.bind(this)
                this.sb_fs = this.sb_fs.bind(this)
                this.fb_ft = this.fb_ft.bind(this)
                this.sb_sf = this.sb_sf.bind(this)
                this.sb_tf = this.sb_tf.bind(this)
                this.fs_fs = this.fs_fs.bind(this)
                this.fb_ts = this.fb_ts.bind(this)
                this.ss_ts = this.ss_ts.bind(this)
                this.fs_ft = this.fs_ft.bind(this)
                this.fb_st = this.fb_st.bind(this)
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
                            p.self.orders.W.ffs = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.ffs = undefined
                                verify = false
                            } else {
                                if(p.orderbook.bids[count] !== undefined) {
                                    bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]/askPrice))

                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[1]}`]} / ${askPrice}`,
                                        func:"ffs__fb_st",
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": (bidAmount - p.amount[`${currency[0]}`])
                                    })
                                }
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
            ss_ts(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['t','s']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            p.self.orders.W.ttf  = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.ttf = undefined
                                verify = false
                            } else {
                                if(p.orderbook.bids[count] !== undefined) {
                                    bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[1]}`] = ((p.amount[`${currency[0]}`]/askPrice))
                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    let verify = Symbol("verify: askAmount - p.amount[`${currency[1]}`]")
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[0]}`]} / ${askPrice}`,
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        type:"ttf__ss_ts",
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        [verify]: (askAmount - p.amount[`${currency[1]}`])
                                    })
                                }
                                if((askAmount - p.amount[`${currency[1]}`]) < 0) {
                                    console.warn(`невозможно купить ${currency[1]}`,{
                                        askAmount: askAmount,
                                        "amount": p.amount[`${currency[0]}`],
                                        count: count
                                    })
                                    count++
                                } else {
                                    let t = assets.head.assets.W.third
                                    let s = assets.head.assets.W.second
                                    p.self.orders.W.ttf[1][`sell(${r})`][`amount`][`${currency[0]}`] = p.amount[`${currency[0]}`]
                                    p.self.orders.W.ttf[1][`sell(${r})`][`amount`][`${currency[1]}`] = this.fix(p.amount[`${currency[1]}`])
                                    p.self.orders.W.ttf[1][`sell(${r})`][`amount`][`_`] = this.fix(p.amount[`${currency[1]}`] - p.fee[`${currency[1]}`])
                                    let out = p.self.orders.W.ttf[1][`sell(${r})`][`amount`][`_`]
                                    p.view.innerHTML = `${t}=>${s}[(${p.amount[`${currency[0]}`]}*)${out}]`
                                    p.self.orders.W.ttf[1][`sell(${r})`]['price'] = askPrice
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
                            p.self.orders.W.ffs = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.ffs = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[1]}`] = ((p.amount[`${currency[0]}`]*bidPrice))
                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[0]}`]} * ${bidPrice}`,
                                        func:"ffs__fs_ft",
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": (bidAmount - p.amount[`${currency[1]}`])
                                    })
                                }
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
                            p.self.orders.W.fft = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.fft= undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]*bidPrice))

                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[1]}`]} * ${bidPrice}`,
                                        func:"fft__fb_ts",
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": `bidAmount: ${bidAmount} - p.amount.${currency[0]}: ${p.amount[`${currency[0]}`]}` + '=' + (bidAmount - p.amount[`${currency[0]}`])
                                    })
                                }
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
                            p.self.orders.W.fft = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.fft = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)

                                p.amount[`${currency[1]}`] = ((p.amount[`${currency[0]}`]*bidPrice))
                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${currency[0]}: ${p.amount[`${currency[0]}`]} * ${bidPrice}`,
                                        func:"fft__fs_fs",
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": (bidAmount - p.amount[`${currency[1]}`])
                                    })
                                }
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
                    let verify = true
                    let count = 0
                    let currency = ['t','f']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            p.self.orders.W.ttf = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.ttf = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]*bidPrice))
                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}*${bidPrice}`,
                                        func:"ttf__sb_tf",
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": (bidAmount - p.amount[`${currency[1]}`])
                                    })
                                }
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
                                    p.self.orders.W.ttf[0][`buy(${r})`][`amount`][`${currency[0]}`] = p.amount[`${currency[0]}`]
                                    p.self.orders.W.ttf[0][`buy(${r})`][`amount`][`${currency[1]}`] = this.fix(p.amount[`${currency[1]}`])
                                    p.self.orders.W.ttf[0][`buy(${r})`][`amount`][`_`] = this.fix(p.amount[`${currency[0]}`] - p.fee[`${currency[0]}`])
                                    let out = p.self.orders.W.ttf[0][`buy(${r})`][`amount`][`_`]
                                    p.view.innerHTML = `${f}=>${t}[(${p.amount[`${currency[1]}`]}*)${out}]`
                                    p.self.orders.W.ttf[0][`buy(${r})`]['price'] = bidPrice
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
                            p.self.orders.W.ssf = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.bids[count] === undefined) {
                                p.self.orders.W.ssf = undefined
                                verify = false
                            } else {
                                if(p.orderbook.asks[count] !== undefined) {
                                    askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                    askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                }
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]*bidPrice))
                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}*${bidPrice}`,
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        bidAmount: bidAmount,
                                        func:"ssf__sb_sf",
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": (bidAmount - p.amount[`${currency[1]}`])
                                    })
                                }
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
                            p.self.orders.W.fft = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.fft = undefined
                                verify = false
                            } else {
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]/askPrice))
                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}*${bidPrice}`,
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        func:"ft__fb_ft",
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": `bidAmount: ${bidAmount} - p.amount.${currency[1]}: ` + p.amount[`${currency[1]}`] + '=' + (bidAmount - p.amount[`${currency[1]}`])
                                    })
                                }
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
                        if(count >= 10) {
                            verify = false
                            p.self.orders.W.ffs = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.ffs = undefined
                                verify = false
                            } else {
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]/askPrice))
                               if(v) {
                                   let cur1 = Symbol(`p.amount.${currency[0]}`)
                                   let cur2 = Symbol(`p.amount.${currency[1]}`)
                                   let verify = Symbol(`p.amount.${currency[1]}`)
                                   console.assert(false, {
                                       [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}/${askPrice}`,
                                       askAmount: askAmount,
                                       askPrice: askPrice,
                                       bidAmount: bidAmount,
                                       bidPrice: bidPrice,
                                       func:"ffs__fb_fs",
                                       [cur1]: p.amount[`${currency[0]}`],
                                       [cur2]: p.amount[`${currency[1]}`],
                                       "verify": `askPrice: ${askPrice} - p.amount.${currency[0]}: ${p.amount[`${currency[0]}`]}` + '=' + (askPrice - p.amount[`${currency[0]}`])
                                   })
                               }
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
            sb_fs(v, p, c, assets, r) {
                return new Promise( async (resolve, reject) => {
                    let verify = true
                    let count = 0
                    let currency = ['f','s']
                    while (verify) {
                        if(count >= 10) {
                            verify = false
                            p.self.orders.W.ttf = undefined
                        } else {
                            let bidAmount = {}
                            let bidPrice = {}
                            let askAmount = {}
                            let askPrice = {}
                            if(p.orderbook.asks[count] === undefined) {
                                p.self.orders.W.ttf = undefined
                                verify = false
                            } else {
                                askAmount = p.orderbook.asks[count]['amount'] / (10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                askPrice = this.denormalize(p.orderbook.asks[count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                bidAmount = p.orderbook['bids'][count]['amount']/(10**assets.head.assetId.W[`${p.amountAsset}`].decimals)
                                bidPrice = this.denormalize(p.orderbook['bids'][count]['price'],assets.head.assetId.W[`${p.amountAsset}`].decimals,assets.head.assetId.W[`${p.priceAsset}`].decimals)
                                p.amount[`${currency[0]}`] = ((p.amount[`${currency[1]}`]/askPrice))
                                if(v) {
                                    let cur1 = Symbol(`p.amount.${currency[0]}`)
                                    let cur2 = Symbol(`p.amount.${currency[1]}`)
                                    console.assert(false, {
                                        [`relation_p.amount.${currency[0]}`]: `${p.amount[`${currency[1]}`]}/${askPrice}`,
                                        askAmount: askAmount,
                                        askPrice: askPrice,
                                        func:"ttf__sb_fs",
                                        bidAmount: bidAmount,
                                        bidPrice: bidPrice,
                                        [cur1]: p.amount[`${currency[0]}`],
                                        [cur2]: p.amount[`${currency[1]}`],
                                        "verify": (bidAmount - p.amount[`${currency[1]}`])
                                    })
                                }
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
                                    p.self.orders.W.ttf[2][`buy(${r})`]['amount'][`${currency[0]}`] = this.fix(p.amount[`${currency[0]}`])
                                    p.self.orders.W.ttf[2][`buy(${r})`]['amount'][`${currency[1]}`] = p.amount[`${currency[1]}`]
                                    p.self.orders.W.ttf[2][`buy(${r})`]['amount'][`_`] = this.fix(p.amount[`${currency[0]}`] - p.fee[`${currency[0]}`])
                                    p.self.orders.W.ttf[2][`buy(${r})`]['price'] = askPrice
                                    let out = p.self.orders.W.ttf[2][`buy(${r})`]['amount'][`_`]
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