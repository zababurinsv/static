// import indexedDB from '/js/module/indexedDB.js'
// import templateItem from '/js/module/template.js'
// import  session from '/js/module/session.js'
// import verify from '/js/module/verify.js'
// import listener from "/js/module/listener.js";
// import form from "/js/module/form.js";
// import update from "/js/module/update.js";
// import addEventListener from "/js/module/addEventListener.js";


import indexedDB from './indexedDB.js'
import templateItem from './template.js'
import  session from './session.js'
import verify from './verify.js'
import listener from "./listener.js";
import form from "./form.js";
import update from "./update.js";
import addEventListener from "./addEventListener.js";

export default (obj, type, ...rest)=>{
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    getPagination('#table-id');
    $('#maxRows').trigger('change');
    function getPagination (table){
        $('#maxRows').on('change',function(){
            $('.pagination').html('');						// reset pagination div
            var trnum = 0 ;									// reset tr counter
            var maxRows = parseInt($(this).val());			// get Max Rows from select option

            var totalRows = $(table+' tbody tr').length;		// numbers of rows
            $(table+' tr:gt(0)').each(function(){			// each TR in  table and not the header
                trnum++;									// Start Counter
                if (trnum > maxRows ){						// if tr number gt maxRows
                    $(this).hide();							// fade it out
                }if (trnum <= maxRows ){$(this).show();}// else fade in Important in case if it ..
            });											//  was fade out to fade it in
            if (totalRows > maxRows){						// if tr total rows gt max rows option
                var pagenum = Math.ceil(totalRows/maxRows);	// ceil total(rows/maxrows) to get ..
                //	numbers of pages
                for (var i = 1; i <= pagenum ;){			// for each page append pagination li
                    $('.pagination').append('<li data-page="'+i+'">\
							 	      <span>'+ i++ +'<span class="sr-only"></span></span>\
								    </li>').show();
                }											// end for i
            } 												// end if row count > max rows
            $('.pagination li:first-child').addClass('active'); // add active class to the first li
            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
            showig_rows_count(maxRows, 1, totalRows);
            //SHOWING ROWS NUMBER OUT OF TOTAL DEFAULT
            $('.pagination li').on('click',async function(e){

                // console.assert(false)
                e.preventDefault();
                var pageNum = $(this).attr('data-page');	// get it's number
                var trIndex = 0 ;							// reset tr counter
                $('.pagination li').removeClass('active');	// remove active class from all li
                $(this).addClass('active');					// add active class to the clicked
                //SHOWING ROWS NUMBER OUT OF TOTAL
                showig_rows_count(maxRows, pageNum, totalRows);
                //SHOWING ROWS NUMBER OUT OF TOTAL
                $(table+' tr:gt(0)').each(function(){		// each tr in table not the header
                    trIndex++;								// tr index counter
                    // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                    if (trIndex > (maxRows*pageNum) || trIndex <= ((maxRows*pageNum)-maxRows)){
                        $(this).hide();
                    }else {
                        this.style.display = ''
                    }
                });

                // console.assert(false)
                // let del = obj.querySelectorAll('.delete')
                // for(let i =0; i < del.length;i++){ await addEventListener(del[i], obj) }
                // console.assert(false, obj)

                obj.querySelector('.btn-primary').addEventListener('click', async (e)=>{
                    let itemObject = await form()



                    let verify = true
                    let item =  e.target
                    while(verify){
                        if(item.tagName === 'MAIN-TABLE'){
                            verify = false
                        }else{
                            item =  item.parentNode
                        }
                    }

                    // console.assert(false, item)
                    item.querySelector('#formConteiner').innerHTML = ''
                    item.querySelector('#formConteiner').insertAdjacentHTML('beforeend', itemObject)

                    sessionStorage.setItem('city',0);
                    obj.querySelector('#city').addEventListener("change",  async (event)=>{
                        sessionStorage.setItem('city',event.target.selectedIndex);
                    })
                    itemObject = item.querySelector('#object-form')
                    for(let i = 0; i < itemObject.querySelectorAll('input').length; i++){
                        itemObject.querySelectorAll('input')[i].addEventListener('input', (event) => {
                            sessionStorage.setItem(`${event.target.name}`,event.target.value);
                        });
                    }
                    for(let i = 0; i < itemObject.querySelectorAll('textarea').length; i++){
                        itemObject.querySelectorAll('textarea')[i].addEventListener('input', (event) => {
                            sessionStorage.setItem(`${event.target.name}`,event.target.value);
                        });
                    }


                    item.querySelector('.btn-success').addEventListener('click', async (e)=>{


                        let data = new FormData();
                        let outItem = {}
                        for(let i=0; i < item.querySelectorAll('input').length; i++){
                            data.append(`${item.querySelectorAll('input')[i].name}`, sessionStorage.getItem(`${item.querySelectorAll('input')[i].name}`));
                            sessionStorage.removeItem(`${item.querySelectorAll('input')[i].name}`)
                        }

                        for(let i=0; i <item.querySelectorAll('textarea').length; i++){
                            data.append(`${item.querySelectorAll('textarea')[i].name}`, sessionStorage.getItem(`${item.querySelectorAll('textarea')[i].name}`));
                            sessionStorage.removeItem(`${item.querySelectorAll('textarea')[i].name}`)
                        }

                        data.append('city', sessionStorage.getItem('city'))
                        data.append('timestampUpdate', [])
                        if (item.querySelector('#file-upload').files[0] === undefined){
                            data.append('image', 'none')
                            data.append('fileUpload', 'none')
                        }else{
                            let file = await  toBase64(item.querySelector('#file-upload').files[0])
                            // console.assert(false,file )
                            if( item.querySelector('#file-upload').files[0]){
                                data.append('image', file)
                                data.append('fileUpload', file)
                            }
                        }




                        // console.assert(false,e.target.parentNode.querySelector('#file-upload').files[0]['name'].split('.')[0] )

                        let timestamp = Date.now()
                        data.append('timestamp', timestamp)
                        fetch(`http://dev.work/api/item/`,{
                            method: 'POST',
                            body:data
                        })
                            .then(function(response) {
                                return response.text();
                            })
                            .then(async function(myJson) {
                                console.log(myJson);
                                obj.querySelector('tbody').innerHTML = ''
                                obj.querySelector('#formConteiner').innerHTML = ''
                                sessionStorage.clear()
                                await update(obj)
                            });
                    })
                })
            });
            // console.assert(false)
        });
        // end of on select change
        // END OF PAGINATION
    }
// SI SETTING
    $(function(){
        // Just to append id number for each row
        // default_index();
    });
//ROWS SHOWING FUNCTION
    function showig_rows_count(maxRows, pageNum, totalRows) {
        //Default rows showing
        var end_index = maxRows*pageNum;
        var start_index = ((maxRows*pageNum)- maxRows) + parseFloat(1);
        var string = 'Showing '+ start_index + ' to ' + end_index +' of ' + totalRows + ' entries';
        $('.rows_count').html(string);
    }

    function default_index() {
        // $('table tr:eq(0)').prepend('<th class="search_input_id"><input class="search_input_id"type="text" id="search_input_id"  placeholder="id" class="form-control"></th>')
        var id = 0;
        $('table tr:gt(0)').each(function(){
            id++
            $(this).prepend('<td>'+id+'</td>');
        });
    }
    document.querySelector('#search_input_id').addEventListener('keyup',async (event)=>{
        let item = 'id'
        let input, filter, plan
        input = document.getElementById("search_input_id");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'id', id:filter})

        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        // console.assert(false, verifyItem)
        obj.querySelector('tbody').innerHTML = ''
        if(verifyItem){
            let itemSession  = await session['get']({type:'all'})
            obj.querySelector('tbody').innerHTML = ''
            if(itemsObject === undefined){
                for(let m in itemSession){
                        session['delete']({type:'item', key:itemSession[m]['id']})
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            }else{
                for(let m in itemSession){
                        let verify = false
                        if(itemsObject.length > 1){
                                for(let i =0; i < itemsObject.length;i++){
                                    if(itemSession[m]['id'] === itemsObject[i]['id']){
                                        let itemObject =  await templateItem(itemsObject[i])
                                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                                    }
                                }
                            }
                        else{
                            if(itemsObject['id'] === itemSession[m]['id']){
                                verify = true
                                let itemObject =  await templateItem(itemsObject)
                                session['set']({type:'item', key:`${itemsObject['id']}`, value:JSON.stringify(itemsObject)})
                                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                            }
                            if(verify === false){
                                session['delete']({type:'item', key:itemSession[m]['id']})
                            }
                        }

                    }
                }
                plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                for(let i =0; i < plan.length; i++){

                    await listener['set']({type:'plan', this:plan[i]})
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
        }else{

            obj.querySelector('tbody').innerHTML = ''
            await verify['clearn']({type:'sessionStorage'})
            if(itemsObject === undefined){
                itemsObject = await indexedDB['get']({type:'getAll', self: indexedDB})
                for(let i =0; i < itemsObject.length;i++){
                    let itemObject =  await templateItem(itemsObject[i])
                }
                plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                for(let i =0; i < plan.length; i++){

                    await listener['set']({type:'plan', this:plan[i]})
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
                // }
            }else{
                // console.assert(false, itemsObject, verifyItem)
                await verify['clearn']({type:'sessionStorage'})
                // obj.querySelector('tbody').innerHTML = ''
                if(itemsObject.length >1){
                    for(let i =0; i < itemsObject.length;i++){
                        let itemObject =  await templateItem(itemsObject[i])
                        session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                        obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                    }
                }else{

                    let itemObject =  await templateItem(itemsObject)
                    session['set']({type:'item', key:`${itemsObject['id']}`, value:JSON.stringify(itemsObject)})
                    obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                }
                plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                for(let i =0; i < plan.length; i++){

                    await listener['set']({type:'plan', this:plan[i]})
                }
                $('#maxRows').trigger('change');
                getPagination('#table-id');
            }
        }

    })
    document.querySelector('#search_input_City').addEventListener('change',async (event)=>{
        let item = 'city'
        let input, filter, plan
        let itemsObject = await indexedDB['get']({type:'index', index: `${item}`,filter:document.getElementById("search_input_City").value.toLowerCase()})
        filter = document.getElementById("search_input_City").value.toLowerCase()

        // console.assert(false, itemsObject)
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        switch (filter) {
            case '1':
                filter = 'москва'
                await verify['set']({type:'sessionStorage', key:item, value: -10})
                break
            case '2':
                filter = 'санкт-петербург'
                await verify['set']({type:'sessionStorage', key:item, value: -10})
                break
            default:
                filter =  "Все"
                await verify['set']({type:'sessionStorage', key:item, value: -9})
                break
        }
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){

            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length; i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
                for(let i =0; i < plan.length; i++){

                    await listener['set']({type:'plan', this:plan[i]})
                }
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_Developer').addEventListener('keyup',async (event)=>{

        let item = 'name'
        let input, filter, plan
        input = document.getElementById("search_input_Developer");
        filter = input.value.toLowerCase();
        // console.assert(false, filter)
        let itemsObject = await indexedDB['get']({type:'index', index: 'name',filter:filter})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''
        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }

        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }
        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_Object').addEventListener('keyup',async (event)=>{
        let item = 'object'
        let input, filter, plan
        input = document.getElementById("search_input_Object");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'object',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''
        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }

            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }
        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_Deadline').addEventListener('keyup',async (event)=>{
        let item = 'dateExperiences'
        let input, filter, plan, table, tr, td, i;
        input = document.getElementById("search_input_Deadline");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'dateExperiences',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }
        $('#maxRows').trigger('change');
        getPagination('#table-id');

    })
    document.querySelector('#search_input_houseClass').addEventListener('keyup',async (event)=>{
        let item = 'class'
        let input, filter, plan
        input = document.getElementById("search_input_houseClass");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'class',filter:filter})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');

    })
    document.querySelector('#search_input_houseType').addEventListener('keyup',async (event)=>{
        let item = 'type'
        let input, filter, plan
        input = document.getElementById("search_input_houseType");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'type',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_Metro').addEventListener('keyup',async (event)=>{
        let item = 'metro'
        let input, filter, plan
        input = document.getElementById("search_input_Metro");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'metro',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_geo').addEventListener('keyup',async (event)=>{
        let item = 'geo'
        let input, filter, plan
        input = document.getElementById("search_input_geo");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'geo',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''
        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
             plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
             plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }
        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_plan').addEventListener('keyup',async (event)=>{
        let item = 'plans'
        let input, filter, plan
        input = document.getElementById("search_input_plan");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'plans',filter:filter})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''
        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_price').addEventListener('keyup',async (event)=>{
        let item = 'price'
        let input, filter, plan
        input = document.getElementById("search_input_price");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'price',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_Finish').addEventListener('keyup',async (event)=>{
        let item = 'finish'
        let input, filter, plan
        input = document.getElementById("search_input_Finish");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'finish',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
    document.querySelector('#search_input_AdditionalInfo').addEventListener('keyup',async (event)=>{
        let item = 'description'
        let input, filter, plan
        input = document.getElementById("search_input_AdditionalInfo");
        filter = input.value.toLowerCase();
        let itemsObject = await indexedDB['get']({type:'index', index: 'description',filter:filter, self: indexedDB})
        let verifyItem = await verify['get']({type:'sessionStorage', item:item, length: filter.length})
        obj.querySelector('tbody').innerHTML = ''

        if(verifyItem){
            let keys =  Object.keys(sessionStorage)
            for(let i=0; i < keys.length; i++){
                if(keys[i].split('_').length > 1){
                }else{
                    let verify = false
                    for(let j =0; j < itemsObject.length; j++){

                        if(itemsObject[j]['id'] === keys[i]){
                            verify = true
                            let itemObject =  await templateItem(itemsObject[j])
                            obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
                        }
                    }
                    if(verify === false){
                        session['delete']({type:'item', key:keys[i]})
                    }
                }
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }else{
            await verify['clearn']({type:'sessionStorage'})
            for(let i =0; i < itemsObject.length;i++){
                let itemObject =  await templateItem(itemsObject[i])
                session['set']({type:'item', key:`${itemsObject[i]['id']}`, value:JSON.stringify(itemsObject[i])})
                obj.querySelector('tbody').insertAdjacentHTML('beforeend', itemObject);
            }
            plan = obj.querySelector('tbody').querySelectorAll('.search_input_plan')
            for(let i =0; i < plan.length; i++){

                await listener['set']({type:'plan', this:plan[i]})
            }
        }

        $('#maxRows').trigger('change');
        getPagination('#table-id');
    })
}