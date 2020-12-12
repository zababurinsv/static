"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var path = require('path');

var fs = require('../fs-shim');

var Cache = require('orbit-db-cache');

var Logger = require('logplease');

var logger = Logger.create('orbit-db');
Logger.setLogLevel('ERROR');

function migrate(_x, _x2, _x3) {
  return _migrate.apply(this, arguments);
}

function _migrate() {
  _migrate = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(OrbitDB, options, dbAddress) {
    var oldCache, oldStore, addr, _localHeads, keyRoot, migrationKeys, i, key, val;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            oldCache = OrbitDB.caches[options.directory] ? OrbitDB.caches[options.directory].cache : null;

            if (oldCache) {
              _context.next = 9;
              break;
            }

            addr = (path.posix || path).join(OrbitDB.directory, dbAddress.root, dbAddress.path);

            if (!(fs && fs.existsSync && !fs.existsSync(addr))) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:
            _context.next = 7;
            return OrbitDB.storage.createStore(addr);

          case 7:
            oldStore = _context.sent;
            oldCache = new Cache(oldStore);

          case 9:
            _context.next = 11;
            return oldCache.get('_localHeads');

          case 11:
            _localHeads = _context.sent;

            if (_localHeads) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return");

          case 14:
            keyRoot = dbAddress.toString();
            logger.debug('Attempting to migrate from old cache location');
            migrationKeys = ['_remoteHeads', '_localHeads', 'snapshot', 'queue'];
            _context.t0 = _regenerator.default.keys(migrationKeys);

          case 18:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 35;
              break;
            }

            i = _context.t1.value;
            _context.prev = 20;
            key = path.join(keyRoot, migrationKeys[i]);
            _context.next = 24;
            return oldCache.get(migrationKeys[i]);

          case 24:
            val = _context.sent;

            if (!val) {
              _context.next = 28;
              break;
            }

            _context.next = 28;
            return options.cache.set(key, val);

          case 28:
            _context.next = 33;
            break;

          case 30:
            _context.prev = 30;
            _context.t2 = _context["catch"](20);
            logger.debug(_context.t2.message);

          case 33:
            _context.next = 18;
            break;

          case 35:
            _context.next = 37;
            return options.cache.set(path.join(keyRoot, '_manifest'), dbAddress.root);

          case 37:
            if (!oldStore) {
              _context.next = 40;
              break;
            }

            _context.next = 40;
            return oldStore.close();

          case 40:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[20, 30]]);
  }));
  return _migrate.apply(this, arguments);
}

module.exports = migrate;