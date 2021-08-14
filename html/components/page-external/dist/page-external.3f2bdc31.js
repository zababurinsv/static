// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"5LOEx":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "2d5f3f9c2d97ad1398bb95d23f2bdc31";
// @flow
/*global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE*/
/*::
import type {
HMRAsset,
HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
(string): mixed;
cache: {|[string]: ParcelModule|};
hotData: mixed;
Module: any;
parent: ?ParcelRequire;
isParcelRequire: true;
modules: {|[string]: [Function, {|[string]: string|}]|};
HMR_BUNDLE_ID: string;
root: ParcelRequire;
}
interface ParcelModule {
hot: {|
data: mixed,
accept(cb: (Function) => void): void,
dispose(cb: (mixed) => void): void,
// accept(deps: Array<string> | string, cb: (Function) => void): void,
// decline(): void,
_acceptCallbacks: Array<(Function) => void>,
_disposeCallbacks: Array<(mixed) => void>,
|};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || (function () {}));
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
  return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
  return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = getHostname();
  var port = getPort();
  var protocol = HMR_SECURE || location.protocol == 'https:' && !(/localhost|127.0.0.1|0.0.0.0/).test(hostname) ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
  // $FlowFixMe
  ws.onmessage = function (event) {
    checkedAssets = {
      /*: {|[string]: boolean|}*/
    };
    acceptedAssets = {
      /*: {|[string]: boolean|}*/
    };
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH);
      // Handle HMR Update
      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        if (didAccept) {
          handled = true;
        }
      });
      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(module.bundle.root, asset);
        });
        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];
          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }
    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      }
      // Render the fancy html overlay
      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      // $FlowFixMe
      document.body.appendChild(overlay);
    }
  };
  ws.onerror = function (e) {
    console.error(e.message);
  };
  ws.onclose = function (e) {
    if (undefined !== 'test') {
      console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}
function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }
  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]>*/
{
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    if (link.parentNode !== null) {
      // $FlowFixMe
      link.parentNode.removeChild(link);
    }
  };
  newLink.setAttribute('href', // $FlowFixMe
  link.getAttribute('href').split('?')[0] + '?' + Date.now());
  // $FlowFixMe
  link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }
  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      // $FlowFixMe[incompatible-type]
      var href = links[i].getAttribute('href');
      var hostname = getHostname();
      var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
      var absolute = (/^https?:\/\//i).test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
      if (!absolute) {
        updateLink(links[i]);
      }
    }
    cssTimeout = null;
  }, 50);
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (asset.type === 'css') {
    reloadCSS();
    return;
  }
  let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
  if (deps) {
    var fn = new Function('require', 'module', 'exports', asset.output);
    modules[asset.id] = [fn, deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
    // If we reached the root bundle without finding where the asset should go,
    // there's nothing to do. Mark as "accepted" so we don't reload the page.
    if (!bundle.parent) {
      return true;
    }
    return hmrAcceptCheck(bundle.parent, id, depsByBundle);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(module.bundle.root, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1], null);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(module.bundle.root, id);
      });
      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }
  acceptedAssets[id] = true;
}

},{}],"6g7HQ":[function(require,module,exports) {
var Jason = function(options, jason) {
  var node = {
    $type: "div",
    class: "jason",
    slot: "jason",
    _body: null,
    _styles: null,
    $init: function() {
      if (jason) {
        this._update(jason);
      } else {
        this.classList.add("hidden");
      }
      this.style.minHeight = window.innerHeight;
    },
    $update: function() {
      // Style
      var b = this._body;
      if (b.background) {
        if (typeof b.background === 'string') {
          if (/http/.test(b.background)) {
            this.style.backgroundImage = "url(" + b.background + ")";
            this.style.backgroundSize = "cover";
          } else {
            this.style.backgroundColor = b.background;
          }
        } else {
          if (b.background.type === 'html') {
            this.querySelector(".webcontainer")._update(b.background);
          }
        }
      } else if (b.style && b.style.background) {
        if (typeof b.style.background === 'string') {
          if (/http/.test(b.style.background)) {
            this.style.backgroundImage = "url(" + b.style.background + ")";
            this.style.backgroundSize = "cover";
          } else {
            this.style.backgroundColor = b.style.background;
          }
        } else {
          // advanced type (object type)
          if (b.style.background.type === 'html') {
            this.querySelector(".webcontainer")._update(b.style.background);
          }
        }
      }
      if (this._styles) {
        this.querySelector("style")._update(this._styles);
      }
    },
    _draw: function(body) {
      this._body = body;
      this.querySelector(".sections")._update(this._body);
      this.querySelector(".layers")._update(this._body);
      this.querySelector(".header")._update(this._body);
      this.querySelector(".footer")._update(this._body);
    },
    _update: function(root){
      var self = this;
      // Declare mixins with '$jason.head.type = "mixin"'
      if (root && root.$jason && root.$jason.head && root.$jason.head.type === "mixin") {
        self.classList.add("hidden");
        return;
      }

      Mixin.loaded = [];
      Mixin.parse(root)
      .then(function(root) {
          var head = root.$jason.head;
          var body = root.$jason.body;
          if (body) {
          self.classList.remove("hidden");
          self._draw(body);
        } else {
          self.classList.add("hidden");
        }
        if (head) {
          if (head.templates && head.templates.body && head.data) {
            var parsed = ST.transform(head.templates.body, head.data);
            if (parsed) {
              self.classList.remove("hidden");
              self._draw(parsed);
            } else {
              self.classList.add("hidden");
            }
          }
          if (head.styles) {
            self._styles = head.styles;
          }
        }
      })
      .catch(function(err) {
        console.log("Error", err);
        self.classList.add("hidden");
      })
    },
    $components: [
      Css,
      Header,
      Sections,
      Layers,
      Footer,
      WebContainer
    ]
  }
  if (options) {
    Object.keys(options).forEach(function(key) {
      if (key === 'class') {
        console.assert(false)
        node.class = "jason" + options[key];
      } else {
        node[key] = options[key];
      }
    })
  }
  return node;
}

Components = {
  slider: function(o) {
    var style = undefined;
    if (o.style) {
      style = {
        width: o.style.width ? o.style.width + 'px' : undefined,
        height: o.style.height ? o.style.height + 'px' : undefined
      }
    }
    return Utils.clean({
      $type: "input",
      type: "range",
      value: o.value,
      class: o.className,
      style: Utils.clean(style)
    })
  },
  textfield: function(o) {
    var style = undefined;
    if (o.style) {
      style = {
        background: o.style.background,
        width: o.style.width ? o.style.width + 'px' : undefined,
        height: o.style.height ? o.style.height + 'px' : undefined,
        padding: o.style.padding ? o.style.padding + 'px' : undefined,
        paddingLeft: o.style.padding_left ? o.style.padding_left + 'px' : undefined,
        paddingRight: o.style.padding_right ? o.style.padding_right + 'px' : undefined,
        paddingTop: o.style.padding_top ? o.style.padding_top + 'px' : undefined,
        paddingBottom: o.style.padding_bottom ? o.style.padding_bottom + 'px' : undefined,
        color: o.style.color,
        fontFamily: o.style.font,
        fontSize: o.style.size ? o.style.size + 'px' : undefined,
        textAlign: o.style.align
      }
    }
    return Utils.clean({
      $type: "input",
      type: o.type,
      value: o.value,
      class: o.className,
      style: Utils.clean(style),
      placeholder: o.placeholder
    })
  },
  textarea: function(o) {
    var style = undefined;
    if (o.style) {
      style = {
        background: o.style.background,
        width: o.style.width ? o.style.width + 'px' : undefined,
        height: o.style.height ? o.style.height + 'px' : undefined,
        padding: o.style.padding ? o.style.padding + 'px' : undefined,
        paddingLeft: o.style.padding_left ? o.style.padding_left + 'px' : undefined,
        paddingRight: o.style.padding_right ? o.style.padding_right + 'px' : undefined,
        paddingTop: o.style.padding_top ? o.style.padding_top + 'px' : undefined,
        paddingBottom: o.style.padding_bottom ? o.style.padding_bottom + 'px' : undefined,
        color: o.style.color,
        fontFamily: o.style.font,
        fontSize: o.style.size ? o.style.size + 'px' : undefined,
        textAlign: o.style.align
      }
    }
    return Utils.clean({
      $type: "textarea",
      value: o.value,
      class: o.className,
      style: Utils.clean(style),
      placeholder: o.placeholder
    })
  },
  button: function(o) {
    var style = undefined;
    if (o.style) {
      style = {
        background: o.style.background,
        width: o.style.width ? o.style.width + 'px' : undefined,
        height: o.style.height ? o.style.height + 'px' : undefined,
        padding: o.style.padding ? o.style.padding + 'px' : undefined,
        paddingLeft: o.style.padding_left ? o.style.padding_left + 'px' : undefined,
        paddingRight: o.style.padding_right ? o.style.padding_right + 'px' : undefined,
        paddingTop: o.style.padding_top ? o.style.padding_top + 'px' : undefined,
        paddingBottom: o.style.padding_bottom ? o.style.padding_bottom + 'px' : undefined,
        borderRadius: o.style.corner_radius ? o.style.corner_radius + 'px' : undefined,
        fontFamily: o.style.font,
        fontSize: o.style.size ? o.style.size + 'px' : undefined,
        textAlign: o.style.align,
        lineHeight: o.style.height ? o.style.height + 'px' : undefined,
        color: o.style.color
      }
    }
    if (o.url) {
      // image button
      return Utils.clean({
        $type: "span",
        $components: [{
          $type: "img",
          src: o.url,
          class: o.className,
          style: Utils.clean(style)
        }]
      });
    } else {
      return Utils.clean({
        $type: "span",
        $components: [{
          $type: "button",
          $text: o.text,
          class: o.className,
          style: Utils.clean(style)
        }]
      })
    }
  },
  image: function(o) {
    var style = undefined;
    if (o.style) {
      style = {
        background: o.style.background,
        width: o.style.width ? o.style.width + 'px' : undefined,
        height: o.style.height ? o.style.height + 'px' : undefined,
        padding: o.style.padding ? o.style.padding + 'px' : undefined,
        paddingLeft: o.style.padding_left ? o.style.padding_left + 'px' : undefined,
        paddingRight: o.style.padding_right ? o.style.padding_right + 'px' : undefined,
        paddingTop: o.style.padding_top ? o.style.padding_top + 'px' : undefined,
        paddingBottom: o.style.padding_bottom ? o.style.padding_bottom + 'px' : undefined,
        borderRadius: o.style.corner_radius ? o.style.corner_radius + 'px' : undefined,
        color: o.style.color
      }
    }
    return Utils.clean({
      $type: "img",
      src: o.url,
      class: o.className,
      style: Utils.clean(style)
    });
  },
  label: function(o) {
    var style = undefined;
    if (o.style) {
      style = {
        background: o.style.background,
        width: o.style.width ? o.style.width + 'px' : undefined,
        height: o.style.height ? o.style.height + 'px' : undefined,
        padding: o.style.padding ? o.style.padding + 'px' : undefined,
        paddingLeft: o.style.padding_left ? o.style.padding_left + 'px' : undefined,
        paddingRight: o.style.padding_right ? o.style.padding_right + 'px' : undefined,
        paddingTop: o.style.padding_top ? o.style.padding_top + 'px' : undefined,
        paddingBottom: o.style.padding_bottom ? o.style.padding_bottom + 'px' : undefined,
        borderRadius: o.style.corner_radius ? o.style.corner_radius + 'px' : undefined,
        fontFamily: o.style.font,
        fontSize: o.style.size ? o.style.size + 'px' : undefined,
        textAlign: o.style.align,
        lineHeight: o.style.height ? o.style.height + 'px' : undefined,
        color: o.style.color
      }
    }
    return Utils.clean({
      $type: "p",
      $text: o.text,
      class: o.className,
      style: Utils.clean(style)
    })
  },
  space: function(o) {
    var style = undefined;
    if (o.style) {
      style = {
        background: o.style.background,
        width: o.style.width ? o.style.width + 'px' : undefined,
        height: o.style.height ? o.style.height + 'px' : undefined,
        padding: o.style.padding ? o.style.padding + 'px' : undefined,
        paddingLeft: o.style.padding_left ? o.style.padding_left + 'px' : undefined,
        paddingRight: o.style.padding_right ? o.style.padding_right + 'px' : undefined,
        paddingTop: o.style.padding_top ? o.style.padding_top + 'px' : undefined,
        paddingBottom: o.style.padding_bottom ? o.style.padding_bottom + 'px' : undefined
      }
    }
    return Utils.clean({
      class: o.className,
      "data-flex": true,
      style: Utils.clean(style)
    })
  }
}

var Css = {
  $type: "style",
  $text: "",
  _cssText: "",
  $update: function() {
    this.$text = this._cssText;

    },
  _update: function(s) {
    var new_stylesheet = {};
    for (var key in s) {
      var attrs = {};

      var stylesheet = s[key];


      if (stylesheet.background && !/http/.test(stylesheet.background)) {
        attrs["background-color"] = stylesheet.background;
      }
      if (stylesheet.background && /http/.test(stylesheet.background)) {
        attrs["background-image"] = 'url(' + stylesheet.background + ')';
        attrs["background-size"] = "cover";
      }
      if (stylesheet.color) {
        attrs["color"] = stylesheet.color;
      }
      if (stylesheet.bottom) {
        attrs["bottom"] = stylesheet.bottom + "px";
        attrs["position"] = "absolute";
      }
      if (stylesheet.left) {
        attrs["left"] = stylesheet.left + "px";
        attrs["position"] = "absolute";
      }
      if (stylesheet.right) {
        attrs["right"] = stylesheet.right + "px";
        attrs["position"] = "absolute";
      }
      if (stylesheet.top) {
        attrs["top"] = stylesheet.top + "px";
        attrs["position"] = "absolute";
      }
      if (stylesheet.padding) {
        attrs["padding"] = stylesheet.padding + "px";
      }
      if (stylesheet.padding_left) {
        attrs["padding-left"] = stylesheet.padding_left + "px";
      }
      if (stylesheet.padding_right) {
        attrs["padding-right"] = stylesheet.padding_right + "px";
      }
      if (stylesheet.padding_top) {
        attrs["padding-top"] = stylesheet.padding_top + "px";
      }
      if (stylesheet.padding_bottom) {
        attrs["padding-bottom"] = stylesheet.padding_bottom + "px";
      }
      if (stylesheet.width) {
        attrs["width"] = stylesheet.width + "px";
      }
      if (stylesheet.height) {
        attrs["height"] = stylesheet.height + "px";
      }
      if (stylesheet.size) {
        attrs["font-size"] = stylesheet.size + "px";
      }
      if (stylesheet.font) {
        attrs["font-family"] = stylesheet.font;
      }
      if (stylesheet.corner_radius) {
        attrs["border-radius"] = stylesheet.corner_radius;
      }
      if (stylesheet.align) {
        attrs["text-align"] = stylesheet.align;
        attrs["align-items"] = stylesheet.align;
      }

      var new_attrs = {};
      Object.keys(attrs).forEach(function(k) {
        new_attrs[k] = Utils.units(attrs[k]);
      })
      new_stylesheet[key] = new_attrs;
    }

    /*******
    s looks like this:

    "item": {
      color: "#ff0000",
      padding: "10px",
      "fonts-family": "HelveticaNeue"
    }

    Need to transform to a string

    .item {
      color: #ff0000;
      padding: 10px;
      fonts-family: "HelveticaNeue"
    }

    ********/

    var css = Object.keys(new_stylesheet).map(function(classname) {
      var firstLine = "#jason ."+classname+" {\n";
      var content = Object.keys(new_stylesheet[classname]).map(function(attr) {
        return "\t" + attr + ": " + new_stylesheet[classname][attr] + ";";
      }).join("\n") + "\n";
      var lastLine = "}";
      return firstLine + content + lastLine;
    }).join("\n")

    this._cssText = css;
  }
}

var Footer = {
  $type: "nav",
  class: "footer nav nav-justified",
  _title: null,
  _items: [],
  _footer: null,
  _style: null,
  _tpl: {
    tabs: function(item) {
      return {
        class: "nav-item",
        $components: [{
          $type: "img",
          src: item.image,
          $init: function() {
            Style.node(this);
          }
        }, {
          $text: item.text, class: "letter"
        }]
      }
    }
  },
  _update: function(body) {
    if (body.footer) {
      this._footer = body.footer;
    }
  },
  $update: function() {
    if (this._footer.tabs) {
      if (this._footer.tabs.items) {
        if (this._footer.tabs.style) {
          this._style = this._footer.tabs.style;
        }
        this.$components = this._footer.tabs.items.map(this._tpl.tabs)
      }
    } else if (this._footer.input) {
      if (this._footer.input.style) {
        this._style = this._footer.input.style;
      }
      var i = this._footer.input;
      var inputItems = [];
      if (i.left && i.left.image) {
        var lb = {
          $type: "img",
          src: i.left.image
        };
        if (i.left.style) lb.style = Style.transform(i.left.style);
        inputItems.push({
          class: "input-item button-item",
          $components: [lb]
        })
      }
      if (i.textfield) {
        var tf = {$type: "input"};
        if (i.textfield.placeholder) tf.placeholder = i.textfield.placeholder;
        if (i.textfield.style) tf.style = Style.transform(i.textfield.style);
        inputItems.push({
          class: "input-item textfield",
          $components: [tf]
        });
      }
      if (i.right && i.right.text) {
        var rb = {
          $type: "span",
          $text: i.right.text
        };
        if (i.right.style) rb.style = Style.transform(i.right.style);
        inputItems.push({
          class: "input-item button-item",
          $components: [rb]
        })
      }
      this.$components = inputItems;
    }
    Style.node(this);
  }
}

var Header = {
  $type: "nav",
  class: "header nav nav-justified",
  _title: null,
  _menu: null,
  _style: null,
  _update: function(body) {
    if (body.header) {
      // title
      if (body.header.title) {
        if (typeof body.header.title === 'string') {
          this._title = { type: "label", text: body.header.title };
        } else {
          this._title = body.header.title;
        }
      }
      // menu
      if (body.header.menu) {
        this._menu = body.header.menu;
      }
      // style
      if (body.header.style) {
        this._style = body.header.style;
      }
    }
  },
  $update: function() {
    // style
    Style.node(this);

    // menu drawing
    var menuItem;
    if (this._menu) {
      if (this._menu.image) {
        menuItem = {
          class: "nav-item",
          $components: [{ $type: "img", src: this._menu.image, class: "icon float-right" } ]
        }
      } else if (this._menu && this._menu.text) {
        menuItem = {
          class: "nav-item",
          $components: [{ $type: "span", $text: this._menu.text, class: "icon nav-item float-right" }]
        }
      }
      if (this._menu.style) menuItem.style = Style.transform(this._menu.style);
    } else {
      menuItem = {
        class: "nav-item",
        $components: [{ $type: "span", $text: "", class: "icon float-right" }]
      }
    }

    // Build title
    /*
    label type
    {
      "type": "label",
      "text": "this isa title",
      "style": {
        "fonts": "..",
        "size": "..",
        "color": ".."
      }
    }

    image type
    {
      "type": "image",
      "url": "..",
      "style": {
        "width": "..",
        "height": ".."
      }
    }
    */

    var titleItem;
    if (this._title) {
      var t = this._title;
      if (t.type) {
        var newStyle = {};
        if (t.style) {
          var style = Style.transform(t.style);
          for (var key in style) {
            newStyle[key] = Utils.units(style[key]);
          }
        }
        if (t.type === 'label') {
          titleItem = { $type: "h5", $text: t.text, class: "nav-item" };
          if (newStyle) titleItem.style = newStyle;
        } else if (t.type === 'image') {
          titleItem = {
            class: "nav-item",
            $components: [{
              $type: "img", src: t.url
            }]
          }
          if (newStyle) titleItem.$components[0].style = newStyle;
        }
      }
    } else {
      titleItem = { $type: "h5", $text: "", class: "nav-item" };
    }

    this.$components = [
      { $type: "span", $text: "", class: "nav-item" },
      titleItem,
      menuItem
    ]
  }
}

var Item = {
  build: function(layout, parentLayout) {
    if (layout.components) {
      return Item.layout(layout, parentLayout);
    } else {
      return Item.components(layout, parentLayout);
    }
  },
  layout: function(layout, parentLayout) {
    var style = {};
    if (layout && layout.style) {
      if (layout.style.background && !/http/.test(layout.style.background)) { style.backgroundColor = layout.style.background }
      if (layout.style.background && /http/.test(layout.style.background)) { style.backgroundImage = 'url(' + layout.style.background + ')' }
      if (layout.style.background && /http/.test(layout.style.background)) { style.backgroundSize = 'cover' }
      if (layout.style.padding) { style.padding = layout.style.padding + 'px' }
      if (layout.style.width) { style.width = layout.style.width + 'px' }
      if (layout.style.height) { style.height = layout.style.height + 'px' }
      if (layout.style.align) { style.textAlign = layout.style.align }
      if (layout.style.align) { style.alignItems = layout.style.align }
      if ((parentLayout && parentLayout.type=='vertical' && layout.style.height) || (parentLayout && parentLayout.type=='horizontal' && layout.style.width)) {
        style.flexGrow = "0";
      } else {
        style.flexGrow = "1";
      }
      if (parentLayout && parentLayout.type=='vertical' && parentLayout.style && parentLayout.style.spacing) {
        style.marginBottom = parentLayout.style.spacing+'px';
      }
      if (parentLayout && parentLayout.type=='horizontal' && parentLayout.style && parentLayout.style.spacing) {
        style.marginRight = parentLayout.style.spacing+'px';
      }
    }
    var transformed = {
      style: style,
      class: layout.type + " layout",
      $components: layout.components ? layout.components.map(function(component) { return Item.build(component, layout) }) : []
    };
    if (layout.href) {
      transformed.onclick = function(e) {
        if (layout.href.view === 'web') {
          window.location.href = layout.href.url;
        } else {
          window.location.href = layout.href.url.replace(/\.json$/,'') + "/edit";
        }
      }
    }
    return transformed;
  },
  components: function(input, parentLayout) {
    var c = Components[input.type];
    var transformed;
    if (c) {
      if (input.class) input.className = input.class;
      transformed = c(input);
    } else if (input.class === 'spacing') {
      transformed = { class: input.class };
    } else {
      transformed = { $text: input.type };
    }

    var style = {};
    if (parentLayout && parentLayout.type === 'vertical' && parentLayout.style && parentLayout.style.spacing) {
      style["marginBottom"] = parentLayout.style.spacing + "px";
    } else if (parentLayout && parentLayout.type === 'horizontal' && parentLayout.style && parentLayout.style.spacing) {
      style["marginRight"] = parentLayout.style.spacing + "px";
    }
    if (transformed.style) {
      Object.keys(style).forEach(function(key) {
        transformed.style[key] = style[key];
      })
    } else {
      transformed.style = style;
    }
    return transformed;
  }
}

var Layers = {
  _items: [],
  class: "layers hidden",
  _update: function(body) {
    if (body.layers) {
      this.classList.remove("hidden");
      this._items = body.layers;
    }
  },
  $update: function() {
    this.$components = this._items.map(Layers.tpl)
  },
  tpl: function(item) {
    var component = {};
    if (item.type === 'image') {
      component.$type = 'img';
      if (item.url) {
        component.src = item.url;
      }
    } else if (item.type === 'label') {
      component.$type = 'span';
      if (item.text) {
        component.$text = item.text;
      }
    }
    if (item.class) {
      component.class = item.class;
    }
    if (item.style) {
      /// common styling
      for (var key in item.style) {
        if (/^[0-9]+$/.test(item.style[key])) {
          item.style[key] = item.style[key] + "px";
        } else if (/.*%[ ]*[+-][ ]*[0-9]+[ ]*/.test(item.style[key])) {
          // "width": "50%-10px"
          item.style[key] = ("calc(" + item.style[key] + "px)").split("+").join(" + ").split("-").join(" - ");
        } else {
          item.style[key] = item.style[key];
        }
      }
      component.style = Style.transform(item.style)

      // layer specific styling - top,left,right,bottom
      if (item.style.top != undefined) { component.style.top = item.style.top; }
      if (item.style.left != undefined) { component.style.left = item.style.left; }
      if (item.style.right != undefined) { component.style.right = item.style.right; }
      if (item.style.bottom != undefined) { component.style.bottom = item.style.bottom; }
      component.style.position = "absolute";
    }
    return component;
  }
}

Mixin = {
  cache: {},
  plugin: function(o, path, new_val) {
    if (path && path.length > 0) {
      var fn = Function('new_val', 'with(this) {this' + path + '=new_val; return this;}').bind(o);
      return fn(new_val)
    } else {
      Object.keys(new_val).forEach(function(k) {
        o[k] = new_val[k]
      })
      return o;
    }
  },
  remote: function(root) {
    return new Promise(function(success, error) {
      // MIXIN
      var selection = ST.select(root, function(key, val) {
        return key === '@' && !/^[ ]*\$document/.test(val)
      });
      var paths = selection.paths()
      var values = selection.values()

      if (values.length > 0) {
        var subpaths = [];
        values.forEach(function(value, index) {
          if (/@/.test(value)) {
            var tokens = value.split("@")
            subpaths.push(tokens[0])
            values[index] = tokens[1]
          } else {
            subpaths.push("");
          }
        })

        var promises = values.map(function(url, index) {
          return new Promise(function(success, error) {
            if (Mixin.cache[url]) {
              var res = Mixin.cache[url];
              success(JSON.parse(JSON.stringify(res)));
            } else {
              fetch(url).then(function(res) { return res.json() })
              .then(function(res) {
                Mixin.cache[url] = res;
                success(JSON.parse(JSON.stringify(res)));
              })
            }
          })
        })
        var resolved_root = root;
        var self = this;
        Promise.all(promises).then(function(objects) {
          paths.forEach(function(path, index) {
            var plugin = objects[index];
            if (subpaths[index] != "") {
              var fn = Function('with(this) { return this.' + subpaths[index] + ';}').bind(plugin);
              plugin = fn()
            }
            resolved_root = Mixin.plugin(resolved_root, path, plugin)
          })
          Mixin.loaded = Mixin.loaded.concat(values)
          success(resolved_root)
        })
      } else {
        success(root);
      }
    })
  },
  local: function(root) {
    return new Promise(function(success, error) {
      var selection = ST.select(root, function(key, val) {
        return key === '@' && /\$document\./.test(val)
      });
      var paths = selection.paths()
      var values = selection.values()

      paths.forEach(function(path, index) {
        /***
          Example

          local_ref := "$document.db"
        }
        *****/
        var local_ref =  values[index];
        // local_resolver finds the value at $document.db
        var local_resolver = Function('with(this) { return ' + local_ref + ';}').bind({$document: root});
        var resolved = local_resolver()
        if (resolved instanceof Object && resolved.constructor === Object) {
          var func = Function('with(this) {return this' + path + ';}').bind(root);
          Object.keys(resolved).forEach(function(key) {
            var branch = func(path);
            branch[key] = resolved[key];
          })
        } else {
          var func = Function('new_val', 'with(this) {this' + path + '=new_val; return this;}').bind(root);
          root = func(resolved);
        }
      })
      success(root)
    })
  },
  parse: function(root) {
    // MIXIN
    var selection = ST.select(root, function(key, val) {
      return key === '@' && !/\$document\./.test(val) && Mixin.loaded.indexOf(val) === -1;
    });
    if (selection.values().length > 0) {
      // remote
      return Mixin.remote(root).then(Mixin.parse)
    } else {
      // try local
      return Mixin.local(root)
    }
  }
}

var Section = {
  build: function(input) {
    var output = [];
    var h = Section.header(input);
    if (h) output = output.concat(h);

    var i = Section.items(input);
    if (i) output = output.concat({
      class: "section-items", $components: i
    });
    return output;
  },
  header: function(input) {
    if (input.header) {
      var output = {
        class: "section-header"
      };
      if (input.header.style) {
        output["style"] = {};
        if (input.header.style.background) {
          output["style"]["backgroundColor"] = input.header.style.background;
        }
        if (input.header.style.padding) {
          output["style"]["padding"] = input.header.style.padding;
        }
        if (input.header.style.width) {
          output["style"]["width"] = input.header.style.width;
        }
        if (input.header.style.height) {
          output["style"]["height"] = input.header.style.height;
        }

      }
      output["$components"] = [Item.build(input.header)];
      return output;
    } else {
      return null;
    }
  },
  items: function(input) {
    if (input.items) {
      return input.items.map(function(item) {
        var style = {};
        if (item.style) {
          if (item.style.background) style.backgroundColor = item.style.background;
          if (item.style.padding) style.padding = item.style.padding + 'px';
          if (item.style.width) style.width = item.style.width + 'px';
          if (item.style.height) style.height = item.style.height + 'px';
        }
        return {
          class: "section-item",
          $components: [Item.build(item)],
          style: style
        }
      })
    } else {
      return null;
    }
  }
}

var Sections = {
  class: "sections hidden",
  _update: function(body) {
    var input = body.sections;
    if (input && input.length > 0) {
      this.classList.remove("hidden");
      this.$components = input.map(function(section) {
        var output = {};

        // class
        output.class = section.type + " section";

        // style
        if (section.style) {
          output.style = Style.transform(section.style)
        }

        // components
        var ss = Section.build(section);
        if (ss) output["$components"] = ss;

        return output;
      });
    } else {
      this.$components = [];
    }
  }
}

var Style = {
  tpl: function(style) {
    var s = {};
    if (style.color) {
      s.color = style.color;
    }
    if (style.background && /http/.test(style.background)) {
      s.backgroundImage = 'url(' + style.background + ')';
      s.backgroundSize = 'cover';
    } else {
      s.backgroundColor = style.background;
    }
    if (style.padding) s.padding = style.padding;
    if (style.width) s.width = style.width;
    if (style.height) {
      s.height = style.height;
      s.lineHeight = style.height;
    }
    if (style.font) s.fontFamily = style.font;
    if (style.size) s.fontSize = style.size;
    if (style.corner_radius) s.borderRadius = style.corner_radius;
    if (style.align) {
      s.textAlign = style.align;
      s.alignItems = style.align;
    }
    return s;
  },
  /// style a node
  node: function($node) {
    if ($node._style) {
      var s = Style.tpl($node._style);
      for (var key in s) {
        $node.style[key] = Utils.units(s[key]);
      }
    }
  },
  transform: function(style) {
    return Style.tpl(style);
  }
}

var Utils = {
  units: function(str) {
    if (/^[0-9]+$/.test(str)) {
      return str + "px";
    } else if (/\(.*%[ ]*[+-][ ]*[0-9]+px[ ]*/.test(str)) {
      // "width": "50%-10px"
      return "calc(" + str + ")";
    } else {
      return str;
    }
  },
  transformer: function(fn) {
    var result = {};
    for(var key in o) {
      try {
        if (typeof o[key] !== "undefined") {
          result[key] = o[key];
        }
      } catch (e) {
        // no need to include
      }
    }
    return result;
  },
  // Cleans up all undefined values from an object
  clean: function(obj) {
    if (obj) {
      Object.keys(obj).forEach(function (key) {
        if(typeof obj[key] === 'undefined'){
          delete obj[key];
        }
      });
      if (Object.keys(obj).length === 0) {
        return null;
      } else {
        return obj;
      }
    } else {
      return obj;
    }
  }
}

var WebContainer = {
  $type: "iframe",
  class: "webcontainer hidden",
  height: "100%",
  width: "100%",
  frameborder:"0",
  clipboard:"allow",
  scrolling:"yes",
  sandbox:"allow-downloads allow-modals allow-scripts allow-top-navigation-by-user-activation allow-same-origin",
  _update: function(background) {
    if (background.style) {
      this.style = background.style;
    }
    if (background.url) {
      this.classList.remove('hidden');
      this.src =  background.url;
    } else if (background.text) {
      this.classList.remove('hidden');
      this.$html = background.text;
    }
  }
}

},{}]},["5LOEx","6g7HQ"], "6g7HQ", "parcelRequirea8a2")

//# sourceMappingURL=page-external.3f2bdc31.js.map
