import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty_t.mjs";import Helper from"/static/html/components/component_modules/json/module-helper.mjs";import colorlog from"/static/html/components/component_modules/colorLog/colorLog.mjs";import TRANSFORM from"/static/html/components/component_modules/json/module-transform.mjs";let SELECT={},root={};SELECT.$progress=!1,SELECT.$selected=!1,SELECT.staticProperty={},SELECT.staticProperty.view={},SELECT.transform=((e,t,o)=>new Promise(async(r,E)=>{try{SELECT.$parsed=[],SELECT.$progress=null;let s=e;try{t&&(s=JSON.parse(e))}catch(e){}if(SELECT.$template_root=SELECT.$selected_root,String.prototype.$root=s,Number.prototype.$root=s,Function.prototype.$root=s,Array.prototype.$root=s,Boolean.prototype.$root=s,root=s,SELECT.$selected&&SELECT.$selected.length>0)SELECT.$selected.sort(function(e,t){return console.assert(!1),t.path.length-e.path.length}).forEach(function(e){console.assert(!1);let t=TRANSFORM.run(e.object,s,o);SELECT.$template_root=Helper.resolve(SELECT.$template_root,e.path,t),SELECT.$selected_root=SELECT.$template_root,e.object=t}),SELECT.$selected.sort(function(e,t){return e.index-t.index});else{console.assert(!1,SELECT.$selected_root,s);let e=await TRANSFORM.run(SELECT.$selected_root,s,o);SELECT.$template_root=await Helper.resolve(SELECT.$template_root,"",e),SELECT.$selected_root=SELECT.$template_root}delete String.prototype.$root,delete Number.prototype.$root,delete Function.prototype.$root,delete Array.prototype.$root,delete Boolean.prototype.$root,(e=>{r(e)})(SELECT)}catch(e){(e=>{E(e)})({_:"transform",error:e})}})),SELECT.transformWith=((e,t,o,r)=>new Promise(async(E,s)=>{SELECT.staticProperty.view=r;try{isEmpty(SELECT.$progress)&&(SELECT.$progress=null),isEmpty(SELECT.$parsed)&&(SELECT.$parsed=[]),isEmpty(o)||(SELECT=Object.assign(SELECT,o));let l={};l=isEmpty(e.template)?e:e.template,isEmpty(t)&&(e.serialized=t);try{t&&(l=JSON.parse(e))}catch(e){}if(SELECT.$template_root=l,String.prototype.$root=SELECT.$selected_root,Number.prototype.$root=SELECT.$selected_root,Function.prototype.$root=SELECT.$selected_root,Array.prototype.$root=SELECT.$selected_root,Boolean.prototype.$root=SELECT.$selected_root,root=SELECT.$selected_root,SELECT.$selected&&SELECT.$selected.length>0)SELECT.$selected.sort(function(e,t){return t.path.length-e.path.length}).forEach(function(e){console.assert(!1);let t=TRANSFORM.run(l,e.object,r);SELECT.$selected_root=Helper.resolve(SELECT.$selected_root,e.path,t),e.object=t}),SELECT.$selected.sort(function(e,t){return e.index-t.index});else{colorlog(r,"TRANSFORM","2",e,"transformWith");let t=await TRANSFORM.run(l,SELECT.$selected_root,r);colorlog(r,"out TRANSFORM in Helper.resolve","2",e,"transformWith"),SELECT.$selected_root=await Helper.resolve(SELECT.$selected_root,"",t)}delete String.prototype.$root,delete Number.prototype.$root,delete Function.prototype.$root,delete Array.prototype.$root,delete Boolean.prototype.$root,colorlog(r,"end","2",SELECT,"transformWith"),(e=>{E(e)})(SELECT)}catch(e){(e=>{s(e)})({_:"error menu",error:e})}})),SELECT.transformWith=((e,t,o,r=!0)=>new Promise(async(E,s)=>{try{isEmpty(SELECT.$progress)&&(SELECT.$progress=null),isEmpty(SELECT.$parsed)&&(SELECT.$parsed=[]),isEmpty(o)||(SELECT=Object.assign(SELECT,o));let l={};l=isEmpty(e.template)?e:e.template,isEmpty(t)&&(e.serialized=t);try{t&&(l=JSON.parse(e))}catch(e){}if(SELECT.$template_root=l,String.prototype.$root=SELECT.$selected_root,Number.prototype.$root=SELECT.$selected_root,Function.prototype.$root=SELECT.$selected_root,Array.prototype.$root=SELECT.$selected_root,Boolean.prototype.$root=SELECT.$selected_root,root=SELECT.$selected_root,SELECT.$selected&&SELECT.$selected.length>0)SELECT.$selected.sort(function(e,t){return t.path.length-e.path.length}).forEach(function(e){console.assert(!1);let t=TRANSFORM.run(l,e.object,r);SELECT.$selected_root=Helper.resolve(SELECT.$selected_root,e.path,t),e.object=t}),SELECT.$selected.sort(function(e,t){return e.index-t.index});else{colorlog(r,"TRANSFORM","2",e,"transformWith");let t=await TRANSFORM.run(l,SELECT.$selected_root,r);colorlog(r,"out TRANSFORM in Helper.resolve","2",e,"transformWith"),SELECT.$selected_root=await Helper.resolve(SELECT.$selected_root,"",t)}delete String.prototype.$root,delete Number.prototype.$root,delete Function.prototype.$root,delete Array.prototype.$root,delete Boolean.prototype.$root,colorlog(r,"end","2",SELECT,"transformWith"),(e=>{E(e)})(SELECT)}catch(e){(e=>{s(e)})({_:"error menu",error:e})}})),SELECT.select=((e,t,o,r)=>new Promise(async function(E,s){SELECT.staticProperty.view=r;try{isEmpty(t)||(e.filter=t),isEmpty(o)||(e.serialized=o);let l={};l=isEmpty(e.this)?e:e.this;try{o&&(l=JSON.parse(e))}catch(e){}if(t?(SELECT.$selected=[],await SELECT.exec(l,"",t)):SELECT.$selected=null,l&&(await Helper.is_array(l)||"object"==typeof l)){SELECT.$progress||(await Helper.is_array(l)?(SELECT.$val=[],SELECT.$selected_root=[]):(SELECT.$val={},SELECT.$selected_root={}));let e=Object.keys(l);for(let t=0;t<e.length;t++)SELECT.$val[`${e[t]}`]=l[`${e[t]}`],SELECT.$selected_root[`${e[t]}`]=l[`${e[t]}`];colorlog(r,{assert:!1,property:l},"function",SELECT,"SELECT.select")}else SELECT.$val=l,SELECT.$selected_root=l;SELECT.$progress=!0,(e=>{colorlog(SELECT.staticProperty.view,{end:!0,property:"~~~ end SELECT.select end ~~~"},"function",e,"SELECT.select"),E(e)})(SELECT)}catch(e){s({_:"error menu",error:e})}})),SELECT.exec=((e,t,o,r)=>new Promise(async function(r,E){try{if("string"==typeof e);else if(await Helper.is_array(e))for(let r=0;r<e.length;r++)await SELECT.exec(e[r],t+"["+r+"]",o);else for(let r in e)if("$root"!==r){if(o(r,e[r])){let o=SELECT.$selected.length;SELECT.$selected.push({index:o,key:r,path:t,object:e,value:e[r]})}await SELECT.exec(e[r],t+'["'+r+'"]',o)}}catch(e){s={_:"exec",error:e},console.log("~~~ err ~~~",s),E(s)}var s})),SELECT.objects=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.object})):t([SELECT.$selected_root])})),SELECT.keys=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.key})):Array.isArray(SELECT.$selected_root)?t(Object.keys(SELECT.$selected_root).map(function(e){return parseInt(e)})):t(Object.keys(SELECT.$selected_root))})),SELECT.paths=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.path})):Array.isArray(SELECT.$selected_root)?t(Object.keys(SELECT.$selected_root).map(function(e){return"["+e+"]"})):t(Object.keys(SELECT.$selected_root).map(function(e){return'["'+e+'"]'}))})),SELECT.values=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,SELECT.$selected?t(SELECT.$selected.map(function(e){return e.value})):t(Object.values(SELECT.$selected_root))})),SELECT.root=((e={_:"SELECT",SELECT:void 0})=>new Promise(async function(t,o){isEmpty(e.SELECT)||(SELECT=e.SELECT),SELECT.$progress=null,t(SELECT.$selected_root)}));export default SELECT;