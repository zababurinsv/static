import action from"/static/html/components/component_modules/action/action.mjs";let queue={staticProperty:[]},handler={get:function(t,e){return t[e]},set:function(t,e,a){switch(t[e]=a,e){case"length":if(1===t.length){let e=setTimeout(async function a(){if(console.log("~~~~~input~~~~~~"),0===t.length)console.log("end~~~~~~~~~~~"),clearTimeout(e);else{switch(t[0].task.type){case"delete":switch(t[0].name||(t[0].name="default"),t[0].name){case"bid":await action({input:"static-property",date:t[0].task.date,remove:t[0].task.remove,type:"bid"},"delete","type");break;default:await action({input:"static-property",date:t[0].task.date,remove:t[0].task.remove,type:"news"},"delete","type")}break;case"create":let e=new CustomEvent("convertAction",{detail:{data:t[0].task.data}});document.dispatchEvent(e);break;case"update":switch(t[0].name||(t[0].name="default"),t[0].name){case"bid":action({button:t[0].task.button,input:"varan-card-news",this:t[0].task.this,date:t[0].task.date,type:"bid"},"update","type");break;default:action({button:t[0].task.button,input:"lacerta-news",this:t[0].task.this,date:t[0].task.date,type:"news"},"update","type")}break;case"updateAction":t[0].name||(t[0].name="default");let a={};switch(t[0].name){case"bid":a=new CustomEvent("updateAction",{detail:{date:t[0].task.date,data:t[0].task.update,name:"bid"}}),document.dispatchEvent(a);break;default:a=new CustomEvent("updateAction",{detail:{date:t[0].task.date,data:t[0].task.update,name:"news"}}),document.dispatchEvent(a)}}console.log("all~~~~~~~~~~~",t,t.length),console.log("now~~~~~~~~~~~",t[0]),t.shift(),e=setTimeout(a,10)}},0)}}return!0}};export default(t,e,...a)=>new Promise(function(r,s){bundle.default(t,"export",async function(o,i){let u=t=>{r(t)},c=t=>{console.log("~~~ err staticProperty ~~~",t),s(t)};switch(e){case"object":(async(t,e,a)=>{try{console.log(`${t.input}[(staticProperty)${t[e]}]`),i.isEmpty(queue.staticProperty[t[e]])?u(!0):u(queue.staticProperty[t[e]])}catch(t){c(t)}})(t,a[0],a[1],a[2],a[3]);break;case"task":(async(t,e,a)=>{switch(t[e]){case"task":try{i.isEmpty(queue.staticProperty.task)&&(queue.staticProperty.task=[],queue.staticProperty.task=new Proxy(queue.staticProperty.task,handler)),queue.staticProperty.task.push(t),u({task:"push"})}catch(t){c(t)}break;default:c(`необрабатываемый тип запроса ${t[e]}`)}})(t,a[0],a[1],a[2],a[3]);break;case"set":(async(t,e,a)=>{try{switch(console.log(`app(${t.input}[(staticProperty)${t[e]}]staticProperty}`),t[e]){case"store":void 0===queue.staticProperty[`${t.input}`]&&(queue.staticProperty[`${t.input}`]=[]),queue.staticProperty[`${t.input}`]=t.store,u(queue.staticProperty);break;case"timer":void 0===queue.staticProperty[`${t.input}`]&&(queue.staticProperty[`${t.input}`]=[]),queue.staticProperty[`${t.input}_${t.id}`]=t.data,u(queue.staticProperty[`${t.input}_${t.id}`]);break;case"obj":queue.staticProperty[t.input]||(queue.staticProperty[t.input]=[]),queue.staticProperty[t.input].push(t),console.log("store image",t),u(t);break;case"all":queue.staticProperty=t.store,u(queue.staticProperty);break;case"object":queue.staticProperty[t.name]||(queue.staticProperty[t.name]=[]),queue.staticProperty[t.name].push(t),console.log("store",t),u(t);break;case"editor":if(i.isEmpty(queue.staticProperty["varan-editor"]))queue.staticProperty["varan-editor"]=[],queue.staticProperty["varan-editor"].push(t.editor),u(t.editor);else{let e=!1,a=0,r=0;for(let s=0;s<queue.staticProperty["varan-editor"].length;s++)i.isEmpty(t.slot)?console.assert(!1,"должен быть слот"):t.slot===queue.staticProperty["varan-editor"][s].slot&&(e=!0,a=s,r++);e?r>1?console.assert(!1,"должен быть один объект"):(queue.staticProperty["varan-editor"][a].editor=t.editor,u(t.editor)):(queue.staticProperty["varan-editor"].push(t.editor),u(t.editor))}break;default:c(`необрабатываемый тип запроса ${t[e]}`)}}catch(t){c(t)}})(t,a[0],a[1],a[2],a[3]);break;case"put":(async(t,e,a)=>{try{switch(t[e]){case"timer":u(queue.staticProperty[`${t.input}_${t.id}`].timer=t.timer)}}catch(t){c(t)}})(t,a[0],a[1],a[2],a[3]);break;case"add":(async(t,e,a)=>{try{switch(t[e]){case"timer":queue.staticProperty[`${t.input}_${t.id}`].timer=+queue.staticProperty[`${t.input}_${t.id}`].timer+t.timer,queue.staticProperty[`${t.input}_${t.id}`].price=+queue.staticProperty[`${t.input}_${t.id}`].price+t.price,u(queue.staticProperty[`${t.input}_${t.id}`])}}catch(t){c(t)}})(t,a[0],a[1],a[2],a[3]);break;case"get":(async(t,r,s)=>{try{switch(console.log(`${e}[(${t.input})${t[r]}]`),t[r]){case"all":u(queue.staticProperty);break;case"timer":u(queue.staticProperty[`${t.input}_${t.id}`].timer);break;case"editor":let s=!1,o=0,n=0;if(i.isEmpty(queue.staticProperty["varan-editor"]))u(void 0);else{for(let e=0;e<queue.staticProperty["varan-editor"].length;e++)t.target===queue.staticProperty["varan-editor"][e].slot&&(s=!0,o=e,n++);s?n>1||u(queue.staticProperty["varan-editor"][o].editor):u(void 0)}break;case"obj":(async(t,e,a)=>{try{let e=!1,a=0,r=0;if(i.isEmpty(queue.staticProperty[t.target]))u(void 0);else if(i.isEmpty(t.slot))u(queue.staticProperty[t.target]);else{for(let s=0;s<queue.staticProperty[t.target].length;s++)t.slot===queue.staticProperty[t.target][s].slot&&(e=!0,a=s,r++);e?r>1?console.assert(!1,"должен быть один объект"):u(queue.staticProperty[t.target][a]):(console.warn("staticProperty - слот не найден"),u(queue.staticProperty[t.target]))}}catch(t){}})(t,a[0],a[1],a[2],a[3]);break;case"object":(async(t,e,a)=>{try{let e=[];for(let a=0;a<t.object.length;a++)console.log(t.object[a]),i.isEmpty(queue.staticProperty[t.object[a]])||e.push(queue.staticProperty[t.object[a]]);u(e)}catch(t){c({staticProperty:t})}})(t,a[0],a[1],a[2],a[3]);break;default:c(`необрабатываемый тип запроса ${t[r]}`)}}catch(t){c(t)}})(t,a[0],a[1],a[2],a[3]);break;case"getObject":(async(t,a,r)=>{try{console.log(`${e}[(${t.input})${t[a]}]`),u(queue.staticProperty[a])}catch(t){c(t)}})(t,a[0],a[1],a[2],a[3]);break;case"set_n":(async(t,a,r)=>{try{switch(console.log(`${e}[(${t.input})${t[a]}]`),t[a]){case"image":queue.staticProperty[t.input]||(queue.staticProperty[t.input]=[]),queue.staticProperty[t.input].push(t),u(t);break;case"object":queue.staticProperty[t.name]||(queue.staticProperty[t.name]=[]),queue.staticProperty[t.name].push(t),u(t);break;case"obj":t.input||console.assert(!1,"надо указаь obj[input]"),queue.staticProperty[t.input]||(queue.staticProperty[t.input]=[]),queue.staticProperty[t.input].push(t),console.log("store",t),u(t);break;default:c(`необрабатываемый тип запроса ${t[a]}`)}}catch(t){c(t)}})(t,a[0],a[1],a[2],a[3]);break;default:c(`новая функция ${e}`)}})});