import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";export default(e={})=>new Promise(async function(t,n){let i={};if(!isEmpty(e))for(let t in e)switch(t){case"universe":i[`${t}`]=e[t];break;default:console.warn(!1,"неизвестное свойство ---\x3e",t,"----\x3e",e[t])}t('\n      <div id="id01" class="w3-modal w3-animate-opacity">\n            <div class="w3-modal-content w3-card-4">\n                <header class="w3-container w3-teal">\n                    <span id="close" class="w3-button w3-large w3-display-topright">&times;</span>\n                    <h2>Create Universe</h2>\n                </header>\n                <div class="w3-container">\n                   <label for="name">Universe name<input id="name" type="text" placeholder="Название вселенной" ></label>\n                   <label for="modifiers">Private Public <input id="modifiers" type="text" placeholder="public or privat or protected"></label>\n                   <label for="description">Description <input id="description" type="text" placeholder="add description"></label>\n                </div>\n                <div class="button">\n                <button class="previous" style="display: none">previous</button>\n                <button class="next">Next</button>\n                <button class="create" style="display: none">create</button>\n                </div>\n                <footer class="w3-container w3-teal">\n                    <p>Zababurin Sergey Copyright © 2019</p>\n                </footer>\n            </div>\n        </div>\n        ')});