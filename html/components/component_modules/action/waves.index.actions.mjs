import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import Waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'

export default (async ()=>{
    console.log('# Actions for waves')
    task.get(true, 'await', '5', '','/waves/bank', async (object)=>{
        // if(isEmpty(substrate[`${relation}`])){
        //     console.warn(`${emoji('kissing_heart')} субстрат не определён --->`,  substrate)
        // }else{
        //     let dAppData = {}
        //     switch (substrate[`${relation}`]['/']) {
        //         case 'bank':
        //             dAppData = await waves['transactions']['nodeInteraction'].accountData(substrate[`${relation}`]['property']['dapp'], substrate[`${relation}`]['property']['testnodes'])
        //             break
        //         default:
        //             console.warn(`waves.mjs ${emoji('microscope')} действие не обрабтывается ${emoji('point_right')}`, substrate[`${relation}`]['/'], emoji('pray'),  substrate)
        //             break
        //
        //     }
        //     document.dispatchEvent( new CustomEvent('bank-end', {
        //         detail: {
        //             '/':`${substrate[`${relation}`]['/']}`,
        //             dAppData:dAppData
        //         }
        //     }))
        //     resolve(dAppData)
        // }
        object.callback({status:'ok'})
    })
    task.get(true, 'await', '5', '','/waves/transfer', async (object)=>{
        /*
           if(isEmpty(substrate[`${relation}`])){
                          console.warn(`${emoji('kissing_heart')} waves.mjs субстрат не определён --->`,  substrate)
                      }else{
                          let dAppData = {}
                          switch (substrate[`${relation}`]['/']) {
                              case 'transfer':
                                  try {
                                      console.log(`${emoji('fire')} --->`,property.property,substrate[`${relation}`]['property']['dapp'],relation)
                                      let txObjectSignedOne = waves.transactions.transfer({
                                          amount:100000000,
                                          recipient: substrate[`${relation}`]['substrate']['recipient'],
                                          fee:500000 },substrate[`${relation}`]['property']['dapp'])
                                      let txObjectSignedTwo = waves.transactions.transfer(txObjectSignedOne, property.property[0])
                                      let txObjectSignedThre = waves.transactions.transfer(txObjectSignedTwo,property.property[1])
                                      let tx =  await waves.transactions.broadcast(txObjectSignedThre, substrate[`${relation}`]['property']['testnodes'])
                                      console.log(`${emoji('fire')} --->`, tx)
                                      // await waves.transactions.waitForTx(tx.id,{
                                      //     apiBase:'https://nodes-testnet.wavesnodes.com'
                                      // })
                                      customEvents(`post-end`, {status:true, tx: tx, origin:'http://localhost:7030'})
                                      customEvents(`${relation}-end`, {status:true, tx: tx})
                                  }catch (e) {
                                      customEvents(`${relation}-end`, {status:false, error: e})
                                  }
                                  break
                              default:
                                  console.warn(`waves.mjs ${emoji('microscope')} действие не обрабтывается ${emoji('point_right')}`, substrate[`${relation}`]['/'], emoji('pray'), substrate)
                                  break

                          }
                          document.dispatchEvent( new CustomEvent(`${relation}`, {
                              detail: {
                                  '/':`${substrate[`${relation}`]['/']}`,
                                  dAppData:dAppData
                              }
                          }))
                          resolve(dAppData)
                      }
        */
        object.callback({status:'ok'})
    })

    task.get(true, 'await', '5', '','/waves/wallet', async (object)=>{
        /*
              if(isEmpty(substrate[`${relation}`])){
                        console.warn(`${emoji('kissing_heart')} субстрат не определён --->`,  substrate)
                    }else{
                        let user = {};
                        let balances = {};
                        let seed = {}
                        switch (substrate[`${relation}`]['/']) {
                            case 'wallet':
                                seed = waves['libs'].crypto.randomSeed(15);
                                // console.log('seed', seed)
                                // console.assert(false, substrate[`${relation}`]['property']['testnodes'])
                                const signer = new waves['Signer']['default']({
                                    NODE_URL: substrate[`${relation}`]['property']['testnodes']
                                });
                                signer.setProvider(new waves['ProviderSeed']['default'](seed))
                                user = await signer.login();
                                balances = await signer.getBalance();
                                break
                            default:
                                console.warn(`действие не обрабтывается ${emoji('kissing_heart')}`, substrate[`${relation}`]['/'], substrate)
                                break

                        }
                        document.dispatchEvent( new CustomEvent('created-wallet', {
                            detail: {
                                '/':`${substrate[`${relation}`]['/']}`,
                                wallet:{
                                    user:user,
                                    balances:balances,
                                    seed:seed,
                                }
                            }
                        }))
                        resolve(true)
                    }
        */
        object.callback({status:'ok'})
    })
    return true
})()
