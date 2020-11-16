let develop = false
let element, bbox, inputX, inputY, offsetX, offsetY, raf;

export default async (v,p,c,obj,r) => {
    let container = obj.this.shadowRoot.querySelector('div')
    let dev = obj.this.shadowRoot.querySelector(`.${parent.className}-help_aiming`)
    let state = { distX: 0, distY: 0 };

    function userPressed(event) {
        element = event.target
        console.log('~~ userPressed ~~')
        if (element.classList !== container.classList) {
            bbox = element.getBoundingClientRect()
            offsetX = bbox.x - event.clientX
            offsetY = bbox.y - event.clientY
            inputX = bbox.x
            inputY = bbox.y
            console.log(bbox.x, bbox.y, inputX, inputY)
            // container.addEventListener('pointermove', userMoved, { passive: false });
            // container.addEventListener('pointerup', userReleased, { passive: false });
            // container.addEventListener('pointercancel', userReleased, { passive: false });

            container.addEventListener('mousemove', userMoved, { passive: false });
            container.addEventListener('mouseup', userReleased, { passive: false });
        }
    }

    function userMoved(event) {
        element.style.left = (event.clientX + offsetX) + "px";
        element.style.top = (event.clientY + offsetY) + "px";
    }

    function userReleased(event) {
        console.log('~~ userReleased ~~', event)

        container.removeEventListener('mousemove', userMoved, { passive: false });
        container.removeEventListener('mouseup', userReleased, { passive: false });
        // container.removeEventListener('pointermove', userMoved);
        // container.removeEventListener('pointerup', userReleased);
        // container.removeEventListener('pointercancel', userReleased);
    }

    container.addEventListener('pointerdown', userPressed, { passive: false });

    // if(develop) {
    //  console.log('!!!!!!!!!!!!')
        // for(let i=0; i< parent.childNodes.length; i++){
        //     parent.childNodes[i].addEventListener('mousedown', onDown);
        //     parent.childNodes[i].addEventListener('touchstart', onDown);
        // }
    // }else {
    //     container.removeEventListener('pointerdown', userPressed, { passive: false });
        // for(let i=0; i< parent.childNodes.length; i++){
        //     parent.childNodes[i].removeEventListener('mousedown', onDown, false);
        //     parent.childNodes[i].removeEventListener('touchstart', onDown, false);
        // }
        // parent.addEventListener('pointerdown', userPressed, { passive: true });
    // }
}
