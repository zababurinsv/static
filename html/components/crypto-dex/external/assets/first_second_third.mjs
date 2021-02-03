import head from '/static/html/components/crypto-dex/external/assets/head.mjs'
import ride from '/static/html/components/component_modules/bundle/ride/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
let axios = Axios['default']
import Obj from '/static/html/components/crypto-dex/external/type/index.mjs'
async function parse(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      resolve(reader.result)
    }
  })
}
export default (v,p,c,s,r)=> {
  return new Promise(function (resolve, reject) {
    axios.get(`${location.origin}/static/html/components/crypto-dex/external/ride/index.ride`)
      .then(async (contract)=>{
        let obj = (await Obj).message
       console.assert(false, obj[obj.type])
        let script1 = ride.parseAndCompile(contract.data , 2)
        let script3 = ride.flattenCompilationResult(ride.compile(contract.data , 2))
        let tx = {
          tx:{}
        }
        let repl  = ride.repl()
        const res = await repl.evaluate('+(2, 2)');
        const cont = `
{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}

@Callable(i)
func foo() = {
    WriteSet([])
}

@Verifier(tx)
func standardVerifier() = sigVerify(tx.bodyBytes, tx.proofs[0], tx.senderPublicKey)
      `

        const flattenResult = ride.flattenCompilationResult(ride.compile(cont))

        console.assert(false,await flattenResult)
        console.assert(false,await res)
        // console.assert(false,await repl.totalInfo())
        // let decompile = ride.decompile(script, 2)
        console.assert(false,{
          "flattenCompilationResult": script3,
          "parseAndCompile": script1,
          "compile": script2,
          "ride": ride,
          "getVarsDoc": ride.getVarsDoc(),
          "getTypes": ride.getTypes(),
          "getFunctionsDoc": ride.getFunctionsDoc(),
          "scriptInfo": ride.scriptInfo(),
          "contractLimits": ride.contractLimits,
          "repl": repl
        })



        let test = {
          key:'',
          value:''
        }
        let orders = Symbol(JSON.stringify(test));
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
          [orders]: {
            "sts": [{"buy(fs)": {
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
            "tst": [{"buy(ft)": {
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
            "fsf": [{"buy(sf)": {
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
            "ftf": [{"buy(tf)": {
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
        resolve(object)
      })
      .catch(function (e) {
        console.assert(false, e)
        resolve(e)
      })
      .finally(function () { console.log('finale')})
  })
}