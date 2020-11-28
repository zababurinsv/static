import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
let object = {
    draggingItem: {},
    touchLocation: {},
    touchEl: {},
    lastMove: {},
    board: {
        width:'',
        height:''
    },
    dragging: {
        conrainer: {},
        image: {}
    }
}
export default async (v,p,c,obj,r) => {
   async function touchstart(event, self, obj) {
    event.preventDefault();

        if(!isEmpty(self.element.querySelector('.manager-board__item_td_img'))) {
            object.dragging.conrainer = await self.item(self.element.querySelector('.manager-board__item_td_img'));
            object.dragging.image = object.dragging.conrainer.querySelector('.manager-board__item_td_img')
        } else {
            object.draggingItem = {}
        }
        // event.dataTransfer.setData('text/html', this.draggingItem.innerHTML);
       // this.classList.add('drag-item--touchmove');
    }
    let scrollDelay = 0;
    let scrollDirection = 1;
    function pageScroll(a, b) {
        window.scrollBy(0,scrollDirection); // horizontal and vertical scroll increments
        scrollDelay = setTimeout(pageScroll,5); // scrolls every 100 milliseconds

        if (a > window.innerHeight - b) { scrollDirection = 1; }
        if (a < 0 + b) { scrollDirection = -1*scrollDirection; }
    }

    var x = 1;
   async function touchmove(event, self, obj) {
        object.touchLocation = event.targetTouches[0]
        let board =  obj['this'].shadowRoot.querySelector('.board')
        // let touchLocation = event.targetTouches[0],
        object.board.width = board.offsetWidth,
        object.board.height = board.offsetHeight;
        let $t = await self.item(event.target);
        // console.log('~~~~~~~~~~~~~~',{
            // asdasd: self.element.offsetWidth,
            // afasdassss: $t
        // })
        object.lastMove = event;
        object.touchEl = self.element;
// 
        // console.log('~~~~~~~~~!!~~~~~~', `${self.element.offsetWidth}px`)
        // console.log('~~~~~~~~~!!~~~~~~', `${self.element.offsetHeight}px`)
        object.dragging.image.style.width = self.element.offsetWidth + 'px';
        object.dragging.image.style.height = self.element.offsetHeight + 'px';
        object.dragging.image.style.position = 'fixed';
        object.dragging.image.style.left = object.touchLocation.clientX - self.element.offsetWidth/2 + 'px';
        object.dragging.image.style.top = object.touchLocation.clientY - self.element.offsetHeight/2 + 'px';

    // if (touchLocation.clientY > window.innerHeight - h || touchLocation.clientY < 0 + h) {
        // if (x === 1) {
        // x = 0;
        // pageScroll(touchLocation.clientY, h);
        // }
    // } else {
        // clearTimeout(scrollDelay);
        // x = 1;
    // }
    }

    function touchend(event, self, obj) {
        let box1 =  object.dragging.image.getBoundingClientRect(),
        x1 = box1.left,
        y1 = box1.top,
        h1 = self.offsetHeight,
        w1 = self.offsetWidth,
        b1 = y1 + h1,
        r1 = x1 + w1;
        console.log('', box1);
    [].forEach.call(self.items, function(target) {
            let box2 = target.getBoundingClientRect(),
            x2 = box2.left,
            y2 = box2.top,
            h2 = target.offsetHeight,
            w2 = target.offsetWidth,
            b2 = y2 + h2,
            r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        } else {
            if (object.touchEl.classList.contains('drag-item--prepend')) {
                // console.log('~~~~~~~~~~~~~~~~~~~~~', target)
                // target.prepend(object.touchEl);
            } else {
                // console.log('~~~~~~~~1~~~~~~~~~~~~~', target)
                // console.log('~~~~~~~~~~2~~~~~~~~~~~', object.touchEl)
                // target.appendChild(object.touchEl);
            }
        }
    });
    console.log('~~~~~~~~~~~~~~~~~~~~', object.dragging.image)
    object.dragging.image.removeAttribute("style");
    // this.removeAttribute('style');
    // this.classList.remove('drag-item--touchmove');
    // clearTimeout(scrollDelay);
    // x = 1;
    object.touchEl = {}
    }


    return{
        touchstart:touchstart,
        touchmove: touchmove,
        touchend: touchend,
    }
}