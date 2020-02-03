export default async (obj)=>{
    return new Promise((resolve, reject) => {
        bundle['default'](obj,'export', async function (error, config) {
            let object = {}
            object['count'] = 0
            object['template'] = document.createElement('div')
            object['template'].id = 'right'
            object['template'].className = 'sidebar'
            object['class'] = class sidebar {
                constructor(name) {
                    this.webComponents = obj['name'];
                    this.template = this.template.bind(this)
                }
                self() {
                    return object
                }
                template() {
                    return  object['template'];
                }

            }
            resolve(object)
        })
    })
}