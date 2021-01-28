import iframe from '/static/html/components/component_modules/iframe/iframe.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Assets from '/static/html/components/crypto-dex/external/assets/index.mjs'
import events from '/static/html/components/crypto-dex/external/events.mjs'
const waves = new Waves()
function count (obj) {
    let countDownDate = Date.now();
    let x = setInterval(function() {
        let now = Date.now();
        let distance = now - countDownDate;

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        obj.this.shadowRoot.querySelector('.count-main').innerHTML = days + "d " + hours + "h "
          + minutes + "m " + seconds + "s ";

        if (distance < 0) {
            clearInterval(x);
            obj.this.shadowRoot.querySelector('.count-main').innerHTML = "EXPIRED";
        }
    }, 1000);
}
function pairs(type = undefined) {
    return new Promise(async (resolve, reject) => {
        try {
            let assets = Assets(type)
            let testnet = await task.set(true, 'T', 'green', '','/matcher/settings')
            let mainnet = await task.set(true, 'W', 'green', '','/matcher/settings')
            assets.head.matcher.W.matcherPublicKey = mainnet.message.matcherPublicKey
            assets.head.matcher.W.priceAssets = mainnet.message.priceAssets
            assets.head.matcher.T.matcherPublicKey = testnet.message.matcherPublicKey
            assets.head.matcher.T.priceAssets = testnet.message.priceAssets
            assets.head.matcher.S.matcherPublicKey = testnet.message.matcherPublicKey
            assets.head.matcher.S.priceAssets = testnet.message.priceAssets
            for(let type in assets) {
                if(type !== 'head' && type !== 'aside' && type !== 'footer' && type !== 'header' && type !== 'S') {
                    for(let key in assets[type]) {
                        let details = {}
                        if(assets[type][key] !== 'WAVES') {
                            details = await task.set(true,type,'8',assets[type][key],'/assets/details/{assetId}')
                            assets.head.decimals[type][key] = details.decimals
                            assets.head.assets[type][key] = details.name
                            assets.head.assetId[type][`${details.assetId}`] = {}
                            assets.head.assetId[type][`${details.assetId}`]['name'] = details.name
                            assets.head.assetId[type][`${details.assetId}`]['decimals'] = details.decimals
                            assets.head.assetId[type][`${details.assetId}`]['key'] = key
                        } else {
                            assets.head.assetId[type][`WAVES`] = { }
                            assets.head.assetId[type][`WAVES`]['name'] = 'WAVES'
                            assets.head.assetId[type][`WAVES`]['decimals'] = 8
                            assets.head.assetId[type][`WAVES`]['key'] = key
                            assets.head.decimals[type][key] = 8
                        }
                        for(let assetPair in assets.head.matcher[type].priceAssets) {
                            if(assets[type][key] === assets.head.matcher[type].priceAssets[assetPair]) {
                                assets.head.assetPair[type][key] = parseInt(assetPair, 10)
                            }
                        }
                    }
                }
            }
            for(let type in assets.head.pairs) {
                if(type !== 'S') {
                    for(let pair in assets.head.pairs[type]) {
                        let item = pair.split('/')
                        if(assets.head.assetPair[type][`${item[0]}`] === assets.head.assetPair[type][`${item[1]}`]) {
                            //console.log('gggggggggg',waves.compareUint8Arrays(assets[type][`${item[0]}`], assets[type][`${item[1]}`]))
                        } else {
                            if(assets.head.assetPair[type][`${item[0]}`] > assets.head.assetPair[type][`${item[1]}`]) {
                                assets.head.pairs[type][pair]['amountAsset'] = assets[type][`${item[0]}`]
                                assets.head.pairs[type][pair]['priceAsset'] = assets[type][`${item[1]}`]
                            } else {
                                assets.head.pairs[type][pair]['amountAsset'] = assets[type][`${item[1]}`]
                                assets.head.pairs[type][pair]['priceAsset'] = assets[type][`${item[0]}`]
                            }
                        }
                    }
                }
            }
            assets.head.success = true
            resolve(assets)
        }catch (e) {
            resolve({
                status: 'not',
                success: false,
                message: e,
                _scriptDir: import.meta.url
            })
        }
    })
}

export default async (v,p,c,obj,r) => {
    events(v,p,c,obj,r)
    let dex = (await import('/static/html/components/component_modules/dex/index.mjs'))['default']
    let assets = await pairs()
   /*
    let description = {
        wavesEuro:{
            amountAsset: assets.W.eth,
            priceAsset: assets.W.waves,
            tickSize:undefined,
        },
        euroUsd:{
            amountAsset: assets.W.eth,
            priceAsset: assets.W.usdt,
            tickSize:undefined
        },
        wavesUsd:{
            amountAsset: assets.W.usdt,
            priceAsset: assets.W.waves,
            tickSize:undefined
        },
        details:{},
        name:{},
        fee:{},
        assetId:[assets.W.eth,assets.W.usdt],
        T: {
            "usdt": 6,
            "waves": 8,
            "eth":8
        }
    }
    */
    let sys = {
        _scriptDir: import.meta.url,
        validation: {
            "onhashchange": (...args) => { return ("onhashchange" in window)  },
            "disabled": {
                "views": {
                    "0": true,
                    "1": true,
                    "2": true,
                    "3": true,
                }
            },
            "input":{
                "amount": true
            },
            "output": {
                "prod": false,
                "amount": true
            },
            "delete": {
                "order": true
            },
            "set": {
                "order": true
            }
        },
        counts: {
            "main": -1
        },
        threshold: {
            "main": 0,
            "amount": 0.01
        },
        navigation: {
            "assets": {
                "success": false,
                "first": 10,
                "second": 10,
                "third": 10
            }
        },
        info: (v = true, item = undefined) => {
            if(typeof v === 'boolean') {
                if (item === undefined) {
                    (!v)
                      ? console.log('system', sys)
                      : console.assert(false, sys)
                } else {
                    sys.console = item;
                    (!v)
                      ? console.log('system', sys)
                      : console.assert(false, sys)
                }
            } else {
                console.assert(false, 'ведите правильное значение м должно быть boolean')
            }
        },
        warn: {
            "s/b": 'нет доступных пар'
        },
        matcher: {
            key: {
              "T":  (await task.set(true,'T','8',{},'/matcher')).message.data,
              "W":  (await task.set(true,'W','8',{},'/matcher')).message.data,
            }
        },
        active: []
    }

    function setTask(v,p,c,s,r) {
        return new Promise(async function (resolve, reject) {
            let req = await task.set(v,p,c,s,r);
            (req.success)
              ? (sys.active.push(s),
                resolve({
                    status: req.status,
                    success: req.success,
                    message: req.message,
                    _scriptDir: req._scriptDir
                }))
              : (resolve({
                  status: req.status,
                  success: req.success,
                  message: req.message,
                  _scriptDir: req._scriptDir
              }))
        })
    }
    function empty(obj,type) {
        switch (type) {
            case 'ueu':
                obj['this'].shadowRoot.querySelector('div.fbwu').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fswe').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fbue').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#fbwu').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fswe').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fbue').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fbwu').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fswe').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fbue').innerHTML = `${sys['warn']['s/b']}`
                break
            case 'eue':
                obj['this'].shadowRoot.querySelector('div.fbwe').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fswu').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.fbeu').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#fswu').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fbwe').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fbeu').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#fswu').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fbwe').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#fbeu').innerHTML = `${sys['warn']['s/b']}`
                break
            case 'wuw':
                obj['this'].shadowRoot.querySelector('div.sbew').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sseu').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sbwu').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#sbew').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sseu').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sbwu').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sbew').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#sseu').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#sbwu').innerHTML = `${sys['warn']['s/b']}`
                break
            case 'wew':
                obj['this'].shadowRoot.querySelector('div.sbuw').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.ssue').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sbwe').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('#sbuw').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#ssue').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sbwe').innerHTML = ``
                obj['this'].shadowRoot.querySelector('#sbuw').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#ssue').innerHTML = `${sys['warn']['s/b']}`
                obj['this'].shadowRoot.querySelector('#sbwe').innerHTML = `${sys['warn']['s/b']}`
                break
            default:
                console.assert(false, 'неизвестный тип', type, obj)
                break
        }
    }
    let orders = {
        "sts": {
            "buy(fs)": {
                "amount": "",
                "price":  ""
            },
            "sell(ft)":{
                "amount": "",
                "price":  ""
            },
            "buy(st)":{
                "amount": "",
                "price":  ""
            }
        },
        "tst": {
            "buy(ft)": {
                "amount": "",
                "price":  ""
            },
            "sell(fs)":{
                "amount": "",
                "price":  ""
            },
            "buy(ts)":{
                "amount": "",
                "price":  ""
            }
        },
        "fsf": {
            "buy(sf)": {
                "amount": "",
                "price":  ""
            },
            "sell(st)":{
                "amount": "",
                "price":  ""
            },
            "buy(ft)":{
                "amount": "",
                "price":  ""
            }
        },
        "ftf": {
            "buy(tf)": {
                "amount": "",
                "price":  ""
            },
            "sell(ts)":{
                "amount": "",
                "price":  ""
            },
            "buy(fs)":{
                "amount": "",
                "price":  ""
            }
        }
    }
    let relation = {
        fee: {
            first: [],
            second: [],
            third: [],
        },
        amount: {
            first: [],
            second: [],
            third: [],
        },
        orderbook: {
            first: [],
            second: [],
            third: [],
        },
        orders: {
            "S": orders,
            "T": orders,
            "W": orders
        }
    }
    obj['this'].shadowRoot.querySelector('#left').addEventListener('input',async (e)=>{
        relation.amount['first'][0] =  e.target.value
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#center').addEventListener('input',async (e)=>{
        relation.amount['second'][0] =  e.target.value
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#right').addEventListener('input',async (e)=>{
        relation.amount['third'][0] =  e.target.value
    },{passive:true})
    // let itemDetails = {}
    // for(let item of description['assetId']) {
    //     itemDetails[`${item}`] = await task.set(true,'W','8',item,'/assets/details/{assetId}')
    //     description['details'][`${item}`] = itemDetails[`${item}`]['decimals']
    //     description['name'][`${item}`] = itemDetails[`${item}`]['name']
    // }
    // description['details'][`WAVES`] = 8
    // description['name'][`WAVES`] = `WAVES`
    // if(!sys.validation.output.prod) {
    //     description.T.eth =   (await task.set(true,'T','8',assets.T.eth,'/assets/details/{assetId}')).decimals
    //     description.T.usdt =  (await task.set(true,'T','8',assets.T.usdt,'/assets/details/{assetId}')).decimals
    //     description.T.waves = 8
    // }
    count(obj)
    //wavesEuro
    //euroUsd
    //wavesUsd

    for(let key in assets.head.pairs.W) {
        let priceAsset = {}
        let amountAsset = {}
        switch (key) {
            case 'first/second':
                priceAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].priceAsset}`].name
                amountAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].amountAsset}`].name
                obj['this'].shadowRoot.querySelector('[for="left"]').insertAdjacentHTML('beforeend', `${assets.head.assetId.W[`${assets.W.first}`].name}`)
                obj['this'].shadowRoot.querySelector('#preview-left').innerText =`${amountAsset}/${priceAsset}`
                break
            case 'second/third':
                priceAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].priceAsset}`].name
                amountAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].amountAsset}`].name
                obj['this'].shadowRoot.querySelector('[for="center"]').insertAdjacentHTML('beforeend', `${assets.head.assetId.W[`${assets.W.second}`].name}`)
                obj['this'].shadowRoot.querySelector('#preview-center').innerText =`${amountAsset}/${priceAsset}`
                break
            case 'first/third':
                priceAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].priceAsset}`].name
                amountAsset = assets.head.assetId.W[`${assets.head.pairs.W[key].amountAsset}`].name
                obj['this'].shadowRoot.querySelector('[for="right"]').insertAdjacentHTML('beforeend', `${assets.head.assetId.W[`${assets.W.third}`].name}`)
                obj['this'].shadowRoot.querySelector('#preview-right').innerText =`${amountAsset}/${priceAsset}`
                break
            default:
                break
        }
    }
    let input_id_left = obj['this'].shadowRoot.querySelector('#left').value
    let input_id_center = obj['this'].shadowRoot.querySelector('#center').value
    let input_id_right = obj['this'].shadowRoot.querySelector('#right').value
    function setAssetsAmount(state) {
        if(state) {
            relation.amount['first'][0] = parseFloat((input_id_left))
            relation.amount['second'][0] = parseFloat(input_id_center)
            relation.amount['third'][0] = parseFloat(input_id_right)
        } else {
            relation.amount['first'][0] = sys.navigation.assets.first
            relation.amount['second'][0] = sys.navigation.assets.second
            relation.amount['third'][0] = sys.navigation.assets.third
        }
    }
    (sys.navigation.assets.status)
      ? setAssetsAmount(true)
      : setAssetsAmount(false)

    // relation['decimals'] = description['details']
    // relation['fee'] = {}
    // relation['description'] = []
    // sys.relation = relation
    // let priceAssetDecimals =  {}
    // let amountAssetDecimals = {}
    let timerId = setTimeout(async  function tick() {
        sys['counts']['main'] ++
        // relation['eue'] = undefined
        // relation['ueu'] = undefined
        // relation['wew'] = undefined
        // relation['wuw'] = undefined

        // w = first
        // e = second
        // u = third
        relation['orders']['sts'] = undefined
        relation['orders']['tst'] = undefined
        relation['orders']['fsf'] = undefined
        relation['orders']['ftf'] = undefined
        let orderbook_fs = await dex.orderbook(assets.head.pairs.W['first/second'].amountAsset, assets.head.pairs.W['first/second'].priceAsset)
        let orderbook_ft = await dex.orderbook(assets.head.pairs.W['first/third'].amountAsset, assets.head.pairs.W['first/third'].priceAsset)
        let orderbook_st = await dex.orderbook(assets.head.pairs.W['second/third'].amountAsset, assets.head.pairs.W['second/third'].priceAsset)
        while (!orderbook_fs.success) {
            console.warn('запрос fs не сработал')
            orderbook_fs = await dex.orderbook(assets.head.pairs.W['first/second'].amountAsset, assets.head.pairs.W['first/second'].priceAsset)
        }
        while (!orderbook_ft.success) {
            console.warn('запрос ft не сработал')
            orderbook_ft = await  await dex.orderbook(assets.head.pairs.W['first/third'].amountAsset, assets.head.pairs.W['first/third'].priceAsset)
        }
        while (!orderbook_st.success) {
            console.warn('запрос st не сработал')
            orderbook_st =  await dex.orderbook(assets.head.pairs.W['second/third'].amountAsset, assets.head.pairs.W['second/third'].priceAsset)
        }
        orderbook_fs = orderbook_fs.message
        orderbook_ft = orderbook_ft.message
        orderbook_st = orderbook_st.message
        relation.orderbook.first[0] =  orderbook_fs
        relation.orderbook.second[0] = orderbook_ft
        relation.orderbook.third[0] =  orderbook_st

        // w = first
        // e = second
        // u = third
        for(let type in relation['fee']) {
            if(assets.W[type] !== 'WAVES') {
                let amountAsset = relation.orderbook[type][0].pair.amountAsset
                let priceAsset = relation.orderbook[type][0].pair.priceAsset
                let amountDecimals = assets.head.assetId.W[`${amountAsset}`].decimals
                let priceDecimals = assets.head.assetId.W[`${priceAsset}`].decimals
                relation['fee'][type][0] = (1/dex.denormalize(relation.orderbook[type][0].asks[0]['price'],amountDecimals,priceDecimals))*0.003
            } else {
                relation['fee'][type][0] = 0.003
            }
        }
        // relation['fee']['euro'] = ( 1/dex.denormalize(wavesEuro.asks[0]['price'],priceAssetDecimalsEuro,  amountAssetDecimalsEuro))*0.003
        // relation['fee']['usd'] = ( 1/dex.denormalize(wavesUsd.asks[0]['price'],priceAssetDecimalsUsd,  amountAssetDecimalsUsd))*0.003
// new item 1
        assets.relation = relation
        relation = await dex.buy_fs(true, {
            orders: relation.orders,
            orderbook: relation.orderbook.first[0],
            amount: {
                f:undefined,
                s:relation.amount.first[0]
            },
            fee: {
              f:relation.fee.first[0],
              s:relation.fee.second[0]
            },
            amountAsset: assets.head.pairs.W['first/second']['amountAsset'],
            priceAsset: assets.head.pairs.W['first/second']['priceAsset'],
            view: obj['this'].shadowRoot.querySelector('#fb_fs')
        },'green',assets , 'fs');
        console.assert(false, relation)
//## item 1
        relation['description']['ueu'] = []
        relation['description']['ueu'].push(relation['u'])
        relation = await dex.buy(wavesUsd, relation['u'], relation, 'wavesUsd');
        ((relation['buy(wavesUsd)'] >= sys['threshold']['amount']))
          ? (relation['description']['ueu'].push(relation['buy(wavesUsd)']),
            sys['validation']['disabled']['views'][0] = true,
            obj['this'].shadowRoot.querySelector('#fbwu').innerHTML = `${description['name'][`${wavesUsd.pair.priceAsset}`]}=>${description['name'][`${wavesUsd.pair.amountAsset}`]}[(${relation['u']}*)${relation['buy(wavesUsd)']}]`)
          : (delete relation['description']['ueu'],
            sys['validation']['disabled']['views'][0] = false,
            empty(obj, 'ueu'))
        if(relation['description']['ueu'] !== undefined) {
            console.assert(false)
          relation = await dex.sell(wavesEuro, relation['buy(wavesUsd)'], relation, 'wavesEuro');
            console.assert(false, `${description['name'][`${wavesEuro.pair.priceAsset}`]}=>${description['name'][`${wavesEuro.pair.amountAsset}`]}[(${relation['buy(wavesUsd)']}*)${relation['sell(wavesEuro)']}]` )
          ((relation['sell(wavesEuro)'] >= sys['threshold']['amount']))
            ? (relation['description']['ueu'].push(relation['sell(wavesEuro)']),
              sys['validation']['disabled']['views'][0] = true,
              obj['this'].shadowRoot.querySelector('#fswe').innerHTML = `${description['name'][`${wavesEuro.pair.priceAsset}`]}=>${description['name'][`${wavesEuro.pair.amountAsset}`]}[(${relation['buy(wavesUsd)']}*)${relation['sell(wavesEuro)']}]`)
            : (delete relation['description']['ueu'],
              sys['validation']['disabled']['views'][0] = false,
              empty(obj, 'ueu'))
        }
        if(relation['description']['ueu'] !== undefined) {
            relation = await dex.buy(euroUsd, relation['sell(wavesEuro)'], relation, 'usdEuro');
            ((relation['buy(usdEuro)'] >= sys['threshold']['amount']))
              ? (relation['description']['ueu'].push(relation['buy(usdEuro)']),
                sys['validation']['disabled']['views'][0] = true,
                obj['this'].shadowRoot.querySelector('#fbue').innerHTML = `${description['name'][`${euroUsd.pair.amountAsset}`]}=>${description['name'][`${euroUsd.pair.priceAsset}`]}[(${relation['sell(wavesEuro)']}*)${relation['buy(usdEuro)']}]`)
              : (delete relation['description']['ueu'],
                sys['validation']['disabled']['views'][0] = false,
                empty(obj, 'ueu'))
        }
        relation['transactions'] = []
        if(relation['description']['ueu'] !== undefined) {
            let timestamp =  Date.now();
            relation['transactions']['ueu'] = {
                head: {
                    "name": 'ueu',
                    'success': [false, false, false],
                    "matcherPublicKey": sys.matcher.key.T,
                    'date': {
                        'timestamp': timestamp,
                        'GMT': new Date(timestamp).toString()
                    }
                },
                description: relation['ueu'],
                decimals: (!sys.validation.output.prod)?description.T:'надо подставить значения',
                assets: assets
            }
        }
        relation['buy(wavesUsd)'] = {}
        relation['sell(wavesEuro)'] ={}
        relation['buy(usdEuro)'] = {}

//## item 2
        relation['description']['eue'] = []
        relation['description']['eue'].push(relation['e'])
        relation = await dex.buy(wavesEuro, relation['e'], relation, 'wavesEuro');
        ((relation['buy(wavesEuro)'] >= sys['threshold']['amount']))
          ? (relation['description']['eue'].push(relation['buy(wavesEuro)']),
            sys['validation']['disabled']['views'][1] = true,
            obj['this'].shadowRoot.querySelector('#fbwe').innerHTML = `${description['name'][`${wavesEuro.pair.amountAsset}`]}=>${description['name'][`${wavesEuro.pair.priceAsset}`]}[(${relation['e']}*)${relation['buy(wavesEuro)']}]`)
          : (delete relation['description']['eue'],
            sys['validation']['disabled']['views'][1] = false,
            empty(obj,'eue'))
        if(relation['description']['eue'] !== undefined) {
            relation = await dex.sell(wavesUsd,relation['buy(wavesEuro)'], relation, 'wavesUsd');
            ((relation['sell(wavesUsd)'] >= sys['threshold']['amount']))
              ? (relation['description']['eue'].push(relation['sell(wavesUsd)']),
                sys['validation']['disabled']['views'][1] = true,
                obj['this'].shadowRoot.querySelector('#fswu').innerHTML = `${description['name'][`${wavesUsd.pair.amountAsset}`]}=>${description['name'][`${wavesUsd.pair.priceAsset}`]}[(${relation['buy(wavesEuro)']}*)${relation['sell(wavesUsd)']}]`)
              : (delete relation['description']['eue'],
                sys['validation']['disabled']['views'][1] = false,
                empty(obj,'eue'))
        }
        if(relation['description']['eue'] !== undefined) {
            relation = await dex.buy(euroUsd,relation['sell(wavesUsd)'], relation, 'euroUsd');
            ((relation['buy(euroUsd)'] >= sys['threshold']['amount']))
              ? (relation['description']['eue'].push(relation['buy(euroUsd)']),
                sys['validation']['disabled']['views'][1] = true,
                obj['this'].shadowRoot.querySelector('#fbeu').innerHTML = `${description['name'][`${euroUsd.pair.priceAsset}`]}=>${description['name'][`${euroUsd.pair.amountAsset}`]}[(${relation['sell(wavesUsd)']}*)${relation['buy(euroUsd)']}]`)
              : (delete relation['description']['eue'],
                sys['validation']['disabled']['views'][1] = false,
                empty(obj, 'eue'))
        }
        if(relation['description']['eue'] !== undefined) {
            let timestamp =  Date.now();
            relation['transactions']['eue'] = {
                head: {
                    'name': 'eue',
                    "matcherPublicKey": sys.matcher.key.T,
                    'success': [false, false, false],
                    'date': {
                        'timestamp': timestamp,
                        'GMT': new Date(timestamp).toString()
                    }
                },
                description: relation['eue'],
                decimals: (!sys.validation.output.prod)?description.T:'надо подставить значения',
                assets: assets
            }
        }
        relation['buy(wavesEuro)']  = {}
        relation['sell(wavesUsd)']  = {}
        relation['buy(euroUsd)']    = {}
//## item 3
        relation['description']['wuw'] = []
        relation['description']['wuw'].push(relation['w'])
        relation = await dex.buy(wavesEuro, relation['w'], relation, 'euroWaves');
            ((relation['buy(euroWaves)'] >= sys['threshold']['amount']))
            ? (relation['description']['wuw'].push(relation['buy(euroWaves)']),
              sys['validation']['disabled']['views'][2] = true,
              obj['this'].shadowRoot.querySelector('#sbew').innerHTML = `${description['name'][`${wavesEuro.pair.priceAsset}`]}=>${description['name'][`${wavesEuro.pair.amountAsset}`]}[(${relation['w']}*)${relation['buy(euroWaves)']}]`)
            : (delete relation['description']['wuw'], sys['validation']['disabled']['views'][2] = false, empty(obj,'wuw'))
        if(relation['description']['wuw'] !== undefined) {
            relation = await dex.sell(euroUsd,relation['buy(euroWaves)'], relation, 'euroUsd');
            ((relation['sell(euroUsd)'] >= sys['threshold']['amount']))
              ? (relation['description']['wuw'].push(relation['sell(euroUsd)']),
                sys['validation']['disabled']['views'][2] = true,
                obj['this'].shadowRoot.querySelector('#sseu').innerHTML = `${description['name'][`${euroUsd.pair.amountAsset}`]}=>${description['name'][`${euroUsd.pair.priceAsset}`]}[(${relation['buy(euroWaves)']}*)${relation['sell(euroUsd)']}]`)
              : (delete relation['description']['wuw'], sys['validation']['disabled']['views'][2] = false, empty(obj,'wuw'))
        }
        if(relation['description']['wuw'] !== undefined) {
            relation = await dex.buy(wavesUsd,relation['sell(euroUsd)'], relation, 'wavesUsd');
            ((relation['buy(wavesUsd)'] >= sys['threshold']['amount']))
              ? (relation['description']['wuw'].push(relation['buy(wavesUsd)']),
                sys['validation']['disabled']['views'][2] = true,
                obj['this'].shadowRoot.querySelector('#sbwu').innerHTML = `${description['name'][`${wavesUsd.pair.priceAsset}`]}=>${description['name'][`${wavesUsd.pair.amountAsset}`]}[(${relation['sell(euroUsd)']}*)${relation['buy(wavesUsd)']}]`)
              : (delete relation['description']['wuw'], sys['validation']['disabled']['views'][2] = false, empty(obj,'wuw'))
        }
        if(relation['description']['wuw'] !== undefined) {
           let timestamp =  Date.now();
            relation['transactions']['wuw'] = {
                head: {
                    'name': 'wuw',
                    "matcherPublicKey": sys.matcher.key.T,
                    'success': [false, false, false],
                    'date': {
                        'timestamp': timestamp,
                        'GMT': new Date(timestamp).toString()
                    }
                },
                description: relation['wuw'],
                decimals: (!sys.validation.output.prod)?description.T:'надо подставить значения',
                assets: assets
            }
        }
        relation['buy(euroWaves)'] = {}
        relation['sell(euroUsd)'] ={}
        relation['buy(wavesUsd)'] = {}
//## item 4
        relation['description']['wew'] = []
        relation['description']['wew'].push(relation['w'])
        relation = await dex.buy(wavesUsd, relation['w'], relation, 'usdWaves');
        ((relation['buy(usdWaves)'] >= sys['threshold']['amount']))
          ? (relation['description']['wew'].push(relation['buy(usdWaves)']),
            sys['validation']['disabled']['views'][3] = true,
            obj['this'].shadowRoot.querySelector('#sbuw').innerHTML = `${description['name'][`${wavesUsd.pair.amountAsset}`]}=>${description['name'][`${wavesUsd.pair.priceAsset}`]}[(${relation['w']}*)${relation['buy(usdWaves)']}]`)
          : (delete relation['description']['wew'],
            sys['validation']['disabled']['views'][3] = false,
            empty(obj, 'wew'));

        if(relation['description']['wew'] !== undefined) {
            relation = await dex.sell(euroUsd,relation['buy(usdWaves)'], relation, 'usdEuro');
            ((relation['sell(usdEuro)'] >= sys['threshold']['amount']))
              ? (relation['description']['wew'].push(relation['sell(usdEuro)']),
                sys['validation']['disabled']['views'][3] = true,
                obj['this'].shadowRoot.querySelector('#ssue').innerHTML = `${description['name'][`${euroUsd.pair.priceAsset}`]}=>${description['name'][`${euroUsd.pair.amountAsset}`]}[(${relation['buy(usdWaves)']}*)${relation['sell(usdEuro)']}]`)
              : (delete relation['description']['wew'],
                sys['validation']['disabled']['views'][3] = false,
                empty(obj, 'wew'));
        }
        if(relation['description']['wew'] !== undefined) {
            relation = await dex.buy(wavesEuro,relation['sell(usdEuro)'], relation, 'wavesEuro');
            ((relation['buy(wavesEuro)'] >= sys['threshold']['amount']))
              ? (relation['description']['wew'].push(relation['buy(wavesEuro)']),
                sys['validation']['disabled']['views'][3] = true,
                obj['this'].shadowRoot.querySelector('#sbwe').innerHTML = `${description['name'][`${wavesEuro.pair.amountAsset}`]}=>${description['name'][`${wavesEuro.pair.priceAsset}`]}[(${relation['sell(usdEuro)']}*)${relation['buy(wavesEuro)']}]`)
              : (delete relation['description']['wew'],
                sys['validation']['disabled']['views'][3] = false,
                empty(obj, 'wew'));
        }
        if(relation['description']['wew'] !== undefined) {
            let timestamp =  Date.now();
            relation['transactions']['wew'] = {
                head: {
                    "name": 'wew',
                    "matcherPublicKey": sys.matcher.key.T,
                    "success": [false, false, false],
                    "date": {
                        "timestamp": timestamp,
                        "GMT": new Date(timestamp).toString()
                    }
                },
                description: relation['wew'],
                decimals: (!sys.validation.output.prod)?description.T:'надо подставить значения',
                assets: assets
            }
        }
        relation['buy(usdWaves)']   = {}
        relation['sell(usdEuro)']   = {}
        relation['buy(wavesEuro)']  = {}
//## get order
        let timestamp = config['timestamp']()
        let signature = await task.set(true,'T','8',{
            seed: config['accountsStore']['accountGroups']['T']['clients'][3]['seed'],
            publicKey: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
            timestamp: timestamp.now
        },'/assets/signature/{assetId}');
        let orders = await  task.set(true, {
            timestamp:timestamp.now,
            signature:signature,
            type:'T'
        },'7',{
            property:'получаем ордера',
            publicKey:config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
            relation:'T'
        },'/matcher/orderbook/{publicKey}');
        sys.orders = orders
        if(orders.success) {
            for(let i =0; i < orders.message.length; i++) {
            }
            console.log('active orders:', orders.message)
        } else {
            console.warn(orders.message)
        }
        sys.validation.set.order = true
        sys.validation.delete.order = false
        if(sys.validation.set.order) {
            // let timestamp = config['timestamp']();
            // let signature = await task.set(true,'T','8',{
            //     seed: config['accountsStore']['accountGroups']['T']['clients'][3]['seed'],
            //     publicKey: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
            //     timestamp:  timestamp.now
            // },'/assets/signature/{assetId}');
            console.assert(false, sys.relation.transactions)
          let order = await setTask(true, 'T', 'red', sys.relation.transactions.wuw, '/matcher/orderbook');
        }

        if(sys.validation.delete.order) {
            if(!isEmpty(orders.message)) {
                let timestamp = config['timestamp']()
                let signature = await task.set(true,'T','8',{
                    seed: config['accountsStore']['accountGroups']['T']['clients'][3]['seed'],
                    publicKey: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
                    timestamp: timestamp.now
                },'/assets/signature/{assetId}');
                let object = JSON.stringify({
                    sender: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
                    timestamp: timestamp.now,
                    signature: signature,
                    orderId: null
                })
               let cancelOrder = await setTask(true, 'T','7',object,'/matcher/orderbook/cancel')
            }
        }
    let views = {
            "0": () => {
                if(relation['description']['ueu'][0] - relation['description']['ueu'][3] < 0){
                    setTask(true, 'T', 'red', sys.relation.transactions.ueu, '/matcher/orderbook')
                    obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['ueu'], null, 2)}</p>`)
                    obj['this'].shadowRoot.querySelector('div.fbwu').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fswe').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fbue').style.background ='#f476b673'
                }else{
                    obj['this'].shadowRoot.querySelector('div.fbwu').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fswe').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fbue').style.background ='#7694f473'
                }
            },
            "1": () => {
                if(relation['description']['eue'][0] - relation['description']['eue'][3] < 0){
                    setTask(true, 'T', 'red', sys.relation.transactions.eue, '/matcher/orderbook')
                    obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['eue'], null, 2)}</p>`)
                    obj['this'].shadowRoot.querySelector('div.fbwe').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fswu').style.background ='#f476b673'
                    obj['this'].shadowRoot.querySelector('div.fbeu').style.background ='#f476b673'
                }else{
                    obj['this'].shadowRoot.querySelector('div.fbwe').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fswu').style.background ='#7694f473'
                    obj['this'].shadowRoot.querySelector('div.fbeu').style.background ='#7694f473'
                }
            },
        "2": () => {
            if(relation['description']['wuw'][0] - relation['description']['wuw'][3] < 0){
                setTask(true, 'T', 'red', sys.relation.transactions.wuw, '/matcher/orderbook')
                obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wuw'], null, 2)}</p>`)
                obj['this'].shadowRoot.querySelector('div.sbew').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.sseu').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.sbwu').style.background ='#f476b673'
            }else{
                obj['this'].shadowRoot.querySelector('div.sbew').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sseu').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sbwu').style.background ='#7694f473'
            }
        },
        "3": () => {
            if(relation['description']['wew'][0] - relation['description']['wew'][3] < 0){
                setTask(true, 'T', 'red', sys.relation.transactions.wew, '/matcher/orderbook')
                obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['description']['wew'], null, 2)}</p>`)
                obj['this'].shadowRoot.querySelector('div.sbuw').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.ssue').style.background ='#f476b673'
                obj['this'].shadowRoot.querySelector('div.sbwe').style.background ='#f476b673'
            }else{
                obj['this'].shadowRoot.querySelector('div.sbuw').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.ssue').style.background ='#7694f473'
                obj['this'].shadowRoot.querySelector('div.sbwe').style.background ='#7694f473'
            }
        }
    };
    (sys['validation']['disabled']['views'][0])
      ? (views[0]())
      : '';
    (sys['validation']['disabled']['views'][1])
      ? (views[1]())
      : '';
    (sys['validation']['disabled']['views'][2])
      ? (views[2]())
      : '';
    (sys['validation']['disabled']['views'][3])
      ? (views[3]())
      : '';
        // sys.info(false)
        let update = async (priceAssetDecimals, amountAssetDecimals, description, wavesEuro,wavesUsd, euroUsd, obj ) => {
            for(let i=0; i < 10;i++) {
                if(wavesEuro['asks'][i] !== undefined) {
                    priceAssetDecimals =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
                    amountAssetDecimals = description['details'][`${wavesEuro['pair']['amountAsset']}`]
                    obj['this'].shadowRoot.querySelector('#wavesEuroAsk').children[i].innerText = `${ waves.denormalize(wavesEuro['asks'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
                }
                if(wavesEuro['bids'][i] !== undefined) {
                    priceAssetDecimals =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
                    amountAssetDecimals = description['details'][`${wavesEuro['pair']['amountAsset']}`]
                    obj['this'].shadowRoot.querySelector('#wavesEuroBid').children[i].innerText = `${ waves.denormalize(wavesEuro['bids'][i]['price'],priceAssetDecimals, amountAssetDecimals ) }`
                }
                if(wavesUsd['asks'][i] !== undefined) {
                    priceAssetDecimals =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
                    amountAssetDecimals = description['details'][`${wavesUsd['pair']['amountAsset']}`]
                    obj['this'].shadowRoot.querySelector('#wavesUsdAsk').children[i].innerText = `${ waves.denormalize(wavesUsd['asks'][i]['price'],priceAssetDecimals,amountAssetDecimals ) }`
                }
                if(wavesUsd['bids'][i] !== undefined) {
                    priceAssetDecimals =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
                    amountAssetDecimals = description['details'][`${wavesUsd['pair']['amountAsset']}`]
                    obj['this'].shadowRoot.querySelector('#wavesUsdBid').children[i].innerText =  `${ waves.denormalize(wavesUsd['bids'][i]['price'],priceAssetDecimals,amountAssetDecimals ) }`
                }
                if(euroUsd['asks'][i] !== undefined) {
                    priceAssetDecimals =  description['details'][`${euroUsd['pair']['priceAsset']}`]
                    amountAssetDecimals = description['details'][`${euroUsd['pair']['amountAsset']}`]
                    obj['this'].shadowRoot.querySelector('#euroUsdAsk').children[i].innerText =  `${ waves.denormalize(euroUsd['asks'][i]['price'],priceAssetDecimals, amountAssetDecimals) }`
                }
                if(euroUsd['bids'][i] !== undefined) {
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
            return true
        }
        // console.log('active order: ', sys.active)
        update(priceAssetDecimals, amountAssetDecimals, description, wavesEuro,wavesUsd, euroUsd, obj )
        timerId = setTimeout(tick, 3000);
    }, 3000);
}