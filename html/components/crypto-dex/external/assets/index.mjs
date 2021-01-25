import waves_eth_usdt from '/static/html/components/crypto-dex/external/assets/waves_eth_usdt.mjs'
import waves_eurn_usdn from '/static/html/components/crypto-dex/external/assets/waves_eurn_usdn.mjs'
import WAVES from '/static/html/components/crypto-dex/external/assets/first_second_third.mjs'
export default (type) =>{
  let out = {}
  switch (type) {
    case "waves":
      out = waves_eurn_usdn
      break
    case 'eth':
      out = waves_eth_usdt
      break
    default:
      out = WAVES
      break
  }
  return out
}

