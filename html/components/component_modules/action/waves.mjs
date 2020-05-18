import colorlog from"/static/html/components/component_modules/colorLog/colorLog.mjs";import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";import emoji from"/static/html/components/component_modules/emoji/emoji.mjs";import Recursion from"/static/html/components/component_modules/recursion/recursion.mjs";import treeBundle from"/static/html/components/component_modules/recursion/module/tree-bundle.mjs";import Waves from"/static/html/components/component_modules/bundle/waves/waves.mjs";import events from"/static/html/components/component_modules/CustomEvent/index.mjs";function bestCopyEver(e){return Object.assign({},e)}export default(e,t,o,s,n)=>new Promise(async(o,a)=>{"action";let r=await Waves.default;await Recursion();switch(n.toLowerCase()){case"bank":if(isEmpty(s[`${n}`]))console.warn(`${emoji("kissing_heart")} субстрат не определён ---\x3e`,s);else{let e={};switch(s[`${n}`]["/"]){case"bank":e=await r.transactions.nodeInteraction.accountData(s[`${n}`].property.dapp,s[`${n}`].property.testnodes);break;default:console.warn(`waves.mjs ${emoji("microscope")} действие не обрабтывается ${emoji("point_right")}`,s[`${n}`]["/"],emoji("pray"),s)}document.dispatchEvent(new CustomEvent("bank-end",{detail:{"/":`${s[`${n}`]["/"]}`,dAppData:e}})),o(e)}break;case"transfer":if(isEmpty(s[`${n}`]))console.warn(`${emoji("kissing_heart")} waves.mjs субстрат не определён ---\x3e`,s);else{let e={};switch(s[`${n}`]["/"]){case"transfer":try{console.log(`${emoji("fire")} ---\x3e`,t.property,s[`${n}`].property.dapp,n);let e=r.transactions.transfer({amount:1e8,recipient:s[`${n}`].substrate.recipient,fee:5e5},s[`${n}`].property.dapp),o=r.transactions.transfer(e,t.property[0]),a=r.transactions.transfer(o,t.property[1]),i=await r.transactions.broadcast(a,s[`${n}`].property.testnodes);console.log(`${emoji("fire")} ---\x3e`,i),customEvents("post-end",{status:!0,tx:i,origin:"http://localhost:7030"}),customEvents(`${n}-end`,{status:!0,tx:i})}catch(e){customEvents(`${n}-end`,{status:!1,error:e})}break;default:console.warn(`waves.mjs ${emoji("microscope")} действие не обрабтывается ${emoji("point_right")}`,s[`${n}`]["/"],emoji("pray"),s)}document.dispatchEvent(new CustomEvent(`${n}`,{detail:{"/":`${s[`${n}`]["/"]}`,dAppData:e}})),o(e)}break;case"wallet":if(isEmpty(s[`${n}`]))console.warn(`${emoji("kissing_heart")} субстрат не определён ---\x3e`,s);else{let e={},t={},a={};switch(s[`${n}`]["/"]){case"wallet":a=r.libs.crypto.randomSeed(15);const o=new r.Signer.default({NODE_URL:s[`${n}`].property.testnodes});o.setProvider(new r.ProviderSeed.default(a)),e=await o.login(),t=await o.getBalance();break;default:console.warn(`действие не обрабтывается ${emoji("kissing_heart")}`,s[`${n}`]["/"],s)}document.dispatchEvent(new CustomEvent("created-wallet",{detail:{"/":`${s[`${n}`]["/"]}`,wallet:{user:e,balances:t,seed:a}}})),o(!0)}break;default:console.warn(`${emoji("kissing_heart")} waves.mjs нет обработчика ---\x3e`,n.toLowerCase(),"[(",e,t,"action",s,n,")a]")}o({key:!0})});