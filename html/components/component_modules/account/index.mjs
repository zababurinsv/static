import Provider from '/static/html/components/component_modules/waves-provider/index.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
let provider = new Provider()
let system = {
    net: 'T'
}
export default class Account {
    constructor() {
        this.create = this.create.bind(this)
        this.open = this.open.bind(this)
        this.saveAs = this.saveAs.bind(this)
    }
    create(name, password, chainId) {
        return new Promise( async (resolve, reject) => {
            let verify = false
            let signer = false
            if(chainId === 'w'){
                verify = true
            }else if(chainId === 't') {
                signer = new waves['signer']({
                    NODE_URL: config[`${system.net}`][0]
                });
                verify = true
            }else {
                console.assert(false, 'укажите сеть t -тестнет или w - майннет')
            }
            if(verify) {
                let wallet = {}
                wallet['type'] = chainId
                wallet['private'] = {}
                wallet['public'] = {}
                wallet['date'] = {}
                wallet['date']['timestap'] = Date.now().toString()
                wallet['date']['GMT'] = (new Date(parseInt(wallet['date']['timestap'],10))).toString()
                wallet['private']['seed'] =  waves.libs.crypto.randomSeed(25)
                wallet['private']['seedBinary'] = waves.libs.crypto.seedWithNonce(wallet['private']['seed'] , parseInt(wallet['date']['timestap'] - 20,10))
                console.assert(false, {
                    chainId: chainId,
                    password:password,
                    name: name,
                    wallet: wallet,
                    TEST_NET: waves.libs.crypto.TEST_NET_CHAIN_ID
                })
                if(chainId === 'w'){
                    wallet['private']['privateKey'] = waves.libs.crypto.privateKey(wallet['private']['seed'])
                    wallet['public']['key'] = waves.libs.crypto.publicKey(wallet['private']['seed'])
                    wallet['public']['address'] = waves.libs.crypto.address(wallet['private']['seed'])
                }else{
                    wallet['private']['privateKey'] = waves.libs.crypto.privateKey(wallet['private']['seed'] , waves.libs.crypto.TEST_NET_CHAIN_ID)
                    wallet['public']['key'] = waves.libs.crypto.publicKey(wallet['private']['seed'] , waves.libs.crypto.TEST_NET_CHAIN_ID)
                    wallet['public']['address'] = waves.libs.crypto.address(wallet['private']['seed'] , waves.libs.crypto.TEST_NET_CHAIN_ID)
    
                }
                signer.setProvider(provider.ProviderSeed(wallet['private']['seed']));
                // let outWallet =  JSON.stringify(wallet)
                console.assert(false, password)
                let outWallet =  waves.libs.crypto.encryptSeed(JSON.stringify(wallet), password)
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
                resolve(JSON.parse(waves.libs.crypto.decryptSeed(event.target.result, password)))
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
        return waves.signer
    }
}