import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
export let style = (url='#', target = undefined) => {
    return new Promise(function (resolve, reject) {
        if(typeof (target) === 'object' && target.children.length > 0){
            let allStyle = target.querySelectorAll('style')
            let verify = false
            for(let i =0; i< allStyle.length;i++){
                if(allStyle[i].innerText.indexOf(`${url}`) > 0){
                    verify = true
                }
            }
            if(verify){

            }else{
                let style = document.createElement('style')
                style.innerHTML = `@import '${url}';`
                target.appendChild(style);
            }
        }else{
            console.assert(false, 'укажите компонент куда будет добавляться стиль')
        }
        resolve({style:'true'})
    })
}

export let tests = (url, target, obj)=>{
    return new Promise(function (resolve, reject) {
        let load = document.createElement('script');
        load.src = url
        load.type = 'module'
        if(isEmpty(target)){
            console.warn(`установите путь куда будет добавлен скрипт /n устанавливается в body `)
            // obj.this.shadowRoot.appendChild(load)
            document.body.appendChild(load)
        }else{
            // obj.this.shadowRoot.appendChild(load)
            document.body.querySelector(`#${target}`).appendChild(load)
        }

        load.onload = (out) =>{
            resolve({loading:true})
        }
    })
}

export let add = (url, target)=>{
    return new Promise(function (resolve, reject) {
        let load = document.createElement('script');
        load.src = url
        if(isEmpty(target)){
            console.warn(`установите путь куда будет добавлен скрипт /n устанавливается в body `)
            document.body.appendChild(load)
        }else{
            document.body.querySelector(`#${target}`).appendChild(load)
        }

        load.onload = (out) =>{
            resolve(window[name])
        }
    })
}

export default (url, name, obj)=>{
    return new Promise(function (resolve, reject) {
        let verifyScript = true
        let verifyName = name.toLowerCase()
        let Script = {}
        for(let item of document.body.querySelectorAll('script')){
            if(item.src.indexOf(`${verifyName}.mjs`) > 0){
                verifyScript =false
                Script = item
            }
            if(item.src.indexOf(`${verifyName}.js`) > 0){
                verifyScript =false
                Script = item
            }
        }
        if(verifyScript){
          if(isEmpty(obj)){
              if( isEmpty(window[name])){
                    let load = document.createElement('script');
                    load.src = url
                    document.body.appendChild(load)
                    load.onload = (out) =>{
                          document.dispatchEvent( new CustomEvent(`${name}-loading`))
                          resolve(window[name])
                      }
              }else{
                  resolve(window[name])
              }
          } else {

              obj.script = undefined
              if(isEmpty(obj.script)){
                  obj.script = {}
                  obj['script'][`${name}`] = {}
              }
              if( isEmpty(window[name])){
                  if( isEmpty(obj['script'][`${name}`])){
                      let load = document.createElement('script');
                      load.src = url
                      obj['this']['shadowRoot'].appendChild(load)
                      load.onload = (out) =>{
                          document.dispatchEvent( new CustomEvent(`${name}-loading`))
                          resolve(window[name])
                      }
                  }
              }else{
                  resolve(window[name])
              }
          }
        }else{
            resolve(true)
            // if( isEmpty(window[name])){
            //   document.addEventListener(`${name}-loading`,()=>{
            //       resolve(window[name])
            //   })
            // }else{
            //     resolve(window[name])
            // }
        }
    })
}