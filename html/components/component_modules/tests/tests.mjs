let object={};import{tests}from"/static/html/components/component_modules/loader/loader.mjs";export default(t={_:"default"})=>new Promise(async(t,e)=>{switch(location.host){case"localhost:6040":await tests("./tests/game/mono.mjs","tests");break;case"localhost:4999":case"zababurinsv.github.io":await tests("/tests/wallet.mjs","tests");break;default:console.warn("неизвестный источник",location.host)}let o=document.createElement("script");o.type="module",o.innerHTML=void(async t=>{mocha.run()})(document),document.body.appendChild(o),t(object)});