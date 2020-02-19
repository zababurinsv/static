import ConsoleLogHTML from"/static/html/components/component_modules/console/console.mjs";import google from"/static/html/components/component_modules/google/google.mjs";import github from"/static/html/components/component_modules/github/github.mjs";import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";customElements.define("directory-list",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let e=[],t=[],l=[],n=[];function s(e,t,l){return new Promise(function(t,l){e["template-shadow"]=[],e["template-light"]=[];let n=[];n.swap=!1,n.blog=!1,n.external=!1,n.light=!1,n.slider=!1,n.one=!1,n.sliderText=!1,n.text=!1;for(let t=0;t<e.type.length;t++){if(-1!==e.type[t].indexOf("slider")&&e.type[t].split("-").length>1){n.slider=!0;for(let l in e.type[t].split("-"))switch(e.type[t].split("-")[l]){case"one":n.one=!0}}if(e.type[t].length)if(e.type[t].split("-").length>1)switch(e.type[t].split("-")[0]){case"blog":n.blog=!0;break;default:console.log("типы не отслеживаются",e.type[t])}else switch(e.type[t]){case"swap":n.swap=!0;break;case"external":n.external=!0;break;case"light":n.light=!0;break;case"slider":n.slider=!0;break;case"sliderText":n.sliderText=!0;break;case"text":n.text=!0}}if(!0===n.swap){for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-light"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),o(e.this.children[t],e),e["template-light"].push(e.this.children[t])):(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),o(e.this.children[t],e),e["template-shadow"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-light"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),o(e.template.children[t],e),e["template-light"].push(e.template.children[t])):(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),o(e.template.children[t],e),e["template-shadow"].push(e.template.children[t]))}else{for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-shadow"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(o(e.this.children[t],e),e["template-shadow"].push(e.this.children[t])):(o(e.this.children[t],e),e["template-light"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-shadow"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(o(e.template.children[t],e),e["template-shadow"].push(e.template.children[t])):(o(e.template.children[t],e),e["template-light"].push(e.template.children[t]))}for(let t in n)e.verify[t]=n[t];!0===e.verify.slider?function(e){return new Promise(function(t,l){fetch(`/static/html/components/varan-slider/template/${e.slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(l){let n=new DOMParser,s=n.parseFromString(l,"text/html");e.slider=s.getElementsByTagName("template")[0].content.cloneNode(!0);let i=document.createElement("section");i.className="slider",i.slot="view",i.appendChild(e.slider),e.slider=i,e["slider-template"]=i;for(let t=0;t<e.type.length;t++)"slider-one-text"===e.type[t]&&(e.verify.sliderText=!0);matcher.database.request.functions.getObject(e).then(e=>{e.get?(pagination.init(e),pagination.action(e).then(e=>{t(e)})):t(e)})}).catch(e=>e)})}(e).then(e=>{e["template-light"].push(e.slider),e.this.appendChild(e.slider),function(e,t){return new Promise(function(l,n){if(t){switch(t){case"slider":(function(e,t){return new Promise(function(l,n){for(let n=0;n<e.state.length;n++)for(let s=0;s<e[`template-${e.state[n]}`].length;s++)0===e[`template-${e.state[n]}`][s].getElementsByClassName(t).length||(e.slider=e[`template-${e.state[n]}`][s].getElementsByClassName(t)[0],l(e[`template-${e.state[n]}`][s].getElementsByClassName(t)[0]))})})(e,"peppermint").then(t=>{(function(e){return new Promise(function(t,l){t(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){}}))})})(t).then(t=>{e.slider=t,l(e)})})}l(e)}else l(e)})}(e,"slider").then(e=>{if(!0===e.verify.one)for(let l=0;l<e.state.length;l++)for(let n=0;n<e[`template-${e.state[l]}`].length;n++)"wall"===e[`template-${e.state[l]}`][n].className&&(e[`template-${e.state[l]}`].splice(n,1),t(e));else t(e)})}):t(e)})}function i(t,l){return new Promise(function(l,n){t.verify=[];let i={};i=t.slot?t.slot:t.parent,t.this.hasAttribute("preset")?0===t.this.getAttribute("preset").length?(t["path-template"]=`/static/html/components/${t.component}/template/${i}.html`,t.preset="default",t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/template/${t.this.getAttribute("preset")}/${t.component}-${t.this.getAttribute("preset")}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/${t.component}.html`,t.verify.preset=!1),fetch(t["path-template"]).then(function(e){if(e.ok)return e.text()}).then(function(n){let i=(new DOMParser).parseFromString(n,"text/html");t.template=i.getElementsByTagName("template")[0].content.cloneNode(!0),function(t){return new Promise(function(l,n){t["path-external"]=`/static/html/components/${t.component}/external/${t.component}-external.html`,fetch(t["path-external"]).then(function(e){return!1===e.ok?e.ok:e.text()}).then(function(n){if(!1===n);else{let s=new DOMParser,i=s.parseFromString(n,"text/html");t.external=i.querySelectorAll("section"),function(t){return new Promise(function(l,n){t["external-property"]=e["external-property"];let s=[],i=[],o=[];for(let e=0;e<t.external.length;e++){for(let l=0;l<t.external[e].children.length;l++)switch(t.external[e].children[l].tagName){case"SCRIPT":t.external[e].getAttribute("id")&&(i.script=t.external[e].children[l]);break;case"COMPONENT-ID":i.id=t.external[e].children[l].innerText;break;case"COMPONENT-ACTION":for(let n=0;n<t.external[e].children[l].children.length;n++)o.push(t.external[e].children[l].children[n].innerText);i.actions=o}s.push(i),i=[]}t["external-property"]=s,l(t)}).catch(e=>{})}(t).then(e=>{0===e["external-property"].length?l(e):function(e){return new Promise(function(t,l){e["words-action"]=[];let n=[];for(let l=0;l<e["external-property"].length;l++){for(let t=0;t<e["external-property"][l].actions.length;t++)for(let s=0;s<e.words.length;s++)-1!==e["external-property"][l].actions[t].indexOf(e.words[s])&&("shadowRoot"!==e.words[s]&&"shadow"!==e.words[t]||(n.shadow=!0),"light"!==e.words[s]&&"лайт"!==e.words[t]||(n.light=!0),"editor"===e.words[s]&&(n.editor=!0),"слайдер"===e.words[s]&&(n["editor-slider"]=!0),"swap"===e.words[s]&&(n.swap=!0));e["words-action"]=n;for(let t in e["external-property"])for(let l in e["external-property"][t])switch(l){case"id":let n=document.createElement(e["external-property"][t][l]);n.setAttribute("type","external"),e.this.appendChild(n)}t(e)}})}(e).then(e=>{l(e)})})}}).catch(e=>{throw e})})}(t).then(e=>{s(e,e["type-swap"],e["type-external"]).then(e=>{let t={};for(let l=0;l<e["template-light"].length;l++)"VARAN-MENU"===e["template-light"][l].tagName&&(t=e["template-light"].splice(l,1),e["template-light"].push(t[0]));if(!0===e.verify.swap){if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t=0;t<e["template-shadow"].length;t++)e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t=0;t<e["template-light"].length;t++)e.this.appendChild(e["template-light"][t])}else{if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t in e["template-shadow"])e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t in e["template-light"])e.this.appendChild(e["template-light"][t])}l(e)})})}).catch(e=>e)})}function o(e,t){return new Promise(function(l,n){let s=!1;for(let t=0;t<document.querySelectorAll("script").length;t++)-1!==document.querySelectorAll("script")[t].src.indexOf(e.tagName.toLowerCase())&&(s=!0);if(!0===s)console.log("модуль загружен");else{const s=document.createElement("script");s.type="module",s.src=`./static/html/components/${e.tagName.toLowerCase()}/${e.tagName.toLowerCase()}.mjs`,s.setAttribute("async",""),s.onload=l,s.onerror=n,t.this.appendChild(s)}})}var r;t.push("component-id"),t.push("script"),t.push("component-action"),l.push("h1"),l.push("innerText"),n.push("shadowRoot"),n.push("head"),n.push("shadow"),n.push("light"),n.push("lightDom"),n.push("editor"),n.push("слайдер"),n.push("swap"),e.this=this,e["type-supported"]=l,(r=this,new Promise(function(e,t){let l=[];l.staticProperty=[],l.staticProperty.c=0,l.state=[],l.state.push("shadow"),l.state.push("light"),l.words=n,l["type-swap"]=!1,l["type-external"]=!1,l["document-offsetWidth"]=document.body.offsetWidth;let s=!1;if(l.getAttribute=((e,t,l)=>{if("template"===l){if(!e.getAttribute("type"))return e.setAttribute("type","default"),!1;for(let l=0;l<e.getAttribute("type").split("-").length;l++)e.getAttribute("type").split("-")[l]===t&&(s=!0);return s}if(e[`verify-${t}`]=!1,0===e.this.getAttribute("type").split("-").length)return!1;for(let l=0;l<e.this.getAttribute("type").split("-").length;l++)e.this.getAttribute("type").split("-")[l]===t?e[`verify-${t}`]=!0:e[`verify-${t}`]=!1;return console.assert(!1,e),e[`verify-${t}`]}),r.tagName.toLowerCase()&&(l.component=r.tagName.toLowerCase()),"object"!=typeof r);else{if(r.getAttribute("type")){l.type=r.getAttribute("type").split("-");for(let e=0;e<l.type.length;e++)l.type[e]=l.type[e].replace(/:/g,"-");for(let e in l.type)switch(l.type[e]){case"swap":l["type-swap"]=!0;break;case"external":l["type-external"]=!0}}else l.type=["default"],r.setAttribute("type","default");if(r.slot?l.slot=r.slot:(r.slot=r.tagName.toLowerCase(),l.slot=r.slot),r.getAttribute("type")){let e=!1;for(let t in r.getAttribute("type").split("-"))-1!==r.getAttribute("type").split("-")[t].indexOf("style:")&&(e=!0);l["style-custom"]=!0===e?"not-default":"default"}}l.shadowRoot=!1,l.this=r,e(l)})).then(e=>{i(e).then(e=>{(function(e){return new Promise(function(t,l){let n=document.createElement("style"),s=document.createElement("style"),i={};(i=e.slot?e.slot:e.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let t=0;t<e.type.length;t++)"swap"===e.type[t]?"scoped"===e.type[t]&&n.setAttribute("scoped",""):"scoped"===e.type[t]&&s.setAttribute("scoped","");for(let l=0;l<e.state.length;l++){switch(e[`path-style-${e.state[l]}`]=`@import '/static/html/components/${e.component}/${e.state[l]}/${e.component}.css'; @import '/static/html/components/${e.component}/${e.state[l]}/${e.component}-custom.css';`,e.state[l]){case"shadow":!0===e.verify.preset&&(e[`path-style-${e.state[l]}-preset`]=`@import '/static/html/components/${e.component}/template/${i}.css';`),n.innerText=e[`path-style-${e.state[l]}`]+e[`path-style-${e.state[l]}-preset`];break;case"light":!0===e.verify.preset&&(e[`path-style-${e.state[l]}-preset`]=`@import '/static/html/components/${e.component}/template/${i}.css';`),s.innerText=e[`path-style-${e.state[l]}`]+e[`path-style-${e.state[l]}-preset`]}"swap"===e.state[l]?!0===e.shadowRoot?(e.this.shadowRoot.appendChild(s),e.this.appendChild(n),t(e)):e.this.appendChild(n):!0===e.shadowRoot?(e.this.shadowRoot.appendChild(n),e.this.appendChild(s),t(e)):e.this.appendChild(s)}t(e)})})(e).then(e=>{!async function(e){function t(l){return new Promise(async function(n,s){let i=await google({_:"folder",previous:l.detail.previous,parent:l.detail.folder.name,id:l.detail.id,folder:l.detail.folder}),o=i.parent.split(" "),r={};if(o.length>1){let t=void 0;for(let l=0;l<o.length;l++)isEmpty(t)?t=e.this.shadowRoot.querySelectorAll(`ul.${CSS.escape(o[l])}`):1===t.length?r=t[0]:console.assert(!1,"нужно переписать поиск от рут папки что бы небыло неоднозначности")}else r=e.this.shadowRoot.querySelector(`ul.${CSS.escape(i.parent)}`);for(let e in i.files)switch(i.files[e].mimeType){case"image/jpeg":case"image/png":case"text/plain":r.insertAdjacentHTML("beforeend",`<li class="file:${i.parent}">${i.files[e].name}</li>`);break;case"application/vnd.google-apps.folder":r.insertAdjacentHTML("afterbegin",`<li class="folder ${i.files[e].name}">${i.files[e].name}<ul class="${i.files[e].name}"></ul></li>`),await t({detail:{_:"folder",parent:i.files[e].name,previous:i.parent,id:i.id,folder:i.files[e]}});break;default:console.assert(!1,"неизвестный тип данных",i)}n(i)})}ConsoleLogHTML.connect(document.body.querySelector("#console")),document.addEventListener("signInGoogle",async l=>{e.this.shadowRoot.querySelector("li.rootFolder").innerHTML="","root"===l.detail.parent?e.this.shadowRoot.querySelector("ul.directory-list").id="root":e.this.shadowRoot.querySelector("ul.directory-list").id=l.detail.id,e.this.shadowRoot.querySelector("li.rootFolder").insertAdjacentHTML("beforeend",`\n            ${l.detail.parent}<ul class="rootFolder"></ul>\n            `);let n=e.this.shadowRoot.querySelector("ul.rootFolder");e.this.parentNode.shadowRoot.querySelector("[for=GoogleFolder]").style.display="flex";for(let e in l.detail.files)switch(l.detail.files[e].mimeType){case"image/jpeg":case"text/plain":case"image/png":n.insertAdjacentHTML("beforeend",`<li class="file:${l.detail.parent}">${l.detail.files[e].name}</li>`);break;case"application/vnd.google-apps.folder":n.insertAdjacentHTML("afterbegin",`<li class="folder ${l.detail.files[e].name}">${l.detail.files[e].name}<ul class="${l.detail.files[e].name}"></ul></li>`),await t({detail:{_:"folder",id:l.detail.id,parent:l.detail.files[e].name,previous:l.detail.parent,folder:l.detail.files[e]}});break;default:console.assert(!1,"неизвестный тип данных",l.detail.files[e].mimeType)}})}(e)})})})}connectedCallback(){document.dispatchEvent(new CustomEvent("directory-list")),console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~connected callback~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")}disconnectedCallback(){console.log("disconnected callback")}componentWillMount(){console.log("component will mount")}componentDidMount(){console.log("component did mount")}componentWillUnmount(){console.log("component will unmount")}componentDidUnmount(){console.log("component did unmount")}});