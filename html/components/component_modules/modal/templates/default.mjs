import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";export default(e={})=>new Promise(async function(n,t){let a={};if(!isEmpty(e))for(let n in e)switch(n){case"universe":a[`${n}`]=e[n];break;default:console.warn(!1,"необрабатываемое свойство ---\x3e",n,"----\x3e",e[n])}n('\n      <div id="id01" class="w3-modal w3-animate-opacity">\n            <div class="w3-modal-content w3-card-4">\n                <header class="w3-container w3-teal">\n                    <span id="close" class="w3-button w3-large w3-display-topright">&times;</span>\n                    <h2>Modal Header</h2>\n                </header>\n                <div class="w3-container">\n                    <p>Some text..</p>\n                    <p>Some text..</p>\n                </div>\n                <footer class="w3-container w3-teal">\n                    <p>Modal Footer</p>\n                </footer>\n            </div>\n        </div>\n        ')});