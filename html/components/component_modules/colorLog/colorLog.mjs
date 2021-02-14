import Performance from '/static/html/components/component_modules/performance/performance.mjs'
import colors from '/static/html/components/component_modules/colors/colors.mjs'
import emoji from '/static/html/components/component_modules/emoji/emoji.mjs'

let performance = Performance()
export default async (show, message='time', color ='black', ...args) => {
    if(show === true) {
        color = await colors(color)
        if(typeof args[args.length-1] === 'string'){
            let end = false
            switch (message) {
                case "end":
                    end = true
                    break
                case "stat":
                    end = true
                    break
                default:
                    break
            }
            if(typeof message === 'object'){
                if(message.hasOwnProperty('end') && message.end === true){
                    end = true
                    message = message.property
                }
                if(message.hasOwnProperty('assert') && message.assert === true){
                    console.assert(false,'%c%O' + args[args.length-1],'color:' + color,performance['now'](end, args[args.length-1], message),'[(', ...args.slice(0, args.length-1),'*)',message,']')
                }
            }else{
                if(message === 'end'){end = true}
            }
            if(message === 'stat'){
                console.log('%c' + args[args.length-1],'color:' + color,'[(', performance.allMark,'*)',message,']')
            }else if(message === 'assert'){
                console.assert(false,'%c%O' + args[args.length-1],'color:' + color,performance['now'](end, args[args.length-1], message),'[(', ...args.slice(0, args.length-1),'*)',message,']', emoji('thinking'))
            }else{
                // console.log(emoji('all'))
                let moon = (end) ?'new_moon': 'full_moon'
                console.log('%c%O' + args[args.length-1],'color:' + color,performance['now'](end, args[args.length-1], message),'[(', ...args.slice(0, args.length-1),'*)',message,']',  emoji(moon))
            }
        }else{
            console.log('%c' + message, 'color:' + color,'--->', ...args)
        }
    } else {
        color = await colors(color)
        if(typeof args[args.length-1] === 'string'){
            let end = false
            switch (message) {
                case "end":
                    end = true
                    break
                case "stat":
                    end = true
                    break
                default:
                    break
            }
            if(typeof message === 'object'){
                if(message.hasOwnProperty('end') && message.end === true){
                    end = true
                    message = message.property
                }
                if(message.hasOwnProperty('assert') && message.assert === true){
                    console.assert(false,'%c%O' + args[args.length-1],'color:' + color,performance['now'](end, args[args.length-1], message),'[(', ...args.slice(0, args.length-1),'*)',message,']')
                }
            }else{
                if(message === 'end'){end = true}
            }
            if(message === 'stat'){
                // performance.allMark
            }else if(message === 'assert'){
                performance['now'](end, args[args.length-1], message)
            }else{
                performance['now'](end, args[args.length-1], message)
            }
        }else{
            console.log('%c' + message, 'color:' + color,'--->', ...args)
        }

    }
}