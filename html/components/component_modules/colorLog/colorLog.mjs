export default (message, color, ...args) =>{
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
        case 'events-out':
            color = 'blue'
            break
        case 'violet':
            color = 'violet'
            break
        default:
    }
    console.log('%c' + message, 'color:' + color, ...args)
}