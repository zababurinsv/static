import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Account from '/static/html/components/component_modules/account/account.mjs'
import walletTemplate from '/static/html/components/waves-provider/template/wallet.mjs'
import Waves from '/static/html/components/component_modules/waves/waves.mjs'
import heap from '/static/html/components/component_modules/heap/heap.mjs'
let waves = Waves()

export default async (v,p,c,obj,r) =>{
    let objectWallet ={}
await heap(true, 'await','4',{}, 'await-wallet',async (object)=>{
    if(isEmpty(objectWallet)){
        objectWallet = new Proxy({}, {
            get: function(target, prop) {
                return target[prop];
            },
            set: function(target, prop, value) {
                obj['this'].shadowRoot.querySelector('div.connecting-cycle').style.background = '#f21818de'
                obj['this'].shadowRoot.querySelector('div.connecting-cycle').style.color = '#93fff5'
                obj['this'].shadowRoot.querySelector('div.connecting-cycle').innerHTML = 'ON AIR'
                object.callback(value)
                return true;
            }
        });
    }else{
        console.assert(false, objectWallet)
    }
})
// console.log('@@@@@@@@@@@@@55555@@@@@@@@@@@@@', objectWallet)
// document.addEventListener('await-wallet',async (event)=>{
//     console.log('@@@@@@@@@@@@@111@@@@@@@@@@@@@', objectWallet)
//     if(isEmpty(objectWallet)){
//          objectWallet = new Proxy({}, {
//             get: function(target, prop) {
//                 return Reflect.get(target, prop);
//             },
//             set: function(target, prop, value) {
//                 obj['this'].shadowRoot.querySelector('div.connecting-cycle').style.background = '#f21818de'
//                 obj['this'].shadowRoot.querySelector('div.connecting-cycle').style.color = '#93fff5'
//                 obj['this'].shadowRoot.querySelector('div.connecting-cycle').innerHTML = 'ON AIR'
//                 event.detail.callback(value)
//                 return Reflect.set(target, prop, value);
//             }
//         });
//     }else{
//         console.assert(false, objectWallet)
//     }
// })
let account = await (Account())
obj['this'].shadowRoot.querySelector('svg.form-password').addEventListener('click',async (event)=>{
    let type = obj['this'].shadowRoot.querySelector('#form-password')
    if( type.type === 'text'){
        obj['this'].shadowRoot.querySelector('#form-password').type = 'password'
    }else{
        obj['this'].shadowRoot.querySelector('#form-password').type = 'text'
    }
})
obj['this'].shadowRoot.querySelector('svg.form-confirm').addEventListener('click',async (event)=>{
    let type = obj['this'].shadowRoot.querySelector('#form-confirm')
    if( type.type === 'text'){
        obj['this'].shadowRoot.querySelector('#form-confirm').type = 'password'
    }else{
        obj['this'].shadowRoot.querySelector('#form-confirm').type = 'text'
    }
})
obj['this'].shadowRoot.querySelector('button.login-button').addEventListener('click',async (event)=>{
    let file =  obj['this'].shadowRoot.querySelector('#account-create').files[0]
    obj['this'].shadowRoot.querySelector('#account-create').value = '';
    let pass = obj['this'].shadowRoot.querySelector('#form-password')
    let passConfirm = obj['this'].shadowRoot.querySelector('#form-confirm')
    if(file === undefined){
        if(isEmpty(pass.value)){

        }else{
            if(pass.value === passConfirm.value){
                obj['this'].shadowRoot.querySelector('#form-password').value = ''
                obj['this'].shadowRoot.querySelector('#form-confirm').value = ''
                let name = obj['this'].shadowRoot.querySelector('#account-name').value
                let type = obj['this'].shadowRoot.querySelector('#account-type').value
                if(isEmpty(name)){ name = 'wallet' }
                let wallet = await account.create(name, pass.value,type)
                let balance = (await (await waves)['balance'](wallet['public']['address']))['balance']
                let template =await walletTemplate(true,'','3',{
                    type:wallet['type'],
                    date:wallet['date']['GMT'],
                    address:wallet['public']['address'],
                    publicKey:wallet['public']['key'],
                    privateKey:wallet['private']['privateKey'],
                    seed:wallet['private']['seed'],
                    balance:balance,
                },'template-wallet')
                obj['this'].shadowRoot.querySelector('#wallet').innerHTML = ''
                obj['this'].shadowRoot.querySelector('#wallet').classList.add("active")
                obj['this'].shadowRoot.querySelector('#wallet').insertAdjacentHTML('beforeend',template)
                let button = ['wallet-address',
                    'wallet-publicKey',
                    'wallet-privateKey',
                    'wallet-seed',
                    'wallet-balance']
                objectWallet['wallet'] = wallet
                for(let item of button){
                    obj['this'].shadowRoot.querySelector(`div.${item}`).addEventListener('click',async (event)=>{
                        event.currentTarget.style.background = '#faf671'
                        let object = event.currentTarget
                        let value = object.querySelector('p.value').innerHTML
                        console.log('----->',value)
                        await navigator.clipboard.writeText(value)
                        let timer = setTimeout((event)=>{
                            object.style.background = '#4c6499de'
                            clearTimeout(timer);
                        }, 250);
                    })
                }
            }
        }
    }else{
        if(isEmpty(pass.value)){
        }else{
            let wallet =  await account.open(file, pass.value)
            obj['this'].shadowRoot.querySelector('#form-password').value = ''
            let balance = (await (await waves)['balance'](wallet['public']['address'],wallet['type']))['balance']
            let template = await walletTemplate(true,'','3',{
                type:wallet['type'],
                date:wallet['date']['GMT'],
                address:wallet['public']['address'],
                publicKey:wallet['public']['key'],
                privateKey:wallet['private']['privateKey'],
                seed:wallet['private']['seed'],
                balance:balance,
            },'template-wallet')
            obj['this'].shadowRoot.querySelector('#wallet').innerHTML = ''
            obj['this'].shadowRoot.querySelector('#wallet').classList.add("active")
            obj['this'].shadowRoot.querySelector('#wallet').insertAdjacentHTML('beforeend',template)
            let button = ['wallet-address',
                'wallet-publicKey',
                'wallet-privateKey',
                'wallet-seed',
                'wallet-balance']
            objectWallet['wallet'] = wallet
            for(let item of button){
                obj['this'].shadowRoot.querySelector(`div.${item}`).addEventListener('click',async (event)=>{
                    event.currentTarget.style.background = '#faf671'
                    let object = event.currentTarget
                    let value = object.querySelector('p.value').innerHTML
                    await navigator.clipboard.writeText(value)
                    let timer = setTimeout((event)=>{
                        object.style.background = '#4c6499de'
                        clearTimeout(timer);
                    }, 250);
                })
            }
        }
    }
})


// console.assert(false,JSON.stringify(wallet), local )
// console.assert(false,signer.libs.crypto.privateKey(seed))
// waves.setProvider(new signer.Provider());
// console.assert(false, test.login(), test2.login())
// const provider = new signer['Provider']('https://testnet.waves.exchange/signer/');

// obj['this']['shadowRoot'].querySelector("#form-password").addEventListener("click", async function (event) {
//     try {
//         const userData = await waves.login();
//         event.target.classList.add("clicked");
//         obj['this']['shadowRoot'].querySelector('#log').insertAdjacentHTML('beforeend',`authorized as <br> ${userData.address}` )
//         obj['this']['shadowRoot'].querySelector(".explorer-link").innerHTML = `<a href="https://wavesexplorer.com/testnet/address/${userData.address}" target="_blank">Check the Explorer</a>`;
//     } catch (e) {
//         console.error('login rejected', e)
//     }
// });
// obj['this']['shadowRoot'].querySelector(".js-invoke").addEventListener("click", function () {
//     waves.invoke({
//         dApp: "3MuN7D8r19zdvSpAd1L91Gs88bcgwUFy2mn",
//         call: {
//             function: "faucet"
//         }
//     }).broadcast().then(console.log)
// });

// obj['this']['shadowRoot'].querySelector(".js-data").addEventListener("click", function () {
//     const date = new Date();
//     waves.data({
//         data: [
//             {
//                 key: "lastCall",
//                 value: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
//                 type: 'string'
//             }
//         ]
//     }).broadcast().then(console.log)
// });


// just transferring some WAVES token to Alice
//                 obj['this']['shadowRoot'].querySelector(".js-transfer").addEventListener("click", function () {
//                     waves.transfer({
//                         recipient: "3MuN7D8r19zdvSpAd1L91Gs88bcgwUFy2mn",
//                         amount: 1
//                     }).broadcast().then(console.log)
//                 })
}