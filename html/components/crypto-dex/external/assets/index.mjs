import waves_eth_usdt from '/static/html/components/crypto-dex/external/assets/waves_eth_usdt.mjs'
import waves_eurn_usdn from '/static/html/components/crypto-dex/external/assets/waves_eurn_usdn.mjs'
import first_second_third from '/static/html/components/crypto-dex/external/assets/first_second_third.mjs'
export default async (type) =>{
  let out = {}
  switch (type) {
    case "waves":
      out = waves_eurn_usdn
      break
    case 'eth':
      out = waves_eth_usdt
      break
    default:
      out = first_second_third(true,type,'red',{},'test')
      break
  }
  return out
}

