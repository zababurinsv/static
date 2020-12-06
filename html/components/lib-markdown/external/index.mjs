import events from '/static/html/components/lib-markdown/external/events.mjs'
import IDBFS from '/static/html/components/lib-markdown/external/wasm/idbfs.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Parser from '/static/html/components/component_modules/bundle/html2json/html2json.index.mjs'
import * as md2html from  '/static/html/components/lib-markdown/external/wasm/markdown.es.mjs'
export default async (v,p,c,obj,r) => {
    await md2html.ready
    function hashtag(text) {
        var repl = text.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<a style = "color: #35ab52">$2</a>');
        return(repl);
    }
    let system = {
        ptr: {},
        worker_main: {},
        _scriptDir: import.meta.url
    }

    let tag = hashtag(window.location.hash)
    if(isEmpty(tag)) {
        tag = undefined
    } else {
        tag = window.location.hash
        tag = tag.replace('#','')
    }
    let isLoading = {
        window: false,
        dir: false
    }
    let self = {
        "pull": {
            "resolve":  await fetch(`https://zababurinsv.github.io/markdown/${tag? tag: 'index'}.md`).catch((e)=>{
                console.warn({
                    "error":e
                })
                return undefined

            })
        },
        "value": ''
         
    }
    if(!isEmpty(self["pull"]["resolve"])) {
        self["value"] = await self["pull"]["resolve"].text()
    } else {
        self["value"] = "# Empty"
    }
    system.worker_main = {
        "self":obj['this']['shadowRoot'].querySelector('.markdown__self'),
        "self.value": self["value"],
        "src": false,
        "html": obj['this']['shadowRoot'].querySelector('.markdown__html'),
        "html.innerText": false,
        "html.iframe": false,
        "fs": undefined,
        "fs.path": undefined,
        "checkbox": obj['this']['shadowRoot'].querySelector('#markdown__string_menu_change-views'), 
        "checkbox.checked": true, 
        "output":[],
        "markdown__string_views": obj['this']['shadowRoot'].querySelector('#markdown__string_views'),
        "event.target": false
    }
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
        print: d => system.worker_main["output"].push(d),
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
         
            console.assert(false, dir)
            if(dir.find(item => item === 'data.md')) {
                let mdfs =  window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
                if(!isEmpty(mdfs)) {
                    system.worker_main["md"]= mdfs
                    system.worker_main["self"].value= mdfs
                    system.worker_main["self.value"]= mdfs 
                }
            } else {
                system.worker_main["md"]="# Empty"
            }
        }
      
        system.worker_main["self"].value = system.worker_main["md"]
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
            system.worker_main["self"].value= reader.result
            system.worker_main["self.value"]= reader.result
            updateUI()
          };
          reader.onerror = function() {
            console.log(reader.error);
          };
    }
    function markdownToHTML(markdown) {
        system.worker_main["output"]  = [];
        window.zb.fs[`${system.worker_main['fs.path']}`].writeFile('/body/data.md',markdown)
        system.worker_main["output"] = md2html.parse(markdown)
        return system.worker_main["output"];
    }
    function markdown__string_menu_change_true(event) {
        system.worker_main["markdown__string_views"].innerHTML = ''
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
        system.worker_main["html"].innerHTML = ''
        system.worker_main["html"].innerHTML = system.worker_main['html.innerHTML']
        system.worker_main["html"].style.whiteSpace = "initial"
        system.worker_main["html.iframe"] = document.createElement('iframe');
        system.worker_main["html.iframe"].src = system.worker_main["src"] 
        system.worker_main["html.iframe"].width = "100%";
        system.worker_main["html.iframe"].height = "100%";
        system.worker_main["html.iframe"].style.border = "0";
        system.worker_main["html.iframe"].style.frameBorder = "0";
        system.worker_main["html.iframe"].sandbox = "allow-scripts";
        system.worker_main["markdown__string_views"].appendChild(system.worker_main["html.iframe"])
        system.worker_main["markdown__string_views"].style.height = '60vw'
        system.worker_main["markdown__string_views"].style.whiteSpace = "initial"
    }
    function markdown__string_menu_change_false(event) {
        if(system.worker_main["markdown__string_views"].querySelector('iframe')) {
            system.worker_main["markdown__string_views"].querySelector('iframe').remove()
        }
      
        let json = {
            code: Parser.parse(system.worker_main['html.code']),
            html: Parser.parse(system.worker_main['html.innerHTML'])
        }
        system.worker_main["html"].innerHTML = ''
        system.worker_main["html"].innerText = Parser.json(json.html)
        system.worker_main["html"].style.whiteSpace = "pre-wrap"
        system.worker_main["markdown__string_views"].style.height = 'auto'
        system.worker_main["markdown__string_views"].style.color = '#0b6546'
        system.worker_main["markdown__string_views"].style.whiteSpace = "pre-wrap"
        system.worker_main["markdown__string_views"].innerText = Parser.json(json.code)
    }
    function saveMd () {
        return new Promise(async (resolve, reject) => { 
            // console.assert(false, system.worker_main["self.value"])
            let code = {}
            system.worker_main["self"].innerHTML = system.worker_main["self.value"];
            system.worker_main["output"] = markdownToHTML(system.worker_main["self.value"]);
            system.worker_main["html"].innerHTML = system.worker_main["output"];
            code = {}
            code.innerText = '<pre></pre>'
            if(!isEmpty(system.worker_main["html"].querySelector('code'))) {
                code = system.worker_main["html"].querySelector('code').cloneNode(true)
                system.worker_main["html"].querySelector('code').remove()
            }
            system.worker_main["html.code"] = code.innerText;
            system.worker_main["html.innerHTML"] = system.worker_main["html"].innerHTML;
            system.worker_main["src"] = 'data:text/html;charset=utf-8,' + encodeURIComponent(system.worker_main["html.code"])
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
            system.worker_main["markdown__string_views"].appendChild(system.worker_main["html.iframe"]);
            (code.innerText === '<pre></pre>')
            ? system.worker_main["markdown__string_views"].style.height = 'auto'
            : system.worker_main["markdown__string_views"].style.height = '60vw'
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
                    system.worker_main["html.innerText"] = system.worker_main["html"].innerText
                    system.worker_main["src"] = 'data:text/html;charset=utf-8,' + encodeURIComponent(system.worker_main["html.code"])
                    system.worker_main["self.value"] = event.target.value
                        break
                    default:
                        break
                }
               await saveMd()
            } else {
                switch(event.target.tagName) {
                        case"INPUT":
                        system.worker_main['checkbox.checked'] = event.target.checked
                        system.worker_main['checkbox.checked']
                        ? markdown__string_menu_change_true()
                        : markdown__string_menu_change_false()
                            break
                        default:
                            break
                }
            }
        } else {
            await saveMd()
        }
    }
    await fsLoad()
    if(tag === undefined || !self.pull.resolve.ok) {
        let dir = window.zb.fs[`${system.worker_main['fs.path']}`].readdir("/body")  
        if(dir.find(item => item === 'data.md')) {
            let mdfs = window.zb.fs[`${system.worker_main['fs.path']}`].readFile("/body/data.md",{ encoding: "utf8" });
            if(!isEmpty(mdfs)) {
                system.worker_main["md"]= mdfs
                system.worker_main["self"].value= mdfs
                system.worker_main["self.value"]= mdfs 
            } else {
                system.worker_main["md"]= "# Empty"
                system.worker_main["self"].value= "# Empty"
                system.worker_main["self.value"]= "# Empty"
            }
        } else {
            system.worker_main["md"]= "# Empty"
            system.worker_main["self"].value= "# Empty"
            system.worker_main["self.value"]= "# Empty"
        }
    }
    updateUI()
    obj.this.shadowRoot.querySelector('.markdown').addEventListener("input", updateUI);
    obj.this.shadowRoot.querySelector('.markdown__button_download').addEventListener("click", download);
    obj.this.shadowRoot.querySelector('.markdown__button_upload').addEventListener("change", upload);
    obj.this.shadowRoot.querySelector('.markdown__button_select').addEventListener("change", selected);
}