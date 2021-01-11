import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import queue from '/static/html/components/component_modules/queue/queue.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
let system = {
    net: 'T',
    wvs: 10 ** 8
}

export default class Waves {
    constructor(...args) {
        this.bank = this.bank.bind(this)
        this.balance = this.balance.bind(this)
        this.wallet = this.wallet.bind(this)
        this.faucet = this.faucet.bind(this)
        this.transfer = this.transfer.bind(this)
        this.createNFT = this.createNFT.bind(this)
        this.getNFT = this.getNFT.bind(this)
        this.denormalize = this.denormalize.bind(this)
        this.details = this.details.bind(this)
        this.waitForTx = this.waitForTx.bind(this)
        this.end = this.end.bind(this)
        this.order = this.order.bind(this)
        this.cancelAllOrders = this.cancelAllOrders.bind(this)
        this.getOrders = this.getOrders.bind(this)
        document.addEventListener('typeScript-end', this.end)
    }
    createNFT(view = true,property='a',color = 'black', substrate={_:'button'},relation='transfer'  ) {
        return new Promise(async (resolve, reject) => {
            try {
                let message = false
                let tokenParamsCustomIndivisible = {
                    name: substrate.name,
                    quantity: 1,
                    decimals: 0,
                    reisuable: false,
                    chainId: config[`${system.net}`],
                    description: substrate.description,
                }

                const signedIssueTx = waves.transactions.issue(
                  tokenParamsCustomIndivisible,
                  config['accountsStore']['accountGroups'][`${system.net}`]['seed'])

                const txObjectSignedTwo = waves.transactions.issue(
                  signedIssueTx,
                  config['accountsStore']['accountGroups'][`${system.net}`]['clients'][0]['seed'])

                const txObjectSignedThre = waves.transactions.issue(
                  txObjectSignedTwo,
                  config['accountsStore']['accountGroups'][`${system.net}`]['clients'][1]['seed'])

                message = await waves.transactions.broadcast(txObjectSignedThre, config[`${system.net}`][0])

                await waves.transactions.waitForTx(message.id,{
                    apiBase: config[`${system.net}`][0]
                })
                resolve({
                    status: true,
                    message: message,
                    _scriptDir: import.meta.url
                })
            }catch (e) {
                resolve({
                    status:false,
                    message: e,
                    _scriptDir: import.meta.url
                })
            }
        })
    }
    getNFT(address='', limit = 1, after = undefined, type){
        return new Promise(async (resolve, reject)=>{
            let balance = {}
            if(after === undefined){
                balance = await fetch(`${config[`${type}`][0]}/assets/nft/${address}/limit/${limit}`)
            }else{
                balance = await fetch(`${config[`${type}`][0]}/assets/nft/${address}/limit/${limit}?after=${after}`)
            }
            resolve(await balance.json())
        })
    }
    getOrders(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
            let orders = {}
            if(relation === 'T'){
                orders = await fetch(`${config[`${system.net}`][0]}/matcher/orderbook/${substrate}?activeOnly=true`,{
                    method: 'GET',
                    headers:{
                        Timestamp:property['timestamp'],
                        Signature:property['signature'],
                    }

                })
                resolve(await orders.json())
            }else if(relation === 'w'){
                orders  = await fetch(`${config[`${system.net}`][0]}/matcher/orderbook/${substrate}?activeOnly=true`,{
                    method: 'GET',
                    headers:{
                        Timestamp:property['timestamp'],
                        Signature:property['signature'],
                    }

                })
                resolve(await orders.json())
            }else{
                console.warn( 'укажите тип сети t - тестнет w - майннет')
                resolve(false)
            }
        })
    }
    cancelAllOrders(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
            let order = {}
            if(relation === 'T'){
                let request = {
                    method: 'POST',
                    body:substrate,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                }
                order = await fetch(`${config[`${system.net}`][0]}/matcher/orderbook/cancel`,request)
                resolve(await order.json())

            }else if(relation === 'W'){


            }else{
                console.warn( 'укажите тип сети t - тестнет w - майннет')
                resolve(false)
            }

        })
    }
    order(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
            // console.assert(false, relation,'ddddddddd', substrate, )
            let order = {}
            if(property === 'T') {
                let request = {
                    method: 'POST',
                    body:substrate,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                }
                order = await fetch(`${config['matcher'][`${property}`][0]}/matcher/orderbook`,request)
                resolve(await order.json())

            }else if(property === 'W'){
                let request = {
                    method: 'POST',
                    body:substrate,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                }
                order = await fetch(`${config['matcher'][`${property}`][0]}/matcher/orderbook`,request)
                console.assert(false,order)
                resolve(await order.json())
            }else{
                console.warn( 'укажите тип сети T - тестнет W - майннет', property)
                resolve(false)
            }

        })
    }
    denormalize(price, priceAssetDecimals, amountAssetDecimals){
        let wvsPrice = 10 ** (priceAssetDecimals - amountAssetDecimals + 8)
        return price/wvsPrice
    }
    details(v,p,c,s,r){
        return new Promise(async (resolve, reject)=>{
            switch (p){
                case 'W':
                    system.net = 'W'
                    break
                case 'T':
                    system.net = 'T'
                    break
                default:
                    system.net = 'T'
                    break
            }
            let balance = await fetch(`${config[`${system.net}`][0]}/assets/details/${s}`)
            resolve(await balance.json())
        })
    }
    balance(id){
        return new Promise(async (resolve, reject)=>{
            try {
                let balance = await fetch(`${config[`${system.net}`][0]}/addresses/balance/${id}`)
                balance = await balance.json()
                resolve({
                    status: true,
                    message: balance,
                    _scriptDir: import.meta.url
                })
            } catch (e) {
                resolve({
                    status: false,
                    message: e,
                    _scriptDir: import.meta.url
                })
            }
        })
    }
    transfer(console = true,property='a',color = 'black', substrate={_:'button'},relation='transfer'  ){
        // return queue(console, property,color,substrate,relation)
    }
    faucet(console = true,property='a',color = 'black', substrate={_:'button'},relation='faucet'  ){
        // return queue(console, property,color,substrate,relation)
    }
    bank(console = true,property='a',color = 'black', substrate={_:'button'},relation='bank'  ){
        // return queue(console, property,color,substrate,relation)
    }
    wallet(console = true,property='a',color = 'black', substrate={_:'player'},relation='wallet'  ){
        // return queue(console, property,color,substrate,relation)
    }
    waitForTx(id, node){
        return  new Promise(async (resolve, reject) => {
            resolve(waves.transactions['waitForTx'](id, node))
        })
    }
    end(event){
        queue(event['detail']['console'], '~end',event['detail']['color'],event['detail']['substrate'],event['detail']['relation']).then((data)=>{
            
            colorlog(true, 'stat','stat',data, 'статистика')
            
        })
    }
    get self() {
        return waves
    }
}