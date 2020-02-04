customElements.define("audio-drums",class extends HTMLElement{constructor(){super();let e=[],t=[],l=[],n=[],s=[],i=[],o=[];t.push("component-id"),t.push("script"),t.push("component-action"),s.push("h1"),s.push("innerText"),i.push("shadowRoot"),i.push("head"),i.push("shadow"),i.push("light"),i.push("lightDom"),i.push("editor"),i.push("слайдер"),i.push("swap"),e.this=this,e["type-supported"]=s;const r=new Vue({el:"#app",methods:{selectKnob:function(e,t){e.selected=!0,this.currentY=t.pageY},unselectKnobs:function(){for(var e in this.knobs)this.knobs[e].selected=!1;for(var e in this.effects){for(var t in this.effects[e].knobs)this.effects[e].knobs[t].selected=!1;this.effects[e].selected=!1}},start:function(){this.isPlaying=!0,this.intervalId=setInterval(()=>{this.play(),this.current=(this.current+1)%16},200)},stop:function(){this.isPlaying=!1,clearInterval(this.intervalId)},rewind:function(){this.current=0},clear:function(){this.notes.forEach(e=>e.forEach(e=>e.value=!1))},play:function(){for(let e=0;e<8;e++){if(this.notes[e][this.current].value){let t=this.context.createOscillator();t.type=this.oscillatorType;let l=this.scale[e];t.frequency.value=220*Math.pow(Math.pow(2,1/12),l);let n=.7,s=this.context.currentTime,i=this.envelope.a/1e3,o=this.envelope.d/1e3,r=this.envelope.s/1e3,a=this.envelope.r/1e3,p=this.envelope.sl/100,h=this.context.createGain();t.connect(h),h.connect(this.context.destination),h.gain.setValueAtTime(0,s),h.gain.linearRampToValueAtTime(n,s+i),h.gain.linearRampToValueAtTime(p*n,s+i+r+o);let c=s+i+r+o+a;h.gain.linearRampToValueAtTime(1e-4,c),t.start(s),t.stop(c)}}}},data:function(){let e=[];for(let t=0;t<8;t++){e.push([]);for(let l=0;l<16;l++)e[t].push({value:!1})}return{envelope:{a:5,d:100,s:100,r:600,sl:10},isPlaying:!1,oscillatorType:"sine",scale:[0,2,4,5,7,9,11,12],notes:e,current:0,context:void 0,intervalId:void 0,colorArray:["#23CDE8","#23F376","#FFFB43","#FA9C34","#21CD92","#ED31A2","#E22"],effects:[{id:0,label:"Envelope",knobs:[{label:"Attack",rotation:-13,selected:!1,setValue:e=>this.envelope.a=(e+132)/255*1e3},{label:"Delay",rotation:-132,selected:!1,setValue:e=>this.envelope.d=(e+132)/255*1e3},{label:"Sustain",rotation:-132,selected:!1,setValue:e=>this.envelope.s=(e+132)/255*1e3},{label:"Sustain Level",rotation:-132,selected:!1,setValue:e=>this.envelope.sl=(e+132)/255*100},{label:"Release",rotation:-132,selected:!1,setValue:e=>this.envelope.r=(e+132)/255*1e3}],active:!0,selected:!1,color:"#23F376",knobStyle:1}],currentY:0,mousemoveFunction:function(e){var t=r.effects.filter(function(e){return!0===e.selected})[0];if(t)var l=t.knobs.filter(function(e){return!0===e.selected})[0];l&&(e.pageY-r.currentY!=0&&(l.rotation-=e.pageY-r.currentY),r.currentY=e.pageY,l.rotation>=132?l.rotation=132:l.rotation<=-132&&(l.rotation=-132),l.setValue(l.rotation))}}},mounted:function(){let e=window.AudioContext||window.webkitAudioContext;this.context=new e}});function a(e,t,l){return new Promise(function(t,l){e["template-shadow"]=[],e["template-light"]=[];let n=[];n.swap=!1,n.external=!1,n.light=!1,n.slider=!1,n.one=!1;for(let t=0;t<e.type.length;t++){if(-1!==e.type[t].indexOf("slider")&&e.type[t].split("-").length>1){n.slider=!0;for(let l in e.type[t].split("-"))switch(e.type[t].split("-")[l]){case"one":n.one=!0;break;default:console.log("~~~дополнительное свойство~~~",e.type[t].split("-")[l])}}if(e.type[t].length)switch(e.type[t]){case"swap":n.swap=!0;break;case"external":n.external=!0;break;case"light":n.light=!0;break;case"slider":n.slider=!0;break;default:console.log("типы не отслеживаются",e.type[t])}}if(!0===n.swap){for(let t=0;t<e.this.children.length;t++)console.log("~~~~~~this~~~~~~~",e.this.children[t].tagName),1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-light"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),h(e.this.children[t]),e["template-light"].push(e.this.children[t])):(e.this.children[t].setAttribute("type",`${e.this.children[t].getAttribute("type")}-external`),h(e.this.children[t]),e["template-shadow"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)console.log("~~~~~~template~~~~~~~",e.template.children[t].tagName),1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-light"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),h(e.template.children[t]),e["template-light"].push(e.template.children[t])):(e.template.children[t].setAttribute("type",`${e.template.children[t].getAttribute("type")}-external`),h(e.template.children[t]),e["template-shadow"].push(e.template.children[t]))}else{for(let t=0;t<e.this.children.length;t++)console.log("~~~~~~this~~~~~~~",e.this.children[t].tagName),1===e.this.children[t].tagName.split("-").length?("view"===e.this.children[t].slot&&(e.this.children[t].className="wall"),e["template-shadow"].push(e.this.children[t])):!0===e.getAttribute(e.this.children[t],"light","template")?(h(e.this.children[t]),e["template-shadow"].push(e.this.children[t])):(h(e.this.children[t]),e["template-light"].push(e.this.children[t]));for(let t=0;t<e.template.children.length;t++)console.log("~~~~~~template~~~~~~~",e.template.children[t].tagName),1===e.template.children[t].tagName.split("-").length?("view"===e.template.children[t].slot&&(e.template.children[t].className="wall"),e["template-shadow"].push(e.template.children[t])):!0===e.getAttribute(e.template.children[t],"light","template")?(h(e.template.children[t]),e["template-shadow"].push(e.template.children[t])):(h(e.template.children[t]),e["template-light"].push(e.template.children[t]))}for(let t in n)e.verify[t]=n[t];!0===e.verify.slider?function(e){return new Promise(function(t,l){fetch(`/static/html/components/varan-slider/template/${e.slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(l){let n=new DOMParser,s=n.parseFromString(l,"text/html");e.slider=s.getElementsByTagName("template")[0].content.cloneNode(!0);let i=document.createElement("section");if(i.className="slider",i.slot="view",i.appendChild(e.slider),e.slider=i,0===i.querySelectorAll(".ql-editor").length)t(e);else for(let e=0;e<i.querySelectorAll(".ql-editor").length;e++)if(0===i.querySelectorAll(".ql-editor")[e].children.length);else for(let t=0;t<i.querySelectorAll(".ql-editor")[e].children.length;t++)i.querySelectorAll(".ql-editor")[e].children[t].tagName.split("-").length>1&&h(i.querySelectorAll(".ql-editor")[e].children[t]);t(e)}).catch(e=>e)})}(e).then(e=>{e["template-light"].push(e.slider),e.this.appendChild(e.slider),function(e,t,l){return new Promise(function(l,n){if(t){switch(t){case"slider":(function(e,t){return new Promise(function(l,n){for(let n=0;n<e.state.length;n++)for(let s=0;s<e[`template-${e.state[n]}`].length;s++)0===e[`template-${e.state[n]}`][s].getElementsByClassName(t).length||(e.slider=e[`template-${e.state[n]}`][s].getElementsByClassName(t)[0],l(e[`template-${e.state[n]}`][s].getElementsByClassName(t)[0]))})})(e,"peppermint").then(t=>{(function(e){return new Promise(function(t,l){t(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){console.log("Peppermint setup done. Slides found: "+e)}}))})})(t).then(t=>{e.slider=t,l(e)})});break;default:console.log("какой то неизвестный тип",t)}l(e)}else l(e)})}(e,"slider").then(e=>{if(!0===e.verify.one)for(let l=0;l<e.state.length;l++)for(let n=0;n<e[`template-${e.state[l]}`].length;n++)console.log(e[`template-${e.state[l]}`][n]),"wall"===e[`template-${e.state[l]}`][n].className&&(e[`template-${e.state[l]}`].splice(n,1),t(e));else t(e)})}):t(e)})}function p(t,l){return new Promise(function(l,n){t.verify=[],t.this.getAttribute("preset")?(t["path-template"]=`/static/html/components/${t.component}/template/${t.this.getAttribute("preset")}/${t.component}-${t.this.getAttribute("preset")}.html`,t.preset=`${t.this.getAttribute("preset")}`,t.verify.preset=!0):(t["path-template"]=`/static/html/components/${t.component}/${t.component}.html`,t.verify.preset=!1),fetch(t["path-template"]).then(function(e){if(e.ok)return e.text()}).then(function(n){let s=(new DOMParser).parseFromString(n,"text/html");t.template=s.getElementsByTagName("template")[0].content.cloneNode(!0),function(t){return new Promise(function(l,n){t["path-external"]=`/static/html/components/${t.component}/external/${t.component}-external.html`,fetch(t["path-external"]).then(function(e){return!1===e.ok?e.ok:e.text()}).then(function(n){if(!1===n);else{let s=new DOMParser,i=s.parseFromString(n,"text/html");t.external=i.querySelectorAll("section"),function(t){return new Promise(function(l,n){t["external-property"]=e["external-property"];let s=[],i=[],o=[];for(let e=0;e<t.external.length;e++){for(let l=0;l<t.external[e].children.length;l++)switch(t.external[e].children[l].tagName){case"SCRIPT":t.external[e].getAttribute("id")?i.script=t.external[e].children[l]:console.log("у компонента нет id нужно в external property script  получить id для загрузки скрипта");break;case"COMPONENT-ID":i.id=t.external[e].children[l].innerText;break;case"COMPONENT-ACTION":for(let n=0;n<t.external[e].children[l].children.length;n++)o.push(t.external[e].children[l].children[n].innerText);i.actions=o;break;default:console.log(`Не отслеживается, по мере надобности добавляются [${t.external[e].children[l].tagName.toLowerCase()}]`)}s.push(i),i=[]}t["external-property"]=s,l(t)}).catch(e=>console.log("здесь я перехватывал отсутствие страницы но это убрал",e))}(t).then(e=>{0===e["external-property"].length?l(e):function(e){return new Promise(function(t,l){e["words-action"]=[];let n=[];for(let l=0;l<e["external-property"].length;l++){for(let t=0;t<e["external-property"][l].actions.length;t++)for(let s=0;s<e.words.length;s++)-1!==e["external-property"][l].actions[t].indexOf(e.words[s])&&("shadowRoot"!==e.words[s]&&"shadow"!==e.words[t]||(n.shadow=!0),"light"!==e.words[s]&&"лайт"!==e.words[t]||(n.light=!0),"editor"===e.words[s]&&(n.editor=!0),"слайдер"===e.words[s]&&(n["editor-slider"]=!0),"swap"===e.words[s]&&(n.swap=!0));e["words-action"]=n;for(let t in e["external-property"])for(let l in e["external-property"][t])switch(l){case"id":let n=document.createElement(e["external-property"][t][l]);n.setAttribute("type","external"),e.this.appendChild(n);break;default:console.log("какой то неизвестный тип",l)}t(e)}})}(e).then(e=>{l(e)})})}}).catch(e=>{throw e})})}(t).then(e=>{a(e,e["type-swap"],e["type-external"]).then(e=>{if(!0===e.verify.swap){if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t=0;t<e["template-shadow"].length;t++)e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t=0;t<e["template-light"].length;t++)e.this.appendChild(e["template-light"][t])}else{if(0!==e["template-shadow"].length){e.this.attachShadow({mode:"open"}),e.shadowRoot=!0;for(let t in e["template-shadow"])e.this.shadowRoot.appendChild(e["template-shadow"][t])}if(0!==e["template-light"].length)for(let t in e["template-light"])e.this.appendChild(e["template-light"][t])}l(e)})})}).catch(e=>e)})}function h(e){return new Promise(function(t,l){const n=document.createElement("script");let s=!1;for(let t in document.head.getElementsByTagName("script"))"object"==typeof document.head.getElementsByTagName("script")[t]&&-1!==document.head.getElementsByTagName("script")[t].outerHTML.indexOf(e.tagName.toLowerCase())&&(s=!0);!0===s?console.log("script уже загруже"):(n.src=`/static/html/components/${e.tagName.toLowerCase()}/${e.tagName.toLowerCase()}.js`,n.onload=t,n.onerror=l,document.head.appendChild(n))})}var c;window.addEventListener("mousemove",r.mousemoveFunction),(c=this,new Promise(function(e,t){let l=[];l.state=[],l.state.push("shadow"),l.state.push("light"),l.words=i,l["type-swap"]=!1,l["type-external"]=!1,l["document-offsetWidth"]=document.body.offsetWidth;let n=!1;if(l.getAttribute=((e,t,l)=>{if("template"===l){if(!e.getAttribute("type"))return console.log("не установлен тип ставим default"),e.setAttribute("type","default"),!1;for(let l=0;l<e.getAttribute("type").split("-").length;l++)e.getAttribute("type").split("-")[l]===t&&(n=!0);return n}if(console.log(e.this.getAttribute("type")),e[`verify-${t}`]=!1,0===e.this.getAttribute("type").split("-").length)return!1;for(let l=0;l<e.this.getAttribute("type").split("-").length;l++)e.this.getAttribute("type").split("-")[l]===t?e[`verify-${t}`]=!0:e[`verify-${t}`]=!1;return e[`verify-${t}`]}),c.tagName.toLowerCase()?l.component=c.tagName.toLowerCase():console.log("что то пошло не так middleware js objectProperty",""),"object"!=typeof c)console.log("objectProperty middleware.js пришёл не объект");else{if(c.getAttribute("type")){l.type=c.getAttribute("type").split("-");for(let e=0;e<l.type.length;e++)l.type[e]=l.type[e].replace(/:/g,"-");for(let e in l.type)switch(l.type[e]){case"swap":l["type-swap"]=!0;break;case"external":l["type-external"]=!0;break;default:console.log("дополнительные типы",l.type[e])}}else l.type=["default"],console.log("нет типа ставим default"),c.setAttribute("type","default");if(c.slot?l.slot=c.slot:(console.log("отсутствует слот, ставится- по тегу ",c.tagName.toLowerCase()),c.slot=c.tagName.toLowerCase(),l.slot=c.slot),c.getAttribute("type")){let e=!1;for(let t in c.getAttribute("type").split("-"))-1!==c.getAttribute("type").split("-")[t].indexOf("style:")&&(console.log("устанавливаются пути к стилям"),e=!0);!0===e?l["style-custom"]="not-default":(console.log("устанавливается стиль по default"),l["style-custom"]="default")}else console.log(" почему то нет атрибутов")}l.shadowRoot=!1,l.this=c,console.log(l.this),e(l)})).then(e=>(p(e).then(e=>(function(e){return new Promise(function(t,l){let n=document.createElement("style"),s=document.createElement("style");for(let t=0;t<e.type.length;t++)"swap"===e.type[t]?"scoped"===e.type[t]&&n.setAttribute("scoped",""):"scoped"===e.type[t]&&s.setAttribute("scoped","");for(let l=0;l<e.state.length;l++){switch(e[`path-style-${e.state[l]}`]=`@import '/static/html/components/${e.component}/${e.state[l]}/${e.component}.css'; @import '/static/html/components/${e.component}/${e.state[l]}/${e.component}-custom.css';`,e.state[l]){case"shadow":!0===e.verify.preset&&(e[`path-style-${e.state[l]}-preset`]=`@import '/static/html/components/${e.component}/template/${e.preset}/${e.component}-${e.preset}.css';`),n.innerText=e[`path-style-${e.state[l]}`]+e[`path-style-${e.state[l]}-preset`];break;case"light":!0===e.verify.preset&&(e[`path-style-${e.state[l]}-preset`]=`@import '/static/html/components/${e.component}/template/${e.preset}/${e.component}-${e.preset}.css';`),s.innerText=e[`path-style-${e.state[l]}`]+e[`path-style-${e.state[l]}-preset`];break;default:console.log("новый тип",e.state[l])}"swap"===e.state[l]?!0===e.shadowRoot?(e.this.shadowRoot.appendChild(s),e.this.appendChild(n),t(e)):e.this.appendChild(n):!0===e.shadowRoot?(e.this.shadowRoot.appendChild(n),e.this.appendChild(s),t(e)):e.this.appendChild(s)}t(e)})}(e).then(e=>(async function(e){console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",e,"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"),e["template-editor"]=[],e["parser-property"]=l,l.push("&lt;div"),l.push("&lt;/div"),l.push("&lt;style"),l.push("&lt;/style"),l.push("&lt;section"),l.push("/section&gt;"),l.push("&lt;article"),l.push("/article&gt;"),l.push("&lt;time"),l.push("/time&gt;"),l.push("&lt;/script"),l.push("&lt;script"),o.push("&lt;p"),o.push("&lt;/p"),o.push("&lt;style"),o.push("&lt;/style"),o.push("&lt;section"),o.push("/section&gt;"),o.push("&lt;article"),o.push("/article&gt;"),o.push("&lt;time"),o.push("/time&gt;"),n.push("div"),n.push("section"),n.push("style"),n.push("script"),n.push("varan-editor");let t=[],s=[],i=[],r=[];i=e.this.getElementsByClassName("wall")[0],s=e.this.getElementsByTagName("form")[0],t=e.this.getElementsByClassName("editor")[0],r=e.this.getElementsByClassName("peppermint-slides")[0];let a=new Quill(t,{modules:{toolbar:[["bold","italic","underline","strike"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["clean"]]},placeholder:"Введите сообщение...",theme:"snow"}),p=[];p.id=e.this.slot,p.url=location.hostname,p.component=e.this.tagName.toLowerCase(),p.user="anonymous",p["view-wall"]="",p["view-slider"]="",p["edit-content"]=[],p["editor-delta"]=JSON.stringify(a.getContents()),p["editor-type"]="public",p.captcha="",p.init=!1,p.count=0,p.status=-1,p.online=!1,p.Timestamp="",p["view-slider-pos"]=0,p["view-slider-db-Id"]=0,s.onsubmit=function(){return p.id=e.slot,p["editor-delta"]=JSON.stringify(a.getContents()),p["edit-content"]=a.root.innerHTML,p["view-slider"]=0,p["view-slider-pos"]=e.slider.getCurrentPos(),p["view-slider-db-Id"]=`0-${e.slider.getCurrentPos()}`,p.url=location.hostname,async function(t){r.children[e.slider.getCurrentPos()].innerHTML=a.root.innerHTML,i.innerHTML=a.root.innerHTML}(),!1},window.addEventListener("storage",function(e){});let h=[];function c(e){h=e}function d(){return h}e.this.addEventListener("keydown",e=>{!0===e.ctrlKey&&("c"===e.key&&c(document.documentElement.scrollTop),"v"===e.key&&c(document.documentElement.scrollTop))}),e.this.addEventListener("keypress",e=>{"v"===e.key&&c(-1)}),e.this.addEventListener("keyup",e=>{if(!0===e.ctrlKey){if(e.key,"v"===e.key){let e=d();e+=100,document.documentElement.scrollTop=e}}else if("v"===e.key&&-1!==d()){let e=d();e+=100,document.documentElement.scrollTop=e}})}(e),e)),e)),e))}});