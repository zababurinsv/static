import action from"/static/html/components/component_modules/action/action.mjs";import customEvents from"/static/html/components/component_modules/customEvent/callback.mjs";import sidebarRight from"/static/html/components/component_modules/sidebarRight/sidebarRight.mjs";customElements.define("telegram-sidebar-right",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let t=[],e=[],s=[],i=[];function a(t,e,s){return new Promise(function(e,s){t["template-shadow"]=[],t["template-light"]=[];let i=[];i.swap=!1,i.blog=!1,i.external=!1,i.light=!1,i.slider=!1,i.one=!1,i.sliderText=!1,i.text=!1;for(let e=0;e<t.type.length;e++){if(-1!==t.type[e].indexOf("slider")&&t.type[e].split("-").length>1){i.slider=!0;for(let s in t.type[e].split("-"))switch(t.type[e].split("-")[s]){case"one":i.one=!0}}if(t.type[e].length)if(t.type[e].split("-").length>1)switch(t.type[e].split("-")[0]){case"blog":i.blog=!0;break;default:console.log("типы не отслеживаются",t.type[e])}else switch(t.type[e]){case"swap":i.swap=!0;break;case"external":i.external=!0;break;case"light":i.light=!0;break;case"slider":i.slider=!0;break;case"sliderText":i.sliderText=!0;break;case"text":i.text=!0}}if(!0===i.swap){for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-light"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e],t),t["template-light"].push(t.this.children[e])):(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e],t),t["template-shadow"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-light"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e],t),t["template-light"].push(t.template.children[e])):(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e],t),t["template-shadow"].push(t.template.children[e]))}else{for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-shadow"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(r(t.this.children[e],t),t["template-shadow"].push(t.this.children[e])):(r(t.this.children[e],t),t["template-light"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-shadow"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(r(t.template.children[e],t),t["template-shadow"].push(t.template.children[e])):(r(t.template.children[e],t),t["template-light"].push(t.template.children[e]))}for(let e in i)t.verify[e]=i[e];!0===t.verify.slider?function(t){return new Promise(function(e,s){fetch(`/static/html/components/varan-slider/template/${t.slot}.html`).then(function(t){if(t.ok)return t.text()}).then(function(s){let i=new DOMParser,a=i.parseFromString(s,"text/html");t.slider=a.getElementsByTagName("template")[0].content.cloneNode(!0);let n=document.createElement("section");n.className="slider",n.slot="view",n.appendChild(t.slider),t.slider=n,t["slider-template"]=n;for(let e=0;e<t.type.length;e++)"slider-one-text"===t.type[e]&&(t.verify.sliderText=!0);matcher.database.request.functions.getObject(t).then(t=>{t.get?(pagination.init(t),pagination.action(t).then(t=>{e(t)})):e(t)})}).catch(t=>t)})}(t).then(t=>{t["template-light"].push(t.slider),t.this.appendChild(t.slider),function(t,e){return new Promise(function(s,i){if(e){switch(e){case"slider":(function(t,e){return new Promise(function(s,i){for(let i=0;i<t.state.length;i++)for(let a=0;a<t[`template-${t.state[i]}`].length;a++)0===t[`template-${t.state[i]}`][a].getElementsByClassName(e).length||(t.slider=t[`template-${t.state[i]}`][a].getElementsByClassName(e)[0],s(t[`template-${t.state[i]}`][a].getElementsByClassName(e)[0]))})})(t,"peppermint").then(e=>{(function(t){return new Promise(function(e,s){e(Peppermint(t,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(t){}}))})})(e).then(e=>{t.slider=e,s(t)})})}s(t)}else s(t)})}(t,"slider").then(t=>{if(!0===t.verify.one)for(let s=0;s<t.state.length;s++)for(let i=0;i<t[`template-${t.state[s]}`].length;i++)"wall"===t[`template-${t.state[s]}`][i].className&&(t[`template-${t.state[s]}`].splice(i,1),e(t));else e(t)})}):e(t)})}function n(e,s){return new Promise(function(s,i){e.verify=[];let n={};n=e.slot?e.slot:e.parent,e.this.hasAttribute("preset")?0===e.this.getAttribute("preset").length?(e["path-template"]=`/static/html/components/${e.component}/template/${n}.html`,e.preset="default",e.verify.preset=!0):(e["path-template"]=`/static/html/components/${e.component}/template/${e.this.getAttribute("preset")}/${e.component}-${e.this.getAttribute("preset")}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0):(e["path-template"]=`/static/html/components/${e.component}/${e.component}.html`,e.verify.preset=!1),fetch(e["path-template"]).then(function(t){if(t.ok)return t.text()}).then(function(i){let n=(new DOMParser).parseFromString(i,"text/html");e.template=n.getElementsByTagName("template")[0].content.cloneNode(!0),function(e){return new Promise(function(s,i){e["path-external"]=`/static/html/components/${e.component}/external/${e.component}-external.html`,fetch(e["path-external"]).then(function(t){return!1===t.ok?t.ok:t.text()}).then(function(i){if(!1===i);else{let a=new DOMParser,n=a.parseFromString(i,"text/html");e.external=n.querySelectorAll("section"),function(e){return new Promise(function(s,i){e["external-property"]=t["external-property"];let a=[],n=[],r=[];for(let t=0;t<e.external.length;t++){for(let s=0;s<e.external[t].children.length;s++)switch(e.external[t].children[s].tagName){case"SCRIPT":e.external[t].getAttribute("id")&&(n.script=e.external[t].children[s]);break;case"COMPONENT-ID":n.id=e.external[t].children[s].innerText;break;case"COMPONENT-ACTION":for(let i=0;i<e.external[t].children[s].children.length;i++)r.push(e.external[t].children[s].children[i].innerText);n.actions=r}a.push(n),n=[]}e["external-property"]=a,s(e)}).catch(t=>{})}(e).then(t=>{0===t["external-property"].length?s(t):function(t){return new Promise(function(e,s){t["words-action"]=[];let i=[];for(let s=0;s<t["external-property"].length;s++){for(let e=0;e<t["external-property"][s].actions.length;e++)for(let a=0;a<t.words.length;a++)-1!==t["external-property"][s].actions[e].indexOf(t.words[a])&&("shadowRoot"!==t.words[a]&&"shadow"!==t.words[e]||(i.shadow=!0),"light"!==t.words[a]&&"лайт"!==t.words[e]||(i.light=!0),"editor"===t.words[a]&&(i.editor=!0),"слайдер"===t.words[a]&&(i["editor-slider"]=!0),"swap"===t.words[a]&&(i.swap=!0));t["words-action"]=i;for(let e in t["external-property"])for(let s in t["external-property"][e])switch(s){case"id":let i=document.createElement(t["external-property"][e][s]);i.setAttribute("type","external"),t.this.appendChild(i)}e(t)}})}(t).then(t=>{s(t)})})}}).catch(t=>{throw t})})}(e).then(t=>{a(t,t["type-swap"],t["type-external"]).then(t=>{let e={};for(let s=0;s<t["template-light"].length;s++)"VARAN-MENU"===t["template-light"][s].tagName&&(e=t["template-light"].splice(s,1),t["template-light"].push(e[0]));if(!0===t.verify.swap){if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e=0;e<t["template-shadow"].length;e++)t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e=0;e<t["template-light"].length;e++)t.this.appendChild(t["template-light"][e])}else{if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e in t["template-shadow"])t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e in t["template-light"])t.this.appendChild(t["template-light"][e])}s(t)})})}).catch(t=>t)})}function r(t,e){return new Promise(function(s,i){let a=!1;for(let e=0;e<document.querySelectorAll("script").length;e++)-1!==document.querySelectorAll("script")[e].src.indexOf(t.tagName.toLowerCase())&&(a=!0);if(!0===a)console.log("модуль загружен");else{const a=document.createElement("script");a.type="module",a.src=`./static/html/components/${t.tagName.toLowerCase()}/${t.tagName.toLowerCase()}.mjs`,a.setAttribute("async",""),a.onload=s,a.onerror=i,e.this.appendChild(a)}})}var l;e.push("component-id"),e.push("script"),e.push("component-action"),s.push("h1"),s.push("innerText"),i.push("shadowRoot"),i.push("head"),i.push("shadow"),i.push("light"),i.push("lightDom"),i.push("editor"),i.push("слайдер"),i.push("swap"),t.this=this,t["type-supported"]=s,(l=this,new Promise(function(t,e){let s=[];s.staticProperty=[],s.staticProperty.c=0,s.state=[],s.state.push("shadow"),s.state.push("light"),s.words=i,s["type-swap"]=!1,s["type-external"]=!1,s["document-offsetWidth"]=document.body.offsetWidth;let a=!1;if(s.getAttribute=((t,e,s)=>{if("template"===s){if(!t.getAttribute("type"))return t.setAttribute("type","default"),!1;for(let s=0;s<t.getAttribute("type").split("-").length;s++)t.getAttribute("type").split("-")[s]===e&&(a=!0);return a}if(t[`verify-${e}`]=!1,0===t.this.getAttribute("type").split("-").length)return!1;for(let s=0;s<t.this.getAttribute("type").split("-").length;s++)t.this.getAttribute("type").split("-")[s]===e?t[`verify-${e}`]=!0:t[`verify-${e}`]=!1;return console.assert(!1,t),t[`verify-${e}`]}),l.tagName.toLowerCase()&&(s.component=l.tagName.toLowerCase()),"object"!=typeof l);else{if(l.getAttribute("type")){s.type=l.getAttribute("type").split("-");for(let t=0;t<s.type.length;t++)s.type[t]=s.type[t].replace(/:/g,"-");for(let t in s.type)switch(s.type[t]){case"swap":s["type-swap"]=!0;break;case"external":s["type-external"]=!0}}else s.type=["default"],l.setAttribute("type","default");if(l.slot?s.slot=l.slot:(l.slot=l.tagName.toLowerCase(),s.slot=l.slot),l.getAttribute("type")){let t=!1;for(let e in l.getAttribute("type").split("-"))-1!==l.getAttribute("type").split("-")[e].indexOf("style:")&&(t=!0);s["style-custom"]=!0===t?"not-default":"default"}}s.shadowRoot=!1,s.this=l,t(s)})).then(t=>{n(t).then(t=>{(function(t){return new Promise(function(e,s){let i=document.createElement("style"),a=document.createElement("style"),n={};(n=t.slot?t.slot:t.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let e=0;e<t.type.length;e++)"swap"===t.type[e]?"scoped"===t.type[e]&&i.setAttribute("scoped",""):"scoped"===t.type[e]&&a.setAttribute("scoped","");for(let s=0;s<t.state.length;s++){switch(t[`path-style-${t.state[s]}`]=`@import '/static/html/components/${t.component}/${t.state[s]}/${t.component}.css'; @import '/static/html/components/${t.component}/${t.state[s]}/${t.component}-custom.css';`,t.state[s]){case"shadow":!0===t.verify.preset&&(t[`path-style-${t.state[s]}-preset`]=`@import '/static/html/components/${t.component}/template/${n}.css';`),i.innerText=t[`path-style-${t.state[s]}`]+t[`path-style-${t.state[s]}-preset`];break;case"light":!0===t.verify.preset&&(t[`path-style-${t.state[s]}-preset`]=`@import '/static/html/components/${t.component}/template/${n}.css';`),a.innerText=t[`path-style-${t.state[s]}`]+t[`path-style-${t.state[s]}-preset`]}"swap"===t.state[s]?!0===t.shadowRoot?(t.this.shadowRoot.appendChild(a),t.this.appendChild(i),e(t)):t.this.appendChild(i):!0===t.shadowRoot?(t.this.shadowRoot.appendChild(i),t.this.appendChild(a),e(t)):t.this.appendChild(a)}e(t)})})(t).then(t=>{!async function(t){let e=new((await sidebarRight({name:"telegram-sidebarRight"})).class);document.addEventListener("telegram-login-chat",async s=>{e.setUser(t,s.detail.data)}),document.addEventListener("PrivateChat",async s=>{e.rightPanel(t,s.detail.data.PrivateChat.RightPanel)}),document.addEventListener("telegram-RightPanel",async e=>{let s={};for(let t in e.detail.data.RightPanel)switch(t){case"getUserFullInfo":s.bio=e.detail.data.RightPanel[t].bio;break;case"getUser":s.fullName=`${e.detail.data.RightPanel[t].first_name} ${e.detail.data.RightPanel[t].last_name}`,s.status=e.detail.data.RightPanel[t].status._,s.username=e.detail.data.RightPanel[t].username,s.phoneNumber=`+${e.detail.data.RightPanel[t].phone_number}`,console.log("getUserFullInfo",e.detail.data.RightPanel[t]);break;case"getUserProfilePhotos":for(let i=0;i<e.detail.data.RightPanel[t].photos.length;i++)s.photo=e.detail.data.RightPanel[t].photos[i].sizes[1].photo.remote.id,console.log("~~~~~~",e.detail.data.RightPanel[t].photos[i].sizes[1].photo.remote.id);break;default:console.warn("необрабатываемое событие",t)}t.this.shadowRoot.querySelector("#preview").innerHTML="",t.this.shadowRoot.querySelector("#preview").insertAdjacentHTML("afterbegin",`\n             <div id="photo">\n                <img src="./static/images/no_image.jpg">\n            </div>\n            <div id="fullName">${s.fullName}</div>\n            <div id="status">${s.status}</div>\n          `),t.this.shadowRoot.querySelector("#info").innerHTML="",t.this.shadowRoot.querySelector("#info").insertAdjacentHTML("afterbegin",`\n            <div class="info">\n                <img src="./static/html/components/telegram-sidebar-right/images/info_svg.svg">\n                <div class="data">\n                    <p class="a">${s.bio}</p>\n                    <p class="b">Bio</p>\n                </div>\n            </div>\n            <div class="info">\n                <img src="./static/html/components/telegram-sidebar-right/images/username_svg.svg">\n                <div class="username">\n                    <p class="a">${s.username}</p>\n                    <p class="b">Username</p>\n                </div>\n            </div>\n            <div class="info">\n                <img src="./static/html/components/telegram-sidebar-right/images/phone_svg.svg">\n                <div class="phone">\n                    <p class="a">${s.phoneNumber}</p>\n                    <p class="b">Phone</p>\n                </div>\n            </div>\n            <div class="info">\n                <img src="./static/html/components/telegram-sidebar-right/images/checkboxon_svg.svg">\n                <div class="notifications">\n                    <p class="a">Notifications</p>\n                    <p class="b">Enabled</p>\n                </div>\n            </div>\n          `),t.this.shadowRoot.querySelector("#data").innerHTML="",t.this.shadowRoot.querySelector("#data").insertAdjacentHTML("afterbegin",' <div id="top"><slot name="telegram-sidebar-right-top"></slot></div>\n            <div id="userData">\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n                <div class="userData">\n                    <img src="./static/html/components/telegram-sidebar-right/images/pictures.png">\n                </div>\n            </div>')})}(t)})})})}attributeChangedCallback(t,e,s){this.disabled?(this.setAttribute("tabindex","-1"),this.setAttribute("aria-disabled","true")):(this.setAttribute("tabindex","0"),this.setAttribute("aria-disabled","false"))}});