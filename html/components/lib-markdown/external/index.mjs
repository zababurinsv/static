import events from '/static/html/components/lib-markdown/external/events.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Markdown from '/static/html/components/lib-markdown/external/wasm/sundown.mjs'
import Parser from '/static/html/components/component_modules/bundle/html2json/html2json.index.mjs'
export default async (v,p,c,obj,r) => {
    let output = [];
    let html = obj['this']['shadowRoot'].querySelector('.markdown__html')
    let htmlstr = obj['this']['shadowRoot'].querySelector('.markdown__string')
    let self = obj['this']['shadowRoot'].querySelector('.markdown__self')
    let md = await fetch('https://zababurinsv.github.io/markdown/index.md')
    md = await md.text();
    self.value = md
    const fsLoad = () => {
        return new Promise(async (resolve, reject) => {
            window.FS.syncfs(true , (err) => {
                console.log('file load')
                resolve()
            });
        })
    }
    const fsSave = () => window.FS.syncfs(false, (err) => {
        console.log('file save')
    });
    window.onbeforeunload = () => { fsSave(); }
    let object=await Markdown({
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
        print: d => output.push(d),
    })
   async function selected(event) {
        event.preventDefault()
        let md = await fetch(`${location.origin}/markdown/${event.target.value}.md`)  
        md = await md.text()
        self.innerText = md 
        self.value = md
        updateUI()
    }

    function download() {
        let name = prompt('Введите название файла', 'default');
        let dir = object.FS.readdir("/data")  
        let filename = `${name}.md`
        let text = ''
        if(dir.find(item => item === 'data.md')) {
            text =  object.FS.readFile("/data/data.md",{ encoding: "utf8" });
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
            self.innerText = reader.result 
            self.value = reader.result 
            updateUI()
          };
        
          reader.onerror = function() {
            console.log(reader.error);
          };
    }

    function markdownToHTML(markdown) {
        output = [];
        object.FS.writeFile('/data/data.md',markdown)
        object.callMain(["/data/data.md"]);
        return output;
    }
    function saveMd () {
        let output = markdownToHTML(self.value);
        html.innerHTML = output.join(" ");
        htmlstr.innerText = Parser.json(Parser.parse(html.innerHTML))
        fsSave()
    }
    function updateUI(event = {}) {
        if(!isEmpty(event.target)) {
            if(event.target.tagName !== 'SELECT') {
                saveMd()
            }
        } else {
            saveMd()
        }
    }
    await fsLoad()
    let dir = object.FS.readdir("/data")  
    if(dir.find(item => item === 'data.md')) {
        let mdfs =  object.FS.readFile("/data/data.md",{ encoding: "utf8" });
        if(!isEmpty(mdfs)) { self.value = mdfs }
    }
    updateUI()
    obj.this.shadowRoot.querySelector('.markdown').addEventListener("input", updateUI);
    obj.this.shadowRoot.querySelector('.markdown__button_download').addEventListener("click", download);
    obj.this.shadowRoot.querySelector('.markdown__button_upload').addEventListener("change", upload);
    obj.this.shadowRoot.querySelector('.markdown__button_select').addEventListener("change", selected);
}