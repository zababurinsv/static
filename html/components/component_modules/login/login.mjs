import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";import bundle from"/static/html/components/component_modules/bundle/bundle.mjs";export default async e=>new Promise(async(t,o)=>{let n=await bundle.default(),s={};s.code=n.code,s.count=0,s.TelephoneCode=n.countryTelephoneCode,s.template=document.createElement("div"),s.template.id="myDropdown",s.template.className="dropdown-content",s.getCookie=(async(e,t)=>{let o=("; "+e).split("; "+t+"=");if(2==o.length)return o.pop().split(";").shift()}),s.phoneCode=(async(e,t)=>{let o={code:void 0,phone:void 0};if(null===localStorage.getItem("signed"));else{let t=localStorage.getItem("signed");e.this.shadowRoot.querySelector("#signed").checked=JSON.parse(t)}return document.addEventListener("telegram-login",async t=>{o.code=t.detail.code,e.this.shadowRoot.querySelector("#code").innerText=t.detail.code,void 0===o.phone?e.this.shadowRoot.querySelector("div.buttonNext").style.display="none":e.this.shadowRoot.querySelector("div.buttonNext").style.display="flex"},!1),e.this.shadowRoot.querySelector("#phone").addEventListener("input",async t=>{let n=t.target.value.replace(/\s/g,"");10===n.length&&(o.phone=n,void 0===o.code?e.this.shadowRoot.querySelector("div.buttonNext").style.display="none":e.this.shadowRoot.querySelector("div.buttonNext").style.display="flex"),e.this.shadowRoot.querySelector("#phone").style.borderColor="#acb2b5",e.this.shadowRoot.querySelector("#code").style.borderColor="#acb2b5"}),e}),s["template-children"]=(async(e,t)=>t?`<div class="country"><div class="emoji">${e.emoji}</div><div class="name">${e.name}</div><div class="code">${e.code}</div></div>`:`<div class="country" style="display: none"><div class="emoji">${e.emoji}</div><div class="name">${e.name}</div><div class="code">${e.code}</div></div>`);for(let e in n.code.countries)if(1===n.code.countries[e][0].length);else{s.count++;let t={},o={};o.name=n.code.countries[e][0],o.emoji=n.code.flag(n.code.countries[e][0]),void 0===n.countryTelephoneCode(n.code.code(n.code.countries[e][0]))||(o.code=`+${n.countryTelephoneCode(n.code.code(n.code.countries[e][0]))[0]}`,t=s.count>6?await s["template-children"](o,!1):await s["template-children"](o,!0),s.template.insertAdjacentHTML("beforeend",t))}s.photoTemplate=(async e=>(e.this.shadowRoot.querySelector("div.telegram").style.cursor="pointer",e.this.shadowRoot.querySelector("div.telegram").innerHTML="",e.this.shadowRoot.querySelector("div.telegram").insertAdjacentHTML("afterbegin",'\n                  \n                  <label class="avatar" for="image"><img src="/static/html/components/telegram-login/images/cameraadd_svg.svg"><input required="" type="file" id="image"></label>\n                '),e.this.shadowRoot.querySelector(".head").innerHTML="",e.this.shadowRoot.querySelector(".head").insertAdjacentHTML("afterbegin","\n            <h1>Your Name</h1>\n            "),e.this.shadowRoot.querySelector(".message").innerText="",e.this.shadowRoot.querySelector(".message").insertAdjacentHTML("afterbegin","\n                <p>Enter your name and add</p>\n                <p>a profile picture</p>"),e.this.shadowRoot.querySelector("form").style.display="none",e.this.shadowRoot.querySelector(".buttonNext").remove(),e.this.shadowRoot.querySelector(".telegram").style.background="#7694f4",e.this.shadowRoot.querySelector("#login").insertAdjacentHTML("beforeend",'\n                <div id="bio">\n                    <input type="text" id="name" placeholder="name">\n                    <input type="text" id="last_name" placeholder="last name"></input>\n                </div>\n                '),e)),s.count=0,s.class=class{constructor(t){this.webComponents=e.name,this.code=(e=>n.countryTelephoneCode(n.code.code(e))),this.templateCode=(e=>(e.querySelector("#next").disabled=!0,e.querySelector(".telegram").style.background="transparent",e.querySelector("img.telegram").src="/static/html/components/telegram-login/images/monkey.png",e.querySelector("#next").innerText="PLEASE WAIT...",e.querySelector(".loader").style.display="flex",e)),this.templatePhoto=this.templatePhoto.bind(this),this.phoneCode=this.phoneCode.bind(this),this.getCookie=this.getCookie.bind(this)}self(){return s}phoneCode(e,t={}){return s.phoneCode(e,t)}getCookie(e,t={}){return s.getCookie(e,t)}templatePhoto(e){return s.photoTemplate(e)}get template(){return s.template}},t(s)});