import store from"../../../../../../static.frontend/static/html/components/component_modules/staticProperty/staticProperty.mjs";let handler={get:function(t,e){return console.log("~~~!!!~~~",t,e),t[e]},set:function(t,e,o){return t[e]=o,console.log("~~~!0!~~~",t[e],o),!0}};export default(t,e,...o)=>new Promise(function(n,r){let c=t=>{console.log("~~~ err  ~~~",t),r(t)};switch(e){case"init":(async(t,r,s)=>{try{switch(console.log(`app(${e}[(${t.input})${t[r]}]property)`),t[r]){case"queue":(async(t,e,o)=>{try{let t=await store({input:"proxy",type:"queue"},"proxy","type");(t=>{console.log("~~~ out  ~~~"),n(t)})(t=new Proxy(t,handler))}catch(t){c(t)}})(0,o[0],o[1],o[2],o[3]);break;default:c(`new type [(${e})${t[r]}]`)}}catch(t){c(t)}})(t,o[0],o[1],o[2],o[3]);break;default:c(`new function ${e}`)}});