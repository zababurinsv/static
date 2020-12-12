'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var path = require('path');

var EventStore = require('orbit-db-eventstore');

var FeedStore = require('orbit-db-feedstore');

var KeyValueStore = require('orbit-db-kvstore');

var CounterStore = require('orbit-db-counterstore');

var DocumentStore = require('orbit-db-docstore');

var Pubsub = require('orbit-db-pubsub');

var Cache = require('orbit-db-cache');

var Keystore = require('orbit-db-keystore');

var Identities = require('orbit-db-identity-provider');

var AccessControllers = require('orbit-db-access-controllers');

var OrbitDBAddress = require('./orbit-db-address');

var createDBManifest = require('./db-manifest');

var exchangeHeads = require('./exchange-heads');

var _require = require('./utils'),
    isDefined = _require.isDefined,
    io = _require.io;

var Storage = require('orbit-db-storage-adapter');

var migrations = require('./migrations');

var Logger = require('logplease');

var logger = Logger.create('orbit-db');
Logger.setLogLevel('ERROR'); // Mapping for 'database type' -> Class

var databaseTypes = {
  counter: CounterStore,
  eventlog: EventStore,
  feed: FeedStore,
  docstore: DocumentStore,
  keyvalue: KeyValueStore
};

var OrbitDB = /*#__PURE__*/function () {
  function OrbitDB(ipfs, identity) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck2.default)(this, OrbitDB);

    if (!isDefined(ipfs)) {
      throw new Error('IPFS is a required argument. See https://github.com/orbitdb/orbit-db/blob/master/API.md#createinstance');
    }

    if (!isDefined(identity)) {
      throw new Error('identity is a required argument. See https://github.com/orbitdb/orbit-db/blob/master/API.md#createinstance');
    }

    this._ipfs = ipfs;
    this.identity = identity;
    this.id = options.peerId;
    this._pubsub = !options.offline ? options.broker ? new options.broker(this._ipfs) // eslint-disable-line
    : new Pubsub(this._ipfs, this.id) : null;
    this.directory = options.directory || './orbitdb';
    this.storage = options.storage;
    this._directConnections = {};
    this.caches = {};
    this.caches[this.directory] = {
      cache: options.cache,
      handlers: new Set()
    };
    this.keystore = options.keystore;
    this.stores = {}; // AccessControllers module can be passed in to enable
    // testing with orbit-db-access-controller

    AccessControllers = options.AccessControllers || AccessControllers;
  }

  (0, _createClass2.default)(OrbitDB, [{
    key: "feed",

    /* Databases */
    value: function () {
      var _feed = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(address) {
        var options,
            _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
                options = Object.assign({
                  create: true,
                  type: 'feed'
                }, options);
                return _context.abrupt("return", this.open(address, options));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function feed(_x) {
        return _feed.apply(this, arguments);
      }

      return feed;
    }()
  }, {
    key: "log",
    value: function () {
      var _log = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(address) {
        var options,
            _args2 = arguments;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
                options = Object.assign({
                  create: true,
                  type: 'eventlog'
                }, options);
                return _context2.abrupt("return", this.open(address, options));

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function log(_x2) {
        return _log.apply(this, arguments);
      }

      return log;
    }()
  }, {
    key: "eventlog",
    value: function () {
      var _eventlog = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(address) {
        var options,
            _args3 = arguments;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
                return _context3.abrupt("return", this.log(address, options));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function eventlog(_x3) {
        return _eventlog.apply(this, arguments);
      }

      return eventlog;
    }()
  }, {
    key: "keyvalue",
    value: function () {
      var _keyvalue = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(address) {
        var options,
            _args4 = arguments;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
                options = Object.assign({
                  create: true,
                  type: 'keyvalue'
                }, options);
                return _context4.abrupt("return", this.open(address, options));

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function keyvalue(_x4) {
        return _keyvalue.apply(this, arguments);
      }

      return keyvalue;
    }()
  }, {
    key: "kvstore",
    value: function () {
      var _kvstore = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(address) {
        var options,
            _args5 = arguments;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                options = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {};
                return _context5.abrupt("return", this.keyvalue(address, options));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function kvstore(_x5) {
        return _kvstore.apply(this, arguments);
      }

      return kvstore;
    }()
  }, {
    key: "counter",
    value: function () {
      var _counter = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(address) {
        var options,
            _args6 = arguments;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                options = _args6.length > 1 && _args6[1] !== undefined ? _args6[1] : {};
                options = Object.assign({
                  create: true,
                  type: 'counter'
                }, options);
                return _context6.abrupt("return", this.open(address, options));

              case 3:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function counter(_x6) {
        return _counter.apply(this, arguments);
      }

      return counter;
    }()
  }, {
    key: "docs",
    value: function () {
      var _docs = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(address) {
        var options,
            _args7 = arguments;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                options = _args7.length > 1 && _args7[1] !== undefined ? _args7[1] : {};
                options = Object.assign({
                  create: true,
                  type: 'docstore'
                }, options);
                return _context7.abrupt("return", this.open(address, options));

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function docs(_x7) {
        return _docs.apply(this, arguments);
      }

      return docs;
    }()
  }, {
    key: "docstore",
    value: function () {
      var _docstore = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8(address) {
        var options,
            _args8 = arguments;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                options = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : {};
                return _context8.abrupt("return", this.docs(address, options));

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function docstore(_x8) {
        return _docstore.apply(this, arguments);
      }

      return docstore;
    }()
  }, {
    key: "disconnect",
    value: function () {
      var _disconnect = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee9() {
        var _this = this;

        var databases, _i, _databases, db, caches, _i2, _caches, directory, removeDirectConnect;

        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.keystore.close();

              case 2:
                // Close all open databases
                databases = Object.values(this.stores);
                _i = 0, _databases = databases;

              case 4:
                if (!(_i < _databases.length)) {
                  _context9.next = 12;
                  break;
                }

                db = _databases[_i];
                _context9.next = 8;
                return db.close();

              case 8:
                delete this.stores[db.address.toString()];

              case 9:
                _i++;
                _context9.next = 4;
                break;

              case 12:
                caches = Object.keys(this.caches);
                _i2 = 0, _caches = caches;

              case 14:
                if (!(_i2 < _caches.length)) {
                  _context9.next = 22;
                  break;
                }

                directory = _caches[_i2];
                _context9.next = 18;
                return this.caches[directory].cache.close();

              case 18:
                delete this.caches[directory];

              case 19:
                _i2++;
                _context9.next = 14;
                break;

              case 22:
                // Close a direct connection and remove it from internal state
                removeDirectConnect = function removeDirectConnect(e) {
                  _this._directConnections[e].close();

                  delete _this._directConnections[e];
                }; // Close all direct connections to peers


                Object.keys(this._directConnections).forEach(removeDirectConnect); // Disconnect from pubsub

                if (!this._pubsub) {
                  _context9.next = 27;
                  break;
                }

                _context9.next = 27;
                return this._pubsub.disconnect();

              case 27:
                // Remove all databases from the state
                this.stores = {};

              case 28:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function disconnect() {
        return _disconnect.apply(this, arguments);
      }

      return disconnect;
    }() // Alias for disconnect()

  }, {
    key: "stop",
    value: function () {
      var _stop = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee10() {
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.disconnect();

              case 2:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function stop() {
        return _stop.apply(this, arguments);
      }

      return stop;
    }()
  }, {
    key: "_createCache",
    value: function () {
      var _createCache2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee11(path) {
        var cacheStorage;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.storage.createStore(path);

              case 2:
                cacheStorage = _context11.sent;
                return _context11.abrupt("return", new Cache(cacheStorage));

              case 4:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function _createCache(_x9) {
        return _createCache2.apply(this, arguments);
      }

      return _createCache;
    }()
    /* Private methods */

  }, {
    key: "_createStore",
    value: function () {
      var _createStore2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee12(type, address, options) {
        var Store, accessController, opts, identity, store, addr;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                // Get the type -> class mapping
                Store = databaseTypes[type];

                if (Store) {
                  _context12.next = 3;
                  break;
                }

                throw new Error("Invalid database type '".concat(type, "'"));

              case 3:
                if (!options.accessControllerAddress) {
                  _context12.next = 7;
                  break;
                }

                _context12.next = 6;
                return AccessControllers.resolve(this, options.accessControllerAddress, options.accessController);

              case 6:
                accessController = _context12.sent;

              case 7:
                opts = Object.assign({
                  replicate: true
                }, options, {
                  accessController: accessController,
                  cache: options.cache,
                  onClose: this._onClose.bind(this),
                  onDrop: this._onDrop.bind(this),
                  onLoad: this._onLoad.bind(this)
                });
                identity = options.identity || this.identity;
                store = new Store(this._ipfs, identity, address, opts);
                store.events.on('write', this._onWrite.bind(this)); // ID of the store is the address as a string

                addr = address.toString();
                this.stores[addr] = store; // Subscribe to pubsub to get updates from peers,
                // this is what hooks us into the message propagation layer
                // and the p2p network

                if (!(opts.replicate && this._pubsub)) {
                  _context12.next = 16;
                  break;
                }

                _context12.next = 16;
                return this._pubsub.subscribe(addr, this._onMessage.bind(this), this._onPeerConnected.bind(this));

              case 16:
                return _context12.abrupt("return", store);

              case 17:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function _createStore(_x10, _x11, _x12) {
        return _createStore2.apply(this, arguments);
      }

      return _createStore;
    }() // Callback for local writes to the database. We the update to pubsub.

  }, {
    key: "_onWrite",
    value: function _onWrite(address, entry, heads) {
      if (!heads) throw new Error("'heads' not defined");
      if (this._pubsub) this._pubsub.publish(address, heads);
    } // Callback for receiving a message from the network

  }, {
    key: "_onMessage",
    value: function () {
      var _onMessage2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee13(address, heads, peer) {
        var store;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                store = this.stores[address];
                _context13.prev = 1;
                logger.debug("Received ".concat(heads.length, " heads for '").concat(address, "':\n"), JSON.stringify(heads.map(function (e) {
                  return e.hash;
                }), null, 2));

                if (!(store && heads)) {
                  _context13.next = 8;
                  break;
                }

                if (!(heads.length > 0)) {
                  _context13.next = 7;
                  break;
                }

                _context13.next = 7;
                return store.sync(heads);

              case 7:
                store.events.emit('peer.exchanged', peer, address, heads);

              case 8:
                _context13.next = 13;
                break;

              case 10:
                _context13.prev = 10;
                _context13.t0 = _context13["catch"](1);
                logger.error(_context13.t0);

              case 13:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[1, 10]]);
      }));

      function _onMessage(_x13, _x14, _x15) {
        return _onMessage2.apply(this, arguments);
      }

      return _onMessage;
    }() // Callback for when a peer connected to a database

  }, {
    key: "_onPeerConnected",
    value: function () {
      var _onPeerConnected2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee14(address, peer) {
        var _this2 = this;

        var getStore, getDirectConnection, onChannelCreated, onMessage;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                logger.debug("New peer '".concat(peer, "' connected to '").concat(address, "'"));

                getStore = function getStore(address) {
                  return _this2.stores[address];
                };

                getDirectConnection = function getDirectConnection(peer) {
                  return _this2._directConnections[peer];
                };

                onChannelCreated = function onChannelCreated(channel) {
                  _this2._directConnections[channel._receiverID] = channel;
                };

                onMessage = function onMessage(address, heads) {
                  return _this2._onMessage(address, heads, peer);
                };

                _context14.next = 7;
                return exchangeHeads(this._ipfs, address, peer, getStore, getDirectConnection, onMessage, onChannelCreated);

              case 7:
                if (getStore(address)) {
                  getStore(address).events.emit('peer', peer);
                }

              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function _onPeerConnected(_x16, _x17) {
        return _onPeerConnected2.apply(this, arguments);
      }

      return _onPeerConnected;
    }() // Callback when database was closed

  }, {
    key: "_onClose",
    value: function () {
      var _onClose2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee15(db) {
        var address, store, dir, cache;
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                address = db.address.toString();
                logger.debug("Close ".concat(address)); // Unsubscribe from pubsub

                if (!this._pubsub) {
                  _context15.next = 5;
                  break;
                }

                _context15.next = 5;
                return this._pubsub.unsubscribe(address);

              case 5:
                store = this.stores[address];
                dir = store && store.options.directory ? store.options.directory : this.directory;
                cache = this.caches[dir];

                if (!(cache && cache.handlers.has(address))) {
                  _context15.next = 13;
                  break;
                }

                cache.handlers.delete(address);

                if (cache.handlers.size) {
                  _context15.next = 13;
                  break;
                }

                _context15.next = 13;
                return cache.cache.close();

              case 13:
                delete this.stores[address];

              case 14:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function _onClose(_x18) {
        return _onClose2.apply(this, arguments);
      }

      return _onClose;
    }()
  }, {
    key: "_onDrop",
    value: function () {
      var _onDrop2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee16(db) {
        var address, dir;
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                address = db.address.toString();
                dir = db && db.options.directory ? db.options.directory : this.directory;
                _context16.next = 4;
                return this._requestCache(address, dir, db._cache);

              case 4:
                this.stores[address] = db;

              case 5:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function _onDrop(_x19) {
        return _onDrop2.apply(this, arguments);
      }

      return _onDrop;
    }()
  }, {
    key: "_onLoad",
    value: function () {
      var _onLoad2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee17(db) {
        var address, dir;
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                address = db.address.toString();
                dir = db && db.options.directory ? db.options.directory : this.directory;
                _context17.next = 4;
                return this._requestCache(address, dir, db._cache);

              case 4:
                this.stores[address] = db;

              case 5:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function _onLoad(_x20) {
        return _onLoad2.apply(this, arguments);
      }

      return _onLoad;
    }()
  }, {
    key: "_determineAddress",
    value: function () {
      var _determineAddress2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee18(name, type) {
        var options,
            accessControllerAddress,
            manifestHash,
            _args18 = arguments;
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                options = _args18.length > 2 && _args18[2] !== undefined ? _args18[2] : {};

                if (OrbitDB.isValidType(type)) {
                  _context18.next = 3;
                  break;
                }

                throw new Error("Invalid database type '".concat(type, "'"));

              case 3:
                if (!OrbitDBAddress.isValid(name)) {
                  _context18.next = 5;
                  break;
                }

                throw new Error('Given database name is an address. Please give only the name of the database!');

              case 5:
                // Create an AccessController, use IPFS AC as the default
                options.accessController = Object.assign({}, {
                  name: name,
                  type: 'ipfs'
                }, options.accessController);
                _context18.next = 8;
                return AccessControllers.create(this, options.accessController.type, options.accessController || {});

              case 8:
                accessControllerAddress = _context18.sent;
                _context18.next = 11;
                return createDBManifest(this._ipfs, name, type, accessControllerAddress, options);

              case 11:
                manifestHash = _context18.sent;
                return _context18.abrupt("return", OrbitDBAddress.parse(OrbitDBAddress.join(manifestHash, name)));

              case 13:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function _determineAddress(_x21, _x22) {
        return _determineAddress2.apply(this, arguments);
      }

      return _determineAddress;
    }()
    /* Create and Open databases */

    /*
      options = {
        accessController: { write: [] } // array of keys that can write to this database
        overwrite: false, // whether we should overwrite the existing database if it exists
      }
    */

  }, {
    key: "create",
    value: function () {
      var _create = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee19(name, type) {
        var options,
            dbAddress,
            haveDB,
            _args19 = arguments;
        return _regenerator.default.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                options = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : {};
                logger.debug('create()');
                logger.debug("Creating database '".concat(name, "' as ").concat(type)); // Create the database address

                _context19.next = 5;
                return this._determineAddress(name, type, options);

              case 5:
                dbAddress = _context19.sent;
                _context19.next = 8;
                return this._requestCache(dbAddress.toString(), options.directory);

              case 8:
                options.cache = _context19.sent;
                _context19.next = 11;
                return this._haveLocalData(options.cache, dbAddress);

              case 11:
                haveDB = _context19.sent;

                if (!(haveDB && !options.overwrite)) {
                  _context19.next = 14;
                  break;
                }

                throw new Error("Database '".concat(dbAddress, "' already exists!"));

              case 14:
                _context19.next = 16;
                return this._migrate(options, dbAddress);

              case 16:
                _context19.next = 18;
                return this._addManifestToCache(options.cache, dbAddress);

              case 18:
                logger.debug("Created database '".concat(dbAddress, "'")); // Open the database

                return _context19.abrupt("return", this.open(dbAddress, options));

              case 20:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function create(_x23, _x24) {
        return _create.apply(this, arguments);
      }

      return create;
    }()
  }, {
    key: "determineAddress",
    value: function () {
      var _determineAddress3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee20(name, type) {
        var options,
            opts,
            _args20 = arguments;
        return _regenerator.default.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                options = _args20.length > 2 && _args20[2] !== undefined ? _args20[2] : {};
                opts = Object.assign({}, {
                  onlyHash: true
                }, options);
                return _context20.abrupt("return", this._determineAddress(name, type, opts));

              case 3:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function determineAddress(_x25, _x26) {
        return _determineAddress3.apply(this, arguments);
      }

      return determineAddress;
    }()
  }, {
    key: "_requestCache",
    value: function () {
      var _requestCache2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee21(address, directory, existingCache) {
        var dir, newCache, cache;
        return _regenerator.default.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                dir = directory || this.directory;

                if (this.caches[dir]) {
                  _context21.next = 9;
                  break;
                }

                _context21.t0 = existingCache;

                if (_context21.t0) {
                  _context21.next = 7;
                  break;
                }

                _context21.next = 6;
                return this._createCache(dir);

              case 6:
                _context21.t0 = _context21.sent;

              case 7:
                newCache = _context21.t0;
                this.caches[dir] = {
                  cache: newCache,
                  handlers: new Set()
                };

              case 9:
                this.caches[dir].handlers.add(address);
                cache = this.caches[dir].cache; // "Wake up" the caches if they need it

                if (!cache) {
                  _context21.next = 14;
                  break;
                }

                _context21.next = 14;
                return cache.open();

              case 14:
                return _context21.abrupt("return", cache);

              case 15:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function _requestCache(_x27, _x28, _x29) {
        return _requestCache2.apply(this, arguments);
      }

      return _requestCache;
    }()
    /*
        options = {
          localOnly: false // if set to true, throws an error if database can't be found locally
          create: false // whether to create the database
          type: TODO
          overwrite: TODO
         }
     */

  }, {
    key: "open",
    value: function () {
      var _open = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee22(address) {
        var options,
            dbAddress,
            haveDB,
            manifest,
            _args22 = arguments;
        return _regenerator.default.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                options = _args22.length > 1 && _args22[1] !== undefined ? _args22[1] : {};
                logger.debug('open()');
                options = Object.assign({
                  localOnly: false,
                  create: false
                }, options);
                logger.debug("Open database '".concat(address, "'")); // If address is just the name of database, check the options to crate the database

                if (OrbitDBAddress.isValid(address)) {
                  _context22.next = 16;
                  break;
                }

                if (options.create) {
                  _context22.next = 9;
                  break;
                }

                throw new Error('\'options.create\' set to \'false\'. If you want to create a database, set \'options.create\' to \'true\'.');

              case 9:
                if (!(options.create && !options.type)) {
                  _context22.next = 13;
                  break;
                }

                throw new Error("Database type not provided! Provide a type with 'options.type' (".concat(OrbitDB.databaseTypes.join('|'), ")"));

              case 13:
                logger.warn("Not a valid OrbitDB address '".concat(address, "', creating the database"));
                options.overwrite = options.overwrite ? options.overwrite : true;
                return _context22.abrupt("return", this.create(address, options.type, options));

              case 16:
                // Parse the database address
                dbAddress = OrbitDBAddress.parse(address);
                _context22.next = 19;
                return this._requestCache(dbAddress.toString(), options.directory);

              case 19:
                options.cache = _context22.sent;
                _context22.next = 22;
                return this._haveLocalData(options.cache, dbAddress);

              case 22:
                haveDB = _context22.sent;
                logger.debug((haveDB ? 'Found' : 'Didn\'t find') + " database '".concat(dbAddress, "'")); // If we want to try and open the database local-only, throw an error
                // if we don't have the database locally

                if (!(options.localOnly && !haveDB)) {
                  _context22.next = 27;
                  break;
                }

                logger.warn("Database '".concat(dbAddress, "' doesn't exist!"));
                throw new Error("Database '".concat(dbAddress, "' doesn't exist!"));

              case 27:
                logger.debug("Loading Manifest for '".concat(dbAddress, "'")); // Get the database manifest from IPFS

                _context22.next = 30;
                return io.read(this._ipfs, dbAddress.root);

              case 30:
                manifest = _context22.sent;
                logger.debug("Manifest for '".concat(dbAddress, "':\n").concat(JSON.stringify(manifest, null, 2))); // Make sure the type from the manifest matches the type that was given as an option

                if (!(manifest.name !== dbAddress.path)) {
                  _context22.next = 34;
                  break;
                }

                throw new Error("Manifest '".concat(manifest.name, "' cannot be opened as '").concat(dbAddress.path, "'"));

              case 34:
                if (!(options.type && manifest.type !== options.type)) {
                  _context22.next = 36;
                  break;
                }

                throw new Error("Database '".concat(dbAddress, "' is type '").concat(manifest.type, "' but was opened as '").concat(options.type, "'"));

              case 36:
                _context22.next = 38;
                return this._addManifestToCache(options.cache, dbAddress);

              case 38:
                // Open the the database
                options = Object.assign({}, options, {
                  accessControllerAddress: manifest.accessController,
                  meta: manifest.meta
                });
                return _context22.abrupt("return", this._createStore(manifest.type, dbAddress, options));

              case 40:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function open(_x30) {
        return _open.apply(this, arguments);
      }

      return open;
    }() // Save the database locally

  }, {
    key: "_addManifestToCache",
    value: function () {
      var _addManifestToCache2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee23(cache, dbAddress) {
        return _regenerator.default.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                _context23.next = 2;
                return cache.set(path.join(dbAddress.toString(), '_manifest'), dbAddress.root);

              case 2:
                logger.debug("Saved manifest to IPFS as '".concat(dbAddress.root, "'"));

              case 3:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23);
      }));

      function _addManifestToCache(_x31, _x32) {
        return _addManifestToCache2.apply(this, arguments);
      }

      return _addManifestToCache;
    }()
    /**
     * Check if we have the database, or part of it, saved locally
     * @param  {[Cache]} cache [The OrbitDBCache instance containing the local data]
     * @param  {[OrbitDBAddress]} dbAddress [Address of the database to check]
     * @return {[Boolean]} [Returns true if we have cached the db locally, false if not]
     */

  }, {
    key: "_haveLocalData",
    value: function () {
      var _haveLocalData2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee24(cache, dbAddress) {
        var addr, data;
        return _regenerator.default.wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                if (cache) {
                  _context24.next = 2;
                  break;
                }

                return _context24.abrupt("return", false);

              case 2:
                addr = dbAddress.toString();
                _context24.next = 5;
                return cache.get(path.join(addr, '_manifest'));

              case 5:
                data = _context24.sent;
                return _context24.abrupt("return", data !== undefined && data !== null);

              case 7:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24);
      }));

      function _haveLocalData(_x33, _x34) {
        return _haveLocalData2.apply(this, arguments);
      }

      return _haveLocalData;
    }()
    /**
     * Runs all migrations inside the src/migration folder
     * @param Object options  Options to pass into the migration
     * @param OrbitDBAddress dbAddress Address of database in OrbitDBAddress format
     */

  }, {
    key: "_migrate",
    value: function () {
      var _migrate2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee25(options, dbAddress) {
        return _regenerator.default.wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return migrations.run(this, options, dbAddress);

              case 2:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function _migrate(_x35, _x36) {
        return _migrate2.apply(this, arguments);
      }

      return _migrate;
    }()
    /**
     * Returns supported database types as an Array of strings
     * Eg. [ 'counter', 'eventlog', 'feed', 'docstore', 'keyvalue']
     * @return {[Array]} [Supported database types]
     */

  }, {
    key: "cache",
    get: function get() {
      return this.caches[this.directory].cache;
    }
  }], [{
    key: "createInstance",
    value: function () {
      var _createInstance = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee26(ipfs) {
        var options,
            _ref,
            id,
            storageOptions,
            keystorePath,
            keyStorage,
            cachePath,
            cacheStorage,
            finalOptions,
            _args26 = arguments;

        return _regenerator.default.wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                options = _args26.length > 1 && _args26[1] !== undefined ? _args26[1] : {};

                if (isDefined(ipfs)) {
                  _context26.next = 3;
                  break;
                }

                throw new Error('IPFS is a required argument. See https://github.com/orbitdb/orbit-db/blob/master/API.md#createinstance');

              case 3:
                if (options.offline === undefined) {
                  options.offline = false;
                }

                if (!(options.offline && !options.id)) {
                  _context26.next = 6;
                  break;
                }

                throw new Error('Offline mode requires passing an `id` in the options');

              case 6:
                if (!options.offline) {
                  _context26.next = 10;
                  break;
                }

                _context26.t0 = {
                  id: options.id
                };
                _context26.next = 13;
                break;

              case 10:
                _context26.next = 12;
                return ipfs.id();

              case 12:
                _context26.t0 = _context26.sent;

              case 13:
                _ref = _context26.t0;
                id = _ref.id;

                if (!options.directory) {
                  options.directory = './orbitdb';
                }

                if (!options.storage) {
                  storageOptions = {}; // Create default `level` store

                  options.storage = Storage(null, storageOptions);
                }

                if (options.identity && options.identity.provider.keystore) {
                  options.keystore = options.identity.provider.keystore;
                }

                if (options.keystore) {
                  _context26.next = 24;
                  break;
                }

                keystorePath = path.join(options.directory, id, '/keystore');
                _context26.next = 22;
                return options.storage.createStore(keystorePath);

              case 22:
                keyStorage = _context26.sent;
                options.keystore = new Keystore(keyStorage);

              case 24:
                if (options.identity) {
                  _context26.next = 28;
                  break;
                }

                _context26.next = 27;
                return Identities.createIdentity({
                  id: options.id || id,
                  keystore: options.keystore
                });

              case 27:
                options.identity = _context26.sent;

              case 28:
                if (options.cache) {
                  _context26.next = 34;
                  break;
                }

                cachePath = path.join(options.directory, id, '/cache');
                _context26.next = 32;
                return options.storage.createStore(cachePath);

              case 32:
                cacheStorage = _context26.sent;
                options.cache = new Cache(cacheStorage);

              case 34:
                finalOptions = Object.assign({}, options, {
                  peerId: id
                });
                return _context26.abrupt("return", new OrbitDB(ipfs, options.identity, finalOptions));

              case 36:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26);
      }));

      function createInstance(_x37) {
        return _createInstance.apply(this, arguments);
      }

      return createInstance;
    }()
  }, {
    key: "isValidType",
    value: function isValidType(type) {
      return Object.keys(databaseTypes).includes(type);
    }
  }, {
    key: "addDatabaseType",
    value: function addDatabaseType(type, store) {
      if (databaseTypes[type]) throw new Error("Type already exists: ".concat(type));
      databaseTypes[type] = store;
    }
  }, {
    key: "getDatabaseTypes",
    value: function getDatabaseTypes() {
      return databaseTypes;
    }
  }, {
    key: "isValidAddress",
    value: function isValidAddress(address) {
      return OrbitDBAddress.isValid(address);
    }
  }, {
    key: "parseAddress",
    value: function parseAddress(address) {
      return OrbitDBAddress.parse(address);
    }
  }, {
    key: "Pubsub",
    get: function get() {
      return Pubsub;
    }
  }, {
    key: "Cache",
    get: function get() {
      return Cache;
    }
  }, {
    key: "Keystore",
    get: function get() {
      return Keystore;
    }
  }, {
    key: "Identities",
    get: function get() {
      return Identities;
    }
  }, {
    key: "AccessControllers",
    get: function get() {
      return AccessControllers;
    }
  }, {
    key: "Storage",
    get: function get() {
      return Storage;
    }
  }, {
    key: "OrbitDBAddress",
    get: function get() {
      return OrbitDBAddress;
    }
  }, {
    key: "EventStore",
    get: function get() {
      return EventStore;
    }
  }, {
    key: "FeedStore",
    get: function get() {
      return FeedStore;
    }
  }, {
    key: "KeyValueStore",
    get: function get() {
      return KeyValueStore;
    }
  }, {
    key: "CounterStore",
    get: function get() {
      return CounterStore;
    }
  }, {
    key: "DocumentStore",
    get: function get() {
      return DocumentStore;
    }
  }, {
    key: "databaseTypes",
    get: function get() {
      return Object.keys(databaseTypes);
    }
  }]);
  return OrbitDB;
}();

OrbitDB.prototype.AccessControllers = AccessControllers;
OrbitDB.prototype.Identities = Identities;
OrbitDB.prototype.Keystore = Keystore;
module.exports = OrbitDB;