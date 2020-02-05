function connect(e,t){return new Promise(async(a,n)=>{if(window.indexedDB){let n={};n.name=e.name,n.version=e.version;try{n.request=window.indexedDB.open(`${e.name}`,`${e.version}`)}catch(e){console.assert(!1)}n.request.onsuccess=function(e){t(n.request.result)},n.request.onerror=function(e){},n.request.onupgradeneeded=function(t){switch(e.name){case"flatory":if(n.db=t.target.result,n.objectStore=n.db.createObjectStore("cat_object",{keyPath:"id"}),n.objectStore.createIndex("city","city",{unique:!1}),n.objectStore.createIndex("class","class",{unique:!1}),n.objectStore.createIndex("dateExperiences","dateExperiences",{unique:!1}),n.objectStore.createIndex("description","description",{unique:!1}),n.objectStore.createIndex("finish","finish",{unique:!1}),n.objectStore.createIndex("geo","geo",{unique:!1}),n.objectStore.createIndex("metro","metro",{unique:!1}),n.objectStore.createIndex("name","name",{unique:!1}),n.objectStore.createIndex("object","object",{unique:!1}),n.objectStore.createIndex("plans","plans",{unique:!1}),n.objectStore.createIndex("price","price",{unique:!1}),n.objectStore.createIndex("tags","tags",{unique:!1}),n.objectStore.createIndex("timestamp","timestamp",{unique:!1}),n.objectStore.createIndex("timestampUpdate","timestampUpdate",{unique:!1}),n.objectStore.createIndex("type","type",{unique:!1}),e.data)for(let t in e.data)n.objectStore.add(e.data[t]);break;case"dictionary":if(n.db=t.target.result,n.objectStore=n.db.createObjectStore("dictionary",{autoIncrement:!0}),e.data)for(let t in e.data)n.objectStore.add(e.data[t])}a(n)}}else window.alert("Ваш браузер не поддерживат стабильную версию IndexedDB. Такие-то функции будут недоступны")})}export default{get:async(e,t,...a)=>new Promise(async(t,a)=>{let n=e=>{t(e)};switch(e.type){case"dictionary":(async(e,t,a)=>{await connect({name:"dictionary",version:1,data:e.data},async e=>{let t=[];e.transaction(["dictionary"],"readwrite").objectStore("dictionary").openCursor().onsuccess=(e=>{let a=e.target.result;a?(t.push(a.value),a.continue()):n(t)})})})(e);break;case"id":(async(e,t,a)=>{await connect({name:"flatory",version:1},async t=>{let a=[];0===e.id.length?t.transaction(["cat_object"],"readwrite").objectStore("cat_object").openCursor().onsuccess=(e=>{let t=e.target.result;t?(a.push(t.value),t.continue()):n(a)}):t.transaction(["cat_object"],"readwrite").objectStore("cat_object").get(e.id).onsuccess=(e=>{n(e.target.result)})})})(e);break;case"getAll":(async(e,t,a)=>{await connect({name:"flatory",version:1},async e=>{let t=[];e.transaction(["cat_object"],"readwrite").objectStore("cat_object").openCursor().onsuccess=(e=>{let a=e.target.result;a?(t.push(a.value),a.continue()):n(t)})})})();break;case"index":(async(e,t,a)=>{await connect({name:"flatory",version:1},async t=>{let a=t.transaction(["cat_object"],"readwrite").objectStore("cat_object").index(`${e.index}`),c=[];if("price"===e.index)a.openCursor().onsuccess=function(t){let a=t.target.result;if(a){let t=a.key.split(","),n=!1;const o=/[^\d\.\' ']/g;for(let a=0;a<t.length;a++){let c=t[a].replace(o,"");c=(c=(c=c.replace(/^\s+/g,"")).split(" "))[0],c=parseFloat(c);let r=parseFloat(e.filter);isNaN(c)?n=!0:isNaN(r)?n=!0:r>=c&&(n=!0)}n&&c.push(a.value),a.continue()}else n(c)};else if("city"===e.index){let a=t.transaction(["cat_object"],"readwrite").objectStore("cat_object").index(`${e.index}`),c=[];a.openCursor().onsuccess=function(t){let a=t.target.result;a?(0===parseInt(e.filter,10)?c.push(a.value):parseInt(a.key,10)===parseInt(e.filter,10)&&c.push(a.value),a.continue()):n(c)}}else a.openCursor().onsuccess=function(t){let a=t.target.result;a?(a.key.toLowerCase().indexOf(e.filter.toLowerCase())>-1&&c.push(a.value),a.continue()):n(c)}})})(e);break;default:(e=>{a(e)})(`новая функция ${e.type} `)}}),put:async(e,t,...a)=>new Promise(async(t,a)=>{let n=e=>{t(e)};switch(e.type){case"data":(async(e,t,a)=>{let c=await fetch("http://dev.work/api/item",{method:"GET"}).then(e=>e.json());await connect({name:"flatory",version:1},async e=>{for(let t in c)e.transaction(["cat_object"],"readwrite").objectStore("cat_object").put(c[0]).onsuccess=(e=>{c.length-1==t&&n(!0)})})})();break;case"item":(async(e,t,a)=>{await connect({name:"flatory",version:1},async t=>{t.transaction(["cat_object"],"readwrite").objectStore("cat_object").put(e.value).onsuccess=(e=>{n(!0)})})})(e);break;default:(e=>{a(e)})(`новая функция ${e.type} `)}}),delete:async(e,t,...a)=>new Promise(async(t,a)=>{switch(e.type){case"test":(async(e,a,n)=>{await connect({name:"flatory",version:1},async e=>{e.transaction(["cat_object"],"readwrite").objectStore("cat_object").delete("144").onsuccess=(e=>{console.log(e.target.result),(e=>{t(e)})(!0)})})})();break;default:(e=>{a(e)})(`новая функция ${e.type} `)}}),set:async(e,t,...a)=>new Promise(async(t,a)=>{switch(e.type){case"dictionary":(async(e,a,n)=>{await connect({name:"dictionary",version:1,data:e.data},async e=>{(e=>{t(e)})(!0)})})(e);break;default:(e=>{a(e)})(`новая функция ${e.type} `)}})};