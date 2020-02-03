/* eslint-disable handle-callback-err,no-return-await */
const axios = require('axios')

const varanNews = {
  read: async function (link, start, stop) {
    const result = await axios.get(link, {
      params: {
        start: start,
        stop: stop
      },
      responseType: 'json'
    })
      .then(function (response) {
        console.log('read.news DONE')
        return response.data
      })
      .catch(function (error) {
        console.log('read.news = ERROR')
        return undefined
      })
    return result
  },
  get: async function () {
    const result = await axios.get('https://newsapi.org/v2/top-headlines', { params: { country: 'us', apiKey: '30203461553e4974acfbe54da1846857' } })
      .then(function (response) {
        console.log('news.get = DONE')
        return response.data.articles
      })
      .catch(function (error) {
        console.log('news.get = ERROR')
        return undefined
      })
    return result
  },
  isDuplicate: async function (collection, obj) {
    const result = new Promise(function (resolve, reject) {
      collection.find(obj).toArray(function (err, docs) {
        resolve(docs)
      })
    })
    const promis = await result
    if (promis.length > 0) {
      console.log('isDuplicate: TRUE')
      return true
    } else {
      console.log('isDuplicate: FALSE')
      return false
    }
  },
  writeNews: async function (collection, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (await this.isDuplicate(collection, { title: arr[i].title }) === false) {
        collection.insertOne(arr[i], function (err, r) {
          if (err != null) { console.log('writeNews ERROR') }
        })
      }
    }
  },
  readRange: async function (collection, start, stop) {
    const range = stop - start
    const p = new Promise(function (resolve, reject) {
      collection.find({ }).sort({$natural: -1}).skip(start).limit(range).toArray(function (err, docs) {
        resolve(docs)
      })
    })
    return await p.then()
  },
  listen: async function (collection) {
    setInterval(async () => {
      console.log('get news')
      const n = await this.get()
      await this.writeNews(collection, n)
    }, 1000 * 10)
  }
}
export { varanNews }
