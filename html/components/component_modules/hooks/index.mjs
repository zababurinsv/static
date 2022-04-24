Array.prototype.diff = function(a) {
  return this.filter(function(i){return a.indexOf(i) < 0;});
};

export const node = ((() => {
  let self = undefined
  let hooks = [], currentHook = 0 // array of hooks, and an iterator!
  return {
    render(Component, mount) {
      if(mount) self = mount
      const Comp = Component() // run effects
      Comp.render(self)
      currentHook = 0 // reset for next render
      return Comp
    },
    useEffect(callback, depArray) {
      const hasNoDeps = !depArray
      const deps = hooks[currentHook] // type: array | undefined
      const hasChangedDeps = deps ? !depArray.every((el, i) =>
        (Array.isArray(el) && Array.isArray(deps[i]))
          ? el.diff(deps[i]).length === 0
          : el === deps[i] ) : true
      if (hasNoDeps || hasChangedDeps) {
        callback()
        hooks[currentHook] = depArray
      }
      currentHook++
    },
    useState(initialValue) {
      hooks[currentHook] = hooks[currentHook] || initialValue // type: any
      const setStateHookIndex = currentHook // for setState's closure!
      const setState = newState => (hooks[setStateHookIndex] = newState)
      return [hooks[currentHook++], setState]
    }
  }
})())