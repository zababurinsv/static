let store={};function getProxy(e){const t={get:function(e,t){return e[t],e[t]},set:function(e,t,o){return e[t]=o,e[t]}};return new Proxy(e,t)}store.commit=async function(e,t){return console.log("<--- commit ---\x3e"),e},store.getters=async function(e,t){return console.log("<--- getters ---\x3e",e),e},store.dispatch=async function(e,t){console.log("<--- dispatch ---\x3e",e),window.localStorage||(window.localStorage={getItem:function(e){return e&&this.hasOwnProperty(e)?unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"),"$1")):null},key:function(e){return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/,"").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[e])},setItem:function(e,t){e&&(document.cookie=escape(e)+"="+escape(t)+"; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/",this.length=document.cookie.match(/\=/g).length)},length:0,removeItem:function(e){e&&this.hasOwnProperty(e)&&(document.cookie=escape(e)+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/",this.length--)},hasOwnProperty:function(e){return new RegExp("(?:^|;\\s*)"+escape(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=").test(document.cookie)}},window.localStorage.length=(document.cookie.match(/\=/g)||window.localStorage).length);let o={dispatch:store.dispatch,commit:store.commit,getters:store.getters},n={id:t.name,slot:e.slot,state:e.state},s={name:t.name,parent:t.parent,newValue:t.newValue,oldValue:t.oldValue,state:t.state,this:o};var a=new CustomEvent("store",{detail:{obj:n,task:s,state:s.state,value:s.newValue}});return document.dispatchEvent(a),localStorage.setItem(JSON.stringify(n),JSON.stringify(s)),e};let init=async function(e){return(store=await getProxy(store)).state={},e.store=store,e};export default{init:e=>init(e)};