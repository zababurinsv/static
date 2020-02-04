import matcher from '/static/html/components/component_modules/matcher/matcher.mjs'
let object = {}
object['indexedDb'] = async function (obj) {
  obj = await matcher['database']['request']['functions']['getAll'](obj)
  return obj
}
function colorLog (message, color, ...args) {
  color = color || 'black'
  switch (color) {
    case 'success':
      color = 'Green'
      break
    case 'info':
      color = 'DodgerBlue'
      break
    case 'error':
      color = 'Red'
      break
    case 'warning':
      color = 'Orange'
      break
    case 'events-out':
      color = 'blue'
      break
    case 'violet':
      color = 'violet'
      break
    default:
  }
  console.log('%c' + message, 'color:' + color, ...args)
}
object['$create'] = function (obj) {
  switch (obj['slot']) {
    case 'varan-slider-work':
      return object['uploadGallery'](obj)
    case 'varan-slider-product':
      if (obj['slider'] === true) { return object[`${obj['slot']}`](obj) }
      return object['uploadGallery'](obj)
    case 'varan-slider-news':
      if (obj['slider'] === true) { return object[`${obj['slot']}`](obj) }
      return object['uploadGallery'](obj)
    case 'varan-slider-info':
      if (obj['slider'] === true) { return object[`${obj['slot']}`](obj) }
      return object['uploadGallery'](obj)
    case 'varan-editor':
      if (obj['slider'] === true) { return object[`${obj['slot']}`](obj) }
      return object['varanEditorTxt'](obj)
    case 'varan-blog':
      if (obj['slider'] === true) { return object[`${obj['slot']}`](obj) }
      return object[`${obj['slot']}`](obj)
    default:
      console.assert(false, obj)
      // return object['uploadGallery'](obj)
  }
}
object['queue'] = {}
object['queue'].staticProperty = {}
object['queue'].staticProperty['news'] = [ {key: -1, value: -1} ]
function dateChange (obj) {
  // for (let key in obj.split(' ')) {
  //   switch (obj.split(' ')[key]) {
  //     case 'Feb':
  //       obj.split(' ')[key] = 'Фев.'
  //       break
  //     default:
  //       break
  //   }
  // }
  let month = obj.split(' ')[1]
  if (month === 'Feb') { month = 'Фев' }
  let time = `${obj.split(' ')[3].split(':')[0]}:${obj.split(' ')[3].split(':')[1]}`
  let date = `${obj.split(' ')[0]} ${month}${'\n'}${obj.split(' ')[2]} ${time}`
  // console.assert(false, date, obj.split(' '))

  return date
}

object['varan-slider-news'] = function (obj) {
  console.log('~~~~~~~', obj['object']['link'])
  console.log('~~~~~~~', obj['object']['pubDate'])
  console.log('~~~~~~~', obj['object']['contentSnippet'])
  obj['object']['pubDate'] = dateChange(obj['object']['pubDate'])
  // console.assert(false,   obj['object']['pubDate'])
  if (object['queue'].staticProperty['news'][0]['key'] === -1) {
    console.log('11111', obj['object'])
    object['queue'].staticProperty['news'][0]['value'] = obj['object']
    object['queue'].staticProperty['news'][0]['key'] = 1
  } else {
    // console.log('22222', object['queue'].staticProperty['news'][0]['value'])
    // console.log('22222', obj['object'])
    // console.assert(false, object['queue'].staticProperty)
    object['queue'].staticProperty['news'][0]['key'] = -1
  }

  let card = document.createElement('div')
  card.className = 'card'
  let front = document.createElement('div')
  let back = document.createElement('div')
  let sectionBack = document.createElement('section')
  front.className = 'card__side card__side--front'
  back.className = 'card__side card__side--back'
  sectionBack.innerText = obj['object']['contentSnippet'] + '...'
  back.appendChild(sectionBack)
  card.appendChild(front)
  card.appendChild(back)

  let div = document.createElement('div')
  div.className = 'card'
  // div.className = 'ql-editor news'
  let section = document.createElement('section')

  let figure = document.createElement('figure')
  let figcaption = document.createElement('figcaption')
  figcaption.innerText = `Новости ${'\n'}Varan.su`
  section.appendChild(figure)
  let a = document.createElement('a')
  a.href = './static/images/us/1.svg'
  figure.appendChild(a)
  figure.appendChild(figcaption)
  let img = document.createElement('img')
  img.setAttribute('alt', 'preview')
  img.src = obj['object']['img-uri']
  img.alt = 'info'
  a.appendChild(img)
  let aside = document.createElement('aside')
  let asideBack = document.createElement('aside')
  let section2 = document.createElement('section')
  let name = document.createElement('div')
  name.innerText = obj['object']['title']
  let date = document.createElement('div')
  date.innerText = `Дата публикации ${'\n'}${obj['object']['pubDate']}`
  section2.appendChild(date)
  section2.appendChild(name)

  aside.appendChild(section2)
  let ol = document.createElement('ul')
  let buttonA = document.createElement('p')
  let buttonB = document.createElement('a')
  buttonB.innerText = 'подробнее'
  buttonB.href = obj['object']['link']
  buttonA.appendChild(buttonB)
  asideBack.appendChild(buttonA)

  asideBack.appendChild(ol);

  [ 'like_button_label', 'like_button_icon', 'like_button_count'].forEach(function (item, i, arr) {
    let li = document.createElement('li')
    let img = document.createElement('img')
    let span = document.createElement('span')
    li.appendChild(img)
    li.appendChild(span)
    li.className = item
    switch (item) {
      case 'like_button_label':
        span.innerText = '1'
        img.src = '/static/images/social/eye.png'
        break
      case 'like_button_icon':
        img.src = '/static/images/social/like.png'
        span.innerText = '2'
        break
      case 'like_button_count':
        span.innerText = '3'
        img.src = '/static/images/social/like2.png'
        break
      default:
    }

    front.appendChild(section)
    front.appendChild(aside)
    back.appendChild(asideBack)
    div.appendChild(front)
    div.appendChild(back)

    ol.appendChild(li)
  })

  return div
}
object['varan-slider-info'] = function (obj) {
  // console.log('222', obj)
  let section = document.createElement('article')
  section.className = 'ql-editor info'
  let figcaption = document.createElement('figcaption')
  figcaption.innerText = 'Lorem ipsum dolor sit amet.'
  let figure = document.createElement('figure')
  let a = document.createElement('a')
  a.href = './static/images/us/1.svg'
  let img = document.createElement('img')
  img.setAttribute('alt', 'preview')
  img.src = obj['object']['file']
  img.alt = 'info'
  a.appendChild(img)
  figure.appendChild(a)
  figure.appendChild(figcaption)
  section.appendChild(figure)
  // colorLog(`<${obj['slot']}-out> object['$create'] </${obj['slot']}-out>`, 'firebrick')
  return section
}
object['varan-slider-product'] = function (obj) {
  console.log('222', obj)
  let section = document.createElement('article')
  section.className = 'ql-editor info'
  let figcaption = document.createElement('figcaption')
  figcaption.innerText = 'Lorem ipsum dolor sit amet.'
  let figure = document.createElement('figure')
  let a = document.createElement('a')
  a.href = './static/images/us/1.svg'
  let img = document.createElement('img')
  img.setAttribute('alt', 'preview')
  img.src = obj['object']['file']
  img.alt = 'info'
  a.appendChild(img)
  figure.appendChild(a)
  figure.appendChild(figcaption)
  section.appendChild(figure)
  // colorLog(`<${obj['slot']}-out> object['$create'] </${obj['slot']}-out>`, 'firebrick')
  return section
}
object['uploadGallery'] = function (obj) {
    // console.assert(false, obj['slot'])
  if (obj.hasOwnProperty('template')) {
    let details = document.createElement('details')
    let summary = document.createElement('summary')
      summary.className = `${obj['slot']}-summary`
    let content = document.createElement('div')
    if (obj['object']['content'] === undefined) {
      content.innerText = 'default'
    } else {
      content.innerText = obj['object']['content']
    }
    content.innerText = 'Lorem ipsum dolor sit amet.'
    details.className = `${obj['slot']}-details`
    details.id = obj['object']['id']
    let figure = document.createElement('figure')
    figure.className = `${obj['slot']}-figure`
    let img = document.createElement('img')
    img.setAttribute('alt', 'preview')
    img.src = obj['object']['file']
    figure.appendChild(img)
    figure.appendChild(content)
    summary.appendChild(figure)
    details.appendChild(summary)

    let figcaption = document.createElement('figcaption')
    let button1 = document.createElement('button')
    let button2 = document.createElement('button')
    button1.innerText = 'Изменить'
    button1.id = obj['object']['id']
    button1.className = obj['object']['object']
    figcaption.appendChild(button1)
    button2.innerText = 'Удалить'
    button2.id = obj['object']['id']
    button2.className = obj['object']['object']
    figcaption.appendChild(button2)
    details.appendChild(figcaption)
    // colorLog(`<${obj['slot']}-out> object['$create']['default'] </${obj['slot']}-out>`, 'firebrick')
    return details
  } else {
    // console.assert(false, obj)
    let details = document.createElement('details')
    let summary = document.createElement('summary')
      summary.className = `${obj['slot']}-summary`
    let content = document.createElement('div')
    content.style.textAlign = 'center'
    if (obj['object']['content'] === undefined) {
      content.innerText = 'default'
    } else {
      content.innerText = obj['object']['content']
    }
    content.innerText = 'Lorem ipsum dolor sit amet.'
    details.className = `${obj['slot']}-details`
    details.id = obj['object']['id']
    let figure = document.createElement('figure')
    figure.className = `${obj['slot']}-figure`
    let img = document.createElement('img')
    img.setAttribute('alt', 'preview')
    img.src = obj['object']['file']
    figure.appendChild(img)
    figure.appendChild(content)
    summary.appendChild(figure)
    details.appendChild(summary)

    let figcaption = document.createElement('figcaption')
    let button1 = document.createElement('button')
    let button2 = document.createElement('button')
    button1.innerText = 'Изменить'
    button1.id = obj['object']['id']
    button1.className = obj['object']['object']
    figcaption.appendChild(button1)
    button2.innerText = 'Удалить'
    button2.id = obj['object']['id']
    button2.className = obj['object']['object']
    figcaption.appendChild(button2)
    details.appendChild(figcaption)
      // console.assert(false, details)
    // colorLog(`<${obj['slot']}-out> object['$create']['default'] </${obj['slot']}-out>`, 'firebrick')
    return details
  }
}

object['uploadGalleryText'] = function (obj) {
    console.assert(false, obj)
  if (obj.hasOwnProperty('template')) {
    let details = document.createElement('details')
    let summary = document.createElement('summary')
    let content = document.createElement('div')

    if (obj['object']['content'] === undefined) {
      content.innerText = 'default'
    } else {
      content.innerText = obj['object']['content']
    }
    details.className = 'item'
    details.id = obj['object']['id']
    details.cassName = 'zArtGallery'
    let figure = document.createElement('figure')
    let img = document.createElement('img')
    img.setAttribute('alt', 'preview')
    img.src = obj['object']['file']
    figure.appendChild(img)
    figure.appendChild(content)
    summary.appendChild(figure)
    details.appendChild(summary)

    let figcaption = document.createElement('figcaption')
    let button1 = document.createElement('button')
    let button2 = document.createElement('button')
    button1.innerText = 'Изменить'
    button1.id = obj['object']['id']
    button1.className = obj['object']['object']
    figcaption.appendChild(button1)
    button2.innerText = 'Удалить'
    button2.id = obj['object']['id']
    button2.className = obj['object']['object']
    figcaption.appendChild(button2)
    details.appendChild(figcaption)

    return details
  } else {
    let details = document.createElement('details')
    let summary = document.createElement('summary')
    let content = document.createElement('div')

    if (obj['object']['content'] === undefined) {
      content.innerText = 'default'
    } else {
      content.innerText = obj['object']['content']
    }
    details.className = 'item'
    details.id = obj['object']['id']
    let figure = document.createElement('figure')
    let img = document.createElement('img')
    img.setAttribute('alt', 'preview')
    img.src = obj['object']['file']
    figure.appendChild(img)
    figure.appendChild(content)
    summary.appendChild(figure)
    details.appendChild(summary)

    let figcaption = document.createElement('figcaption')
    let button1 = document.createElement('button')
    let button2 = document.createElement('button')
    button1.innerText = 'Изменить'
    button1.id = obj['object']['id']
    button1.className = obj['object']['object']
    figcaption.appendChild(button1)
    button2.innerText = 'Удалить'
    button2.id = obj['object']['id']
    button2.className = obj['object']['object']
    figcaption.appendChild(button2)
    details.appendChild(figcaption)

    return details
  }
}
object['uploadSliderWork'] = function (obj) {
  console.log('~~~~~~~~~uploadSliderWork~~~~~~~~~~~~~', obj['listing_table'])
  let figure = document.createElement('figure')
  let a = document.createElement('a')
  let img = document.createElement('img')
  img.setAttribute('alt', 'preview')
  img.src = obj['object']['file']
  let figcaption = document.createElement('figcaption')
  figcaption.innerText = obj['object']['content']
  a.appendChild(img)
  figure.appendChild(a)
  figure.appendChild(figcaption)
  return figure
}

object['varanEditorTxt'] = function (obj) {
  console.log('~~~~~~~~~add~Editor~~~~~~~~~~~~', obj['varan-editor'])
  let scriptQuiil = document.createElement('script')
  scriptQuiil.src = '/static/distrib/qEditor.mjs'
  scriptQuiil.defer = true

  let script = document.createElement('script')
  script.src = '/static/html/components/varan-editor/varan-editor.mjs'
  script.async = true
  script.setAttribute('type', 'module')

  let varanEditor = document.createElement('varan-editor')
  varanEditor.setAttribute('import', '')
  varanEditor.setAttribute('type', 'swap-text-scoped')

  let varanModalButton = document.createElement('varan-modal-button')
  varanModalButton.setAttribute('parent', obj['slot'])
  varanModalButton.setAttribute('type', 'swap')
  varanModalButton.setAttribute('mode', 'view')

  let varanMenu = document.createElement('varan-menu')
  varanMenu.setAttribute('import', '')
  varanMenu.setAttribute('parent', obj['slot'])
  varanMenu.setAttribute('type', 'light-swap-editor')
  varanMenu.slot = 'edit'

  varanEditor.appendChild(scriptQuiil)
  varanEditor.appendChild(varanModalButton)
  varanEditor.appendChild(varanMenu)
  varanEditor.appendChild(script)

  // console.assert(false, varanEditor)
  obj['editor'] = varanEditor
  return obj
}

object['varan-blog'] = function (obj) {
  console.log('~~~~~~~~~add~varan-blog~~~~~~~~~~~~', obj)
  obj['blog'] = []
  if (!obj['get_n']) {
    let details = document.createElement('details')
    details.onclick = function () { return true }
    details.id = obj['object']['id']
    let summary = document.createElement('summary')
    let section = document.createElement('section')
    section.classList.add('zArt241')
    let rootContent = document.createElement('div')
    rootContent.classList.add('rootContent')
    let rootText = document.createElement('div')
    rootText.classList.add('rootText')
    let figcaption = document.createElement('figcaption')
    let clip_frame = document.createElement('div')
    clip_frame.classList.add('clip_frame')
    let img = document.createElement('img')

    img.src = obj['object']['file']
    img.classList.add('u14894_img')
    img.alt = 'blog image'
    img.title = 'blog'

    let aboutContent = document.createElement('div')
    aboutContent.classList.add('aboutContent')

    let u14904 = document.createElement('div')
    u14904.classList.add('u14904-4')

    let p = document.createElement('p')
    let a = document.createElement('a')
    a.href = '#'
    a.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi feugiat faucibus.'
    p.appendChild(a)

    let p2 = document.createElement('p')
    p2.classList.add('u14931-2')
    p2.innerText = 'подробнее'
    let a2 = document.createElement('a')
    a2.href = '#'
    a2.classList.add('u14931-4')
    a2.appendChild(p2)

    let txtAbout = document.createElement('p')
    txtAbout.classList.add('txtAbout')
    txtAbout.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sollicitudin non nulla eget' +
        '      scelerisque. Praesent ornare aliquet nunc. Integer ante lectus, fermentum in ullamcorper at, consequat id nunc.' +
        '      Vestibulum non posuere lacus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis' +
        '      egestas. Aenean placerat auctor dui. Sed ornare ante id metus sollicitudin, eget vulputate metus condimentum.'
    let button1 = document.createElement('button')
    let button2 = document.createElement('button')
    let button3 = document.createElement('button')
    button1.innerText = 'Изменить'
    if (!obj['object']) {
      obj['object'] = {}
    }

    if (obj['object']['id']) {
      button1.id = obj['object']['id']
    }
    if (obj['object']['object']) {
      button1.className = obj['object']['object']
    }
    figcaption.appendChild(button1)

    if (obj['object']['status'] === true) {
      button2.innerText = 'убрать'
    } else {
      button2.innerText = 'добавить'
    }

    if (obj['object']['id']) {
      button2.id = obj['object']['id']
    }
    if (obj['object']['object']) {
      button2.className = `${obj['object']['object']}:activeItem`
    }

    figcaption.appendChild(button2)
    button3.innerText = 'Удалить'
    if (obj['object']['id']) {
      button3.id = obj['object']['id']
    }
    if (obj['object']['object']) {
      button3.className = obj['object']['object']
    }

    figcaption.appendChild(button3)
    u14904.appendChild(p)
    aboutContent.appendChild(u14904)
    aboutContent.appendChild(a2)
    clip_frame.appendChild(img)
    rootContent.appendChild(clip_frame)
    rootContent.appendChild(aboutContent)
    section.appendChild(rootContent)
    rootText.appendChild(txtAbout)
    section.appendChild(rootText)
    summary.appendChild(section)
    details.appendChild(figcaption)
    details.appendChild(summary)
    details.appendChild(figcaption)
    return details
  } else {
    for (let i = 0; i < obj['get_n'].length; i++) {
      let status = obj['get_n'][i][`${obj['get_n'][i]['object']}`]['status']

      let object = obj['get_n'][i][`${obj['get_n'][i]['object']}`]
      // console.assert(false, object)
      let details = document.createElement('details')
      details.onclick = function () { return false }
      details.id = obj['get_n'][i][`${obj['get_n'][i]['object']}`]['id']
      let summary = document.createElement('summary')
      let section = document.createElement('section')
      section.classList.add('zArt241')
      let rootContent = document.createElement('div')
      rootContent.classList.add('rootContent')
      let rootText = document.createElement('div')
      rootText.classList.add('rootText')
      let figcaption = document.createElement('figcaption')
      let clip_frame = document.createElement('div')
      clip_frame.classList.add('clip_frame')
      let img = document.createElement('img')

      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~', object)
      img.src = object['file']
      img.classList.add('u14894_img')
      img.alt = 'blog content'
      img.title = 'blog'

      let aboutContent = document.createElement('div')
      aboutContent.classList.add('aboutContent')

      let u14904 = document.createElement('div')
      u14904.classList.add('u14904-4')

      let p = document.createElement('p')
      let a = document.createElement('a')
      a.href = '#'
      a.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi feugiat faucibus.'
      p.appendChild(a)

      let p2 = document.createElement('p')
      p2.classList.add('u14931-2')
      p2.innerText = 'подробнее'
      let a2 = document.createElement('a')
      a2.href = '#'
      a2.classList.add('u14931-4')
      a2.appendChild(p2)

      let txtAbout = document.createElement('p')
      txtAbout.classList.add('txtAbout')
      txtAbout.innerText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sollicitudin non nulla eget' +
          '      scelerisque. Praesent ornare aliquet nunc. Integer ante lectus, fermentum in ullamcorper at, consequat id nunc.' +
          '      Vestibulum non posuere lacus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis' +
          '      egestas. Aenean placerat auctor dui. Sed ornare ante id metus sollicitudin, eget vulputate metus condimentum.'
      u14904.appendChild(p)
      aboutContent.appendChild(u14904)
      aboutContent.appendChild(a2)
      clip_frame.appendChild(img)
      rootContent.appendChild(clip_frame)
      rootContent.appendChild(aboutContent)
      section.appendChild(rootContent)
      rootText.appendChild(txtAbout)
      section.appendChild(rootText)
      summary.appendChild(section)
      details.appendChild(figcaption)
      details.appendChild(summary)
      details.appendChild(figcaption)

      if (status === true) {
        obj['blog'].push(details)
      }
    }

    return obj
  }
}
async function init (obj) {
  // object.lib = SliderProduct
  obj['Object'] = {}
  obj['$create'] = object['$create']
  obj['Object']['$create'] = object['$create']
  return obj
}
export default {
  init: obj => { return init(obj) }
}
