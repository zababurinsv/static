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
let log4js = require("log4js");
let logger = log4js.getLogger('wstun');
let httpProxy = require('http-proxy');
let isEmpty = require('./isEmpty.js');
let WebSocketServer, bindSockets, http, net, url, wst_server_reverse;
let connectServer = {}
let src_address = {}
let portTcp = {}
WebSocketServer = require('websocket').server;
http = require('http');
url = require("url");
net = require("net");
bindSockets = require("./bindSockets_reverse");
const fs = require('fs');
const path = require('path');
uuid = require('node-uuid');

logger.info("WSTUN STARTED!");

https_flag = null;

let eventEmitter = require('events').EventEmitter;
eventEmitter.prototype._maxListeners = 1000;

let newWSTCP_DATA = new eventEmitter();
let connect = true
let queue = []
let init = false
let target = 'http://localhost'
let proxyClient = httpProxy.createProxyServer({});

async function proxy(request, response, r='') {

  if(isEmpty(connectServer)){
    console.log(`${request.method} ${response.url}`);
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<!DOCTYPE 'html'>");
    response.write("<html>");
    response.write("<head>");
    response.write("<title>xArt</title>");
    response.write("</head>");
    response.write("<body>");
    response.write(`<div>
                     <fieldset>
                           <legend>Empty</legend>
                           <img href="https://i.imgur.com/xeqHFPH.jpg" src="https://i.imgur.com/xeqHFPH.jpg"/>
<!--                     <span>revers wstun server on port ${wsport} -> true</span>-->
                     <span>Await client connections...</span>   
                     </fieldset>
                     
                     </div>`);
    response.write("</body>");
    response.write("</html>");
    response.end();
  }else {
    portTcp = Object.keys(connectServer)[0]
    proxyClient.web(request, response,{target: `http://localhost:${portTcp}`})
  }
  return true
}

wst_server_reverse = function(options) {

  if(options !== undefined) {

    logger.info("[SYSTEM] - WS Reverse Tunnel Server starting with these paramters:\n" + JSON.stringify(options, null, "\t"));
    this.dstHost = options.dstHost;
    this.dstPort = options.dstPort;

    https_flag = options.ssl;

  }
  else
    logger.info("[SYSTEM] - WS Reverse Tunnel Server starting...");


  if(https_flag === true){
    //HTTPS
    logger.info("[SYSTEM] - WS Reverse Tunnel Server over HTTPS.");
    let https = require('https');
    let fs = require('fs');

    require("../lib/https_override"); //add parameters overriding each https request

    https_flag = options.ssl;

    try{
      // certificates loading from file
      this.s4t_key = fs.readFileSync(options.key, 'utf8');
      this.s4t_cert = fs.readFileSync(options.cert, 'utf8');
    }catch (err) {
      // handle the error safely
      logger.info("[SYSTEM] --> ERROR: " + err);
      process.exit(1);

    }

    let credentials = {
      key: this.s4t_key,
      cert: this.s4t_cert
    };

    this.httpServer = https.createServer(credentials, function(request, response) {
      proxy(request, response, 'request')
    });

  }else{
    //HTTP
    logger.info("[SYSTEM] - WS Reverse Tunnel Server over HTTP.");
    this.httpServer = http.createServer(function(request, response) {
      proxy(request, response, 'request')
    });
  }

  //create websocket
  this.wsServerForControll = new WebSocketServer({
    httpServer: this.httpServer,
    autoAcceptConnections: false
  });

};
let wsport = {}
wst_server_reverse.prototype.start = function(port) {
  wsport = port
  if (https_flag === true)
    logger.info("[SYSTEM] - WS Reverse Tunnel Server starting on: wss://localhost:" + port + " - CERT: \n" + this.s4t_cert);
  else
    logger.info("[SYSTEM] - WS Reverse Tunnel Server starting on: ws://localhost:" + port);

  //Activate HTTP/S server
  this.httpServer.listen(port, function() {
    logger.info("[SYSTEM] - WS Reverse Tunnel Server is listening...");
  });


  this.wsServerForControll.on('request', (function(_this){
    return function(request){

      //Create one TCP server for each client WebSocketRequest
      request.tcpServer = new net.createServer({
        host: 'localhost',
        port: portTcp,
        exclusive: true
      });

      let uri = url.parse(request.httpRequest.url, true);
      src_address = request.httpRequest.client._peername.address.split(":")[3];


      if (uri.query.dst !== undefined){
        let remoteAddr = uri.query.dst;
        ref1 = remoteAddr.split(":");
        portTcp = ref1[1];
        connectServer[`${portTcp}`] = ''

        logger.info("[SYSTEM] WebSocket creation towards " + src_address + " on port " + portTcp );

        request.tcpServer.listen(portTcp);
        logger.info("[SYSTEM] --> TCP server is listening on port " + portTcp);

        request.wsConnectionForControll = request.accept('tunnel-protocol', request.origin);
        logger.info("[SYSTEM] --> WS connection created");

        request.wsConnectionForControll.on('close', function(reasonCode, description) {
          logger.info("[SYSTEM] - WebSocket Controll Peer " + request.wsConnectionForControll.remoteAddress + " disconnected - Reason: ["+reasonCode+"] " + description);
          logger.info("[SYSTEM] --> Close websocket server on port " + portTcp);
          delete connectServer[`${request.resourceURL.path.split(':')[1]}`]
          console.log('####### portTcp close #######', {
            clients:connectServer,
            tcp: request.wsConnectionForControll.remoteAddress,
            portTcp:request.resourceURL.path.split(':')[1]
          })

          // proxy('','','close')
          request.tcpServer.close();
        });
      }
      else {
        //REQUEST FOR WS USED FOR DATA
        logger.info("[SYSTEM] --> WebSocket Request for Data");
        newWSTCP_DATA.emit('created', request);
      }

      //Manage TCP error events
      request.tcpServer.on('error', function(message) {

        if(message.code === "EADDRINUSE"){
          logger.info("[SYSTEM] - Error - Port " + message.port + " already used: connection aborted.");
          request.wsConnectionForControll.close();
        }else
          logger.info("[SYSTEM] - Error establishing TCP connection: " + message);
      });

      //Manage TCP Connection event
      request.tcpServer.on('connection', (function(_this){
        return function(tcpConn) {
          tcpConn.wsConnection;
          tcpConn.pause();
          let idConnection = uuid.v4();
          let msgForNewConnection = "NC:"+idConnection;

          request.wsConnectionForControll.sendUTF(msgForNewConnection);

          let EventManager = (function(_this){

            return function(request){

              try{

                let uri = url.parse(request.httpRequest.url, true);

                if(idConnection === uri.query.id){

                  //tcpConn.wsConnection = wsTCP;
                  tcpConn.wsConnection = request.accept('tunnel-protocol', request.origin);
                  bindSockets(tcpConn.wsConnection, tcpConn);
                  //DEBUG logger.info("Bind ws tcp");

                  //Resuming of the tcp connection after WS Socket is just created
                  tcpConn.resume();
                  //DEBUG logger.info("TCP RESUME");
                  newWSTCP_DATA.removeListener('created', EventManager);
                }

              }catch (err) {
                // handle the error
                logger.info("[SYSTEM] --> ERROR: " + err);
                // proxy('','','close')
                request.tcpServer.close();
                newWSTCP_DATA.removeListener('created', EventManager);
              }

            }

          })(this)

          newWSTCP_DATA.on('created', EventManager);

        }

      })(_this));

    }
  })(this));
};

module.exports = wst_server_reverse;