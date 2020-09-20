export default (color)=>{
    return new Promise((resolve, reject) => {
        color = color || 'black'
        switch (color) {
            case 'success':
                color = 'Green'
                break
            case 'info':
                color = 'DodgerBlue'
                break
            case 'error':
                color = 'Red'
                break
            case 'warning':
                color = 'Orange'
                break
            case 'action':
                color = '#49483dfc'
                break
            case 'function':
                color = '#ffd400'
                break
            case 'events':
                color = 'blue'
                break
            case 'violet':
                color = 'violet'
                break
            case 'stat':
                color = '#348a00'
                break
            case 'constructor':
                color = '#7703fc'
                break
            case '0':
                color = '#ca0a74'
                break
            case '1':
                color = '#f7a428'
                break
            case '2':
                color = '#d2c302'
                break
            case '3':
                color = '#13c510'
                break
            case '4':
                color = '#bd953f'
                break
            case '5':
                color = '#05b0ce'
                break
            case '6':
                color = '#53b796'
                break
            case '7':
                color = '#7928d2'
                break
            case '8':
                color = '#921436'
                break
            case '9':
                color = 'rgba(201,81,3,0.84)'
                break
            case '10':
                color = '#84305e'
                break
            case '11':
                color = '#6b4c17'
                break
            case '12':
                color = 'aqua'
                break
            case '13':
                color = 'black'
                break
            case '14':
                color = 'blue'
                break
            case '15':
                color = 'fuchsia'
                break
            case '16':
                color = 'gray'
                break
            case '17':
                color = 'green'
                break
            case '18':
                color = 'lime'
                break
            case '19':
                color = 'maroon'
                break
            case '20':
                color = 'navy'
                break
            case '21':
                color = 'olive'
                break
            case '22':
                color = 'orange'
                break
            case '23':
                color = 'purple'
                break
            case '24':
                color = 'silver'
                break
            case '25':
                color = 'teal'
                break
            case '26':
                color = 'yellow'
                break
            default:
        }
        resolve(color)
    })
}



