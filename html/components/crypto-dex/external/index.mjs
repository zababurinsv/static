import iframe from '/static/html/components/component_modules/iframe/iframe.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
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
export default async (v,p,c,obj,r) => {
    let dex = (await import('/static/html/components/component_modules/dex/index.mjs'))['default']
    let relation = {}
    let waves = new Waves()
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
                "e": 10,
                "u": 14,
                "w": 10
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
        active: []
    }

    function empty(obj,type){
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

        let timer = setTimeout((event) => {
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
        relation['e'] =  e.target.value / 100
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#center').addEventListener('input',async (e)=>{
        relation['u'] =  e.target.value
    },{passive:true})
    obj['this'].shadowRoot.querySelector('#right').addEventListener('input',async (e)=>{
        relation['w'] =  e.target.value
    },{passive:true})
    let assets = {
        W: {
            waves:'WAVES',
            eth:'474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu',
            usdt:'34N9YcEETLWn93qYQ64EsP1x89tSruJU44RrEMSXXEPJ'
        },
        T: {
            waves:  'WAVES',
            eth:    'BrmjyAWT5jjr3Wpsiyivyvg5vDuzoX2s93WgiexXetB3',
            usdt:   'DMJeM9XJTEnhBmYrLBdVKkYx6Geb37e9pgyEc26R1JKZ'
        }
    }
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
        assetId:[assets.W.eth,assets.W.usdt]
    }
    sys.assets = assets
    let itemDetails = {}
    for(let item of description['assetId']){
        itemDetails[`${item}`] = await task.set(true,'W','8',item,'/assets/details/{assetId}')
        description['details'][`${item}`] = itemDetails[`${item}`]['decimals']
        description['name'][`${item}`] = itemDetails[`${item}`]['name']
    }
    description['details'][`WAVES`] = 8
    description['name'][`WAVES`] = `WAVES`
    count(obj)
    for(let key in description) {
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
    let input_id_left = obj['this'].shadowRoot.querySelector('#left').value
    let input_id_center = obj['this'].shadowRoot.querySelector('#center').value
    let input_id_right = obj['this'].shadowRoot.querySelector('#right').value
    function setAssetsAmount(state) {
        if(state) {
            relation['w'] = parseFloat(input_id_right)
            relation['u'] = parseFloat(input_id_center)
            relation['e'] = parseFloat((input_id_left / 100))
        } else {
            relation['w'] = sys.navigation.assets.w
            relation['u'] = sys.navigation.assets.u
            relation['e'] = sys.navigation.assets.e / 100
        }
    }
    (sys.navigation.assets.status)
      ? setAssetsAmount(true)
      : setAssetsAmount(false)

    relation['decimals'] = description['details']
    relation['fee'] = {}
    relation['description'] = []
    sys.relation = relation
    let priceAssetDecimals =  {}
    let amountAssetDecimals = {}
    let timerId = setTimeout(async  function tick() {
        sys['counts']['main'] ++
        relation['eue'] = undefined
        relation['ueu'] = undefined
        relation['wew'] = undefined
        relation['wuw'] = undefined

        let wavesEuro = await dex.wavesEuro({net:'W',pair:description['wavesEuro']}, obj)
        let wavesUsd = await  dex.wavesUsd({net:'W', pair:description['wavesUsd']}, obj)
        let euroUsd =  await  dex.eurUsd({net:'W',pair:description['euroUsd']}, obj)
        while (!wavesEuro.success) {
            console.warn('запрос не сработал 1')
            wavesEuro = await dex.wavesEuro({net:'W',pair:description['wavesEuro']}, obj)
        }
        while (!wavesUsd.success) {
            console.warn('запрос не сработал 2')
            wavesUsd = await  dex.wavesUsd({net:'W', pair:description['wavesUsd']}, obj)
        }
        while (!euroUsd.success) {
            console.warn('запрос не сработал 3')
            euroUsd = await  dex.eurUsd({net:'W',pair:description['euroUsd']}, obj)
        }
        wavesEuro = wavesEuro.message
        wavesUsd = wavesUsd.message
        euroUsd= euroUsd.message

        let priceAssetDecimalsEuro =  description['details'][`${wavesEuro['pair']['priceAsset']}`]
        let amountAssetDecimalsEuro = description['details'][`${wavesEuro['pair']['amountAsset']}`]
        let priceAssetDecimalsUsd =  description['details'][`${wavesUsd['pair']['priceAsset']}`]
        let amountAssetDecimalsUsd = description['details'][`${wavesUsd['pair']['amountAsset']}`]

        relation['fee']['euro'] = ( 1/dex.denormalize(wavesEuro.asks[0]['price'],priceAssetDecimalsEuro,  amountAssetDecimalsEuro))*0.003
        relation['fee']['usd'] = ( 1/dex.denormalize(wavesUsd.asks[0]['price'],priceAssetDecimalsUsd,  amountAssetDecimalsUsd))*0.003
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
          relation = await dex.sell(wavesEuro, relation['buy(wavesUsd)'], relation, 'wavesEuro');
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
                    'name': 'ueu',
                    'success': [false, false, false],
                    'date': {
                        'timestamp': timestamp,
                        'GMT': new Date(timestamp).toString()
                    },
                    'roadmap': relation['ueu']
                },
                description: relation['description']['ueu'],
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
                    'success': [false, false, false],
                    'date': {
                        'timestamp': timestamp,
                        'GMT': new Date(timestamp).toString()
                    },
                    'roadmap': relation['eue']
                },
                description: relation['description']['eue'],
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
                    'success': [false, false, false],
                    'date': {
                        'timestamp': timestamp,
                        'GMT': new Date(timestamp).toString()
                    },
                    'roadmap': relation['wuw']
                },
                description: relation['description']['wuw'],
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
                    'name': 'wew',
                    'success': [false, false, false],
                    'date': {
                        'timestamp': timestamp,
                        'GMT': new Date(timestamp).toString()
                    },
                    'roadmap': relation['wew']
                },
                description: relation['description']['wew'],
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
            timestamp: timestamp
        },'/assets/signature/{assetId}');
        let orders = await  task.set(true, {
            timestamp:timestamp,
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
        sys.validation.delete.order = true
        if(sys.validation.set.order) {
            // console.assert(false, sys.relation.transactions)
            // setTask(true, 'T', 'red', sys.relation.transactions.ueu, '/matcher/orderbook/set')
        }

        // console.log('~~~~~~~~>>>', sys.orders)

        if(sys.validation.delete.order) {
            if(!isEmpty(orders.message)) {
                let object = JSON.stringify({
                    sender: config['accountsStore']['accountGroups']['T']['clients'][3]['publicKey'],
                    timestamp: timestamp,
                    signature: signature,
                    orderId: null
                })
                setTask(true, 'T','7',object,'/matcher/orderbook/cancel')
            }
        }

    function setTask(v,p,c,s,r) {
        return new Promise(async function (resolve, reject) {
            let req = await task.set(v,p,c,s,r);
            (req.success)
              ? (sys.active.push(s),
                resolve({
                    status: 'ok',
                    success: true,
                    message: req.message,
                    _scriptDir: import.meta.url
                }))
              : (resolve({
                  status: 'not ok',
                  success: false,
                  message: req.message,
                  _scriptDir: import.meta.url
              }))
        })
    }

    let views = {
            "0": () => {
                if(relation['description']['ueu'][0] - relation['description']['ueu'][3] < 0){
                    setTask(true, 'T', 'red', sys.relation.transactions.ueu, '/matcher/orderbook/set')
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
                    setTask(true, 'T', 'red', sys.relation.transactions.eue, '/matcher/orderbook/set')
                    obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['transactions']['eue'], null, 2)}</p>`)
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
                setTask(true, 'T', 'red', sys.relation.transactions.wuw, '/matcher/orderbook/set')
                obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['transactions']['wuw'], null, 2)}</p>`)
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
                setTask(true, 'T', 'red', sys.relation.transactions.wew, '/matcher/orderbook/set')
                obj['this'].shadowRoot.querySelector('#total').insertAdjacentHTML('beforeend',`<p>${JSON.stringify(relation['transactions']['wew'], null, 2)}</p>`)
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