import head from '/static/html/components/crypto-dex/external/assets/head.mjs'
import ride from '/static/html/components/component_modules/bundle/ride/index.mjs'
import Axios from '/static/html/components/component_modules/axios/axios.mjs'
let axios = Axios['default']
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
console.assert(false, ride.compile())
// console.assert(false, object[orders], orders.description )
export default object