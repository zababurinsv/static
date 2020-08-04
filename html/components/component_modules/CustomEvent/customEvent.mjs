
export default (view = true,property='',color = 'black', substrate={},relation=''  )=>{
    return new Promise(function (resolve, reject) {
        document.addEventListener(`${relation}-end`, async (event)=>{
            console.log(event.detail.data)
            resolve(event.detail.data)
        })
        document.dispatchEvent( new CustomEvent(`${relation}`, {
            detail: {
                '/':relation,
                view: view,
                property:property,
                color:color,
                substrate:substrate,
                relation:relation,
                callback: (obj) =>{
                    document.dispatchEvent( new CustomEvent(`${relation}-end`,{
                        detail:{ data: obj }
                    }))
                }
            }
        }))
    })
}