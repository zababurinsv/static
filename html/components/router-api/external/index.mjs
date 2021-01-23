import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
let waves = new Waves

export default (()=> {
  console.log('# router-api')
  task.get(true, 'await', '5', '','/matcher/orderbook/{publicKey}',async (event)=>{
      let object = event;
      let orders = await waves.getOrders(true, {
        timestamp:object.property.timestamp,
        signature:object.property.signature,
        type:object.property.type
      }, '3', object.substrate.publicKey,`${object.substrate.relation}`)
      object.callback({
        status: orders.status,
        message: orders.message,
        _scriptDir: import.meta.url
      })
    })

    task.get(true, 'await', '5', '','/matcher/orderbook',async (event)=>{
      let object = event;
      let order = await waves.order(true, object.property, '3', object.substrate.substrate, object.substrate.relation)
      object.callback(order)
    })

    task.get(true, 'await', '5', '','/addresses/balance/{address}', async (event)=>{
      let object = event;
      let balance = await waves.balance(true, 'test', '3', object.substrate.substrate, object.substrate.relation)
      object.callback(balance)
    })

    task.get(true, 'await', '5', '','/matcher/orderbook/cancel', async (object)=>{
      // console.assert(false, object.property)
      let orders = await waves.cancelAllOrders(true, object.property, '3', object.substrate, object.property)
      object.callback(orders)
    })

    task.get(true, 'await', '5', '','/assets/details/{assetId}', async (object)=>{
      let orders = await waves.details(object.view,object.property, object.color, object.substrate, object.relation)
      object.callback(orders)
    })
    task.get(true, 'await', '5', '','/assets/signature/{assetId}', async (object)=> {
      // console.assert(false, )
      let bigNum = new waves.self.bigNumber(object.substrate.timestamp);
      let result = bigNum.toBytes();
      let concat = waves.self.concat(object.substrate.publicKey, result)
      let signature = waves.self.signBytes(object.substrate.seed, concat , 0)
      object.callback(signature)
    })

    task.get(true, 'await', '5', '','/matcher/get/order',async (object)=>{
      let seed = 'tone leg hidden system tenant aware desk clap body robust debris puppy ecology scan runway thing second metal cousin ocean liberty banner garment rice feel'
      let response = await waves.order(true,object.property,'red', object.substrate, seed)
      // console.assert(false, response)
      response = JSON.stringify(response)
      object.callback(response)
    })

    task.get(true, 'await', '5', '','/matcher/orderbook/set',async (object)=>{
      try {
        // console.assert(false, object)
        // for(let order of object.substrate.transactions) {
        //
        // }
        // let order = await waves.order(true, object['property'] , '3', order, object['relation'])
        // let item = {}
        // let id = []
        // item['id'] = ''
        // item['orders'] = {}
        // item['keys'] = {}
        // console.assert(false,object )
        // console.assert(false, {
        //   order:order,
        //   object:object
        // })
        // for(let order of object['substrate']) {
        //
        //   if(order['_'] === 'error'){
        //     id.push('error')
        //     item['orders'][`error-${item['orders']['length']}`]
        //   }else{
        //     item['orders'][`${order.message.id}`] = order
        //     id.push(order.message.id)
        //   }
        // }
        // item['keys'] = Object.keys(item['orders'])
        // item['id'] =id.join('-')
        object.callback({
          status: true,
          message: 'test',
          _scriptDir: import.meta.url
        })
      } catch (e) {
        object.callback({
          status: false,
          message: e,
          _scriptDir: import.meta.url
        })
      }
    })
    // document.addEventListener('/matcher/orderbook/{publicKey}',async (event)=>{
    //     event.detail.callback(waves)
    // })
    // let path = location.pathname.trim().split('/')
    // let options = location.search
    // console.log('---headers-->>>>>', location)
    // window.addEventListener('popstate', async (event) => {
    //     console.log('popstate fired!', event.state);
    // });
    // switch (path[1]) {
    //     case 'matcher':

    // while (document.firstChild) {
    //     document.removeChild(document.firstChild);
    // }

    //router(true, '','5', {path:path,options:options }, 'matcher')
    // break
    // default:
    //     break
    // }
})()