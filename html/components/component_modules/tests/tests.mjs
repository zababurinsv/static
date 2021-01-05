let object = {}
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import { tests } from '/static/html/components/component_modules/loader/loader.mjs'
export default ( obj ={ _:'default' } ) =>{
    return new Promise(async (resolve, reject) =>{

        let sw = {}
        if(location.hostname === 'localhost'){
            sw = location.host
        }else{
            sw =  location.pathname
        }
        console.log('hostname', sw)
        switch (sw) {
            case 'localhost:1111':
                await tests('/tests/core.mjs','tests')
                break
            case '/contract-deals/':
                await tests('/tests/core.mjs','tests')
                break
            case 'localhost:6040':
                await tests('/tests/game/monopoly.mjs','tests')
                break
            case 'localhost:4999':
                await tests('/tests/wallet.mjs','tests')
                break
            case 'localhost:7030':
                await tests('/tests/wallet.mjs','tests')
                break
            case 'localhost:8020':
                await tests('/tests/faucet.mjs','tests')
                break
            case 'localhost:4060':
                await tests('/tests/game.mjs','tests')
                break
            default:
                let pathname = location.pathname.replace(/\//gi,'')
                await tests(isEmpty(pathname)
                  ?'/tests/index.mjs'
                  :`${location.origin}/${pathname}/test.${pathname}.mjs`,'tests')
                break
        }
        let test = document.createElement('script');
        let script = `(async (document)=>{ mocha.run() })(document)`
        test.innerHTML = script
        document.body.appendChild(test);

        resolve(object)
    })
}