import Waves from '/static/html/components/component_modules/waves/index.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
import config from '/static/html/components/component_modules/account/com.waves-ide_config.mjs'
let waves = new Waves

export default (()=> {
  console.log('# matcher')
  task.get(true, 'await', '5', '','/matcher/orderbook/{publicKey}',async (event)=>{
      let object = event;
      let orders = await waves.getOrders(true, {
        timestamp:object.property.timestamp,
        signature:object.property.signature,
        type:object.property.type
      }, '3', object.substrate.publicKey,`${object.substrate.relation}`)
      object.callback({
        status: orders.status,
        success: orders.success,
        message: orders.message,
        _scriptDir: import.meta.url
      })
    })

  task.get(true, 'await', '5', '','/matcher/orderbook',async (event)=>{
    let object = event;
    let order = await waves.order(true, object.property, '3', object.substrate.substrate, object.substrate.relation)
    object.callback(order)
  })

  task.get(true, 'await', '5', '','/matcher/orderbook/cancel', async (object) => {
    let orders = await waves.cancelAllOrders(true, object.property, '3', object.substrate, object.property)
    object.callback(orders)
  })

  task.get(true, 'await', '5', '','/matcher/orders/cancel/{orderId}', async (object) => {
    let orders = await waves.cancelAllOrders(true, object.property, '3', object.substrate, object.property)
    object.callback(orders)
  })

  task.get(true, 'await', '5', '','/matcher/orders/{address}/cancel', async (object) => {
    let orders = await waves.cancelAllOrders(true, object.property, '3', object.substrate, object.property)
    object.callback(orders)
  })

  task.get(true, 'await', '5', '','/matcher/orders/{address}/cancel', async (object) => {
    let orders = await waves.cancelAllOrders(true, object.property, '3', object.substrate, object.property)
    object.callback(orders)
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
      let keys = Object.keys(object.substrate.description)
      for( let item of keys) {
        switch (order) {
          case 'buy(euroWaves)':
            let buy_euroWaves = await waves.order(true, object['property'] , '3', order, object['relation'])
            break
          case 'sell(euroUsd)':
            let sell_euroUsd = await waves.order(true, object['property'] , '3', order, object['relation'])
            break
          case 'buy(wavesUsd)':
            let buy_wavesUsd = await waves.order(true, object['property'] , '3', order, object['relation'])
            break
          default:
            break
        }
      }
      // console.assert(false, keys)
      // for(let order of object.substrate.transactions) {
      //
      // }
      //
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
})()