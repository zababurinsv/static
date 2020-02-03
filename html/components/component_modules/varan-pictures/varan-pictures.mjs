import upload from '/static/html/components/component_modules/upload/upload.mjs'
import distrib from '/static/html/components/component_modules/distrib/distrib.mjs'
import mutations from '/static/html/components/component_modules/mutations/mutations.mjs'
import isEmpty from '/static/html/components/component_modules/isEmpty/isEmpty.mjs'

let varanPictures = {}



varanPictures['action'] = (obj, func, ...args) =>{
  return new Promise(async function (resolve, reject) {
    let out = (obj) => { resolve(obj) }
    let err = (err) => {
      reject(err)
    }
    switch (func) {
      case 'action':
        (async (obj, props, data) => {
          console.log(`${obj['input']}[(varan-pictures)${obj[props]}]`)

          let outEnd = document['body'].querySelector('varan-pictures')
          outEnd = outEnd.shadowRoot.querySelector('#output')
          let pic = await upload(obj, 'certPictures', './static/diplom_oly.jpg')

          // console.assert(false, pic)
          let text = await upload(obj, 'certText')
          let doc = await upload(text, 'createDocument')

          outEnd.innerHTML = ''
          outEnd.appendChild(pic)
          outEnd.appendChild(doc)
          // await distrib({
          //   input: 'varan-pictures',
          //   distrib: 'download'
          // }, 'htmlToImage', 'distrib', outEnd)
          out(obj)
        })(obj, args[0], args[1], args[2])
        break
      case 'test':
        (async (obj, props, input) => {
          try {
            console.log(`${obj['input']}[(varan-pictures)${obj[props]}]`)

            let ggg ={
            id: 1387,
            participant: 230,
            fio1: 'Крамаренко',
            fio2: 'Ульяна',
            class: 1,
            school: 'МБОУ «Зугрэсская средняя школа № 17»',
            status: 5,
            certificate: 'Э0a980c',
            status2: 'Второе место' }
            let content = JSON.stringify(ggg)
            input.innerText = content


            out('success')
          }catch (e) {
            err(e)
          }finally {
            console.log('что то делаем')

          }

        })(obj, args[0], args[1], args[2], args[3])

        break
      case 'error':

        break
      case 'warning':

        break
      default:
        err({ message: `новая функция ${func}` })
        break
    }
  })
}

varanPictures['init'] = async (obj) =>{
  bundle['default']('varan-pictures', obj, async function (error, obj) {
    let node = document['body'].querySelector('#input')
    if(isEmpty(obj)) {
      obj = {}
      obj['this'] = document['body'].querySelector('varan-pictures')
    }
    if (document['body'].querySelector('#input').innerText !== '') {
      varanPictures['action'](obj, 'action', document['body'].querySelector('#input').innerText)
    }
    await  mutations({
        input:'varan-pictures',
        this:obj['this']
      }, node)
    // varanPictures['action']({
    //   input:'varan-pictures',
    //   this:obj['this'],
    //   end:'test'
    // }, 'test', 'end', node )

  })
}
varanPictures['init']()
export default async (obj, func, ...args) => {
  return new Promise(async function (resolve, reject) {
    let out = (obj) => { resolve(obj) }
    let err = (err) => {
      reject(err)
    }
    switch (func) {
      case 'action':
        (async (obj, props, data) => {
          console.log(`${obj['input']}[(varan-pictures)${obj[props]}]`)
          let outEnd = document['body'].querySelector('varan-pictures')
          outEnd = outEnd.shadowRoot.querySelector('#output')
          let pic = await upload(obj, 'certPictures', './static/diplom_oly.jpg')
          let text = await upload(obj, 'certText')
          let doc = await upload(text, 'createDocument', pic)
          // console.assert(false, doc.childNodes)
          outEnd.innerHTML = ''
          outEnd.appendChild(doc)
          outEnd = outEnd.querySelector('.img')
          await distrib({
            input: 'varan-pictures',
            distrib: 'download'
          }, 'htmlToImage', 'distrib', outEnd)
          document.querySelector('#input').innerHTML = ''
          out(obj)
        })(obj, args[0], args[1], args[2])
        break
      case 'set':
        (async (obj, props, data) => {
          try {
            console.log(`${obj['input']}[(varan-pictures)${obj[props]}]`)

            out('success')
          }catch (e) {
            err(e)
          }finally {
            console.log('что то делаем')

          }

        })(obj, args[0], args[1], args[2], args[3])

        break
      case 'error':

        break
      case 'warning':

        break
      default:
        err({ message: `новая функция ${func}` })
        break
    }
  })
}
