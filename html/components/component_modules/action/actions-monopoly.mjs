import colorlog from"/static/html/components/component_modules/colorLog/colorLog.mjs";import Json from"/static/html/components/component_modules/json/json.mjs";function bestCopyEver(t){return Object.assign({},t)}export default(t,o,a,n,e)=>new Promise(async(a,r)=>{switch("action",await colorlog(t,"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","action",n,e),e.toLowerCase()){case"button":let a=await Json(t),r=await a.select(n),i={};i=o.hasOwnProperty("property")?await a.transformWith(o.property,!1,r):await a.transformWith(o,!1,r);let s=await a.root(i);await colorlog(t,"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","action",s,e),document.dispatchEvent(new CustomEvent("actionButton",{detail:{_:"button",button:s}}));break;case"player":(async(t,o,a,n,e)=>{let r=await Json(t),i=await r.select(n),s={};s=o.hasOwnProperty("property")?await r.transformWith(o.property,!1,i):await r.transformWith(o,!1,i);let c=await r.root(s);await colorlog(t,"~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~","action",c,e),document.dispatchEvent(new CustomEvent("actionButton",{detail:{_:"button",button:c}}))})(t,o,0,n,e)}a({key:!0})});