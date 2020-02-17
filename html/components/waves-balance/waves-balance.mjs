import Editor from"/static/html/components/component_modules/editor/editor.mjs";import store from"/static/html/components/component_modules/staticProperty/staticProperty.mjs";import matcher from"/static/html/components/component_modules/matcher/matcher.mjs";import mainConfig from"/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs";import conf from"/static/html/components/component_modules/matcher/matcher/this/database/config/index.mjs";customElements.define("waves-balance",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let e=[],t=[],a=[],s=[];function o(t,a){return new Promise(function(a,s){if(t.verify=[],t.this.getAttribute("preset"))switch(t.this.getAttribute("preset")){case"default":t["path-template"]=`/static/html/components/${t.component}/template/${t.component}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0;break;default:t["path-template"]=`/static/html/components/${t.component}/template/${t.this.getAttribute("preset")}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0}else t["path-template"]=`/static/html/components/${t.component}/${t.component}.html`,t.verify.preset=!1;fetch(t["path-template"]).then(function(e){if(e.ok)return e.text()}).then(function(s){let o=(new DOMParser).parseFromString(s,"text/html");t.template=o.getElementsByTagName("template")[0].content.cloneNode(!0),function(t){return new Promise(function(a,s){t["path-external"]=`/static/html/components/${t.component}/external/${t.component}-external.html`,fetch(t["path-external"]).then(function(e){return!1===e.ok?e.ok:e.text()}).then(function(s){if(!1===s);else{let o=(new DOMParser).parseFromString(s,"text/html");t.external=o.querySelectorAll("section"),function(t){return new Promise(function(a,s){t["external-property"]=e["external-property"];let o=[],r=[],l=[];for(let e=0;e<t.external.length;e++){for(let a=0;a<t.external[e].children.length;a++)switch(t.external[e].children[a].tagName){case"SCRIPT":t.external[e].getAttribute("id")&&(r.script=t.external[e].children[a]);break;case"COMPONENT-ID":r.id=t.external[e].children[a].innerText;break;case"COMPONENT-ACTION":for(let s=0;s<t.external[e].children[a].children.length;s++)l.push(t.external[e].children[a].children[s].innerText);r.actions=l}o.push(r),r=[]}t["external-property"]=o,a(t)}).catch(e=>{})}(t).then(e=>{0===e["external-property"].length?a(e):function(e){return new Promise(function(t,a){e["words-action"]=[];let s=[];for(let a=0;a<e["external-property"].length;a++){for(let t=0;t<e["external-property"][a].actions.length;t++)for(let o=0;o<e.words.length;o++)-1!==e["external-property"][a].actions[t].indexOf(e.words[o])&&("shadowRoot"!==e.words[o]&&"shadow"!==e.words[t]||(s.shadow=!0),"light"!==e.words[o]&&"лайт"!==e.words[t]||(s.light=!0),"editor"===e.words[o]&&(s.editor=!0),"слайдер"===e.words[o]&&(s["editor-slider"]=!0),"swap"===e.words[o]&&(s.swap=!0));e["words-action"]=s;for(let t in e["external-property"])for(let a in e["external-property"][t])switch(a){case"id":let s=document.createElement(e["external-property"][t][a]);s.setAttribute("type","external"),e.this.appendChild(s)}t(e)}})}(e).then(e=>{a(e)})})}}).catch(e=>{throw e})})}(t).then(e=>{(function(e,t,a){return new Promise(function(t,a){e["template-shadow"]=[],e["template-light"]=[];let s=[];s.swap=!1,s.blog=!1,s.external=!1,s.light=!1,s.slider=!1,s.one=!1,s.sliderText=!1,s.text=!1;for(let t=0;t<e.type.length;t++){if(-1!==e.type[t].indexOf("slider")&&e.type[t].split("-").length>1){s.slider=!0;for(let a in e.type[t].split("-"))switch(e.type[t].split("-")[a]){case"one":s.one=!0}}if(e.type[t].length)if(e.type[t].split("-").length>1)switch(e.type[t].split("-")[0]){case"blog":s.blog=!0;break;default:console.log("типы не отслеживаются",e.type[t])}else switch(e.type[t]){case"swap":s.swap=!0;break;case"external":s.external=!0;break;case"light":s.light=!0;break;case"slider":s.slider=!0;break;case"sliderText":s.sliderText=!0;break;case"text":s.text=!0}}if(e.this.getAttribute("parent")&&(e.parent=e.this.getAttribute("parent")),!0===s.swap){for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-light"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.this.children[t],e),e["template-light"].push(e.this.children[t])):(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.this.children[t],e),e["template-shadow"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-light"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.template.children[t],e),e["template-light"].push(e.template.children[t])):(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.template.children[t],e),e["template-shadow"].push(e.template.children[t]))}else{for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-shadow"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.this.children[t],e),e["template-shadow"].push(e.this.children[t])):(!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.this.children[t],e),e["template-light"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-shadow"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.template.children[t],e),e["template-shadow"].push(e.template.children[t])):(!1===e.parent?e.slot?e.this.children[t].setAttribute("parent",`${e.slot}`):e.this.children[t].setAttribute("parent",`${e.component}`):e.this.children[t].setAttribute("parent",`${e.parent}`),r(e.template.children[t],e),e["template-light"].push(e.template.children[t]))}for(let t in s)e.verify[t]=s[t];t(e)})})(e,e["type-swap"],e["type-external"]).then(e=>{if(!0===e.verify.swap){if(0!==e["template-light"].length)for(let t=0;t<e["template-light"].length;t++)e.this.prepend(e["template-light"][t]);if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t=0;t<e["template-shadow"].length;t++)e.this.shadowRoot.appendChild(e["template-shadow"][t])}}else{if(0!==e["template-light"].length)for(let t in e["template-light"])e.this.appendChild(e["template-light"][t]);if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t in e["template-shadow"])e.this.shadowRoot.appendChild(e["template-shadow"][t])}}a(e)})})}).catch(e=>e)})}function r(e,t){return new Promise(function(a,s){let o=!1;for(let t=0;t<document.querySelectorAll("script").length;t++)-1!==document.querySelectorAll("script")[t].src.indexOf(e.tagName.toLowerCase())&&(o=!0);if(!0===o)console.log("модуль загружен");else{const o=document.createElement("script");o.src=`/static/html/components/${e.tagName.toLowerCase()}/${e.tagName.toLowerCase()}.mjs`,o.type="module",o.setAttribute("async",""),o.onload=a,o.onerror=s,t.this.appendChild(o)}})}var l;t.push("component-id"),t.push("script"),t.push("component-action"),a.push("h1"),a.push("innerText"),s.push("shadowRoot"),s.push("head"),s.push("shadow"),s.push("light"),s.push("lightDom"),s.push("editor"),s.push("слайдер"),s.push("swap"),e.this=this,e["type-supported"]=a,(l=this,new Promise(function(e,t){let a=[];a.staticProperty=[],a.staticProperty.c=0,a.state=[],a.state.push("shadow"),a.state.push("light"),a.words=s,a.parent=!1,a["type-swap"]=!1,a["type-external"]=!1,a["document-offsetWidth"]=document.body.offsetWidth;let o=!1;if(a.getAttribute=((e,t,a)=>{if("template"===a){if(!e.getAttribute("type"))return e.setAttribute("type","default"),!1;for(let a=0;a<e.getAttribute("type").split("-").length;a++)e.getAttribute("type").split("-")[a]===t&&(o=!0);return o}if(e[`verify-${t}`]=!1,0===e.this.getAttribute("type").split("-").length)return!1;for(let a=0;a<e.this.getAttribute("type").split("-").length;a++)e.this.getAttribute("type").split("-")[a]===t?e[`verify-${t}`]=!0:e[`verify-${t}`]=!1;return console.assert(!1,e),e[`verify-${t}`]}),l.tagName.toLowerCase()&&(a.component=l.tagName.toLowerCase()),"object"!=typeof l);else{if(l.getAttribute("type")){a.type=l.getAttribute("type").split("-");for(let e=0;e<a.type.length;e++)a.type[e]=a.type[e].replace(/:/g,"-");for(let e in a.type)switch(a.type[e]){case"swap":a["type-swap"]=!0;break;case"external":a["type-external"]=!0}}else a.type=["default"],l.setAttribute("type","default");if(l.slot?a.slot=l.slot:(l.slot=l.tagName.toLowerCase(),a.slot=l.slot),l.getAttribute("type")){let e=!1;for(let t in l.getAttribute("type").split("-"))-1!==l.getAttribute("type").split("-")[t].indexOf("style:")&&(e=!0);a["style-custom"]=!0===e?"not-default":"default"}}a.shadowRoot=!1,a.this=l,e(a)})).then(e=>{o(e).then(e=>{(function(e){return new Promise(function(t,a){let s=document.createElement("style"),o=document.createElement("style"),r={};(r=e.slot?e.slot:e.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let t=0;t<e.type.length;t++)"swap"===e.type[t]?"scoped"===e.type[t]&&s.setAttribute("scoped",""):"scoped"===e.type[t]&&o.setAttribute("scoped","");for(let a=0;a<e.state.length;a++){switch(e[`path-style-${e.state[a]}`]=`@import '/static/html/components/${e.component}/${e.state[a]}/${e.component}.css'; @import '/static/html/components/${e.component}/${e.state[a]}/${e.component}-custom.css';`,e.state[a]){case"shadow":!0===e.verify.preset&&(e[`path-style-${e.state[a]}-preset`]=`@import '/static/html/components/${e.component}/template/${r}.css';`),s.innerText=e[`path-style-${e.state[a]}`]+e[`path-style-${e.state[a]}-preset`];break;case"light":!0===e.verify.preset&&(e[`path-style-${e.state[a]}-preset`]=`@import '/static/html/components/${e.component}/template/${r}.css';`),o.innerText=e[`path-style-${e.state[a]}`]+e[`path-style-${e.state[a]}-preset`]}"swap"===e.state[a]?!0===e.shadowRoot?(e.this.shadowRoot.appendChild(o),e.this.appendChild(s),t(e)):e.this.appendChild(s):!0===e.shadowRoot?(e.this.shadowRoot.appendChild(s),e.this.appendChild(o),t(e)):e.this.appendChild(o)}t(e)})})(e).then(e=>{!async function(e){await store({input:"waves-balance",this:e.this,parent:e.this.getAttribute("parent"),slot:e.slot,type:"obj"},"set","type");let t=conf.account.dappaddress,a=conf.account.testnodes;e.this.shadowRoot.querySelector("#multiDomainAccount").innerText=`${conf.account.dappaddress}`;let s=await window.wt.nodeInteraction.balanceDetails(t,a);s=s.regular/1e8,e.this.shadowRoot.querySelector(".regularBalance").innerText=`waves: ${s}`,e.this.shadowRoot.querySelector(".withdraw").addEventListener("click",async function(t){bundle.default(e,null,async function(e,a){let s=await store({input:"state",type:"object"},"get","type");if(null===s)alert("Войдите под своим аккаунтом");else{let o=await window.wt.nodeInteraction.accountDataByKey(`${s[0].state.address}_balance`,window.wt.dappaddress,window.wt.baseUri),r=0;if(0==(r=a.isEmpty(t.target.shadowRoot.querySelector("#withdraw").value)?+o.value:1e8*t.target.shadowRoot.querySelector("#withdraw").value))alert("У вас нет средств для вывода");else try{let t=await store({input:"waves-balance",type:"all"},"get","type");t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").style.disabled="disabled",t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").disabled=!0,t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").style.disabled="disabled",t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").disabled=!0,t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").innerText="идёт процесс вывода",t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").value=0;let a=await WavesKeeper.signAndPublishTransaction({type:16,data:{fee:{tokens:"0.05",assetId:"WAVES"},dApp:mainConfig.account.dappaddress,call:{function:"withdraw",args:[{type:"integer",value:r}]},payment:[]}});a=JSON.parse(a);let s=t["waves-auth"][0].this.shadowRoot.querySelector(".balance").innerText;s=+s.split(":")[1],await window.wt.nodeInteraction.waitForTx(a.id,{apiBase:"https://nodes-testnet.wavesnodes.com"});let o=await WavesKeeper.publicState(),l=await window.wt.nodeInteraction.balanceDetails(window.wt.dappaddress,window.wt.baseUri);l=l.regular/1e8;let i=await window.wt.nodeInteraction.accountDataByKey(`${o.account.address}_balance`,window.wt.dappaddress,window.wt.baseUri);i=i.value/1e8;let n=await window.wt.nodeInteraction.balanceDetails(o.account.address,window.wt.baseUri),h=+n.regular/1e8,d=!1;for(;d;)return s===h?(h=+(n=await window.wt.nodeInteraction.balanceDetails(o.account.address,window.wt.baseUri)).regular/1e8,console.assert(!1,h),d=!1):(console.assert(!1,h),d=!0);t["waves-balance"][0].this.shadowRoot.querySelector(".regularBalance").innerText=`waves: ${l}`,t["waves-balance"][0].this.shadowRoot.querySelector(".balanceAccount").innerText=i,t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").value=0,t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").placeholder="all",t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").disabled=!1,t["waves-auth"][0].this.shadowRoot.querySelector(".balance").innerText="",t["waves-auth"][0].this.shadowRoot.querySelector(".balance").innerText=`Waves: ${h}`,t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").style.disabled="none",t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").innerText="вывод средств с аккаунта",t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").style.disabled="none",t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").disabled=!1}catch(e){let t=await store({input:"waves-balance",type:"all"},"get","type");t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").value=0,t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").placeholder="all",t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").innerText="вывод средств с аккаунта",t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").disabled=!1,console.warn("error request",e)}}})}),e.this.shadowRoot.querySelector(".deposit").addEventListener("click",async function(t){bundle.default(e,null,async function(e,a){let s=await store({input:"state",type:"object"},"get","type");if(null===s)alert("Войдите под своим аккаунтом");else{let o=await window.wt.nodeInteraction.accountDataByKey(`${s[0].state.address}_balance`,window.wt.dappaddress,window.wt.baseUri),r=0;if((r=a.isEmpty(t.target.shadowRoot.querySelector("#deposit").value)?+o.value:1e8*t.target.shadowRoot.querySelector("#deposit").value)<1)alert(" Возможен ввод средств больше или ровно 1 Waves");else try{let t=await store({input:"waves-balance",type:"all"},"get","type");t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").style.disabled="disabled",t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").innerText="идёт процесс ввода",t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").value=0,t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").disabled=!0,t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").style.disabled="disabled",t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").disabled=!0;let a=await WavesKeeper.signAndPublishTransaction({type:16,data:{fee:{tokens:"0.05",assetId:"WAVES"},dApp:mainConfig.account.dappaddress,call:{function:"deposit",args:[]},payment:[{amount:r,assetId:null}]}});a=JSON.parse(a);let s=t["waves-auth"][0].this.shadowRoot.querySelector(".balance").innerText;s=+s.split(":")[1],await window.wt.nodeInteraction.waitForTx(a.id,{apiBase:"https://nodes-testnet.wavesnodes.com"});let o=await WavesKeeper.publicState(),l=await window.wt.nodeInteraction.balanceDetails(window.wt.dappaddress,window.wt.baseUri);l=l.regular/1e8;let i=await window.wt.nodeInteraction.accountDataByKey(`${o.account.address}_balance`,window.wt.dappaddress,window.wt.baseUri);i=i.value/1e8;let n=await window.wt.nodeInteraction.balanceDetails(o.account.address,window.wt.baseUri),h=+n.regular/1e8,d=!1;for(;d;)return s===h?(h=+(n=await window.wt.nodeInteraction.balanceDetails(o.account.address,window.wt.baseUri)).regular/1e8,console.assert(!1,h),d=!1):(console.assert(!1,h),d=!0);t["waves-balance"][0].this.shadowRoot.querySelector(".regularBalance").innerText=`waves: ${l}`,t["waves-balance"][0].this.shadowRoot.querySelector(".balanceAccount").innerText=i,t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").value=0,t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").placeholder="0",t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").innerText="Ввод средств на аккаунт",t["waves-auth"][0].this.shadowRoot.querySelector(".balance").innerText="",t["waves-auth"][0].this.shadowRoot.querySelector(".balance").innerText=`Waves: ${h}`,t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").disabled=!1}catch(e){let t=await store({input:"waves-balance",type:"all"},"get","type");t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").value=0,t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").placeholder="0",t["waves-balance"][0].this.shadowRoot.querySelector("#deposit").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector(".withdraw").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector("#withdraw").disabled=!1,t["waves-balance"][0].this.shadowRoot.querySelector(".deposit").innerText="Ввод средств на аккаунт",console.log("error request",e)}}})})}(e)})})})}});