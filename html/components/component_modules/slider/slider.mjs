export default(e,t,...n)=>new Promise(function(l,o){bundle.default(e,"export",async function(s,i){let r=e=>{l(e)},a=e=>{console.log("~~~ err router ~~~",e),o(e)};switch(t){case"getSliderTemplate":(async(e,t,n,o)=>{try{console.log(`${e.input}[(slider)${e[t]}]`),fetch(`/static/html/components/varan-slider/template/${e[t].slot}.html`).then(function(e){if(e.ok)return e.text()}).then(function(n){let o=(new DOMParser).parseFromString(n,"text/html");e[t].slider=o.getElementsByTagName("template")[0].content.cloneNode(!0);let s=document.createElement("section");s.className="slider",s.slot="view",s.appendChild(e.slider),e[t].slider=s,e[t]["slider-template"]=s;for(let t=0;t<e.type.length;t++)"slider-one-text"===e.type[t]&&(e.verify.sliderText=!0);matcher.database.request.functions.getObject(e).then(e=>{e.get?(pagination.init(e),pagination.action(e).then(e=>{r(e)})):l(e)})}).catch(e=>e)}catch(e){a(e)}})(e,n[0],n[1],n[2],n[3]);break;case"setSlider":(async(e,t,n,l)=>{try{console.log(`${e.input}[(slider)${e[t]}]`),r(Peppermint(e,{dots:!1,slideshow:!1,speed:500,slideshowInterval:5e3,stopSlideshowAfterInteraction:!0,onSetup:function(e){}}))}catch(e){a(e)}})(e,n[0],n[1],n[2],n[3]);break;default:a(`новая функция ${t}`)}})});