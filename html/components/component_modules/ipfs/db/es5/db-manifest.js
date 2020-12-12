"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var path = require('path');

var io = require('orbit-db-io'); // Creates a DB manifest file and saves it in IPFS


var createDBManifest = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(ipfs, name, type, accessControllerAddress, options) {
    var manifest;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            manifest = Object.assign({
              name: name,
              type: type,
              accessController: (path.posix || path).join('/ipfs', accessControllerAddress)
            }, // meta field is only added to manifest if options.meta is defined
            options.meta !== undefined ? {
              meta: options.meta
            } : {});
            return _context.abrupt("return", io.write(ipfs, options.format || 'dag-cbor', manifest, options));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createDBManifest(_x, _x2, _x3, _x4, _x5) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = createDBManifest;