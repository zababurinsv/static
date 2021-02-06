import hjson from '/static/html/components/component_modules/bundle/hjson/hjson.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
import core from '/static/html/components/component_modules/bundle/ride/index.mjs'
import testFunc from '/static/html/components/component_modules/ride/func/index.mjs'
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
      let repl  = await core.repl()
      let info = repl.totalInfo()
      let dataFunc = info.split('func')
      let ride_f = {}
      let eq = {}
      let self_contract = await axios.get(`${location.origin}/static/html/components/crypto-dex/external/ride/index.ride`)


        console.log('ssssss', self_contract)
        resolve({
          status: 'ok',
          success: true,
          message: data,
          _scriptDir: import.meta.url
        })
      })
    })
      let contract = {
        verify: (v,p,c,s,r) => {
          return new Promise( async (resolve, reject) =>{
            try {

              resolve({
                status: 'ok',
                success: true,
                message: {
                  v:v,
                  p:p,
                  c:c,
                  s:s,
                  r:r
                },
                _scriptDir: import.meta.url
              })
            } catch (e) {
              resolve({
                status: 'ok',
                success: false,
                message: e,
                _scriptDir: import.meta.url
              })
            }
          })
        }
      }
      for(let item of dataFunc) {
        if(item.indexOf('let') === -1 && item.indexOf('type') === -1) {
          let tmp = item.split('(')
          if(tmp.length !== 1) {
            let name = tmp[0].trim()
            ride_f[`${name}`] = {}
            let desc = '(' + tmp[1].trim()
            ride_f[`${name}`] = desc

            for(let key in testFunc) {
             let name_t = key.trim()
              if(name === name_t) {
               // console.assert(false, testFunc[name])
               eq[name] = {}
               eq[name] = {
                 complexity: (testFunc[name].length / 1038)*10,
                 length: testFunc[name].length,
                 ride: {
                   run: contract.verify(v,p,c,s,r)
                     .then((data)=>{
                         return new Promise( async (resolve, reject) =>{

                           console.log('ssssss', data)
                           resolve({
                             status: 'ok',
                             success: true,
                             message: data,
                             _scriptDir: import.meta.url
                           })
                         })
                     }).catch((e)=>{
                        resolve({
                          status: 'ok',
                          success: false,
                          message: e,
                          _scriptDir: import.meta.url
                        })
                     })
                  },
                   type: ride_f[`${name}`]
                }
              }
            }
          }
        }
      }
      let benchmark = {
        length: info.length,
        info: eq
      }
      console.assert(false, benchmark)
      testFunc.sigVerify.length
      for(let item in testFunc ) {
       console.log(item,': ',{
         name: item,
         r: testFunc.sigVerify.length/testFunc[item].length,
         length: testFunc[item].length
       })
      }

     //

      // console.assert(false,func)
      // console.assert(false, obj[obj.type])
      // let script1 = core.parseAndCompile(contract.data , 2)
      // let script3 = core.flattenCompilationResult(core.compile(contract.data , 2))
      // let tx = {
      //   tx:{}
      // }



        console.assert(false, repl.totalInfo())
      // console.assert(false, ride)
      // const res = await core.evaluate('2+2');
      // const toBytes = await core.evaluate(`toBytes('Мой дядя самых честных правил')`);
      // const toUtf8String = await core.evaluate(`toUtf8String(base58'HpY4RRdQiYQw7j5c4PgvUrr1KUv6xg9Xbz7EsprgCo5nBqBdS1R5xSmKjd5De3TngsaYSzr8Rx')`);
      // const flattenResult = ride.flattenCompilationResult(ride.compile(cont))
      // console.assert(false,await flattenResult)
      // console.log(false,await repl.totalInfo())
      // console.assert(false,await toUtf8String)
      // console.assert(false, toBytes)
      // console.assert(false,await res)
      //
      // let decompile = ride.decompile(script, 2)
      // console.assert(false,{
      //   "flattenCompilationResult": script3,
      //   "parseAndCompile": script1,
      //   "compile": script2,
      //   "ride": ride,
      //   "getVarsDoc": ride.getVarsDoc(),
      //   "getTypes": ride.getTypes(),
      //   "getFunctionsDoc": ride.getFunctionsDoc(),
      //   "scriptInfo": ride.scriptInfo(),
      //   "contractLimits": ride.contractLimits,
      //   "repl": repl
      // })

      for(let type of funcs) {
        console.assert(false,type )
      }


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