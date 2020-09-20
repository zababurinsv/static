let object = {}
import { tests } from '/static/html/components/component_modules/loader/loader.mjs'
export default ( obj ={ _:'default' } ) =>{
    return new Promise(async (resolve, reject) =>{
        switch (location.host) {
            case 'localhost:6040':
                await tests('/tests/monopoly.mjs','tests')
                break
            case 'zababurinsv.github.io':
                await tests('/tests/monopoly.mjs','tests')
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
            default:
                // await tests('/tests/wallet.mjs','tests')
                console.warn('неизвестный источник', location)
                break
        }
        let test = document.createElement('script');
        let script = `(async (document)=>{ mocha.run() })(document)`
        test.innerHTML = script
        document.body.appendChild(test);

        resolve(object)
    })
}