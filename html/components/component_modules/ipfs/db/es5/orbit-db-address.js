'use strict';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var path = require('path');

var CID = require('cids');

var notEmpty = function notEmpty(e) {
  return e !== '' && e !== ' ';
};

var OrbitDBAddress = /*#__PURE__*/function () {
  function OrbitDBAddress(root, path) {
    (0, _classCallCheck2.default)(this, OrbitDBAddress);
    this.root = root;
    this.path = path;
  }

  (0, _createClass2.default)(OrbitDBAddress, [{
    key: "toString",
    value: function toString() {
      return OrbitDBAddress.join(this.root, this.path);
    }
  }], [{
    key: "isValid",
    value: function isValid(address) {
      address = address.toString().replace(/\\/g, '/');

      var containsProtocolPrefix = function containsProtocolPrefix(e, i) {
        return !((i === 0 || i === 1) && address.toString().indexOf('/orbit') === 0 && e === 'orbitdb');
      };

      var parts = address.toString().split('/').filter(containsProtocolPrefix).filter(notEmpty);
      var accessControllerHash;

      var validateHash = function validateHash(hash) {
        var prefixes = ['zd', 'Qm', 'ba', 'k5'];

        for (var _i = 0, _prefixes = prefixes; _i < _prefixes.length; _i++) {
          var p = _prefixes[_i];

          if (hash.indexOf(p) > -1) {
            return true;
          }
        }

        return false;
      };

      try {
        accessControllerHash = validateHash(parts[0]) ? new CID(parts[0]).toBaseEncodedString() : null;
      } catch (e) {
        return false;
      }

      return accessControllerHash !== null;
    }
  }, {
    key: "parse",
    value: function parse(address) {
      if (!address) {
        throw new Error("Not a valid OrbitDB address: ".concat(address));
      }

      if (!OrbitDBAddress.isValid(address)) {
        throw new Error("Not a valid OrbitDB address: ".concat(address));
      }

      address = address.toString().replace(/\\/g, '/');
      var parts = address.toString().split('/').filter(function (e, i) {
        return !((i === 0 || i === 1) && address.toString().indexOf('/orbit') === 0 && e === 'orbitdb');
      }).filter(function (e) {
        return e !== '' && e !== ' ';
      });
      return new OrbitDBAddress(parts[0], parts.slice(1, parts.length).join('/'));
    }
  }, {
    key: "join",
    value: function join() {
      var _ref;

      for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
      }

      return (_ref = path.posix || path).join.apply(_ref, ['/orbitdb'].concat(paths));
    }
  }]);
  return OrbitDBAddress;
}();

module.exports = OrbitDBAddress;