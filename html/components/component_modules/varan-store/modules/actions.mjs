import pagination from"/static/html/components/component_modules/varan-pagination/varan-pagination.js";import matcher from"/static/html/components/component_modules/matcher/module.js";import Slider from"/static/html/components/component_modules/varan-slider/varan-slider.js";let style={};function getSliderTemplate(e){return new Promise(function(t,n){fetch(`/static/html/components/varan-slider/template/${e.slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(n){let l=(new DOMParser).parseFromString(n,"text/html");e.slider=l.getElementsByTagName("template")[0].content.cloneNode(!0);let s=document.createElement("section");s.className="slider",s.slot="view",s.appendChild(e.slider),e.slider=s,e["slider-template"]=s,matcher.database.request.functions.getObject(e).then(e=>{e.get[`${e.slot}`]?(pagination.init(e),pagination.action(e).then(e=>{console.log("2222222222222dfgdf2222222222222222222111111111111111111111",e.get),t(e)})):console.log("отсутствуют записи для данного объекта")})}).catch(e=>e)})}function getElementsByClassName(e,t){return new Promise(function(n,l){for(let l=0;l<e.state.length;l++)for(let s=0;s<e[`template-${e.state[l]}`].length;s++)0===e[`template-${e.state[l]}`][s].getElementsByClassName(t).length||(e.slider=e[`template-${e.state[l]}`][s].getElementsByClassName(t)[0],n(e[`template-${e.state[l]}`][s].getElementsByClassName(t)[0]))})}function setSlider(e){return new Promise(function(t,n){t(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){console.log("Peppermint22222 setup done. Slides found: "+e)}}))})}function setExternalComponent(e,t){return new Promise(function(n,l){if(t){switch(t){case"slider":getElementsByClassName(e,"peppermint").then(t=>{setSlider(t).then(t=>{e.slider=t,n(e)})});break;default:console.log("какой то неизвестный тип",t)}n(e)}else n(e)})}style.staticProperty=0;const varanEditor=e=>new Promise(function(t,n){switch(console.log("varanEditor",e.this),e.events.detail.task.newValue){case"editor":console.log("varanEditor-editor",e.this),matcher.database.request.functions.getObject(e).then(e=>{if(e.get[`${e.slot}`])for(let n=0;n<e.this.children.length;n++)e.this.children[n].hasAttribute("class")&&("wall"===e.this.children[n].className||"slider"===e.this.children[n].className&&getSliderTemplate(e).then(e=>{setExternalComponent(e,"slider").then(e=>{e.this.querySelector(".slider").slot="view",e.this.querySelector(".varan-editor").slot="edit";for(let t=0;t<e.this.children.length;t++)"STYLE"===e.this.children[t].tagName&&(e.this.children[t].innerText=style.staticProperty);t(e)})}));else console.log("отсутствуют записи для данного объекта")});break;case"gallery":console.log("varanEditor-gallery",e.this);for(let n=0;n<e.this.children.length;n++)if(e.this.children[n].hasAttribute("class"))if("wall"===e.this.children[n].className){e.this.querySelector(".wall").slot="null",e.this.querySelector(".varan-editor").slot="null";for(let t=0;t<e.this.children.length;t++)"STYLE"===e.this.children[t].tagName&&(console.log("varanEditor-style-editor",e.this.children[t].innerText),style.staticProperty=e.this.children[t].innerText,e.this.children[t].innerText="");t(e)}else if("slider"===e.this.children[n].className){e.this.querySelector(".slider").slot="null",e.this.querySelector(".varan-editor").slot="null";for(let t=0;t<e.this.children.length;t++)"STYLE"===e.this.children[t].tagName&&(console.log("varanEditor-style-editor",e.this.children[t].innerText),style.staticProperty=e.this.children[t].innerText,e.this.children[t].innerText="");t(e)}break;default:console.log("~~~новый~~~тип~~~:",e.events.detail.task.newValue),t(e)}}),varanCrop=e=>new Promise(function(t,n){if(console.log("varanCrop",e.events),JSON.stringify(e.events.detail.obj)in localStorage)switch(e.events.detail.task.newValue){case"editor":console.log("varanCrop-editor",e.events),e.this.querySelector("#gallery").style.display="none",e.this.slot="null",t(e);break;case"gallery":console.log("varanCrop-gallery",e.events),e=pagination.init(e),matcher.database.request.functions.getObject(e).then(e=>{console.log("varanCrop-gallery-getObject",e),e.get[`${e.slot}`]?pagination.action(e).then(e=>{e.this.querySelector("#gallery").style.display="flex",e.this.querySelector(".menu").style.display="flex",e.this.slot="view",t(e)}):console.log("отсутствуют записи для данного объекта")});break;default:console.log("~~~новый~~~тип~~~:",e.events.detail.task.newValue),t(e)}}),router=e=>new Promise(function(t,n){switch(console.log("~~~~~~actions~~~~~~~~",e.component),e.component){case"varan-editor":varanEditor(e).then(e=>{t(e)});break;case"varan-crop":varanCrop(e).then(e=>{t(e)});break;default:console.log("~~~новый~~~тип~~~actions:",e.component),t(e)}});export default{router:router};