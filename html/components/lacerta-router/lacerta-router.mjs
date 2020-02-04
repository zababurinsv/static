import router from"/static/html/components/component_modules/router/router.mjs";import store from"/static/html/components/component_modules/staticProperty/staticProperty.mjs";customElements.define("lacerta-router",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let t=[],e=[],r=[],s=[];function l(e,r){return new Promise(function(r,s){if(e.verify=[],e.this.getAttribute("preset"))switch(e.this.getAttribute("preset")){case"default":e["path-template"]=`/static/html/components/${e.component}/template/${e.component}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0;break;default:e["path-template"]=`/static/html/components/${e.component}/template/${e.this.getAttribute("preset")}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0}else e["path-template"]=`/static/html/components/${e.component}/${e.component}.html`,e.verify.preset=!1;fetch(e["path-template"]).then(function(t){if(t.ok)return t.text()}).then(function(s){let l=(new DOMParser).parseFromString(s,"text/html");e.template=l.getElementsByTagName("template")[0].content.cloneNode(!0),function(e){return new Promise(function(r,s){e["path-external"]=`/static/html/components/${e.component}/external/${e.component}-external.html`,fetch(e["path-external"]).then(function(t){return!1===t.ok?t.ok:t.text()}).then(function(s){if(!1===s);else{let l=new DOMParser,i=l.parseFromString(s,"text/html");e.external=i.querySelectorAll("section"),function(e){return new Promise(function(r,s){e["external-property"]=t["external-property"];let l=[],i=[],n=[];for(let t=0;t<e.external.length;t++){for(let r=0;r<e.external[t].children.length;r++)switch(e.external[t].children[r].tagName){case"SCRIPT":e.external[t].getAttribute("id")&&(i.script=e.external[t].children[r]);break;case"COMPONENT-ID":i.id=e.external[t].children[r].innerText;break;case"COMPONENT-ACTION":for(let s=0;s<e.external[t].children[r].children.length;s++)n.push(e.external[t].children[r].children[s].innerText);i.actions=n}l.push(i),i=[]}e["external-property"]=l,r(e)}).catch(t=>{})}(e).then(t=>{0===t["external-property"].length?r(t):function(t){return new Promise(function(e,r){t["words-action"]=[];let s=[];for(let r=0;r<t["external-property"].length;r++){for(let e=0;e<t["external-property"][r].actions.length;e++)for(let l=0;l<t.words.length;l++)-1!==t["external-property"][r].actions[e].indexOf(t.words[l])&&("shadowRoot"!==t.words[l]&&"shadow"!==t.words[e]||(s.shadow=!0),"light"!==t.words[l]&&"лайт"!==t.words[e]||(s.light=!0),"editor"===t.words[l]&&(s.editor=!0),"слайдер"===t.words[l]&&(s["editor-slider"]=!0),"swap"===t.words[l]&&(s.swap=!0));t["words-action"]=s;for(let e in t["external-property"])for(let r in t["external-property"][e])switch(r){case"id":let s=document.createElement(t["external-property"][e][r]);s.setAttribute("type","external"),t.this.appendChild(s)}e(t)}})}(t).then(t=>{r(t)})})}}).catch(t=>{throw t})})}(e).then(t=>{(function(t,e,r){return new Promise(function(e,r){t["template-shadow"]=[],t["template-light"]=[];let s=[];s.swap=!1,s.blog=!1,s.external=!1,s.light=!1,s.slider=!1,s.one=!1,s.sliderText=!1,s.text=!1;for(let e=0;e<t.type.length;e++){if(-1!==t.type[e].indexOf("slider")&&t.type[e].split("-").length>1){s.slider=!0;for(let r in t.type[e].split("-"))switch(t.type[e].split("-")[r]){case"one":s.one=!0}}if(t.type[e].length)if(t.type[e].split("-").length>1)switch(t.type[e].split("-")[0]){case"blog":s.blog=!0;break;default:console.log("типы не отслеживаются",t.type[e])}else switch(t.type[e]){case"swap":s.swap=!0;break;case"external":s.external=!0;break;case"light":s.light=!0;break;case"slider":s.slider=!0;break;case"sliderText":s.sliderText=!0;break;case"text":s.text=!0}}if(t.this.getAttribute("parent")&&(t.parent=t.this.getAttribute("parent")),!0===s.swap){for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-light"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-light"].push(t.this.children[e])):(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-shadow"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-light"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-light"].push(t.template.children[e])):(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-shadow"].push(t.template.children[e]))}else{for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-shadow"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-shadow"].push(t.this.children[e])):(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-light"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-shadow"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-shadow"].push(t.template.children[e])):(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-light"].push(t.template.children[e]))}for(let e in s)t.verify[e]=s[e];e(t)})})(t,t["type-swap"],t["type-external"]).then(t=>{if(!0===t.verify.swap){if(0!==t["template-light"].length)for(let e=0;e<t["template-light"].length;e++)t.this.prepend(t["template-light"][e]);if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e=0;e<t["template-shadow"].length;e++)t.this.shadowRoot.appendChild(t["template-shadow"][e])}}else{if(0!==t["template-light"].length)for(let e in t["template-light"])t.this.appendChild(t["template-light"][e]);if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e in t["template-shadow"])t.this.shadowRoot.appendChild(t["template-shadow"][e])}}r(t)})})}).catch(t=>t)})}function i(t,e){return new Promise(function(r,s){let l=!1;for(let e=0;e<document.querySelectorAll("script").length;e++)-1!==document.querySelectorAll("script")[e].src.indexOf(t.tagName.toLowerCase())&&(l=!0);if(!0===l)console.log("модуль загружен");else{const l=document.createElement("script");l.src=`/static/html/components/${t.tagName.toLowerCase()}/${t.tagName.toLowerCase()}.mjs`,l.type="module",l.setAttribute("async",""),l.onload=r,l.onerror=s,e.this.appendChild(l)}})}var n;e.push("component-id"),e.push("script"),e.push("component-action"),r.push("h1"),r.push("innerText"),s.push("shadowRoot"),s.push("head"),s.push("shadow"),s.push("light"),s.push("lightDom"),s.push("editor"),s.push("слайдер"),s.push("swap"),t.this=this,t["type-supported"]=r,(n=this,new Promise(function(t,e){let r=[];r.staticProperty=[],r.staticProperty.c=0,r.state=[],r.state.push("shadow"),r.state.push("light"),r.words=s,r.parent=!1,r["type-swap"]=!1,r["type-external"]=!1,r["document-offsetWidth"]=document.body.offsetWidth;let l=!1;if(r.getAttribute=((t,e,r)=>{if("template"===r){if(!t.getAttribute("type"))return t.setAttribute("type","default"),!1;for(let r=0;r<t.getAttribute("type").split("-").length;r++)t.getAttribute("type").split("-")[r]===e&&(l=!0);return l}if(t[`verify-${e}`]=!1,0===t.this.getAttribute("type").split("-").length)return!1;for(let r=0;r<t.this.getAttribute("type").split("-").length;r++)t.this.getAttribute("type").split("-")[r]===e?t[`verify-${e}`]=!0:t[`verify-${e}`]=!1;return console.assert(!1,t),t[`verify-${e}`]}),n.tagName.toLowerCase()&&(r.component=n.tagName.toLowerCase()),"object"!=typeof n);else{if(n.getAttribute("type")){r.type=n.getAttribute("type").split("-");for(let t=0;t<r.type.length;t++)r.type[t]=r.type[t].replace(/:/g,"-");for(let t in r.type)switch(r.type[t]){case"swap":r["type-swap"]=!0;break;case"external":r["type-external"]=!0}}else r.type=["default"],n.setAttribute("type","default");if(n.slot?r.slot=n.slot:(n.slot=n.tagName.toLowerCase(),r.slot=n.slot),n.getAttribute("type")){let t=!1;for(let e in n.getAttribute("type").split("-"))-1!==n.getAttribute("type").split("-")[e].indexOf("style:")&&(t=!0);r["style-custom"]=!0===t?"not-default":"default"}}r.shadowRoot=!1,r.this=n,t(r)})).then(t=>{l(t).then(t=>{(function(t){return new Promise(function(e,r){let s=document.createElement("style"),l=document.createElement("style"),i={};(i=t.slot?t.slot:t.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let e=0;e<t.type.length;e++)"swap"===t.type[e]?"scoped"===t.type[e]&&s.setAttribute("scoped",""):"scoped"===t.type[e]&&l.setAttribute("scoped","");for(let r=0;r<t.state.length;r++){switch(t[`path-style-${t.state[r]}`]=`@import '/static/html/components/${t.component}/${t.state[r]}/${t.component}.css'; @import '/static/html/components/${t.component}/${t.state[r]}/${t.component}-custom.css';`,t.state[r]){case"shadow":!0===t.verify.preset&&(t[`path-style-${t.state[r]}-preset`]=`@import '/static/html/components/${t.component}/template/${i}.css';`),s.innerText=t[`path-style-${t.state[r]}`]+t[`path-style-${t.state[r]}-preset`];break;case"light":!0===t.verify.preset&&(t[`path-style-${t.state[r]}-preset`]=`@import '/static/html/components/${t.component}/template/${i}.css';`),l.innerText=t[`path-style-${t.state[r]}`]+t[`path-style-${t.state[r]}-preset`]}"swap"===t.state[r]?!0===t.shadowRoot?(t.this.shadowRoot.appendChild(l),t.this.appendChild(s),e(t)):t.this.appendChild(s):!0===t.shadowRoot?(t.this.shadowRoot.appendChild(s),t.this.appendChild(l),e(t)):t.this.appendChild(l)}e(t)})})(t).then(t=>{!async function(t){await store({input:"lacerta-router",this:t.this,type:"obj"},"set_n","type"),router({input:"varan-router",this:t.this,type:"listener"},"link","type")}(t)})})})}});