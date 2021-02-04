import head from '/static/html/components/crypto-dex/external/assets/head.mjs'
import ride from '/static/html/components/component_modules/bundle/ride/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
let axios = Axios['default']
import Obj from '/static/html/components/crypto-dex/external/type/index.mjs'
import lang from '/static/html/components/component_modules/ride/index.mjs'
export default (v,p,c,s,r)=> {
  return new Promise(function (resolve, reject) {
    axios.get(`${location.origin}/static/html/components/crypto-dex/external/ride/index.ride`)
      .then(async (contract)=>{
        // console.assert(false,await lang)
        let obj = (await Obj).message
       // console.assert(false, obj[obj.type])
        let script1 = ride.parseAndCompile(contract.data , 2)
        let script3 = ride.flattenCompilationResult(ride.compile(contract.data , 2))
        let tx = {
          tx:{}
        }
        let repl  = await ride.repl()
        // console.assert(false, ride)
        const res = await repl.evaluate('2+2');
        const toBytes = await repl.evaluate(`toBytes('Мой дядя самых честных правил')`);
        const toUtf8String = await repl.evaluate(`toUtf8String(base58'HpY4RRdQiYQw7j5c4PgvUrr1KUv6xg9Xbz7EsprgCo5nBqBdS1R5xSmKjd5De3TngsaYSzr8Rx')`);
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
        let test = {
          key:'',
          value:''
        }
        let orders = Symbol("id");
        let object = {
          "head": head,
          "S": {
            "first":  "WAVES",
            "second": "DUk2YTxhRoAqMJLus4G2b3fR8hMHVh6eiyFx5r29VR6t",
            "third":  "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p"
          },
          "W": {
            "first":  "WAVES",
            "second": "DUk2YTxhRoAqMJLus4G2b3fR8hMHVh6eiyFx5r29VR6t",
            "third":  "DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p"
          },
          "T": {
            "first": "WAVES",
            "second":"E39SjE8Lj2yxJn3HswVJQvCnZ2oH4GEXrm5u2fTXuZqj",
            "third": "25FEqEjRkqK6yCkiT7Lz6SAYz7gUFCtxfCChnrVFD5AT"
          },
          "orders": {
            "ffs": [{"buy(fs)": {
                "amount": {
                  "f":"",
                  "s":""
                },
                "price":  ""
              }}, {"sell(ft)":{
                "amount": {
                  "f":"",
                  "t":""
                },
                "price":  ""
              }}, {"buy(st)":{
                "amount": {
                  "s":"",
                  "t":""
                },
                "price":  ""
              }}],
            "fft": [{"buy(ft)": {
                "amount": {
                  "f":"",
                  "t":""
                },
                "price":  ""
              }},{"sell(fs)":{
                "amount": {
                  "f":"",
                  "s":""
                },
                "price":  ""
              }},{"buy(ts)":{
                "amount": {
                  "t":"",
                  "s":""
                },
                "price":  ""
              }}],
            "ssf": [{"buy(sf)": {
                "amount": {
                  "s":"",
                  "f":""
                },
                "price":  ""
              }},{"sell(st)":{
                "amount": {
                  "s":"",
                  "t":""
                },
                "price":  ""
              }},{"buy(ft)":{
                "amount": {
                  "f":"",
                  "t":""
                },
                "price":  ""
              }}],
            "ttf": [{"buy(tf)": {
                "amount": {
                  "t":"",
                  "f":""
                },
                "price":  ""
              }},{"sell(ts)":{
                "amount": {
                  "t":"",
                  "s":""
                },
                "price":  ""
              }},{"buy(fs)":{
                "amount": {
                  "f":"",
                  "s":""
                },
                "price":  ""
              }}]
          }
        }
        resolve({
          status: 'ok',
          success: true,
          message: object,
          _scriptDir: import.meta.url
        })
      })
      .catch(function (e) {
        resolve({
          status: 'ok',
          success: false,
          message: e,
          _scriptDir: import.meta.url
        })
      })
      .finally(function () { console.log('finale')})
  })
}