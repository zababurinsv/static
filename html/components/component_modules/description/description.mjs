import colors from"/static/html/components/component_modules/colors/colors.mjs";import colorlog from"/static/html/components/component_modules/colorLog/colorLog.mjs";import action from"/static/html/components/component_modules/action/relation-monopoly.mjs";import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty_t.mjs";export default(...o)=>new Promise(async(t,e)=>{let r={};function i(o,t){return new Promise(async(e,r)=>{let i=!1;isEmpty(o)?(colorlog(t.description.console,"для этого отношения нет никаких действий",t.description.color,t.description.substrate,`${t.description.relation}`),t.description.property={end:!0,property:t.description.property}):i=!0,e(i)})}r.pointers=[],r.pointers.push("%s"),r.pointers.push("%d"),r.pointers.push("%i"),r.pointers.push("%f"),r.pointers.push("%o"),r.pointers.push("%O"),r.pointers.push("%c"),r.description={},r.description.property={},r.description.relation={},r.description.substrate={},r.description.color="black";try{for(let t=0;t<o.length;t++){if("boolean"==typeof o[0]?r.description.console=o[0]:console.assert(!1,"параметр для отображения в консоли должен иметь тип boolean"),"]"===o[t+1]&&(r.description.property=o[t]),"[("===o[t+2]&&(r.description.relation=o[t],r.description.relation=r.description.relation.replace("%c%O","")),"*)"===o[t+1])for(let e=0;e<o[t].length;e++)o[t][e].hasOwnProperty("_")&&(r.description.substrate._=o[t][e]._),o[t][e].hasOwnProperty("task")&&(r.description.substrate.queue=o[t][e].task);switch(typeof o[t]){case"string":let e=o[t].split(":");e.length>1&&"color"===e[0]&&(r.description.color=await colors(e[1]))}}!function(o){new Promise(async(t,e)=>{switch(o.description.relation.toLowerCase()){case"button":if(i(action.button,o))for(let t=0;t<action.button.length;t++)o.description.substrate.queue.push({_:o.description.substrate._,end:t===action.button.length-1,console:o.description.console,property:action.button[t].property,color:o.description.color,substrate:action.button[t].substrate,relation:o.description.relation});break;case"player":if(i(action.player,o))for(let t=0;t<action.player.length;t++)o.description.substrate.queue.push({_:o.description.substrate._,end:t===action.player.length-1,console:o.description.console,property:action.player[t].property,color:o.description.color,substrate:action.player[t].substrate,relation:o.description.relation});break;default:console.warn("не обрабатывается добавление в очередь ---\x3e",o.description.relation.toLowerCase(),"---\x3e",o)}t({queue:!0})})}(r),delete r.description.substrate.queue,colorlog(r.description.console,r.description.property,r.description.color,r.description.substrate,`${r.description.relation}`),function(o){t(o)}(r)}catch(o){!function(o){e(o)}({_:"decription",error:o})}});