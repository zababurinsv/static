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
})({"2aPCq":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "284e835a2db817a2072e0562a83f7dd3";
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

},{}],"4Tr6X":[function(require,module,exports) {
var _staticHtmlComponentsComponent_modulesLoaderLoaderMjs = require('/static/html/components/component_modules/loader/loader.mjs');
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
var _staticHtmlComponentsComponent_modulesLoaderLoaderMjsDefault = _parcelHelpers.interopDefault(_staticHtmlComponentsComponent_modulesLoaderLoaderMjs);
require('/static/html/components/component_modules/iframe/iframe.mjs');
if (!Object.keys) {
  Object.keys = function (o) {
    if (o !== Object(o)) {
      throw new TypeError('Object.keys called on a non-object');
    }
    var k = [];
    var p;
    for (p in o) if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
    return k;
  };
}
customElements.define('page-external', class extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: 'open'
    });
    shadow.innerHTML = `
<div id="external"><slot name="jason"></slot></div>
<style>
:host(.hidden){
display: none;
}
:host(img) {
  width: 100%;
}
div#external{
    border-radius: 0.5vw;
    height:100%;
    width: 100%;
}
</style>`;
    if (this.dataset.height) {
      this.style.height = `${this.dataset.height}vh`;
    } else {
      this.style.height = "auto";
    }
    if (this.dataset.width) {
      this.style.width = `${this.dataset.width}vw`;
    } else {
      this.style.width = "100%";
    }
    (async obj => {
      obj['function'] = {};
      obj['function']['create'] = function ($root) {
        return new Promise(function (resolve, reject) {
          // / /////////////////////
          /*
          *   {cell}
          *
          *   - Membrane: "The cell membrane (also known as the plasma membrane or cytoplasmic membrane) is a biological membrane that separates the interior of all cells from the outside environment"
          *   - Gene: "The transmission of genes to an organism's offspring is the basis of the inheritance of phenotypic traits. These genes make up different DNA sequences called genotypes. Genotypes along with environmental and developmental factors determine what the phenotypes will be."
          *   - Genotype: "Genotype is an organism's full hereditary information."
          *   - Phenotype: "Phenotype is an organism's actual observed properties, such as morphology, development, or behavior."
          *   - Nucleus: "The nucleus maintains the integrity of genes and controls the activities of the cell by regulating gene expression—the nucleus is, therefore, the control center of the cell."
          */
          var Membrane = {
            /*
            *  [Membrane] The Shell
            *
            *  "The cell membrane (also known as the plasma membrane or cytoplasmic membrane) is a biological membrane that separates the interior of all cells from the outside environment"
            *    - https://en.wikipedia.org/wiki/Cell_membrane
            *
            *  The Membrane module determines how a cell is inserted into the DOM. There are two ways: Replacing an existing node with cell (inject), or Creating an additional cell node (add).
            *   - inject(): attempts to inject cell into an existing host node
            *   - add(): creates a new cell node and adds it to the DOM without touching other nodes
            */
            inject: function ($host, gene, namespace, replace) {
              // console.assert(false, 'inject')
              /*
              *  Membrane.inject() : Inject cell into an existing node
              *
              *  @param {Object} $host - existing host node to inject into
              *  @param {Object} gene - gene object
              *  @param {String} namespace - for handling namespaced elements such as SVG https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
              *  @param {Boolean} replace - if true, create a node and replace it with the host node. Used for manual instantiation
              */
              var $node = null;
              var $replacement;
              // console.log('-----$root.getElementById------>', $root.querySelector(`#${gene.id}`))
              // console.assert(false, $host)
              if (replace && $host) {
                // 1. Inject into an existing node ($host) by explicit instantiation
                $replacement = Phenotype.$type(gene, namespace);
                if (gene.hasOwnProperty('$cell')) {
                  $node = $host;
                  if ($node.parentNode) $node.parentNode.replaceChild($replacement, $node);
                }
                $node = $replacement;
              } else if (gene.$type && (gene.$type === 'head' || gene.$type === 'body') && $root.getElementsByTagName(gene.$type)) {
                // 2. Inject into existing 'head' or 'body' nodes
                $node = $root.getElementsByTagName(gene.$type)[0];
              } else if (gene.id && $root.querySelector(`#${gene.id}`)) {
                // 3. Inject into an existing nodes by ID
                $node = $root.querySelector(`#${gene.id}`);
                if ($node.nodeName.toLowerCase() !== (gene.$type || 'div')) {
                  $replacement = Phenotype.$type(gene, namespace);
                  $node.parentNode.replaceChild($replacement, $node);
                  $node = $replacement;
                }
              }
              if ($node && !$node.Meta) $node.Meta = {};
              return $node;
            },
            add: function ($parent, gene, index, namespace) {
              // console.assert(false, 'add')
              /*
              *  Membrane.add() : Adds a new cell node into the DOM tree
              *
              *  @param $parent - The parent node to which the new cell node will be added
              *  @param gene - gene object
              *  @param index - the position within the parent's childNodes array to which this cell node will be added. Not used in the initial render but used for subsequent renders based on the diff logic
              *  @param namespace - namespace URL for namespaced elements such as SVG
              */
              var $node = Phenotype.$type(gene, namespace);
              if (index !== null && index !== undefined && $parent.childNodes && $parent.childNodes[index]) {
                // Index is specified, so insert into that position
                $parent.insertBefore($node, $parent.childNodes[index]);
              } else {
                // No index, simply apppend to the end
                $parent.appendChild($node);
              }
              return $node;
            },
            build: function ($parent, gene, index, namespace, replace) {
              /*
              * Membrane.build() : The main builder function that interfaces with Membrane.inject() and Membrane.add().
              */
              // 1. Attempt to inject into an existing node
              var $existing = Membrane.inject($parent, gene, namespace, replace);
              if ($existing) return $existing; else return Membrane.add($parent, gene, index, namespace);
            }
          };
          var Genotype = {
            /*
            *  [Genotype] Internal Storage of Genes
            *
            *  "Genotype is an organism's full hereditary information."
            *    - https://en.wikipedia.org/wiki/Genotype
            *
            *   The Genotype module is an internal storage for all the variables required to construct a cell node (attributes, $variables, and _variables)
            *   When you set a variable on a cell (for example: this._index=1), it's actually stored under the node's Genotype instead of directly on the node itself.
            *
            *   - set(): a low-level function to simply set a key/value pair on the Genotype object, used by update() and build()
            *   - update(): updates a key/value pair from the genotype and schedules a phenotype (view) update event to be processed on the next tick
            *   - build(): builds a fresh genotype object from a gene object
            */
            set: function ($node, key, val) {
              if (['$init'].indexOf(key) === -1) {
                $node.Genotype[key] = Nucleus.bind($node, val);
              } else {
                // colorLog('~~~~~~~~~~~~~~Genotype~set~~~~~~~~~~~~~~~~~~~', 'yellow', val)
                val.snapshot = val;
                // snapshot of $init
                $node.Genotype[key] = val;
              }
            },
            update: function ($node, key, val) {
              Nucleus.queue($node, key, 'w');
              Genotype.set($node, key, val);
            },
            build: function ($node, gene, inheritance) {
              $node.Genotype = {};
              $node.Inheritance = inheritance;
              for (var key in gene) {
                Genotype.set($node, key, gene[key]);
              }
            },
            infect: function (gene) {
              var virus = gene.$virus;
              if (!virus) return gene;
              var mutations = Array.isArray(virus) ? virus : [virus];
              delete gene.$virus;
              return mutations.reduce(function (g, mutate) {
                var mutated = mutate(g);
                if (mutated === null || typeof mutated !== 'object') {
                  throw new Error('$virus mutations must return an object');
                }
                mutated.$type = mutated.$type || 'div';
                return mutated;
              }, gene);
            }
          };
          var Gene = {
            /*
            *  [Gene] Gene manipulation/diff functions
            *
            *  "The transmission of genes to an organism's offspring is the basis of the inheritance of phenotypic traits. These genes make up different DNA sequences called genotypes. Genotypes along with environmental and developmental factors determine what the phenotypes will be."
            *    - https://en.wikipedia.org/wiki/Gene
            *
            *  The Gene module is a collection of utility functions used for comparing gene objects to determine if a node needs to be replaced or left alone when there's an update.
            *   - freeze(): stringifies a Javascript object snapshot for comparison
            *   - LCS(): Longest Common Subsequence algorithm https://en.wikipedia.org/wiki/Longest_common_subsequence_problem
            *   - diff(): A diff algorithm that returns what have been added (+), and removed (-)
            */
            freeze: function (gene) {
              var cache = [];
              var res = JSON.stringify(gene, function (key, val) {
                if (typeof val === 'function') {
                  return val.toString();
                }
                if (typeof val === 'object' && val !== null) {
                  if (cache.indexOf(val) !== -1) {
                    return '[Circular]';
                  }
                  cache.push(val);
                }
                return val;
              });
              cache = null;
              return res;
            },
            LCS: function (a, b) {
              var m = a.length;
              var n = b.length;
              var C = [];
              var i;
              var j;
              var af = [];
              var bf = [];
              for (i = 0; i < m; i++) af.push(Gene.freeze(a[i]));
              for (j = 0; j < n; j++) bf.push(Gene.freeze(b[j]));
              for (i = 0; i <= m; i++) C.push([0]);
              for (j = 0; j < n; j++) C[0].push(0);
              for (i = 0; i < m; i++) for (j = 0; j < n; j++) C[i + 1][j + 1] = af[i] === bf[j] ? C[i][j] + 1 : Math.max(C[i + 1][j], C[i][j + 1]);
              return (function bt(i, j) {
                if (i * j === 0) {
                  return [];
                }
                if (af[i - 1] === bf[j - 1]) {
                  return bt(i - 1, j - 1).concat([{
                    item: a[i - 1],
                    _old: i - 1,
                    _new: j - 1
                  }]);
                }
                return C[i][j - 1] > C[i - 1][j] ? bt(i, j - 1) : bt(i - 1, j);
              })(m, n);
            },
            diff: function (_old, _new) {
              var lcs = Gene.LCS(_old, _new);
              var old_common = lcs.map(function (i) {
                return i._old;
              });
              var minus = _old.map(function (item, index) {
                return {
                  item: item,
                  index: index
                };
              }).filter(function (item, index) {
                return old_common.indexOf(index) === -1;
              });
              var new_common = lcs.map(function (i) {
                return i._new;
              });
              var plus = _new.map(function (item, index) {
                return {
                  item: item,
                  index: index
                };
              }).filter(function (item, index) {
                return new_common.indexOf(index) === -1;
              });
              return {
                '-': minus,
                '+': plus
              };
            }
          };
          var Phenotype = {
            /*
            *  [Phenotype] Actual observed properties of a cell
            *
            *  "Phenotype is an organism's actual observed properties, such as morphology, development, or behavior."
            *    - https://en.wikipedia.org/wiki/Phenotype
            *
            *  The Phenotype module manages a cell's actual observed properties, such as textContent ($text), nodeType ($type), innerHTML ($html), childNodes ($components), and DOM attributes
            *
            *   - build(): Build phenotype from genotype
            *   - set(): Sets a key/value pair of phenotype
            *   - $type(): translates the "$type" attribute to nodeType
            *   - $text(): translates the "$type" attribute to textContent
            *   - $html(): translates the "$type" attribute to innerHTML
            *   - $components(): translates the "$components" attribute to childNodes
            *   - $init(): executes the "$init" callback function after the element has been rendered
            *   - $update(): executes the "$update" callback function when needed (called by Nucleus on every tick)
            */
            build: function ($node, genotype) {
              Phenotype.$init($node);
              for (var key in genotype) {
                if (genotype[key] !== null && genotype[key] !== undefined) {
                  Phenotype.set($node, key, genotype[key]);
                }
              }
            },
            multiline: function (fn) {
              return (/\/\*!?(?:@preserve)?[ \t]*(?:\r\n|\n)([\s\S]*?)(?:\r\n|\n)[ \t]*\*\//).exec(fn.toString())[1];
            },
            get: function (key) {
              return Object.getOwnPropertyDescriptor($root.HTMLElement.prototype, key) || Object.getOwnPropertyDescriptor($root.Element.prototype, key);
            },
            set: function ($node, key, val) {
              if (key[0] === '$') {
                if (key === '$type') {
                  // recreate and rebind the node if it's different from the old one
                  var tag = $node.tagName ? $node.tagName.toLowerCase() : 'text';
                  if (val.toLowerCase() !== tag) {
                    var fragment = Phenotype.$type({
                      $type: 'fragment'
                    });
                    var replacement = fragment.$build($node.Genotype, $node.Inheritance, null, $node.Meta.namespace);
                    $node.parentNode.replaceChild(replacement, $node);
                    $node = replacement;
                  }
                } else if (key === '$text') {
                  if (typeof val === 'function') val = Phenotype.multiline(val);
                  $node.textContent = val;
                } else if (key === '$html') {
                  // colorLog('~~~~~~~~~~~~~~~Phenotype.multiline(val)~~~~~~~~~~~~~~~~~~~~', 'orange', val)
                  if (typeof val === 'function') val = Phenotype.multiline(val);
                  $node.innerHTML = val;
                } else if (key === '$components') {
                  Phenotype.$components($node, val);
                }
              } else if (key[0] === '_') {} else if (key === 'value') {
                $node[key] = val;
              } else if (key === 'style' && typeof val === 'object') {
                var CSSStyleDeclaration = Phenotype.get(key).get.call($node);
                for (var attr in val) {
                  CSSStyleDeclaration[attr] = val[attr];
                }
              } else if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
                if ($node.setAttribute) $node.setAttribute(key, val);
              } else if (typeof val === 'function') {
                // For natively supported HTMLElement.prototype methods such as onclick()
                var prop = Phenotype.get(key);
                if (prop) prop.set.call($node, val);
              }
            },
            $type: function (model, namespace) {
              var meta = {};
              var $node;
              if (model.$type === 'svg') {
                $node = $root.createElementNS('http://www.w3.org/2000/svg', model.$type);
                meta.namespace = $node.namespaceURI;
              } else if (namespace) {
                $node = $root.createElementNS(namespace, model.$type);
                meta.namespace = $node.namespaceURI;
              } else if (model.$type === 'fragment') {
                $node = $root.createDocumentFragment();
              } else if (model.$type === 'text') {
                if (model.$text && typeof model.$text === 'function') model.$text = Phenotype.multiline(model.$text);
                $node = $root.createTextNode(model.$text);
              } else {
                $node = $root.createElement(model.$type || 'div');
              }
              $node.Meta = meta;
              return $node;
            },
            $components: function ($parent, components) {
              if (!components) components = [];
              var old = [].map.call($parent.childNodes, function ($node) {
                return $node.Genotype;
              }).filter(function (item) {
                return item;
              });
              if (old.length > 0) {
                // If childNodes already exist, try to insert into a correct position.
                var diff = Gene.diff(old, components);
                diff['-'].forEach(function (item) {
                  $parent.childNodes[item.index].Kill = true;
                });
                [].filter.call($parent.childNodes, function ($node) {
                  return $node.Kill;
                }).forEach(function ($node) {
                  $parent.removeChild($node);
                });
                diff['+'].forEach(function (item) {
                  var inheritance = $parent.Inheritance;
                  for (var key in $parent.Genotype) {
                    if (key[0] === '_') inheritance = inheritance.concat([key]);
                  }
                  // colorLog('~~~~~~~~~$parent.$build~~~item.item~~~~~~~~~~', 'red', item.item)
                  // colorLog('~~~~~~~~~$parent.$build~~~item.index~~~~~~~~~~', 'red', item.index)
                  // colorLog('~~~~~~~~~$parent.$build~~~$parent.Meta.namespace~~~~~~~~~~', 'red', $parent.Meta.namespace)
                  $parent.$build(item.item, inheritance, item.index, $parent.Meta.namespace);
                  $parent.$components[item.index] = $parent.childNodes[item.index].Genotype;
                });
              } else {
                // first time construction => no childNodes => build a fragment and insert at once
                var $fragment = Phenotype.$type({
                  $type: 'fragment'
                });
                var inheritance = $parent.Inheritance;
                for (var key in $parent.Genotype) {
                  if (key[0] === '_') inheritance = inheritance.concat([key]);
                }
                while ($parent.firstChild) {
                  $parent.removeChild($parent.firstChild);
                }
                // remove empty text nodes
                components.forEach(function (component) {
                  // colorLog('~~~~~~~~~$fragment.$build~~~component~~~~~~~~~~', 'red', component)
                  // colorLog('~~~~~~~~~$fragment.$build~~~inheritance~~~~~~~~~~', 'red', inheritance)
                  // colorLog('~~~~~~~~~$fragment.$build~~~$parent.Meta.namespace~~~~~~~~~~', 'red', $parent.Meta.namespace)
                  $fragment.$build(component, inheritance, null, $parent.Meta.namespace);
                });
                // colorLog('~~~~~~~~~$parent.appendChild~~~~~~~$fragment~~~', 'green', $fragment)
                $parent.appendChild($fragment);
                $parent.$components = [].map.call($parent.childNodes, function ($node) {
                  // colorLog('~~~~~~~~~$node.Genotype~~~~~~~~~~', 'grey', $node.Genotype)
                  return $node.Genotype;
                });
              }
            },
            $init: function ($node) {
              Nucleus.tick.call($root, function () {
                // colorLog('~~~~~~~~~$node.Genotype.$init~~~~~~~$node~~~', 'grey', $node.Genotype.$init)
                if ($node.Genotype && $node.Genotype.$init) Nucleus.bind($node, $node.Genotype.$init)();
              });
            },
            $update: function ($node) {
              if ($node.parentNode && !$node.Meta.$updated && $node.$update) {
                $node.Meta.$updated = true;
                $node.$update();
                for (var key in $node.Dirty) {
                  Phenotype.set($node, key, $node.Genotype[key]);
                }
                $node.Meta.$updated = false;
                $node.Dirty = null;
              }
            }
          };
          var Nucleus = {
            /*
            *  [Nucleus] Handles the cell cycle
            *
            *  "The nucleus maintains the integrity of genes and controls the activities of the cell by regulating gene expression—the nucleus is, therefore, the control center of the cell."
            *    - https://en.wikipedia.org/wiki/Cell_nucleus
            *
            *  The Nucleus module creates a proxy that lets Cell interface with the outside world. Its main job is to automatically trigger phenotype updates based on genotype updates
            *
            *   - set(): Starts listening to a single attribute.
            *   - build(): Starts listening to all attributes defined on the gene
            *   - bind(): Creates a wrapper function that executes the original function, and then automatically updates the Phenotype if necessary.
            *   - queue(): A function that queues up all potential genotype mutation events so that they can be batch-processed in a single tick.
            */
            tick: $root.requestAnimationFrame || $root.webkitRequestAnimationFrame || $root.mozRequestAnimationFrame || $root.msRequestAnimationFrame || (function (cb) {
              // console.dir($root)
              // console.assert(false, $root)
              return $root.setTimeout(cb, 1000 / 60);
            }),
            set: function ($node, key) {
              // Object.defineProperty is used for overriding the default getter and setter behaviors.
              try {
                Object.defineProperty($node, key, {
                  configurable: true,
                  get: function () {
                    // 1. get() overrides the node's getter to create an illusion that users are directly accessing the attribute on the node (In reality they are accessing the genotype via nucleus)
                    // 2. get() also queues up the accessed variable so it can potentially trigger a phenotype update in case there's been a mutation
                    if (key[0] === '$' || key[0] === '_') {
                      if ((key in $node.Genotype)) {
                        Nucleus.queue($node, key, 'r');
                        return $node.Genotype[key];
                      } else if (key[0] === '_') {
                        // Context Inheritance: If a _variable cannot be found on the current node, propagate upwards until we find a node with the attribute.
                        var $current = $node;
                        while ($current = $current.parentNode) {
                          // eslint-disable-line no-cond-assign
                          if ($current && $current.Genotype && (key in $current.Genotype)) {
                            Nucleus.queue($current, key, 'r');
                            return $current.Genotype[key];
                          }
                        }
                      } else {
                        return null;
                      }
                    } else {
                      // DOM Attributes.
                      if (key === 'value') {
                        // The "value" attribute needs a special treatment.
                        return Object.getOwnPropertyDescriptor(Object.getPrototypeOf($node), key).get.call($node);
                      } else if (key === 'style') {
                        return Phenotype.get(key).get.call($node);
                      } else if ((key in $node.Genotype)) {
                        // Otherwise utilize Genotype
                        return $node.Genotype[key];
                      } else {
                        // If the key doesn't exist on the Genotype, it means we're dealing with native DOM attributes we didn't explicitly define on the gene.
                        // For example, there are many DOM attributes such as "tagName" that come with the node by default.
                        // These are not something we directly define on a gene object, but we still need to be able to access them..
                        // In this case we just use the native HTMLElement.prototype accessor
                        return Phenotype.get(key).get.call($node);
                      }
                    }
                  },
                  set: function (val) {
                    // set() overrides the node's setter to create an illusion that users are directly setting an attribute on the node (In reality it's proxied to set the genotype value instead)
                    // set() also queues up the mutated variable so it can trigger a phenotype update once the current call stack becomes empty
                    // 0. Context Inheritance: If a _variable cannot be found on the current node, cell propagates upwards until it finds a node with the attribute.
                    var $current = $node;
                    if (!((key in $node.Genotype)) && key[0] === '_') {
                      while ($current = $current.parentNode) {
                        // eslint-disable-line no-cond-assign
                        if ($current && $current.Genotype && (key in $current.Genotype)) {
                          break;
                        }
                      }
                    }
                    // 1. Set genotype by default
                    Genotype.update($current, key, val);
                    // 2. DOM attribute handling (anything that doesn't start with $ or _)
                    if (key[0] !== '$' && key[0] !== '_') {
                      if (key === 'value') {
                        return Object.getOwnPropertyDescriptor(Object.getPrototypeOf($node), key).set.call($node, val);
                      } else if (key === 'style' && typeof val === 'object') {
                        Phenotype.get(key).set.call($node, val);
                      } else if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
                        $node.setAttribute(key, val);
                      } else if (typeof val === 'function') {
                        Phenotype.get(key).set.call($node, val);
                      }
                    }
                  }
                });
              } catch (e) {}
            },
            build: function ($node) {
              // 1. The special attributes "$type", "$text", "$html", "$components" are tracked by default even if not manually defined
              ['$type', '$text', '$html', '$components'].forEach(function (key) {
                if (!((key in $node.Genotype))) Nucleus.set($node, key);
              });
              // 2. Used for context inheritance. We want to track not just the attributes directly defined on the current node but all the attributes inherited from ancestors.
              if ($node.Inheritance) {
                $node.Inheritance.forEach(function (key) {
                  Nucleus.set($node, key);
                });
              }
              // 3. Track all keys defined on the gene object
              for (var key in $node.Genotype) {
                Nucleus.set($node, key);
              }
            },
            _queue: [],
            bind: function ($node, v) {
              // Binding an attribute to the nucleus.
              // 1. No difference if the attribute is just a regular variable
              // 2. If the attribute is a function, we create a wrapper function that first executes the original function, and then triggers a phenotype update depending on the queue condition
              if (typeof v === 'function') {
                var fun = function () {
                  // In the following code, everything inside Nucleus.tick.call is executed AFTER the last line--v.apply($node, arguments)--because it gets added to the event loop and waits until the next render cycle.
                  // 1. Schedule phenotype update by wrapping them in a single tick (requestAnimationFrame)
                  Nucleus.tick.call($root, function () {
                    // At this point, Nucleus._queue contains all the nodes that have been touched since the last tick.
                    // We process each node one by one to determine whether to update phenotype and whether to auto-trigger $update().
                    // Note: If we're in a middle of multiple nested function calls (fnA calls fnB calls fnC), the queue will be processed from the first function (fnA) only,
                    // This is because the Nucleus._queue will have been drained empty by the time the second function (fnB)'s Nucleus.tick.call reaches this point.
                    Nucleus._queue.forEach(function ($node) {
                      var needs_update = false;
                      /*
                      *  At this point, $node.Dirty looks something like this:
                      *  { "_index": 1, "_items": [0,1,2]  }
                      *
                      *  We go through each and compare with the latest version of the Genotype.
                      *  If there's been a change we set the Phenotype and mark it as "needs_update"
                      */
                      for (var key in $node.Dirty) {
                        if (Gene.freeze($node.Genotype[key]) !== $node.Dirty[key]) {
                          // Update phenotype if the new value is different from old (Dirty)
                          Phenotype.set($node, key, $node.Genotype[key]);
                          if (key[0] === '_') {
                            needs_update = true;
                          }
                        }
                      }
                      if (needs_update && ('$update' in $node.Genotype) && typeof $node.Genotype.$update === 'function') {
                        Phenotype.$update($node);
                      } else {
                        $node.Dirty = null;
                      }
                    });
                    // Remove the $node from the queue
                    var index = Nucleus._queue.indexOf($node);
                    if (index !== -1) Nucleus._queue.splice(index, 1);
                  });
                  // 2. Run the actual function, which will modify the queue
                  return v.apply($node, arguments);
                };
                fun.snapshot = v;
                return fun;
              } else {
                return v;
              }
            },
            queue: function ($node, key, mode) {
              var val = $node.Genotype[key];
              if (mode === 'r') {
                /*
                * Read mode access => the key was queued as a result of a "get()", which doesn't normally mutate the variable.
                *
                * But we still need to take into account the cases where its descendants get mutated, which happens when we're dealing with an array or an object. For example:
                *  - this._items.push(item);
                *  - this._module.name="cell";
                *
                * In these cases we didn't directly mutate the variables (Direct mutations would have been something like: this._items=[1,2]; or this._module={name: "cell"};)
                * but each variable's value *did* change as a result of each expression. To make sure we don't miss these types, we queue them up with a "r" (read) type.
                * But we only need to do this for objects and arrays. (not string, number, etc. because they can't have descendants)
                */
                if (typeof val !== 'object' && !Array.isArray(val)) return;
              }
              if (Nucleus._queue.indexOf($node) === -1) {
                Nucleus._queue.push($node);
              }
              if (!$node.Dirty) $node.Dirty = {};
              if (!((key in $node.Dirty))) {
                /*
                * Caches the original gene under $node.Dirty when a key is touched.
                *
                * {
                *   Dirty: {
                *     "_index": 1,
                *     "_items": [0,1,2]
                *   }
                * }
                *
                */
                $node.Dirty[key] = Gene.freeze($node.Genotype[key]);
              }
            }
          };
          var God = {
            /*
            * The Creator
            * The only purpose of this module is to create cells and get out of the way.
            */
            detect: function ($context) {
              $context['input'] = $context['this'];
              // takes a context, returns all the objects containing thew '$cell' key
              if ($context === undefined) $context = this;
              return Object.keys($context['input']).filter(function (k) {
                try {
                  if ((/webkitStorageInfo|webkitIndexedDB/).test(k) || $context['input'][k] instanceof $context['input'].Element) return false;
                  // Only look for plain javascript object
                  return $context['input'][k] && Object.prototype.hasOwnProperty.call($context['input'][k], '$cell');
                } catch (e) {
                  return false;
                }
              }).map(function (k) {
                return $context['input'][k];
              });
            },
            plan: function ($context) {
              // console.log('-------------->>>>>', $context)
              // Tick($context, 'plan', $context['tick']['God']['plan']++, 0, 'goodPlan')
              // .then((obj) => {
              // console.log('tick plan ->', obj)
              // console.assert(true, obj)
              // })
              // Prepare the DOM for cell creation by adding prototype methods to nodes.
              // As a result, all HTML elements become autonomous.
              if ($context['input'] === undefined) $context['input'] = $root['this']; else $root = $context['input'];
              $context['input'].DocumentFragment.prototype.$build = $context['input'].Element.prototype.$build = function (healthy_gene, inheritance, index, namespace, replace) {
                var gene = $context['cell']['Genotype'].infect(healthy_gene);
                var $node = $context['cell']['Membrane'].build(this, gene, index, namespace, replace);
                $context['cell']['Genotype'].build($node, gene, inheritance || [], index);
                $context['cell']['Nucleus'].build($node);
                $context['cell']['Phenotype'].build($node, $node.Genotype);
                return $node;
              };
              $context['input'].DocumentFragment.prototype.$cell = $context['input'].Element.prototype.$cell = function (gene, options) {
                return this.$build(gene, [], null, options && options.namespace || null, true);
              };
              $context['input'].DocumentFragment.prototype.$snapshot = $context['input'].Element.prototype.$snapshot = function () {
                var json = JSON.stringify(this.Genotype, function (k, v) {
                  if (typeof v === 'function' && v.snapshot) {
                    return '(' + v.snapshot.toString() + ')';
                  }
                  return v;
                });
                return JSON.parse(json, function (k, v) {
                  if (typeof v === 'string' && v.indexOf('function') >= 0) {
                    return eval(v);
                  }
                  return v;
                });
              };
              // console.assert(false, obj['this'])
              // console.assert(false, $root)
              if ($root.NodeList && !$root.NodeList.prototype.forEach) $root.NodeList.prototype.forEach = Array.prototype.forEach;
            },
            create: function ($context) {
              // console.dir($context)
              // console.assert(false, $context['this'])
              // obj['tick'](obj, 'style',0, 0, $context)
              // Automatic cell generation based on declarative rules
              return $context['cell']['God'].detect($context).map(function (gene) {
                // console.assert(false, $context['input'])
                return $context['input'].$build(gene, []);
              });
            }
          };
          // For testing
          if (typeof exports !== 'undefined') {
            let x = {
              Phenotype: Phenotype,
              Genotype: Genotype,
              Nucleus: Nucleus,
              Gene: Gene,
              Membrane: Membrane,
              God: God,
              plan: God.plan.bind(God),
              create: God.create.bind(God)
            };
            if (typeof module !== 'undefined' && module.exports) {
              exports = module.exports = x;
            }
            exports = x;
          } else {
            // console.assert(true, $root)
            $root['input'] = $root['this'];
            $root['tick'] = {};
            $root['tick']['Phenotype'] = {};
            $root['tick']['Phenotype']['index.html'] = 0;
            $root['tick']['Genotype'] = {};
            $root['tick']['Genotype']['index.html'] = 0;
            $root['tick']['Nucleus'] = {};
            $root['tick']['Nucleus']['index.html'] = 0;
            $root['tick']['Gene'] = {};
            $root['tick']['Gene']['index.html'] = 0;
            $root['tick']['Membrane'] = {};
            $root['tick']['Membrane']['index.html'] = 0;
            $root['tick']['God'] = {};
            $root['tick']['God']['plan'] = 0;
            $root['cell'] = {
              Phenotype: Phenotype,
              Genotype: Genotype,
              Nucleus: Nucleus,
              Gene: Gene,
              Membrane: Membrane,
              God: God,
              plan: God.plan.bind(God),
              create: God.create.bind(God)
            };
            let obj = $root;
            $root['cell']['God'].plan($root);
            obj['this'] = $root;
            obj['input'] = $root;
            obj['cell']['God'].create(obj);
          }
        });
      };
      obj['function']['type'] = function (obj) {
        if (parseInt(obj['this']['slot'].length, 10) === 0) {
          if (!obj['this']) {
            obj['slot'] = 'varan-editor';
          } else {
            obj['slot'] = obj['this'].getAttribute('children');
          }
        } else {}
        return obj;
      };
      obj['function']['proxy'] = function (obj) {
        return new Promise(function (resolve, reject) {
          resolve(true);
        });
      };
      obj['this'] = this;
      obj['input'] = this;
      if (obj['this'].slot === null || obj['this'].slot.length === 0) {
        obj['this'].slot = obj['this'].tagName.toLowerCase();
        obj['slot'] = obj['this'].tagName.toLowerCase();
      } else {
        obj['slot'] = obj['this'].slot;
      }
      obj = obj['function']['type'](obj);
      this.DocumentFragment = new DocumentFragment();
      this.DocumentFragment.prototype = window.DocumentFragment.prototype;
      this.createDocumentFragment = function () {
        return document.createDocumentFragment();
      };
      this.Element = window.Element;
      this.setTimeout = window.setTimeout.bind(window);
      this.createElementNS = document.createElementNS;
      this.createTextNode = document.createTextNode;
      this.createElement = function (obj) {
        return document.createElement(obj);
      };
      this.NodeList = this.childNodes;
      this.NodeList.prototype = Array.prototype;
      this.HTMLElement = window.HTMLElement;
      let Jason = await _staticHtmlComponentsComponent_modulesLoaderLoaderMjsDefault.default('/static/html/components/component_modules/cell-index/jason.mjs', 'Jason');
      let ST = await _staticHtmlComponentsComponent_modulesLoaderLoaderMjsDefault.default('/static/html/components/component_modules/cell-index/st.mjs', 'ST');
      let url = '';
      if (obj.this.dataset.url) {
        url = obj.this.dataset.url;
        if (url.indexOf('${location.origin}') !== -1) {
          if (location.origin.indexOf('localhost') !== -1) {
            url = url.replace('${location.origin}', '');
          } else {
            url = url.replace('${location.origin}', `${location.origin}`);
          }
        }
        url = url.toString();
      } else {
        if (obj.this.dataset.json) {
          url = `${location.origin}${obj.this.dataset.json}`;
        } else {
          console.assert(false, 'не знаю что пока делать');
        }
      }
      let style = document.createElement('style');
      style.innerText = '@import "/static/html/components/component_modules/cell-index/jason.css"';
      obj.this.appendChild(style);
      let json = {};
      if (location.origin === 'http://localhost:9876') {
        json = await fetch(`${location.origin}/android/index.json`);
      } else {
        json = await fetch(`${location.origin}/android/index.json`);
      }
      json = await json.json();
      if (url) {
        json['$jason'] = {
          'head': {
            'title': 'Basic'
          },
          'body': {
            'background': {
              'type': 'html',
              'url': `${url}`
            }
          }
        };
      }
      let app = Jason({
        $cell: true,
        style: {
          width: '100%',
          height: '100%',
          margin: '0 auto'
        }
      }, {
        '$jason': json['$jason']
      });
      this.app = app;
      obj['function']['create'](obj);
      if (!this.dataset.url) {} else {
        // console.log('ffgfgf')
        // let host = this.dataset.url.replace('/import','')
        let frame = obj['this'].querySelector('iframe');
      }
    })(this);
  }
});

},{"/static/html/components/component_modules/loader/loader.mjs":"2NYHl","/static/html/components/component_modules/iframe/iframe.mjs":"5uk1y","@parcel/transformer-js/lib/esmodule-helpers.js":"5gA8y"}],"2NYHl":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "style", function () {
  return style;
});
_parcelHelpers.export(exports, "tests", function () {
  return tests;
});
_parcelHelpers.export(exports, "add", function () {
  return add;
});
var _staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjs = require('/static/html/components/component_modules/isEmpty/isEmpty.mjs');
var _staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault = _parcelHelpers.interopDefault(_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjs);
let style = (url = '#', target = undefined) => {
  return new Promise(function (resolve, reject) {
    if (typeof target === 'object' && target.children.length > 0) {
      let allStyle = target.querySelectorAll('style');
      let verify = false;
      for (let i = 0; i < allStyle.length; i++) {
        if (allStyle[i].innerText.indexOf(`${url}`) > 0) {
          verify = true;
        }
      }
      if (verify) {} else {
        let style = document.createElement('style');
        style.innerHTML = `@import '${url}';`;
        target.appendChild(style);
      }
    } else {
      console.assert(false, 'укажите компонент куда будет добавляться стиль');
    }
    resolve({
      style: 'true'
    });
  });
};
let tests = (url, target, obj) => {
  return new Promise(function (resolve, reject) {
    let load = document.createElement('script');
    load.src = url;
    load.type = 'module';
    if (_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault.default(target)) {
      console.warn(`установите путь куда будет добавлен скрипт /n устанавливается в body `);
      // obj.this.shadowRoot.appendChild(load)
      document.body.appendChild(load);
    } else {
      // obj.this.shadowRoot.appendChild(load)
      document.body.querySelector(`#${target}`).appendChild(load);
    }
    load.onload = out => {
      resolve({
        loading: true
      });
    };
  });
};
let add = (url, target) => {
  return new Promise(function (resolve, reject) {
    let load = document.createElement('script');
    load.src = url;
    if (_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault.default(target)) {
      console.warn(`установите путь куда будет добавлен скрипт /n устанавливается в body `);
      document.body.appendChild(load);
    } else {
      document.body.querySelector(`#${target}`).appendChild(load);
    }
    load.onload = out => {
      resolve(window[name]);
    };
  });
};
exports.default = (url, name, obj) => {
  return new Promise(function (resolve, reject) {
    let verifyScript = true;
    let verifyName = name.toLowerCase();
    let Script = {};
    for (let item of document.body.querySelectorAll('script')) {
      if (item.src.indexOf(`${verifyName}.mjs`) > 0) {
        verifyScript = false;
        Script = item;
      }
      if (item.src.indexOf(`${verifyName}.js`) > 0) {
        verifyScript = false;
        Script = item;
      }
    }
    if (verifyScript) {
      if (_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault.default(obj)) {
        if (_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault.default(window[name])) {
          let load = document.createElement('script');
          load.src = url;
          document.body.appendChild(load);
          load.onload = out => {
            document.dispatchEvent(new CustomEvent(`${name}-loading`));
            resolve(window[name]);
          };
        } else {
          resolve(window[name]);
        }
      } else {
        obj.script = undefined;
        if (_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault.default(obj.script)) {
          obj.script = {};
          obj['script'][`${name}`] = {};
        }
        if (_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault.default(window[name])) {
          if (_staticHtmlComponentsComponent_modulesIsEmptyIsEmptyMjsDefault.default(obj['script'][`${name}`])) {
            let load = document.createElement('script');
            load.src = url;
            obj['this']['shadowRoot'].appendChild(load);
            load.onload = out => {
              document.dispatchEvent(new CustomEvent(`${name}-loading`));
              resolve(window[name]);
            };
          }
        } else {
          resolve(window[name]);
        }
      }
    } else {
      resolve(true);
    }
  });
};

},{"/static/html/components/component_modules/isEmpty/isEmpty.mjs":"3ODf5","@parcel/transformer-js/lib/esmodule-helpers.js":"5gA8y"}],"3ODf5":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
let has = Object.prototype.hasOwnProperty;
let toString = Object.prototype.toString;
function isEmpty(val) {
  // Null and Undefined...
  if (val == null) return true;
  // Booleans...
  if ('boolean' == typeof val) return false;
  // Numbers...
  if ('number' == typeof val) return val === 0;
  // Strings...
  if ('string' == typeof val) return val.length === 0;
  // Functions...
  if ('function' == typeof val) return val.length === 0;
  // Arrays...
  if (Array.isArray(val)) {
    let object = val instanceof Object;
    if (object) {
      return Object.keys(val).length === 0;
    } else {
      return val.length === 0;
    }
  }
  // Errors...
  if (val instanceof Error) return val.message === '';
  // Objects...
  if (val.toString == toString) {
    switch (val.toString()) {
      case '[object File]':
      case '[object Map]':
      case '[object Set]':
        {
          return val.size === 0;
        }
      case '[object Object]':
        {
          for (var key in val) {
            if (has.call(val, key)) return false;
          }
          return true;
        }
    }
  }
  // Anything else...
  return false;
}
exports.default = isEmpty;

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5gA8y"}],"5gA8y":[function(require,module,exports) {
"use strict";

exports.interopDefault = function (a) {
  return a && a.__esModule ? a : {
    default: a
  };
};

exports.defineInteropFlag = function (a) {
  Object.defineProperty(a, '__esModule', {
    value: true
  });
};

exports.exportAll = function (source, dest) {
  Object.keys(source).forEach(function (key) {
    if (key === 'default' || key === '__esModule') {
      return;
    } // Skip duplicate re-exports when they have the same value.


    if (key in dest && dest[key] === source[key]) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function () {
        return source[key];
      }
    });
  });
  return dest;
};

exports.export = function (dest, destName, get) {
  Object.defineProperty(dest, destName, {
    enumerable: true,
    get: get
  });
};
},{}],"5uk1y":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
require('/static/html/components/component_modules/emoji/emoji.mjs');
let iframe = {};
iframe.staticProperty = {};
iframe.staticProperty.count = -1;
exports.default = {
  set: (host = '', object = {}, self, alias = undefined) => {
    let channel = new MessageChannel();
    let name = {};
    if (alias === undefined) {
      name = host;
    } else {
      name = alias;
    }
    iframe.staticProperty[`${name}`] = {};
    iframe.staticProperty[`${name}`]['window'] = object;
    iframe.staticProperty[`${name}`]['port'] = channel;
    iframe.staticProperty[`${name}`]['component'] = self;
    iframe.staticProperty[`${name}`]['init'] = false;
  },
  get: (name = '') => {
    return iframe.staticProperty[`${name}`];
  },
  getAll: () => {
    return iframe.staticProperty;
  },
  delete: (name = '') => {
    delete iframe.staticProperty[`${name}`];
  },
  post: (name, data = {}, callback) => {
    if (iframe.staticProperty[`${name}`]['init']) {
      data.property = location.origin;
      iframe.staticProperty[`${name}`]['port'].port1.onmessage = callback;
      iframe.staticProperty[`${name}`]['port'].port1.postMessage(data);
    } else {
      iframe.staticProperty[`${name}`]['port'].port1.onmessage = callback;
      iframe.staticProperty[`${name}`]['init'] = true;
      iframe.staticProperty[`${name}`]['window'].contentWindow.postMessage(data, iframe.staticProperty[`${name}`]['window'].src, [iframe.staticProperty[`${name}`]['port'].port2]);
    }
  },
  count: () => {
    iframe.staticProperty.count++;
  },
  resetCount: () => {
    iframe.staticProperty.count = -1;
  },
  getCount: () => {
    return iframe.staticProperty.count;
  },
  setPort2: (name, port, callback) => {
    if (iframe.staticProperty[`${name}`] === undefined) {
      iframe.staticProperty[`${name}`] = {};
    }
    iframe.staticProperty[`${name}`]['port2'] = port;
    iframe.staticProperty[`${name}`]['port2']['onmessage'] = callback;
  },
  getPort2: name => {
    return iframe.staticProperty[`${name}`]['port2'];
  },
  getAllPort2: () => {
    return iframe.staticProperty;
  }
};

},{"/static/html/components/component_modules/emoji/emoji.mjs":"1c6MQ","@parcel/transformer-js/lib/esmodule-helpers.js":"5gA8y"}],"1c6MQ":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "moon", function () {
  return moon;
});
_parcelHelpers.export(exports, "hearts", function () {
  return hearts;
});
const emojiMap = [{
  emoji: '💯',
  name: '100'
}, {
  emoji: '🔢',
  name: '1234'
}, {
  emoji: '😀',
  name: 'grinning'
}, {
  emoji: '😬',
  name: 'grimacing'
}, {
  emoji: '😁',
  name: 'grin'
}, {
  emoji: '😂',
  name: 'joy'
}, {
  emoji: '🤣',
  name: 'rofl'
}, {
  emoji: '😃',
  name: 'smiley'
}, {
  emoji: '😄',
  name: 'smile'
}, {
  emoji: '😅',
  name: 'sweat_smile'
}, {
  emoji: '😆',
  name: 'laughing'
}, {
  emoji: '😇',
  name: 'innocent'
}, {
  emoji: '😉',
  name: 'wink'
}, {
  emoji: '😊',
  name: 'blush'
}, {
  emoji: '🙂',
  name: 'slightly_smiling_face'
}, {
  emoji: '🙃',
  name: 'upside_down_face'
}, {
  emoji: '☺️',
  name: 'relaxed'
}, {
  emoji: '😋',
  name: 'yum'
}, {
  emoji: '😌',
  name: 'relieved'
}, {
  emoji: '😍',
  name: 'heart_eyes'
}, {
  emoji: '😘',
  name: 'kissing_heart'
}, {
  emoji: '😗',
  name: 'kissing'
}, {
  emoji: '😙',
  name: 'kissing_smiling_eyes'
}, {
  emoji: '😚',
  name: 'kissing_closed_eyes'
}, {
  emoji: '😜',
  name: 'stuck_out_tongue_winking_eye'
}, {
  emoji: '😝',
  name: 'stuck_out_tongue_closed_eyes'
}, {
  emoji: '😛',
  name: 'stuck_out_tongue'
}, {
  emoji: '🤑',
  name: 'money_mouth_face'
}, {
  emoji: '🤓',
  name: 'nerd_face'
}, {
  emoji: '😎',
  name: 'sunglasses'
}, {
  emoji: '🤡',
  name: 'clown_face'
}, {
  emoji: '🤠',
  name: 'cowboy_hat_face'
}, {
  emoji: '🤗',
  name: 'hugs'
}, {
  emoji: '😏',
  name: 'smirk'
}, {
  emoji: '😶',
  name: 'no_mouth'
}, {
  emoji: '😐',
  name: 'neutral_face'
}, {
  emoji: '😑',
  name: 'expressionless'
}, {
  emoji: '😒',
  name: 'unamused'
}, {
  emoji: '🙄',
  name: 'roll_eyes'
}, {
  emoji: '🤔',
  name: 'thinking'
}, {
  emoji: '🤥',
  name: 'lying_face'
}, {
  emoji: '😳',
  name: 'flushed'
}, {
  emoji: '😞',
  name: 'disappointed'
}, {
  emoji: '😟',
  name: 'worried'
}, {
  emoji: '😠',
  name: 'angry'
}, {
  emoji: '😡',
  name: 'rage'
}, {
  emoji: '😔',
  name: 'pensive'
}, {
  emoji: '😕',
  name: 'confused'
}, {
  emoji: '🙁',
  name: 'slightly_frowning_face'
}, {
  emoji: '☹',
  name: 'frowning_face'
}, {
  emoji: '😣',
  name: 'persevere'
}, {
  emoji: '😖',
  name: 'confounded'
}, {
  emoji: '😫',
  name: 'tired_face'
}, {
  emoji: '😩',
  name: 'weary'
}, {
  emoji: '😤',
  name: 'triumph'
}, {
  emoji: '😮',
  name: 'open_mouth'
}, {
  emoji: '😱',
  name: 'scream'
}, {
  emoji: '😨',
  name: 'fearful'
}, {
  emoji: '😰',
  name: 'cold_sweat'
}, {
  emoji: '😯',
  name: 'hushed'
}, {
  emoji: '😦',
  name: 'frowning'
}, {
  emoji: '😧',
  name: 'anguished'
}, {
  emoji: '😢',
  name: 'cry'
}, {
  emoji: '😥',
  name: 'disappointed_relieved'
}, {
  emoji: '🤤',
  name: 'drooling_face'
}, {
  emoji: '😪',
  name: 'sleepy'
}, {
  emoji: '😓',
  name: 'sweat'
}, {
  emoji: '😭',
  name: 'sob'
}, {
  emoji: '😵',
  name: 'dizzy_face'
}, {
  emoji: '😲',
  name: 'astonished'
}, {
  emoji: '🤐',
  name: 'zipper_mouth_face'
}, {
  emoji: '🤢',
  name: 'nauseated_face'
}, {
  emoji: '🤧',
  name: 'sneezing_face'
}, {
  emoji: '😷',
  name: 'mask'
}, {
  emoji: '🤒',
  name: 'face_with_thermometer'
}, {
  emoji: '🤕',
  name: 'face_with_head_bandage'
}, {
  emoji: '😴',
  name: 'sleeping'
}, {
  emoji: '💤',
  name: 'zzz'
}, {
  emoji: '💩',
  name: 'poop'
}, {
  emoji: '😈',
  name: 'smiling_imp'
}, {
  emoji: '👿',
  name: 'imp'
}, {
  emoji: '👹',
  name: 'japanese_ogre'
}, {
  emoji: '👺',
  name: 'japanese_goblin'
}, {
  emoji: '💀',
  name: 'skull'
}, {
  emoji: '👻',
  name: 'ghost'
}, {
  emoji: '👽',
  name: 'alien'
}, {
  emoji: '🤖',
  name: 'robot'
}, {
  emoji: '😺',
  name: 'smiley_cat'
}, {
  emoji: '😸',
  name: 'smile_cat'
}, {
  emoji: '😹',
  name: 'joy_cat'
}, {
  emoji: '😻',
  name: 'heart_eyes_cat'
}, {
  emoji: '😼',
  name: 'smirk_cat'
}, {
  emoji: '😽',
  name: 'kissing_cat'
}, {
  emoji: '🙀',
  name: 'scream_cat'
}, {
  emoji: '😿',
  name: 'crying_cat_face'
}, {
  emoji: '😾',
  name: 'pouting_cat'
}, {
  emoji: '🙌',
  name: 'raised_hands'
}, {
  emoji: '👏',
  name: 'clap'
}, {
  emoji: '👋',
  name: 'wave'
}, {
  emoji: '🤙',
  name: 'call_me_hand'
}, {
  emoji: '👍',
  name: '+1'
}, {
  emoji: '👎',
  name: '-1'
}, {
  emoji: '👊',
  name: 'facepunch'
}, {
  emoji: '✊',
  name: 'fist'
}, {
  emoji: '🤛',
  name: 'fist_left'
}, {
  emoji: '🤜',
  name: 'fist_right'
}, {
  emoji: '✌',
  name: 'v'
}, {
  emoji: '👌',
  name: 'ok_hand'
}, {
  emoji: '✋',
  name: 'raised_hand'
}, {
  emoji: '🤚',
  name: 'raised_back_of_hand'
}, {
  emoji: '👐',
  name: 'open_hands'
}, {
  emoji: '💪',
  name: 'muscle'
}, {
  emoji: '🙏',
  name: 'pray'
}, {
  emoji: '🤝',
  name: 'handshake'
}, {
  emoji: '☝',
  name: 'point_up'
}, {
  emoji: '👆',
  name: 'point_up_2'
}, {
  emoji: '👇',
  name: 'point_down'
}, {
  emoji: '👈',
  name: 'point_left'
}, {
  emoji: '👉',
  name: 'point_right'
}, {
  emoji: '🖕',
  name: 'fu'
}, {
  emoji: '🖐',
  name: 'raised_hand_with_fingers_splayed'
}, {
  emoji: '🤘',
  name: 'metal'
}, {
  emoji: '🤞',
  name: 'crossed_fingers'
}, {
  emoji: '🖖',
  name: 'vulcan_salute'
}, {
  emoji: '✍',
  name: 'writing_hand'
}, {
  emoji: '🤳',
  name: 'selfie'
}, {
  emoji: '💅',
  name: 'nail_care'
}, {
  emoji: '👄',
  name: 'lips'
}, {
  emoji: '👅',
  name: 'tongue'
}, {
  emoji: '👂',
  name: 'ear'
}, {
  emoji: '👃',
  name: 'nose'
}, {
  emoji: '👁',
  name: 'eye'
}, {
  emoji: '👀',
  name: 'eyes'
}, {
  emoji: '👤',
  name: 'bust_in_silhouette'
}, {
  emoji: '👥',
  name: 'busts_in_silhouette'
}, {
  emoji: '🗣',
  name: 'speaking_head'
}, {
  emoji: '👶',
  name: 'baby'
}, {
  emoji: '👦',
  name: 'boy'
}, {
  emoji: '👧',
  name: 'girl'
}, {
  emoji: '👨',
  name: 'man'
}, {
  emoji: '👩',
  name: 'woman'
}, {
  emoji: '👱‍',
  name: 'blonde_woman'
}, {
  emoji: '👱',
  name: 'blonde_man'
}, {
  emoji: '👴',
  name: 'older_man'
}, {
  emoji: '👵',
  name: 'older_woman'
}, {
  emoji: '👲',
  name: 'man_with_gua_pi_mao'
}, {
  emoji: '👳‍',
  name: 'woman_with_turban'
}, {
  emoji: '👳',
  name: 'man_with_turban'
}, {
  emoji: '👮‍',
  name: 'policewoman'
}, {
  emoji: '👮',
  name: 'policeman'
}, {
  emoji: '👷‍',
  name: 'construction_worker_woman'
}, {
  emoji: '👷',
  name: 'construction_worker_man'
}, {
  emoji: '💂‍',
  name: 'guardswoman'
}, {
  emoji: '💂',
  name: 'guardsman'
}, {
  emoji: '🕵️‍',
  name: 'female_detective'
}, {
  emoji: '🕵',
  name: 'male_detective'
}, {
  emoji: '👩‍⚕️',
  name: 'woman_health_worker'
}, {
  emoji: '👨‍⚕️',
  name: 'man_health_worker'
}, {
  emoji: '👩‍🌾',
  name: 'woman_farmer'
}, {
  emoji: '👨‍🌾',
  name: 'man_farmer'
}, {
  emoji: '👩‍🍳',
  name: 'woman_cook'
}, {
  emoji: '👨‍🍳',
  name: 'man_cook'
}, {
  emoji: '👩‍🎓',
  name: 'woman_student'
}, {
  emoji: '👨‍🎓',
  name: 'man_student'
}, {
  emoji: '👩‍🎤',
  name: 'woman_singer'
}, {
  emoji: '👨‍🎤',
  name: 'man_singer'
}, {
  emoji: '👩‍🏫',
  name: 'woman_teacher'
}, {
  emoji: '👨‍🏫',
  name: 'man_teacher'
}, {
  emoji: '👩‍🏭',
  name: 'woman_factory_worker'
}, {
  emoji: '👨‍🏭',
  name: 'man_factory_worker'
}, {
  emoji: '👩‍💻',
  name: 'woman_technologist'
}, {
  emoji: '👨‍💻',
  name: 'man_technologist'
}, {
  emoji: '👩‍💼',
  name: 'woman_office_worker'
}, {
  emoji: '👨‍💼',
  name: 'man_office_worker'
}, {
  emoji: '👩‍🔧',
  name: 'woman_mechanic'
}, {
  emoji: '👨‍🔧',
  name: 'man_mechanic'
}, {
  emoji: '👩‍🔬',
  name: 'woman_scientist'
}, {
  emoji: '👨‍🔬',
  name: 'man_scientist'
}, {
  emoji: '👩‍🎨',
  name: 'woman_artist'
}, {
  emoji: '👨‍🎨',
  name: 'man_artist'
}, {
  emoji: '👩‍🚒',
  name: 'woman_firefighter'
}, {
  emoji: '👨‍🚒',
  name: 'man_firefighter'
}, {
  emoji: '👩‍✈️',
  name: 'woman_pilot'
}, {
  emoji: '👨‍✈️',
  name: 'man_pilot'
}, {
  emoji: '👩‍🚀',
  name: 'woman_astronaut'
}, {
  emoji: '👨‍🚀',
  name: 'man_astronaut'
}, {
  emoji: '👩‍⚖️',
  name: 'woman_judge'
}, {
  emoji: '👨‍⚖️',
  name: 'man_judge'
}, {
  emoji: '🤶',
  name: 'mrs_claus'
}, {
  emoji: '🎅',
  name: 'santa'
}, {
  emoji: '👼',
  name: 'angel'
}, {
  emoji: '🤰',
  name: 'pregnant_woman'
}, {
  emoji: '👸',
  name: 'princess'
}, {
  emoji: '🤴',
  name: 'prince'
}, {
  emoji: '👰',
  name: 'bride_with_veil'
}, {
  emoji: '🤵',
  name: 'man_in_tuxedo'
}, {
  emoji: '🏃‍',
  name: 'running_woman'
}, {
  emoji: '🏃',
  name: 'running_man'
}, {
  emoji: '🚶‍',
  name: 'walking_woman'
}, {
  emoji: '🚶',
  name: 'walking_man'
}, {
  emoji: '💃',
  name: 'dancer'
}, {
  emoji: '🕺',
  name: 'man_dancing'
}, {
  emoji: '👯',
  name: 'dancing_women'
}, {
  emoji: '👯‍',
  name: 'dancing_men'
}, {
  emoji: '👫',
  name: 'couple'
}, {
  emoji: '👬',
  name: 'two_men_holding_hands'
}, {
  emoji: '👭',
  name: 'two_women_holding_hands'
}, {
  emoji: '🙇‍',
  name: 'bowing_woman'
}, {
  emoji: '🙇',
  name: 'bowing_man'
}, {
  emoji: '🤦',
  name: 'man_facepalming'
}, {
  emoji: '🤦‍',
  name: 'woman_facepalming'
}, {
  emoji: '🤷',
  name: 'woman_shrugging'
}, {
  emoji: '🤷‍',
  name: 'man_shrugging'
}, {
  emoji: '💁',
  name: 'tipping_hand_woman'
}, {
  emoji: '💁‍',
  name: 'tipping_hand_man'
}, {
  emoji: '🙅',
  name: 'no_good_woman'
}, {
  emoji: '🙅‍',
  name: 'no_good_man'
}, {
  emoji: '🙆',
  name: 'ok_woman'
}, {
  emoji: '🙆‍',
  name: 'ok_man'
}, {
  emoji: '🙋',
  name: 'raising_hand_woman'
}, {
  emoji: '🙋‍',
  name: 'raising_hand_man'
}, {
  emoji: '🙎',
  name: 'pouting_woman'
}, {
  emoji: '🙎‍',
  name: 'pouting_man'
}, {
  emoji: '🙍',
  name: 'frowning_woman'
}, {
  emoji: '🙍‍',
  name: 'frowning_man'
}, {
  emoji: '💇',
  name: 'haircut_woman'
}, {
  emoji: '💇‍',
  name: 'haircut_man'
}, {
  emoji: '💆',
  name: 'massage_woman'
}, {
  emoji: '💆‍',
  name: 'massage_man'
}, {
  emoji: '💑',
  name: 'couple_with_heart_woman_man'
}, {
  emoji: '👩‍❤️‍👩',
  name: 'couple_with_heart_woman_woman'
}, {
  emoji: '👨‍❤️‍👨',
  name: 'couple_with_heart_man_man'
}, {
  emoji: '💏',
  name: 'couplekiss_man_woman'
}, {
  emoji: '👩‍❤️‍💋‍👩',
  name: 'couplekiss_woman_woman'
}, {
  emoji: '👨‍❤️‍💋‍👨',
  name: 'couplekiss_man_man'
}, {
  emoji: '👪',
  name: 'family_man_woman_boy'
}, {
  emoji: '👨‍👩‍👧',
  name: 'family_man_woman_girl'
}, {
  emoji: '👨‍👩‍👧‍👦',
  name: 'family_man_woman_girl_boy'
}, {
  emoji: '👨‍👩‍👦‍👦',
  name: 'family_man_woman_boy_boy'
}, {
  emoji: '👨‍👩‍👧‍👧',
  name: 'family_man_woman_girl_girl'
}, {
  emoji: '👩‍👩‍👦',
  name: 'family_woman_woman_boy'
}, {
  emoji: '👩‍👩‍👧',
  name: 'family_woman_woman_girl'
}, {
  emoji: '👩‍👩‍👧‍👦',
  name: 'family_woman_woman_girl_boy'
}, {
  emoji: '👩‍👩‍👦‍👦',
  name: 'family_woman_woman_boy_boy'
}, {
  emoji: '👩‍👩‍👧‍👧',
  name: 'family_woman_woman_girl_girl'
}, {
  emoji: '👨‍👨‍👦',
  name: 'family_man_man_boy'
}, {
  emoji: '👨‍👨‍👧',
  name: 'family_man_man_girl'
}, {
  emoji: '👨‍👨‍👧‍👦',
  name: 'family_man_man_girl_boy'
}, {
  emoji: '👨‍👨‍👦‍👦',
  name: 'family_man_man_boy_boy'
}, {
  emoji: '👨‍👨‍👧‍👧',
  name: 'family_man_man_girl_girl'
}, {
  emoji: '👩‍👦',
  name: 'family_woman_boy'
}, {
  emoji: '👩‍👧',
  name: 'family_woman_girl'
}, {
  emoji: '👩‍👧‍👦',
  name: 'family_woman_girl_boy'
}, {
  emoji: '👩‍👦‍👦',
  name: 'family_woman_boy_boy'
}, {
  emoji: '👩‍👧‍👧',
  name: 'family_woman_girl_girl'
}, {
  emoji: '👨‍👦',
  name: 'family_man_boy'
}, {
  emoji: '👨‍👧',
  name: 'family_man_girl'
}, {
  emoji: '👨‍👧‍👦',
  name: 'family_man_girl_boy'
}, {
  emoji: '👨‍👦‍👦',
  name: 'family_man_boy_boy'
}, {
  emoji: '👨‍👧‍👧',
  name: 'family_man_girl_girl'
}, {
  emoji: '👚',
  name: 'womans_clothes'
}, {
  emoji: '👕',
  name: 'tshirt'
}, {
  emoji: '👖',
  name: 'jeans'
}, {
  emoji: '👔',
  name: 'necktie'
}, {
  emoji: '👗',
  name: 'dress'
}, {
  emoji: '👙',
  name: 'bikini'
}, {
  emoji: '👘',
  name: 'kimono'
}, {
  emoji: '💄',
  name: 'lipstick'
}, {
  emoji: '💋',
  name: 'kiss'
}, {
  emoji: '👣',
  name: 'footprints'
}, {
  emoji: '👠',
  name: 'high_heel'
}, {
  emoji: '👡',
  name: 'sandal'
}, {
  emoji: '👢',
  name: 'boot'
}, {
  emoji: '👞',
  name: 'mans_shoe'
}, {
  emoji: '👟',
  name: 'athletic_shoe'
}, {
  emoji: '👒',
  name: 'womans_hat'
}, {
  emoji: '🎩',
  name: 'tophat'
}, {
  emoji: '⛑',
  name: 'rescue_worker_helmet'
}, {
  emoji: '🎓',
  name: 'mortar_board'
}, {
  emoji: '👑',
  name: 'crown'
}, {
  emoji: '🎒',
  name: 'school_satchel'
}, {
  emoji: '👝',
  name: 'pouch'
}, {
  emoji: '👛',
  name: 'purse'
}, {
  emoji: '👜',
  name: 'handbag'
}, {
  emoji: '💼',
  name: 'briefcase'
}, {
  emoji: '👓',
  name: 'eyeglasses'
}, {
  emoji: '🕶',
  name: 'dark_sunglasses'
}, {
  emoji: '💍',
  name: 'ring'
}, {
  emoji: '🌂',
  name: 'closed_umbrella'
}, {
  emoji: '🐶',
  name: 'dog'
}, {
  emoji: '🐱',
  name: 'cat'
}, {
  emoji: '🐭',
  name: 'mouse'
}, {
  emoji: '🐹',
  name: 'hamster'
}, {
  emoji: '🐰',
  name: 'rabbit'
}, {
  emoji: '🦊',
  name: 'fox_face'
}, {
  emoji: '🐻',
  name: 'bear'
}, {
  emoji: '🐼',
  name: 'panda_face'
}, {
  emoji: '🐨',
  name: 'koala'
}, {
  emoji: '🐯',
  name: 'tiger'
}, {
  emoji: '🦁',
  name: 'lion'
}, {
  emoji: '🐮',
  name: 'cow'
}, {
  emoji: '🐷',
  name: 'pig'
}, {
  emoji: '🐽',
  name: 'pig_nose'
}, {
  emoji: '🐸',
  name: 'frog'
}, {
  emoji: '🦑',
  name: 'squid'
}, {
  emoji: '🐙',
  name: 'octopus'
}, {
  emoji: '🦐',
  name: 'shrimp'
}, {
  emoji: '🐵',
  name: 'monkey_face'
}, {
  emoji: '🦍',
  name: 'gorilla'
}, {
  emoji: '🙈',
  name: 'see_no_evil'
}, {
  emoji: '🙉',
  name: 'hear_no_evil'
}, {
  emoji: '🙊',
  name: 'speak_no_evil'
}, {
  emoji: '🐒',
  name: 'monkey'
}, {
  emoji: '🐔',
  name: 'chicken'
}, {
  emoji: '🐧',
  name: 'penguin'
}, {
  emoji: '🐦',
  name: 'bird'
}, {
  emoji: '🐤',
  name: 'baby_chick'
}, {
  emoji: '🐣',
  name: 'hatching_chick'
}, {
  emoji: '🐥',
  name: 'hatched_chick'
}, {
  emoji: '🦆',
  name: 'duck'
}, {
  emoji: '🦅',
  name: 'eagle'
}, {
  emoji: '🦉',
  name: 'owl'
}, {
  emoji: '🦇',
  name: 'bat'
}, {
  emoji: '🐺',
  name: 'wolf'
}, {
  emoji: '🐗',
  name: 'boar'
}, {
  emoji: '🐴',
  name: 'horse'
}, {
  emoji: '🦄',
  name: 'unicorn'
}, {
  emoji: '🐝',
  name: 'honeybee'
}, {
  emoji: '🐛',
  name: 'bug'
}, {
  emoji: '🦋',
  name: 'butterfly'
}, {
  emoji: '🐌',
  name: 'snail'
}, {
  emoji: '🐞',
  name: 'beetle'
}, {
  emoji: '🐜',
  name: 'ant'
}, {
  emoji: '🕷',
  name: 'spider'
}, {
  emoji: '🦂',
  name: 'scorpion'
}, {
  emoji: '🦀',
  name: 'crab'
}, {
  emoji: '🐍',
  name: 'snake'
}, {
  emoji: '🦎',
  name: 'lizard'
}, {
  emoji: '🐢',
  name: 'turtle'
}, {
  emoji: '🐠',
  name: 'tropical_fish'
}, {
  emoji: '🐟',
  name: 'fish'
}, {
  emoji: '🐡',
  name: 'blowfish'
}, {
  emoji: '🐬',
  name: 'dolphin'
}, {
  emoji: '🦈',
  name: 'shark'
}, {
  emoji: '🐳',
  name: 'whale'
}, {
  emoji: '🐋',
  name: 'whale2'
}, {
  emoji: '🐊',
  name: 'crocodile'
}, {
  emoji: '🐆',
  name: 'leopard'
}, {
  emoji: '🐅',
  name: 'tiger2'
}, {
  emoji: '🐃',
  name: 'water_buffalo'
}, {
  emoji: '🐂',
  name: 'ox'
}, {
  emoji: '🐄',
  name: 'cow2'
}, {
  emoji: '🦌',
  name: 'deer'
}, {
  emoji: '🐪',
  name: 'dromedary_camel'
}, {
  emoji: '🐫',
  name: 'camel'
}, {
  emoji: '🐘',
  name: 'elephant'
}, {
  emoji: '🦏',
  name: 'rhinoceros'
}, {
  emoji: '🐐',
  name: 'goat'
}, {
  emoji: '🐏',
  name: 'ram'
}, {
  emoji: '🐑',
  name: 'sheep'
}, {
  emoji: '🐎',
  name: 'racehorse'
}, {
  emoji: '🐖',
  name: 'pig2'
}, {
  emoji: '🐀',
  name: 'rat'
}, {
  emoji: '🐁',
  name: 'mouse2'
}, {
  emoji: '🐓',
  name: 'rooster'
}, {
  emoji: '🦃',
  name: 'turkey'
}, {
  emoji: '🕊',
  name: 'dove'
}, {
  emoji: '🐕',
  name: 'dog2'
}, {
  emoji: '🐩',
  name: 'poodle'
}, {
  emoji: '🐈',
  name: 'cat2'
}, {
  emoji: '🐇',
  name: 'rabbit2'
}, {
  emoji: '🐿',
  name: 'chipmunk'
}, {
  emoji: '🐾',
  name: 'paw_prints'
}, {
  emoji: '🐉',
  name: 'dragon'
}, {
  emoji: '🐲',
  name: 'dragon_face'
}, {
  emoji: '🌵',
  name: 'cactus'
}, {
  emoji: '🎄',
  name: 'christmas_tree'
}, {
  emoji: '🌲',
  name: 'evergreen_tree'
}, {
  emoji: '🌳',
  name: 'deciduous_tree'
}, {
  emoji: '🌴',
  name: 'palm_tree'
}, {
  emoji: '🌱',
  name: 'seedling'
}, {
  emoji: '🌿',
  name: 'herb'
}, {
  emoji: '☘',
  name: 'shamrock'
}, {
  emoji: '🍀',
  name: 'four_leaf_clover'
}, {
  emoji: '🎍',
  name: 'bamboo'
}, {
  emoji: '🎋',
  name: 'tanabata_tree'
}, {
  emoji: '🍃',
  name: 'leaves'
}, {
  emoji: '🍂',
  name: 'fallen_leaf'
}, {
  emoji: '🍁',
  name: 'maple_leaf'
}, {
  emoji: '🌾',
  name: 'ear_of_rice'
}, {
  emoji: '🌺',
  name: 'hibiscus'
}, {
  emoji: '🌻',
  name: 'sunflower'
}, {
  emoji: '🌹',
  name: 'rose'
}, {
  emoji: '🥀',
  name: 'wilted_flower'
}, {
  emoji: '🌷',
  name: 'tulip'
}, {
  emoji: '🌼',
  name: 'blossom'
}, {
  emoji: '🌸',
  name: 'cherry_blossom'
}, {
  emoji: '💐',
  name: 'bouquet'
}, {
  emoji: '🍄',
  name: 'mushroom'
}, {
  emoji: '🌰',
  name: 'chestnut'
}, {
  emoji: '🎃',
  name: 'jack_o_lantern'
}, {
  emoji: '🐚',
  name: 'shell'
}, {
  emoji: '🕸',
  name: 'spider_web'
}, {
  emoji: '🌎',
  name: 'earth_americas'
}, {
  emoji: '🌍',
  name: 'earth_africa'
}, {
  emoji: '🌏',
  name: 'earth_asia'
}, {
  emoji: '🌕',
  name: 'full_moon'
}, {
  emoji: '🌖',
  name: 'waning_gibbous_moon'
}, {
  emoji: '🌗',
  name: 'last_quarter_moon'
}, {
  emoji: '🌘',
  name: 'waning_crescent_moon'
}, {
  emoji: '🌑',
  name: 'new_moon'
}, {
  emoji: '🌒',
  name: 'waxing_crescent_moon'
}, {
  emoji: '🌓',
  name: 'first_quarter_moon'
}, {
  emoji: '🌔',
  name: 'waxing_gibbous_moon'
}, {
  emoji: '🌚',
  name: 'new_moon_with_face'
}, {
  emoji: '🌝',
  name: 'full_moon_with_face'
}, {
  emoji: '🌛',
  name: 'first_quarter_moon_with_face'
}, {
  emoji: '🌜',
  name: 'last_quarter_moon_with_face'
}, {
  emoji: '🌞',
  name: 'sun_with_face'
}, {
  emoji: '🌙',
  name: 'crescent_moon'
}, {
  emoji: '⭐',
  name: 'star'
}, {
  emoji: '🌟',
  name: 'star2'
}, {
  emoji: '💫',
  name: 'dizzy'
}, {
  emoji: '✨',
  name: 'sparkles'
}, {
  emoji: '☄',
  name: 'comet'
}, {
  emoji: '☀️',
  name: 'sunny'
}, {
  emoji: '🌤',
  name: 'sun_behind_small_cloud'
}, {
  emoji: '⛅',
  name: 'partly_sunny'
}, {
  emoji: '🌥',
  name: 'sun_behind_large_cloud'
}, {
  emoji: '🌦',
  name: 'sun_behind_rain_cloud'
}, {
  emoji: '☁️',
  name: 'cloud'
}, {
  emoji: '🌧',
  name: 'cloud_with_rain'
}, {
  emoji: '⛈',
  name: 'cloud_with_lightning_and_rain'
}, {
  emoji: '🌩',
  name: 'cloud_with_lightning'
}, {
  emoji: '⚡',
  name: 'zap'
}, {
  emoji: '🔥',
  name: 'fire'
}, {
  emoji: '💥',
  name: 'boom'
}, {
  emoji: '❄️',
  name: 'snowflake'
}, {
  emoji: '🌨',
  name: 'cloud_with_snow'
}, {
  emoji: '⛄',
  name: 'snowman'
}, {
  emoji: '☃',
  name: 'snowman_with_snow'
}, {
  emoji: '🌬',
  name: 'wind_face'
}, {
  emoji: '💨',
  name: 'dash'
}, {
  emoji: '🌪',
  name: 'tornado'
}, {
  emoji: '🌫',
  name: 'fog'
}, {
  emoji: '☂',
  name: 'open_umbrella'
}, {
  emoji: '☔',
  name: 'umbrella'
}, {
  emoji: '💧',
  name: 'droplet'
}, {
  emoji: '💦',
  name: 'sweat_drops'
}, {
  emoji: '🌊',
  name: 'ocean'
}, {
  emoji: '🍏',
  name: 'green_apple'
}, {
  emoji: '🍎',
  name: 'apple'
}, {
  emoji: '🍐',
  name: 'pear'
}, {
  emoji: '🍊',
  name: 'tangerine'
}, {
  emoji: '🍋',
  name: 'lemon'
}, {
  emoji: '🍌',
  name: 'banana'
}, {
  emoji: '🍉',
  name: 'watermelon'
}, {
  emoji: '🍇',
  name: 'grapes'
}, {
  emoji: '🍓',
  name: 'strawberry'
}, {
  emoji: '🍈',
  name: 'melon'
}, {
  emoji: '🍒',
  name: 'cherries'
}, {
  emoji: '🍑',
  name: 'peach'
}, {
  emoji: '🍍',
  name: 'pineapple'
}, {
  emoji: '🥝',
  name: 'kiwi_fruit'
}, {
  emoji: '🥑',
  name: 'avocado'
}, {
  emoji: '🍅',
  name: 'tomato'
}, {
  emoji: '🍆',
  name: 'eggplant'
}, {
  emoji: '🥒',
  name: 'cucumber'
}, {
  emoji: '🥕',
  name: 'carrot'
}, {
  emoji: '🌶',
  name: 'hot_pepper'
}, {
  emoji: '🥔',
  name: 'potato'
}, {
  emoji: '🌽',
  name: 'corn'
}, {
  emoji: '🍠',
  name: 'sweet_potato'
}, {
  emoji: '🥜',
  name: 'peanuts'
}, {
  emoji: '🍯',
  name: 'honey_pot'
}, {
  emoji: '🥐',
  name: 'croissant'
}, {
  emoji: '🍞',
  name: 'bread'
}, {
  emoji: '🥖',
  name: 'baguette_bread'
}, {
  emoji: '🧀',
  name: 'cheese'
}, {
  emoji: '🥚',
  name: 'egg'
}, {
  emoji: '🥓',
  name: 'bacon'
}, {
  emoji: '🥞',
  name: 'pancakes'
}, {
  emoji: '🍗',
  name: 'poultry_leg'
}, {
  emoji: '🍖',
  name: 'meat_on_bone'
}, {
  emoji: '🍤',
  name: 'fried_shrimp'
}, {
  emoji: '🍳',
  name: 'fried_egg'
}, {
  emoji: '🍔',
  name: 'hamburger'
}, {
  emoji: '🍟',
  name: 'fries'
}, {
  emoji: '🥙',
  name: 'stuffed_flatbread'
}, {
  emoji: '🌭',
  name: 'hotdog'
}, {
  emoji: '🍕',
  name: 'pizza'
}, {
  emoji: '🍝',
  name: 'spaghetti'
}, {
  emoji: '🌮',
  name: 'taco'
}, {
  emoji: '🌯',
  name: 'burrito'
}, {
  emoji: '🥗',
  name: 'green_salad'
}, {
  emoji: '🥘',
  name: 'shallow_pan_of_food'
}, {
  emoji: '🍜',
  name: 'ramen'
}, {
  emoji: '🍲',
  name: 'stew'
}, {
  emoji: '🍥',
  name: 'fish_cake'
}, {
  emoji: '🍣',
  name: 'sushi'
}, {
  emoji: '🍱',
  name: 'bento'
}, {
  emoji: '🍛',
  name: 'curry'
}, {
  emoji: '🍙',
  name: 'rice_ball'
}, {
  emoji: '🍚',
  name: 'rice'
}, {
  emoji: '🍘',
  name: 'rice_cracker'
}, {
  emoji: '🍢',
  name: 'oden'
}, {
  emoji: '🍡',
  name: 'dango'
}, {
  emoji: '🍧',
  name: 'shaved_ice'
}, {
  emoji: '🍨',
  name: 'ice_cream'
}, {
  emoji: '🍦',
  name: 'icecream'
}, {
  emoji: '🍰',
  name: 'cake'
}, {
  emoji: '🎂',
  name: 'birthday'
}, {
  emoji: '🍮',
  name: 'custard'
}, {
  emoji: '🍬',
  name: 'candy'
}, {
  emoji: '🍭',
  name: 'lollipop'
}, {
  emoji: '🍫',
  name: 'chocolate_bar'
}, {
  emoji: '🍿',
  name: 'popcorn'
}, {
  emoji: '🍩',
  name: 'doughnut'
}, {
  emoji: '🍪',
  name: 'cookie'
}, {
  emoji: '🥛',
  name: 'milk_glass'
}, {
  emoji: '🍺',
  name: 'beer'
}, {
  emoji: '🍻',
  name: 'beers'
}, {
  emoji: '🥂',
  name: 'clinking_glasses'
}, {
  emoji: '🍷',
  name: 'wine_glass'
}, {
  emoji: '🥃',
  name: 'tumbler_glass'
}, {
  emoji: '🍸',
  name: 'cocktail'
}, {
  emoji: '🍹',
  name: 'tropical_drink'
}, {
  emoji: '🍾',
  name: 'champagne'
}, {
  emoji: '🍶',
  name: 'sake'
}, {
  emoji: '🍵',
  name: 'tea'
}, {
  emoji: '☕',
  name: 'coffee'
}, {
  emoji: '🍼',
  name: 'baby_bottle'
}, {
  emoji: '🥄',
  name: 'spoon'
}, {
  emoji: '🍴',
  name: 'fork_and_knife'
}, {
  emoji: '🍽',
  name: 'plate_with_cutlery'
}, {
  emoji: '⚽',
  name: 'soccer'
}, {
  emoji: '🏀',
  name: 'basketball'
}, {
  emoji: '🏈',
  name: 'football'
}, {
  emoji: '⚾',
  name: 'baseball'
}, {
  emoji: '🎾',
  name: 'tennis'
}, {
  emoji: '🏐',
  name: 'volleyball'
}, {
  emoji: '🏉',
  name: 'rugby_football'
}, {
  emoji: '🎱',
  name: '8ball'
}, {
  emoji: '⛳',
  name: 'golf'
}, {
  emoji: '🏌️‍',
  name: 'golfing_woman'
}, {
  emoji: '🏌',
  name: 'golfing_man'
}, {
  emoji: '🏓',
  name: 'ping_pong'
}, {
  emoji: '🏸',
  name: 'badminton'
}, {
  emoji: '🥅',
  name: 'goal_net'
}, {
  emoji: '🏒',
  name: 'ice_hockey'
}, {
  emoji: '🏑',
  name: 'field_hockey'
}, {
  emoji: '🏏',
  name: 'cricket'
}, {
  emoji: '🎿',
  name: 'ski'
}, {
  emoji: '⛷',
  name: 'skier'
}, {
  emoji: '🏂',
  name: 'snowboarder'
}, {
  emoji: '🤺',
  name: 'person_fencing'
}, {
  emoji: '🤼‍',
  name: 'women_wrestling'
}, {
  emoji: '🤼‍',
  name: 'men_wrestling'
}, {
  emoji: '🤸‍',
  name: 'woman_cartwheeling'
}, {
  emoji: '🤸‍',
  name: 'man_cartwheeling'
}, {
  emoji: '🤾‍',
  name: 'woman_playing_handball'
}, {
  emoji: '🤾‍',
  name: 'man_playing_handball'
}, {
  emoji: '⛸',
  name: 'ice_skate'
}, {
  emoji: '🏹',
  name: 'bow_and_arrow'
}, {
  emoji: '🎣',
  name: 'fishing_pole_and_fish'
}, {
  emoji: '🥊',
  name: 'boxing_glove'
}, {
  emoji: '🥋',
  name: 'martial_arts_uniform'
}, {
  emoji: '🚣‍',
  name: 'rowing_woman'
}, {
  emoji: '🚣',
  name: 'rowing_man'
}, {
  emoji: '🏊‍',
  name: 'swimming_woman'
}, {
  emoji: '🏊',
  name: 'swimming_man'
}, {
  emoji: '🤽‍',
  name: 'woman_playing_water_polo'
}, {
  emoji: '🤽‍',
  name: 'man_playing_water_polo'
}, {
  emoji: '🏄‍',
  name: 'surfing_woman'
}, {
  emoji: '🏄',
  name: 'surfing_man'
}, {
  emoji: '🛀',
  name: 'bath'
}, {
  emoji: '⛹️‍',
  name: 'basketball_woman'
}, {
  emoji: '⛹',
  name: 'basketball_man'
}, {
  emoji: '🏋️‍',
  name: 'weight_lifting_woman'
}, {
  emoji: '🏋',
  name: 'weight_lifting_man'
}, {
  emoji: '🚴‍',
  name: 'biking_woman'
}, {
  emoji: '🚴',
  name: 'biking_man'
}, {
  emoji: '🚵‍',
  name: 'mountain_biking_woman'
}, {
  emoji: '🚵',
  name: 'mountain_biking_man'
}, {
  emoji: '🏇',
  name: 'horse_racing'
}, {
  emoji: '🕴',
  name: 'business_suit_levitating'
}, {
  emoji: '🏆',
  name: 'trophy'
}, {
  emoji: '🎽',
  name: 'running_shirt_with_sash'
}, {
  emoji: '🏅',
  name: 'medal_sports'
}, {
  emoji: '🎖',
  name: 'medal_military'
}, {
  emoji: '🥇',
  name: '1st_place_medal'
}, {
  emoji: '🥈',
  name: '2nd_place_medal'
}, {
  emoji: '🥉',
  name: '3rd_place_medal'
}, {
  emoji: '🎗',
  name: 'reminder_ribbon'
}, {
  emoji: '🏵',
  name: 'rosette'
}, {
  emoji: '🎫',
  name: 'ticket'
}, {
  emoji: '🎟',
  name: 'tickets'
}, {
  emoji: '🎭',
  name: 'performing_arts'
}, {
  emoji: '🎨',
  name: 'art'
}, {
  emoji: '🎪',
  name: 'circus_tent'
}, {
  emoji: '🤹‍',
  name: 'woman_juggling'
}, {
  emoji: '🤹‍',
  name: 'man_juggling'
}, {
  emoji: '🎤',
  name: 'microphone'
}, {
  emoji: '🎧',
  name: 'headphones'
}, {
  emoji: '🎼',
  name: 'musical_score'
}, {
  emoji: '🎹',
  name: 'musical_keyboard'
}, {
  emoji: '🥁',
  name: 'drum'
}, {
  emoji: '🎷',
  name: 'saxophone'
}, {
  emoji: '🎺',
  name: 'trumpet'
}, {
  emoji: '🎸',
  name: 'guitar'
}, {
  emoji: '🎻',
  name: 'violin'
}, {
  emoji: '🎬',
  name: 'clapper'
}, {
  emoji: '🎮',
  name: 'video_game'
}, {
  emoji: '👾',
  name: 'space_invader'
}, {
  emoji: '🎯',
  name: 'dart'
}, {
  emoji: '🎲',
  name: 'game_die'
}, {
  emoji: '🎰',
  name: 'slot_machine'
}, {
  emoji: '🎳',
  name: 'bowling'
}, {
  emoji: '🚗',
  name: 'red_car'
}, {
  emoji: '🚕',
  name: 'taxi'
}, {
  emoji: '🚙',
  name: 'blue_car'
}, {
  emoji: '🚌',
  name: 'bus'
}, {
  emoji: '🚎',
  name: 'trolleybus'
}, {
  emoji: '🏎',
  name: 'racing_car'
}, {
  emoji: '🚓',
  name: 'police_car'
}, {
  emoji: '🚑',
  name: 'ambulance'
}, {
  emoji: '🚒',
  name: 'fire_engine'
}, {
  emoji: '🚐',
  name: 'minibus'
}, {
  emoji: '🚚',
  name: 'truck'
}, {
  emoji: '🚛',
  name: 'articulated_lorry'
}, {
  emoji: '🚜',
  name: 'tractor'
}, {
  emoji: '🛴',
  name: 'kick_scooter'
}, {
  emoji: '🏍',
  name: 'motorcycle'
}, {
  emoji: '🚲',
  name: 'bike'
}, {
  emoji: '🛵',
  name: 'motor_scooter'
}, {
  emoji: '🚨',
  name: 'rotating_light'
}, {
  emoji: '🚔',
  name: 'oncoming_police_car'
}, {
  emoji: '🚍',
  name: 'oncoming_bus'
}, {
  emoji: '🚘',
  name: 'oncoming_automobile'
}, {
  emoji: '🚖',
  name: 'oncoming_taxi'
}, {
  emoji: '🚡',
  name: 'aerial_tramway'
}, {
  emoji: '🚠',
  name: 'mountain_cableway'
}, {
  emoji: '🚟',
  name: 'suspension_railway'
}, {
  emoji: '🚃',
  name: 'railway_car'
}, {
  emoji: '🚋',
  name: 'train'
}, {
  emoji: '🚝',
  name: 'monorail'
}, {
  emoji: '🚄',
  name: 'bullettrain_side'
}, {
  emoji: '🚅',
  name: 'bullettrain_front'
}, {
  emoji: '🚈',
  name: 'light_rail'
}, {
  emoji: '🚞',
  name: 'mountain_railway'
}, {
  emoji: '🚂',
  name: 'steam_locomotive'
}, {
  emoji: '🚆',
  name: 'train2'
}, {
  emoji: '🚇',
  name: 'metro'
}, {
  emoji: '🚊',
  name: 'tram'
}, {
  emoji: '🚉',
  name: 'station'
}, {
  emoji: '🚁',
  name: 'helicopter'
}, {
  emoji: '🛩',
  name: 'small_airplane'
}, {
  emoji: '✈️',
  name: 'airplane'
}, {
  emoji: '🛫',
  name: 'flight_departure'
}, {
  emoji: '🛬',
  name: 'flight_arrival'
}, {
  emoji: '⛵',
  name: 'sailboat'
}, {
  emoji: '🛥',
  name: 'motor_boat'
}, {
  emoji: '🚤',
  name: 'speedboat'
}, {
  emoji: '⛴',
  name: 'ferry'
}, {
  emoji: '🛳',
  name: 'passenger_ship'
}, {
  emoji: '🚀',
  name: 'rocket'
}, {
  emoji: '🛰',
  name: 'artificial_satellite'
}, {
  emoji: '💺',
  name: 'seat'
}, {
  emoji: '🛶',
  name: 'canoe'
}, {
  emoji: '⚓',
  name: 'anchor'
}, {
  emoji: '🚧',
  name: 'construction'
}, {
  emoji: '⛽',
  name: 'fuelpump'
}, {
  emoji: '🚏',
  name: 'busstop'
}, {
  emoji: '🚦',
  name: 'vertical_traffic_light'
}, {
  emoji: '🚥',
  name: 'traffic_light'
}, {
  emoji: '🏁',
  name: 'checkered_flag'
}, {
  emoji: '🚢',
  name: 'ship'
}, {
  emoji: '🎡',
  name: 'ferris_wheel'
}, {
  emoji: '🎢',
  name: 'roller_coaster'
}, {
  emoji: '🎠',
  name: 'carousel_horse'
}, {
  emoji: '🏗',
  name: 'building_construction'
}, {
  emoji: '🌁',
  name: 'foggy'
}, {
  emoji: '🗼',
  name: 'tokyo_tower'
}, {
  emoji: '🏭',
  name: 'factory'
}, {
  emoji: '⛲',
  name: 'fountain'
}, {
  emoji: '🎑',
  name: 'rice_scene'
}, {
  emoji: '⛰',
  name: 'mountain'
}, {
  emoji: '🏔',
  name: 'mountain_snow'
}, {
  emoji: '🗻',
  name: 'mount_fuji'
}, {
  emoji: '🌋',
  name: 'volcano'
}, {
  emoji: '🗾',
  name: 'japan'
}, {
  emoji: '🏕',
  name: 'camping'
}, {
  emoji: '⛺',
  name: 'tent'
}, {
  emoji: '🏞',
  name: 'national_park'
}, {
  emoji: '🛣',
  name: 'motorway'
}, {
  emoji: '🛤',
  name: 'railway_track'
}, {
  emoji: '🌅',
  name: 'sunrise'
}, {
  emoji: '🌄',
  name: 'sunrise_over_mountains'
}, {
  emoji: '🏜',
  name: 'desert'
}, {
  emoji: '🏖',
  name: 'beach_umbrella'
}, {
  emoji: '🏝',
  name: 'desert_island'
}, {
  emoji: '🌇',
  name: 'city_sunrise'
}, {
  emoji: '🌆',
  name: 'city_sunset'
}, {
  emoji: '🏙',
  name: 'cityscape'
}, {
  emoji: '🌃',
  name: 'night_with_stars'
}, {
  emoji: '🌉',
  name: 'bridge_at_night'
}, {
  emoji: '🌌',
  name: 'milky_way'
}, {
  emoji: '🌠',
  name: 'stars'
}, {
  emoji: '🎇',
  name: 'sparkler'
}, {
  emoji: '🎆',
  name: 'fireworks'
}, {
  emoji: '🌈',
  name: 'rainbow'
}, {
  emoji: '🏘',
  name: 'houses'
}, {
  emoji: '🏰',
  name: 'european_castle'
}, {
  emoji: '🏯',
  name: 'japanese_castle'
}, {
  emoji: '🏟',
  name: 'stadium'
}, {
  emoji: '🗽',
  name: 'statue_of_liberty'
}, {
  emoji: '🏠',
  name: 'house'
}, {
  emoji: '🏡',
  name: 'house_with_garden'
}, {
  emoji: '🏚',
  name: 'derelict_house'
}, {
  emoji: '🏢',
  name: 'office'
}, {
  emoji: '🏬',
  name: 'department_store'
}, {
  emoji: '🏣',
  name: 'post_office'
}, {
  emoji: '🏤',
  name: 'european_post_office'
}, {
  emoji: '🏥',
  name: 'hospital'
}, {
  emoji: '🏦',
  name: 'bank'
}, {
  emoji: '🏨',
  name: 'hotel'
}, {
  emoji: '🏪',
  name: 'convenience_store'
}, {
  emoji: '🏫',
  name: 'school'
}, {
  emoji: '🏩',
  name: 'love_hotel'
}, {
  emoji: '💒',
  name: 'wedding'
}, {
  emoji: '🏛',
  name: 'classical_building'
}, {
  emoji: '⛪',
  name: 'church'
}, {
  emoji: '🕌',
  name: 'mosque'
}, {
  emoji: '🕍',
  name: 'synagogue'
}, {
  emoji: '🕋',
  name: 'kaaba'
}, {
  emoji: '⛩',
  name: 'shinto_shrine'
}, {
  emoji: '⌚',
  name: 'watch'
}, {
  emoji: '📱',
  name: 'iphone'
}, {
  emoji: '📲',
  name: 'calling'
}, {
  emoji: '💻',
  name: 'computer'
}, {
  emoji: '⌨',
  name: 'keyboard'
}, {
  emoji: '🖥',
  name: 'desktop_computer'
}, {
  emoji: '🖨',
  name: 'printer'
}, {
  emoji: '🖱',
  name: 'computer_mouse'
}, {
  emoji: '🖲',
  name: 'trackball'
}, {
  emoji: '🕹',
  name: 'joystick'
}, {
  emoji: '🗜',
  name: 'clamp'
}, {
  emoji: '💽',
  name: 'minidisc'
}, {
  emoji: '💾',
  name: 'floppy_disk'
}, {
  emoji: '💿',
  name: 'cd'
}, {
  emoji: '📀',
  name: 'dvd'
}, {
  emoji: '📼',
  name: 'vhs'
}, {
  emoji: '📷',
  name: 'camera'
}, {
  emoji: '📸',
  name: 'camera_flash'
}, {
  emoji: '📹',
  name: 'video_camera'
}, {
  emoji: '🎥',
  name: 'movie_camera'
}, {
  emoji: '📽',
  name: 'film_projector'
}, {
  emoji: '🎞',
  name: 'film_strip'
}, {
  emoji: '📞',
  name: 'telephone_receiver'
}, {
  emoji: '☎️',
  name: 'phone'
}, {
  emoji: '📟',
  name: 'pager'
}, {
  emoji: '📠',
  name: 'fax'
}, {
  emoji: '📺',
  name: 'tv'
}, {
  emoji: '📻',
  name: 'radio'
}, {
  emoji: '🎙',
  name: 'studio_microphone'
}, {
  emoji: '🎚',
  name: 'level_slider'
}, {
  emoji: '🎛',
  name: 'control_knobs'
}, {
  emoji: '⏱',
  name: 'stopwatch'
}, {
  emoji: '⏲',
  name: 'timer_clock'
}, {
  emoji: '⏰',
  name: 'alarm_clock'
}, {
  emoji: '🕰',
  name: 'mantelpiece_clock'
}, {
  emoji: '⏳',
  name: 'hourglass_flowing_sand'
}, {
  emoji: '⌛',
  name: 'hourglass'
}, {
  emoji: '📡',
  name: 'satellite'
}, {
  emoji: '🔋',
  name: 'battery'
}, {
  emoji: '🔌',
  name: 'electric_plug'
}, {
  emoji: '💡',
  name: 'bulb'
}, {
  emoji: '🔦',
  name: 'flashlight'
}, {
  emoji: '🕯',
  name: 'candle'
}, {
  emoji: '🗑',
  name: 'wastebasket'
}, {
  emoji: '🛢',
  name: 'oil_drum'
}, {
  emoji: '💸',
  name: 'money_with_wings'
}, {
  emoji: '💵',
  name: 'dollar'
}, {
  emoji: '💴',
  name: 'yen'
}, {
  emoji: '💶',
  name: 'euro'
}, {
  emoji: '💷',
  name: 'pound'
}, {
  emoji: '💰',
  name: 'moneybag'
}, {
  emoji: '💳',
  name: 'credit_card'
}, {
  emoji: '💎',
  name: 'gem'
}, {
  emoji: '⚖',
  name: 'balance_scale'
}, {
  emoji: '🔧',
  name: 'wrench'
}, {
  emoji: '🔨',
  name: 'hammer'
}, {
  emoji: '⚒',
  name: 'hammer_and_pick'
}, {
  emoji: '🛠',
  name: 'hammer_and_wrench'
}, {
  emoji: '⛏',
  name: 'pick'
}, {
  emoji: '🔩',
  name: 'nut_and_bolt'
}, {
  emoji: '⚙',
  name: 'gear'
}, {
  emoji: '⛓',
  name: 'chains'
}, {
  emoji: '🔫',
  name: 'gun'
}, {
  emoji: '💣',
  name: 'bomb'
}, {
  emoji: '🔪',
  name: 'hocho'
}, {
  emoji: '🗡',
  name: 'dagger'
}, {
  emoji: '⚔',
  name: 'crossed_swords'
}, {
  emoji: '🛡',
  name: 'shield'
}, {
  emoji: '🚬',
  name: 'smoking'
}, {
  emoji: '☠',
  name: 'skull_and_crossbones'
}, {
  emoji: '⚰',
  name: 'coffin'
}, {
  emoji: '⚱',
  name: 'funeral_urn'
}, {
  emoji: '🏺',
  name: 'amphora'
}, {
  emoji: '🔮',
  name: 'crystal_ball'
}, {
  emoji: '📿',
  name: 'prayer_beads'
}, {
  emoji: '💈',
  name: 'barber'
}, {
  emoji: '⚗',
  name: 'alembic'
}, {
  emoji: '🔭',
  name: 'telescope'
}, {
  emoji: '🔬',
  name: 'microscope'
}, {
  emoji: '🕳',
  name: 'hole'
}, {
  emoji: '💊',
  name: 'pill'
}, {
  emoji: '💉',
  name: 'syringe'
}, {
  emoji: '🌡',
  name: 'thermometer'
}, {
  emoji: '🏷',
  name: 'label'
}, {
  emoji: '🔖',
  name: 'bookmark'
}, {
  emoji: '🚽',
  name: 'toilet'
}, {
  emoji: '🚿',
  name: 'shower'
}, {
  emoji: '🛁',
  name: 'bathtub'
}, {
  emoji: '🔑',
  name: 'key'
}, {
  emoji: '🗝',
  name: 'old_key'
}, {
  emoji: '🛋',
  name: 'couch_and_lamp'
}, {
  emoji: '🛌',
  name: 'sleeping_bed'
}, {
  emoji: '🛏',
  name: 'bed'
}, {
  emoji: '🚪',
  name: 'door'
}, {
  emoji: '🛎',
  name: 'bellhop_bell'
}, {
  emoji: '🖼',
  name: 'framed_picture'
}, {
  emoji: '🗺',
  name: 'world_map'
}, {
  emoji: '⛱',
  name: 'parasol_on_ground'
}, {
  emoji: '🗿',
  name: 'moyai'
}, {
  emoji: '🛍',
  name: 'shopping'
}, {
  emoji: '🛒',
  name: 'shopping_cart'
}, {
  emoji: '🎈',
  name: 'balloon'
}, {
  emoji: '🎏',
  name: 'flags'
}, {
  emoji: '🎀',
  name: 'ribbon'
}, {
  emoji: '🎁',
  name: 'gift'
}, {
  emoji: '🎊',
  name: 'confetti_ball'
}, {
  emoji: '🎉',
  name: 'tada'
}, {
  emoji: '🎎',
  name: 'dolls'
}, {
  emoji: '🎐',
  name: 'wind_chime'
}, {
  emoji: '🎌',
  name: 'crossed_flags'
}, {
  emoji: '🏮',
  name: 'izakaya_lantern'
}, {
  emoji: '✉️',
  name: 'email'
}, {
  emoji: '📩',
  name: 'envelope_with_arrow'
}, {
  emoji: '📨',
  name: 'incoming_envelope'
}, {
  emoji: '📧',
  name: 'e_mail'
}, {
  emoji: '💌',
  name: 'love_letter'
}, {
  emoji: '📮',
  name: 'postbox'
}, {
  emoji: '📪',
  name: 'mailbox_closed'
}, {
  emoji: '📫',
  name: 'mailbox'
}, {
  emoji: '📬',
  name: 'mailbox_with_mail'
}, {
  emoji: '📭',
  name: 'mailbox_with_no_mail'
}, {
  emoji: '📦',
  name: 'package'
}, {
  emoji: '📯',
  name: 'postal_horn'
}, {
  emoji: '📥',
  name: 'inbox_tray'
}, {
  emoji: '📤',
  name: 'outbox_tray'
}, {
  emoji: '📜',
  name: 'scroll'
}, {
  emoji: '📃',
  name: 'page_with_curl'
}, {
  emoji: '📑',
  name: 'bookmark_tabs'
}, {
  emoji: '📊',
  name: 'bar_chart'
}, {
  emoji: '📈',
  name: 'chart_with_upwards_trend'
}, {
  emoji: '📉',
  name: 'chart_with_downwards_trend'
}, {
  emoji: '📄',
  name: 'page_facing_up'
}, {
  emoji: '📅',
  name: 'date'
}, {
  emoji: '📆',
  name: 'calendar'
}, {
  emoji: '🗓',
  name: 'spiral_calendar'
}, {
  emoji: '📇',
  name: 'card_index'
}, {
  emoji: '🗃',
  name: 'card_file_box'
}, {
  emoji: '🗳',
  name: 'ballot_box'
}, {
  emoji: '🗄',
  name: 'file_cabinet'
}, {
  emoji: '📋',
  name: 'clipboard'
}, {
  emoji: '🗒',
  name: 'spiral_notepad'
}, {
  emoji: '📁',
  name: 'file_folder'
}, {
  emoji: '📂',
  name: 'open_file_folder'
}, {
  emoji: '🗂',
  name: 'card_index_dividers'
}, {
  emoji: '🗞',
  name: 'newspaper_roll'
}, {
  emoji: '📰',
  name: 'newspaper'
}, {
  emoji: '📓',
  name: 'notebook'
}, {
  emoji: '📕',
  name: 'closed_book'
}, {
  emoji: '📗',
  name: 'green_book'
}, {
  emoji: '📘',
  name: 'blue_book'
}, {
  emoji: '📙',
  name: 'orange_book'
}, {
  emoji: '📔',
  name: 'notebook_with_decorative_cover'
}, {
  emoji: '📒',
  name: 'ledger'
}, {
  emoji: '📚',
  name: 'books'
}, {
  emoji: '📖',
  name: 'open_book'
}, {
  emoji: '🔗',
  name: 'link'
}, {
  emoji: '📎',
  name: 'paperclip'
}, {
  emoji: '🖇',
  name: 'paperclips'
}, {
  emoji: '✂️',
  name: 'scissors'
}, {
  emoji: '📐',
  name: 'triangular_ruler'
}, {
  emoji: '📏',
  name: 'straight_ruler'
}, {
  emoji: '📌',
  name: 'pushpin'
}, {
  emoji: '📍',
  name: 'round_pushpin'
}, {
  emoji: '🚩',
  name: 'triangular_flag_on_post'
}, {
  emoji: '🏳',
  name: 'white_flag'
}, {
  emoji: '🏴',
  name: 'black_flag'
}, {
  emoji: '🏳️‍🌈',
  name: 'rainbow_flag'
}, {
  emoji: '🔐',
  name: 'closed_lock_with_key'
}, {
  emoji: '🔒',
  name: 'lock'
}, {
  emoji: '🔓',
  name: 'unlock'
}, {
  emoji: '🔏',
  name: 'lock_with_ink_pen'
}, {
  emoji: '🖊',
  name: 'pen'
}, {
  emoji: '🖋',
  name: 'fountain_pen'
}, {
  emoji: '✒️',
  name: 'black_nib'
}, {
  emoji: '📝',
  name: 'memo'
}, {
  emoji: '✏️',
  name: 'pencil2'
}, {
  emoji: '🖍',
  name: 'crayon'
}, {
  emoji: '🖌',
  name: 'paintbrush'
}, {
  emoji: '🔍',
  name: 'mag'
}, {
  emoji: '🔎',
  name: 'mag_right'
}, {
  emoji: '❤️',
  name: 'heart'
}, {
  emoji: '💛',
  name: 'yellow_heart'
}, {
  emoji: '💚',
  name: 'green_heart'
}, {
  emoji: '💙',
  name: 'blue_heart'
}, {
  emoji: '💜',
  name: 'purple_heart'
}, {
  emoji: '🖤',
  name: 'black_heart'
}, {
  emoji: '💔',
  name: 'broken_heart'
}, {
  emoji: '❣',
  name: 'heavy_heart_exclamation'
}, {
  emoji: '💕',
  name: 'two_hearts'
}, {
  emoji: '💞',
  name: 'revolving_hearts'
}, {
  emoji: '💓',
  name: 'heartbeat'
}, {
  emoji: '💗',
  name: 'heartpulse'
}, {
  emoji: '💖',
  name: 'sparkling_heart'
}, {
  emoji: '💘',
  name: 'cupid'
}, {
  emoji: '💝',
  name: 'gift_heart'
}, {
  emoji: '💟',
  name: 'heart_decoration'
}, {
  emoji: '☮',
  name: 'peace_symbol'
}, {
  emoji: '✝',
  name: 'latin_cross'
}, {
  emoji: '☪',
  name: 'star_and_crescent'
}, {
  emoji: '🕉',
  name: 'om'
}, {
  emoji: '☸',
  name: 'wheel_of_dharma'
}, {
  emoji: '✡',
  name: 'star_of_david'
}, {
  emoji: '🔯',
  name: 'six_pointed_star'
}, {
  emoji: '🕎',
  name: 'menorah'
}, {
  emoji: '☯',
  name: 'yin_yang'
}, {
  emoji: '☦',
  name: 'orthodox_cross'
}, {
  emoji: '🛐',
  name: 'place_of_worship'
}, {
  emoji: '⛎',
  name: 'ophiuchus'
}, {
  emoji: '♈',
  name: 'aries'
}, {
  emoji: '♉',
  name: 'taurus'
}, {
  emoji: '♊',
  name: 'gemini'
}, {
  emoji: '♋',
  name: 'cancer'
}, {
  emoji: '♌',
  name: 'leo'
}, {
  emoji: '♍',
  name: 'virgo'
}, {
  emoji: '♎',
  name: 'libra'
}, {
  emoji: '♏',
  name: 'scorpius'
}, {
  emoji: '♐',
  name: 'sagittarius'
}, {
  emoji: '♑',
  name: 'capricorn'
}, {
  emoji: '♒',
  name: 'aquarius'
}, {
  emoji: '♓',
  name: 'pisces'
}, {
  emoji: '🆔',
  name: 'id'
}, {
  emoji: '⚛',
  name: 'atom_symbol'
}, {
  emoji: '🈳',
  name: 'u7a7a'
}, {
  emoji: '🈹',
  name: 'u5272'
}, {
  emoji: '☢',
  name: 'radioactive'
}, {
  emoji: '☣',
  name: 'biohazard'
}, {
  emoji: '📴',
  name: 'mobile_phone_off'
}, {
  emoji: '📳',
  name: 'vibration_mode'
}, {
  emoji: '🈶',
  name: 'u6709'
}, {
  emoji: '🈚',
  name: 'u7121'
}, {
  emoji: '🈸',
  name: 'u7533'
}, {
  emoji: '🈺',
  name: 'u55b6'
}, {
  emoji: '🈷️',
  name: 'u6708'
}, {
  emoji: '✴️',
  name: 'eight_pointed_black_star'
}, {
  emoji: '🆚',
  name: 'vs'
}, {
  emoji: '🉑',
  name: 'accept'
}, {
  emoji: '💮',
  name: 'white_flower'
}, {
  emoji: '🉐',
  name: 'ideograph_advantage'
}, {
  emoji: '㊙️',
  name: 'secret'
}, {
  emoji: '㊗️',
  name: 'congratulations'
}, {
  emoji: '🈴',
  name: 'u5408'
}, {
  emoji: '🈵',
  name: 'u6e80'
}, {
  emoji: '🈲',
  name: 'u7981'
}, {
  emoji: '🅰️',
  name: 'a'
}, {
  emoji: '🅱️',
  name: 'b'
}, {
  emoji: '🆎',
  name: 'ab'
}, {
  emoji: '🆑',
  name: 'cl'
}, {
  emoji: '🅾️',
  name: 'o2'
}, {
  emoji: '🆘',
  name: 'sos'
}, {
  emoji: '⛔',
  name: 'no_entry'
}, {
  emoji: '📛',
  name: 'name_badge'
}, {
  emoji: '🚫',
  name: 'no_entry_sign'
}, {
  emoji: '❌',
  name: 'x'
}, {
  emoji: '⭕',
  name: 'o'
}, {
  emoji: '🛑',
  name: 'stop_sign'
}, {
  emoji: '💢',
  name: 'anger'
}, {
  emoji: '♨️',
  name: 'hotsprings'
}, {
  emoji: '🚷',
  name: 'no_pedestrians'
}, {
  emoji: '🚯',
  name: 'do_not_litter'
}, {
  emoji: '🚳',
  name: 'no_bicycles'
}, {
  emoji: '🚱',
  name: 'non_potable_water'
}, {
  emoji: '🔞',
  name: 'underage'
}, {
  emoji: '📵',
  name: 'no_mobile_phones'
}, {
  emoji: '❗',
  name: 'exclamation'
}, {
  emoji: '❕',
  name: 'grey_exclamation'
}, {
  emoji: '❓',
  name: 'question'
}, {
  emoji: '❔',
  name: 'grey_question'
}, {
  emoji: '‼️',
  name: 'bangbang'
}, {
  emoji: '⁉️',
  name: 'interrobang'
}, {
  emoji: '🔅',
  name: 'low_brightness'
}, {
  emoji: '🔆',
  name: 'high_brightness'
}, {
  emoji: '🔱',
  name: 'trident'
}, {
  emoji: '⚜',
  name: 'fleur_de_lis'
}, {
  emoji: '〽️',
  name: 'part_alternation_mark'
}, {
  emoji: '⚠️',
  name: 'warning'
}, {
  emoji: '🚸',
  name: 'children_crossing'
}, {
  emoji: '🔰',
  name: 'beginner'
}, {
  emoji: '♻️',
  name: 'recycle'
}, {
  emoji: '🈯',
  name: 'u6307'
}, {
  emoji: '💹',
  name: 'chart'
}, {
  emoji: '❇️',
  name: 'sparkle'
}, {
  emoji: '✳️',
  name: 'eight_spoked_asterisk'
}, {
  emoji: '❎',
  name: 'negative_squared_cross_mark'
}, {
  emoji: '✅',
  name: 'white_check_mark'
}, {
  emoji: '💠',
  name: 'diamond_shape_with_a_dot_inside'
}, {
  emoji: '🌀',
  name: 'cyclone'
}, {
  emoji: '➿',
  name: 'loop'
}, {
  emoji: '🌐',
  name: 'globe_with_meridians'
}, {
  emoji: 'Ⓜ️',
  name: 'm'
}, {
  emoji: '🏧',
  name: 'atm'
}, {
  emoji: '🈂️',
  name: 'sa'
}, {
  emoji: '🛂',
  name: 'passport_control'
}, {
  emoji: '🛃',
  name: 'customs'
}, {
  emoji: '🛄',
  name: 'baggage_claim'
}, {
  emoji: '🛅',
  name: 'left_luggage'
}, {
  emoji: '♿',
  name: 'wheelchair'
}, {
  emoji: '🚭',
  name: 'no_smoking'
}, {
  emoji: '🚾',
  name: 'wc'
}, {
  emoji: '🅿️',
  name: 'parking'
}, {
  emoji: '🚰',
  name: 'potable_water'
}, {
  emoji: '🚹',
  name: 'mens'
}, {
  emoji: '🚺',
  name: 'womens'
}, {
  emoji: '🚼',
  name: 'baby_symbol'
}, {
  emoji: '🚻',
  name: 'restroom'
}, {
  emoji: '🚮',
  name: 'put_litter_in_its_place'
}, {
  emoji: '🎦',
  name: 'cinema'
}, {
  emoji: '📶',
  name: 'signal_strength'
}, {
  emoji: '🈁',
  name: 'koko'
}, {
  emoji: '🆖',
  name: 'ng'
}, {
  emoji: '🆗',
  name: 'ok'
}, {
  emoji: '🆙',
  name: 'up'
}, {
  emoji: '🆒',
  name: 'cool'
}, {
  emoji: '🆕',
  name: 'new'
}, {
  emoji: '🆓',
  name: 'free'
}, {
  emoji: '0️⃣',
  name: 'zero'
}, {
  emoji: '1️⃣',
  name: 'one'
}, {
  emoji: '2️⃣',
  name: 'two'
}, {
  emoji: '3️⃣',
  name: 'three'
}, {
  emoji: '4️⃣',
  name: 'four'
}, {
  emoji: '5️⃣',
  name: 'five'
}, {
  emoji: '6️⃣',
  name: 'six'
}, {
  emoji: '7️⃣',
  name: 'seven'
}, {
  emoji: '8️⃣',
  name: 'eight'
}, {
  emoji: '9️⃣',
  name: 'nine'
}, {
  emoji: '🔟',
  name: 'keycap_ten'
}, {
  emoji: '*⃣',
  name: 'asterisk'
}, {
  emoji: '▶️',
  name: 'arrow_forward'
}, {
  emoji: '⏸',
  name: 'pause_button'
}, {
  emoji: '⏭',
  name: 'next_track_button'
}, {
  emoji: '⏹',
  name: 'stop_button'
}, {
  emoji: '⏺',
  name: 'record_button'
}, {
  emoji: '⏯',
  name: 'play_or_pause_button'
}, {
  emoji: '⏮',
  name: 'previous_track_button'
}, {
  emoji: '⏩',
  name: 'fast_forward'
}, {
  emoji: '⏪',
  name: 'rewind'
}, {
  emoji: '🔀',
  name: 'twisted_rightwards_arrows'
}, {
  emoji: '🔁',
  name: 'repeat'
}, {
  emoji: '🔂',
  name: 'repeat_one'
}, {
  emoji: '◀️',
  name: 'arrow_backward'
}, {
  emoji: '🔼',
  name: 'arrow_up_small'
}, {
  emoji: '🔽',
  name: 'arrow_down_small'
}, {
  emoji: '⏫',
  name: 'arrow_double_up'
}, {
  emoji: '⏬',
  name: 'arrow_double_down'
}, {
  emoji: '➡️',
  name: 'arrow_right'
}, {
  emoji: '⬅️',
  name: 'arrow_left'
}, {
  emoji: '⬆️',
  name: 'arrow_up'
}, {
  emoji: '⬇️',
  name: 'arrow_down'
}, {
  emoji: '↗️',
  name: 'arrow_upper_right'
}, {
  emoji: '↘️',
  name: 'arrow_lower_right'
}, {
  emoji: '↙️',
  name: 'arrow_lower_left'
}, {
  emoji: '↖️',
  name: 'arrow_upper_left'
}, {
  emoji: '↕️',
  name: 'arrow_up_down'
}, {
  emoji: '↔️',
  name: 'left_right_arrow'
}, {
  emoji: '🔄',
  name: 'arrows_counterclockwise'
}, {
  emoji: '↪️',
  name: 'arrow_right_hook'
}, {
  emoji: '↩️',
  name: 'leftwards_arrow_with_hook'
}, {
  emoji: '⤴️',
  name: 'arrow_heading_up'
}, {
  emoji: '⤵️',
  name: 'arrow_heading_down'
}, {
  emoji: '#️⃣',
  name: 'hash'
}, {
  emoji: 'ℹ️',
  name: 'information_source'
}, {
  emoji: '🔤',
  name: 'abc'
}, {
  emoji: '🔡',
  name: 'abcd'
}, {
  emoji: '🔠',
  name: 'capital_abcd'
}, {
  emoji: '🔣',
  name: 'symbols'
}, {
  emoji: '🎵',
  name: 'musical_note'
}, {
  emoji: '🎶',
  name: 'notes'
}, {
  emoji: '〰️',
  name: 'wavy_dash'
}, {
  emoji: '➰',
  name: 'curly_loop'
}, {
  emoji: '✔️',
  name: 'heavy_check_mark'
}, {
  emoji: '🔃',
  name: 'arrows_clockwise'
}, {
  emoji: '➕',
  name: 'heavy_plus_sign'
}, {
  emoji: '➖',
  name: 'heavy_minus_sign'
}, {
  emoji: '➗',
  name: 'heavy_division_sign'
}, {
  emoji: '✖️',
  name: 'heavy_multiplication_x'
}, {
  emoji: '💲',
  name: 'heavy_dollar_sign'
}, {
  emoji: '💱',
  name: 'currency_exchange'
}, {
  emoji: '©️',
  name: 'copyright'
}, {
  emoji: '®️',
  name: 'registered'
}, {
  emoji: '™️',
  name: 'tm'
}, {
  emoji: '🔚',
  name: 'end'
}, {
  emoji: '🔙',
  name: 'back'
}, {
  emoji: '🔛',
  name: 'on'
}, {
  emoji: '🔝',
  name: 'top'
}, {
  emoji: '🔜',
  name: 'soon'
}, {
  emoji: '☑️',
  name: 'ballot_box_with_check'
}, {
  emoji: '🔘',
  name: 'radio_button'
}, {
  emoji: '⚪',
  name: 'white_circle'
}, {
  emoji: '⚫',
  name: 'black_circle'
}, {
  emoji: '🔴',
  name: 'red_circle'
}, {
  emoji: '🔵',
  name: 'large_blue_circle'
}, {
  emoji: '🔸',
  name: 'small_orange_diamond'
}, {
  emoji: '🔹',
  name: 'small_blue_diamond'
}, {
  emoji: '🔶',
  name: 'large_orange_diamond'
}, {
  emoji: '🔷',
  name: 'large_blue_diamond'
}, {
  emoji: '🔺',
  name: 'small_red_triangle'
}, {
  emoji: '▪️',
  name: 'black_small_square'
}, {
  emoji: '▫️',
  name: 'white_small_square'
}, {
  emoji: '⬛',
  name: 'black_large_square'
}, {
  emoji: '⬜',
  name: 'white_large_square'
}, {
  emoji: '🔻',
  name: 'small_red_triangle_down'
}, {
  emoji: '◼️',
  name: 'black_medium_square'
}, {
  emoji: '◻️',
  name: 'white_medium_square'
}, {
  emoji: '◾',
  name: 'black_medium_small_square'
}, {
  emoji: '◽',
  name: 'white_medium_small_square'
}, {
  emoji: '🔲',
  name: 'black_square_button'
}, {
  emoji: '🔳',
  name: 'white_square_button'
}, {
  emoji: '🔈',
  name: 'speaker'
}, {
  emoji: '🔉',
  name: 'sound'
}, {
  emoji: '🔊',
  name: 'loud_sound'
}, {
  emoji: '🔇',
  name: 'mute'
}, {
  emoji: '📣',
  name: 'mega'
}, {
  emoji: '📢',
  name: 'loudspeaker'
}, {
  emoji: '🔔',
  name: 'bell'
}, {
  emoji: '🔕',
  name: 'no_bell'
}, {
  emoji: '🃏',
  name: 'black_joker'
}, {
  emoji: '🀄',
  name: 'mahjong'
}, {
  emoji: '♠️',
  name: 'spades'
}, {
  emoji: '♣️',
  name: 'clubs'
}, {
  emoji: '♥️',
  name: 'hearts'
}, {
  emoji: '♦️',
  name: 'diamonds'
}, {
  emoji: '🎴',
  name: 'flower_playing_cards'
}, {
  emoji: '💭',
  name: 'thought_balloon'
}, {
  emoji: '🗯',
  name: 'right_anger_bubble'
}, {
  emoji: '💬',
  name: 'speech_balloon'
}, {
  emoji: '🗨',
  name: 'left_speech_bubble'
}, {
  emoji: '🕐',
  name: 'clock1'
}, {
  emoji: '🕑',
  name: 'clock2'
}, {
  emoji: '🕒',
  name: 'clock3'
}, {
  emoji: '🕓',
  name: 'clock4'
}, {
  emoji: '🕔',
  name: 'clock5'
}, {
  emoji: '🕕',
  name: 'clock6'
}, {
  emoji: '🕖',
  name: 'clock7'
}, {
  emoji: '🕗',
  name: 'clock8'
}, {
  emoji: '🕘',
  name: 'clock9'
}, {
  emoji: '🕙',
  name: 'clock10'
}, {
  emoji: '🕚',
  name: 'clock11'
}, {
  emoji: '🕛',
  name: 'clock12'
}, {
  emoji: '🕜',
  name: 'clock130'
}, {
  emoji: '🕝',
  name: 'clock230'
}, {
  emoji: '🕞',
  name: 'clock330'
}, {
  emoji: '🕟',
  name: 'clock430'
}, {
  emoji: '🕠',
  name: 'clock530'
}, {
  emoji: '🕡',
  name: 'clock630'
}, {
  emoji: '🕢',
  name: 'clock730'
}, {
  emoji: '🕣',
  name: 'clock830'
}, {
  emoji: '🕤',
  name: 'clock930'
}, {
  emoji: '🕥',
  name: 'clock1030'
}, {
  emoji: '🕦',
  name: 'clock1130'
}, {
  emoji: '🕧',
  name: 'clock1230'
}, {
  emoji: '🇦🇫',
  name: 'afghanistan'
}, {
  emoji: '🇦🇽',
  name: 'aland_islands'
}, {
  emoji: '🇦🇱',
  name: 'albania'
}, {
  emoji: '🇩🇿',
  name: 'algeria'
}, {
  emoji: '🇦🇸',
  name: 'american_samoa'
}, {
  emoji: '🇦🇩',
  name: 'andorra'
}, {
  emoji: '🇦🇴',
  name: 'angola'
}, {
  emoji: '🇦🇮',
  name: 'anguilla'
}, {
  emoji: '🇦🇶',
  name: 'antarctica'
}, {
  emoji: '🇦🇬',
  name: 'antigua_barbuda'
}, {
  emoji: '🇦🇷',
  name: 'argentina'
}, {
  emoji: '🇦🇲',
  name: 'armenia'
}, {
  emoji: '🇦🇼',
  name: 'aruba'
}, {
  emoji: '🇦🇺',
  name: 'australia'
}, {
  emoji: '🇦🇹',
  name: 'austria'
}, {
  emoji: '🇦🇿',
  name: 'azerbaijan'
}, {
  emoji: '🇧🇸',
  name: 'bahamas'
}, {
  emoji: '🇧🇭',
  name: 'bahrain'
}, {
  emoji: '🇧🇩',
  name: 'bangladesh'
}, {
  emoji: '🇧🇧',
  name: 'barbados'
}, {
  emoji: '🇧🇾',
  name: 'belarus'
}, {
  emoji: '🇧🇪',
  name: 'belgium'
}, {
  emoji: '🇧🇿',
  name: 'belize'
}, {
  emoji: '🇧🇯',
  name: 'benin'
}, {
  emoji: '🇧🇲',
  name: 'bermuda'
}, {
  emoji: '🇧🇹',
  name: 'bhutan'
}, {
  emoji: '🇧🇴',
  name: 'bolivia'
}, {
  emoji: '🇧🇶',
  name: 'caribbean_netherlands'
}, {
  emoji: '🇧🇦',
  name: 'bosnia_herzegovina'
}, {
  emoji: '🇧🇼',
  name: 'botswana'
}, {
  emoji: '🇧🇷',
  name: 'brazil'
}, {
  emoji: '🇮🇴',
  name: 'british_indian_ocean_territory'
}, {
  emoji: '🇻🇬',
  name: 'british_virgin_islands'
}, {
  emoji: '🇧🇳',
  name: 'brunei'
}, {
  emoji: '🇧🇬',
  name: 'bulgaria'
}, {
  emoji: '🇧🇫',
  name: 'burkina_faso'
}, {
  emoji: '🇧🇮',
  name: 'burundi'
}, {
  emoji: '🇨🇻',
  name: 'cape_verde'
}, {
  emoji: '🇰🇭',
  name: 'cambodia'
}, {
  emoji: '🇨🇲',
  name: 'cameroon'
}, {
  emoji: '🇨🇦',
  name: 'canada'
}, {
  emoji: '🇮🇨',
  name: 'canary_islands'
}, {
  emoji: '🇰🇾',
  name: 'cayman_islands'
}, {
  emoji: '🇨🇫',
  name: 'central_african_republic'
}, {
  emoji: '🇹🇩',
  name: 'chad'
}, {
  emoji: '🇨🇱',
  name: 'chile'
}, {
  emoji: '🇨🇳',
  name: 'cn'
}, {
  emoji: '🇨🇽',
  name: 'christmas_island'
}, {
  emoji: '🇨🇨',
  name: 'cocos_islands'
}, {
  emoji: '🇨🇴',
  name: 'colombia'
}, {
  emoji: '🇰🇲',
  name: 'comoros'
}, {
  emoji: '🇨🇬',
  name: 'congo_brazzaville'
}, {
  emoji: '🇨🇩',
  name: 'congo_kinshasa'
}, {
  emoji: '🇨🇰',
  name: 'cook_islands'
}, {
  emoji: '🇨🇷',
  name: 'costa_rica'
}, {
  emoji: '🇭🇷',
  name: 'croatia'
}, {
  emoji: '🇨🇺',
  name: 'cuba'
}, {
  emoji: '🇨🇼',
  name: 'curacao'
}, {
  emoji: '🇨🇾',
  name: 'cyprus'
}, {
  emoji: '🇨🇿',
  name: 'czech_republic'
}, {
  emoji: '🇩🇰',
  name: 'denmark'
}, {
  emoji: '🇩🇯',
  name: 'djibouti'
}, {
  emoji: '🇩🇲',
  name: 'dominica'
}, {
  emoji: '🇩🇴',
  name: 'dominican_republic'
}, {
  emoji: '🇪🇨',
  name: 'ecuador'
}, {
  emoji: '🇪🇬',
  name: 'egypt'
}, {
  emoji: '🇸🇻',
  name: 'el_salvador'
}, {
  emoji: '🇬🇶',
  name: 'equatorial_guinea'
}, {
  emoji: '🇪🇷',
  name: 'eritrea'
}, {
  emoji: '🇪🇪',
  name: 'estonia'
}, {
  emoji: '🇪🇹',
  name: 'ethiopia'
}, {
  emoji: '🇪🇺',
  name: 'eu'
}, {
  emoji: '🇫🇰',
  name: 'falkland_islands'
}, {
  emoji: '🇫🇴',
  name: 'faroe_islands'
}, {
  emoji: '🇫🇯',
  name: 'fiji'
}, {
  emoji: '🇫🇮',
  name: 'finland'
}, {
  emoji: '🇫🇷',
  name: 'fr'
}, {
  emoji: '🇬🇫',
  name: 'french_guiana'
}, {
  emoji: '🇵🇫',
  name: 'french_polynesia'
}, {
  emoji: '🇹🇫',
  name: 'french_southern_territories'
}, {
  emoji: '🇬🇦',
  name: 'gabon'
}, {
  emoji: '🇬🇲',
  name: 'gambia'
}, {
  emoji: '🇬🇪',
  name: 'georgia'
}, {
  emoji: '🇩🇪',
  name: 'de'
}, {
  emoji: '🇬🇭',
  name: 'ghana'
}, {
  emoji: '🇬🇮',
  name: 'gibraltar'
}, {
  emoji: '🇬🇷',
  name: 'greece'
}, {
  emoji: '🇬🇱',
  name: 'greenland'
}, {
  emoji: '🇬🇩',
  name: 'grenada'
}, {
  emoji: '🇬🇵',
  name: 'guadeloupe'
}, {
  emoji: '🇬🇺',
  name: 'guam'
}, {
  emoji: '🇬🇹',
  name: 'guatemala'
}, {
  emoji: '🇬🇬',
  name: 'guernsey'
}, {
  emoji: '🇬🇳',
  name: 'guinea'
}, {
  emoji: '🇬🇼',
  name: 'guinea_bissau'
}, {
  emoji: '🇬🇾',
  name: 'guyana'
}, {
  emoji: '🇭🇹',
  name: 'haiti'
}, {
  emoji: '🇭🇳',
  name: 'honduras'
}, {
  emoji: '🇭🇰',
  name: 'hong_kong'
}, {
  emoji: '🇭🇺',
  name: 'hungary'
}, {
  emoji: '🇮🇸',
  name: 'iceland'
}, {
  emoji: '🇮🇳',
  name: 'india'
}, {
  emoji: '🇮🇩',
  name: 'indonesia'
}, {
  emoji: '🇮🇷',
  name: 'iran'
}, {
  emoji: '🇮🇶',
  name: 'iraq'
}, {
  emoji: '🇮🇪',
  name: 'ireland'
}, {
  emoji: '🇮🇲',
  name: 'isle_of_man'
}, {
  emoji: '🇮🇱',
  name: 'israel'
}, {
  emoji: '🇮🇹',
  name: 'it'
}, {
  emoji: '🇨🇮',
  name: 'cote_divoire'
}, {
  emoji: '🇯🇲',
  name: 'jamaica'
}, {
  emoji: '🇯🇵',
  name: 'jp'
}, {
  emoji: '🇯🇪',
  name: 'jersey'
}, {
  emoji: '🇯🇴',
  name: 'jordan'
}, {
  emoji: '🇰🇿',
  name: 'kazakhstan'
}, {
  emoji: '🇰🇪',
  name: 'kenya'
}, {
  emoji: '🇰🇮',
  name: 'kiribati'
}, {
  emoji: '🇽🇰',
  name: 'kosovo'
}, {
  emoji: '🇰🇼',
  name: 'kuwait'
}, {
  emoji: '🇰🇬',
  name: 'kyrgyzstan'
}, {
  emoji: '🇱🇦',
  name: 'laos'
}, {
  emoji: '🇱🇻',
  name: 'latvia'
}, {
  emoji: '🇱🇧',
  name: 'lebanon'
}, {
  emoji: '🇱🇸',
  name: 'lesotho'
}, {
  emoji: '🇱🇷',
  name: 'liberia'
}, {
  emoji: '🇱🇾',
  name: 'libya'
}, {
  emoji: '🇱🇮',
  name: 'liechtenstein'
}, {
  emoji: '🇱🇹',
  name: 'lithuania'
}, {
  emoji: '🇱🇺',
  name: 'luxembourg'
}, {
  emoji: '🇲🇴',
  name: 'macau'
}, {
  emoji: '🇲🇰',
  name: 'macedonia'
}, {
  emoji: '🇲🇬',
  name: 'madagascar'
}, {
  emoji: '🇲🇼',
  name: 'malawi'
}, {
  emoji: '🇲🇾',
  name: 'malaysia'
}, {
  emoji: '🇲🇻',
  name: 'maldives'
}, {
  emoji: '🇲🇱',
  name: 'mali'
}, {
  emoji: '🇲🇹',
  name: 'malta'
}, {
  emoji: '🇲🇭',
  name: 'marshall_islands'
}, {
  emoji: '🇲🇶',
  name: 'martinique'
}, {
  emoji: '🇲🇷',
  name: 'mauritania'
}, {
  emoji: '🇲🇺',
  name: 'mauritius'
}, {
  emoji: '🇾🇹',
  name: 'mayotte'
}, {
  emoji: '🇲🇽',
  name: 'mexico'
}, {
  emoji: '🇫🇲',
  name: 'micronesia'
}, {
  emoji: '🇲🇩',
  name: 'moldova'
}, {
  emoji: '🇲🇨',
  name: 'monaco'
}, {
  emoji: '🇲🇳',
  name: 'mongolia'
}, {
  emoji: '🇲🇪',
  name: 'montenegro'
}, {
  emoji: '🇲🇸',
  name: 'montserrat'
}, {
  emoji: '🇲🇦',
  name: 'morocco'
}, {
  emoji: '🇲🇿',
  name: 'mozambique'
}, {
  emoji: '🇲🇲',
  name: 'myanmar'
}, {
  emoji: '🇳🇦',
  name: 'namibia'
}, {
  emoji: '🇳🇷',
  name: 'nauru'
}, {
  emoji: '🇳🇵',
  name: 'nepal'
}, {
  emoji: '🇳🇱',
  name: 'netherlands'
}, {
  emoji: '🇳🇨',
  name: 'new_caledonia'
}, {
  emoji: '🇳🇿',
  name: 'new_zealand'
}, {
  emoji: '🇳🇮',
  name: 'nicaragua'
}, {
  emoji: '🇳🇪',
  name: 'niger'
}, {
  emoji: '🇳🇬',
  name: 'nigeria'
}, {
  emoji: '🇳🇺',
  name: 'niue'
}, {
  emoji: '🇳🇫',
  name: 'norfolk_island'
}, {
  emoji: '🇲🇵',
  name: 'northern_mariana_islands'
}, {
  emoji: '🇰🇵',
  name: 'north_korea'
}, {
  emoji: '🇳🇴',
  name: 'norway'
}, {
  emoji: '🇴🇲',
  name: 'oman'
}, {
  emoji: '🇵🇰',
  name: 'pakistan'
}, {
  emoji: '🇵🇼',
  name: 'palau'
}, {
  emoji: '🇵🇸',
  name: 'palestinian_territories'
}, {
  emoji: '🇵🇦',
  name: 'panama'
}, {
  emoji: '🇵🇬',
  name: 'papua_new_guinea'
}, {
  emoji: '🇵🇾',
  name: 'paraguay'
}, {
  emoji: '🇵🇪',
  name: 'peru'
}, {
  emoji: '🇵🇭',
  name: 'philippines'
}, {
  emoji: '🇵🇳',
  name: 'pitcairn_islands'
}, {
  emoji: '🇵🇱',
  name: 'poland'
}, {
  emoji: '🇵🇹',
  name: 'portugal'
}, {
  emoji: '🇵🇷',
  name: 'puerto_rico'
}, {
  emoji: '🇶🇦',
  name: 'qatar'
}, {
  emoji: '🇷🇪',
  name: 'reunion'
}, {
  emoji: '🇷🇴',
  name: 'romania'
}, {
  emoji: '🇷🇺',
  name: 'ru'
}, {
  emoji: '🇷🇼',
  name: 'rwanda'
}, {
  emoji: '🇧🇱',
  name: 'st_barthelemy'
}, {
  emoji: '🇸🇭',
  name: 'st_helena'
}, {
  emoji: '🇰🇳',
  name: 'st_kitts_nevis'
}, {
  emoji: '🇱🇨',
  name: 'st_lucia'
}, {
  emoji: '🇵🇲',
  name: 'st_pierre_miquelon'
}, {
  emoji: '🇻🇨',
  name: 'st_vincent_grenadines'
}, {
  emoji: '🇼🇸',
  name: 'samoa'
}, {
  emoji: '🇸🇲',
  name: 'san_marino'
}, {
  emoji: '🇸🇹',
  name: 'sao_tome_principe'
}, {
  emoji: '🇸🇦',
  name: 'saudi_arabia'
}, {
  emoji: '🇸🇳',
  name: 'senegal'
}, {
  emoji: '🇷🇸',
  name: 'serbia'
}, {
  emoji: '🇸🇨',
  name: 'seychelles'
}, {
  emoji: '🇸🇱',
  name: 'sierra_leone'
}, {
  emoji: '🇸🇬',
  name: 'singapore'
}, {
  emoji: '🇸🇽',
  name: 'sint_maarten'
}, {
  emoji: '🇸🇰',
  name: 'slovakia'
}, {
  emoji: '🇸🇮',
  name: 'slovenia'
}, {
  emoji: '🇸🇧',
  name: 'solomon_islands'
}, {
  emoji: '🇸🇴',
  name: 'somalia'
}, {
  emoji: '🇿🇦',
  name: 'south_africa'
}, {
  emoji: '🇬🇸',
  name: 'south_georgia_south_sandwich_islands'
}, {
  emoji: '🇰🇷',
  name: 'kr'
}, {
  emoji: '🇸🇸',
  name: 'south_sudan'
}, {
  emoji: '🇪🇸',
  name: 'es'
}, {
  emoji: '🇱🇰',
  name: 'sri_lanka'
}, {
  emoji: '🇸🇩',
  name: 'sudan'
}, {
  emoji: '🇸🇷',
  name: 'suriname'
}, {
  emoji: '🇸🇿',
  name: 'swaziland'
}, {
  emoji: '🇸🇪',
  name: 'sweden'
}, {
  emoji: '🇨🇭',
  name: 'switzerland'
}, {
  emoji: '🇸🇾',
  name: 'syria'
}, {
  emoji: '🇹🇼',
  name: 'taiwan'
}, {
  emoji: '🇹🇯',
  name: 'tajikistan'
}, {
  emoji: '🇹🇿',
  name: 'tanzania'
}, {
  emoji: '🇹🇭',
  name: 'thailand'
}, {
  emoji: '🇹🇱',
  name: 'timor_leste'
}, {
  emoji: '🇹🇬',
  name: 'togo'
}, {
  emoji: '🇹🇰',
  name: 'tokelau'
}, {
  emoji: '🇹🇴',
  name: 'tonga'
}, {
  emoji: '🇹🇹',
  name: 'trinidad_tobago'
}, {
  emoji: '🇹🇳',
  name: 'tunisia'
}, {
  emoji: '🇹🇷',
  name: 'tr'
}, {
  emoji: '🇹🇲',
  name: 'turkmenistan'
}, {
  emoji: '🇹🇨',
  name: 'turks_caicos_islands'
}, {
  emoji: '🇹🇻',
  name: 'tuvalu'
}, {
  emoji: '🇺🇬',
  name: 'uganda'
}, {
  emoji: '🇺🇦',
  name: 'ukraine'
}, {
  emoji: '🇦🇪',
  name: 'united_arab_emirates'
}, {
  emoji: '🇬🇧',
  name: 'uk'
}, {
  emoji: '🇺🇸',
  name: 'us'
}, {
  emoji: '🇻🇮',
  name: 'us_virgin_islands'
}, {
  emoji: '🇺🇾',
  name: 'uruguay'
}, {
  emoji: '🇺🇿',
  name: 'uzbekistan'
}, {
  emoji: '🇻🇺',
  name: 'vanuatu'
}, {
  emoji: '🇻🇦',
  name: 'vatican_city'
}, {
  emoji: '🇻🇪',
  name: 'venezuela'
}, {
  emoji: '🇻🇳',
  name: 'vietnam'
}, {
  emoji: '🇼🇫',
  name: 'wallis_futuna'
}, {
  emoji: '🇪🇭',
  name: 'western_sahara'
}, {
  emoji: '🇾🇪',
  name: 'yemen'
}, {
  emoji: '🇿🇲',
  name: 'zambia'
}, {
  emoji: '🇿🇼',
  name: 'zimbabwe'
}];
let moon = [['💥', '⭐', '🌟', '◼️'], ['🌕', '🌔', '🌓', '🌒'], ['🌑', '🌘', '🌗', '🌖']];
let hearts = [['💜', '💛', '💚', '💙', '🖤', '💔'], ['❤', '♥', '❣', '😻', '👩‍❤️‍👩', '👨‍❤️‍👨'], ['💗', '💖', '💕', '💑', '💓', '💞', '💟']];
exports.default = name => {
  let all = false;
  switch (name) {
    case 'all':
      all = true;
      break;
    case 'hearts':
      return hearts;
      break;
    case 'moon':
      return moon;
      break;
    default:
      for (let key in emojiMap) {
        // console.log('~~~~~~~~>>>~~~~~~~',emojiMap[key], emojiMap[key]['name'])
        if (name === emojiMap[key]['name']) {
          return emojiMap[key]['emoji'];
        }
      }
      break;
  }
  if (all) {
    return emojiMap;
  }
};
emojiMap.forEach(({emoji, name}) => {
  console[name] = console.log.bind(console, `${emoji} `);
});

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5gA8y"}]},["2aPCq","4Tr6X"], "4Tr6X", "parcelRequirea8a2")

//# sourceMappingURL=page-external.a83f7dd3.js.map
