import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";let obj={gapi:{},git:{},staticProperty:[]};obj.staticProperty.props=[],obj.gapi.props=(async t=>obj.staticProperty.props={CLIENT_ID:"65532128836-81nvk7kq2jhluec20p567n3vrv28m7lq.apps.googleusercontent.com",API_KEY:"AIzaSyCXA62m-07h--UlJHJtcSoFbufFtwbxQe4",DISCOVERY_DOCS:["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],SCOPES:"https://www.googleapis.com/auth/drive.metadata.readonly",authorizeButton:t.this.shadowRoot.querySelector("#authorizeButton"),signoutButton:t.this.shadowRoot.querySelector("#signoutButton"),pre:t.this.shadowRoot.querySelector("#content")}),obj.gapi.handleClientLoad=async function(){gapi.load("client:auth2",obj.gapi.initClient)},obj.gapi.initClient=(async()=>{gapi.client.init({apiKey:obj.staticProperty.props.API_KEY,clientId:obj.staticProperty.props.CLIENT_ID,discoveryDocs:obj.staticProperty.props.DISCOVERY_DOCS,scope:obj.staticProperty.props.SCOPES}).then(function(){gapi.auth2.getAuthInstance().isSignedIn.listen(obj.gapi.updateSigninStatus),obj.gapi.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()),obj.staticProperty.props.authorizeButton.onclick=obj.gapi.handleAuthClick,obj.staticProperty.props.signoutButton.onclick=obj.gapi.handleSignoutClick},function(t){obj.gapi.appendPre(JSON.stringify(t,null,2))})}),obj.gapi.updateSigninStatus=(async t=>{t?(obj.staticProperty.props.authorizeButton.style.display="none",obj.staticProperty.props.signoutButton.style.display="block",listFiles()):(obj.staticProperty.props.authorizeButton.style.display="block",obj.staticProperty.props.signoutButton.style.display="none")}),obj.gapi.handleAuthClick=(async()=>{gapi.auth2.getAuthInstance().signIn()}),obj.gapi.handleSignoutClick=(async()=>{gapi.auth2.getAuthInstance().signOut()}),obj.gapi.appendPre=(async t=>{let o=document.createTextNode(t+"\n");obj.staticProperty.props.pre.appendChild(o)}),obj.gapi.listFiles=(async()=>{gapi.client.drive.files.list({pageSize:10,fields:"nextPageToken, files(id, name)"}).then(function(t){obj.gapi.appendPre("Files:");var o=t.result.files;if(o&&o.length>0)for(var e=0;e<o.length;e++){var i=o[e];obj.gapi.appendPre(i.name+" ("+i.id+")")}else obj.gapi.appendPre("No files found.")})});export default(t={_:"default",obj:void 0})=>new Promise(async(o,e)=>{let i=t=>{o(t)};if(isEmpty(t._))console.assert(!1,"нет идентификатора _");else for(let o in t)switch(t._){case"init":isEmpty(t.obj)?console.assert(!1,"ужен объект с html для кнопок {_:`есть`, obj:`нужно добавить`} "):i(await obj.gapi.props(t.obj));break;case"handleClientLoad":i(await obj.gapi.handleClientLoad());break;default:console.warn(!1,"неизвестный идентификатор _ ---\x3e",t._)}});