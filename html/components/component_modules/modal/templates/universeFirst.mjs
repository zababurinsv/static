import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";export default(e={})=>new Promise(async function(t,i){let n={};if(!isEmpty(e))for(let t in e)switch(t){case"universe":n[`${t}`]=e[t];break;default:console.warn(!1,"неизвестное свойство ---\x3e",t,"----\x3e",e[t])}t('\n        \n                   <label for="name">Universe name<input id="name" type="text" placeholder="Название вселенной" ></label>\n                   <label for="modifiers">Private Public <input id="modifiers" type="text" placeholder="public or privat or protected"></label>\n                   <label for="description">Description <input id="description" type="text" placeholder="add description"></label>\n      \n        ')});