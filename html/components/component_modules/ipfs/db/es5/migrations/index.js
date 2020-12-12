"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var from021To022 = require('./0.21-0.22');

var migrations = [from021To022];

function run(_x, _x2, _x3) {
  return _run.apply(this, arguments);
}

function _run() {
  _run = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(OrbitDB, options, dbAddress) {
    var i;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            i = 0;

          case 1:
            if (!(i < migrations.length)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return migrations[i](OrbitDB, options, dbAddress);

          case 4:
            i++;
            _context.next = 1;
            break;

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _run.apply(this, arguments);
}

module.exports = {
  run
};