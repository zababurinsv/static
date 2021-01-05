import loader from '/static/html/components/component_modules/loader/loader.mjs'


// let wstunHost = 'ws://tunnel-reverse.herokuapp.com';
// let wstunHost = 'ws://localhost:5000';
// let sys = {
//     pid: process.pid,
//     port: process.env.PORT || 9876
// }
// let win = "localhost:" + sys.port
// reverse_client.start('5005', wstunHost, win);

let System = {}
System.state = {
  wst_client_reverse:false,
}
System.self = {
  this: this,
  system: () => { return System},
  remoteHost: '',
  remotePort: ''
}
System.url = ''
System.wst_client_reverse = async function() {
  await loader('/static/html/components/component_modules/webtcp/tcp.js','tcp')
  System.state.wst_client_reverse = true
  System.self.this = this
  System.state.wst_client_reverse = false
  return System
};

System.start = async function(portTunnel, wsHostUrl, remoteAddr) {

  System.self.remoteHost = location.hostname
  System.self.remotePort = location.port

  System.url = `${wsHostUrl}/?dst=localhost:${portTunnel}`;
  console.log("[SYSTEM] - Connecting to", System.url)
  console.log("[SYSTEM] --> exposing", remoteAddr, "on port", portTunnel);
  //Connection to Controll WS Server
  // System.self.this.wsClientForControll.connect(System.url, 'tunnel-protocol');
  System.self.this.wsClientForControll =  new WebSocket(System.url, 'tunnel-protocol')
  System.self.this.wsClientForControll.onclose = function(event) {
    if (event.wasClean) {
      console.log('[(SYSTEM*)Соединение закрыто чисто]')
    } else {
      console.log('[(SYSTEM*)Обрыв соединения]')
    }
    console.log('[(SYSTEM*)Код: ' + event.code,']' )
  };
  System.self.this.wsClientForControll.onerror = function(error) {
    console.log('[(SYSTEM*)Ошибка ' + error.message,']' )
  };

  System.self.this.wsClientForControll.onopen = (function(_this) {
    console.log("[SYSTEM] --> TCP connection established!",_this.currentTarget);
  })
  System.self.this.wsClientForControll.addEventListener('message', function (message) {
    return new Promise(function (resolve, reject) {
      var parsing = message.data.split(":");
      if (parsing[0] === 'NC') {
        let idConnection = parsing[1];
        console.log('[(SYSTEM*)idConnection', idConnection)
        System.self.this.wsClientData = new WebSocket(wsHostUrl+"/?id="+idConnection, 'tunnel-protocol')

        System.self.this.wsClientForControll.addEventListener('message', function (message) {

          console.log('ddddddddddddddddddddddddddddddd', message.data)
        })

        System.self.this.wsClientData.onopen = async function(event) {
          resolve(await tcpConnection(System.self.this.wsClientData, System.self.remoteHost, System.self.remotePort));
        }
      }
    })
  });
  console.log('@@@@@@ system @@@@@@')
};

function convertStringToUTF8ByteArray(str) {
  let binaryArray = new Uint8Array(str.length)
  Array.prototype.forEach.call(binaryArray, function (el, idx, arr) { arr[idx] = str.charCodeAt(idx) })
  return binaryArray
}

async function tcpConnection(wsConn, host, port){
  console.log('[(SYSTEM*)wsClientData', {
    wsConn: wsConn,
    host:   host,
    port:   port
  })
  let net = new WebTCP(host, 5005);
  let options = {
    encoding: "utf-8",
    timeout: 0,
    noDelay: true, // disable/enable Nagle algorithm
    keepAlive: false, //default is false
    initialDelay: 0 // for keepAlive. default is 0
  }
  let socket = net.createSocket(host, port, options);
  bindSockets(wsConn, socket);
  return true
}


let bindSockets = async function(wslocal, tcpconn) {
  console.log('[SYSTEM] --> bindSockets:');
  wslocal.addEventListener('message', async (message) => {
    let buffer = await message.data.arrayBuffer();
    console.log('[SYSTEM] --> WS MESSAGE:',buffer);
    // tcpconn.write(buffer)
    wslocal.send(buffer)
    // if (message.type === 'utf8') {
    //   return console.log('Error, Not supposed to received message ');
    // }
    // else if (message.type === 'binary') {

      // if (false === tcpconn.write(convertStringToUTF8ByteArray('hello world'))) {
        // wslocal.socket.pause();
        // wslocal.__paused = true;
        //DEBUG console.log('WS message pause true');
        // return "";
      // }
      // else {
        // if (true === wsconn.__paused) {
          // wsconn.socket.resume();
          //DEBUG console.log('WS message pause false');
          // return wsconn.__paused = false;
        // }
      // }
    // } else {
    //   var buffer = await message.data.arrayBuffer();
    // var buffer = await message.data.arrayBuffer();
    //     console.log('wslocal-----1------->>', buffer)
    // wsconn.send(buffer);
    //   var reader = new FileReader();
    //
    //   reader.onload = function () {
    //     console.log('wslocal---------2--->>', reader.result)
    //     tcpconn.write(reader.result)
    //     wslocal.send(reader.result);
      // }

      // console.log('wslocal-----44444------->>', message.data)
      // reader.readAsBinaryString(message.data);
  });
  // tcpconn.on("data", function(buffer) {
    //DEBUG
    // console.log('[SYSTEM] --> TCP data received:\n\n\n' + buffer + "\n\n"); //console.log(JSON.stringify(buffer));
    // return wsconn.send(buffer);
  // });

  // tcpconn.on("error", function(err) {
  //   console.log("[SYSTEM] --> TCP Error " + err);
  //   return tcpconn.destroy();
  // });

  // tcpconn.on("close", function() {
    //DEBUG
    // console.log("[SYSTEM] --> TCP connection close.");
     // tcpconn.destroy();
    // return wsconn.close();
  // });
};

export let system = System;

export default {
 system:System.wst_client_reverse
}