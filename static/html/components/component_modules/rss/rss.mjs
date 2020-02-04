import template from '/static/html/components/component_modules/template/template.mjs'
export default  (obj, func, ...args)=>{
    return new Promise( function (resolve, reject) {
      bundle['default'](obj,'export', async function (error, config) {
      let out = (obj) => {
        //console.log('~~~ out router ~~~')
        resolve(obj)
      }
      let err = (error) => {
        console.log('~~~ err router ~~~', error)
        reject(error)
      }
      switch (func) {
        case 'test':
          (async (obj, props,state, server) => {
            try {
              console.log(`${obj['input']}[(rss)${obj[props]}]`)


              // console.assert(false, config['Feed'])
              const feed = new config['Feed']['Feed']({
                title: "Feed Title",
                description: "This is my personal feed!",
                id: "http://example.com/",
                link: "http://example.com/",
                language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
                image: "http://example.com/image.png",
                favicon: "http://example.com/favicon.ico",
                copyright: "All rights reserved 2013, John Doe",
                updated: new Date(2013, 6, 14), // optional, default = today
                generator: "awesome", // optional, default = 'Feed for Node.js'
                feedLinks: {
                  json: "https://example.com/json",
                  atom: "https://example.com/atom"
                },
                author: {
                  name: "John Doe",
                  email: "johndoe@example.com",
                  link: "https://example.com/johndoe"
                }
              });

          // console.assert(false,feed )

              feed.addCategory("Technologie");


              feed.addContributor({
                name: "Johan Cruyff",
                email: "johancruyff@example.com",
                link: "https://example.com/johancruyff"
              });

              let output = {}
              output['rss2'] = feed.rss2()
              output['json'] = feed.json1()

              out(output)
            } catch (e) { err(e) }
          })(obj, args[0], args[1], args[2], args[3])
          break
        case 'culture':

          (async (obj, props,data, server) => {
            try {
              console.log(`${obj['input']}[(table)${obj[props]}]`)
              const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
              let parser = new config['rssParser']();

              let news = {}


              parser.parseURL(CORS_PROXY + 'https://news.yandex.ru/culture.rss', function(err, feed) {

                template({
                  input:"rss",
                  export: '',
                  import: feed,
                  self: obj

                }, 'news', 'import')
                    .then((template)=>{


                      // console.assert(false, template)
                  out(template)
                })


                // console.log(feed);
                // feed.items.forEach(function(entry) {
                //
                //   console.log(entry.title + ':' + entry.link);
                // })
              })
            } catch (e) { err(e) }
          })(obj, args[0], args[1], args[2], args[3])

          break
        default:
          err(`новая функция ${func}`)
          break
      }
    })
  })
}
