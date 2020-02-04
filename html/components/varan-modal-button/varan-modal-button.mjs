customElements.define("varan-modal-button",class extends HTMLElement{static get observedAttributes(){return["feed"]}constructor(){super();let t=[],e=[],s=[],l=[];function r(e,s){return new Promise(function(s,l){if(e.verify=[],e.this.getAttribute("preset"))switch(e.this.getAttribute("preset")){case"default":e["path-template"]=`/static/html/components/${e.component}/template/${e.component}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0;break;default:e["path-template"]=`/static/html/components/${e.component}/template/${e.this.getAttribute("preset")}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0}else e["path-template"]=`/static/html/components/${e.component}/${e.component}.html`,e.verify.preset=!1;fetch(e["path-template"]).then(function(t){if(t.ok)return t.text()}).then(function(l){let r=(new DOMParser).parseFromString(l,"text/html");e.template=r.getElementsByTagName("template")[0].content.cloneNode(!0),function(e){return new Promise(function(s,l){e["path-external"]=`/static/html/components/${e.component}/external/${e.component}-external.html`,fetch(e["path-external"]).then(function(t){return!1===t.ok?t.ok:t.text()}).then(function(l){if(!1===l);else{let r=new DOMParser,i=r.parseFromString(l,"text/html");e.external=i.querySelectorAll("section"),function(e){return new Promise(function(s,l){e["external-property"]=t["external-property"];let r=[],i=[],n=[];for(let t=0;t<e.external.length;t++){for(let s=0;s<e.external[t].children.length;s++)switch(e.external[t].children[s].tagName){case"SCRIPT":e.external[t].getAttribute("id")&&(i.script=e.external[t].children[s]);break;case"COMPONENT-ID":i.id=e.external[t].children[s].innerText;break;case"COMPONENT-ACTION":for(let l=0;l<e.external[t].children[s].children.length;l++)n.push(e.external[t].children[s].children[l].innerText);i.actions=n}r.push(i),i=[]}e["external-property"]=r,s(e)}).catch(t=>{})}(e).then(t=>{0===t["external-property"].length?s(t):function(t){return new Promise(function(e,s){t["words-action"]=[];let l=[];for(let s=0;s<t["external-property"].length;s++){for(let e=0;e<t["external-property"][s].actions.length;e++)for(let r=0;r<t.words.length;r++)-1!==t["external-property"][s].actions[e].indexOf(t.words[r])&&("shadowRoot"!==t.words[r]&&"shadow"!==t.words[e]||(l.shadow=!0),"light"!==t.words[r]&&"лайт"!==t.words[e]||(l.light=!0),"editor"===t.words[r]&&(l.editor=!0),"слайдер"===t.words[r]&&(l["editor-slider"]=!0),"swap"===t.words[r]&&(l.swap=!0));t["words-action"]=l;for(let e in t["external-property"])for(let s in t["external-property"][e])switch(s){case"id":let l=document.createElement(t["external-property"][e][s]);l.setAttribute("type","external"),t.this.appendChild(l)}e(t)}})}(t).then(t=>{s(t)})})}}).catch(t=>{throw t})})}(e).then(t=>{(function(t,e,s){return new Promise(function(e,s){t["template-shadow"]=[],t["template-light"]=[];let l=[];l.swap=!1,l.blog=!1,l.external=!1,l.light=!1,l.slider=!1,l.one=!1,l.sliderText=!1,l.text=!1;for(let e=0;e<t.type.length;e++){if(-1!==t.type[e].indexOf("slider")&&t.type[e].split("-").length>1){l.slider=!0;for(let s in t.type[e].split("-"))switch(t.type[e].split("-")[s]){case"one":l.one=!0}}if(t.type[e].length)if(t.type[e].split("-").length>1)switch(t.type[e].split("-")[0]){case"blog":l.blog=!0;break;default:console.log("типы не отслеживаются",t.type[e])}else switch(t.type[e]){case"swap":l.swap=!0;break;case"external":l.external=!0;break;case"light":l.light=!0;break;case"slider":l.slider=!0;break;case"sliderText":l.sliderText=!0;break;case"text":l.text=!0}}if(t.this.getAttribute("parent")&&(t.parent=t.this.getAttribute("parent")),!0===l.swap){for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-light"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-light"].push(t.this.children[e])):(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-shadow"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-light"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-light"].push(t.template.children[e])):(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-shadow"].push(t.template.children[e]))}else{for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-shadow"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-shadow"].push(t.this.children[e])):(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.this.children[e],t),t["template-light"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-shadow"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-shadow"].push(t.template.children[e])):(!1===t.parent?t.slot?t.this.children[e].setAttribute("parent",`${t.slot}`):t.this.children[e].setAttribute("parent",`${t.component}`):t.this.children[e].setAttribute("parent",`${t.parent}`),i(t.template.children[e],t),t["template-light"].push(t.template.children[e]))}for(let e in l)t.verify[e]=l[e];e(t)})})(t,t["type-swap"],t["type-external"]).then(t=>{if(!0===t.verify.swap){if(0!==t["template-light"].length)for(let e=0;e<t["template-light"].length;e++)t.this.prepend(t["template-light"][e]);if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e=0;e<t["template-shadow"].length;e++)t.this.shadowRoot.appendChild(t["template-shadow"][e])}}else{if(0!==t["template-light"].length)for(let e in t["template-light"])t.this.appendChild(t["template-light"][e]);if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e in t["template-shadow"])t.this.shadowRoot.appendChild(t["template-shadow"][e])}}s(t)})})}).catch(t=>t)})}function i(t,e){return new Promise(function(s,l){let r=!1;for(let e=0;e<document.querySelectorAll("script").length;e++)-1!==document.querySelectorAll("script")[e].src.indexOf(t.tagName.toLowerCase())&&(r=!0);if(!0===r)console.log("модуль загружен");else{const r=document.createElement("script");r.src=`/static/html/components/${t.tagName.toLowerCase()}/${t.tagName.toLowerCase()}.mjs`,r.type="module",r.setAttribute("async",""),r.onload=s,r.onerror=l,e.this.appendChild(r)}})}var n;e.push("component-id"),e.push("script"),e.push("component-action"),s.push("h1"),s.push("innerText"),l.push("shadowRoot"),l.push("head"),l.push("shadow"),l.push("light"),l.push("lightDom"),l.push("editor"),l.push("слайдер"),l.push("swap"),t.this=this,t["type-supported"]=s,(n=this,new Promise(function(t,e){let s=[];s.staticProperty=[],s.staticProperty.c=0,s.state=[],s.state.push("shadow"),s.state.push("light"),s.words=l,s.parent=!1,s["type-swap"]=!1,s["type-external"]=!1,s["document-offsetWidth"]=document.body.offsetWidth;let r=!1;if(s.getAttribute=((t,e,s)=>{if("template"===s){if(!t.getAttribute("type"))return t.setAttribute("type","default"),!1;for(let s=0;s<t.getAttribute("type").split("-").length;s++)t.getAttribute("type").split("-")[s]===e&&(r=!0);return r}if(t[`verify-${e}`]=!1,0===t.this.getAttribute("type").split("-").length)return!1;for(let s=0;s<t.this.getAttribute("type").split("-").length;s++)t.this.getAttribute("type").split("-")[s]===e?t[`verify-${e}`]=!0:t[`verify-${e}`]=!1;return console.assert(!1,t),t[`verify-${e}`]}),n.tagName.toLowerCase()&&(s.component=n.tagName.toLowerCase()),"object"!=typeof n);else{if(n.getAttribute("type")){s.type=n.getAttribute("type").split("-");for(let t=0;t<s.type.length;t++)s.type[t]=s.type[t].replace(/:/g,"-");for(let t in s.type)switch(s.type[t]){case"swap":s["type-swap"]=!0;break;case"external":s["type-external"]=!0}}else s.type=["default"],n.setAttribute("type","default");if(n.slot?s.slot=n.slot:(n.slot=n.tagName.toLowerCase(),s.slot=n.slot),n.getAttribute("type")){let t=!1;for(let e in n.getAttribute("type").split("-"))-1!==n.getAttribute("type").split("-")[e].indexOf("style:")&&(t=!0);s["style-custom"]=!0===t?"not-default":"default"}}s.shadowRoot=!1,s.this=n,t(s)})).then(t=>{r(t).then(t=>{(function(t){return new Promise(function(e,s){let l=document.createElement("style"),r=document.createElement("style"),i={};(i=t.slot?t.slot:t.parent)||console.assert(!1,"не установленны ни слот ни парент");for(let e=0;e<t.type.length;e++)"swap"===t.type[e]?"scoped"===t.type[e]&&l.setAttribute("scoped",""):"scoped"===t.type[e]&&r.setAttribute("scoped","");for(let s=0;s<t.state.length;s++){switch(t[`path-style-${t.state[s]}`]=`@import '/static/html/components/${t.component}/${t.state[s]}/${t.component}.css'; @import '/static/html/components/${t.component}/${t.state[s]}/${t.component}-custom.css';`,t.state[s]){case"shadow":!0===t.verify.preset&&(t[`path-style-${t.state[s]}-preset`]=`@import '/static/html/components/${t.component}/template/${i}.css';`),l.innerText=t[`path-style-${t.state[s]}`]+t[`path-style-${t.state[s]}-preset`];break;case"light":!0===t.verify.preset&&(t[`path-style-${t.state[s]}-preset`]=`@import '/static/html/components/${t.component}/template/${i}.css';`),r.innerText=t[`path-style-${t.state[s]}`]+t[`path-style-${t.state[s]}-preset`]}"swap"===t.state[s]?!0===t.shadowRoot?(t.this.shadowRoot.appendChild(r),t.this.appendChild(l),e(t)):t.this.appendChild(l):!0===t.shadowRoot?(t.this.shadowRoot.appendChild(l),t.this.appendChild(r),e(t)):t.this.appendChild(r)}e(t)})})(t).then(t=>{!function(t){var e=!1;try{var s=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("testPassive",null,s),window.removeEventListener("testPassive",null,s)}catch(t){}t.this.addEventListener("click",e=>{let s={};if(o(e.timeStamp),(e.timeStamp-a>160||e.timeStamp-a==0)&&("button xlarge circle black"===e.target.getAttribute("class")||"btn btn-primary"===e.target.getAttribute("class"))){t.this.querySelector(".button").style.backgroundColor="black",t.this.querySelector(".button").disabled=!1;if("view"===t.this.getAttribute("mode"))t.this.setAttribute("mode","edit"),t.parent||console.assert(!1,"Установите obj[parent]",t),t.this.getElementsByTagName("p")[1].style.display="block",t.this.getElementsByTagName("p")[0].style.display="block",e.target.style.backgroundColor="#62bcd7",e.target.disabled=!0,s=new CustomEvent("mode",{detail:{mode:"edit",slot:t.parent}}),document.dispatchEvent(s);else{switch(t.parent||console.assert(!1,"Установите obj[parent]",t),t.this.setAttribute("mode","view"),t.this.getElementsByTagName("p")[0].className){case"view":t.this.getElementsByTagName("p")[0].style.display="block";break;case"edit":t.this.getElementsByTagName("p")[0].style.display="none";break;default:console.assert(!1,"неизвестный тип")}switch(t.this.getElementsByTagName("p")[1].className){case"view":t.this.getElementsByTagName("p")[1].style.display="block";break;case"edit":t.this.getElementsByTagName("p")[1].style.display="none";break;default:console.assert(!1,"неизвестный тип")}e.target.style.backgroundColor="#62bcd7",e.target.disabled=!0,s=new CustomEvent("mode",{detail:{mode:"none",slot:t.parent}}),document.dispatchEvent(s)}}a=e.timeStamp,setTimeout(function(){t.this.querySelector(".button").style.backgroundColor="black",t.this.querySelector(".button").disabled=!1;let e={},s=t.this.querySelectorAll("slot");for(let t=0;t<s.length;t++)if(0===s[t].length);else if(0===s[t].assignedNodes().length);else for(let l=0;l<s[t].assignedNodes().length;l++)switch(s[t].assignedNodes()[l].tagName){case"VARAN-CROP":e=s[t].assignedNodes()[l].parentNode;break;case"DIV":case"SECTION":"VARAN-EDITOR"===e.tagName||(e=s[t].assignedNodes()[l].parentNode);break;default:console.log(s[t].assignedNodes()[l].tagName)}},3e3)}),t.this.addEventListener("touchstart",t=>{},!!e&&{passive:!0})}(t)})})});let a=0;function o(t){a=t,o=function(t){return t}}}});