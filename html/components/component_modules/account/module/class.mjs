import colorlog from '/static/html/components/component_modules/colorLog/colorLog.mjs'
import Provider from '/static/html/components/component_modules/waves-provider/waves-provider.mjs'
import Signer from '/static/html/components/component_modules/bundle/waves/waves.mjs'
let signer = Signer['default']
let Class = class Account {
    constructor() {
        this.create = this.create.bind(this)
        this.open = this.open.bind(this)
        this.saveAs = this.saveAs.bind(this)
    }
    create(name, password, chainId){
        return new Promise( async (resolve, reject) => {
            let provider = await Provider()
            let waves = {}
            let verify = false
            if(chainId === 'w'){
                waves = new signer['Signer']();
                verify = true
            }else if(chainId === 't'){
                waves = new signer['Signer']({NODE_URL: 'https://pool.testnet.wavesnodes.com'});
                verify = true
            }else{
                console.assert(false, 'укажите сеть t -тестнет или w - майннет')
            }
            if(verify){
                let wallet = {}
                wallet['type'] = chainId
                wallet['private'] = {}
                wallet['public'] = {}
                wallet['date'] = {}
                wallet['date']['timestap'] = Date.now().toString()
                wallet['date']['GMT'] = (new Date(parseInt(wallet['date']['timestap'],10))).toString()
                wallet['private']['seed'] =  signer.libs.crypto.randomSeed(25)
                wallet['private']['seedBinary'] = signer.libs.crypto.seedWithNonce(wallet['private']['seed'] , parseInt(wallet['date']['timestap'] - 20,10))
                if(chainId === 'w'){
                    wallet['private']['privateKey'] = signer.libs.crypto.privateKey(wallet['private']['seed'])
                    wallet['public']['key'] = signer.libs.crypto.publicKey(wallet['private']['seed'])
                    wallet['public']['address'] = signer.libs.crypto.address(wallet['private']['seed'])
                }else{
                    wallet['private']['privateKey'] = signer.libs.crypto.privateKey(wallet['private']['seed'] , signer.libs.crypto.TEST_NET_CHAIN_ID)
                    wallet['public']['key'] = signer.libs.crypto.publicKey(wallet['private']['seed'] , signer.libs.crypto.TEST_NET_CHAIN_ID)
                    wallet['public']['address'] = signer.libs.crypto.address(wallet['private']['seed'] , signer.libs.crypto.TEST_NET_CHAIN_ID)
    
                }
                waves.setProvider(provider.ProviderSeed(wallet['private']['seed']));
                let outWallet =  signer.libs.crypto.encryptSeed(JSON.stringify(wallet), password)
                let blob = new Blob([`${outWallet}`],{ type: "text/plain;charset=utf-8" });
                await this.saveAs(blob, `${name}.boc`)
                resolve(wallet)
            }else{
                resolve(false)
            }
        })
    }
    open(wallet, password){
        return new Promise( async (resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = function(event) {
                resolve(JSON.parse(signer.libs.crypto.decryptSeed(event.target.result, password)))
            }
            fileReader.readAsText(wallet);
        })
    }
    saveAs(blob, fileName) {
        return new Promise( async (resolve, reject) => {
    
            let url = window.URL.createObjectURL(blob);
            let anchorElem = document.createElement("a");
            anchorElem.style = "display: none";
            anchorElem.href = url;
            anchorElem.download = fileName;
    
            document.body.appendChild(anchorElem);
            anchorElem.click();
    
            document.body.removeChild(anchorElem);
    
            setTimeout(function() {
                window.URL.revokeObjectURL(url);
                resolve(true)
            }, 1000);
        })
    }
    get self() {
        return Signer
    }
}


export default Class