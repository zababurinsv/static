let start = function (obj) {
  let preloader = obj['this'].querySelector('.preloader')
  if (preloader) {
    if (!preloader.classList.contains('done')) {
      preloader.classList.add('done')
    }
  }
}
let stop = function (obj) {
  let preloader = obj['this'].querySelector('.preloader')
  if (preloader) {
    if (!preloader.classList.contains('done')) {
      preloader.classList.add('done')
    }
  }
}
export default {
  start: (obj) => { return start(obj) },
  stop: (obj) => { return stop(obj) }
}
