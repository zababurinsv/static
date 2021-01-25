export default (v,p,c,obj,r) => {

  document.addEventListener('iframe',async (event)=>{
    if(event.detail === 'http://localhost:4999'){
      iframe.post(event.detail, {
        view:true,
        property:'прослушиваем получение кошелька',
        color:'6',
        substrate:{},
        relation:'await-wallet'
      },async (event)=>{

        console.log('--->>>>>', event)
      })
    }
  })

  obj['this'].shadowRoot.querySelector('#fswe').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fswe').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#fbwe').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fbwe').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#fbue').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fbue').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  })
  obj['this'].shadowRoot.querySelector('#fbeu').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fbeu').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  })
  obj['this'].shadowRoot.querySelector('#fbwu').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)

    let timer = setTimeout((event) => {
      obj['this'].shadowRoot.querySelector('#fbwu').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#fswu').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#fswu').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sbew').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sbew').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sbwe').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sbwe').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sseu').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sseu').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#ssue').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#ssue').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sbwu').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sbwu').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
  obj['this'].shadowRoot.querySelector('#sbuw').addEventListener('click',async (event)=>{
    event.currentTarget.style.background = '#faf671'
    let value =  event.currentTarget.innerHTML
    value = value.split('*')[0].split('(')[1]
    await navigator.clipboard.writeText(value)
    let timer = setTimeout((event)=>{
      obj['this'].shadowRoot.querySelector('#sbuw').style.background = 'transparent'
      clearTimeout(timer);
    }, 250);
  },{passive:true})
}