export default (()=>{
  return new Promise((resolve,reject)=> {
    let eventSource = new EventSource("http://localhost:7667/events");
    eventSource.onmessage = function(event) {
      console.log( JSON.parse(event.data));

    };

    resolve({
      _scriptDir: import.meta.url,
      status: 'send message',
      success: true,
      message: true
    })
  })
})()