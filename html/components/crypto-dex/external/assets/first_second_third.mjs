import head from '/static/html/components/crypto-dex/external/assets/head.mjs'
import ride from '/static/html/components/component_modules/bundle/ride/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
import waves from '/static/html/components/component_modules/bundle/waves/waves.index.mjs'
let axios = Axios['default']
import Obj from '/static/html/components/crypto-dex/external/type/index.mjs'
import lang from '/static/html/components/component_modules/ride/index.mjs'
export default (v,p,c,s,r)=> {
  return new Promise(function (resolve, reject) {
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