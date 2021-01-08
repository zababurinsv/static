import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
// import {signer} from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
let system = {
    net: {
        test:'T',
        main:'W',
        stage:'S',
    }
}
export default (async ()=>{
    console.log('# Actions for waves');
    task.get(true, 'await', '5', '','/waves/bank', async (object)=>{
        let dAppData = await waves['default']['transactions']['nodeInteraction'].accountData(
          config['accountsStore']['accountGroups'][`${system.net.test}`]['address'],
          config[`${system.net.test}`][0]);
        object.callback({status:true, data: dAppData})
    })
    task.get(true, 'await', '5', '','/waves/create/wallet', async (object)=> {
        let seed = waves['libs'].crypto.randomSeed(15);
        const signer = new waves['signer']({
            NODE_URL: config[`${system.net.test}`][0]
        });
        signer.setProvider(new waves['providerSeed'](seed))
        let user = await signer.login();
        let balances = await signer.getBalance();
        object.callback({
            status:true,
                wallet: {
                user:user,
                balances:balances
            }
        })
    })

    task.get(true, 'await', '5', '','/waves/create/nft', async (object)=> {
        object.callback({
            status:true,
            nft: ''
        })
    })
    task.get(true, 'await', '5', '','/waves/set/script', async (object)=> {
        object.callback({
            status:true,
            nft: ''
        })
    })
    task.get(true, 'await', '5', '','/waves/transfer', async (object)=> {
        try {
            let txObjectSignedOne = waves.transactions.transfer({
                amount:100000000,
                recipient: config['accountsStore']['accountGroups'][`${system.net.test}`]['clients'][1]['address'],
                fee:500000 },config['accountsStore']['accountGroups'][`${system.net.test}`]['clients'][2]['seed'])
            // let txObjectSignedTwo = waves.transactions.transfer(txObjectSignedOne, property.property[0])
            // let txObjectSignedThre = waves.transactions.transfer(txObjectSignedTwo,property.property[1])
            let tx =  await waves.transactions.broadcast(txObjectSignedOne, config[`${system.net.test}`][0])
            await waves.transactions.waitForTx(tx.id,{
                apiBase: config[`${system.net.test}`][0]
            })
            // customEvents(`post-end`, {status:true, tx: tx, origin:'http://localhost:7030'})
            // customEvents(`${relation}-end`, {status:true, tx: tx})
            object.callback({
                status:true,
                tx: tx
            })
        }catch (e) {
            object.callback({
                status:false,
                error: e
            })
        }
    })
    return true
})()
