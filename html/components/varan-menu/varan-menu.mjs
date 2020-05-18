import menu from"/static/html/components/component_modules/menu/menu.mjs";import matcher from"/static/html/components/component_modules/matcher/matcher.mjs";import Store from"/static/html/components/component_modules/varan-store/varan-store.mjs";import custom from"/static/html/components/component_modules/customEvent/callback.mjs";import utils from"/static/html/components/component_modules/utils/utils.mjs";import staticProperty from"/static/html/components/component_modules/staticProperty/staticProperty.mjs";import addEventListener from"/static/html/components/component_modules/addEventListener/addEventListener.mjs";import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";let timeStamp={staticProperty:0},store={};customElements.define("varan-menu",class extends HTMLElement{static get observedAttributes(){return["mode"]}constructor(){super();let e=[],t=[],r=[],a=[];function n(e,t,r){return new Promise(function(t,r){e["template-shadow"]=[],e["template-light"]=[];let a=[];a.swap=!1,a.external=!1,a.light=!1,a.slider=!1,a.one=!1,a.addBtn=!1;for(let t=0;t<e.type.length;t++){if(-1!==e.type[t].indexOf("slider")&&e.type[t].split("-").length>1){a.slider=!0;for(let r in e.type[t].split("-"))switch(e.type[t].split("-")[r]){case"one":a.one=!0}}if(e.type[t].length)switch(e.type[t]){case"swap":a.swap=!0;break;case"external":a.external=!0;break;case"light":a.light=!0;break;case"slider":a.slider=!0;break;case"addBtn":a.addBtn=!0}}if(!0===a.swap){for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-light"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),i(e.this.children[t]),e["template-light"].push(e.this.children[t])):(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),i(e.this.children[t]),e["template-shadow"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-light"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),i(e.template.children[t]),e["template-light"].push(e.template.children[t])):(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),i(e.template.children[t]),e["template-shadow"].push(e.template.children[t]))}else{for(let t=0;t<e.this.children.length;t++)1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-shadow"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(i(e.this.children[t]),e["template-shadow"].push(e.this.children[t])):(i(e.this.children[t]),e["template-light"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-shadow"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(i(e.template.children[t]),e["template-shadow"].push(e.template.children[t])):(i(e.template.children[t]),e["template-light"].push(e.template.children[t]))}e.verify=a,!0===e.verify.slider?function(e){return new Promise(function(t,r){fetch(`/static/html/components/varan-slider/template/${e.slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(r){let a=new DOMParser,n=a.parseFromString(r,"text/html");e.slider=n.getElementsByTagName("template")[0].content.cloneNode(!0);let o=document.createElement("section");o.className="slider",o.slot="view",o.appendChild(e.slider),e.slider=o,t(e)}).catch(e=>e)})}(e).then(e=>{console.assert(!1,e),e["template-light"].push(e.slider),e.this.appendChild(e.slider),function(e,t,r){return new Promise(function(r,a){if(t){switch(t){case"slider":(function(e,t){return new Promise(function(r,a){for(let a=0;a<e.state.length;a++)for(let n=0;n<e[`template-${e.state[a]}`].length;n++)0===e[`template-${e.state[a]}`][n].getElementsByClassName(t).length||(e.slider=e[`template-${e.state[a]}`][n].getElementsByClassName(t)[0],r(e[`template-${e.state[a]}`][n].getElementsByClassName(t)[0]))})})(e,"peppermint").then(t=>{(function(e){return new Promise(function(t,r){t(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){}}))})})(t).then(t=>{e.slider=t,r(e)})})}r(e)}else r(e)})}(e,"slider").then(e=>{if(!0===e.verify.one)for(let r=0;r<e.state.length;r++)for(let a=0;a<e[`template-${e.state[r]}`].length;a++)"wall"===e[`template-${e.state[r]}`][a].className&&(e[`template-${e.state[r]}`].splice(a,1),t(e));else t(e)})}):t(e)})}function o(t,r){return new Promise(function(r,a){t.verify=[],t.this.hasAttribute("preset")&&(t.parent=t.this.getAttribute("parent")),t.this.hasAttribute("preset")?0===t.this.getAttribute("preset").length?(t["path-template"]=`/static/html/components/${t.component}/template/${t.parent}.html`,t.preset="default",t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/template/${t.this.getAttribute("preset")}/${t.component}-${t.this.getAttribute("preset")}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/${t.component}.html`,t.verify.preset=!1),fetch(t["path-template"]).then(function(e){if(e.ok)return e.text()}).then(function(a){let o=(new DOMParser).parseFromString(a,"text/html");t.template=o.getElementsByTagName("template")[0].content.cloneNode(!0),function(t){return new Promise(function(r,a){t["path-external"]=`/static/html/components/${t.component}/external/${t.component}-external.html`,fetch(t["path-external"]).then(function(e){return!1===e.ok?e.ok:e.text()}).then(function(a){if(!1===a);else{let n=new DOMParser,o=n.parseFromString(a,"text/html");t.external=o.querySelectorAll("section"),function(t){return new Promise(function(r,a){t["external-property"]=e["external-property"];let n=[],o=[],i=[];for(let e=0;e<t.external.length;e++){for(let r=0;r<t.external[e].children.length;r++)switch(t.external[e].children[r].tagName){case"SCRIPT":t.external[e].getAttribute("id")&&(o.script=t.external[e].children[r]);break;case"COMPONENT-ID":o.id=t.external[e].children[r].innerText;break;case"COMPONENT-ACTION":for(let a=0;a<t.external[e].children[r].children.length;a++)i.push(t.external[e].children[r].children[a].innerText);o.actions=i}n.push(o),o=[]}t["external-property"]=n,r(t)}).catch(e=>{})}(t).then(e=>{0===e["external-property"].length?r(e):function(e){return new Promise(function(t,r){e["words-action"]=[];let a=[];for(let r=0;r<e["external-property"].length;r++){for(let t=0;t<e["external-property"][r].actions.length;t++)for(let n=0;n<e.words.length;n++)-1!==e["external-property"][r].actions[t].indexOf(e.words[n])&&("shadowRoot"!==e.words[n]&&"shadow"!==e.words[t]||(a.shadow=!0),"light"!==e.words[n]&&"лайт"!==e.words[t]||(a.light=!0),"editor"===e.words[n]&&(a.editor=!0),"слайдер"===e.words[n]&&(a["editor-slider"]=!0),"swap"===e.words[n]&&(a.swap=!0));e["words-action"]=a;for(let t in e["external-property"])for(let r in e["external-property"][t])switch(r){case"id":let a=document.createElement(e["external-property"][t][r]);a.setAttribute("type","external"),e.this.appendChild(a)}t(e)}})}(e).then(e=>{r(e)})})}}).catch(e=>{throw e})})}(t).then(e=>{n(e,e["type-swap"],e["type-external"]).then(e=>{if(!0===e.verify.swap){if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t=0;t<e["template-shadow"].length;t++)e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t=0;t<e["template-light"].length;t++)e.this.appendChild(e["template-light"][t])}else{if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t in e["template-shadow"])e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t in e["template-light"])e.this.appendChild(e["template-light"][t])}r(e)})})}).catch(e=>e)})}function i(e){return new Promise(function(t,r){e.getAttribute("import");const a=document.createElement("script");let n=!1;for(let t in document.head.getElementsByTagName("script"))"object"==typeof document.head.getElementsByTagName("script")[t]&&-1!==document.head.getElementsByTagName("script")[t].outerHTML.indexOf(e.tagName.toLowerCase())&&(n=!0);!0===n||(null===e.getAttribute("import")||(a.type="module"),a.src=`/static/html/components/${e.tagName.toLowerCase()}/${e.tagName.toLowerCase()}.js`,a.onload=t,a.onerror=r,document.head.appendChild(a))})}var l;function s(e){timeStamp.staticProperty=e,s=function(e){return e}}t.push("component-id"),t.push("script"),t.push("component-action"),r.push("h1"),r.push("innerText"),a.push("shadowRoot"),a.push("head"),a.push("shadow"),a.push("light"),a.push("lightDom"),a.push("editor"),a.push("слайдер"),a.push("swap"),e.this=this,e["type-supported"]=r,(l=this,new Promise(function(e,t){let r=[];r.indexeddb=null,r.firebase=null,r.localStorage=null,r.mongo=null,r.mySql=null,r.state=[],r.state.push("shadow"),r.state.push("light"),r.words=a,r["type-swap"]=!1,r["type-external"]=!1,r["document-offsetWidth"]=document.body.offsetWidth;let n=!1;if(r.getAttribute=((e,t,r)=>{if("template"===r){if(!e.getAttribute("type"))return e.setAttribute("type","default"),!1;for(let r=0;r<e.getAttribute("type").split("-").length;r++)e.getAttribute("type").split("-")[r]===t&&(n=!0);return n}if(e[`verify-${t}`]=!1,0===e.this.getAttribute("type").split("-").length)return!1;for(let r=0;r<e.this.getAttribute("type").split("-").length;r++)e.this.getAttribute("type").split("-")[r]===t?e[`verify-${t}`]=!0:e[`verify-${t}`]=!1;return e[`verify-${t}`]}),l.tagName.toLowerCase()&&(r.component=l.tagName.toLowerCase()),"object"!=typeof l);else{if(l.getAttribute("type")){r.type=l.getAttribute("type").split("-");for(let e=0;e<r.type.length;e++)r.type[e]=r.type[e].replace(/:/g,"-");for(let e in r.type)switch(r.type[e]){case"swap":r["type-swap"]=!0;break;case"external":r["type-external"]=!0}}else r.type=["default"],l.setAttribute("type","default");if(l.slot?r.slot=l.slot:(l.slot=l.tagName.toLowerCase(),r.slot=l.slot),l.getAttribute("type")){let e=!1;for(let t in l.getAttribute("type").split("-"))-1!==l.getAttribute("type").split("-")[t].indexOf("style:")&&(e=!0);r["style-custom"]=!0===e?"not-default":"default"}}r.shadowRoot=!1,r.this=l,e(r)})).then(e=>(o(e).then(e=>(function(e){return new Promise(function(t,r){let a=document.createElement("style"),n=document.createElement("style");for(let t=0;t<e.type.length;t++)"swap"===e.type[t]?"scoped"===e.type[t]&&a.setAttribute("scoped",""):"scoped"===e.type[t]&&n.setAttribute("scoped","");for(let r=0;r<e.state.length;r++){switch(e[`path-style-${e.state[r]}`]=`@import '/static/html/components/${e.component}/${e.state[r]}/${e.component}.css'; @import '/static/html/components/${e.component}/${e.state[r]}/${e.component}-custom.css';`,e.state[r]){case"shadow":a.innerText=e[`path-style-${e.state[r]}`];break;case"light":n.innerText=e[`path-style-${e.state[r]}`]}"swap"===e.state[r]?!0===e.shadowRoot?(e.this.shadowRoot.appendChild(n),e.this.appendChild(a),t(e)):e.this.appendChild(a):!0===e.shadowRoot?(e.this.shadowRoot.appendChild(a),e.this.appendChild(n),t(e)):e.this.appendChild(n)}t(e)})}(e).then(e=>(async function(e){let t=(e,t)=>"VARAN-EDITOR"===e.tagName,r=(e,t)=>e.slot===t,a=function(e){s(e.timeStamp);let r=e.timeStamp-timeStamp.staticProperty;if(r>140||0===r){e.target.disable="true",e.target.style.backgroundColor="#62bcd7";let r=e.target,a=!1;for(;!a;)void 0!==(r=r.parentNode).tagName&&"undefined"!==r.tagName||(r=r.getRootNode().host),a=t(r,"varan-editor");let n=new CustomEvent("saveEditor",{detail:{id:r.slot}});document.dispatchEvent(n),setTimeout(function(){e.target.disable="false",e.target.style.backgroundColor="#ccc"},3e3)}timeStamp.staticProperty=e.timeStamp},n=async function(e){s(e.timeStamp);let a=e.timeStamp-timeStamp.staticProperty;if(a>140||0===a){e.target.disable="true",e.target.style.backgroundColor="#62bcd7";let a=e.target,n=!1;for(;!n;)void 0!==(a=a.parentNode).tagName&&"undefined"!==a.tagName||(a=a.getRootNode().host),n=t(a,"varan-editor");let o=await staticProperty({input:"action",type:"all"},"get","type"),i={moderator:{},news:{},card:{}},l={},s={},c={},d={};for(let e=0;e<o["varan-editor"].length;e++)switch(o["varan-editor"][e].slot){case"description":i.news.description=await utils({input:"varan-menu",data:o["varan-editor"][e].editor.quill.root.innerHTML,type:"html2string"},"convert","type"),c.description=o["varan-editor"][e].editor.quill.root.innerHTML,o["varan-editor"][e].obj.this.querySelector(".wall").innerHTML="",o["varan-editor"][e].editor.quill.root.innerHTML="";break;case"content":i.news.content=await utils({input:"varan-menu",data:o["varan-editor"][e].editor.quill.root.innerHTML,type:"html2string"},"convert","type"),c.content=o["varan-editor"][e].editor.quill.root.innerHTML,o["varan-editor"][e].obj.this.querySelector(".wall").innerHTML="",o["varan-editor"][e].editor.quill.root.innerHTML="";break;case"about":i.about=await utils({input:"varan-menu",data:o["varan-editor"][e].editor.quill.root.innerHTML,type:"html2string"},"convert","type"),l=o["varan-editor"][e].editor.quill.root.innerHTML;break;case"moderator":i.moderator.description=await utils({input:"varan-menu",data:o["varan-editor"][e].editor.quill.root.innerHTML,type:"html2string"},"convert","type"),s.description=o["varan-editor"][e].editor.quill.root.innerHTML;break;case"moderatorContent":i.moderator.content=await utils({input:"varan-menu",data:o["varan-editor"][e].editor.quill.root.innerHTML,type:"html2string"},"convert","type"),s.content=o["varan-editor"][e].editor.quill.root.innerHTML;break;case"cardDescription":i.card.description=await utils({input:"varan-menu",data:o["varan-editor"][e].editor.quill.root.innerHTML,type:"html2string"},"convert","type"),d.description=o["varan-editor"][e].editor.quill.root.innerHTML;break;case"cardContent":i.card.content=await utils({input:"varan-menu",data:o["varan-editor"][e].editor.quill.root.innerHTML,type:"html2string"},"convert","type"),d.content=o["varan-editor"][e].editor.quill.root.innerHTML;break;default:console.warn("~~~~~~~~~","На этот объект нет действия ",o["varan-editor"][e].slot)}let p={},h={},m={},u={},y={},w={},g={},v={},f={};switch(a.slot){case"about":f="about";break;case"moderator":case"moderatorContent":f="moderator";break;case"content":case"description":f="news";break;case"cardContent":case"cardDescription":f="card";break;default:f=a.slot,console.warn("необрабатываемый тип",a.slot)}switch(T){case"card":for(let e=0;e<o["varan-card-news"].length;e++)switch(o["varan-card-news"][e].slot){case"card-admin":let t=o["varan-card-news"][e].this.shadowRoot.querySelector(".nameBid").value,r=o["varan-card-news"][e].this.shadowRoot.querySelector(".imgBidAdmin").src,a=o["varan-card-news"][e].this.shadowRoot.querySelector(".timerValue").value;a=+a;let n=o["varan-card-news"][e].this.shadowRoot.querySelector(".priceValue").value;n=+n,a<1&&(alert("минимальное время аукциона 1 минут"),a=1),0===n&&(alert("минимальная стоимость 1 waves"),n=1),0===t.length&&(t="Наименование товара");let l={};u=Date.now(),l.description={time:a,price:n,description:i.card.description},l.image={},l.content=i.card.content,l.timestamp=u,l.title=t,l.image.data=r,l.image.name=t,l.short_content=i.card.description,l.url="https://universitykids.ru",l.rss="https://universitykids.ru/rss",l.rss="bid",o["varan-card-news"][e].this.shadowRoot.querySelector(".nameBid").value="Наименование товара",o["varan-card-news"][e].this.shadowRoot.querySelector(".imgBidAdmin").src="/static/html/components/varan-card-news/icons/no_image.jpg",o["varan-card-news"][e].this.shadowRoot.querySelector(".timerValue").value=10,o["varan-card-news"][e].this.shadowRoot.querySelector(".priceValue").value=1;let s=o["varan-card-news"][e].this.querySelectorAll("varan-menu"),c={},d={},p={},h={};for(let e=0;e<s.length;e++)c=void 0===s[e].shadowRoot||null===s[e].shadowRoot?s[e]:s[e].shadowRoot,d=c.querySelector(".menu-convert"),p=c.querySelector(".menu-save"),null===(h=c.querySelector(".update"))||"null"===h||h.remove(),d.innerText="Создаётся новость. Страница сама перезагрузится",d.style.backgroundColor="red",d.disabled=!0,p.disabled=!0;staticProperty({type:"task",task:{type:"create",data:l}},"task","type")}break;case"about":let e=await utils({input:"varan-menu",data:l,type:"html2string"},"convert","type");for(let t=0;t<o["varan-about"].length;t++)switch(o["varan-about"][t].slot){case"about-admin":let r={};if(null===o["varan-about"][t].obj.this.querySelector(".menu-convert")){let e=o["varan-about"][t].obj.this.querySelector("varan-menu");r=e.shadowRoot.querySelector(".menu-convert")}else r=o["varan-about"][t].obj.this.querySelector(".menu-convert");r.innerText="Идёт сохранение данных.",r.disabled=!0,r.style.backgroundColor="red";let a=await matcher.webdav({input:"varan-menu",data:{txt:e},type:"about",path:"/about"},"set","type"),n=await utils({input:"varan-menu",target:"varan-about",type:"object",source:o["varan-about"],get:".main"},"get","type");n.innerHTML="",n.insertAdjacentHTML("beforeend",a),r.innerText="Данные сохранены",setTimeout(()=>{r.innerText="сохранить",r.disabled=!1,r.style.backgroundColor="#ccc"},2e3)}break;case"moderator":for(n=!1,p={};!n;)p=a.parentNode,n=r(p,a.getAttribute("parent"));h={},m=p.shadowRoot.querySelector("#titleItem").value;let t={};isEmpty(m)?"введите Имя и Фамилию  автора"===(t=prompt("введите Имя и Фамилию  автора","введите Имя и Фамилию  автора"))?(alert("вы не ввели имя автора поле остаётся пустым"),h="модератор"):h=t:h=m,Date.now||(Date.now=function(){return(new Date).getTime()}),u=Date.now(),(y={}).timestamp=u,y.title=h,y.img=p.shadowRoot.querySelector(".moderator").src,y.description=i.moderator.description,y.content=i.moderator.content,y.dir="moderator",y.positionImg=confirm("Фотографию разположить слева ?");let s={},c={},d={},f={};for(let e=0;e<o["varan-editor"].length;e++)switch(o["varan-editor"][e].slot){case"moderator":case"moderatorContent":f=o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot&&void 0!==o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot&&null!==o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot?o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot:o["varan-editor"][e].obj.this.querySelector("varan-menu"),s=f.querySelector(".menu-convert"),c=f.querySelectorAll(".menu-save")[0],null===(d=f.querySelector(".update"))||"null"===d||d.remove(),s.innerHTML="создаётся модератор",s.style.backgroundColor="#e1e1e1",s.disabled=!0,c.disabled=!0}v=await utils({input:"varan-menu",target:"lacerta-moderator",type:"object",source:o["lacerta-moderator"],get:".main"},"get","type"),w=await matcher.webdav({input:"varan-menu",data:y,type:"components",name:"moderator",path:"/components"},"set","type",v.querySelectorAll(".adminMenu").length);let b=v.querySelectorAll(".adminMenu").length;g=await utils({input:"varan-menu",target:"moderator-admin",type:"object",source:o["lacerta-moderator"],get:".adminContent"},"get","type");for(let e=0;e<w.length;e++){v.insertAdjacentHTML("beforeend",w[e]),v.querySelector(`.item_${v.querySelectorAll(".adminMenu").length}`),console.log(b);let t=v.querySelector(`.item_${b}`);await addEventListener({input:"varan-menu",delete:t.querySelector(".delete"),change:t.querySelector(".change"),type:"lacerta-moderator"},"add","type")}for(let e=0;e<o["varan-editor"].length;e++)switch(o["varan-editor"][e].slot){case"moderator":f=o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot&&void 0!==o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot&&null!==o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot?o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot:o["varan-editor"][e].obj.this.querySelector("varan-menu"),s=f.querySelector(".menu-convert"),c=f.querySelectorAll(".menu-save")[0],null===(d=f.querySelector(".update"))||"null"===d||d.remove(),s.innerHTML="модератор создан",location.reload();break;case"moderatorContent":f=o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot&&void 0!==o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot&&null!==o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot?o["varan-editor"][e].obj.this.querySelector("varan-menu").shadowRoot:o["varan-editor"][e].obj.this.querySelector("varan-menu"),s=f.querySelector(".menu-convert"),c=f.querySelectorAll(".menu-save")[0],null===(d=f.querySelector(".update"))||"null"===d||d.remove(),s.innerHTML="модератор создан",s.style.backgroundColor="red",s.disabled=!1,c.disabled=!1}break;case"news":let S=o["varan-editor-admin"][0].this.querySelector("lacerta-news"),q=S.shadowRoot.querySelector("#titleItem").value,A=S.shadowRoot.querySelector(".gallery").src,x="image";0===q.length&&(q="Новость"),Date.now||(Date.now=function(){return(new Date).getTime()});let k={image:{}};k.image.data=A,k.image.name=x,k.title=q,k.content=i.news.content,k.short_content=i.news.description,k.url="https://universitykids.ru",k.rss="https://universitykids.ru/rss",k.timestamp=Date.now();for(let e=0;e<o["lacerta-news"].length;e++)switch(o["lacerta-news"][e].slot){case"news-admin":o["lacerta-news"][e].obj.this.shadowRoot.querySelector("#titleItem").value="",o["lacerta-news"][e].obj.this.shadowRoot.querySelector(".date").innerHTML="",o["lacerta-news"][e].obj.this.shadowRoot.querySelector(".gallery").src="/static/html/components/lacerta-news/icons/no_image.jpg",isEmpty(o.action)&&(o.action={}),isEmpty(o.action.create)&&(o.action.create={}),o.action.create=!0;let t=o["lacerta-news"][e].obj.this.querySelectorAll("varan-menu"),r={},a={},n={},i={};for(let e=0;e<t.length;e++)r=void 0===t[e].shadowRoot||null===t[e].shadowRoot?t[e]:t[e].shadowRoot,a=r.querySelector(".menu-convert"),n=r.querySelector(".menu-save"),null===(i=r.querySelector(".update"))||"null"===i||i.remove(),a.innerText="Создаётся новость. Страница сама перезагрузится",a.style.backgroundColor="red",a.disabled=!0,n.disabled=!0;break;default:console.warn("~~~~~~~~~","На этот объект нет действия ",o["lacerta-news"][e].slot)}staticProperty({type:"task",task:{type:"create",data:k}},"task","type");break;case"varan-editor":let T=await utils({input:"varan-menu",data:o["varan-editor"][0].editor.quill.root.innerHTML,type:"html2string"},"convert","type");document.dispatchEvent(new CustomEvent("textToGitHub",{detail:{content:o["varan-editor"][0].editor.this.contentView.innerText,html:T}}));break;default:console.assert(!1,T)}setTimeout(function(){e.target.disable="false",e.target.style.backgroundColor="#ccc"},3e3)}timeStamp.staticProperty=e.timeStamp};e.this.querySelector(".menu-save")?(e.this.querySelector(".menu-save").addEventListener("click",a,!1),e.this.querySelector(".menu-convert").addEventListener("click",n,!1)):(e.this.shadowRoot.querySelector(".menu-save").addEventListener("click",a,!1),e.this.shadowRoot.querySelector(".menu-convert").addEventListener("click",n,!1))}(e),e)),e)),e))}attributeChangedCallback(e,t,r){let a={};if(a=this.hasAttribute("parent")?{id:e,slot:this.getAttribute("parent"),state:0}:{id:e,slot:"default",state:0},this.hasAttribute("parent")){let n={name:e,oldValue:t,newValue:r,state:0,parent:this.getAttribute("parent")};store.dispatch(a,n).then(e=>{})}else alert("не установлен parent родительский элемент")}});