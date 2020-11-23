import dragManager from '/static/html/components/component_modules/drag_a/dragManager.mjs'

export default async (v,p,c,obj,r) => {
    let manager = await dragManager()
        obj.this.shadowRoot.querySelector('.board').addEventListener('dragstart', manager);
        obj.this.shadowRoot.querySelector('.board').addEventListener('dragend', manager);

    function DragContainer(container, type) {
        this.element = container;
        this.type = type || 'swap';
        this.items = obj.this.shadowRoot.querySelectorAll('.manager-board__item_td');
        this.draggingItem = null;
        this.item = async (target) => {
          for(let item of this.items) {
            if(item.dataset.item === target.dataset.item) {
              return item
            }
          }
          return {}
        }
        manager.add(this);
      }
    
      DragContainer.prototype.contains = function(target) {
         return (this.element.dataset.item === target.dataset.item);
      }
      
      DragContainer.prototype.handleEvent =async function(event) {

        let $t = await this.item(event.target);
        if (event.type == 'dragstart') {
          // console.log('ffffffffff this.element fffffffffff', this.element.querySelector('.manager-board__item_td_img').dataset.item)
          this.draggingItem = await this.item(this.element.querySelector('.manager-board__item_td_img'));
          event.dataTransfer.setData('text/html', this.draggingItem.innerHTML);
        }
        
        if (event.type == 'dragover' && this.draggingItem != event.target) {
           $t.classList.add('js-active');
          // Preventing the default action _enables_ drop. Because JS APIs.
           if (event.preventDefault) {
            event.preventDefault();
           }
           event.dataTransfer.dropEffect = 'move';
        }
        
        if (event.type == 'dragleave') {
          $t.classList.remove('js-active')
        }
        
        if (event.type == 'drop' && this.draggingItem != null) {
          if (this.type == 'swap') {
            let target = await this.item(event.target)
            let coordinate = this.draggingItem.querySelector('.manager-board__item_td_img').dataset.item
            this.draggingItem.querySelector('.manager-board__item_td_img').dataset.item = target.dataset.item
            let temp = target.cloneNode(true);
            target.innerHTML = this.draggingItem.innerHTML
            this.draggingItem.innerHTML = temp.innerHTML
            console.log('~~~~~ coordinate ~~~~~~~~', this.draggingItem)
            if(this.draggingItem.querySelector('.manager-board__item_td_img') !== null) {
              this.draggingItem.querySelector('.manager-board__item_td_img').dataset.item = coordinate
            }
          } else if (this.type == 'reorder') {
            console.log('reorder');
            console.log(this.items.index(event.target));
          }
        }
        
        if (event.type == 'dragend' || event.type == 'drop') {
          $t.classList.remove('js-active')
          this.draggingItem = null;
         }
      }
      
       DragContainer.prototype.activate = function() {
        for (var i = 0, j=this.items.length; i < j; i++) {
          this.items[i].addEventListener('dragenter', this.handleEvent.bind(this));
          this.items[i].addEventListener('dragover', this.handleEvent.bind(this));
          this.items[i].addEventListener('dragleave', this.handleEvent.bind(this));
          this.items[i].addEventListener('drop', this.handleEvent.bind(this));
        }
       }
      
       DragContainer.prototype.deactivate = function() {
        this.draggingItem = null;
        for (var i = 0, j=this.items.length; i < j; i++) {
          this.items[i].removeEventListener('dragenter', this.handleEvent);
          this.items[i].removeEventListener('dragover', this.handleEvent);
          this.items[i].removeEventListener('dragleave', this.handleEvent);
          this.items[i].removeEventListener('drop', this.handleEvent);
        }
      }
     return {
        drag:DragContainer,
        dragManager: manager
     }
}