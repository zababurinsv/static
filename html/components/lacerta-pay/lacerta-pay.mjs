customElements.define("varan-editor",class extends HTMLElement{constructor(){super();let e=[],t=[],l=[],s=[],n=[],i=[],o=[];function r(e,t,l){return new Promise(function(t,l){e["template-shadow"]=[],e["template-light"]=[];let s=[];s.swap=!1,s.external=!1,s.light=!1,s.slider=!1,s.one=!1;for(let t=0;t<e.type.length;t++){if(-1!==e.type[t].indexOf("slider")&&e.type[t].split("-").length>1){s.slider=!0;for(let l in e.type[t].split("-"))switch(e.type[t].split("-")[l]){case"one":s.one=!0;break;default:console.log("~~~дополнительное свойство~~~",e.type[t].split("-")[l])}}if(e.type[t].length)switch(e.type[t]){case"swap":s.swap=!0;break;case"external":s.external=!0;break;case"light":s.light=!0;break;case"slider":s.slider=!0;break;default:console.log("типы не отслеживаются",e.type[t])}}if(!0===s.swap){for(let t=0;t<e.this.children.length;t++)console.log("~~~~~~this~~~~~~~",e.this.children[t].tagName),1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-light"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),p(e.this.children[t]),e["template-light"].push(e.this.children[t])):(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),p(e.this.children[t]),e["template-shadow"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)console.log("~~~~~~template~~~~~~~",e.template.children[t].tagName),1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-light"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),p(e.template.children[t]),e["template-light"].push(e.template.children[t])):(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),p(e.template.children[t]),e["template-shadow"].push(e.template.children[t]))}else{for(let t=0;t<e.this.children.length;t++)console.log("~~~~~~this~~~~~~~",e.this.children[t].tagName),1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-shadow"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(p(e.this.children[t]),e["template-shadow"].push(e.this.children[t])):(p(e.this.children[t]),e["template-light"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)console.log("~~~~~~template~~~~~~~",e.template.children[t].tagName),1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-shadow"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(p(e.template.children[t]),e["template-shadow"].push(e.template.children[t])):(p(e.template.children[t]),e["template-light"].push(e.template.children[t]))}for(let t in s)e.verify[t]=s[t];!0===e.verify.slider?function(e){return new Promise(function(t,l){fetch(`/static/html/components/varan-slider/template/${e.slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(l){let s=new DOMParser,n=s.parseFromString(l,"text/html");e.slider=n.getElementsByTagName("template")[0].content.cloneNode(!0);let i=document.createElement("section");if(i.className="slider",i.slot="view",i.appendChild(e.slider),e.slider=i,0===i.querySelectorAll(".ql-editor").length)t(e);else for(let e=0;e<i.querySelectorAll(".ql-editor").length;e++)if(0===i.querySelectorAll(".ql-editor")[e].children.length);else for(let t=0;t<i.querySelectorAll(".ql-editor")[e].children.length;t++)i.querySelectorAll(".ql-editor")[e].children[t].tagName.split("-").length>1&&p(i.querySelectorAll(".ql-editor")[e].children[t]);t(e)}).catch(e=>e)})}(e).then(e=>{e["template-light"].push(e.slider),e.this.appendChild(e.slider),function(e,t,l){return new Promise(function(l,s){if(t){switch(t){case"slider":(function(e,t){return new Promise(function(l,s){for(let s=0;s<e.state.length;s++)for(let n=0;n<e[`template-${e.state[s]}`].length;n++)0===e[`template-${e.state[s]}`][n].getElementsByClassName(t).length||(e.slider=e[`template-${e.state[s]}`][n].getElementsByClassName(t)[0],l(e[`template-${e.state[s]}`][n].getElementsByClassName(t)[0]))})})(e,"peppermint").then(t=>{(function(e){return new Promise(function(t,l){t(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){console.log("Peppermint setup done. Slides found: "+e)}}))})})(t).then(t=>{e.slider=t,l(e)})});break;default:console.log("какой то неизвестный тип",t)}l(e)}else l(e)})}(e,"slider").then(e=>{if(!0===e.verify.one)for(let l=0;l<e.state.length;l++)for(let s=0;s<e[`template-${e.state[l]}`].length;s++)console.log(e[`template-${e.state[l]}`][s]),"wall"===e[`template-${e.state[l]}`][s].className&&(e[`template-${e.state[l]}`].splice(s,1),t(e));else t(e)})}):t(e)})}function a(t,l){return new Promise(function(l,s){t.verify=[],t.this.getAttribute("preset")?(t["path-template"]=`/static/html/components/${t.component}/template/${t.this.getAttribute("preset")}/${t.component}-${t.this.getAttribute("preset")}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/${t.component}.html`,t.verify.preset=!1),fetch(t["path-template"]).then(function(e){if(e.ok)return e.text()}).then(function(s){let n=(new DOMParser).parseFromString(s,"text/html");t.template=n.getElementsByTagName("template")[0].content.cloneNode(!0),function(t){return new Promise(function(l,s){t["path-external"]=`/static/html/components/${t.component}/external/${t.component}-external.html`,fetch(t["path-external"]).then(function(e){return!1===e.ok?e.ok:e.text()}).then(function(s){if(!1===s);else{let n=new DOMParser,i=n.parseFromString(s,"text/html");t.external=i.querySelectorAll("section"),function(t){return new Promise(function(l,s){t["external-property"]=e["external-property"];let n=[],i=[],o=[];for(let e=0;e<t.external.length;e++){for(let l=0;l<t.external[e].children.length;l++)switch(t.external[e].children[l].tagName){case"SCRIPT":t.external[e].getAttribute("id")?i.script=t.external[e].children[l]:console.log("у компонента нет id нужно в external property script  получить id для загрузки скрипта");break;case"COMPONENT-ID":i.id=t.external[e].children[l].innerText;break;case"COMPONENT-ACTION":for(let s=0;s<t.external[e].children[l].children.length;s++)o.push(t.external[e].children[l].children[s].innerText);i.actions=o;break;default:console.log(`Не отслеживается, по мере надобности добавляются [${t.external[e].children[l].tagName.toLowerCase()}]`)}n.push(i),i=[]}t["external-property"]=n,l(t)}).catch(e=>console.log("здесь я перехватывал отсутствие страницы но это убрал",e))}(t).then(e=>{0===e["external-property"].length?l(e):function(e){return new Promise(function(t,l){e["words-action"]=[];let s=[];for(let l=0;l<e["external-property"].length;l++){for(let t=0;t<e["external-property"][l].actions.length;t++)for(let n=0;n<e.words.length;n++)-1!==e["external-property"][l].actions[t].indexOf(e.words[n])&&("shadowRoot"!==e.words[n]&&"shadow"!==e.words[t]||(s.shadow=!0),"light"!==e.words[n]&&"лайт"!==e.words[t]||(s.light=!0),"editor"===e.words[n]&&(s.editor=!0),"слайдер"===e.words[n]&&(s["editor-slider"]=!0),"swap"===e.words[n]&&(s.swap=!0));e["words-action"]=s;for(let t in e["external-property"])for(let l in e["external-property"][t])switch(l){case"id":let s=document.createElement(e["external-property"][t][l]);s.setAttribute("type","external"),e.this.appendChild(s);break;default:console.log("какой то неизвестный тип",l)}t(e)}})}(e).then(e=>{l(e)})})}}).catch(e=>{throw e})})}(t).then(e=>{r(e,e["type-swap"],e["type-external"]).then(e=>{if(!0===e.verify.swap){if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t=0;t<e["template-shadow"].length;t++)e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t=0;t<e["template-light"].length;t++)e.this.appendChild(e["template-light"][t])}else{if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t in e["template-shadow"])e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t in e["template-light"])e.this.appendChild(e["template-light"][t])}l(e)})})}).catch(e=>e)})}function p(e){return new Promise(function(t,l){const s=document.createElement("script");let n=!1;for(let t in document.head.getElementsByTagName("script"))"object"==typeof document.head.getElementsByTagName("script")[t]&&-1!==document.head.getElementsByTagName("script")[t].outerHTML.indexOf(e.tagName.toLowerCase())&&(n=!0);!0===n?console.log("script уже загруже"):(s.src=`/static/html/components/${e.tagName.toLowerCase()}/${e.tagName.toLowerCase()}.js`,s.onload=t,s.onerror=l,document.head.appendChild(s))})}var h;t.push("component-id"),t.push("script"),t.push("component-action"),n.push("h1"),n.push("innerText"),i.push("shadowRoot"),i.push("head"),i.push("shadow"),i.push("light"),i.push("lightDom"),i.push("editor"),i.push("слайдер"),i.push("swap"),e.this=this,e["type-supported"]=n,(h=this,new Promise(function(e,t){let l=[];l.state=[],l.state.push("shadow"),l.state.push("light"),l.words=i,l["type-swap"]=!1,l["type-external"]=!1,l["document-offsetWidth"]=document.body.offsetWidth;let s=!1;if(l.getAttribute=((e,t,l)=>{if("template"===l){if(!e.getAttribute("type"))return console.log("не установлен тип ставим default"),e.setAttribute("type","default"),!1;for(let l=0;l<e.getAttribute("type").split("-").length;l++)e.getAttribute("type").split("-")[l]===t&&(s=!0);return s}if(console.log(e.this.getAttribute("type")),e[`verify-${t}`]=!1,0===e.this.getAttribute("type").split("-").length)return!1;for(let l=0;l<e.this.getAttribute("type").split("-").length;l++)e.this.getAttribute("type").split("-")[l]===t?e[`verify-${t}`]=!0:e[`verify-${t}`]=!1;return e[`verify-${t}`]}),h.tagName.toLowerCase()?l.component=h.tagName.toLowerCase():console.log("что то пошло не так middleware js objectProperty",""),"object"!=typeof h)console.log("objectProperty middleware.js пришёл не объект");else{if(h.getAttribute("type")){l.type=h.getAttribute("type").split("-");for(let e=0;e<l.type.length;e++)l.type[e]=l.type[e].replace(/:/g,"-");for(let e in l.type)switch(l.type[e]){case"swap":l["type-swap"]=!0;break;case"external":l["type-external"]=!0;break;default:console.log("дополнительные типы",l.type[e])}}else l.type=["default"],console.log("нет типа ставим default"),h.setAttribute("type","default");if(h.slot?l.slot=h.slot:(console.log("отсутствует слот, ставится- по тегу ",h.tagName.toLowerCase()),h.slot=h.tagName.toLowerCase(),l.slot=h.slot),h.getAttribute("type")){let e=!1;for(let t in h.getAttribute("type").split("-"))-1!==h.getAttribute("type").split("-")[t].indexOf("style:")&&(console.log("устанавливаются пути к стилям"),e=!0);!0===e?l["style-custom"]="not-default":(console.log("устанавливается стиль по default"),l["style-custom"]="default")}else console.log(" почему то нет атрибутов")}l.shadowRoot=!1,l.this=h,console.log(l.this),e(l)})).then(e=>(a(e).then(e=>(function(e){return new Promise(function(t,l){let s=document.createElement("style"),n=document.createElement("style");for(let t=0;t<e.type.length;t++)"swap"===e.type[t]?"scoped"===e.type[t]&&s.setAttribute("scoped",""):"scoped"===e.type[t]&&n.setAttribute("scoped","");for(let l=0;l<e.state.length;l++){switch(e[`path-style-${e.state[l]}`]=`@import '/static/html/components/${e.component}/${e.state[l]}/${e.component}.css'; @import '/static/html/components/${e.component}/${e.state[l]}/${e.component}-custom.css';`,e.state[l]){case"shadow":!0===e.verify.preset&&(e[`path-style-${e.state[l]}-preset`]=`@import '/static/html/components/${e.component}/template/${e.preset}/${e.component}-${e.preset}.css';`),s.innerText=e[`path-style-${e.state[l]}`]+e[`path-style-${e.state[l]}-preset`];break;case"light":!0===e.verify.preset&&(e[`path-style-${e.state[l]}-preset`]=`@import '/static/html/components/${e.component}/template/${e.preset}/${e.component}-${e.preset}.css';`),n.innerText=e[`path-style-${e.state[l]}`]+e[`path-style-${e.state[l]}-preset`];break;default:console.log("новый тип",e.state[l])}"swap"===e.state[l]?!0===e.shadowRoot?(e.this.shadowRoot.appendChild(n),e.this.appendChild(s),t(e)):e.this.appendChild(s):!0===e.shadowRoot?(e.this.shadowRoot.appendChild(s),e.this.appendChild(n),t(e)):e.this.appendChild(n)}t(e)})}(e).then(e=>(async function(e){console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",e,"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"),e["template-editor"]=[],e["parser-property"]=l,l.push("&lt;div"),l.push("&lt;/div"),l.push("&lt;style"),l.push("&lt;/style"),l.push("&lt;section"),l.push("/section&gt;"),l.push("&lt;article"),l.push("/article&gt;"),l.push("&lt;time"),l.push("/time&gt;"),l.push("&lt;/script"),l.push("&lt;script"),o.push("&lt;p"),o.push("&lt;/p"),o.push("&lt;style"),o.push("&lt;/style"),o.push("&lt;section"),o.push("/section&gt;"),o.push("&lt;article"),o.push("/article&gt;"),o.push("&lt;time"),o.push("/time&gt;"),s.push("div"),s.push("section"),s.push("style"),s.push("script"),s.push("varan-editor");let t=[],n=[],i=[],r=[];i=e.this.getElementsByClassName("wall")[0],n=e.this.getElementsByTagName("form")[0],t=e.this.getElementsByClassName("editor")[0],r=e.this.getElementsByClassName("peppermint-slides")[0];let a=new Quill(t,{modules:{toolbar:[["bold","italic","underline","strike"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["clean"]]},placeholder:"Введите сообщение...",theme:"snow"}),p=[];p.id=e.this.slot,p.url=location.hostname,p.component=e.this.tagName.toLowerCase(),p.user="anonymous",p["view-wall"]="",p["view-slider"]="",p.content=[],p["editor-delta"]=JSON.stringify(a.getContents()),p["editor-type"]="public",p.captcha="",p.init=!1,p.count=0,p.status=-1,p.online=!1,p.Timestamp="",p["view-slider-pos"]=0,p["view-slider-db-Id"]=0,n.onsubmit=function(){return p.id=e.slot,p["editor-delta"]=JSON.stringify(a.getContents()),p.content=a.root.innerHTML,p["view-slider"]=0,p["view-slider-pos"]=e.slider.getCurrentPos(),p["view-slider-db-Id"]=`0-${e.slider.getCurrentPos()}`,p.url=location.hostname,async function(t){r.children[e.slider.getCurrentPos()].innerHTML=a.root.innerHTML,i.innerHTML=a.root.innerHTML}(),!1},window.addEventListener("storage",function(e){});let h=[];function c(e){h=e}function d(){return h}e.this.addEventListener("keydown",e=>{!0===e.ctrlKey&&("c"===e.key&&c(document.documentElement.scrollTop),"v"===e.key&&c(document.documentElement.scrollTop))}),e.this.addEventListener("keypress",e=>{"v"===e.key&&c(-1)}),e.this.addEventListener("keyup",e=>{if(!0===e.ctrlKey){if(e.key,"v"===e.key){let e=d();e+=100,document.documentElement.scrollTop=e}}else if("v"===e.key&&-1!==d()){let e=d();e+=100,document.documentElement.scrollTop=e}})}(e),e)),e)),e))}});