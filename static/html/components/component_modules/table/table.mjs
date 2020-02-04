export default async (obj, func, ...args)=>{
        return new Promise(async function (resolve, reject) {
            bundle['default'](obj,'export', async function (error, config) {
            let out = (obj) => {
                //console.log('~~~ out router ~~~')
                resolve(obj)
            }
            let err = (error) => {
                let err = error
                err = err.toString()
               if(err.indexOf('Cannot read property \'appendChild\' of null') !== -1){
                   console.warn('отсутствует объект куда поместить таблицу')
                   resolve({obj:'null'})
               }else{
                   reject(error)
               }
            }
            switch (func) {
                case 'test':
                    (async (obj, props,data, server) => {
                        try {
                            console.log(`${obj['input']}[(table)${obj[props]}]`)
                            const tabled =   config['jsonToTable'](JSON.parse(data));
                            let table = document.createElement('table')
                            let thead = document.createElement('thead')
                            let tbody = document.createElement('tbody')
                            let tfoot = document.createElement('tfoot')
                            table.appendChild(thead)
                            table.appendChild(tbody)
                            table.appendChild(tfoot)

                            for(let i =0; i < tabled.length; i++){
                                let row = '<tr>'
                                for(let j =0; j<tabled[i].length; j++){
                                    if(i === 0){
                                        row +=`<td>${tabled[i][j]}</td>`
                                    }else{
                                        if(tabled[i][j] === ''){
                                            row +=`<td>null</td>`
                                            console.warn('пустое поле',  i, j, tabled[0][j], tabled[0] )
                                        }else{
                                            row +=`<td>${tabled[i][j]}</td>`
                                        }
                                    }
                                }
                                row += `</tr>`
                                if(i === 0){
                                    thead.insertAdjacentHTML('beforeend', row)
                                }else{
                                    tbody.insertAdjacentHTML('beforeend', row)
                                }

                            }
                            // obj[props]['this'].shadowRoot.querySelector('.table').appendChild(table)


                            out(table)
                        } catch (e) { err(e) }
                    })(obj, args[0], args[1], args[2], args[3])
                    break
                default:
                    err(`новая функция ${func}`)
                    break
            }
        })
    })
}
