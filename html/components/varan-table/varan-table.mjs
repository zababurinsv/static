customElements.define('varan-table',
  class extends HTMLElement {
    constructor () {
      let white = []
      white['varan-table'] = super()
      white['varan-table-shadowRoot'] = this.attachShadow({mode: 'open'})
      white['varan-table-style'] = document.createElement('style')
      white['varan-table-style'].textContent = `@import "/static/html/components/varan-table/varan-table.css"`
      white['varan-table-shadowRoot'].appendChild(white['varan-table-style'])
      fetch('./static/html/components/varan-table/varan-table.html').then(function (response) {
        return response.text()
      }).then(function (body) {
        let parser = new DOMParser()
        let doc = parser.parseFromString(body, 'text/html')
        let template = doc.getElementsByTagName('template')[0]
        return white['varan-table-shadowRoot'].appendChild(template.content.cloneNode(true))
      })
    }
  }

)
