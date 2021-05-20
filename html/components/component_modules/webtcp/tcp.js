function Http(j){this.cID=Math.random().toString(36).substr(2);this.webtcp=j;this.webtcp.httpClients[this.cID]=this;this.createPacket=function(){return{cID:this.cID,type:"http",host:this.remoteAddress,port:this.remotePort,method:null,data:null}};this.ondata=function(){};this.get=function(g,c){this.on("data",c);this.rpc("httpGet",[g])};this.post=function(g,c,j){this.on("data",j);this.rpc("httpPost",[g,c])}}Http.prototype=new WebTCPIO;function Socket(j,g,c,p){this.sID=Math.random().toString(36).substr(2);this.webtcp=j;this.closed=this.ready=!1;this.options=p;this.sockOpts={_updating:!1};this.remoteAddress=g;this.remotePort=c;this.webtcp.sockets[this.sID]=this;this.createPacket=function(){return{id:Math.random().toString(36).substr(2),sID:this.sID,type:"tcp",options:this.options,host:this.remoteAddress,port:this.remotePort,data:null}};this.onconnect=function(){this.webtcp.sockets[sID].ready=!0;this.webtcp.sockets[sID].closed=!1};
this.ondata=function(){};this.onend=function(){};this.ontimeout=function(){};this.ondrain=function(){};this.onclose=function(){this.webtcp.sockets[sID].ready=!1;this.webtcp.sockets[sID].closed=!0};this.getSockOpts=function(){this.sockOpts._updating=!0;this.rpc("getSockOpts")};this.onSockOptsRcv=function(c){this.sockOpts=c;this.sockOpts._updating=!1}}Socket.prototype=new WebTCPIO;var JSON;JSON||(JSON={});
(function(){function j(c,p){var q,t,n,x,i=k,e,l=p[c];l&&"object"==typeof l&&"function"==typeof l.toJSON&&(l=l.toJSON(c));"function"==typeof r&&(l=r.call(p,c,l));switch(typeof l){case "string":return g(l);case "number":return isFinite(l)?String(l):"null";case "boolean":case "null":return String(l);case "object":if(!l)return"null";k+=v;e=[];if("[object Array]"===Object.prototype.toString.apply(l)){x=l.length;for(q=0;q<x;q+=1)e[q]=j(q,l)||"null";n=0===e.length?"[]":k?"[\n"+k+e.join(",\n"+k)+"\n"+i+"]":
"["+e.join(",")+"]";k=i;return n}if(r&&"object"==typeof r){x=r.length;for(q=0;q<x;q+=1)"string"==typeof r[q]&&(t=r[q],n=j(t,l),n&&e.push(g(t)+(k?": ":":")+n))}else for(t in l)Object.prototype.hasOwnProperty.call(l,t)&&(n=j(t,l),n&&e.push(g(t)+(k?": ":":")+n));n=0===e.length?"{}":k?"{\n"+k+e.join(",\n"+k)+"\n"+i+"}":"{"+e.join(",")+"}";k=i;return n}}function g(c){n.lastIndex=0;return n.test(c)?'"'+c.replace(n,function(c){var g=D[c];return"string"==typeof g?g:"\\u"+("0000"+c.charCodeAt(0).toString(16)).slice(-4)})+
'"':'"'+c+'"'}function c(c){return 10>c?"0"+c:c}"use strict";"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+c(this.getUTCMonth()+1)+"-"+c(this.getUTCDate())+"T"+c(this.getUTCHours())+":"+c(this.getUTCMinutes())+":"+c(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var p=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
n=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,k,v,D={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},r;"function"!=typeof JSON.stringify&&(JSON.stringify=function(c,g,p){var n;v=k="";if("number"==typeof p)for(n=0;n<p;n+=1)v+=" ";else"string"==typeof p&&(v=p);r=g;if(!g||"function"==typeof g||"object"==typeof g&&"number"==typeof g.length)return j("",{"":c});throw Error("JSON.stringify");});"function"!=
typeof JSON.parse&&(JSON.parse=function(c,g){function j(c,k){var i,e,l=c[k];if(l&&"object"==typeof l)for(i in l)Object.prototype.hasOwnProperty.call(l,i)&&(e=j(l,i),void 0!==e?l[i]=e:delete l[i]);return g.call(c,k,l)}var k,c=String(c);p.lastIndex=0;p.test(c)&&(c=c.replace(p,function(c){return"\\u"+("0000"+c.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(c.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return k=eval("("+c+")"),"function"==typeof g?j({"":k},""):k;throw new SyntaxError("JSON.parse");})})();
SockJS=function(){var j=document,g=window,c={},p=function(){};p.prototype.addEventListener=function(a,b){this._listeners||(this._listeners={});a in this._listeners||(this._listeners[a]=[]);var f=this._listeners[a];-1===c.arrIndexOf(f,b)&&f.push(b)};p.prototype.removeEventListener=function(a,b){if(this._listeners&&a in this._listeners){var f=this._listeners[a],d=c.arrIndexOf(f,b);-1!==d&&(1<f.length?this._listeners[a]=f.slice(0,d).concat(f.slice(d+1)):delete this._listeners[a])}};p.prototype.dispatchEvent=
function(a){var b=a.type,c=Array.prototype.slice.call(arguments,0);this["on"+b]&&this["on"+b].apply(this,c);if(this._listeners&&b in this._listeners)for(var d=0;d<this._listeners[b].length;d++)this._listeners[b][d].apply(this,c)};var n=function(a,b){this.type=a;if("undefined"!=typeof b)for(var c in b)b.hasOwnProperty(c)&&(this[c]=b[c])};n.prototype.toString=function(){var a=[],b;for(b in this)if(this.hasOwnProperty(b)){var c=this[b];"function"==typeof c&&(c="[function]");a.push(b+"="+c)}return"SimpleEvent("+
a.join(", ")+")"};var k=function(a){this.events=a||[]};k.prototype.emit=function(a){var b=Array.prototype.slice.call(arguments,1);!this.nuked&&this["on"+a]&&this["on"+a].apply(this,b);-1===c.arrIndexOf(this.events,a)&&c.log("Event "+JSON.stringify(a)+" not listed "+JSON.stringify(this.events)+" in "+this)};k.prototype.nuke=function(){this.nuked=!0;for(var a=0;a<this.events.length;a++)delete this[this.events[a]]};c.random_string=function(a,b){var b=b||37,c,d=[];for(c=0;c<a;c++)d.push("abcdefghijklmnopqrstuvwxyz0123456789_".substr(Math.floor(Math.random()*
b),1));return d.join("")};c.random_number=function(a){return Math.floor(Math.random()*a)};c.random_number_string=function(a){var b=(""+(a-1)).length;return(Array(b+1).join("0")+c.random_number(a)).slice(-b)};c.getOrigin=function(a){return(a+"/").split("/").slice(0,3).join("/")};c.isSameOriginUrl=function(a,b){return b||(b=g.location.href),a.split("/").slice(0,3).join("/")===b.split("/").slice(0,3).join("/")};c.getParentDomain=function(a){return/^[0-9.]*$/.test(a)||/^\[/.test(a)||!/[.]/.test(a)?a:
a.split(".").slice(1).join(".")};c.objectExtend=function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);return a};c.polluteGlobalNamespace=function(){"_jp"in g||(g._jp={})};c.closeFrame=function(a,b){return"c"+JSON.stringify([a,b])};c.userSetCode=function(a){return 1E3===a||3E3<=a&&4999>=a};c.countRTO=function(a){var b;return 100<a?b=3*a:b=a+200,b};c.log=function(){g.console&&console.log&&console.log.apply&&console.log.apply(console,arguments)};c.bind=function(a,b){return a.bind?a.bind(b):function(){return a.apply(b,
arguments)}};c.flatUrl=function(a){return-1===a.indexOf("?")&&-1===a.indexOf("#")};c.amendUrl=function(a){var b=j.location;if(!a)throw Error("Wrong url for SockJS");if(!c.flatUrl(a))throw Error("Only basic urls are supported in SockJS");return 0===a.indexOf("//")&&(a=b.protocol+a),0===a.indexOf("/")&&(a=b.protocol+"//"+b.host+a),a=a.replace(/[/]+$/,""),a};c.arrIndexOf=function(a,b){for(var c=0;c<a.length;c++)if(a[c]===b)return c;return-1};c.arrSkip=function(a,b){var f=c.arrIndexOf(a,b);return-1===
f?a.slice():a.slice(0,f).concat(a.slice(f+1))};c.isArray=Array.isArray||function(a){return 0<={}.toString.call(a).indexOf("Array")};c.delay=function(a,b){return"function"==typeof a&&(b=a,a=0),setTimeout(b,a)};var v=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,D={"\x00":"\\u0000","\u0001":"\\u0001","\u0002":"\\u0002","\u0003":"\\u0003","\u0004":"\\u0004","\u0005":"\\u0005","\u0006":"\\u0006","\u0007":"\\u0007","\b":"\\b",
"\t":"\\t","\n":"\\n","\x0B":"\\u000b","\f":"\\f","\r":"\\r","\u000e":"\\u000e","\u000f":"\\u000f","\u0010":"\\u0010","\u0011":"\\u0011","\u0012":"\\u0012","\u0013":"\\u0013","\u0014":"\\u0014","\u0015":"\\u0015","\u0016":"\\u0016","\u0017":"\\u0017","\u0018":"\\u0018","\u0019":"\\u0019","\u001a":"\\u001a","\u001b":"\\u001b","\u001c":"\\u001c","\u001d":"\\u001d","\u001e":"\\u001e","\u001f":"\\u001f",'"':'\\"',"\\":"\\\\","\u007f":"\\u007f","\u0080":"\\u0080","\u0081":"\\u0081","\u0082":"\\u0082",
"\u0083":"\\u0083","\u0084":"\\u0084","\u0085":"\\u0085","\u0086":"\\u0086","\u0087":"\\u0087","\u0088":"\\u0088","\u0089":"\\u0089","\u008a":"\\u008a","\u008b":"\\u008b","\u008c":"\\u008c","\u008d":"\\u008d","\u008e":"\\u008e","\u008f":"\\u008f","\u0090":"\\u0090","\u0091":"\\u0091","\u0092":"\\u0092","\u0093":"\\u0093","\u0094":"\\u0094","\u0095":"\\u0095","\u0096":"\\u0096","\u0097":"\\u0097","\u0098":"\\u0098","\u0099":"\\u0099","\u009a":"\\u009a","\u009b":"\\u009b","\u009c":"\\u009c","\u009d":"\\u009d",
"\u009e":"\\u009e","\u009f":"\\u009f","\u00ad":"\\u00ad","\u0600":"\\u0600","\u0601":"\\u0601","\u0602":"\\u0602","\u0603":"\\u0603","\u0604":"\\u0604","\u070f":"\\u070f","\u17b4":"\\u17b4","\u17b5":"\\u17b5","\u200c":"\\u200c","\u200d":"\\u200d","\u200e":"\\u200e","\u200f":"\\u200f","\u2028":"\\u2028","\u2029":"\\u2029","\u202a":"\\u202a","\u202b":"\\u202b","\u202c":"\\u202c","\u202d":"\\u202d","\u202e":"\\u202e","\u202f":"\\u202f","\u2060":"\\u2060","\u2061":"\\u2061","\u2062":"\\u2062","\u2063":"\\u2063",
"\u2064":"\\u2064","\u2065":"\\u2065","\u2066":"\\u2066","\u2067":"\\u2067","\u2068":"\\u2068","\u2069":"\\u2069","\u206a":"\\u206a","\u206b":"\\u206b","\u206c":"\\u206c","\u206d":"\\u206d","\u206e":"\\u206e","\u206f":"\\u206f","\ufeff":"\\ufeff","\ufff0":"\\ufff0","\ufff1":"\\ufff1","\ufff2":"\\ufff2","\ufff3":"\\ufff3","\ufff4":"\\ufff4","\ufff5":"\\ufff5","\ufff6":"\\ufff6","\ufff7":"\\ufff7","\ufff8":"\\ufff8","\ufff9":"\\ufff9","\ufffa":"\\ufffa","\ufffb":"\\ufffb","\ufffc":"\\ufffc","\ufffd":"\\ufffd",
"\ufffe":"\\ufffe","\uffff":"\\uffff"},r=/[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
B,M=JSON&&JSON.stringify||function(a){return v.lastIndex=0,v.test(a)&&(a=a.replace(v,function(a){return D[a]})),'"'+a+'"'};c.quote=function(a){a=M(a);r.lastIndex=0;if(r.test(a)){if(!B){var b,c={},d=[];for(b=0;65536>b;b++)d.push(String.fromCharCode(b));B=(r.lastIndex=0,d.join("").replace(r,function(a){return c[a]="\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4),""}),r.lastIndex=0,c)}a=a.replace(r,function(a){return B[a]})}return a};var q="websocket xdr-streaming xhr-streaming iframe-eventsource iframe-htmlfile xdr-polling xhr-polling iframe-xhr-polling jsonp-polling".split(" ");
c.probeProtocols=function(){for(var a={},b=0;b<q.length;b++){var c=q[b];a[c]=e[c]&&e[c].enabled()}return a};c.detectProtocols=function(a,b,c){var d={},h=[];b||(b=q);for(var m=0;m<b.length;m++){var g=b[m];d[g]=a[g]}var e=function(a){var b=a.shift();d[b]?h.push(b):0<a.length&&e(a)};return!1!==c.websocket&&e(["websocket"]),d["xhr-streaming"]&&!c.null_origin?h.push("xhr-streaming"):d["xdr-streaming"]&&!c.cookie_needed&&!c.null_origin?h.push("xdr-streaming"):e(["iframe-eventsource","iframe-htmlfile"]),
d["xhr-polling"]&&!c.null_origin?h.push("xhr-polling"):d["xdr-polling"]&&!c.cookie_needed&&!c.null_origin?h.push("xdr-polling"):e(["iframe-xhr-polling","jsonp-polling"]),h};c.createHook=function(){var a="a"+c.random_string(8);if(!("_sockjs_global"in g)){var b={};g._sockjs_global=function(a){return a in b||(b[a]={id:a,del:function(){delete b[a]}}),b[a]}}return g._sockjs_global(a)};c.attachMessage=function(a){c.attachEvent("message",a)};c.attachEvent=function(a,b){"undefined"!=typeof g.addEventListener?
g.addEventListener(a,b,!1):(j.attachEvent("on"+a,b),g.attachEvent("on"+a,b))};c.detachMessage=function(a){c.detachEvent("message",a)};c.detachEvent=function(a,b){"undefined"!=typeof g.addEventListener?g.removeEventListener(a,b,!1):(j.detachEvent("on"+a,b),g.detachEvent("on"+a,b))};var t={},C=!1,x=function(){for(var a in t)t[a](),delete t[a]},i=function(){C||(C=!0,x())};c.attachEvent("beforeunload",i);c.attachEvent("unload",i);c.unload_add=function(a){var b=c.random_string(8);return t[b]=a,C&&c.delay(x),
b};c.unload_del=function(a){a in t&&delete t[a]};c.createIframe=function(a,b){var f=j.createElement("iframe"),d,h,m=function(){clearTimeout(d);try{f.onload=null}catch(a){}f.onerror=null},g=function(){f&&(m(),setTimeout(function(){f&&f.parentNode.removeChild(f);f=null},0),c.unload_del(h))};return f.src=a,f.style.display="none",f.style.position="absolute",f.onerror=function(){f&&(g(),b("onerror"))},f.onload=function(){clearTimeout(d);d=setTimeout(function(){f&&(g(),b("onload timeout"))},2E3)},j.body.appendChild(f),
d=setTimeout(function(){f&&(g(),b("timeout"))},15E3),h=c.unload_add(g),{post:function(a,b){try{f&&f.contentWindow&&f.contentWindow.postMessage(a,b)}catch(c){}},cleanup:g,loaded:m}};c.createHtmlfile=function(a,b){var f=new ActiveXObject("htmlfile"),d,h,m,e=function(){clearTimeout(d)},j=function(){f&&(e(),c.unload_del(h),m.parentNode.removeChild(m),m=f=null,CollectGarbage())};f.open();f.write('<html><script>document.domain="'+document.domain+'";<\/script></html>');f.close();f.parentWindow._jp=g._jp;
var i=f.createElement("div");return f.body.appendChild(i),m=f.createElement("iframe"),i.appendChild(m),m.src=a,d=setTimeout(function(){f&&(j(),b("timeout"))},15E3),h=c.unload_add(j),{post:function(a,b){try{m&&m.contentWindow&&m.contentWindow.postMessage(a,b)}catch(c){}},cleanup:j,loaded:e}};i=function(){};i.prototype=new k(["chunk","finish"]);i.prototype._start=function(a,b,f,d){var h=this;try{h.xhr=new XMLHttpRequest}catch(m){}if(!h.xhr)try{h.xhr=new g.ActiveXObject("Microsoft.XMLHTTP")}catch(e){}if(g.ActiveXObject||
g.XDomainRequest)b+=(-1===b.indexOf("?")?"?":"&")+"t="+ +new Date;h.unload_ref=c.unload_add(function(){h._cleanup(!0)});try{h.xhr.open(a,b,!0)}catch(j){h.emit("finish",0,"");h._cleanup();return}if(!d||!d.no_credentials)h.xhr.withCredentials="true";if(d&&d.headers)for(var i in d.headers)h.xhr.setRequestHeader(i,d.headers[i]);h.xhr.onreadystatechange=function(){if(h.xhr){var a=h.xhr;switch(a.readyState){case 3:try{var b=a.status,c=a.responseText}catch(d){}c&&0<c.length&&h.emit("chunk",b,c);break;case 4:h.emit("finish",
a.status,a.responseText),h._cleanup(!1)}}};h.xhr.send(f)};i.prototype._cleanup=function(a){if(this.xhr){c.unload_del(this.unload_ref);this.xhr.onreadystatechange=function(){};if(a)try{this.xhr.abort()}catch(b){}this.unload_ref=this.xhr=null}};i.prototype.close=function(){this.nuke();this._cleanup(!0)};(c.XHRCorsObject=function(){var a=this,b=arguments;c.delay(function(){a._start.apply(a,b)})}).prototype=new i;(c.XHRLocalObject=function(a,b,f){var d=this;c.delay(function(){d._start(a,b,f,{no_credentials:!0})})}).prototype=
new i;i=c.XDRObject=function(a,b,f){var d=this;c.delay(function(){d._start(a,b,f)})};i.prototype=new k(["chunk","finish"]);i.prototype._start=function(a,b,f){var d=this,h=new XDomainRequest,b=b+((-1===b.indexOf("?")?"?":"&")+"t="+ +new Date),g=h.ontimeout=h.onerror=function(){d.emit("finish",0,"");d._cleanup(!1)};h.onprogress=function(){d.emit("chunk",200,h.responseText)};h.onload=function(){d.emit("finish",200,h.responseText);d._cleanup(!1)};d.xdr=h;d.unload_ref=c.unload_add(function(){d._cleanup(!0)});
try{d.xdr.open(a,b),d.xdr.send(f)}catch(e){g()}};i.prototype._cleanup=function(a){if(this.xdr){c.unload_del(this.unload_ref);this.xdr.ontimeout=this.xdr.onerror=this.xdr.onprogress=this.xdr.onload=null;if(a)try{this.xdr.abort()}catch(b){}this.unload_ref=this.xdr=null}};i.prototype.close=function(){this.nuke();this._cleanup(!0)};c.isXHRCorsCapable=function(){return g.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest?1:g.XDomainRequest&&j.domain?2:s.enabled()?3:4};var e=function(a,b,f){var d=this,
h;d._options={devel:!1,debug:!1,protocols_whitelist:[],info:void 0,rtt:void 0};f&&c.objectExtend(d._options,f);d._base_url=c.amendUrl(a);d._server=d._options.server||c.random_number_string(1E3);d._options.protocols_whitelist&&d._options.protocols_whitelist.length?h=d._options.protocols_whitelist:("string"==typeof b&&0<b.length?h=[b]:c.isArray(b)?h=b:h=null,h&&d._debug('Deprecated API: Use "protocols_whitelist" option instead of supplying protocol list as a second parameter to SockJS constructor.'));
d._protocols=[];d.protocol=null;d.readyState=e.CONNECTING;d._ir=N(d._base_url);d._ir.onfinish=function(a,b){d._ir=null;a?(d._options.info&&(a=c.objectExtend(a,d._options.info)),d._options.rtt&&(b=d._options.rtt),d._applyInfo(a,b,h),d._didClose()):d._didClose(1002,"Can't connect to server",!0)}};e.prototype=new p;e.version="0.3.2";e.CONNECTING=0;e.OPEN=1;e.CLOSING=2;e.CLOSED=3;e.prototype._debug=function(){this._options.debug&&c.log.apply(c,arguments)};e.prototype._dispatchOpen=function(){this.readyState===
e.CONNECTING?(this._transport_tref&&(clearTimeout(this._transport_tref),this._transport_tref=null),this.readyState=e.OPEN,this.dispatchEvent(new n("open"))):this._didClose(1006,"Server lost session")};e.prototype._dispatchMessage=function(a){this.readyState===e.OPEN&&this.dispatchEvent(new n("message",{data:a}))};e.prototype._dispatchHeartbeat=function(){this.readyState===e.OPEN&&this.dispatchEvent(new n("heartbeat",{}))};e.prototype._didClose=function(a,b,f){var d=this;if(d.readyState!==e.CONNECTING&&
d.readyState!==e.OPEN&&d.readyState!==e.CLOSING)throw Error("INVALID_STATE_ERR");d._ir&&(d._ir.nuke(),d._ir=null);d._transport&&(d._transport.doCleanup(),d._transport=null);var h=new n("close",{code:a,reason:b,wasClean:c.userSetCode(a)});if(!c.userSetCode(a)&&d.readyState===e.CONNECTING&&!f){if(d._try_next_protocol(h))return;h=new n("close",{code:2E3,reason:"All transports failed",wasClean:!1,last_event:h})}d.readyState=e.CLOSED;c.delay(function(){d.dispatchEvent(h)})};e.prototype._didMessage=function(a){switch(a.slice(0,
1)){case "o":this._dispatchOpen();break;case "a":for(var a=JSON.parse(a.slice(1)||"[]"),b=0;b<a.length;b++)this._dispatchMessage(a[b]);break;case "m":a=JSON.parse(a.slice(1)||"null");this._dispatchMessage(a);break;case "c":a=JSON.parse(a.slice(1)||"[]");this._didClose(a[0],a[1]);break;case "h":this._dispatchHeartbeat()}};e.prototype._try_next_protocol=function(a){var b=this;b.protocol&&(b._debug("Closed transport:",b.protocol,""+a),b.protocol=null);for(b._transport_tref&&(clearTimeout(b._transport_tref),
b._transport_tref=null);;){a=b.protocol=b._protocols.shift();if(!a)return!1;if(e[a]&&!0===e[a].need_body&&(!j.body||"undefined"!=typeof j.readyState&&"complete"!==j.readyState))return b._protocols.unshift(a),b.protocol="waiting-for-load",c.attachEvent("load",function(){b._try_next_protocol()}),!0;if(e[a]&&e[a].enabled(b._options)){b._transport_tref=c.delay((b._options.rto||0)*(e[a].roundTrips||1)||5E3,function(){b.readyState===e.CONNECTING&&b._didClose(2007,"Transport timeouted")});var f=c.random_string(8),
f=b._base_url+"/"+b._server+"/"+f;return b._debug("Opening transport:",a," url:"+f," RTO:"+b._options.rto),b._transport=new e[a](b,f,b._base_url),!0}b._debug("Skipping transport:",a)}};e.prototype.close=function(a,b){if(a&&!c.userSetCode(a))throw Error("INVALID_ACCESS_ERR");return this.readyState!==e.CONNECTING&&this.readyState!==e.OPEN?!1:(this.readyState=e.CLOSING,this._didClose(a||1E3,b||"Normal closure"),!0)};e.prototype.send=function(a){if(this.readyState===e.CONNECTING)throw Error("INVALID_STATE_ERR");
return this.readyState===e.OPEN&&this._transport.doSend(c.quote(""+a)),!0};e.prototype._applyInfo=function(a,b,f){this._options.info=a;this._options.rtt=b;this._options.rto=c.countRTO(b);this._options.info.null_origin=!j.domain;b=c.probeProtocols();this._protocols=c.detectProtocols(b,f,a)};i=e.websocket=function(a,b){var f=this,d=b+"/websocket";"https"===d.slice(0,5)?d="wss"+d.slice(5):d="ws"+d.slice(4);f.ri=a;f.url=d;f.ws=new (g.WebSocket||g.MozWebSocket)(f.url);f.ws.onmessage=function(a){f.ri._didMessage(a.data)};
f.unload_ref=c.unload_add(function(){f.ws.close()});f.ws.onclose=function(){f.ri._didMessage(c.closeFrame(1006,"WebSocket connection broken"))}};i.prototype.doSend=function(a){this.ws.send("["+a+"]")};i.prototype.doCleanup=function(){var a=this.ws;a&&(a.onmessage=a.onclose=null,a.close(),c.unload_del(this.unload_ref),this.unload_ref=this.ri=this.ws=null)};i.enabled=function(){return!!g.WebSocket||!!g.MozWebSocket};i.roundTrips=2;var l=function(){};l.prototype.send_constructor=function(a){this.send_buffer=
[];this.sender=a};l.prototype.doSend=function(a){this.send_buffer.push(a);this.send_stop||this.send_schedule()};l.prototype.send_schedule_wait=function(){var a=this,b;a.send_stop=function(){a.send_stop=null;clearTimeout(b)};b=c.delay(25,function(){a.send_stop=null;a.send_schedule()})};l.prototype.send_schedule=function(){var a=this;if(0<a.send_buffer.length){var b="["+a.send_buffer.join(",")+"]";a.send_stop=a.sender(a.trans_url,b,function(){a.send_stop=null;a.send_schedule_wait()});a.send_buffer=
[]}};l.prototype.send_destructor=function(){this._send_stop&&this._send_stop();this._send_stop=null};var O=function(a,b,f){if(!("_send_form"in this)){var d=this._send_form=j.createElement("form"),h=this._send_area=j.createElement("textarea");h.name="d";d.style.display="none";d.style.position="absolute";d.method="POST";d.enctype="application/x-www-form-urlencoded";d.acceptCharset="UTF-8";d.appendChild(h);j.body.appendChild(d)}var d=this._send_form,h=this._send_area,g="a"+c.random_string(8);d.target=
g;d.action=a+"/jsonp_send?i="+g;var e;try{e=j.createElement('<iframe name="'+g+'">')}catch(i){e=j.createElement("iframe"),e.name=g}e.id=g;d.appendChild(e);e.style.display="none";try{h.value=b}catch(k){c.log("Your browser is seriously broken. Go home! "+k.message)}d.submit();var l=function(){e.onerror&&(e.onreadystatechange=e.onerror=e.onload=null,c.delay(500,function(){e.parentNode.removeChild(e);e=null}),h.value="",f())};return e.onerror=e.onload=l,e.onreadystatechange=function(){"complete"==e.readyState&&
l()},l},P=function(a){return function(b,c,d){return(new a("POST",b+"/xhr_send",c)).onfinish=function(a){d(a)},function(a){d(0,a)}}},i=e["jsonp-polling"]=function(a,b){c.polluteGlobalNamespace();this.ri=a;this.trans_url=b;this.send_constructor(O);this._schedule_recv()};i.prototype=new l;i.prototype._schedule_recv=function(){var a=this,b=a.trans_url+"/jsonp",f="a"+c.random_string(6),b=b+"?c="+escape("_jp."+f),d=function(b){delete g._jp[f];a._recv_stop=null;b&&(a._is_closing||a.ri._didMessage(b));a._is_closing||
a._schedule_recv()},e,m=j.createElement("script"),i,k=function(a){i&&(i.parentNode.removeChild(i),i=null);m&&(clearTimeout(e),m.parentNode.removeChild(m),m.onreadystatechange=m.onerror=m.onload=m.onclick=null,m=null,d(a),d=null)},l=!1,p=null;m.id="a"+c.random_string(8);m.src=b;m.type="text/javascript";m.charset="UTF-8";m.onerror=function(){p||(p=setTimeout(function(){l||k(c.closeFrame(1006,"JSONP script loaded abnormally (onerror)"))},1E3))};m.onload=function(){k(c.closeFrame(1006,"JSONP script loaded abnormally (onload)"))};
m.onreadystatechange=function(){if(/loaded|closed/.test(m.readyState)){if(m&&m.htmlFor&&m.onclick){l=!0;try{m.onclick()}catch(a){}}m&&k(c.closeFrame(1006,"JSONP script loaded abnormally (onreadystatechange)"))}};if("undefined"==typeof m.async&&j.attachEvent)if(/opera/i.test(navigator.userAgent))i=j.createElement("script"),i.text="try{var a = document.getElementById('"+m.id+"'); if(a)a.onerror();}catch(x){};",m.async=i.async=!1;else{try{m.htmlFor=m.id,m.event="onclick"}catch(n){}m.async=!0}"undefined"!=
typeof m.async&&(m.async=!0);e=setTimeout(function(){k(c.closeFrame(1006,"JSONP script loaded abnormally (timeout)"))},35E3);b=j.getElementsByTagName("head")[0];b=(b.insertBefore(m,b.firstChild),i&&b.insertBefore(i,b.firstChild),k);g._jp[f]=b;a._recv_stop=function(){g._jp[f]&&g._jp[f](c.closeFrame(1E3,"JSONP user aborted read"))}};i.enabled=function(){return!0};i.need_body=!0;i.prototype.doCleanup=function(){this._is_closing=!0;this._recv_stop&&this._recv_stop();this.ri=this._recv_stop=null;this.send_destructor()};
i=function(){};i.prototype=new l;i.prototype.run=function(a,b,c,d,e){this.ri=a;this.trans_url=b;this.send_constructor(P(e));this.poll=new E(a,d,b+c,e)};i.prototype.doCleanup=function(){this.poll&&(this.poll.abort(),this.poll=null)};var w=e["xhr-streaming"]=function(a,b){this.run(a,b,"/xhr_streaming",y,c.XHRCorsObject)};w.prototype=new i;w.enabled=function(){return g.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest&&!/opera/i.test(navigator.userAgent)};w.roundTrips=2;w.need_body=!0;l=e["xdr-streaming"]=
function(a,b){this.run(a,b,"/xhr_streaming",y,c.XDRObject)};l.prototype=new i;l.enabled=function(){return!!g.XDomainRequest};l.roundTrips=2;var F=e["xhr-polling"]=function(a,b){this.run(a,b,"/xhr",y,c.XHRCorsObject)};F.prototype=new i;F.enabled=w.enabled;F.roundTrips=2;w=e["xdr-polling"]=function(a,b){this.run(a,b,"/xhr",y,c.XDRObject)};w.prototype=new i;w.enabled=l.enabled;w.roundTrips=2;var s=function(){};s.prototype.i_constructor=function(a,b,f){var d=this;d.ri=a;d.origin=c.getOrigin(f);d.base_url=
f;d.trans_url=b;a=f+"/iframe.html";d.ri._options.devel&&(a+="?t="+ +new Date);d.window_id=c.random_string(8);a+="#"+d.window_id;d.iframeObj=c.createIframe(a,function(a){d.ri._didClose(1006,"Unable to load an iframe ("+a+")")});d.onmessage_cb=c.bind(d.onmessage,d);c.attachMessage(d.onmessage_cb)};s.prototype.doCleanup=function(){if(this.iframeObj){c.detachMessage(this.onmessage_cb);try{this.iframeObj.iframe.contentWindow&&this.postMessage("c")}catch(a){}this.iframeObj.cleanup();this.onmessage_cb=this.iframeObj=
this.iframeObj=null}};s.prototype.onmessage=function(a){if(a.origin===this.origin){var b=a.data.slice(0,8),c=a.data.slice(8,9),a=a.data.slice(9);if(b===this.window_id)switch(c){case "s":this.iframeObj.loaded();this.postMessage("s",JSON.stringify([e.version,this.protocol,this.trans_url,this.base_url]));break;case "t":this.ri._didMessage(a)}}};s.prototype.postMessage=function(a,b){this.iframeObj.post(this.window_id+a+(b||""),this.origin)};s.prototype.doSend=function(a){this.postMessage("m",a)};s.enabled=
function(){var a=navigator&&navigator.userAgent&&-1!==navigator.userAgent.indexOf("Konqueror");return("function"==typeof g.postMessage||"object"==typeof g.postMessage)&&!a};var G,H=function(a,b){parent!==g?parent.postMessage(G+a+(b||""),"*"):c.log("Can't postMessage, no parent window.",a,b)},u=function(){};u.prototype._didClose=function(a,b){H("t",c.closeFrame(a,b))};u.prototype._didMessage=function(a){H("t",a)};u.prototype._doSend=function(a){this._transport.doSend(a)};u.prototype._doCleanup=function(){this._transport.doCleanup()};
c.parent_origin=void 0;e.bootstrap_iframe=function(){var a;G=j.location.hash.slice(1);c.attachMessage(function(b){if(b.source===parent&&("undefined"==typeof c.parent_origin&&(c.parent_origin=b.origin),b.origin===c.parent_origin)){var f=b.data.slice(0,8),d=b.data.slice(8,9),b=b.data.slice(9);if(f===G)switch(d){case "s":var h=JSON.parse(b),f=h[0],d=h[1],b=h[2],h=h[3];f!==e.version&&c.log('Incompatibile SockJS! Main site uses: "'+f+'", the iframe: "'+e.version+'".');if(!c.flatUrl(b)||!c.flatUrl(h)){c.log("Only basic urls are supported in SockJS");
break}if(!c.isSameOriginUrl(b)||!c.isSameOriginUrl(h)){c.log("Can't connect to different domain from within an iframe. ("+JSON.stringify([g.location.href,b,h])+")");break}a=new u;a._transport=new u[d](a,b,h);break;case "m":a._doSend(b);break;case "c":a&&a._doCleanup(),a=null}}});H("s")};var z=function(a,b){var f=this;c.delay(function(){f.doXhr(a,b)})};z.prototype=new k(["finish"]);z.prototype.doXhr=function(a,b){var f=this,d=(new Date).getTime(),e=new b("GET",a+"/info"),g=c.delay(8E3,function(){e.ontimeout()});
e.onfinish=function(a,b){clearTimeout(g);g=null;if(200===a){var c=(new Date).getTime()-d,e=JSON.parse(b);"object"!=typeof e&&(e={});f.emit("finish",e,c)}else f.emit("finish")};e.ontimeout=function(){e.close();f.emit("finish")}};var K=function(a){var b=this,f=function(){var c=new s;c.protocol="w-iframe-info-receiver";var f=function(a){"string"==typeof a&&"m"===a.substr(0,1)?(a=JSON.parse(a.substr(1)),b.emit("finish",a[0],a[1])):b.emit("finish");c.doCleanup();c=null};c.i_constructor({_options:{},_didClose:f,
_didMessage:f},a,a)};j.body?f():c.attachEvent("load",f)};K.prototype=new k(["finish"]);var L=function(){var a=this;c.delay(function(){a.emit("finish",{},2E3)})};L.prototype=new k(["finish"]);var N=function(a){if(c.isSameOriginUrl(a))return new z(a,c.XHRLocalObject);switch(c.isXHRCorsCapable()){case 1:return new z(a,c.XHRLocalObject);case 2:return new z(a,c.XDRObject);case 3:return new K(a);default:return new L}};(u["w-iframe-info-receiver"]=function(a,b,f){(new z(f,c.XHRLocalObject)).onfinish=function(b,
c){a._didMessage("m"+JSON.stringify([b,c]));a._didClose()}}).prototype.doCleanup=function(){};k=e["iframe-eventsource"]=function(){this.protocol="w-iframe-eventsource";this.i_constructor.apply(this,arguments)};k.prototype=new s;k.enabled=function(){return"EventSource"in g&&s.enabled()};k.need_body=!0;k.roundTrips=3;(u["w-iframe-eventsource"]=function(a,b){this.run(a,b,"/eventsource",I,c.XHRLocalObject)}).prototype=new i;k=e["iframe-xhr-polling"]=function(){this.protocol="w-iframe-xhr-polling";this.i_constructor.apply(this,
arguments)};k.prototype=new s;k.enabled=function(){return g.XMLHttpRequest&&s.enabled()};k.need_body=!0;k.roundTrips=3;(u["w-iframe-xhr-polling"]=function(a,b){this.run(a,b,"/xhr",y,c.XHRLocalObject)}).prototype=new i;k=e["iframe-htmlfile"]=function(){this.protocol="w-iframe-htmlfile";this.i_constructor.apply(this,arguments)};k.prototype=new s;k.enabled=function(){return s.enabled()};k.need_body=!0;k.roundTrips=3;(u["w-iframe-htmlfile"]=function(a,b){this.run(a,b,"/htmlfile",J,c.XHRLocalObject)}).prototype=
new i;var E=function(a,b,c,d){this.ri=a;this.Receiver=b;this.recv_url=c;this.AjaxObject=d;this._scheduleRecv()};E.prototype._scheduleRecv=function(){var a=this,b=a.poll=new a.Receiver(a.recv_url,a.AjaxObject);b.onmessage=function(b){a.ri._didMessage(b.data)};b.onclose=function(c){a.poll=b=b.onmessage=b.onclose=null;a.poll_is_closing||("permanent"===c.reason?a.ri._didClose(1006,"Polling error ("+c.reason+")"):a._scheduleRecv())}};E.prototype.abort=function(){this.poll_is_closing=!0;this.poll&&this.poll.abort()};
var I=function(a){var b=this,f=new EventSource(a);f.onmessage=function(a){b.dispatchEvent(new n("message",{data:unescape(a.data)}))};b.es_close=f.onerror=function(a,e){var g=e?"user":2!==f.readyState?"network":"permanent";b.es_close=f.onmessage=f.onerror=null;f.close();f=null;c.delay(200,function(){b.dispatchEvent(new n("close",{reason:g}))})}};I.prototype=new p;I.prototype.abort=function(){this.es_close&&this.es_close({},!0)};var A,J=function(a){var b=this;c.polluteGlobalNamespace();b.id="a"+c.random_string(6,
26);a+=(-1===a.indexOf("?")?"?":"&")+"c="+escape("_jp."+b.id);if(void 0===A)if("ActiveXObject"in g)try{A=!!new ActiveXObject("htmlfile")}catch(f){}else A=!1;var d=A?c.createHtmlfile:c.createIframe,e;g._jp[b.id]={start:function(){e.loaded()},message:function(a){b.dispatchEvent(new n("message",{data:a}))},stop:function(){b.iframe_close({},"network")}};b.iframe_close=function(a,c){e.cleanup();b.iframe_close=e=null;delete g._jp[b.id];b.dispatchEvent(new n("close",{reason:c}))};e=d(a,function(){b.iframe_close({},
"permanent")})};J.prototype=new p;J.prototype.abort=function(){this.iframe_close&&this.iframe_close({},"user")};var y=function(a,b){var c=this,d=0;c.xo=new b("POST",a,null);c.xo.onchunk=function(a,b){if(200===a)for(;;){var e=b.slice(d),g=e.indexOf("\n");if(-1===g)break;d+=g+1;e=e.slice(0,g);c.dispatchEvent(new n("message",{data:e}))}};c.xo.onfinish=function(a,b){c.xo.onchunk(a,b);c.xo=null;c.dispatchEvent(new n("close",{reason:200===a?"network":"permanent"}))}};return y.prototype=new p,y.prototype.abort=
function(){this.xo&&(this.xo.close(),this.dispatchEvent(new n("close",{reason:"user"})),this.xo=null)},e.getUtils=function(){return c},e.getIframeTransport=function(){return s},e}();"_sockjs_onload"in window&&setTimeout(_sockjs_onload,1);"function"==typeof define&&define.amd&&define("sockjs",[],function(){return SockJS});function WebTCP(j,g){this.sockets={};this.httpClients={};this.sock=new SockJS("http://"+j+":"+g+"/bridge");this.ready=!1;this.outputBuffer=[];var c=this;this.sock.onopen=function(){c.ready=!0;c.processBuffer()};this.processBuffer=function(){if(0<this.outputBuffer.length&&this.ready)for(var c in this.outputBuffer)this.sock.send(this.outputBuffer[c])};this.sock.onmessage=function(g){g.data=JSON.parse(g.data);g.data.sID?(sID=g.data.sID,c.sockets[sID].onEvent(g.data.eventName,g.data.data)):g.data.cID&&
(cID=g.data.cID,c.httpClients[cID].onEvent(g.data.eventName,g.data.data))};this.sock.onclose=function(){console.log("close")};this.createSocket=function(c,g,j){return new Socket(this,c,g,j)};this.createHTTPClient=function(){return new Http(this)}};function WebTCPIO(){this.onEvent=function(j,g){this["on"+j](g);if(this["on"+j+"Custom"])this["on"+j+"Custom"](g)};this.on=function(j,g){this["on"+j+"Custom"]=g};this.rpc=function(j,g){var c=this.createPacket();c.command=j;c.args=g;this.send(JSON.stringify(c));return c.id};this.write=function(j){var g=this.createPacket();g.data=j;this.send(JSON.stringify(g));return g.id};this.send=function(j){if(this.webtcp.ready)this.webtcp.sock.send(j);else{if(this.webtcp.outputBuffer>this.webtcp.BUFF_SIZE)throw"Output buffer is already full, but sockJS connection is not ready yet";
this.webtcp.outputBuffer.push(j)}};this.onerror=function(j){throw j;}};
