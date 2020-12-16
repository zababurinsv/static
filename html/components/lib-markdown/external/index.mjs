import events from '/static/html/components/lib-markdown/external/events.mjs'
import IDBFS from '/static/html/components/lib-markdown/external/wasm/idbfs.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Parser from '/static/html/components/component_modules/bundle/html2json/html2json.index.mjs'
import * as md2html from  '/static/html/components/lib-markdown/external/wasm/markdown.es.mjs'
import task from '/static/html/components/component_modules/heap/index.mjs'
export default async (v,p,c,obj,r) => {
    const target = []

    let handler = {
        get: function(obj, prop) {
            console.log('proxy-body-get', {
                obj:obj,
                prop:prop
            })
            return obj[prop];
        },
        set: function(obj, prop, value) {
            obj[prop] = value;
            console.log('proxy-body-set', prop ,value )
            switch (prop) {
                case 'length':
                    if(obj.length === 1){
                        let timerId = setTimeout(async function tick() {
                            if(obj.length === 0){
                                console.log('proxy-body-end')
                                clearTimeout(timerId);
                            }else{
                                console.log('proxy-body-all',obj, obj.length)
                                console.log('proxy-body-now',obj[0])
                                obj.shift()
                                timerId = setTimeout(tick, 10);
                            }
                        }, 0);
                    }
                    break
                default:
                    break
            }
            return true

        }
    }
    
    let backJson = (json) => {
        return new Promise( async (resolve, reject)=>{
            let Json = await fetch(`${location.origin}/static/html/components/lib-markdown/external/${(json)?json:'index'}.json`)
            try {
                Json = await Json.json()
            } catch(e) {
                Json = {
                    status: false,
                    ok: false,
                    error:e
                }
            }
            resolve(Json)
        })
    }

    await md2html.ready
    let system = {
        _scriptDir: import.meta.url,
        ptr: {},
        worker_main: {},
        validation: {
            key: (...args) =>{ return validation.value },
            value: { onhashchange:("onhashchange" in window)}
        },
        pull: {
            "resolve": async (item) => {
                let pull = {}
                try {
                    pull = await fetch(`https://zababurinsv.github.io/markdown/${item? item: 'index'}.md`)
                        .catch((e)=>{
                            console.warn({ "error":e })
                        })
                    if(pull.status === 404) {
                        return false
                    } else {
                        pull = await pull.text();
                        system.value = pull
                        return pull
                    }
                }catch (e) {
                    return false
                }

            },
            "orbitdb": async (item) => {
                let pull = {}
                try {
                    let dir = window.zb.fs['/body'].readdir("/body")
                    if(dir.find(item => item === 'external.md')) {
                        let mdfs = window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/external.md",{ encoding: "utf8" });
                        if(!isEmpty(mdfs)) {
                            system.value = mdfs
                        } else {
                            system.worker_main["md"]= "# Empty"
                            system.worker_main["markdown__self"].value= "# Empty"
                            system.worker_main["self.value"]= "# Empty"
                        }
                    } else {
                        pull = await task.set(true,'t','green',{
                            _:'get orbitdb',
                            item: (item)?item:'external'
                        },'/orbitdb')
                        if(pull.status === 'ok') {
                            system.value = pull.md[0]['md']
                            return pull
                        } else {
                            return false
                        }
                    }
                }catch (e) {
                    return false
                }
            }
        },
        location: location,
        value: {},
        json: {
            "ok":false,
            "status":false,
            "type": "main",
            "tagName": " main-html",
            "attributes": [{ "key": "href", "value": "#" }],
            "swap":[],
            "children": await backJson()
        },
        proxy: new Proxy(target, handler)
    }

    let hash = async (event) => {
        if(!isEmpty(location.hash)){
            switch (location.hash) {
                case '#external':
                    await system.pull.orbitdb(system.location.hash.replace('#', ''))
                    break
                default:
                    await system.pull.resolve(system.location.hash.replace('#', ''))
                    break
            }
            location.hash = ''
            system.worker_main["markdown__string_views"].innerHTML = ''
            system.worker_main["md"]= system.value
            system.worker_main["markdown__self"].value= system.value
            system.worker_main["self.value"]= system.value
            updateUI()
        }
    }
    system.json.ok = true; 
    system.json.status = true; 
    system.json.children.view = system.json.children.isMainThread.find(element => {
        if(element.type === "element" && element.tagName === "h1") {
            if(`#${element.children[1].content}` === system.location.hash) {
                console.log('~~~~~~~~~~~',system.location.hash, element.children[0])
                return true
            }
        }
    });
    system.worker_main = {
        "self.value": await system["pull"]["resolve"](),
        "src": false,
        "markdown__self":obj['this']['shadowRoot'].querySelector('.markdown__self'),
        "markdown__self_menu": obj['this']['shadowRoot'].querySelector('.markdown__self_menu'),
        "markdown__self_menu_aside_0": obj['this']['shadowRoot'].querySelector('#markdown__self_menu_aside_0'),
        "markdown__self_menu_aside_1": obj['this']['shadowRoot'].querySelector('#markdown__self_menu_aside_1'),
        "markdown__self_html": obj['this']['shadowRoot'].querySelector('.markdown__self_html'),
        "markdown__html": obj['this']['shadowRoot'].querySelector('.markdown__html'),
        "markdown__html.iframe": false,
        "fs": undefined,
        "fs.path": undefined,
        "checkbox": obj['this']['shadowRoot'].querySelector('#markdown__string_menu_change-views'), 
        "checkbox.checked": true, 
        "output":[],
        "markdown__string_menu":obj['this']['shadowRoot'].querySelectorAll('.markdown__string_menu'),
        "markdown__string_views": obj['this']['shadowRoot'].querySelector('#markdown__string_views'),
        "event.target": false
    }
    
    if(isEmpty(system.json.children.view) && !isEmpty(system.location.hash)) {
        system.validation.value.fsRead = true
        system.validation.value.hashRead = false
    } else {
        if(isEmpty(system.json.children.view) && isEmpty(system.location.hash)) {
            system.validation.value.fsRead = true
            system.validation.value.hashRead = false
        } else {
            system.validation.value.hashRead = true
            system.validation.value.fsRead = false
        }
    }
    system.worker_main.markdown__self_menu_aside_0.innerHTML = ''
    system.worker_main.markdown__self_menu_aside_0.innerHTML = Parser.stringify(system.json.children.isMainThread)
    system.worker_main.markdown__self_menu_aside_1.innerHTML = ''
    system.worker_main.markdown__self_menu_aside_1.innerHTML = Parser.stringify(system.json.children.isMainThread)
    system.json.children.isMainThread.forEach(element => {
        switch(element.type) {
            case"element":
                system.worker_main.markdown__self_menu_aside_0.querySelector(`#${element.attributes[0].value}`).addEventListener('click',async (event) =>{
                    event.preventDefault();
                    location.hash = `#${event.target.id}`;
                })
                system.worker_main.markdown__self_menu_aside_1.querySelector(`#${element.attributes[0].value}`).addEventListener('click',async (event) =>{
                    event.preventDefault();
                    location.hash = `#${event.target.id}`;
                })
                break
            default:
                break
        }
    });

    const fsLoad = () => {
        return new Promise(async (resolve, reject) => {
            window.zb.fs[`${system.worker_main['fs.path']}`].syncfs(true , (err) => {
                console.log('file load')
                resolve()
            });
        })
    }
    const fsSave  = () => {
        return new Promise(async (resolve, reject) => {
            window.zb.fs[`${system.worker_main['fs.path']}`].syncfs(false , (err) => {
                console.log('file save')
                resolve()
            });
        })
    }
    window.onbeforeunload = () => { fsSave(); }
    await IDBFS({
        preInit() {  },
        onRuntimeInitialized() {
            try {
                if(isEmpty(window.zb)) { window.zb = {}; window.zb.fs = {} }
                const fsSetup = path => {
                    system.worker_main['fs.path'] = path
                    window.zb.fs[`${path}`] = this.FS 
                    window.zb.fs[`${path}`].mkdir(path);
                    window.zb.fs[`${path}`].mount(window.zb.fs[`${path}`].filesystems.IDBFS, {}, path);
                };
                fsSetup("/body");
            } catch (e) {
                console.error('error', e)
            }
        },
        print: d => system.proxy.push(d),
    })
   async function selected(event) {
        event.preventDefault()
        system.worker_main["md"] = await fetch(`${location.origin}/markdown/${event.target.value}.md`)
        .catch((e)=>{
            console.warn({
                "error":e
            })
            return undefined
        })
        if(!isEmpty(system.worker_main["md"])) {
            system.worker_main["md"] = await system.worker_main["md"].text()
        } else {
            let dir = window.zb.fs[`${system.worker_main['fs.path']}`].readdir("/body")
            if(dir.find(item => item === 'data.md')) {
                let mdfs =  window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
                if(!isEmpty(mdfs)) {
                    system.worker_main["md"]= mdfs
                    system.worker_main["markdown__self"].value= mdfs
                    system.worker_main["self.value"]= mdfs 
                }
            } else {
                system.worker_main["md"]="# Empty"
            }
        }
        system.worker_main["markdown__self"].value = system.worker_main["md"]
        system.worker_main["self.value"] = system.worker_main["md"]
        system.worker_main["checkbox.checked"] = true        
        updateUI()
    }
    function download() {
        let name = prompt('Введите название файла', 'default');
        let dir = window.zb.fs[`${system.worker_main['fs.path']}`].readdir("/body")  
        let filename = `${name}.md`
        let text = ''
        if(dir.find(item => item === 'data.md')) {
            text =  window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
        }
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    function upload(event) {
        console.log(event.path[0].files[0])
        let reader = new FileReader();
        reader.readAsText(event.path[0].files[0]);
        reader.onload = function() {
            system.worker_main["markdown__string_views"].innerHTML = ''
            system.worker_main["md"]= reader.result
            system.worker_main["markdown__self"].value= reader.result
            system.worker_main["self.value"]= reader.result
            updateUI()
          };
          reader.onerror = function() {
            console.log(reader.error);
          };
    }
    function changeViews(event) {
        if(event.target.checked) {
            system.worker_main["markdown__self_html"].innerHTML = ''
            system.worker_main["markdown__self_html"].style.display = "none"
            system.worker_main["markdown__self_menu"].style.display = "grid"
            system.worker_main["markdown__self"].style.display = "block"
            system.worker_main["markdown__html"].style.display = "block"
            system.worker_main["markdown__string_menu"][1].style.display = "flex"
            system.worker_main["markdown__self_menu_aside_0"].style.display = "block"
            system.worker_main["markdown__self_menu_aside_1"].style.display = "block"
        } else {
            system.worker_main["markdown__self_html"].innerHTML = ''
            system.worker_main["markdown__self_html"].innerHTML = system.worker_main['markdown__html'].innerHTML
            system.worker_main["markdown__self_html"].style.display = "flex"
            system.worker_main["markdown__self_menu"].style.display = "flex"
            system.worker_main["markdown__self_menu"].style.height = "auto"
            system.worker_main["markdown__self"].style.display = "none"
            system.worker_main["markdown__html"].style.display = "none"
            system.worker_main["markdown__string_menu"][1].style.display = "none"
            system.worker_main["markdown__self_menu_aside_0"].style.display = "none"
            system.worker_main["markdown__self_menu_aside_1"].style.display = "none"
        }
    }
    function markdownToHTML(markdown) {
        system.worker_main["output"]  = [];
        window.zb.fs[`${system.worker_main['fs.path']}`].writeFile('/body/data.md',markdown)
        system.worker_main["output"] = md2html.parse(markdown)
        return system.worker_main["output"];
    }
    function markdown__string_menu_change_true(event) {
        console.log('~~~~~~~~~~markdown__string_menu_change_true~~~~~~~~~~', event)
        system.worker_main["markdown__string_views"].innerHTML = ''
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
        system.worker_main["markdown__html"].innerHTML = ''
        system.worker_main["markdown__html"].innerHTML = system.worker_main['markdown__html.innerHTML']
        system.worker_main["markdown__html"].style.whiteSpace = "initial"
        system.worker_main["markdown__html.iframe"] = document.createElement('iframe');
        system.worker_main["markdown__html.iframe"].src = system.worker_main["src"] 
        system.worker_main["markdown__html.iframe"].width = "100%";
        system.worker_main["markdown__html.iframe"].height = "100%";
        system.worker_main["markdown__html.iframe"].style.border = "0";
        system.worker_main["markdown__html.iframe"].style.frameBorder = "0";
        system.worker_main["markdown__html.iframe"].sandbox = "allow-scripts";
        system.worker_main["markdown__string_views"].appendChild(system.worker_main["markdown__html.iframe"])
        system.worker_main["markdown__string_views"].style.height = '75vw'
        system.worker_main["markdown__string_views"].style.whiteSpace = "initial"
    }
    function markdown__string_menu_change_false(event) {
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
        let json = {
            code: Parser.parse(system.worker_main['markdown__html.code']),
            html: Parser.parse(system.worker_main['markdown__html.innerHTML'])
        }
        system.worker_main["markdown__html"].innerHTML = ''
        system.worker_main["markdown__html"].innerText = Parser.json(json.html)
        system.worker_main["markdown__html"].style.whiteSpace = "pre-wrap"
        system.worker_main["markdown__string_views"].style.height = 'auto'
        system.worker_main["markdown__string_views"].style.color = '#0b6546'
        system.worker_main["markdown__string_views"].style.whiteSpace = "pre-wrap"
        system.worker_main["markdown__string_views"].innerText = Parser.json(json.code)
    }
    function asideitems (items = Array, item, id) {
        for(let self of items) {
            let h1save = {}
            let section = document.createElement('section')
            section.classList.add(`${id}__list`);
            section.classList.add(`aside-menu`);
            // console.assert(false,items,  isEmpty(item),id )
            if(!isEmpty(item)) {
                for(let paragraph of item) {
                    paragraph.addEventListener("click", async (event) => {
                        system.worker_main["markdown__html"].querySelector(`#${event.target.querySelector('a').id}`).scrollIntoView({block: "start", behavior: "smooth"})
                    }, false);
                    section.prepend(paragraph)
                }

                if(!isEmpty(self)) {
                    h1save = self.cloneNode(true)
                    system.worker_main["markdown__self_menu_aside_1"].innerHTML = ''
                    system.worker_main["markdown__self_menu_aside_1"].appendChild(h1save)
                    system.worker_main["markdown__self_menu_aside_1"].appendChild(section)
                } else {
                    let component_h1 = document.createElement('h1')
                    let component_a = document.createElement('a')
                    let component_text = system.worker_main['markdown__html'].querySelector('h1').innerText
                    component_h1.id = id
                    component_h1.innerText = isEmpty(component_text)?'external': component_text
                    component_a.setAttribute('aria-hidden', true)
                    component_a.href = `#${id}`
                    component_h1.appendChild(component_a)
                    system.worker_main["markdown__self_menu_aside_1"].innerHTML = ''
                    system.worker_main["markdown__self_menu_aside_1"].appendChild(component_h1)
                    system.worker_main["markdown__self_menu_aside_1"].appendChild(section)
                }
            } else {
                if(!isEmpty(self)) {
                    h1save = self.cloneNode(true)
                    system.worker_main["markdown__self_menu_aside_1"].innerHTML = ''
                    system.worker_main["markdown__self_menu_aside_1"].appendChild(h1save)
                } else {
                    let component_h1 = document.createElement('h1')
                    let component_a = document.createElement('a')
                    let component_text = system.worker_main['markdown__html'].querySelector('h1').innerText
                    component_h1.id = id
                    component_h1.innerText = isEmpty(component_text)?'external': component_text
                    component_a.setAttribute('aria-hidden', true)
                    component_a.href = `#${id}`
                    component_h1.appendChild(component_a)
                    system.worker_main["markdown__self_menu_aside_1"].innerHTML = ''
                    system.worker_main["markdown__self_menu_aside_1"].appendChild(component_h1)
                }
            }
        }
        return true
    }
    function ucFirst(str) {
        if (!str) return str;
        return str[0].toLowerCase() + str.slice(1);
    }
    function saveMd () {
        return new Promise(async (resolve, reject) => {
            let code = {}
            system.worker_main["markdown__self"].innerHTML = system.worker_main["self.value"];
            system.worker_main["output"] = markdownToHTML(system.worker_main["self.value"]);
            system.worker_main["markdown__html"].innerHTML = system.worker_main["output"];
            code = {}
            code.innerText = '<pre></pre>'
            if(!isEmpty(system.worker_main["markdown__html"].querySelector('code'))) {
                code = system.worker_main["markdown__html"].querySelector('code').cloneNode(true)
                system.worker_main["markdown__html"].querySelector('code').remove()
            }
            let tags = system.worker_main["markdown__html"].children
            let h1 = {}
            let h = []
            let countH1 = 0
            for(let i =0; i < tags.length; i++ ) {
                if(tags[i].tagName === 'H1') {
                    if(tags[i].children.length !== 0){
                        let str = ucFirst(tags[i].innerText.replace(/\s/g, ''))
                        tags[i].querySelector('a').id = str
                        if(countH1 === 0) {
                            h1 = tags[i].querySelector('a').id
                            countH1++
                        } else {
                            if(tags[i].children.length !== 0){
                                let str = ucFirst(tags[i].innerText.replace(/\s/g, ''))
                                tags[i].querySelector('a').id = str
                                h.unshift(tags[i].cloneNode(true))
                            } else {
                                h.unshift(tags[i].cloneNode(true))
                            }
                        }
                    }
                } else {
                    if(tags[i].tagName === 'H2' || tags[i].tagName === 'H3' || tags[i].tagName === 'H4' || tags[i].tagName === 'H5' ||tags[i].tagName === 'H6') {
                        if(tags[i].children.length !== 0){
                            let str = ucFirst(tags[i].innerText.replace(/\s/g, ''))
                            tags[i].querySelector('a').id = str
                            h.unshift(tags[i].cloneNode(true))
                        } else {
                            h.unshift(tags[i].cloneNode(true))
                        }
                    }
                }
            }
            if(isEmpty(h1)) {
                h1 = "aside"
            }
            let section_1 = system.worker_main["markdown__self_menu_aside_0"].querySelectorAll('section')
            let section_2 = system.worker_main["markdown__self_menu_aside_1"].querySelectorAll('section')

            if(section_1.length !== 0) {
                for (let i =0;i < section_1.length;i++){
                    section_1[i].parentNode.removeChild(section_1[i])
                }
            }
            if(section_2.length !== 0) {
                for (let i =0;i < section_2.length;i++){
                    section_2[i].parentNode.removeChild(section_2[i])
                }
            }
            // console.assert(false, h1 )
            if(h1 === 'aside') {
                asideitems([
                    [system.worker_main["markdown__self_menu_aside_0"]],
                ], h, h1)
            } else {
                asideitems(
                  [system.worker_main["markdown__self_menu_aside_0"].querySelector(`#${h1}`)],
                  h,
                  h1
                )
            }
            system.worker_main["markdown__html.code"] = code.innerText;
            system.worker_main["markdown__html.innerHTML"] = system.worker_main["markdown__html"].innerHTML;
            system.worker_main["src"] = 'data:text/html;charset=utf-8,' + encodeURIComponent(system.worker_main["markdown__html.code"])
            if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
                system.worker_main["markdown__string_views"].querySelector('iframe').remove()
            }
            system.worker_main["markdown__html.iframe"] = document.createElement('iframe');
            system.worker_main["markdown__html.iframe"].src = system.worker_main["src"] 
            system.worker_main["markdown__html.iframe"].width = "100%";
            system.worker_main["markdown__html.iframe"].height = "100%";
            system.worker_main["markdown__html.iframe"].style.border = "0";
            system.worker_main["markdown__html.iframe"].style.frameBorder = "0";
            system.worker_main["markdown__html.iframe"].sandbox = "allow-scripts";
            system.worker_main["markdown__string_views"].appendChild(system.worker_main["markdown__html.iframe"]);
            (code.innerText === '<pre></pre>')
            ? system.worker_main["markdown__string_views"].style.height = 'auto'
            : system.worker_main["markdown__string_views"].style.height = '75vw'
            system.worker_main["markdown__self_html"].innerHTML = system.worker_main["markdown__html"].innerHTML;
            system.worker_main["markdown__string_menu"][0].scrollIntoView()
            resolve(fsSave())
        })
    }
    let updateUI = async (event = {}) => {
        system.ptr = system.worker_main
        system.worker_main["event.target"] = event.target
        if(!isEmpty(event.target)) {
            if(event.target.tagName !== 'SELECT' && event.target.tagName !== 'INPUT') {
                switch(event.target.tagName) {
                    case"TEXTAREA":
                    system.worker_main["src"] = 'data:text/html;charset=utf-8,' + encodeURIComponent(system.worker_main["markdown__html.code"])
                    system.worker_main["self.value"] = event.target.value
                        break
                    default:
                        break
                }
               await saveMd()
            } else {
                switch(event.target.tagName) {
                        case"INPUT":
                        switch(event.target.id) {
                            case'markdown__button_views':
                                changeViews(event)
                                break
                            default:
                                system.worker_main['checkbox.checked'] = event.target.checked
                                system.worker_main['checkbox.checked']
                                ? markdown__string_menu_change_true('updateUI')
                                : markdown__string_menu_change_false('updateUI')
                                break
                        }
                            break
                        default:
                            console.log('input', event.target)
                            break
                }
            }
        } else {
            await saveMd()
        }
    }
    await fsLoad()
    if(system.validation.value.fsRead) {
        let dir = window.zb.fs[`${system.worker_main['fs.path']}`].readdir("/body")  
        if(dir.find(item => item === 'data.md')) {
            let mdfs = window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
            if(!isEmpty(mdfs)) {
                system.worker_main["md"]= mdfs
                system.worker_main["markdown__self"].value= mdfs
                system.worker_main["self.value"]= mdfs
                updateUI()
            } else {
                system.worker_main["md"]= "# Empty"
                system.worker_main["markdown__self"].value= "# Empty"
                system.worker_main["self.value"]= "# Empty"
            }
        } else {
            system.worker_main["md"]= "# Empty"
            system.worker_main["markdown__self"].value= "# Empty"
            system.worker_main["self.value"]= "# Empty"
        }
    } else {
        if(system.validation.value.hashRead) { hash() } else {
            updateUI()
        }
    }
   async function update(event) {
       let status = await task.set(true,'','red',system['worker_main']['markdown__self'].innerHTML, '/orbitdb/set/:external')
    }

    async function query(event) {
        let res = await task.set(true,'','red',system['worker_main']['markdown__self'].innerHTML, '/orbitdb/get/:external')
        if(res.status === 'ok') {
            window.zb.fs['/body'].writeFile("/body/external.md", res['md'][0]['md'])
            // window.zb.fs['/body'].syncfs(false, err => console.warn(err));
            location.hash = 'external';
        }

    }

    window.addEventListener("hashchange", hash, false);
    obj.this.shadowRoot.querySelector('.markdown').addEventListener("input", updateUI);
    obj.this.shadowRoot.querySelector('.markdown__button_update').addEventListener("click", update);
    obj.this.shadowRoot.querySelector('.markdown__button_query').addEventListener("click", query);
    obj.this.shadowRoot.querySelector('.markdown__button_download').addEventListener("click", download);
    obj.this.shadowRoot.querySelector('.markdown__button_upload').addEventListener("change", upload);
    obj.this.shadowRoot.querySelector('.markdown__button_select').addEventListener("change", selected);
}