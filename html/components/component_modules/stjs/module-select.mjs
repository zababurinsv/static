import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty_t.mjs";import Helper from"/static/html/components/component_modules/stjs/module-helper.mjs";import colorlog from"/static/html/components/component_modules/colorLog/colorLog.mjs";import TRANSFORM from"/static/html/components/component_modules/stjs/module-transform.mjs";let SELECT={},root={};SELECT.$progress=!1,SELECT.$selected=!1,SELECT.transformWith=((e,t,o)=>new Promise(async(E,r)=>{try{isEmpty(SELECT.$progress)&&(SELECT.$progress=null),isEmpty(SELECT.$parsed)&&(SELECT.$parsed=[]),isEmpty(o)||(SELECT=Object.assign(SELECT,o));let s={};s=isEmpty(e.template)?e:e.template,isEmpty(t)&&(e.serialized=t);try{t&&(s=JSON.parse(e))}catch(e){}if(SELECT.$template_root=s,String.prototype.$root=SELECT.$selected_root,Number.prototype.$root=SELECT.$selected_root,Function.prototype.$root=SELECT.$selected_root,Array.prototype.$root=SELECT.$selected_root,Boolean.prototype.$root=SELECT.$selected_root,root=SELECT.$selected_root,SELECT.$selected&&SELECT.$selected.length>0)SELECT.$selected.sort(function(e,t){return t.path.length-e.path.length}).forEach(function(e){console.assert(!1);let t=TRANSFORM.run(s,e.object,root);SELECT.$selected_root=Helper.resolve(SELECT.$selected_root,e.path,t),e.object=t}),SELECT.$selected.sort(function(e,t){return e.index-t.index});else{colorlog(!0,"TRANSFORM","2",e,"transformWith");let t=await TRANSFORM.run(s,SELECT.$selected_root,root);colorlog(!0,"out TRANSFORM in Helper.resolve","2",e,"transformWith"),SELECT.$selected_root=await Helper.resolve(SELECT.$selected_root,"",t)}delete String.prototype.$root,delete Number.prototype.$root,delete Function.prototype.$root,delete Array.prototype.$root,delete Boolean.prototype.$root,colorlog(!0,"end","2",SELECT,"transformWith"),(e=>{E(e)})(SELECT)}catch(e){(e=>{r(e)})({_:"error menu",error:e})}})),SELECT.select=((e,t,o)=>new Promise(async function(E,r){try{isEmpty(t)||(e.filter=t),isEmpty(o)||(e.serialized=o);let s={};s=isEmpty(e.this)?e:e.this;try{o&&(s=JSON.parse(e))}catch(e){}t?(SELECT.$selected=[],await SELECT.exec(s,"",t)):SELECT.$selected=null,s&&(await Helper.is_array(s)||"object"==typeof s)?(SELECT.$progress||(Helper.is_array(s)?(SELECT.$val=[],SELECT.$selected_root=[]):(SELECT.$val={},SELECT.$selected_root={})),Object.keys(s).forEach(function(e){SELECT.$val[e]=s[e],SELECT.$selected_root[e]=s[e]})):(SELECT.$val=s,SELECT.$selected_root=s),SELECT.$progress=!0,(e=>{E(e)})(SELECT)}catch(e){r({_:"error menu",error:e})}})),SELECT.exec=((e,t,o)=>new Promise(async function(E,r){try{if("string"==typeof e);else if(await Helper.is_array(e))for(let E=0;E<e.length;E++)await SELECT.exec(e[E],t+"["+E+"]",o);else for(let E in e)if("$root"!==E){if(o(E,e[E])){let o=SELECT.$selected.length;SELECT.$selected.push({index:o,key:E,path:t,object:e,value:e[E]})}await SELECT.exec(e[E],t+'["'+E+'"]',o)}}catch(e){s={_:"exec",error:e},console.log("~~~ err ~~~",s),r(s)}var s})),SELECT.objects=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.object})):t([SELECT.$selected_root])})),SELECT.keys=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.key})):Array.isArray(SELECT.$selected_root)?t(Object.keys(SELECT.$selected_root).map(function(e){return parseInt(e)})):t(Object.keys(SELECT.$selected_root))})),SELECT.paths=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.path})):Array.isArray(SELECT.$selected_root)?t(Object.keys(SELECT.$selected_root).map(function(e){return"["+e+"]"})):t(Object.keys(SELECT.$selected_root).map(function(e){return'["'+e+'"]'}))})),SELECT.values=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.value})):t(Object.values(SELECT.$selected_root))})),SELECT.root=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,t(SELECT.$selected_root)}));export default SELECT;