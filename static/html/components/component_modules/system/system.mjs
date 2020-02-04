let system = {}
system['this'] = {}
system['func'] = {}
system['func']['observer'] = {}
system['func']['storage'] = {}
system['func']['observer']['crop'] = {}

system['default'] = function (obj, type) {
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let target = {}
    if (!type) {
        target = obj['this']
    } else {
        target = obj['this'].querySelector(type)
    }
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // console.log(`{a['system'])mutation.type-${mutation}`, mutation)
        })
    })
    let config = { attributes: true, childList: true, characterData: true }
    observer.observe(target, config)
}

system['crop'] = function (obj, type) {
    console.log('~~~~~~~crop~observer~~~~~~~', obj)
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let target = {}
    if (!type) {
        target = obj['this']
    } else {
        target = obj['this'].querySelector(type)
    }
    let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            console.log(`{a['system'])mutation.type-${mutation}`, mutation)
        })
    })
    let config = { attributes: true, childList: true, characterData: true }
    observer.observe(target, config)
}

system['func']['observer'] = function (obj, type) {
    switch (obj['this'].tagName.split('-')[1].toLowerCase()) {
        case 'crop':
            system['crop'](obj, type)
            break
        default:
            console.log(`новый тип`, obj['this'].tagName.split('-')[1].toLowerCase())
            break
    }
}

system['func']['observer']['terminate'] = function (observer) {
    observer.disconnect()
}
system['func']['storage'] = function () {
    window.addEventListener('storage', function (events) {
        console.log(`storage{['menu']${events.key})`)
        console.log(`storage{['menu']${events.oldValue})`)
        console.log(`storage{['menu']${events.newValue})`)
        console.log(`storage{['menu']${events.url})`)
        console.log(`storage{['menu']${events.storageArea})`)
    })
}
system['func']['resize'] = function () {
    window.addEventListener('resize', function (event) {
        // do stuff here
    })
}

async function init (obj) {
    // console.log(`a{['system'])init-${obj}`, obj)

    return system
}

export default {
    init: obj => { return init(obj) }
}
