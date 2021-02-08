import hjson from '/static/html/components/component_modules/bundle/hjson/hjson.index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
import core from '/static/html/components/component_modules/bundle/ride/index.mjs'
import go from '/static/html/components/component_modules/ride/func/go/index.mjs'
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

let Contract = {
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
export default (()=>  {
  return new Promise(function (resolve, reject) {
  axios.get('/static/html/components/component_modules/ride/doc/v4/funcs/index.hjson')
    .then(async (data) => {
      let self_contract = await axios.get(`${location.origin}/static/html/components/crypto-dex/external/ride/index.ride`)
      let funcs = {
        doc:(await hjson.parse(data.data)).message.funcs,
        repl: ((await core.repl()).totalInfo()).split('func'),
        mjs:{}
      }
      let ride_f = {}
      let eq = {}
      let md = `# extracting data functions`

      for(let type of funcs.doc) {
md =
md +`
## ${type.name}
* params
   ${await params(type.params)}
* paramsDoc
   ${await params(type.paramsDoc)}
`
        for(let item of funcs.repl) {
          if(item.indexOf('let') === -1 && item.indexOf('type') === -1 && item.length !== 0) {
            let tmp = item.split('(')
            if(tmp.length !== 1) {
              let name = tmp[0].trim()
              ride_f[`${name}`] = {}
              let desc = '(' + tmp[1]
              ride_f[`${name}`] = desc
              for(let go_type in go) {
                if(go_type === type.name) {
                  funcs.mjs[`${type.name}`] = {}
                  funcs.mjs[`${type.name}`] = {
                    complexity: {
                      self: parseInt((go[go_type].length / 1038)*30, 10),
                      ride: type.complexity
                    },
                    length: go[go_type].length,
                    lang: {
                      ride: {
                        run: (v,p,c,s,r) => {
                          return new Promise( async (resolve, reject) =>{
                            try {
                              let contract =  await Contract.verify(v,p,c,s,r)
                              if(contract.success) {
                                console.assert(false)
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
                              } else {
                                resolve({
                                  status: 'not ok',
                                  success: false,
                                  message: {
                                    v:v,
                                    p:p,
                                    c:c,
                                    s:s,
                                    r:r
                                  },
                                  _scriptDir: import.meta.url
                                })
                              }
                            }catch (e) {
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
                    },
                    type: ride_f[`${name}`]
                  }
                }
              }
            }
          }
        }
      }
    // console.assert(false, core)
      // let script1 = core.parseAndCompile(self_contract.data , 2)
      // let script3 = core.flattenCompilationResult(core.compile(self_contract.data , 2))
      // const res = await core.evaluate('2+2');
      // const toBytes = await core.evaluate(`toBytes('Мой дядя самых честных правил')`);
      // const toUtf8String = await core.evaluate(`toUtf8String(base58'HpY4RRdQiYQw7j5c4PgvUrr1KUv6xg9Xbz7EsprgCo5nBqBdS1R5xSmKjd5De3TngsaYSzr8Rx')`);
      // const flattenResult = core.flattenCompilationResult(core.compile(self_contract.data))
      // console.assert(false,{
      //   "flattenCompilationResult": script3,
      //   "parseAndCompile": script1,
      //   "compile": script2,
      //   "ride": core,
      //   "getVarsDoc": core.getVarsDoc(),
      //   "getTypes": core.getTypes(),
      //   "getFunctionsDoc": core.getFunctionsDoc(),
      //   "scriptInfo": core.scriptInfo(),
      //   "contractLimits": core.contractLimits,
      //   "repl": repl
      // })
      resolve({
        status: 'ok',
        success: true,
        message: {
          md: md,
          js: funcs.mjs
        },
        _scriptDir: import.meta.url
      })
    })
    .catch(function (e) {
      console.assert(false, e)
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