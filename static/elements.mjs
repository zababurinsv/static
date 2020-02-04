export default  () =>{
    return new Promise(function (resolve, reject) {
        [...document.querySelectorAll('template')]
            .forEach(el => {
                    console.log('---------->>')
                    el.parentNode.attachShadow({mode: 'open'});
                    let clone = document.importNode(el.content, true);
                    el.parentNode.shadowRoot.appendChild(clone)
                    el.remove()

                }
            )
        resolve({hydrate:'true'})
    })
}