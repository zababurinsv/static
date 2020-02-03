import action from '/static/html/components/component_modules/action/action.mjs'
(async ()=>{
  bundle['default']({
    input:'object'
  },null, async function (error, config) {
    action({
      input:'varan-crop',
      this: config['store']['varan-crop'][0]['this'],
      type:'store'
    }, 'set', 'type')

  })
})()
