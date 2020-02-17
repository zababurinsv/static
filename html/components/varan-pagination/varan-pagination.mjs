customElements.define("varan-pagination",class extends HTMLElement{constructor(){super();let t=[],e=[],l=[],n=[];function s(e,l){return new Promise(function(l,n){e.verify=[],e.this.getAttribute("preset")?(e["path-template"]=`/static/html/components/${e.component}/template/${e.this.getAttribute("preset")}/${e.component}-${e.this.getAttribute("preset")}.html`,e.preset=`${e.this.getAttribute("preset")}`,e.verify.preset=!0):(e["path-template"]=`/static/html/components/${e.component}/${e.component}.html`,e.verify.preset=!1),fetch(e["path-template"]).then(function(t){if(t.ok)return t.text()}).then(function(n){let s=(new DOMParser).parseFromString(n,"text/html");e.template=s.getElementsByTagName("template")[0].content.cloneNode(!0),function(e){return new Promise(function(l,n){e["path-external"]=`/static/html/components/${e.component}/external/${e.component}-external.html`,fetch(e["path-external"]).then(function(t){return!1===t.ok?t.ok:t.text()}).then(function(n){if(!1===n);else{let s=(new DOMParser).parseFromString(n,"text/html");e.external=s.querySelectorAll("section"),function(e){return new Promise(function(l,n){e["external-property"]=t["external-property"];let s=[],r=[],i=[];for(let t=0;t<e.external.length;t++){for(let l=0;l<e.external[t].children.length;l++)switch(e.external[t].children[l].tagName){case"SCRIPT":e.external[t].getAttribute("id")&&(r.script=e.external[t].children[l]);break;case"COMPONENT-ID":r.id=e.external[t].children[l].innerText;break;case"COMPONENT-ACTION":for(let n=0;n<e.external[t].children[l].children.length;n++)i.push(e.external[t].children[l].children[n].innerText);r.actions=i}s.push(r),r=[]}e["external-property"]=s,l(e)}).catch(t=>{})}(e).then(t=>{0===t["external-property"].length?l(t):function(t){return new Promise(function(e,l){t["words-action"]=[];let n=[];for(let l=0;l<t["external-property"].length;l++){for(let e=0;e<t["external-property"][l].actions.length;e++)for(let s=0;s<t.words.length;s++)-1!==t["external-property"][l].actions[e].indexOf(t.words[s])&&("shadowRoot"!==t.words[s]&&"shadow"!==t.words[e]||(n.shadow=!0),"light"!==t.words[s]&&"лайт"!==t.words[e]||(n.light=!0),"editor"===t.words[s]&&(n.editor=!0),"слайдер"===t.words[s]&&(n["editor-slider"]=!0),"swap"===t.words[s]&&(n.swap=!0));t["words-action"]=n;for(let e in t["external-property"])for(let l in t["external-property"][e])switch(l){case"id":let n=document.createElement(t["external-property"][e][l]);n.setAttribute("type","external"),t.this.appendChild(n)}e(t)}})}(t).then(t=>{l(t)})})}}).catch(t=>{throw t})})}(e).then(t=>{(function(t,e,l){return new Promise(function(e,l){t["template-shadow"]=[],t["template-light"]=[];let n=[];n.swap=!1,n.external=!1,n.light=!1,n.slider=!1,n.one=!1;for(let e=0;e<t.type.length;e++){if(-1!==t.type[e].indexOf("slider")&&t.type[e].split("-").length>1){n.slider=!0;for(let l in t.type[e].split("-"))switch(t.type[e].split("-")[l]){case"one":n.one=!0}}if(t.type[e].length)switch(t.type[e]){case"swap":n.swap=!0;break;case"external":n.external=!0;break;case"light":n.light=!0;break;case"slider":n.slider=!0}}if(!0===n.swap){for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-light"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e]),t["template-light"].push(t.this.children[e])):(t.this.children[e].setAttribute("type",`${t.this.children[e].getAttribute("type")}-external`),r(t.this.children[e]),t["template-shadow"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-light"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e]),t["template-light"].push(t.template.children[e])):(t.template.children[e].setAttribute("type",`${t.template.children[e].getAttribute("type")}-external`),r(t.template.children[e]),t["template-shadow"].push(t.template.children[e]))}else{for(let e=0;e<t.this.children.length;e++)1===t.this.children[e].tagName.split("-").length?("view"===t.this.children[e].slot&&(t.this.children[e].className="wall"),t["template-shadow"].push(t.this.children[e])):!0===t.getAttribute(t.this.children[e],"light","template")?(r(t.this.children[e]),t["template-shadow"].push(t.this.children[e])):(r(t.this.children[e]),t["template-light"].push(t.this.children[e]));for(let e=0;e<t.template.children.length;e++)1===t.template.children[e].tagName.split("-").length?("view"===t.template.children[e].slot&&(t.template.children[e].className="wall"),t["template-shadow"].push(t.template.children[e])):!0===t.getAttribute(t.template.children[e],"light","template")?(r(t.template.children[e]),t["template-shadow"].push(t.template.children[e])):(r(t.template.children[e]),t["template-light"].push(t.template.children[e]))}for(let e in n)t.verify[e]=n[e];!0===t.verify.slider?function(t){return new Promise(function(e,l){fetch(`/static/html/components/varan-slider/template/${t.slot}.html`).then(function(t){if(t.ok)return t.text()}).then(function(l){let n=(new DOMParser).parseFromString(l,"text/html");t.slider=n.getElementsByTagName("template")[0].content.cloneNode(!0);let s=document.createElement("section");if(s.className="slider",s.slot="view",s.appendChild(t.slider),t.slider=s,0===s.querySelectorAll(".ql-editor").length)e(t);else for(let t=0;t<s.querySelectorAll(".ql-editor").length;t++)if(0===s.querySelectorAll(".ql-editor")[t].children.length);else for(let e=0;e<s.querySelectorAll(".ql-editor")[t].children.length;e++)s.querySelectorAll(".ql-editor")[t].children[e].tagName.split("-").length>1&&r(s.querySelectorAll(".ql-editor")[t].children[e]);e(t)}).catch(t=>t)})}(t).then(t=>{t["template-light"].push(t.slider),t.this.appendChild(t.slider),function(t,e,l){return new Promise(function(e,l){(function(t,e){return new Promise(function(l,n){for(let n=0;n<t.state.length;n++)for(let s=0;s<t[`template-${t.state[n]}`].length;s++)0===t[`template-${t.state[n]}`][s].getElementsByClassName(e).length||(t.slider=t[`template-${t.state[n]}`][s].getElementsByClassName(e)[0],l(t[`template-${t.state[n]}`][s].getElementsByClassName(e)[0]))})})(t,"peppermint").then(l=>{(function(t){return new Promise(function(e,l){e(Peppermint(t,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(t){}}))})})(l).then(l=>{t.slider=l,e(t)})}),e(t)})}(t).then(t=>{if(!0===t.verify.one)for(let l=0;l<t.state.length;l++)for(let n=0;n<t[`template-${t.state[l]}`].length;n++)"wall"===t[`template-${t.state[l]}`][n].className&&(t[`template-${t.state[l]}`].splice(n,1),e(t));else e(t)})}):e(t)})})(t,t["type-swap"],t["type-external"]).then(t=>{if(!0===t.verify.swap){if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e=0;e<t["template-shadow"].length;e++)t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e=0;e<t["template-light"].length;e++)t.this.appendChild(t["template-light"][e])}else{if(0!==t["template-shadow"].length){t.this.attachShadow({mode:"open"}),t.shadowRoot=!0;for(let e in t["template-shadow"])t.this.shadowRoot.appendChild(t["template-shadow"][e])}if(0!==t["template-light"].length)for(let e in t["template-light"])t.this.appendChild(t["template-light"][e])}l(t)})})}).catch(t=>t)})}function r(t){return new Promise(function(e,l){const n=document.createElement("script");let s=!1;for(let e in document.head.getElementsByTagName("script"))"object"==typeof document.head.getElementsByTagName("script")[e]&&-1!==document.head.getElementsByTagName("script")[e].outerHTML.indexOf(t.tagName.toLowerCase())&&(s=!0);!0===s||(n.src=`/static/html/components/${t.tagName.toLowerCase()}/${t.tagName.toLowerCase()}.js`,n.onload=e,n.onerror=l,document.head.appendChild(n))})}var i;e.push("component-id"),e.push("script"),e.push("component-action"),l.push("h1"),l.push("innerText"),n.push("shadowRoot"),n.push("head"),n.push("shadow"),n.push("light"),n.push("lightDom"),n.push("editor"),n.push("слайдер"),n.push("swap"),t.this=this,t["type-supported"]=l,(i=this,new Promise(function(t,e){let l=[];l.state=[],l.state.push("shadow"),l.state.push("light"),l.words=n,l["type-swap"]=!1,l["type-external"]=!1,l["document-offsetWidth"]=document.body.offsetWidth;let s=!1;if(l.getAttribute=((t,e,l)=>{if("template"===l){if(!t.getAttribute("type"))return t.setAttribute("type","default"),!1;for(let l=0;l<t.getAttribute("type").split("-").length;l++)t.getAttribute("type").split("-")[l]===e&&(s=!0);return s}if(t[`verify-${e}`]=!1,0===t.this.getAttribute("type").split("-").length)return!1;for(let l=0;l<t.this.getAttribute("type").split("-").length;l++)t.this.getAttribute("type").split("-")[l]===e?t[`verify-${e}`]=!0:t[`verify-${e}`]=!1;return t[`verify-${e}`]}),i.tagName.toLowerCase()&&(l.component=i.tagName.toLowerCase()),"object"!=typeof i);else{if(i.getAttribute("type")){l.type=i.getAttribute("type").split("-");for(let t=0;t<l.type.length;t++)l.type[t]=l.type[t].replace(/:/g,"-");for(let t in l.type)switch(l.type[t]){case"swap":l["type-swap"]=!0;break;case"external":l["type-external"]=!0}}else l.type=["default"],i.setAttribute("type","default");if(i.slot?l.slot=i.slot:(i.slot=i.tagName.toLowerCase(),l.slot=i.slot),i.getAttribute("type")){let t=!1;for(let e in i.getAttribute("type").split("-"))-1!==i.getAttribute("type").split("-")[e].indexOf("style:")&&(t=!0);l["style-custom"]=!0===t?"not-default":"default"}}l.shadowRoot=!1,l.this=i,t(l)})).then(t=>(s(t).then(t=>(function(t){return new Promise(function(e,l){let n=document.createElement("style"),s=document.createElement("style");for(let e=0;e<t.type.length;e++)"swap"===t.type[e]?"scoped"===t.type[e]&&n.setAttribute("scoped",""):"scoped"===t.type[e]&&s.setAttribute("scoped","");for(let l=0;l<t.state.length;l++){switch(t[`path-style-${t.state[l]}`]=`@import '/static/html/components/${t.component}/${t.state[l]}/${t.component}.css'; @import '/static/html/components/${t.component}/${t.state[l]}/${t.component}-custom.css';`,t.state[l]){case"shadow":!0===t.verify.preset&&(t[`path-style-${t.state[l]}-preset`]=`@import '/static/html/components/${t.component}/template/${t.preset}/${t.component}-${t.preset}.css';`),n.innerText=t[`path-style-${t.state[l]}`]+t[`path-style-${t.state[l]}-preset`];break;case"light":!0===t.verify.preset&&(t[`path-style-${t.state[l]}-preset`]=`@import '/static/html/components/${t.component}/template/${t.preset}/${t.component}-${t.preset}.css';`),s.innerText=t[`path-style-${t.state[l]}`]+t[`path-style-${t.state[l]}-preset`]}"swap"===t.state[l]?!0===t.shadowRoot?(t.this.shadowRoot.appendChild(s),t.this.appendChild(n),e(t)):t.this.appendChild(n):!0===t.shadowRoot?(t.this.shadowRoot.appendChild(n),t.this.appendChild(s),e(t)):t.this.appendChild(s)}e(t)})}(t).then(t=>(async function(t){}(),t)),t)),t))}});