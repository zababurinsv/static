import convert from '/static/html/components/component_modules/pxTovw/pxTovw.mjs'
let header = false
let triger = 0
let offset = 0
function transform (obj, rVal, offset){
    obj.style.width = rVal
    if(offset > 20){
        obj.style.width = '0'
        // obj.style.display = 'none'
        obj.style.opacity = '0'
    }

}
async function PageXY(evt) {
    evt.preventDefault();
    let change = document['body'].shadowRoot.querySelector('nav')
    switch (evt.type) {
        case 'mouseenter':
            header = true
            break
        case 'mouseleave':
            header = false
            break
        case 'mousedown':
            let x = evt.clientX;
            let vw = await convert({
                input:'mouseEvent',
                pixelToVH:'pixelToVH',
                pixelToVW:'pixelToVW',
                vhToPixel:'vhToPixel',
                vwToPixel:'vwToPixel',
                cleanPx:'cleanPx'
            }, 'pixelToVW', x)
            // console.log('~~~~~~mouseenter~~~~', evt.type, evt.which, evt.target )
            triger = vw
            break
        case 'mouseup':
            triger = 0
            offset = 0
            // change.style.transform = `translateX(0vw)`
            if(change.style.width === '0px'){

            }else if(change.style.width < '15vw'){
                change.style.opacity = '0'
                change.style.width = '0px'
            }else{
                change.style.opacity = '1'
                change.style.width = '40vw'
            }
            break
        case 'mousemove':
            if(evt.which === 1){

                let x = evt.clientX;
                let vw = await convert({
                    input:'mouseEvent',
                    pixelToVH:'pixelToVH',
                    pixelToVW:'pixelToVW',
                    vhToPixel:'vhToPixel',
                    vwToPixel:'vwToPixel',
                    cleanPx:'cleanPx'
                }, 'pixelToVW', x)
                offset = triger - vw
                if(header){
                    if(offset <= 0){
                        if(offset < 25 && change.style.width !== '40vw'|| change.style.width === '0px'){

                            if(offset*-1 >20){
                                change.style.opacity = '1'
                            }
                            // console.log('~~~~~~~~~~!-!-!>>>>', offset)
                            change.style.width = `${offset*-1}vw`
                        }else{
                            // change.style.opacity = '0'
                            // change.style.width = `${offset*-1}vw`
                            // change.style.display = 'flex'
                            // transform(change, `${0 - offset}vw`, offset)
                            // change.style.width = `${offset*-1}vw`
                            // console.log('~~~~~~~~~~!---!>>>>', `${offset*-1}vw`)
                        }
                    }
                    else{
                        // console.log('!!!!!!!!!!!!!!!!!!1')
                        if(change.style.width === '0px'){}else{
                            transform(change, `${40 - offset}vw`, offset)
                        }

                        // change.style.transform = `translateX(${offset*-1}vw)`
                        // change.style.width = `${40 - offset}vw`

                    }
                }else{
                    if(vw > 21){}else{
                        // change.style.transform = `translateX(${offset*-1}vw)`
                        transform(change, `${40 - offset}vw`, offset)
                        // change.style.width = `${40 - offset}vw`
                    }
                }
                // console.log(vw, document.documentElement.clientWidth, window.innerWidth, document.body.clientWidth )

            }
            break
        default:

            break
    }



    // change.style.width = `${vw}vw`
    // change.style.transform = `translateX(${vw}vw)`

    // let coor = "Coordinates: (" + x + "," + y + ")";
    // console.log('mouseEvents', coor)
}
export default async (element) => {
    window.onload = function() {
        let header =  element.shadowRoot.querySelector('header')
        element.addEventListener('mousemove', PageXY);
        element.addEventListener('mousedown', PageXY);
        element.addEventListener('mouseup', PageXY);
        header.addEventListener('mouseenter', PageXY);
        header.addEventListener('mouseleave', PageXY);
        document.onmouseout = function(event) {
            if(event.relatedTarget === null){
                console.log('relatedTarget', )
                event.preventDefault();
                let change = document['body'].shadowRoot.querySelector('nav')
                triger = 0
                offset = 0
                // change.style.transform = `translateX(0vw)`
                if(change.style.width === '0px'){}else{
                    change.style.width = '40vw'
                }

            }
        };
    }
    // element.addEventListener("onmousemove", PageXY, false);
}