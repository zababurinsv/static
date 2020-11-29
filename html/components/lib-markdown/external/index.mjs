import events from '/static/html/components/lib-markdown/external/events.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Markdown from '/static/html/components/lib-markdown/external/wasm/sundown.mjs'
import Parser from '/static/html/components/component_modules/bundle/html2json/html2json.index.mjs'
export default async (v,p,c,obj,r) => {
    let output = [];
    let html = obj['this']['shadowRoot'].querySelector('.markdown__html')
    let htmlstr = obj['this']['shadowRoot'].querySelector('.markdown__string')
    let self = obj['this']['shadowRoot'].querySelector('.markdown__self')
    let md = await fetch('https://zababurinsv.github.io/markdown/fs.md')
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
    let object=await Markdown({
        preInit() {},
        onRuntimeInitialized() {
            try {
                console.log('ssss', this.FS)
                // this.FS.readFile()
                isEmpty(window.FS)? window.FS = this.FS:window.FS 
                
                const fsSetup = path => {
                    this.FS.mkdir(path);
                    this.FS.mount(this.FS.filesystems.IDBFS, {}, path);
                };
                const fsSave = () => this.FS.syncfs(false, err => console.warn(err));
                window.onbeforeunload = () => fsSave();
                fsSetup("/data");
                // fsSave()
            } catch (e) {
                console.error('error', e)
            }
        },
        print: d => output.push(d),
    })

    function markdownToHTML(markdown) {
        output = [];
        object.FS.writeFile('/data/data.md',markdown)
        object.callMain(["/data/data.md"]);
        return output;
    }

    function updateUI() {
        let output = markdownToHTML(self.value);
        html.innerHTML = output.join(" ");
        // htmlstr.innerText = output.join("\n");
        htmlstr.innerText = Parser.json(Parser.parse(html.innerHTML))
        console.log('Parser#####', Parser.parse(html.innerHTML))
        fsSave()
    }
    
    await fsLoad()
    let dir = object.FS.readdir("/data")
    console.log('dddddddddddddddddddiiiiiiiiirrrrrrrrr', dir)
    if(!isEmpty(dir)) {
    let mdfs =  object.FS.readFile("/data/data.md",{ encoding: "utf8" });
    if(!isEmpty(mdfs)) { self.value = mdfs }
    }
    updateUI()
    obj.this.shadowRoot.querySelector('.markdown').addEventListener("input", updateUI);
}