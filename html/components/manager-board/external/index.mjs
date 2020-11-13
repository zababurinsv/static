import events from '/static/html/components/manager-board/external/events.mjs'
import board from '/static/html/components/manager-board/external/board.mjs'
import store from '/static/html/components/component_modules/staticProperty/staticProperty.mjs'
import Net from '/static/html/components/component_modules/monopoly/net.mjs'

export default async (v,p,c,obj,r) => {
    await board(v,p,c,obj,r)
    events(v,p,c,obj,r)
    // store({
    //     input:`${obj['slot']}`,
    //     this:obj['this'],
    //     obj: obj,
    //     type:'obj'
    // }, 'set', 'type')
    // console.assert(false, new Menu.class(obj))
    // await Menu(obj)
    // await monopoly(obj)
}