import utils from"/static/html/components/component_modules/utils/utils.mjs";import Monopoly from"/static/html/components/component_modules/template/monopoly.mjs";import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";function msConversion(t){let e=Math.floor(t/1e3),n=Math.floor(e/3600);e-=3600*n;let a=Math.floor(e/60);return e=("00"+(e=""+(e-=60*a))).substring(e.length),n>0?n+":"+(a=("00"+(a=a<10?"0"+a:""+a)).substring(a.length))+":"+e:"00:"+(a=a<10?"0"+a:""+a)+":"+e}export let monopoly=(t={_:void 0,data:{}})=>new Promise(async function(e,n){switch(t._){case"button":(async t=>{e(await Monopoly({_:"button",data:t.data}))})(t);break;default:console.warn("неизвестный темплейт",t._,"----\x3e",t)}});export default async(t,e,...n)=>new Promise(async function(a,s){let c=t=>{a(t)},i=t=>{console.log("~~~ err router ~~~",t),s(t)};switch(e){case"create":(async(t,e,n,a)=>{try{console.log(`${t.input}[(request)${t[e]}]`);let a=[];switch(t[e]){case"news":let s=await utils({input:"varan-menu",data:t.data.content,type:"string2html"},"convert","type"),l=await utils({input:"varan-menu",data:t.data["content:encoded"],type:"string2html"},"convert","type"),x=`\x3c!--\n        --\x3e<details class="item item_${Date.parse(t.data.isoDate)}">\x3c!--\n        --\x3e<div class="timestamp" style="display: none">${Date.parse(t.data.isoDate)}</div>\x3c!--\n                --\x3e<summary class="item_content">\x3c!--\n                            --\x3e<section  class="news">\x3c!--\n                                    --\x3e<div class="hexagon">\x3c!--\n                                        --\x3e<img class="gallery" src="${t.data.enclosure.url}" alt ="photo"/>\x3c!--\n                                    --\x3e</div>\x3c!--\n                                    --\x3e<div class="information">\x3c!--\n                                        --\x3e<h2 class="title">\x3c!--\n                                           --\x3e${t.data.title}\x3c!--\n                                        --\x3e</h2>\x3c!--\n                                        --\x3e<h3 class="date">${t.data.isoDate}</h3>\x3c!--\n                                        --\x3e<div class="short-content">\x3c!--\n                                            --\x3e<details class="content">\x3c!--\n                                                --\x3e<summary class="preview">\x3c!--\n                                                        --\x3e${s}\x3c!--\n                                                --\x3e</summary>\x3c!--\n                                                --\x3e<div class="contentOut">\x3c!--\n                                                --\x3e${l}\x3c!--\n                                                --\x3e</div>\x3c!--\n                                            --\x3e</details>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                    --\x3e</div>\x3c!--\n                            --\x3e</section>\x3c!--\n                --\x3e</summary>\x3c!--\n                --\x3e<div class="menu">\x3c!--\n                    --\x3e<button class="delete"> удалить </button>\x3c!--\n                    --\x3e<button class="change"> изменить </button>\x3c!--\n                --\x3e</div>\x3c!--\n            --\x3e</details>`;c(x);break;case"template":for(let e=0;e<t.data.length;e++){let n=await utils({input:"varan-menu",data:t.data[e].content,type:"string2html"},"convert","type"),s=await utils({input:"varan-menu",data:t.data[e]["content:encoded"],type:"string2html"},"convert","type"),c=`\x3c!--\n        --\x3e<details class="item item_${e}">\x3c!--\n        --\x3e<div class="timestamp" style="display: none">${Date.parse(t.data[e].isoDate)}</div>\x3c!--\n                --\x3e<summary class="item_content">\x3c!--\n                            --\x3e<section  class="news">\x3c!--\n                                    --\x3e<div class="hexagon">\x3c!--\n                                        --\x3e<img class="gallery" src="${t.data[e].enclosure.url}" alt ="photo"/>\x3c!--\n                                    --\x3e</div>\x3c!--\n                                    --\x3e<div class="information">\x3c!--\n                                        --\x3e<h2 class="title">\x3c!--\n                                           --\x3e${t.data[e].title}\x3c!--\n                                        --\x3e</h2>\x3c!--\n                                        --\x3e<h3 class="date">${t.data[e].isoDate}</h3>\x3c!--\n                                        --\x3e<div class="short-content">\x3c!--\n                                            --\x3e<details class="content">\x3c!--\n                                                --\x3e<summary class="preview">\x3c!--\n                                                        --\x3e${n}\x3c!--\n                                                --\x3e</summary>\x3c!--\n                                                --\x3e<div class="contentOut">\x3c!--\n                                                --\x3e${s}\x3c!--\n                                                --\x3e</div>\x3c!--\n                                            --\x3e</details>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                    --\x3e</div>\x3c!--\n                            --\x3e</section>\x3c!--\n                --\x3e</summary>\x3c!--\n                --\x3e<div class="menu">\x3c!--\n                    --\x3e<button class="delete"> удалить </button>\x3c!--\n                    --\x3e<button class="change"> изменить </button>\x3c!--\n                --\x3e</div>\x3c!--\n            --\x3e</details>`;a.push(c)}c(a);break;case"about":let d=await utils({input:"template",data:t.data,type:"string2html"},"convert","type");c(`<div class = "content">${d}</div>`);break;case"templateJson":for(let e=0;e<t.data.length;e++){let n=await utils({input:"varan-menu",data:t.data[e].summary,type:"string2html"},"convert","type"),s=await utils({input:"varan-menu",data:t.data[e].content_html,type:"string2html"},"convert","type"),c=`\x3c!--\n        --\x3e<details class="item item_${e}">\x3c!--\n                --\x3e<div class="timestamp" style="display: none"></div>\x3c!--\n                --\x3e<summary class="item_content">\x3c!--\n                            --\x3e<section  class="news">\x3c!--\n                                    --\x3e<div class="hexagon">\x3c!--\n                                        --\x3e<img class="gallery" src="${t.data[e].image}" alt ="photo"/>\x3c!--\n                                    --\x3e</div>\x3c!--\n                                    --\x3e<div class="information">\x3c!--\n                                        --\x3e<h2 class="title">\x3c!--\n                                           --\x3e${t.data[e].title}\x3c!--\n                                        --\x3e</h2>\x3c!--\n                                        --\x3e<h3 class="date">${t.data[e].date.all}</h3>\x3c!--\n                                        --\x3e<div class="short-content">\x3c!--\n                                            --\x3e<details class="content">\x3c!--\n                                                --\x3e<summary class="preview">\x3c!--\n                                                        --\x3e${n}\x3c!--\n                                              --\x3e</summary>\x3c!--\n                                                --\x3e<div class="contentOut">\x3c!--\n                                                --\x3e${s}\x3c!--\n                                                --\x3e</div>\x3c!--\n                                            --\x3e</details>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                    --\x3e</div>\x3c!--\n                            --\x3e</section>\x3c!--\n                --\x3e</summary>\x3c!--\n                --\x3e<div class="menu">\x3c!--\n                    --\x3e<button class="delete"> удалить </button>\x3c!--\n                    --\x3e<button class="change"> изменить </button>\x3c!--\n                --\x3e</div>\x3c!--\n            --\x3e</details>`;a.push(c)}c(a);break;case"moderator":let o=[],m={};for(let e=0;e<t.data.length;e++){let a=await utils({input:"template",data:t.data[e].content,type:"string2html"},"convert","type"),s=await utils({input:"template",data:t.data[e].description,type:"string2html"},"convert","type");m=void 0===n?!1===t.data[e].positionImg||"false"===t.data[e].positionImg?`\x3c!--\n\n\n                             --\x3e<details class="adminMenu item_${e}" >\x3c!--\n                                --\x3e<div class="timestamp" style="display: none">${t.data[e].timestamp}</div>\x3c!--\n                                                      --\x3e<summary class="adminContent">\x3c!--\n                                                      --\x3e<div class ="item">\x3c!--\n                                                      --\x3e<div class="news">\x3c!--\n                                                      --\x3e<h2>\x3c!--\n                                                         --\x3e${t.data[e].title}\x3c!--\n                                                  --\x3e</h2><div class="short-content"><details><summary class="preview">${s}</summary><div class="content">${a}</div>\x3c!--\n                                          --\x3e</details>\x3c!--\n                                                  --\x3e</div>\x3c!--\n                                          --\x3e</div>\x3c!--\n                                              --\x3e<div class="hexagon">\x3c!--\n                                                   --\x3e<img  class="moderator" src="${t.data[e].img}" alt="moderator">\x3c!--\n                                              --\x3e</div>\x3c!--\n                                          --\x3e</div>\x3c!--\n                                                      --\x3e</summary>\x3c!--\n                                          --\x3e<div class="menu">\x3c!--\n                                                      --\x3e<button class="delete"> удалить </button>\x3c!--\n                                                      --\x3e<button class="change"> изменить </button>\x3c!--\n                                          --\x3e</div>\x3c!--\n                                  --\x3e</details>\x3c!--\n                                    \n                                    `:`\x3c!--                  \n                                                    --\x3e<details class="adminMenu item_${e}" >\x3c!--\n                                                       --\x3e<div class="timestamp" style="display: none">${t.data[e].timestamp}</div>\x3c!--\n                                                    --\x3e<summary class="adminContent">\x3c!--\n                                                    --\x3e<div class ="item">\x3c!--\n                                                          --\x3e<div class="hexagon">\x3c!--\n                                                                         --\x3e<img  class="moderator" src="${t.data[e].img}" alt="moderator">\x3c!--\n                                                         --\x3e</div>\x3c!--\n                                                    --\x3e<div class="news">\x3c!--\n                                                    --\x3e<h2>\x3c!--\n                                                       --\x3e${t.data[e].title}\x3c!--\n                                                --\x3e</h2><div class="short-content"><details><summary class="preview">${s}</summary><div class="content">${a}</div>\x3c!--\n                                        --\x3e</details>\x3c!--\n                                                --\x3e</div>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                                    --\x3e</summary>\x3c!--\n                                        --\x3e<div class="menu">\x3c!--\n                                                    --\x3e<button class="delete"> удалить </button>\x3c!--\n                                                    --\x3e<button class="change"> изменить </button>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                --\x3e</details> \x3c!--`:!1===t.data[e].positionImg||"false"===t.data[e].positionImg?`\x3c!--\n\n\n                             --\x3e<details class="adminMenu item_${n}" >\x3c!--\n                                --\x3e<div class="timestamp" style="display: none">${t.data[e].timestamp}</div>\x3c!--\n                                                      --\x3e<summary class="adminContent">\x3c!--\n                                                      --\x3e<div class ="item">\x3c!--\n                                                      --\x3e<div class="news">\x3c!--\n                                                      --\x3e<h2>\x3c!--\n                                                         --\x3e${t.data[e].title}\x3c!--\n                                                  --\x3e</h2>\x3c!--\n                                                  --\x3e<div class="short-content"><details><summary class="preview">${s}</summary><div class="content">${a}</div>\x3c!--\n                                          --\x3e</details>\x3c!--\n                                                  --\x3e</div>\x3c!--\n                                          --\x3e</div>\x3c!--\n                                              --\x3e<div class="hexagon">\x3c!--\n                                                   --\x3e<img  class="moderator" src="${t.data[e].img}" alt="moderator">\x3c!--\n                                              --\x3e</div>\x3c!--\n                                          --\x3e</div>\x3c!--\n                                                      --\x3e</summary>\x3c!--\n                                          --\x3e<div class="menu">\x3c!--\n                                                      --\x3e<button class="delete"> удалить </button>\x3c!--\n                                                      --\x3e<button class="change"> изменить </button>\x3c!--\n                                          --\x3e</div>\x3c!--\n                                  --\x3e</details>\x3c!--\n                                    \n                                    `:`\x3c!--                  \n                                                    --\x3e<details class="adminMenu item_${n}" >\x3c!--\n                                                       --\x3e<div class="timestamp" style="display: none">${t.data[e].timestamp}</div>\x3c!--\n                                                    --\x3e<summary class="adminContent">\x3c!--\n                                                    --\x3e<div class ="item">\x3c!--\n                                                          --\x3e<div class="hexagon">\x3c!--\n                                                                         --\x3e<img  class="moderator" src="${t.data[e].img}" alt="moderator">\x3c!--\n                                                         --\x3e</div>\x3c!--\n                                                    --\x3e<div class="news">\x3c!--\n                                                    --\x3e<h2>\x3c!--\n                                                       --\x3e${t.data[e].title}\x3c!--\n                                                --\x3e</h2>\x3c!--\n                                                --\x3e<div class="short-content">\x3c!--\n                                                    --\x3e<details>\x3c!--\n                                                    --\x3e<summary class="preview">${s}</summary>\x3c!--\n                                                --\x3e<div class="content">${a}</div>\x3c!--\n                                        --\x3e</details>\x3c!--\n                                                --\x3e</div>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                                    --\x3e</summary>\x3c!--\n                                        --\x3e<div class="menu">\x3c!--\n                                                    --\x3e<button class="delete"> удалить </button>\x3c!--\n                                                    --\x3e<button class="change"> изменить </button>\x3c!--\n                                        --\x3e</div>\x3c!--\n                                --\x3e</details> \x3c!--`,o.push(m)}c(o);break;default:i(`необрабатываемый тип запроса ${t[e]}`)}}catch(t){i(t)}})(t,n[0],n[1],n[2],n[3]);break;case"get":(async(t,a,s)=>{try{switch(console.log(`app(${e}[(${t.input})${t[a]}]property)`),t[a]){case"auth":(async(t,e,n)=>{try{c('\n                                            <div class="col-md-8 m-auto">\n                                            <h1 class="display-4 text-center">\n                                            Регистрация\n                                            </h1>\n                                            <p class="lead text-center">\n                                            Создайте свой аккаунт\n                                            </p>\n                                            <form novalidate="">\n                                            <div class="form-group">\n                                            <input type="text" class="form-control form-control-lg" placeholder="Name" name="name" value="">\n                                            </div>\n                                            <div class="form-group">\n                                            <input type="email" class="form-control form-control-lg" placeholder="Email" name="email" value="">\n                                            <small class="form-text text-muted">\n                                            This site uses Gravatar so if you want a profile image, use a Gravatar email\n                                            </small>\n                                            </div>\n                                            <div class="form-group">\n                                            <input type="password" class="form-control form-control-lg" placeholder="Password" name="password" value="">\n                                            </div>\n                                            <div class="form-group">\n                                            <input type="password" class="form-control form-control-lg" placeholder="Confirm Password" name="password2" value="">\n                                            </div>\n                                            <input type="submit" class="btn btn-info btn-block mt-4">\n                                            </form>\n                                            </div>')}catch(t){i(t)}})(0,n[0],n[1],n[2],n[3]);break;case"login":(async(t,e,n)=>{try{c('\n                                             <div class="col-md-8 m-auto">\n                                             <h1 class="display-4 text-center">\n                                             Вход\n                                             </h1>\n                                             <p class="lead text-center">\n                                                Войдите в свой аккаунт\n                                             </p>\n                                             <form>\n                                             <div class="form-group">\n                                             <input type="email" class="form-control form-control-lg" placeholder="Email Address" name="email" value="">\n                                             </div>\n                                             <div class="form-group">\n                                             <input type="password" class="form-control form-control-lg" placeholder="Password" name="password" value="">\n                                             </div>\n                                             <input type="submit" class="btn btn-info btn-block mt-4">\n                                             </form>\n                                             </div>')}catch(t){i(t)}})(0,n[0],n[1],n[2],n[3]);break;case"card":(async(t,e,n)=>{try{await utils({input:"template",data:t.data.content_html,type:"string2html"},"convert","type"),await utils({input:"template",data:t.data.summary,type:"string2html"},"convert","type");let e=msConversion(60*t.data.details.time*1e3),n=`\n             <div class = "item timestamp_${Date.parse(t.data.date_modified)} ">\n                <label class="details">\n                    <div class="content">\n                        <div class = "preview">\n                            <p>\n                                ${t.data.title} \n                            </p>\n                        </div>\n                        <div class="images">\n                            <a class="bid">\n                                <img  class='imgBid' src="${t.data.image}"  alt="bid">\n                            </a>\n                        </div>\n                         <div class="timer">\n                               ${e}\n                        </div>\n                        <div class="price">\n                          Waves: ${t.data.details.price}\n                        </div>\n                        <div class="name">\n                            ~~~~~\n                        </div>\n                        <div class="bid">\n                            bid\n                        </div>\n                    </div>\n                    <input type="checkbox" class="input" />\n                    <div class="summary">\n                    <div class = "button">\n                             <button class="bidButton"> ставка </button>\n                             <button class="sellButton"> старт </button>\n                    </div>\n                    <div class="priceSend">\n                    <div class="info">\n                        <div>Повышение цены: 0.1 Waves</div>\n                        <div>Стоимость ставки: 1 Waves</div>\n                         <div>Перевод: 0.014 Waves</div>\n                    </div>\n                        <div class="priceWinner">\n                            <div>\n                                Сумма оплаты при выигрыше\n                            </div>\n                            <div class="outPrice">\n                                0\n                            </div>\n                        </div>\n                    </div>\n                    </div>\n                </label>\n            </div>\n                                        `;c(n)}catch(t){i(t)}})(t,n[0],n[1],n[2],n[3]);break;case"cardAdmin":(async(t,e,n)=>{try{await utils({input:"template",data:t.data.content_html,type:"string2html"},"convert","type"),await utils({input:"template",data:t.data.summary,type:"string2html"},"convert","type");let e=`\n             <div class = "item timestamp_${Date.parse(t.data.date_modified)}">\n                <label class="details">\n                    <div class="content">\n                        <div class = "preview">\n                            <p>\n                               ${t.data.title} \n                            </p>\n                        </div>\n                        <div class="images">\n                            <a class="bid">\n                                <img  class='imgBid' src="${t.data.image}" alt="bid">\n                            </a>\n                        </div>\n                        <div class="timer">\n                        ${t.data.details.time}\n                        </div>\n                        <div class="price">\n                        Waves: ${t.data.details.price}\n                        </div>\n                        <div class="name">\n                         ~~~~~\n                        </div>\n                        <div class="bid">\n                            bid\n                        </div>\n                    </div>\n                    <input type="checkbox" class="input" />\n                    <div class="summary">\n                     <div class="button">\n                        <button class="delete"> удалить </button>\n                        <button class="change"> изменить </button>\n                        </div>\n                    </div>\n                </label>\n            </div>\n                                        `;c(e)}catch(t){i(t)}})(t,n[0],n[1],n[2],n[3]);break;case"cardPrice":(async(t,e,n)=>{try{document.createElement("div");c("\n                                            \n                                            \n                                            ")}catch(t){i(t)}})(0,n[0],n[1],n[2],n[3]);break;default:i(`new type [(${e})${t[a]}]`)}}catch(t){i(t)}})(t,n[0],n[1],n[2],n[3]);break;default:i(`новая функция ${e}`)}});