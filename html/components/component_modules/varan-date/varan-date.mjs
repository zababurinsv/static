
let date = {}

date['getDateTime'] = function () {
  var date = new Date()

  var options = {
    era: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }

  // alert() // среда, 31 декабря 2014 г. н.э. 12:30:00
  // alert(date.toLocaleString('en-US', options)) // Wednesday, December 31, 2014 Anno Domini 12:30:00 PM
  return date.toLocaleString('ru', options)
}

let init = function () {
  return date['getDateTime']()
}

export default {
  init: () => { return init() }
}
