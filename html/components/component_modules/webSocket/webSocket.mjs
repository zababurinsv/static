let object={staticProperty:[]};object.staticProperty.socket=void 0,object.staticProperty.verify=!0,object.staticProperty.create=(t=>(void 0===object.staticProperty.socket?(object.staticProperty.verify=!1,object.staticProperty.socket=new WebSocket(`${t}`)):object.staticProperty.verify=!0,object.staticProperty.socket));export default async t=>new Promise((t,e)=>{object.socketProtocol="wss",object.class=class{constructor(t){this.socket=object.staticProperty.create(`${t}`),!0===object.staticProperty.verify||(this.socket.onopen=function(){console.log("connect is open");let t=new CustomEvent("openConnect",{detail:{data:"openConnect"}});document.dispatchEvent(t)},this.socket.onclose=function(t){t.wasClean?(console.log("Соединение закрыто чисто"),object.staticProperty.socket=void 0):(console.log("Обрыв соединения"),object.staticProperty.socket=void 0),console.log("Код: "+t.code)},this.socket.onerror=function(t){console.warn("Ошибка "+t)},this.socket.addEventListener("message",function(t){let e=JSON.parse(t.data);switch(console.log("response~~~~~~~",e._,e),e._){case"error":let t=new CustomEvent("error",{detail:{data:e}});document.dispatchEvent(t);break;case"authorizationStateWaitRegistration":let a=new CustomEvent("authorizationStateWaitRegistration",{detail:{data:"authorizationStateWaitRegistration"}});document.dispatchEvent(a);break;case"updateSupergroupFullInfo":let o=new CustomEvent("updateSupergroupFullInfo",{detail:{data:e}});document.dispatchEvent(o);break;case"updateMessageContent":let s=new CustomEvent("updateMessageContent",{detail:{data:e}});document.dispatchEvent(s);break;case"updateDeleteMessages":let n=new CustomEvent("updateDeleteMessages",{detail:{data:e}});document.dispatchEvent(n);break;case"authorizationStateWaitCode":let i=new CustomEvent("authorizationStateWaitCode",{detail:{data:e}});document.dispatchEvent(i);break;case"authorizationStateWaitPhoneNumber":let d=new CustomEvent("authorizationStateWaitPhoneNumber",{detail:{data:"authorizationStateWaitPhoneNumber"}});document.dispatchEvent(d);break;case"PrivateChat":let r=new CustomEvent("PrivateChat",{detail:{title:e.PrivateChat.chat.title,id:e.PrivateChat.chat.id,data:e}});document.dispatchEvent(r);break;case"user":let c=new CustomEvent("user",{detail:{first_name:e.first_name,id:e.id,last_name:e.last_name,phone_number:e.phone_number,username:e.username,data:e,status:e.status._}});document.dispatchEvent(c);break;case"userProfilePhotos":let u=new CustomEvent("userProfilePhotos",{detail:{data:e}});document.dispatchEvent(u);break;case"updateUserFullInfo":let l=new CustomEvent("updateUserFullInfo",{detail:{data:e}});document.dispatchEvent(l);break;case"updateNewMessage":let h=new CustomEvent("updateNewMessage",{detail:{data:e}});document.dispatchEvent(h);break;case"userFullInfo":let m=new CustomEvent("userFullInfo",{detail:{data:e}});document.dispatchEvent(m);break;case"chat":let p=new CustomEvent("chat",{detail:{data:e}});document.dispatchEvent(p);break;case"authorizationStateWaitPassword":let v=new CustomEvent("authorizationStateWaitPassword",{detail:{data:e}});document.dispatchEvent(v);break;case"authorizationStateReady":let E=new CustomEvent("authorizationStateReady",{detail:{data:e}});document.dispatchEvent(E);break;case"updateUserStatus":let b=new CustomEvent("updateUserStatus",{detail:{data:e}});document.dispatchEvent(b);break;case"updateChatLastMessage":let C={photo:void 0,text:void 0},w={};if(void 0===e.last_message)w=new CustomEvent("updateChatLastMessage",{detail:{data:e}}),document.dispatchEvent(w);else{switch(e.last_message.content._){case"messagePhoto":C.photo=e.last_message.content.photo.minithumbnail.data;break;case"messageText":C.text=e.last_message.content.text.text;break;default:console.log("!!!!!!!!!!!!!!!!!!!!!!!",e.last_message.content._)}w=new CustomEvent("updateChatLastMessage",{detail:{content:C.text,photo:C.photo,chat_id:e.chat_id,id:e.last_message.id,sender_user_id:e.last_message.sender_user_id,order:e.order,data:e,date:e.last_message.date}}),document.dispatchEvent(w)}break;case"WebRTC":document.cookie=`webRTC= ${e.id}`,sessionStorage.setItem("uid",e.id);break;case"updateNewChat":let k=new CustomEvent("updateNewChat",{detail:{data:e}});document.dispatchEvent(k);break;case"updateSupergroup":let g=new CustomEvent("updateSupergroup",{detail:{data:e}});document.dispatchEvent(g);break;case"updateUser":let S=new CustomEvent("updateUser",{detail:{first_name:e.user.first_name,id:e.user.id,last_name:e.user.last_name,phone_number:e.user.phone_number,username:e.user.username,data:e,status:e.user.status._}});document.dispatchEvent(S);break;case"updateAuthorizationState":switch(e.authorization_state._){case"authorizationStateWaitCode":let t=new CustomEvent("authorizationStateWaitCode",{detail:{data:e}});document.dispatchEvent(t);break;case"updateMessageContent":let a=new CustomEvent("updateMessageContent",{detail:{data:e}});document.dispatchEvent(a);break;case"authorizationStateWaitEncryptionKey":let o=new CustomEvent("authorizationStateWaitEncryptionKey",{detail:{data:e}});document.dispatchEvent(o);break;case"authorizationStateWaitTdlibParameters":let s=new CustomEvent("authorizationStateWaitTdlibParameters",{detail:{data:e}});document.dispatchEvent(s);break;case"authorizationStateWaitPassword":let n=new CustomEvent("authorizationStateWaitPassword",{detail:{data:e}});document.dispatchEvent(n);break;case"authorizationStateReady":let i=new CustomEvent("authorizationStateReady",{detail:{data:e}});document.dispatchEvent(i);break;case"authorizationStateWaitRegistration":let d=new CustomEvent("authorizationStateWaitRegistration",{detail:{data:e}});document.dispatchEvent(d);break;case"authorizationStateLoggingOut":let r=new CustomEvent("authorizationStateLoggingOut",{detail:{data:e}});document.dispatchEvent(r);break;case"authorizationStateWaitPhoneNumber":let c=new CustomEvent("authorizationStateWaitPhoneNumber",{detail:{data:e}});document.dispatchEvent(c);break;case"authorizationStateClosed":let u=new CustomEvent("authorizationStateClosed",{detail:{data:e}});document.dispatchEvent(u);break;default:console.warn("необрабатывается",e)}break;default:console.warn("необрабатывается",e)}}))}self(){return object}},t(object)});