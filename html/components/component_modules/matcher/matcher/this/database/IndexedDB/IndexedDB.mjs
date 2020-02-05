function colorLog(e,t,...o){switch(t=t||"black"){case"success":t="firebrick";break;case"info":t="DodgerBlue";break;case"error":t="Red";break;case"warning":t="Orange";break;case"events-out":t="blue";break;case"violet":t="violet"}console.log("%c"+e,"color:"+t,...o)}function getDateTime(){return(new Date).toLocaleString("ru",{era:"long",year:"numeric",month:"long",day:"numeric",weekday:"long",timezone:"UTC",hour:"numeric",minute:"numeric",second:"numeric"})}Number.isNaN=Number.isNaN||function(e){return"number"==typeof e&&isNaN(e)};var uniqueId=function(){return"id-"+Math.random().toString(36).substr(2,16)};function logerr(e){}function displayActionFailure(e){e=void 0!==e?"Failure: "+e:"Failure"}function connectDB(e,t){return new Promise(function(o,d){let n=indexedDB.open(e.indexeddb.DB_NAME,e.indexeddb.DB_VERSION);n.onerror=logerr,n.onsuccess=function(){t(e,n.result)},n.onupgradeneeded=function(o){let d=o.target.result;d.objectStoreNames.contains(e.indexeddb.DB_NAME)||(e.indexeddb.store=d.createObjectStore(e.indexeddb.DB_STORE_NAME,{keyPath:"id",autoIncrement:!0}),e.indexeddb.store.createIndex("object","object",{unique:!1}),e.indexeddb.store.createIndex("url","url",{unique:!1}),e.indexeddb.store.createIndex("data","data",{unique:!1})),connectDB(e,t)}})}function getObjectStore(e,t){return new Promise(function(o,d){let n=e.indexeddb.db.transaction(e.indexeddb.DB_STORE_NAME,t);e.indexeddb.store=n.objectStore(e.indexeddb.DB_STORE_NAME),o(e)})}function getAll(e){return new Promise(function(t,o){getObjectStore(e,"readonly").then(e=>{e.get=[],e.indexeddb.store.openCursor().onsuccess=function(o){let d=o.target.result;d?(void 0===e.get[`${d.value.object}`]&&(e.get[`${d.value.object}`]={}),e.get[`${d.value.object}`][`${d.value.id}`]=d.value,d.continue()):t(e)}})})}function getObjects(e){return new Promise(function(t,o){getObjectStore(e,"readonly").then(e=>{e.get=null,e.get_n=null;let o={};o=e.slot?"edit"===e.slot?e.parent:e.slot:e.parent,e.indexeddb.store.openCursor().onsuccess=function(d){let n=d.target.result;if(n)e.hasOwnProperty("parent")?n.value.object===o&&(e.get||(e.get={}),void 0===e.get[`${n.value.object}`]&&(e.get[`${n.value.object}`]={}),e.get[`${n.value.object}`][`${n.value.id}`]=n.value):n.value.object===e.slot&&(e.get||(e.get={}),void 0===e.get[`${n.value.object}`]&&(e.get[`${n.value.object}`]={}),e.get.id=n.value.id,e.get.object=n.value.object,e.get[`${n.value.object}`][`${n.value.id}`]=n.value),n.continue();else if(e.get){e.get_n||(e.get_n=[]);for(let t in e.get[o]){let d={};d.object=o,d.id=e.get[o][t].id,d[o]=e.get[o][t],e.get_n.push(d)}colorLog("~~~~~~~~~~<getObjects-out>~~~~~~~~~~","Chocolate"),t(e)}else t(e)}})})}function clearObjectStore(e){getObjectStore(e.indexeddb.DB_STORE_NAME,"readwrite").then(e=>{var t=e.indexeddb.store.clear();t.onsuccess=function(e){},t.onerror=function(e){console.error("clearObjectStore:",e.target.errorCode),displayActionFailure(this.error)}})}function addFile(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{e.type&&e.slider&&e.slider.getSlidesNumber;let o={},d={};if(d=e.slot?"edit"===e.slot?e.parent:e.slot:e.parent,e.upload)if(0===Object.keys(e.upload).length)if("varan-slider-news"===d)e.upload={},e.upload.feed=e.set[d].feed;else if(e.set)if(e.set[d])e.upload=e.set[d];else{let t=Object.keys(e.set);e.upload=e.set[t][d]}else;else d=e.slot?"edit"===e.slot?e.parent:e.slot:e.parent,e.upload[d]&&(e.upload=e.upload[d]);else if(e.upload={},e.set)if(d||console.assert(!1,"нет слота и нет parent"),"varan-slider-news"===d)e.upload.feed=e.set[d].feed;else if(e.set[d])e.upload=e.set[d];else{let t=Object.keys(e.set);e.upload=e.set[t][d]}else e.upload={};e["set&update"]&&(e["set&update"].id===e.upload.id||(console.warn("перезаписался объект"),e.upload=e["set&update"][d])),e.upload||(e.upload={}),e.upload.feed||(e.upload.feed=null),e.upload.url,e.upload.url=window.location.href,e.upload.file||(e.upload.file=null),e.upload.content||(e.upload.content=null),e.upload.captcha||(e.upload.captcha=null),e.upload.count||(e.upload.count=null),e.upload.online||(e.upload.online=null),e.upload.status||(e.upload.status=null),e.upload.user||(e.upload.user=null),e.upload["view-slider-pos"]||(e.slider?void 0===e.slider.getSlidesNumber?e.upload["view-slider-pos"]=0:(e.upload["view-slider-pos"]=e.slider.getSlidesNumber()-1,!0===Number.isNaN(e.upload["view-slider-pos"])&&(e.upload["view-slider-pos"]=0)):e.upload["view-slider-pos"]=0),e.upload["edit-delta"]||(e.upload["edit-delta"]=null),e.upload._id||(e.upload._id=null),e.upload.length||(e.upload.length=null),e.upload.uId||(e.upload.uId=uniqueId()),e.upload.timeStamp||(e.upload.timeStamp=event.timeStamp),e.upload.data||(e.upload.data=getDateTime()),o.object=d,o.timeStamp=event.timeStamp,o.url=window.location.href,o.data=e.upload.data,o.file=e.upload.file,e.upload.file&&(o["file-url"]=e.upload.file),o.length=e.upload.length,o.feed=e.upload.feed,o.content=e.upload.content,o.captcha=e.upload.captcha,o.count=e.upload.count,o.online=e.upload.online,o.status=e.upload.status,o.user=e.upload.user,o._id=e.upload._id,o["view-slider-pos"]=e.upload["view-slider-pos"],o["edit-delta"]=e.upload["edit-delta"],o.uId=e.upload.uId;try{e.indexeddb.req=e.indexeddb.store.add(o)}catch(e){throw"DataCloneError"===e.name&&displayActionFailure("This engine doesn't know how to clone a Blob, use Firefox"),e}e.indexeddb.req.onsuccess=function(n){console.log("~~~~~~~~~evt.target.result~~~~~~~~~~~~~",n.target.result),e.set={},e.get={};let l={};l[d]={},e.get_n=[],l.id=n.target.result,l._id=o._id,l.object=d,l[d]._id=e.upload._id,l[d]=o,l[d].id=n.target.result,e.get_n.push(l),e.get[d]={},e.get[d][`${n.target.result}`]=o,e.get.id=n.target.result,e.get.object=o.object,l[d]._id=e.upload._id,e.upload=null,e.update=null,e["set&update"]=null,t(e)},e.indexeddb.req.onerror=function(){console.error("addPublication error",this.error),displayActionFailure(this.error)}})})}function delFilesFrom(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{let t=e.indexeddb.store.index("object");t.get("1").onsuccess=function(e){void 0===e.target.result&&alert("No matching record found")},t.onerror=function(e){console.error("deletePublicationFromBib:",e.target.errorCode)}})})}function getOneFile(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{let o=e.indexeddb.store.get(+e.updObj.id);o.onsuccess=function(o){var d=o.target.result;e.updObj=d,t(e),void 0===d&&(alert(d),displayActionFailure("No matching record found"))},o.onerror=function(e){console.error("deletePublication:",e.target.errorCode)}})})}function delFiles(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{let o={};(o=e.delObj?e.indexeddb.store.get(+e.delObj.id):e.indexeddb.store.get(+e.delete.id)).onsuccess=function(d){var n=d.target.result;if(void 0===n)return alert(n),void displayActionFailure("No matching record found");(o=e.delObj?e.indexeddb.store.delete(+e.delObj.id):e.indexeddb.store.delete(+e.delete.id)).onsuccess=function(o){getObjects(e).then(e=>{t(e)})},o.onerror=function(e){console.error("deletePublication:",e.target.errorCode)}},o.onerror=function(e){console.error("deletePublication:",e.target.errorCode)}})})}function getFile(e){return new Promise(function(t,o){getObjectStore(e,"readonly").then(e=>{e.get=[],e.indexeddb.store.openCursor().onsuccess=function(o){let d=o.target.result;d?("varan-about-company"===d.value.object&&e.get.push({obj:d.value}),d.continue()):t(e)}})})}function setFiles(e){return new Promise(function(t,o){let d=0;connectDB(e,function(e,o){e.indexeddb.db=o,1===d||(d++,addFile(e).then(e=>{t(e)}))})})}function getFiles(e){return new Promise(function(t,o){let d=0;connectDB(e,function(e,o){e.indexeddb.db=o,1===d||(d++,getFile(e).then(e=>{t(e)}))})})}function setWithoutTimeStamp(e,t){return new Promise(function(e,t){})}function setImagesWithoutTimeStamp(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{let o={},d={};o=e.slot?"edit"===e.slot?e.parent:e.slot:e.parent,e.set||console.assert(!1,"Должен быть [`eet`]",e),e.set[o]||console.assert(!1,"Должен быть [`name`]",e),e.set[o].timeStamp||console.assert(!1,"Должен быть [`timeStamp`]",e),e.set.object||console.assert(!1,"Должен быть [`object`]",e),e.set.id||console.assert(!1,"Должен быть [`object`]",e),e.set.feed||(e.set[o].feed=null),e.set[o].url,e.set[o].url=window.location.href,e.set[o].file||(e.set[o].file=null),e.set[o].content||(e.set[o].content=null),e.set[o].captcha||(e.set[o].captcha=null),e.set[o].count||(e.set[o].count=null),e.set[o].online||(e.set[o].online=null),e.set[o].status||(e.set[o].status=null),e.set[o].user||(e.set[o].user=null),e.set[o]["view-slider-pos"]||(e.set[o]["view-slider-pos"]=0),e.set[o]["edit-delta"]||(e.set[o]["edit-delta"]=null),e.set[o]._id||(e.set[o]._id=null),e.set[o].length||(e.set[o].length=null),e.set[o].uId||(e.set[o].uId=uniqueId()),e.set[o].data||(e.set[o].data=getDateTime()),d.object=o,d.timeStamp=e.set[o].timeStamp,d.url=e.set[o].url,d.data=e.set[o].data,d.file=e.set[o].file,e.set[o].file&&(d["file-url"]=e.set[o].file),d.length=e.set[o].length,d.feed=e.set[o].feed,d.content=e.set[o].content,d.captcha=e.set[o].captcha,d.count=e.set[o].count,d.online=e.set[o].online,d.status=e.set[o].status,d.user=e.set[o].user,d._id=e.set[o]._id,d["view-slider-pos"]=e.set[o]["view-slider-pos"],d["edit-delta"]=e.set[o]["edit-delta"],d.uId=e.set[o].uId;try{e.indexeddb.req=e.indexeddb.store.add(d),d=null}catch(e){throw"DataCloneError"===e.name&&displayActionFailure("This engine doesn't know how to clone a Blob, use Firefox"),e}e.indexeddb.req.onsuccess=function(d){console.log("~~~~~~~~~evt.target.result~~~~~~~~~~~~~",d.target.result),e.get={},e.get[o]={};let n={};e.get_n=[],(n=e.set).id=d.target.result,n[o].id=d.target.result,e.get_n.push(n),e.get[o][`${d.target.result}`]=e.set[o],e.get.id=d.target.result,e.get.object=o,e.set=null,t(e)},e.indexeddb.req.onerror=function(){console.error("addPublication error",this.error),displayActionFailure(this.error)}})})}function updateWithoutTimeStamp(e,t){return new Promise(function(o,d){let n=e.indexeddb.store.openCursor();n.onerror=function(e){console.log("case if have an error")},n.onsuccess=function(d){let n=d.target.result;if(n){if(e.upload){if(+e.upload[t].id===n.value.id){let l=n.value;l.feed=e.upload[t].feed,l.file=e.upload[t].file,l.url=window.location.href,l.data=e.upload[t].data,l.content=e.upload[t].content,l._id=e.upload[t]._id,l.timeStamp=d.timeStamp,l["edit-delta"]=e.upload[t]["edit-delta"],l["view-slider-pos"]=+e.upload[t].id,e.upload[t]["view-slider-pos"]=+e.upload[t].id,e.upload[t].url=l.url,e.upload[t].timeStamp=l.timeStamp;let a=n.update(l);a.onsuccess=function(t){o(e)},a.onerror=function(e){console.log("update failed!!")}}}else;n.continue()}else console.log("проверка закончена")}})}function updFile(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{if(0===e.upload.length)console.log("~~~~~~~~~~~ пустой объект ~~~~~~~~~~~~"),t(e);else{e.get=[];let o={};o=e.slot?"edit"===e.slot?e.parent:e.slot:e.parent,e.upload||console.assert(!1,"должен быть upload",e),e.upload[o]||console.assert(!1,"должен быть upload",e),e.upload[o].timeStamp||console.assert(!1,"должен быть timeStamp",e),e.upload[o].id||console.assert(!1,"должен быть obj['upload']['id']",e),e.upload[o]._id||console.assert(!1,"должен быть obj['upload']['_id']",e),updateWithoutTimeStamp(e,o).then(e=>{e.get||(e.get={}),e.get_n||(e.get_n=[]);let d={};d=e.upload,e.get_n.push(d),e.get[o]={},e.get[o][`${e.upload.id}`]=e.upload[o],e.get.object=o,colorLog("~~~~~~~~~<update-local-out>~~~~~~~~~","Chocolate",e),e.upload=null,t(e)})}})})}function updateWithTimeStamp(e){return new Promise(function(t,o){let d=e.indexeddb.store.openCursor();d.onerror=function(e){console.log("case if have an error")},d.onsuccess=function(o){let d=o.target.result;if(d){if(e.update){if(e.update[e.update.object].id===d.value.id){let o=d.value;e.update[`${e.update.object}`]["view-slider-pos"]=+e.update[`${e.update.object}`].id,o.feed=e.update[`${e.update.object}`].feed,o.file=e.update[`${e.update.object}`].file,o.url=window.location.href,o.data=e.update[`${e.update.object}`].data,o.content=e.update[`${e.update.object}`].content,o._id=e.update[`${e.update.object}`]._id,o["edit-delta"]=e.update[`${e.update.object}`]["edit-delta"],o["view-slider-pos"]=+e.update[`${e.update.object}`].id,o.timeStamp=e.update[`${e.update.object}`].timeStamp;let n=d.update(o);n.onsuccess=function(o){t(e)},n.onerror=function(e){console.log("update failed!!")}}}else;d.continue()}else console.log("проверка закончена")}})}function updateLocalTimeStamp(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{e.update.object||console.assert(!1,"должен быть obj['update']['object']",e.update),e.update[e.update.object]||console.assert(!1,"должен быть update[name]"),e.update[e.update.object].timeStamp||console.assert(!1,"должен быть timeStamp",e.update),e.update[e.update.object].id||console.assert(!1,"должен быть obj['upload']['id']",e.update),e.update[e.update.object]._id||console.assert(!1,"должен быть obj['upload']['_id']",e.update),updateWithTimeStamp(e).then(e=>{e.get||(e.get={}),e.get_n||(e.get_n=[]);let o={};o.object=e.update.object,o.id=+e.update[`${e.update.object}`].id,o[e.update.object]=e.update[`${e.update.object}`],o[e.update.object].url=window.location.href,o._id=e.update[`${e.update.object}`]._id,e.get_n.push(o),e.get[e.update.object]={},e.get[e.update.object][`${e.update[e.update.object].id}`]=e.update[`${e.update.object}`],e.get[e.update.object][`${e.update[e.update.object].id}`].url=window.location.href,colorLog("~~~~~~~~~<update-local-out>~~~~~~~~~","Chocolate",e),e.update=null,t(e)})})})}function get(e,t){return new Promise(function(o,d){e.get={},e.get[t]={},e.get[t][`${e.upload.id}`]=e.upload;let n={};e.get_n=[],n.id=e.upload.id,n.object=e.upload.object,n._id=e.upload._id,n[t]=e.upload,e.get_n.push(n),o(e)})}function updateuId(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{if(e.type)if(void 0===e.slider);else if(void 0===e.slider.getSlidesNumber);else for(let t=0;t<e.type.length;t++)switch(console.log("slider-one-text",e.type[t]),e.type[t]){case"slider-one-text":console.log(""),e.upload["view-slider-pos"]=e.slider.getCurrentPos();break;case"external":case"light":case"slider":break;default:console.log("типы не отслеживаются",e.type[t])}else;e.upload.timeStamp||console.assert(!1,"должен быть timeStamp",e.upload),e.upload.id||console.assert(!1,"должен быть obj['upload']['id']"),e.upload._id||console.assert(!1,"должен быть obj['upload']['_id']");let o=e,d=e.indexeddb.store.openCursor();d.onerror=function(e){console.log("case if have an error")},d.onsuccess=function(e){let d=e.target.result;if(d){if(o.upload||(o.upload=o.update),+o.upload.id===d.value.id){let e=d.value;e.feed=o.upload.feed,e.file=o.upload.file,e.url=window.location.href,e.uId=o.upload.uId,e.data=o.upload.data,e.content=o.upload.content,e._id=o.upload._id,e.timeStamp=o.upload.timeStamp,e["edit-delta"]=o.upload["edit-delta"],e["view-slider-pos"]=+o.upload.id;let n=d.update(e);n.onsuccess=function(e){get(o,o.upload.object).then(e=>{t(e)})},n.onerror=function(e){console.log("update failed!!")}}d.continue()}}})})}function updateFeed(e){return new Promise(function(t,o){colorLog("~~~~~~~~~~~update~~~~feed~~~~~","Chocolate"),getObjectStore(e,"readwrite").then(e=>{e.get=[];let o={};o=e.slot?"edit"===e.slot?e.parent:e.slot:e.parent,e.upload?0===Object.keys(e.upload).length&&(e.upload={},e.upload=e.update[o]):e.update?(o||console.assert(!1,"нет слота и нет parent"),e.upload=e.update[o]):console.assert(!1,"должен быть объект для обновления");let d=e.indexeddb.store.openCursor();d.onerror=function(e){console.log("case if have an error")},d.onsuccess=function(d){let n=d.target.result;if(n){if(+e.upload.id===n.value.id){let a=n.value;a.feed=e.upload.feed,a.file=e.upload.file,a.url=window.location.href,a.data=e.upload.data,a.content=e.upload.content,e.upload.timeStamp?a.timeStamp=e.upload.timeStamp:a.timeStamp=d.timeStamp,a["edit-delta"]=e.upload["edit-delta"],colorLog("~~~~~~<indexedDB>~update~object~~~~~","Chocolate",a);var l=n.update(a);l.onsuccess=function(d){e.get[o]={},e.get[o][`${a.id}`]=a,e.get.id=a.id,e.get.object=o,t(e)},l.onerror=function(e){console.log("update failed!!")}}n.continue()}}})})}function getObject(e){return new Promise(function(t,o){let d=0;connectDB(e,function(e,o){e.indexeddb.db=o,1===d||(d++,getObjects(e).then(e=>{t(e)}))})})}function getImageById(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{e.get=null;let o=e.indexeddb.store.openCursor();o.onerror=function(e){},o.onsuccess=function(o){let d=o.target.result;d?(console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~",e.upload.id),console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~",d.value.id),+e.upload.id==+d.value.id&&(e.upload=d.value),d.continue()):t(e)}})})}function updateStatusObject(e){return new Promise(function(t,o){let d=e.indexeddb.store.openCursor();d.onerror=function(e){console.log("case if have an error")},d.onsuccess=function(o){let d=o.target.result;if(d){if(e.update){if(+e.update[e.update.object].id===d.value.id){let o=d.value,n=e.update[`${e.update.object}`].status;e.update[`${e.update.object}`]=d.value,e.update[`${e.update.object}`].status=n,o.feed=e.update[`${e.update.object}`].feed,o.file=e.update[`${e.update.object}`].file,o.status=n,o.url=window.location.href,o.data=e.update[`${e.update.object}`].data,o.content=e.update[`${e.update.object}`].content,o._id=e.update[`${e.update.object}`]._id,o["edit-delta"]=e.update[`${e.update.object}`]["edit-delta"],o["view-slider-pos"]=+e.update[`${e.update.object}`].id,o.timeStamp=e.update[`${e.update.object}`].timeStamp;let l=d.update(o);l.onsuccess=function(o){t(e)},l.onerror=function(e){console.log("update failed!!")}}}else;d.continue()}else console.log("проверка закончена")}})}function updateStatus(e){return new Promise(function(t,o){getObjectStore(e,"readwrite").then(e=>{e.get=[];let o={};o=e.slot?"edit"===e.slot?e.parent:e.slot:e.parent,e.update||console.assert(!1,"должен быть upload",e),e.update[o]||console.assert(!1,"должен быть upload",e),updateStatusObject(e,o).then(e=>{e.get||(e.get={}),e.get_n||(e.get_n=[]);let d={};d=e.update,e.get_n.push(d),e.get[o]={},e.get[o][`${e.update.id}`]=e.update[o],e.get.object=o,colorLog("~~~~~~~~~<update-local-out>~~~~~~~~~","Chocolate",e),e.update=null,t(e)})})})}export default{delFiles:e=>delFiles(e),setFiles:e=>setFiles(e),getFiles:e=>getFiles(e),getFile:e=>getOneFile(e),updFile:e=>updFile(e),updateStatus:e=>updateStatus(e),getAll:e=>getAll(e),getObject:e=>getObject(e),getImageById:e=>getImageById(e),setImagesLocal:e=>setFiles(e),updateFeed:e=>updateFeed(e),updateuId:e=>updateuId(e),updateLocalTimeStamp:e=>updateLocalTimeStamp(e),setImagesWithoutTimeStamp:e=>setImagesWithoutTimeStamp(e)};