import events from '/static/html/components/lib-markdown/external/events.mjs'
import IDBFS from '/static/html/components/lib-markdown/external/wasm/idbfs.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Parser from '/static/html/components/component_modules/bundle/html2json/html2json.index.mjs'
import * as md2html from  '/static/html/components/lib-markdown/external/wasm/markdown.es.mjs'
export default async (v,p,c,obj,r) => {
    var _scriptDir = import.meta.url;
    let system = {
        ptr: {},
        worker_main: {}
    }
    console.log('~~~~_scriptDir~~~~~~~', _scriptDir)
    await md2html.ready
    let self = obj['this']['shadowRoot'].querySelector('.markdown__self')
    let md = await fetch('https://zababurinsv.github.io/markdown/index.md')
    let checkbox = obj['this']['shadowRoot'].querySelector('#markdown__string_menu_change-views')
    checkbox.checked = true
    md = await md.text();
    self.value = md

    system.worker_main = {
        "self":obj['this']['shadowRoot'].querySelector('.markdown__self'),
        "self.value": self.value,
        "src": false,
        "html": obj['this']['shadowRoot'].querySelector('.markdown__html'),
        "html.innerText": false,
        "html.iframe": false,
        "checkbox": obj['this']['shadowRoot'].querySelector('#markdown__string_menu_change-views'), 
        "checkbox.value": true, 
        "output":[],
        "markdown__string_views": obj['this']['shadowRoot'].querySelector('#markdown__string_views'),
        "event.target": false
    }
    const fsLoad = () => {
        return new Promise(async (resolve, reject) => {
            window.FS.syncfs(true , (err) => {
                console.log('file load')
                resolve()
            });
        })
    }
    const fsSave  = () => {
        return new Promise(async (resolve, reject) => {
            window.FS.syncfs(false , (err) => {
                console.log('file save')
                resolve()
            });
        })
    }
    window.onbeforeunload = () => { fsSave(); }
    let idbfs=await IDBFS({
        preInit() {},
        onRuntimeInitialized() {
            try {
                isEmpty(window.FS)? window.FS = this.FS:window.FS 
                const fsSetup = path => {
                    this.FS.mkdir(path);
                    this.FS.mount(this.FS.filesystems.IDBFS, {}, path);
                };
                fsSetup("/data");
            } catch (e) {
                console.error('error', e)
            }
        },
        print: d => system.worker_main["output"].push(d),
    })
   async function selected(event) {
        event.preventDefault()
        let md = await fetch(`${location.origin}/markdown/${event.target.value}.md`)  
        md = await md.text()
        system.worker_main["self"].innerText = md 
        system.worker_main["self"].value = md
        updateUI()
    }
    function download() {
        let name = prompt('Введите название файла', 'default');
        let dir = idbfs.FS.readdir("/data")  
        let filename = `${name}.md`
        let text = ''
        if(dir.find(item => item === 'data.md')) {
            text =  idbfs.FS.readFile("/data/data.md",{ encoding: "utf8" });
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
            system.worker_main["self"].innerText = reader.result 
            system.worker_main["self"].value = reader.result 
            updateUI()
          };
        
          reader.onerror = function() {
            console.log(reader.error);
          };
    }
    function markdownToHTML(markdown) {
        system.worker_main["output"]  = [];
        idbfs.FS.writeFile('/data/data.md',markdown)
        system.worker_main["output"] = md2html.parse(markdown)
        return system.worker_main["output"];
    }
    function saveMd () {
        return new Promise(async (resolve, reject) => { 
            system.worker_main["output"] = markdownToHTML(self.value);
            system.worker_main["html"].innerHTML = system.worker_main["output"];
            system.worker_main["html.innerText"] = system.worker_main["html"].querySelector('code').innerText;
            system.worker_main["src"] = 'data:text/html;charset=utf-8,' + encodeURIComponent(system.worker_main["html.innerText"])
            
            // console.assert(false, system.worker_main["html.innerText"])
            if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
                system.worker_main["markdown__string_views"].querySelector('iframe').remove()
            }
            system.worker_main["html.iframe"] = document.createElement('iframe');
            system.worker_main["html.iframe"].src = system.worker_main["src"] 
            system.worker_main["html.iframe"].width = "100%";
            system.worker_main["html.iframe"].height = "100%";
            system.worker_main["html.iframe"].style.border = "0";
            system.worker_main["html.iframe"].style.frameBorder = "0";
            system.worker_main["html.iframe"].sandbox = "allow-scripts";
            system.worker_main["markdown__string_views"].appendChild(system.worker_main["html.iframe"])
            system.worker_main["markdown__string_views"].style.height = '60vw'
            resolve(fsSave()) 
        })

        // if(htmlstr.querySelector('iframe')) {
            // htmlstr.querySelector('iframe').remove()
        // }
        // var iframe = document.createElement('iframe');
        // iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html.querySelector('code').innerText)
        // iframe.width = "100%";
        // iframe.height = "100%";
        // iframe.sandbox = "allow-scripts";
        // htmlstr.appendChild(iframe);
        // htmlstr.style.height = '115vw'
        // htmlstr.insertAdjacentHTML('afterend', `${html.innerHTML}`)
        // htmlstr.innerText = Parser.json(Parser.parse(html.innerHTML))
     
    }
    function markdown__string_menu_change_true(event) {
        system.worker_main["markdown__string_views"].innerHTML = ''
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
        system.worker_main["html.iframe"] = document.createElement('iframe');
        system.worker_main["html.iframe"].src = system.worker_main["src"] 
        system.worker_main["html.iframe"].width = "100%";
        system.worker_main["html.iframe"].height = "100%";
        system.worker_main["html.iframe"].style.border = "0";
        system.worker_main["html.iframe"].style.frameBorder = "0";
        system.worker_main["html.iframe"].sandbox = "allow-scripts";
        system.worker_main["markdown__string_views"].appendChild(system.worker_main["html.iframe"])
        system.worker_main["markdown__string_views"].style.height = '60vw'
    }
    function markdown__string_menu_change_false(event) {
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
        let json = Parser.parse(system.worker_main.output)
        let key = json.findIndex(item => item.tagName === 'pre')
        json[key]['children'][0]['children'][0]['content'] = Parser.parse(system.worker_main["html.innerText"])
        system.worker_main["markdown__string_views"].innerText = Parser.json(json)
        system.worker_main["markdown__string_views"].style.height = 'auto'
     
    }
    let updateUI = async (event = {}) => {
        system.ptr = system.worker_main
        system.worker_main["event.target"] = event.target
        if(!isEmpty(event.target)) {
            if(event.target.tagName !== 'SELECT' && event.target.tagName !== 'INPUT') {
                console.log('ddddddddddddddddd')
                saveMd()
            } else {
                switch(event.target.tagName) {
                        case"INPUT":
                        system.worker_main['checkbox.value'] = event.target.checked
                        system.worker_main['checkbox.value']
                        ? markdown__string_menu_change_true()
                        : markdown__string_menu_change_false()
                        // console.assert(false, system)
                        
                        // var iframe = document.createElement('iframe');
                        // iframe.src = 
                        // iframe.width = "100%";
                        // iframe.height = "100%";
                        // iframe.sandbox = "allow-scripts";
                        // htmlstr.appendChild(iframe);
                        // htmlstr.style.height = '115vw'
                        // let htmlout = document.createElement('html')
                        // htmlout.insertAdjacentHTML('afterbegin', )
                        // console.log('ddddddddddddddddd', htmlout)  
                        // htmlstr.shadowRoot.appendChild(htmlout)
                        // console.log('ddddddddddddddddd', html)  
                        // htmlstr.shadowRoot.
                        // event.target.checked 
                            // ?(
                                //  = ,
                                // htmlstr.shadowRoot.insertAdjacentHTML('afterbegin', html.querySelector('code').innerHTML)
                            // ) 
                            // :(
                                // htmlstr.shadowRoot.innerText = Parser.json(Parser.parse(html.innerHTML))
                            // )
                            // console.log('event.target.dataset', event.target.dataset.value, event.target.id, event.target.checked)
                            break
                        default:
                            break
                }
            }
        } else {
            await saveMd()
            console.assert(true, system)
        }
    }
    await fsLoad()
    let dir = idbfs.FS.readdir("/data")  
    if(dir.find(item => item === 'data.md')) {
        let mdfs =  idbfs.FS.readFile("/data/data.md",{ encoding: "utf8" });
        if(!isEmpty(mdfs)) { self.value = mdfs }
    }
    updateUI()
    obj.this.shadowRoot.querySelector('.markdown').addEventListener("input", updateUI);
    obj.this.shadowRoot.querySelector('.markdown__button_download').addEventListener("click", download);
    obj.this.shadowRoot.querySelector('.markdown__button_upload').addEventListener("change", upload);
    obj.this.shadowRoot.querySelector('.markdown__button_select').addEventListener("change", selected);
}