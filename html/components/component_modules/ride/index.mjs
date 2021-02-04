import hjson from '/static/html/components/component_modules/bundle/hjson/hjson.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']
let waves = new Waves

let params = (items) => {
 let p =``
  for(let item of items) {
p = p + `* ${item}
   `
  }
  return p
}
export default (()=>  {
  return new Promise(function (resolve, reject) {
  axios.get('/static/html/components/component_modules/ride/doc/v4/funcs/extracting-data-functions.hjson')
    .then(async (data) => {
     let funcs = (await hjson.parse(data.data)).message.funcs
     let md = `# extracting data functions`
      for(let type of funcs) {
        md =
md +`
## ${type.name}
* params
   ${await params(type.params)}
* paramsDoc
   ${await params(type.paramsDoc)}
`}
      resolve({
        status: 'ok',
        success: true,
        message: {
          md: md,
          js: funcs
        },
        _scriptDir: import.meta.url
      })
    })
    .catch(function (e) {
      resolve({
        status:false,
        success:false,
        message: e,
        _scriptDir: import.meta.url
      })
      return e
    })
    .then(function (data) {
      // always executed
    });
})
})()