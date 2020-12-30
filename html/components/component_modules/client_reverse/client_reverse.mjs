//###############################################################################
//##
//# Copyright (C) 2014-2015 Andrea Rocco Lotronto, 2017 Nicola Peditto
//##
//# Licensed under the Apache License, Version 2.0 (the "License");
//# you may not use this file except in compliance with the License.
//# You may obtain a copy of the License at
//##
//# http://www.apache.org/licenses/LICENSE-2.0
//##
//# Unless required by applicable law or agreed to in writing, software
//# distributed under the License is distributed on an "AS IS" BASIS,
//# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//# See the License for the specific language governing permissions and
//# limitations under the License.
//##
//###############################################################################
// var log4js = require("log4js");
// var logger = log4js.getLogger('wstun');

// import { client as WebSocketClient } from 'websocket'
// import net from 'net'

// import bindSockets from './bindSockets_reverse'
// import tunnel from '/static/html/components/component_modules/webSocket/webSocket.mjs'
// import log4js from 'log4js'
// import WebSocketCl from 'websocket'
// let WebSocketClient = WebSocketCl.client
// import net from 'net'
// import Url from 'url'
// var logger = log4js.getLogger('wstun');
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
  // console.log('WebSocket', await tunnel())
  // this.wsClientForControll = new WebSocket("ws://tunnel-reverse.herokuapp.com");
  // this.wsClientForControll = new WebSocketClient();
  System.self.this = this
  System.state.wst_client_reverse = false
  return System
};

System.start = async function(portTunnel, wsHostUrl, remoteAddr) {

  System.self.remoteHost = location.hostname
  System.self.remotePort = location.port

  System.url = `${wsHostUrl}/?dst=localhost:${portTunnel}`;
  console.log("[SYSTEM] - Connecting to", wsHostUrl)
  console.log("[SYSTEM] - Connecting to", wsHostUrl);
  console.log("[SYSTEM] --> exposing", remoteAddr, "on port", portTunnel);
  //Connection to Controll WS Server
  // System.self.this.wsClientForControll.connect(System.url, 'tunnel-protocol');

  System.self.this.wsClientForControll =  new WebSocket(System.url, 'tunnel-protocol')
  System.self.this.wsClientForControll.onopen = (function(_this){
    console.log("[SYSTEM] --> TCP connection established!");

  })
  System.self.this.wsClientForControll.addEventListener('message', function (message) {
    //Only utf8 message used in Controll WS Socket
    console.log('wsClientForControll.message', message.data)
    var parsing = message.data.split(":");
    //Managing new TCP connection on WS Server
    if (parsing[0] === 'NC') {
      //Identification of ID connection
      var idConnection = parsing[1];
      console.log('idConnection', idConnection)
      System.self.this.wsClientData = new WebSocket(wsHostUrl+"/?id="+idConnection, 'tunnel-protocol')
      // System.self.this.wsClientData.connect(wsHostUrl+"/?id="+idConnection, 'tunnel-protocol');
      //Management of new WS Client for every TCP connection on WS Server
      System.self.this.wsClientData.onopen = async function(_this){
        await tcpConnection(System.self.this.wsClientData, System.self.remoteHost, System.self.remotePort);
      }
    }
  });

  System.self.this.wsClientForControll.onclose = function(event) {
    if (event.wasClean) {
      // alert('Соединение закрыто чисто');
      console.log('Соединение закрыто чисто')
      // object['staticProperty']['socket'] = undefined
    } else {
      console.log('Обрыв соединения')
      // object['staticProperty']['socket'] = undefined
    }
    console.log('Код: ' + event.code )
    // alert('Код: ' + event.code + ' причина: ' + event.reason);
  };
  System.self.this.wsClientForControll.onerror = function(error) {
    alert("Ошибка " + error.message);
  };
};

function convertStringToUTF8ByteArray(str) {
  let binaryArray = new Uint8Array(str.length)
  Array.prototype.forEach.call(binaryArray, function (el, idx, arr) { arr[idx] = str.charCodeAt(idx) })
  return binaryArray
}

async function tcpConnection(wsConn, host, port){
  wsConn.onopen = () => {
    let net = new WebTCP(host, 9999);
    let options = {
      encoding: "utf-8",
      timeout: 0,
      noDelay: true, // disable/enable Nagle algorithm
      keepAlive: false, //default is false
      initialDelay: 0 // for keepAlive. default is 0
    }
    let socket = net.createSocket(host, port, options);
    bindSockets(wsConn, socket);
  }
}


let bindSockets = async function(wslocal, tcpconn) {

  wslocal.addEventListener('message', (message) => {

    console.log('[SYSTEM] --> WS MESSAGE:',message);

    if (message.type === 'utf8') {
      return console.log('Error, Not supposed to received message ');
    }
    else if (message.type === 'binary') {

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
      console.log('wslocal-----1------->>', message.data)
      var reader = new FileReader();

      reader.onloadend = function () {
        console.log('wslocal---------2--->>', reader.result)
      }
        tcpconn.write(reader.result)
        wslocal.send(reader.result);
      }

      reader.readAsBinaryString(message.data);
    // }
  });
  tcpconn.on("data", function(buffer) {
    //DEBUG
    console.log('[SYSTEM] --> TCP data received:\n\n\n' + buffer + "\n\n"); //console.log(JSON.stringify(buffer));
    return wsconn.send(buffer);
  });

  tcpconn.on("error", function(err) {
    console.log("[SYSTEM] --> TCP Error " + err);
    return tcpconn.destroy();
  });

  tcpconn.on("close", function() {
    //DEBUG
    console.log("[SYSTEM] --> TCP connection close.");
     // tcpconn.destroy();
    // return wsconn.close();
  });

};

export let system = System;

export default {
 system:System.wst_client_reverse
}