import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";import url from"/static/html/components/component_modules/shortUrl/shortUrl.mjs";let obj={gapi:{},git:{},staticProperty:[]};obj.staticProperty.init={},obj.staticProperty.gapi=void 0,obj.staticProperty.props=[],obj.staticProperty.githubFiles=[];let loader=(e,t)=>new Promise(function(i,o){let a=document.createElement("script");a.src=e,document.body.appendChild(a),a.onload=(e=>{i(window[t])})});obj.gapi.props=(async e=>obj.staticProperty.props={CLIENT_ID:"65532128836-81nvk7kq2jhluec20p567n3vrv28m7lq.apps.googleusercontent.com",API_KEY:"AIzaSyCXA62m-07h--UlJHJtcSoFbufFtwbxQe4",DISCOVERY_DOCS:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],SCOPES:"https://www.googleapis.com/auth/drive.metadata.readonly",authorizeButton:e.this.shadowRoot.querySelector("#authorizeButton"),signoutButton:e.this.shadowRoot.querySelector("#signoutButton"),pre:e.this.shadowRoot.querySelector("#content")}),obj.gapi.handleClientLoad=async function(e){gapi.load("client:auth2",obj.gapi.initClient)},obj.gapi.initClient=(async()=>{gapi.client.init({apiKey:obj.staticProperty.props.API_KEY,clientId:obj.staticProperty.props.CLIENT_ID,discoveryDocs:obj.staticProperty.props.DISCOVERY_DOCS,scope:obj.staticProperty.props.SCOPES}).then(function(){gapi.auth2.getAuthInstance().isSignedIn.listen(obj.gapi.updateSigninStatus),obj.gapi.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()),obj.staticProperty.props.authorizeButton.onclick=obj.gapi.handleAuthClick,obj.staticProperty.props.signoutButton.onclick=obj.gapi.handleSignoutClick},function(e){obj.gapi.appendPre(JSON.stringify(e,null,2))})}),obj.gapi.updateSigninStatus=(async e=>{e?(obj.staticProperty.props.authorizeButton.style.display="none",obj.staticProperty.props.signoutButton.style.display="block",obj.staticProperty.gapi=gapi,localStorage.setItem("google","true"),obj.staticProperty.init().then(e=>{document.dispatchEvent(new CustomEvent("signInGoogle",{detail:{_:e._,id:e.id,parent:e.parent,previous:e.previous,files:e.files}}))})):(obj.staticProperty.props.authorizeButton.style.display="block",obj.staticProperty.props.signoutButton.style.display="none",obj.staticProperty.gapi=void 0,localStorage.removeItem("google"),obj.staticProperty.init().then(e=>{document.dispatchEvent(new CustomEvent("signOut",{detail:{_:e._,id:e.id,parent:e.parent,previous:e.previous,files:void 0}}))}))}),obj.gapi.handleAuthClick=(async()=>{gapi.auth2.getAuthInstance().signIn()}),obj.gapi.handleSignoutClick=(async()=>{gapi.auth2.getAuthInstance().signOut()}),obj.gapi.files=(async e=>{if(isEmpty(e._))console.assert(!1,"Должно быть определение obj:_");else if(isEmpty(e.parent))console.assert(!1,"Должно быть определение одительского объекта obj:parent",e);else{if(!isEmpty(e.id)){let t=await obj.staticProperty.gapi.client.drive.files.list({q:`'${e.folder.id}' in parents`,pageSize:10});return{_:e._,id:e.id,parent:e.parent,previous:e.previous,files:t.result.files}}console.assert(!1,"нет id",e)}}),obj.gapi.link=(async e=>{return{_:"response",link:`https://drive.google.com/uc?id=${e}`,webViewLink:(await obj.staticProperty.gapi.client.drive.files.get({fileId:e,fields:"webViewLink"})).result.webViewLink}}),obj.gapi.id=(async e=>{if(void 0!==e){return(await obj.staticProperty.gapi.client.drive.files.list({q:`mimeType='application/vnd.google-apps.folder' and name='${e}'`})).result.files[0]}console.assert(!1,"добавьте name file")}),obj.gapi.root=(async()=>{return(await obj.staticProperty.gapi.client.drive.files.get({fileId:"root"})).result}),obj.gapi.listFiles=(async e=>{let t=(await obj.staticProperty.gapi.client.drive.files.list({})).result.files,i=[];for(let e in t)switch(t[e].mimeType){case"image/png":case"image/jpeg":i.push({mimeType:t[e].mimeType,name:t[e].name,link:`https://drive.google.com/uc?id=${t[e].id}`});break;default:console.warn("необрабатываемый mime type",t[e].mimeType)}return`export default async ()=>{\nreturn JSON.parse(${JSON.stringify(i)})\n}`}),obj.gapi.recursive=(e=>new Promise(async function(t,i){let o=await obj.staticProperty.gapi.client.drive.files.list({q:`'${e.sendToGitHub}' in parents`,pageSize:10});o=o.result.files;for(let t in o)switch(o[t].mimeType){case"image/jpeg":case"image/png":obj.staticProperty.githubFiles.push({mimeType:o[t].mimeType,name:o[t].name,link:`https://drive.google.com/uc?id=${o[t].id}`});break;case"text/plain":break;case"application/vnd.google-apps.folder":await obj.gapi.recursive({sendToGitHub:o[t].id});break;default:console.assert(!1,"неизвестный тип данных",e[t].mimeType)}t({recursive:"true"})})),obj.gapi.dirFolder=(e=>{return new Promise(async function(t,i){for(let t in e)switch(e[t].mimeType){case"image/jpeg":case"image/png":obj.staticProperty.githubFiles.push({mimeType:e[t].mimeType,name:e[t].name,link:`https://drive.google.com/uc?id=${e[t].id}`});break;case"text/plain":break;case"application/vnd.google-apps.folder":await obj.gapi.recursive({sendToGitHub:e[t].id});break;default:console.assert(!1,"неизвестный тип данных",e[t].mimeType)}t(e)})}),obj.gapi.sendToGitHub=(async e=>{let t={};return"root"===e.sendToGitHub?t=await obj.gapi.listFiles():(t=await obj.staticProperty.gapi.client.drive.files.list({q:`'${e.sendToGitHub}' in parents`,pageSize:10}),await obj.gapi.dirFolder(t.result.files),t=obj.staticProperty.githubFiles,obj.staticProperty.githubFiles=[],t=`export default async ()=>{\nreturn JSON.parse(${JSON.stringify(t)})\n}`),document.dispatchEvent(new CustomEvent("textToGitHub",{detail:{_:"google.mjs",content:t}})),{send:"true"}});export default(e={_:"default",parent:void 0,obj:void 0})=>new Promise(async(t,i)=>{let o=e=>{t(e)};if(isEmpty(e._))console.assert(!1,"нет идентификатора _");else for(let t in e)switch(e._){case"init":isEmpty(e.obj)?console.assert(!1,"нужен объект с html для кнопок {_:`есть`, obj:`нужно добавить`} "):"obj"===t&&(await loader("https://apis.google.com/js/api.js","gapi"),await obj.gapi.props(e.obj),obj.staticProperty.init=(async()=>{if(void 0===obj.staticProperty.gapi)return o({singout:"ok"}),{_:"response",folder:void 0};{let t={},i=await obj.gapi.root(e);if(void 0===e.folder)return t=await obj.gapi.files({_:"root",parent:"root",previous:"root",id:i.id,folder:i});{let i=await obj.gapi.root(e);void 0!==t.folder&&(t=await obj.gapi.files({_:"root",parent:"root",previous:"root",id:i.id,folder:i}),t=await obj.gapi.files(t))}o({Google:"initialization is ok"})}}),await obj.gapi.handleClientLoad());break;case"folder":if(e._===t)if(void 0===e.parent)console.assert(!1,"укажите родительскую папку");else{let t={},i={};isEmpty(e.folder.id)?(t="root"===e.folder.toLowerCase()?await obj.gapi.root():await obj.gapi.id(`${e.folder.toLowerCase()}`),isEmpty(t)?o(void 0):(e.folder=t,e.id=e.folder.id,i=await obj.gapi.files(e),o(i))):(i=await obj.gapi.files(e),o(i))}break;case"root":if(e._===t){let t=await obj.gapi.root(e);console.assert(!1,t),o(t)}break;case"sendToGitHub":if(e._===t){let t=await obj.gapi.sendToGitHub(e);o(t)}break;case"link":e._===t&&o(await obj.gapi.link(e.link));break;default:console.warn(!1,"неизвестный идентификатор _ ---\x3e",e._)}});