let api = {}
api['post'] = {}
api['post']['file'] = (obj, file, from, to) => {
    return new Promise(function (resolve, reject) {


        if(!obj['isEmpty']){
            let event = {
                object:'varan-api',
                module: 'isEmpty'
            }
            bundle['default'](event, obj,(error, obj)=> {

                console.log('error', error);
                console.log('object',obj);

                if(obj['isEmpty'](from)){
                    console.assert(false, 'не указан путь куда отсылать')
                }
                if(obj['isEmpty'](to)){
                    console.warn('не указан путь куда отправлять после обработки(значит на этой же ноде)')
                    to = 'null'
                }
            })
        }else{

            if(obj['isEmpty'](from)){
                console.assert(false, 'не указан путь куда отсылать')
            }
            if(obj['isEmpty'](to)){
                console.warn('не указан путь куда отправлять после обработки(значит на этой же ноде)')
            to = 'null'
            }
        }
        let formData = new FormData()
        formData.append('file', file)
        let request = new XMLHttpRequest()

        // console.assert(false, `${from}/api/${to}`)

        request.open('POST', `${from}/api/${to}`)
        request.send(formData)
        resolve(obj)
    })
}
api['post']['json'] = (obj, json, from, to) => {
    return new Promise(function (resolve, reject) {
        if(!obj['isEmpty']){
            let event = {
                object:'varan-api',
                module: 'isEmpty'
            }
            bundle['default'](event, obj,(error, obj)=> {

                console.log('error', error);
                console.log('object',obj);

                if(obj['isEmpty'](from)){
                    console.assert(false, 'не указан путь куда отсылать')
                }
                if(obj['isEmpty'](to)){
                    console.warn('не указан путь куда отправлять после обработки(значит на этой же ноде)')
                    to = 'null'
                }
            })
        }else{

            if(obj['isEmpty'](from)){
                console.assert(false, 'не указан путь куда отсылать')
            }
            if(obj['isEmpty'](to)){
                console.warn('не указан путь куда отправлять после обработки(значит на этой же ноде)')
                to = 'null'
            }
        }

        fetch(`${from}/api/${to}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        }).then(function (response) {

            if (!response.ok) { } else {
                return response.json() }

        }).then(function (obj) {
            resolve(obj)
        }).catch(function (error) {
            console.assert(false, 'varan-api', error)
        })
    })
}
export default api