import loader from '/static/html/components/component_modules/loader/loader.mjs'
export default (textNode, mode)=>{
    return new Promise( async (resolve, reject) => {
        let CodeMirror = await loader('/static/html/components/component_modules/codemirror/codemirror_5_21_0.js', 'CodeMirror')
        await loader('/static/html/components/component_modules/codemirror/search.js', 'plugin')
        await loader('/static/html/components/component_modules/codemirror/searchcursor.js', 'plugin')
        await loader('/static/html/components/component_modules/codemirror/match-highlighter.js', 'plugin')
        await loader('/static/html/components/component_modules/codemirror/jump-to-line.js', 'plugin')
        await loader('/static/html/components/component_modules/codemirror/dialog.js', 'plugin')
        await loader('/static/html/components/component_modules/codemirror/runmode.js', 'plugin')

        // theme: 'one-dark',
        let editor = CodeMirror.fromTextArea(textNode, {
            mode:  `${mode}`,
            lineNumbers: true,
            smartIndent: true,
            searchMode: 'popup',
            lineWrapping: true,
            extraKeys: {
                "Ctrl-Q": function(cm){
                    console.log('~~~~~Ctrl-Q~~~~~~~~~~~', cm)
                },
                "Ctrl-F": function(cm){
                    cm.execCommand("find")
                    console.log('~~~~~Ctrl-F~~~~~~~~~~~', cm)
                },
                "Ctrl-G": function(cm){
                    console.log('~~~~~Ctrl-Q~~~~~~~~~~~', cm)
                },
                "Ctrl-Shift-G": function(cm){
                    console.log('~~~~~Ctrl-Q~~~~~~~~~~~', cm)
                },
                "Ctrl-Shift-F": function(cm){
                    console.log('~~~~~Ctrl-Q~~~~~~~~~~~', cm)
                },
                "Ctrl-Shift-R": function(cm){
                    console.log('~~~~~Ctrl-Q~~~~~~~~~~~', cm)
                },
                "Alt-F": function(cm){
                    console.log('~~~~~Ctrl-Q~~~~~~~~~~~', cm)
                },
                "Alt-G": function(cm){
                    console.log('~~~~~Ctrl-Q~~~~~~~~~~~', cm)
                },
            }
        });
        resolve(editor)
    })
}