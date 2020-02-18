import Authtorization from"/static/html/components/component_modules/authtorization/authtorization.mjs";import ConsoleLogHTML from"/static/html/components/component_modules/console/console.mjs";import google from"/static/html/components/component_modules/google/google.mjs";import github from"/static/html/components/component_modules/github/github.mjs";customElements.define("web3-authorization-google",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let e=[],t=[],o=[],l=[];function i(e,t,o){return new Promise(function(t,o){e["template-shadow"]=[],e["template-light"]=[];let l=[];l.swap=!1,l.blog=!1,l.external=!1,l.light=!1,l.slider=!1,l.one=!1,l.sliderText=!1,l.text=!1;for(let t=0;t<e.type.length;t++){if(-1!==e.type[t].indexOf("slider")&&e.type[t].split("-").length>1){l.slider=!0;for(let o in e.type[t].split("-"))switch(e.type[t].split("-")[o]){case"one":l.one=!0}}if(e.type[t].length)if(e.type[t].split("-").length>1)switch(e.type[t].split("-")[0]){case"blog":l.blog=!0;break;default:console.log("типы не отслеживаются",e.type[t])}else switch(e.type[t]){case"swap":l.swap=!0;break;case"external":l.external=!0;break;case"light":l.light=!0;break;case"slider":l.slider=!0;break;case"sliderText":l.sliderText=!0;break;case"text":l.text=!0}}if(!0===l.swap){for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-light"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),s(e.this.children[t],e),e["template-light"].push(e.this.children[t])):(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),s(e.this.children[t],e),e["template-shadow"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-light"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),s(e.template.children[t],e),e["template-light"].push(e.template.children[t])):(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),s(e.template.children[t],e),e["template-shadow"].push(e.template.children[t]))}else{for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-shadow"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(s(e.this.children[t],e),e["template-shadow"].push(e.this.children[t])):(s(e.this.children[t],e),e["template-light"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-shadow"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(s(e.template.children[t],e),e["template-shadow"].push(e.template.children[t])):(s(e.template.children[t],e),e["template-light"].push(e.template.children[t]))}for(let t in l)e.verify[t]=l[t];!0===e.verify.slider?function(e){return new Promise(function(t,o){fetch(`/static/html/components/varan-slider/template/${e.slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(o){let l=new DOMParser,i=l.parseFromString(o,"text/html");e.slider=i.getElementsByTagName("template")[0].content.cloneNode(!0);let r=document.createElement("section");r.className="slider",r.slot="view",r.appendChild(e.slider),e.slider=r,e["slider-template"]=r;for(let t=0;t<e.type.length;t++)"slider-one-text"===e.type[t]&&(e.verify.sliderText=!0);matcher.database.request.functions.getObject(e).then(e=>{e.get?(pagination.init(e),pagination.action(e).then(e=>{t(e)})):t(e)})}).catch(e=>e)})}(e).then(e=>{e["template-light"].push(e.slider),e.this.appendChild(e.slider),function(e,t){return new Promise(function(o,l){if(t){switch(t){case"slider":(function(e,t){return new Promise(function(o,l){for(let l=0;l<e.state.length;l++)for(let i=0;i<e[`template-${e.state[l]}`].length;i++)0===e[`template-${e.state[l]}`][i].getElementsByClassName(t).length||(e.slider=e[`template-${e.state[l]}`][i].getElementsByClassName(t)[0],o(e[`template-${e.state[l]}`][i].getElementsByClassName(t)[0]))})})(e,"peppermint").then(t=>{(function(e){return new Promise(function(t,o){t(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){}}))})})(t).then(t=>{e.slider=t,o(e)})})}o(e)}else o(e)})}(e,"slider").then(e=>{if(!0===e.verify.one)for(let o=0;o<e.state.length;o++)for(let l=0;l<e[`template-${e.state[o]}`].length;l++)"wall"===e[`template-${e.state[o]}`][l].className&&(e[`template-${e.state[o]}`].splice(l,1),t(e));else t(e)})}):t(e)})}function r(t,o){return new Promise(function(o,l){t.verify=[];let r={};r=t.slot?t.slot:t.parent,t.this.hasAttribute("preset")?0===t.this.getAttribute("preset").length?(t["path-template"]=`/static/html/components/${t.component}/template/${r}.html`,t.preset="default",t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/template/${t.this.getAttribute("preset")}/${t.component}-${t.this.getAttribute("preset")}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/${t.component}.html`,t.verify.preset=!1),fetch(t["path-template"]).then(function(e){if(e.ok)return e.text()}).then(function(l){let r=(new DOMParser).parseFromString(l,"text/html");t.template=r.getElementsByTagName("template")[0].content.cloneNode(!0),function(t){return new Promise(function(o,l){t["path-external"]=`/static/html/components/${t.component}/external/${t.component}-external.html`,fetch(t["path-external"]).then(function(e){return!1===e.ok?e.ok:e.text()}).then(function(l){if(!1===l);else{let i=new DOMParser,r=i.parseFromString(l,"text/html");t.external=r.querySelectorAll("section"),function(t){return new Promise(function(o,l){t["external-property"]=e["external-property"];let i=[],r=[],s=[];for(let e=0;e<t.external.length;e++){for(let o=0;o<t.external[e].children.length;o++)switch(t.external[e].children[o].tagName){case"SCRIPT":t.external[e].getAttribute("id")&&(r.script=t.external[e].children[o]);break;case"COMPONENT-ID":r.id=t.external[e].children[o].innerText;break;case"COMPONENT-ACTION":for(let l=0;l<t.external[e].children[o].children.length;l++)s.push(t.external[e].children[o].children[l].innerText);r.actions=s}i.push(r),r=[]}t["external-property"]=i,o(t)}).catch(e=>{})}(t).then(e=>{0===e["external-property"].length?o(e):function(e){return new Promise(function(t,o){e["words-action"]=[];let l=[];for(let o=0;o<e["external-property"].length;o++){for(let t=0;t<e["external-property"][o].actions.length;t++)for(let i=0;i<e.words.length;i++)-1!==e["external-property"][o].actions[t].indexOf(e.words[i])&&("shadowRoot"!==e.words[i]&&"shadow"!==e.words[t]||(l.shadow=!0),"light"!==e.words[i]&&"лайт"!==e.words[t]||(l.light=!0),"editor"===e.words[i]&&(l.editor=!0),"слайдер"===e.words[i]&&(l["editor-slider"]=!0),"swap"===e.words[i]&&(l.swap=!0));e["words-action"]=l;for(let t in e["external-property"])for(let o in e["external-property"][t])switch(o){case"id":let l=document.createElement(e["external-property"][t][o]);l.setAttribute("type","external"),e.this.appendChild(l)}t(e)}})}(e).then(e=>{o(e)})})}}).catch(e=>{throw e})})}(t).then(e=>{i(e,e["type-swap"],e["type-external"]).then(e=>{let t={};for(let o=0;o<e["template-light"].length;o++)"VARAN-MENU"===e["template-light"][o].tagName&&(t=e["template-light"].splice(o,1),e["template-light"].push(t[0]));if(!0===e.verify.swap){if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t=0;t<e["template-shadow"].length;t++)e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t=0;t<e["template-light"].length;t++)e.this.appendChild(e["template-light"][t])}else{if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t in e["template-shadow"])e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t in e["template-light"])e.this.appendChild(e["template-light"][t])}o(e)})})}).catch(e=>e)})}function s(e,t){return new Promise(function(o,l){let i=!1;for(let t=0;t<document.querySelectorAll("script").length;t++)-1!==document.querySelectorAll("script")[t].src.indexOf(e.tagName.toLowerCase())&&(i=!0);if(!0===i)console.log("модуль загружен");else{const i=document.createElement("script");i.type="module",i.src=`./static/html/components/${e.tagName.toLowerCase()}/${e.tagName.toLowerCase()}.mjs`,i.setAttribute("async",""),i.onload=o,i.onerror=l,t.this.appendChild(i)}})}var n;t.push("component-id"),t.push("script"),t.push("component-action"),o.push("h1"),o.push("innerText"),l.push("shadowRoot"),l.push("head"),l.push("shadow"),l.push("light"),l.push("lightDom"),l.push("editor"),l.push("слайдер"),l.push("swap"),e.this=this,e["type-supported"]=o,(n=this,new Promise(function(e,t){let o=[];o.staticProperty=[],o.staticProperty.c=0,o.state=[],o.state.push("shadow"),o.state.push("light"),o.words=l,o["type-swap"]=!1,o["type-external"]=!1,o["document-offsetWidth"]=document.body.offsetWidth;let i=!1;if(o.getAttribute=((e,t,o)=>{if("template"===o){if(!e.getAttribute("type"))return e.setAttribute("type","default"),!1;for(let o=0;o<e.getAttribute("type").split("-").length;o++)e.getAttribute("type").split("-")[o]===t&&(i=!0);return i}if(e[`verify-${t}`]=!1,0===e.this.getAttribute("type").split("-").length)return!1;for(let o=0;o<e.this.getAttribute("type").split("-").length;o++)e.this.getAttribute("type").split("-")[o]===t?e[`verify-${t}`]=!0:e[`verify-${t}`]=!1;return console.assert(!1,e),e[`verify-${t}`]}),n.tagName.toLowerCase()&&(o.component=n.tagName.toLowerCase()),"object"!=typeof n);else{if(n.getAttribute("type")){o.type=n.getAttribute("type").split("-");for(let e=0;e<o.type.length;e++)o.type[e]=o.type[e].replace(/:/g,"-");for(let e in o.type)switch(o.type[e]){case"swap":o["type-swap"]=!0;break;case"external":o["type-external"]=!0}}else o.type=["default"],n.setAttribute("type","default");if(n.slot?o.slot=n.slot:(n.slot=n.tagName.toLowerCase(),o.slot=n.slot),n.getAttribute("type")){let e=!1;for(let t in n.getAttribute("type").split("-"))-1!==n.getAttribute("type").split("-")[t].indexOf("style:")&&(e=!0);o["style-custom"]=!0===e?"not-default":"default"}}o.shadowRoot=!1,o.this=n,e(o)})).then(e=>{r(e).then(e=>{(function(e){return new Promise(function(t,o){let l=document.createElement("style"),i=document.createElement("style"),r={};(r=e.slot?e.slot:e.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let t=0;t<e.type.length;t++)"swap"===e.type[t]?"scoped"===e.type[t]&&l.setAttribute("scoped",""):"scoped"===e.type[t]&&i.setAttribute("scoped","");for(let o=0;o<e.state.length;o++){switch(e[`path-style-${e.state[o]}`]=`@import '/static/html/components/${e.component}/${e.state[o]}/${e.component}.css'; @import '/static/html/components/${e.component}/${e.state[o]}/${e.component}-custom.css';`,e.state[o]){case"shadow":!0===e.verify.preset&&(e[`path-style-${e.state[o]}-preset`]=`@import '/static/html/components/${e.component}/template/${r}.css';`),l.innerText=e[`path-style-${e.state[o]}`]+e[`path-style-${e.state[o]}-preset`];break;case"light":!0===e.verify.preset&&(e[`path-style-${e.state[o]}-preset`]=`@import '/static/html/components/${e.component}/template/${r}.css';`),i.innerText=e[`path-style-${e.state[o]}`]+e[`path-style-${e.state[o]}-preset`]}"swap"===e.state[o]?!0===e.shadowRoot?(e.this.shadowRoot.appendChild(i),e.this.appendChild(l),t(e)):e.this.appendChild(l):!0===e.shadowRoot?(e.this.shadowRoot.appendChild(l),e.this.appendChild(i),t(e)):e.this.appendChild(i)}t(e)})})(e).then(e=>{!async function(e){ConsoleLogHTML.connect(document.body.querySelector("#console"));let t={};t.repository=(async t=>{e.this.shadowRoot.querySelector("div.data").insertAdjacentHTML("afterbegin",`\n                ${t.data.repository.descriptionHTML}\n                 <div>isPrivate: ${t.data.repository.isPrivate}</div>\n               `),e.this.shadowRoot.querySelector("[for=file]").style.display="flex"}),t.file=(async t=>{e.this.shadowRoot.querySelector("div.file").insertAdjacentHTML("afterbegin",`\n             <p>files</p>\n             <ol>\n                <li>name:${t.name}</li>\n                <li>download_url:${t.download_url}</li>\n                <li>encoding:${t.encoding}</li>\n             </ol>`),e.this.shadowRoot.querySelector("div.save").insertAdjacentHTML("afterbegin",`<p>Content</p><div>${t.content}</div>`),e.this.shadowRoot.querySelector("#save").style.display="flex",e.this.shadowRoot.querySelector("#sendToGitHub").style.display="flex"}),e.this.shadowRoot.querySelector("button.sendToGitHub").addEventListener("click",async t=>{let o=e.this.querySelector("directory-list"),l=o.shadowRoot.querySelector("ul.directory-list").id;await google({_:"sendToGitHub",sendToGitHub:l})}),document.addEventListener("textToGitHub",async t=>{e.this.shadowRoot.querySelector("div.save").innerHTML="";let o=t.detail.content,l=await github({_:"getfile",getfile:`${localStorage.getItem("file")}`,repo:`${localStorage.getItem("repository")}`});o=await github({_:"encoder",encoder:`${o}`}),await github({_:"save",save:`${o}`,repo:`${localStorage.getItem("repository")}`,file:`${localStorage.getItem("file")}`,sha:`${l.sha}`}),(l=await github({_:"getfile",getfile:`${localStorage.getItem("file")}`,repo:`${localStorage.getItem("repository")}`})).content=await github({_:"decoder",decoder:`${l.content}`}),e.this.shadowRoot.querySelector("div.save").insertAdjacentHTML("afterbegin",`<p>Content</p><div>${l.content}</div>`)}),e.this.shadowRoot.querySelector("#repository").addEventListener("click",async o=>{e.this.shadowRoot.querySelector("div.data").innerHTML="";let l=o.target.parentNode.querySelector("input#repos").value,i=await github({_:"get",repo:`${l}`});if("undefined"!==i.errors&&void 0!==i.errors){if("NOT_FOUND"===i.errors[0].type&&window.confirm("Repository not found. Do you create repository ?")){await github({_:"create",create:`${l}`});i=await github({_:"get",repo:`${l}`}),localStorage.setItem("repository",l),await t.repository(i)}}else localStorage.setItem("repository",l),await t.repository(i)}),e.this.shadowRoot.querySelector("button.file").addEventListener("click",async o=>{e.this.shadowRoot.querySelector("div.file").innerHTML="";let l=o.target.parentNode.querySelector("input#file").value,i=await github({_:"getfile",getfile:`${l}`,repo:`${localStorage.getItem("repository")}`});if("Not Found"===i.message){if(window.confirm("File not found. Do you want create file ?")){await github({_:"file",file:`${l}`,repo:`${localStorage.getItem("repository")}`});let e=await github({_:"getfile",getfile:`${l}`,repo:`${localStorage.getItem("repository")}`});e.content=await github({_:"decoder",decoder:`${e.content}`}),await t.file(e),localStorage.setItem("file",l)}}else i.content=await github({_:"decoder",decoder:`${i.content}`}),await t.file(i),localStorage.setItem("file",l)}),document.addEventListener("signOut",async t=>{e.this.shadowRoot.querySelector("div.folder")&&(e.this.shadowRoot.querySelector("div.folder").innerHTML="")}),e.this.shadowRoot.querySelector("#singOutGitHub").addEventListener("click",async t=>{localStorage.removeItem("github"),localStorage.removeItem("login"),localStorage.removeItem("avatar_url"),localStorage.removeItem("name"),localStorage.removeItem("html_url"),e.this.shadowRoot.querySelector("#authGithub").style.display="flex",e.this.shadowRoot.querySelector("#singOutGitHub").style.display="none",e.this.shadowRoot.querySelector("img.avatar").src="#",e.this.shadowRoot.querySelector("div.data").innerHTML="",e.this.shadowRoot.querySelector("div.info").innerHTML="",e.this.shadowRoot.querySelector("div#user").style.display="none",e.this.shadowRoot.querySelector("[for=repos]").style.display="none"}),document.addEventListener("github",async t=>{let o=await github({_:"init",init:t.detail.key});e.this.shadowRoot.querySelector("img.avatar").src=`${o.avatar_url}`,o.error?void 0===o.status?console.log("~~~~~~~~~~~",o.error):console.assert(!1,o):(e.this.shadowRoot.querySelector("div#user").style.display="flex",e.this.shadowRoot.querySelector("[for=repos]").style.display="flex",e.this.shadowRoot.querySelector("#authGithub").style.display="none",e.this.shadowRoot.querySelector("#singOutGitHub").style.display="flex")});let o=localStorage.getItem("github");o?(e.this.shadowRoot.querySelector("#authGithub").style.display="none",e.this.shadowRoot.querySelector("#singOutGitHub").style.display="flex",document.dispatchEvent(new CustomEvent("github",{detail:{_:"button",key:o}}))):(e.this.shadowRoot.querySelector("#authGithub").style.display="flex",e.this.shadowRoot.querySelector("#singOutGitHub").style.display="none");e.this.shadowRoot.querySelector("#authGithub").addEventListener("click",async e=>{document.dispatchEvent(new CustomEvent("github",{detail:{_:"button",key:e.target.parentNode.querySelector("input#password").value}}))}),document.addEventListener("directory-list",async()=>{await google({_:"init",parent:"root",obj:e})}),e.this.shadowRoot.querySelector("button.GoogleFolder").addEventListener("click",async t=>{let o=t.target.parentNode.querySelector("#GoogleFolder");if(0===o.length)console.warn("введите название");else{let t=await google({_:"folder",parent:o.value,previous:o.value,folder:o.value});if(void 0===t){let t=e.this.querySelector("directory-list");t.shadowRoot.querySelector("li.rootFolder").innerHTML="",t.shadowRoot.querySelector("ul.directory-list").id=void 0,t.shadowRoot.querySelector("li.rootFolder").insertAdjacentHTML("beforeend",'\n            folder not found<ul class="rootFolder"></ul>')}else document.dispatchEvent(new CustomEvent("signInGoogle",{detail:{_:t._,parent:t.parent,id:t.id,previous:t.previous,files:t.files}}))}})}(e)})})})}connectedCallback(){console.log("connected callback")}disconnectedCallback(){console.log("disconnected callback")}componentWillMount(){console.log("component will mount")}componentDidMount(){console.log("component did mount")}componentWillUnmount(){console.log("component will unmount")}componentDidUnmount(){console.log("component did unmount")}});