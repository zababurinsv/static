import dex from '/static/html/components/component_modules/dex/dex.mjs'
import iframe from '/static/html/components/component_modules/iframe/iframe.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import { store } from '/static/html/components/component_modules/storage/index.mjs'
export default async (v,p,c,obj,r) => {
    let methods = (await import('/static/html/components/component_modules/dex/index.mjs'))['default']
    let relation = {}
    let wallet = {}
    let waves = new Waves()
    let sys = {
        _scriptDir: import.meta.url,
        validation: {
            onhashchange: (...args) => { return ("onhashchange" in window)  }
        },
    }
    document.addEventListener('iframe',async (event)=>{
        if(event.detail === 'http://localhost:4999'){
            iframe.post(event.detail, {
                view:true,
                property:'прослушиваем получение кошелька',
                color:'6',
                substrate:{},
                relation:'await-wallet'
            },async (event)=>{

                console.log('--->>>>>', event)
            })
        }
    })

    obj['this'].shadowRoot.querySelector('#fswe').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#fswe').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#fbwe').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#fbwe').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#fbue').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#fbue').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    })
    obj['this'].shadowRoot.querySelector('#fbeu').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#fbeu').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    })
    obj['this'].shadowRoot.querySelector('#fbwu').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)

        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#fbwu').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#fswu').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#fswu').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    obj['this'].shadowRoot.querySelector('#sbew').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#sbew').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#sbwe').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#sbwe').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#sseu').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#sseu').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#ssue').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#ssue').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#sbwu').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#sbwu').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#sbuw').addEventListener('click',async (event)=>{
        event.currentTarget.style.background = '#faf671'
        let value =  event.currentTarget.innerHTML
        value = value.split('*')[0].split('(')[1]
        await navigator.clipboard.writeText(value)
        let timer = setTimeout((event)=>{
            obj['this'].shadowRoot.querySelector('#sbuw').style.background = 'transparent'
            clearTimeout(timer);
        }, 250);
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#left').addEventListener('input',async (e)=>{
        relation['w'] =  e.target.value
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#center').addEventListener('input',async (e)=>{
        relation['u'] =  e.target.value
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#right').addEventListener('input',async (e)=>{
        relation['e'] =  e.target.value
    },{passive:true})
    let assets = {
        waves:'WAVES',
        eth:'474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
        usdt:'34N9YcEETLWn93qYQ64EsP1x89tSruJU44RrEMSXXEPJ'
    }

    let description = {
        wavesEuro:{
            amountAsset: assets.eth,
            priceAsset: assets.waves,
            tickSize:undefined,
        },
        euroUsd:{
            amountAsset: assets.eth,
            priceAsset: assets.usdt,
            tickSize:undefined
        },
        wavesUsd:{
            amountAsset: assets.usdt,
            priceAsset: assets.waves,
            tickSize:undefined
        },
        details:{},
        name:{},
        fee:{},
        assetId:[assets.eth,assets.usdt]
    }
    let itemDetails = {}
    for(let item of description['assetId']){
        itemDetails[`${item}`] = await task.set(true,'W','8',item,'/assets/details/{assetId}')
        description['details'][`${item}`] = itemDetails[`${item}`]['decimals']
        description['name'][`${item}`] = itemDetails[`${item}`]['name']
    }
    description['details'][`WAVES`] = 8
    description['name'][`WAVES`] = `WAVES`

    for(let key in description){
        switch (key) {
            case 'wavesEuro':
                obj['this'].shadowRoot.querySelector('[for="left"]').insertAdjacentHTML('beforeend', `${description['name'][`${description[key]['amountAsset']}`]}`)
                obj['this'].shadowRoot.querySelector('#preview-left').innerText =`${description['name'][`${description[key]['amountAsset']}`]}/${description['name'][`${description[key]['priceAsset']}`]}`
                break
            case 'euroUsd':
                obj['this'].shadowRoot.querySelector('[for="center"]').insertAdjacentHTML('beforeend', `${description['name'][`${description[key]['priceAsset']}`]}`)
                obj['this'].shadowRoot.querySelector('#preview-center').innerText =`${description['name'][`${description[key]['amountAsset']}`]}/${description['name'][`${description[key]['priceAsset']}`]}`
                break
            case 'wavesUsd':
                obj['this'].shadowRoot.querySelector('[for="right"]').insertAdjacentHTML('beforeend', `${description['name'][`${description[key]['priceAsset']}`]}`)
                obj['this'].shadowRoot.querySelector('#preview-right').innerText =`${description['name'][`${description[key]['amountAsset']}`]}/${description['name'][`${description[key]['priceAsset']}`]}`
                break
            default:
                break
        }
    }

    relation['w'] = 10
    relation['u'] = 10
    relation['e'] = 0.1
    relation['decimals'] = description['details']
    relation['fee'] = {}
    relation['description'] = []

    // let wavesEuro = await dex['get']({type:'wavesEuro',pair:description['wavesEuro']}, obj)
    // let euroWaves = wavesEuro
    // let wavesUsd = await  dex['get']({type:'wavesUsd',pair:description['wavesUsd']}, obj)
    // let usdWaves = wavesUsd
    // let euroUsd =  await  dex['get']({type:'eurUsd',pair:description['euroUsd']}, obj)
    // let usdEuro =  euroUsd

    // console.assert(false, wavesEuro)
    // console.log('~~~1~~~~~',eurUsd)
    // console.log('~~~~~2~~~',wavesUsd)
    // console.assert(false, wavesEuro)
    // console.log(wavesUsd['bids'][i]['amount']/wvsAmount)

    let priceAssetDecimals =  {}
    let amountAssetDecimals = {}
    let timerId = setTimeout(async  function tick() {
        relation['eue'] = undefined
        relation['ueu'] = undefined
        relation['wew'] = undefined
        relation['wuw'] = undefined

        let wavesEuro = await dex['get']({net:'W', type:'wavesEuro',pair:description['wavesEuro']}, obj)
        let euroWaves = wavesEuro
        let wavesUsd = await  dex['get']({net:'W', type:'wavesUsd',pair:description['wavesUsd']}, obj)
        let usdWaves = wavesUsd
        let euroUsd =  await  dex['get']({net:'W', type:'eurUsd', pair:description['euroUsd']}, obj)
        let usdEuro =  euroUsd

        let priceAssetDecimalsEuro =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
        let amountAssetDecimalsEuro = description['details'][`${wavesEuro['pair']['amountAsset']}`]
        let priceAssetDecimalsUsd =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
        let amountAssetDecimalsUsd = description['details'][`${wavesUsd['pair']['amountAsset']}`]


        relation['fee']['euro'] = ( 1/methods.denormalize(wavesEuro.asks[0]['price'],priceAssetDecimalsEuro,  amountAssetDecimalsEuro))*0.003
        relation['fee']['usd'] = ( 1/methods.denormalize(wavesUsd.asks[0]['price'],priceAssetDecimalsUsd,  amountAssetDecimalsUsd))*0.003

        relation = await methods.buy(wavesUsd, relation['u'], relation, 'wavesUsd')
        obj['this'].shadowRoot.querySelector('#fbwu').innerHTML = `${description['name'][`${wavesUsd.pair.priceAsset}`]}=>${description['name'][`${wavesUsd.pair.amountAsset}`]}[(${relation['u']}*)${relation['buy(wavesUsd)']}]`
        relation = await methods.sell(wavesEuro, relation['buy(wavesUsd)'], relation, 'wavesEuro')
        obj['this'].shadowRoot.querySelector('#fswe').innerHTML = `${description['name'][`${wavesEuro.pair.priceAsset}`]}=>${description['name'][`${wavesEuro.pair.amountAsset}`]}[(${relation['buy(wavesUsd)']}*)${relation['sell(wavesEuro)']}]`
        relation = await methods.buy(usdEuro, relation['sell(wavesEuro)'], relation, 'usdEuro')
        obj['this'].shadowRoot.querySelector('#fbue').innerHTML = `${description['name'][`${usdEuro.pair.amountAsset}`]}=>${description['name'][`${usdEuro.pair.priceAsset}`]}[(${relation['sell(wavesEuro)']}*)${relation['buy(usdEuro)']}]`


        // console.assert(false, relation)
        relation['description']['ueu'] = []
        relation['description']['ueu'].push(relation['u'])
        relation['description']['ueu'].push(relation['buy(wavesUsd)'])
        relation['description']['ueu'].push(relation['sell(wavesEuro)'])
        relation['description']['ueu'].push(relation['buy(usdEuro)'])
        relation['buy(wavesUsd)'] = {}
        relation['sell(wavesEuro)'] ={}
        relation['buy(usdEuro)'] = {}
        relation = await methods.buy(wavesEuro, relation['e'], relation, 'wavesEuro')
        obj['this'].shadowRoot.querySelector('#fbwe').innerHTML = `${description['name'][`${wavesEuro.pair.amountAsset}`]}=>${description['name'][`${wavesEuro.pair.priceAsset}`]}[(${relation['e']}*)${relation['buy(wavesEuro)']}]`
        relation = await methods.sell(wavesUsd,relation['buy(wavesEuro)'], relation, 'wavesUsd')
        obj['this'].shadowRoot.querySelector('#fswu').innerHTML = `${description['name'][`${wavesUsd.pair.amountAsset}`]}=>${description['name'][`${wavesUsd.pair.priceAsset}`]}[(${relation['buy(wavesEuro)']}*)${relation['sell(wavesUsd)']}]`
        relation = await methods.buy(euroUsd,relation['sell(wavesUsd)'], relation, 'euroUsd')
        obj['this'].shadowRoot.querySelector('#fbeu').innerHTML = `${description['name'][`${euroUsd.pair.priceAsset}`]}=>${description['name'][`${euroUsd.pair.amountAsset}`]}[(${relation['sell(wavesUsd)']}*)${relation['buy(euroUsd)']}]`

        relation['description']['eue'] = []
        relation['description']['eue'].push(relation['e'])
        relation['description']['eue'].push(relation['buy(wavesEuro)'])
        relation['description']['eue'].push(relation['sell(wavesUsd)'])
        relation['description']['eue'].push(relation['buy(euroUsd)'])
        relation['buy(wavesEuro)'] = {}
        relation['sell(wavesUsd)'] ={}
        relation['buy(euroUsd)'] = {}
        relation = await methods.buy(euroWaves, relation['w'], relation, 'euroWaves')
        obj['this'].shadowRoot.querySelector('#sbew').innerHTML = `${description['name'][`${euroWaves.pair.priceAsset}`]}=>${description['name'][`${euroWaves.pair.amountAsset}`]}[(${relation['w']}*)${relation['buy(euroWaves)']}]`
        relation = await methods.sell(euroUsd,relation['buy(euroWaves)'], relation, 'euroUsd')
        obj['this'].shadowRoot.querySelector('#sseu').innerHTML = `${description['name'][`${euroUsd.pair.amountAsset}`]}=>${description['name'][`${euroUsd.pair.priceAsset}`]}[(${relation['buy(euroWaves)']}*)${relation['sell(euroUsd)']}]`
        relation = await methods.buy(wavesUsd,relation['sell(euroUsd)'], relation, 'wavesUsd')
        obj['this'].shadowRoot.querySelector('#sbwu').innerHTML = `${description['name'][`${wavesUsd.pair.priceAsset}`]}=>${description['name'][`${wavesUsd.pair.amountAsset}`]}[(${relation['sell(euroUsd)']}*)${relation['buy(wavesUsd)']}]`

        relation['description']['wuw'] = []
        relation['description']['wuw'].push(relation['w'])
        relation['description']['wuw'].push(relation['buy(euroWaves)'])
        relation['description']['wuw'].push(relation['sell(euroUsd)'])
        relation['description']['wuw'].push(relation['buy(wavesUsd)'])
        relation['buy(euroWaves)'] = {}
        relation['sell(euroUsd)'] ={}
        relation['buy(wavesUsd)'] = {}

        relation = await methods.buy(usdWaves, relation['w'], relation, 'usdWaves')
        obj['this'].shadowRoot.querySelector('#sbuw').innerHTML = `${description['name'][`${usdWaves.pair.amountAsset}`]}=>${description['name'][`${usdWaves.pair.priceAsset}`]}[(${relation['w']}*)${relation['buy(usdWaves)']}]`
        relation = await methods.sell(usdEuro,relation['buy(usdWaves)'], relation, 'usdEuro')
        obj['this'].shadowRoot.querySelector('#ssue').innerHTML = `${description['name'][`${usdEuro.pair.priceAsset}`]}=>${description['name'][`${usdEuro.pair.amountAsset}`]}[(${relation['buy(usdWaves)']}*)${relation['sell(usdEuro)']}]`
        relation = await methods.buy(wavesEuro,relation['sell(usdEuro)'], relation, 'wavesEuro')
        obj['this'].shadowRoot.querySelector('#sbwe').innerHTML = `${description['name'][`${wavesEuro.pair.amountAsset}`]}=>${description['name'][`${wavesEuro.pair.priceAsset}`]}[(${relation['sell(usdEuro)']}*)${relation['buy(wavesEuro)']}]`

        relation['description']['wew'] = []
        relation['description']['wew'].push(relation['w'])
        relation['description']['wew'].push(relation['buy(usdWaves)'])
        relation['description']['wew'].push(relation['sell(usdEuro)'])
        relation['description']['wew'].push(relation['buy(wavesEuro)'])
        relation['buy(usdWaves)'] = {}
        relation['sell(usdEuro)'] ={}
        relation['buy(wavesEuro)'] = {}

        let seed = 'tone leg hidden system tenant aware desk clap body robust debris puppy ecology scan runway thing second metal cousin ocean liberty banner garment rice feel'
        let publicKey = 'HrMWJVXDkjpzkMA3LnzurfmXMtRTtip4uS2236NvW6AR'
        let timestamp = Date.now();
        let signature = await task.set(true,'W','8',{
            seed:seed,
            publicKey:publicKey,
            timestamp:timestamp
        },'/assets/signature/{assetId}')

        let getOrders = await  task.set(true, {
            timestamp:timestamp,
            signature:signature,
            type:'W'
        },'7',{
            property:'получаем ордера',
            publicKey:publicKey,
            substrate:publicKey,
            relation:'T'
        },'/matcher/orderbook/{publicKey}')
        // let idbOrders = (await store).set(true, 'T','7','monopoly','/storage/get/all')
        // console.assert(false,await idbOrders)
        if(getOrders.length > 2){
            // let object = JSON.stringify({
            //     sender: publicKey,
            //     timestamp: timestamp,
            //     signature: signature,
            //     orderId: null
            // })
            // await task.set(true, 'T','7',object,'/matcher/orderbook/cancel')
            // await task.set(true, 'T','7',{},'/storage/delete/all')
        }else{
            // console.assert(false, idbOrders)
            // let order = await task.set(true,'T','8',relation['system']['items']['eue']['substrate'],'/matcher/orderbook/set')
            // await task.set(true, 'T','7',order,'/storage/set/item')
        }
        //  console.log('###################', requestSet)
        if(relation['description']['ueu'][0] - relation['description']['ueu'][3] < 0){
            relation['description']['ueu'].push(new Date().toString())
            relation['description']['ueu'].push('first')
            obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['ueu'], null, 2)}</p>`)
            obj['this'].shadowRoot.querySelector('div.fbwu').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.fswe').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.fbue').style.background ='#f476b673'
        }else{
            obj['this'].shadowRoot.querySelector('div.fbwu').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.fswe').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.fbue').style.background ='#7694f473'
        }
        if(relation['description']['eue'][0] - relation['description']['eue'][3] < 0){
            relation['description']['eue'].push(new Date().toString())
            relation['description']['eue'].push('second')
            obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['eue'], null, 2)}</p>`)
            obj['this'].shadowRoot.querySelector('div.fbwe').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.fswu').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.fbeu').style.background ='#f476b673'
        }else{
            obj['this'].shadowRoot.querySelector('div.fbwe').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.fswu').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.fbeu').style.background ='#7694f473'
        }
        if(relation['description']['wuw'][0] - relation['description']['wuw'][3] < 0){
            relation['description']['wuw'].push(new Date().toString())
            relation['description']['wuw'].push('fird')
            obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wuw'], null, 2)}</p>`)
            obj['this'].shadowRoot.querySelector('div.sbew').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.sseu').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.sbwu').style.background ='#f476b673'
        }else{
            obj['this'].shadowRoot.querySelector('div.sbew').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.sseu').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.sbwu').style.background ='#7694f473'
        }
        if(relation['description']['wew'][0] - relation['description']['wew'][3] < 0){
            relation['description']['wew'].push(new Date().toString())
            relation['description']['wew'].push('fourth')
            obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wew'], null, 2)}</p>`)
            obj['this'].shadowRoot.querySelector('div.sbuw').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.ssue').style.background ='#f476b673'
            obj['this'].shadowRoot.querySelector('div.sbwe').style.background ='#f476b673'
        }else{
            obj['this'].shadowRoot.querySelector('div.sbuw').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.ssue').style.background ='#7694f473'
            obj['this'].shadowRoot.querySelector('div.sbwe').style.background ='#7694f473'
        }
        // console.assert(false, relation)
        // console.log('~~~~>>', relation)
        // relation.timestamp =  new Date();
        // if((relation['buy(usdEuro)'] - relation['u']) > 0){

        //  }
        // if((relation['buy(euroUsd)'] - relation['e']) > 0){
        //     obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`
        //          <p class="euroUsd">${JSON.stringify(relation, null, 2)}</p> `)
        // }
        // methods.buy(euroUsd)



        for(let i=0; i < 10;i++){
            if(wavesEuro['asks'][i] === undefined){
            }else{
                priceAssetDecimals =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
                amountAssetDecimals = description['details'][`${wavesEuro['pair']['amountAsset']}`]
                obj['this'].shadowRoot.querySelector('#wavesEuroAsk').children[i].innerText = `${ waves.denormalize(wavesEuro['asks'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
            }
            if(wavesEuro['bids'][i] === undefined){
            }else{
                priceAssetDecimals =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
                amountAssetDecimals = description['details'][`${wavesEuro['pair']['amountAsset']}`]
                obj['this'].shadowRoot.querySelector('#wavesEuroBid').children[i].innerText = `${ waves.denormalize(wavesEuro['bids'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
            }

            if(wavesUsd['asks'][i] === undefined){
            }else{
                priceAssetDecimals =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
                amountAssetDecimals = description['details'][`${wavesUsd['pair']['amountAsset']}`]
                obj['this'].shadowRoot.querySelector('#wavesUsdAsk').children[i].innerText = `${ waves.denormalize(wavesUsd['asks'][i]['price'],priceAssetDecimals,amountAssetDecimals ) }`
            }
            if(wavesUsd['bids'][i] === undefined){
            }else{
                priceAssetDecimals =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
                amountAssetDecimals = description['details'][`${wavesUsd['pair']['amountAsset']}`]
                obj['this'].shadowRoot.querySelector('#wavesUsdBid').children[i].innerText =  `${ waves.denormalize(wavesUsd['bids'][i]['price'],priceAssetDecimals,amountAssetDecimals ) }`
            }

            if(euroUsd['asks'][i] === undefined){
            }else{
                priceAssetDecimals =  description['details'][`${euroUsd['pair']['priceAsset']}`]
                amountAssetDecimals = description['details'][`${euroUsd['pair']['amountAsset']}`]
                obj['this'].shadowRoot.querySelector('#euroUsdAsk').children[i].innerText =  `${ waves.denormalize(euroUsd['asks'][i]['price'],priceAssetDecimals, amountAssetDecimals) }`
            }
            if(euroUsd['bids'][i] === undefined){

            }else{
                priceAssetDecimals =  description['details'][`${euroUsd['pair']['priceAsset']}`]
                amountAssetDecimals = description['details'][`${euroUsd['pair']['amountAsset']}`]
                obj['this'].shadowRoot.querySelector('#euroUsdBid').children[i].innerText = `${ waves.denormalize(euroUsd['bids'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
            }


            obj['this'].shadowRoot.querySelector('#wavesEuroTimestamp').innerText = wavesEuro['timestamp']
            obj['this'].shadowRoot.querySelector('#wavesEuroDelta').innerText = Date.now() - wavesEuro['timestamp']
            obj['this'].shadowRoot.querySelector('#wavesUsdTimestamp').innerText = wavesUsd['timestamp']
            obj['this'].shadowRoot.querySelector('#wavesUsdDelta').innerText = Date.now() - wavesUsd['timestamp']
            obj['this'].shadowRoot.querySelector('#euroUsdTimestamp').innerText = euroUsd['timestamp']
            obj['this'].shadowRoot.querySelector('#euroUsdDelta').innerText = Date.now() - euroUsd['timestamp']
        }
        timerId = setTimeout(tick, 3000);
    }, 3000);
}