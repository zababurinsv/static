import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import queue from '/static/html/components/component_modules/queue/queue.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
let system = {
    net: {
        test:'T',
        main:'W',
        stage:'S',
    }
}
export default class Waves {
    constructor(self) {
        this.bank = this.bank.bind(this)
        this.balance = this.balance.bind(this)
        this.wallet = this.wallet.bind(this)
        this.faucet = this.faucet.bind(this)
        this.transfer = this.transfer.bind(this)
        this.nft = this.nft.bind(this)
        this.getNft = this.getNft.bind(this)
        this.denormalize = this.denormalize.bind(this)
        this.details = this.details.bind(this)
        this.waitForTx = this.waitForTx.bind(this)
        this.end = this.end.bind(this)
        this.order = this.order.bind(this)
        this.cancelAllOrders = this.cancelAllOrders.bind(this)
        this.getOrders = this.getOrders.bind(this)

        document.addEventListener('typeScript-end', this.end)
    }
    getOrders(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
            let orders = {}
            if(relation === 't'){
                orders = await fetch(`${config}/matcher/orderbook/${substrate}?activeOnly=true`,{
                    method: 'GET',
                    headers:{
                        Timestamp:property['timestamp'],
                        Signature:property['signature'],
                    }

                })
                resolve(await orders.json())
            }else if(relation === 'w'){
                orders  = await fetch(`${net.matcher.waves.main}/matcher/orderbook/${substrate}?activeOnly=true`,{
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
            if(relation === 't'){
                let request = {
                    method: 'POST',
                    body:substrate,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                }
                order = await fetch(`${net.matcher.waves.test}/matcher/orderbook/cancel`,request)
                resolve(await order.json())

            }else if(relation === 'w'){


            }else{
                console.warn( 'укажите тип сети t - тестнет w - майннет')
                resolve(false)
            }

        })
    }
    order(view = true,property='',color = 'black', substrate={_:'order'},relation='order'  ){
        return new Promise(async (resolve, reject)=>{
            let order = {}
            if(relation === 't'){
                let request = {
                    method: 'POST',
                    body:substrate,
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                }
                order = await fetch(`${net.matcher.waves.test}/matcher/orderbook`,request)
                resolve(await order.json())

            }else if(relation === 'w'){


            }else{
                console.warn( 'укажите тип сети t - тестнет w - майннет')
                resolve(false)
            }

        })
    }
    denormalize(price, priceAssetDecimals, amountAssetDecimals){
        let wvsPrice = 10 ** (priceAssetDecimals - amountAssetDecimals + 8)
        return price/wvsPrice
    }
    getNft(address='', limit = 1, after = undefined){
        return new Promise(async (resolve, reject)=>{
            let balance = {}
            if(after === undefined){
                balance = await fetch(`https://nodes-testnet.wavesnodes.com/assets/nft/${address}/limit/${limit}`)
            }else{
                balance = await fetch(`https://nodes-testnet.wavesnodes.com/assets/nft/${address}/limit/${limit}?after=${after}`)
            }
            resolve(await balance.json())
        })
    }
    details(assetId){
        return new Promise(async (resolve, reject)=>{
            let balance = await fetch(`https://nodes.wavesnodes.com/assets/details/${assetId}`)
            resolve(await balance.json())
        })
    }
    balance(id){
        return new Promise(async (resolve, reject)=>{
            let balance = await fetch(`https://nodes-testnet.wavesnodes.com/addresses/balance/${id}`)
            resolve(await balance.json())
        })
    }
    nft(view = true,property='a',color = 'black', substrate={_:'button'},relation='transfer'  ){
        return queue(view, property,color,substrate,relation)
    }
    transfer(console = true,property='a',color = 'black', substrate={_:'button'},relation='transfer'  ){
        return queue(console, property,color,substrate,relation)
    }
    faucet(console = true,property='a',color = 'black', substrate={_:'button'},relation='faucet'  ){
        return queue(console, property,color,substrate,relation)
    }
    bank(console = true,property='a',color = 'black', substrate={_:'button'},relation='bank'  ){
        return queue(console, property,color,substrate,relation)
    }
    wallet(console = true,property='a',color = 'black', substrate={_:'player'},relation='wallet'  ){
        return queue(console, property,color,substrate,relation)
    }
    waitForTx(id, node){
        return  new Promise(async (resolve, reject) => {
            resolve(transactions['waitForTx'](id, node))
        })
    }
    end(event){
        queue(event['detail']['console'], '~end',event['detail']['color'],event['detail']['substrate'],event['detail']['relation']).then((data)=>{
            
            colorlog(true, 'stat','stat',data, 'статистика')
            
        })
    }
    get self() {
        return object
    }
}