import Editor from"/static/html/components/component_modules/varan-editor/varan-editor.mjs";import Store from"/static/html/components/component_modules/varan-store/varan-store.mjs";import matcher from"/static/html/components/component_modules/matcher/module.mjs";import pagination from"/static/html/components/component_modules/varan-pagination/varan-pagination.mjs";import Slider from"/static/html/components/component_modules/varan-slider/varan-slider.mjs";import Parser from"/static/html/components/component_modules/varan-editor/this/parser.mjs";import Object from"/static/html/components/component_modules/varan-object/varan-object.mjs";function colorLog(t,e,...l){switch(e=e||"black"){case"success":e="Green";break;case"info":e="DodgerBlue";break;case"error":e="Red";break;case"warning":e="Orange";break;case"events-out":e="blue"}console.log("%c"+t,"color:"+e,...l)}customElements.define("lacerta-video",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let t=[],e=[],l=[],s=[];function n(e,l){return new Promise(function(l,s){e.verify=[];let n={};n=e.slot?e.slot:e.parent,e.this.hasAttribute("preset")?0===e.this.getAttribute("preset").length?(e["path-template"]=`/static/html/components/${e.component}/template/${n}.html`,e.preset="default",e.verify.preset=!0):(e["path-template"]=`/static/html/components/${e.component}/template/${e.this.getAttribute("preset")}/${e.component}-${e.this.getAttribute("preset")}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0):(e["path-template"]=`/static/html/components/${e.component}/${e.component}.html`,e.verify.preset=!1),fetch(e["path-template"]).then(function(t){if(t.ok)return t.text()}).then(function(s){let n=(new DOMParser).parseFromString(s,"text/html");e.template=n.getElementsByTagName("template")[0].content.cloneNode(!0),function(e){return new Promise(function(l,s){e["path-external"]=`/static/html/components/${e.component}/external/${e.component}-external.html`,fetch(e["path-external"]).then(function(t){return!1===t.ok?t.ok:t.text()}).then(function(s){if(!1===s);else{let n=(new DOMParser).parseFromString(s,"text/html");e.external=n.querySelectorAll("section"),function(e){return new Promise(function(l,s){e["external-property"]=t["external-property"];let n=[],r=[],i=[];for(let t=0;t<e.external.length;t++){for(let l=0;l<e.external[t].children.length;l++)switch(e.external[t].children[l].tagName){case"SCRIPT":e.external[t].getAttribute("id")&&(r.script=e.external[t].children[l]);break;case"COMPONENT-ID":r.id=e.external[t].children[l].innerText;break;case"COMPONENT-ACTION":for(let s=0;s<e.external[t].children[l].children.length;s++)i.push(e.external[t].children[l].children[s].innerText);r.actions=i}n.push(r),r=[]}e["external-property"]=n,l(e)}).catch(t=>{})}(e).then(t=>{0===t["external-property"].length?l(t):function(t){return new Promise(function(e,l){t["words-action"]=[];let s=[];for(let l=0;l<t["external-property"].length;l++){for(let e=0;e<t["external-property"][l].actions.length;e++)for(let n=0;n<t.words.length;n++)-1!==t["external-property"][l].actions[e].indexOf(t.words[n])&&("shadowRoot"!==t.words[n]&&"shadow"!==t.words[e]||(s.shadow=!0),"light"!==t.words[n]&&"лайт"!==t.words[e]||(s.light=!0),"editor"===t.words[n]&&(s.editor=!0),"слайдер"===t.words[n]&&(s["editor-slider"]=!0),"swap"===t.words[n]&&(s.swap=!0));t["words-action"]=s;for(let e in t["external-property"])for(let l in t["external-property"][e])switch(l){case"id":let s=document.createElement(t["external-property"][e][l]);s.setAttribute("type","external"),t.this.appendChild(s)}e(t)}})}(t).then(t=>{l(t)})})}}).catch(t=>{throw t})})}(e).then(t=>{(function(t,e,l){return new Promise(function(e,l){t["template-shadow"]=[],t["template-light"]=[];let s=[];s.swap=!1,s.blog=!1,s.external=!1,s.light=!1,s.slider=!1,s.one=!1,s.sliderText=!1,s.text=!1;for(let e=0;e<t.type.length;e++){if(-1!==t.type[e].indexOf("slider")&&t.type[e].split("-").length>1){s.slider=!0;for(let l in t.type[e].split("-"))switch(t.type[e].split("-")[l]){case"one":s.one=!0}}if(t.type[e].length)if(t.type[e].split("-").length>1)switch(t.type[e].split("-")[0]){case"blog":s.blog=!0;break;default:console.log("типы не отслеживаются",t.type[e])}else switch(t.type[e]){case"swap":s.swap=!0;break;case"external":s.external=!0;break;case"light":s.light=!0;break;case"slider":s.slider=!0;break;case"sliderText":s.sliderText=!0;break;case"text":s.text=!0}}if(!0===s.swap){for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-light"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e],t),t["template-light"].push(t.this.children[e])):(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e],t),t["template-shadow"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-light"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e],t),t["template-light"].push(t.template.children[e])):(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e],t),t["template-shadow"].push(t.template.children[e]))}else{for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-shadow"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(r(t.this.children[e],t),t["template-shadow"].push(t.this.children[e])):(r(t.this.children[e],t),t["template-light"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-shadow"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(r(t.template.children[e],t),t["template-shadow"].push(t.template.children[e])):(r(t.template.children[e],t),t["template-light"].push(t.template.children[e]))}for(let e in s)t.verify[e]=s[e];!0===t.verify.slider?function(t){return new Promise(function(e,l){fetch(`/static/html/components/varan-slider/template/${t.slot}.html`).then(function(t){if(t.ok)return t.text()}).then(function(l){let s=(new DOMParser).parseFromString(l,"text/html");t.slider=s.getElementsByTagName("template")[0].content.cloneNode(!0);let n=document.createElement("section");n.className="slider",n.slot="view",n.appendChild(t.slider),t.slider=n,t["slider-template"]=n;for(let e=0;e<t.type.length;e++)"slider-one-text"===t.type[e]&&(t.verify.sliderText=!0);matcher.database.request.functions.getObject(t).then(t=>{t.get?(pagination.init(t),pagination.action(t).then(t=>{e(t)})):e(t)})}).catch(t=>t)})}(t).then(t=>{t["template-light"].push(t.slider),t.this.appendChild(t.slider),function(t,e){return new Promise(function(e,l){(function(t,e){return new Promise(function(l,s){for(let s=0;s<t.state.length;s++)for(let n=0;n<t[`template-${t.state[s]}`].length;n++)0===t[`template-${t.state[s]}`][n].getElementsByClassName(e).length||(t.slider=t[`template-${t.state[s]}`][n].getElementsByClassName(e)[0],l(t[`template-${t.state[s]}`][n].getElementsByClassName(e)[0]))})})(t,"peppermint").then(l=>{(function(t){return new Promise(function(e,l){e(Peppermint(t,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(t){}}))})})(l).then(l=>{t.slider=l,e(t)})}),e(t)})}(t).then(t=>{if(!0===t.verify.one)for(let l=0;l<t.state.length;l++)for(let s=0;s<t[`template-${t.state[l]}`].length;s++)"wall"===t[`template-${t.state[l]}`][s].className&&(t[`template-${t.state[l]}`].splice(s,1),e(t));else e(t)})}):e(t)})})(t,t["type-swap"],t["type-external"]).then(t=>{let e={};for(let l=0;l<t["template-light"].length;l++)"VARAN-MENU"===t["template-light"][l].tagName&&(e=t["template-light"].splice(l,1),t["template-light"].push(e[0]));if(!0===t.verify.swap){if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e=0;e<t["template-shadow"].length;e++)t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e=0;e<t["template-light"].length;e++)t.this.appendChild(t["template-light"][e])}else{if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e in t["template-shadow"])t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e in t["template-light"])t.this.appendChild(t["template-light"][e])}l(t)})})}).catch(t=>t)})}function r(t,e){return new Promise(function(l,s){let n=!1;for(let e=0;e<document.querySelectorAll("script").length;e++)-1!==document.querySelectorAll("script")[e].src.indexOf(t.tagName.toLowerCase())&&(n=!0);if(!0===n)console.log("модуль загружен");else{const n=document.createElement("script");!1===t.hasAttribute("import")||(n.type="module"),n.src=`/static/html/components/${t.tagName.toLowerCase()}/${t.tagName.toLowerCase()}.js`,n.setAttribute("async",""),n.onload=l,n.onerror=s,e.this.appendChild(n)}})}var i;e.push("component-id"),e.push("script"),e.push("component-action"),l.push("h1"),l.push("innerText"),s.push("shadowRoot"),s.push("head"),s.push("shadow"),s.push("light"),s.push("lightDom"),s.push("editor"),s.push("слайдер"),s.push("swap"),t.this=this,t["type-supported"]=l,(i=this,new Promise(function(t,e){let l=[];l.staticProperty=[],l.staticProperty.c=0,l.state=[],l.state.push("shadow"),l.state.push("light"),l.words=s,l["type-swap"]=!1,l["type-external"]=!1,l["document-offsetWidth"]=document.body.offsetWidth;let n=!1;if(l.getAttribute=((t,e,l)=>{if("template"===l){if(!t.getAttribute("type"))return t.setAttribute("type","default"),!1;for(let l=0;l<t.getAttribute("type").split("-").length;l++)t.getAttribute("type").split("-")[l]===e&&(n=!0);return n}if(t[`verify-${e}`]=!1,0===t.this.getAttribute("type").split("-").length)return!1;for(let l=0;l<t.this.getAttribute("type").split("-").length;l++)t.this.getAttribute("type").split("-")[l]===e?t[`verify-${e}`]=!0:t[`verify-${e}`]=!1;return console.assert(!1,t),t[`verify-${e}`]}),i.tagName.toLowerCase()&&(l.component=i.tagName.toLowerCase()),"object"!=typeof i);else{if(i.getAttribute("type")){l.type=i.getAttribute("type").split("-");for(let t=0;t<l.type.length;t++)l.type[t]=l.type[t].replace(/:/g,"-");for(let t in l.type)switch(l.type[t]){case"swap":l["type-swap"]=!0;break;case"external":l["type-external"]=!0}}else l.type=["default"],i.setAttribute("type","default");if(i.slot?l.slot=i.slot:(i.slot=i.tagName.toLowerCase(),l.slot=i.slot),i.getAttribute("type")){let t=!1;for(let e in i.getAttribute("type").split("-"))-1!==i.getAttribute("type").split("-")[e].indexOf("style:")&&(t=!0);l["style-custom"]=!0===t?"not-default":"default"}}l.shadowRoot=!1,l.this=i,t(l)})).then(t=>{n(t).then(t=>{(function(t){return new Promise(function(e,l){let s=document.createElement("style"),n=document.createElement("style"),r={};(r=t.slot?t.slot:t.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let e=0;e<t.type.length;e++)"swap"===t.type[e]?"scoped"===t.type[e]&&s.setAttribute("scoped",""):"scoped"===t.type[e]&&n.setAttribute("scoped","");for(let l=0;l<t.state.length;l++){switch(t[`path-style-${t.state[l]}`]=`@import '/static/html/components/${t.component}/${t.state[l]}/${t.component}.css'; @import '/static/html/components/${t.component}/${t.state[l]}/${t.component}-custom.css';`,t.state[l]){case"shadow":!0===t.verify.preset&&(t[`path-style-${t.state[l]}-preset`]=`@import '/static/html/components/${t.component}/template/${r}.css';`),s.innerText=t[`path-style-${t.state[l]}`]+t[`path-style-${t.state[l]}-preset`];break;case"light":!0===t.verify.preset&&(t[`path-style-${t.state[l]}-preset`]=`@import '/static/html/components/${t.component}/template/${r}.css';`),n.innerText=t[`path-style-${t.state[l]}`]+t[`path-style-${t.state[l]}-preset`]}"swap"===t.state[l]?!0===t.shadowRoot?(t.this.shadowRoot.appendChild(n),t.this.appendChild(s),e(t)):t.this.appendChild(s):!0===t.shadowRoot?(t.this.shadowRoot.appendChild(s),t.this.appendChild(n),e(t)):t.this.appendChild(n)}e(t)})})(t).then(t=>{!async function(t){}()})})})}});