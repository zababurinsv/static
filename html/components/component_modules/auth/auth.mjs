import authtorize from"/static/html/components/component_modules/fetch/fetch.mjs";export default(obj,func,...args)=>new Promise(function(resolve,reject){let out=e=>{console.log("~~~ out  ~~~"),resolve(e)},err=e=>{console.log("~~~ err  ~~~",e),reject(e)};switch(func){case"auth":(async(obj,props,data)=>{try{switch(console.log(`app(${func}[(${obj.input})${obj[props]}]property)`),obj[props]){case"this":(async(obj,props,data)=>{try{"/admin"===window.location.pathname||"/admin/"===window.location.pathname?window.WavesKeeper?window.WavesKeeper.initialPromise.then(keeperApi=>{keeperApi.publicState().then(async e=>{await authtorize({input:"auth",type:"auth",data:e},"get","type")}).catch(error=>{window.WavesKeeper.auth({data:"Auth on my  site"}).then(data=>{fetch("https://waves.zababurinsv.now.sh/verify",{method:"POST",headers:{"Content-Type":"application/json",mode:"no-cors"},body:JSON.stringify({auth:data,id:"waves",object:"auth"})}).then(function(e){if(e.ok)return e.json();throw new Error("HTTP error, status = "+e.status)}).then(function(json){!0===json?(console.log("Waves Keeper data:"),console.log(json),out(json)):(document.body.innerHTML="",document.body.insertAdjacentHTML("afterbegin",eval(`${json}`)),out(!1))}).catch(function(e){console.assert(!1,"auth",e)})}).catch(e=>{console.log("~~~~~~~~~~~~~~~~~~~~"),console.error(e)})})}):alert("To Auth WavesKeeper should be installed."):out(!0)}catch(e){err(e)}})(obj,args[0],args[1],args[2],args[3]);break;default:err(`new type [(${func})${obj[props]}]`)}}catch(e){err(e)}})(obj,args[0],args[1],args[2],args[3]);break;default:err(`new function ${func}`)}});