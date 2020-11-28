import events from '/static/html/components/lib-markdown/external/events.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'
import Markdown from '/static/html/components/lib-markdown/external/wasm/sundown.mjs'
export default async (v,p,c,obj,r) => {
    let output = [];
    let html = obj['this']['shadowRoot'].querySelector('.markdown__html')
    let htmlstr = obj['this']['shadowRoot'].querySelector('.markdown__string')
    let self = obj['this']['shadowRoot'].querySelector('.markdown__self')
    let md = await fetch('https://zababurinsv.github.io/markdown/fs.md')
    md = await md.text();
    self.value = md
    let object=await Markdown({
        preInit() {},
        onRuntimeInitialized: updateUI,
        print: d => output.push(d),
    })

    function markdownToHTML(markdown) {
        output = [];
        object.FS.writeFile('/tmp/data.md',markdown)
        object.callMain(["/tmp/data.md"]);
        return output;
    }

    function updateUI() {
        let output = markdownToHTML(self.value);
        html.innerHTML = output.join(" ");
        htmlstr.innerText = output.join("\n");
    }
    
    obj.this.shadowRoot.querySelector('.markdown').addEventListener("input", updateUI);
    updateUI()
}