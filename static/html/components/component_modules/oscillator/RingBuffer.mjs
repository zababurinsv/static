// Copyright 2010 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = typeof Module !== 'undefined' ? Module : {};

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

var arguments_ = [];
var thisProgram = './this.program';
var quit_ = function(status, toThrow) {
  throw toThrow;
};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_HAS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === 'object';
ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
// A web environment like Electron.js can have Node enabled, so we must
// distinguish between Node-enabled environments and Node environments per se.
// This will allow the former to do things like mount NODEFS.
// Extended check using process.versions fixes issue #8816.
// (Also makes redundant the original check that 'require' is a function.)
ENVIRONMENT_HAS_NODE = typeof process === 'object' && typeof process.versions === 'object' && typeof process.versions.node === 'string';
ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;




// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var read_,
    readAsync,
    readBinary,
    setWindowTitle;

if (ENVIRONMENT_IS_NODE) {
  scriptDirectory = __dirname + '/';

  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  var nodeFS;
  var nodePath;

  read_ = function shell_read(filename, binary) {
    var ret;
    ret = tryParseAsDataURI(filename);
    if (!ret) {
      if (!nodeFS) nodeFS = require('fs');
      if (!nodePath) nodePath = require('path');
      filename = nodePath['normalize'](filename);
      ret = nodeFS['readFileSync'](filename);
    }
    return binary ? ret : ret.toString();
  };

  readBinary = function readBinary(filename) {
    var ret = read_(filename, true);
    if (!ret.buffer) {
      ret = new Uint8Array(ret);
    }
    assert(ret.buffer);
    return ret;
  };

  if (process['argv'].length > 1) {
    thisProgram = process['argv'][1].replace(/\\/g, '/');
  }

  arguments_ = process['argv'].slice(2);

  if (typeof module !== 'undefined') {
    module['exports'] = Module;
  }

  process['on']('uncaughtException', function(ex) {
    // suppress ExitStatus exceptions from showing an error
    if (!(ex instanceof ExitStatus)) {
      throw ex;
    }
  });

  process['on']('unhandledRejection', abort);

  quit_ = function(status) {
    process['exit'](status);
  };

  Module['inspect'] = function () { return '[Emscripten Module object]'; };
} else
if (ENVIRONMENT_IS_SHELL) {


  if (typeof read != 'undefined') {
    read_ = function shell_read(f) {
      var data = tryParseAsDataURI(f);
      if (data) {
        return intArrayToString(data);
      }
      return read(f);
    };
  }

  readBinary = function readBinary(f) {
    var data;
    data = tryParseAsDataURI(f);
    if (data) {
      return data;
    }
    if (typeof readbuffer === 'function') {
      return new Uint8Array(readbuffer(f));
    }
    data = read(f, 'binary');
    assert(typeof data === 'object');
    return data;
  };

  if (typeof scriptArgs != 'undefined') {
    arguments_ = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    arguments_ = arguments;
  }

  if (typeof quit === 'function') {
    quit_ = function(status) {
      quit(status);
    };
  }

  if (typeof print !== 'undefined') {
    // Prefer to use print/printErr where they exist, as they usually work better.
    if (typeof console === 'undefined') console = {};
    console.log = print;
    console.warn = console.error = typeof printErr !== 'undefined' ? printErr : print;
  }
} else
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  if (ENVIRONMENT_IS_WORKER) { // Check worker, not web, since window could be polyfilled
    scriptDirectory = self.location.href;
  } else if (document.currentScript) { // web
    scriptDirectory = document.currentScript.src;
  }
  // blob urls look like blob:http://site.com/etc/etc and we cannot infer anything from them.
  // otherwise, slice off the final part of the url to find the script directory.
  // if scriptDirectory does not contain a slash, lastIndexOf will return -1,
  // and scriptDirectory will correctly be replaced with an empty string.
  if (scriptDirectory.indexOf('blob:') !== 0) {
    scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf('/')+1);
  } else {
    scriptDirectory = '';
  }


  read_ = function shell_read(url) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.send(null);
      return xhr.responseText;
    } catch (err) {
      var data = tryParseAsDataURI(url);
      if (data) {
        return intArrayToString(data);
      }
      throw err;
    }
  };

  if (ENVIRONMENT_IS_WORKER) {
    readBinary = function readBinary(url) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.responseType = 'arraybuffer';
        xhr.send(null);
        return new Uint8Array(xhr.response);
      } catch (err) {
        var data = tryParseAsDataURI(url);
        if (data) {
          return data;
        }
        throw err;
      }
    };
  }

  readAsync = function readAsync(url, onload, onerror) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function xhr_onload() {
      if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
        onload(xhr.response);
        return;
      }
      var data = tryParseAsDataURI(url);
      if (data) {
        onload(data.buffer);
        return;
      }
      onerror();
    };
    xhr.onerror = onerror;
    xhr.send(null);
  };

  setWindowTitle = function(title) { document.title = title };
} else
{
}

// Set up the out() and err() hooks, which are how we can print to stdout or
// stderr, respectively.
var out = Module['print'] || console.log.bind(console);
var err = Module['printErr'] || console.warn.bind(console);

// Merge back in the overrides
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
// Free the object hierarchy contained in the overrides, this lets the GC
// reclaim data used e.g. in memoryInitializerRequest, which is a large typed array.
moduleOverrides = null;

// Emit code to handle expected values on the Module object. This applies Module.x
// to the proper local x. This has two benefits: first, we only emit it if it is
// expected to arrive, and second, by using a local everywhere else that can be
// minified.
if (Module['arguments']) arguments_ = Module['arguments'];
if (Module['thisProgram']) thisProgram = Module['thisProgram'];
if (Module['quit']) quit_ = Module['quit'];

// perform assertions in shell.js after we set up out() and err(), as otherwise if an assertion fails it cannot print the message

// TODO remove when SDL2 is fixed (also see above)



// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// {{PREAMBLE_ADDITIONS}}

var STACK_ALIGN = 16;


function dynamicAlloc(size) {
  var ret = HEAP32[DYNAMICTOP_PTR>>2];
  var end = (ret + size + 15) & -16;
  if (end > _emscripten_get_heap_size()) {
    abort();
  }
  HEAP32[DYNAMICTOP_PTR>>2] = end;
  return ret;
}

function alignMemory(size, factor) {
  if (!factor) factor = STACK_ALIGN; // stack alignment (16-byte) by default
  return Math.ceil(size / factor) * factor;
}

function getNativeTypeSize(type) {
  switch (type) {
    case 'i1': case 'i8': return 1;
    case 'i16': return 2;
    case 'i32': return 4;
    case 'i64': return 8;
    case 'float': return 4;
    case 'double': return 8;
    default: {
      if (type[type.length-1] === '*') {
        return 4; // A pointer
      } else if (type[0] === 'i') {
        var bits = parseInt(type.substr(1));
        assert(bits % 8 === 0, 'getNativeTypeSize invalid bits ' + bits + ', type ' + type);
        return bits / 8;
      } else {
        return 0;
      }
    }
  }
}

function warnOnce(text) {
  if (!warnOnce.shown) warnOnce.shown = {};
  if (!warnOnce.shown[text]) {
    warnOnce.shown[text] = 1;
    err(text);
  }
}

var asm2wasmImports = { // special asm2wasm imports
    "f64-rem": function(x, y) {
        return x % y;
    },
    "debugger": function() {
    }
};




// Wraps a JS function as a wasm function with a given signature.
// In the future, we may get a WebAssembly.Function constructor. Until then,
// we create a wasm module that takes the JS function as an import with a given
// signature, and re-exports that as a wasm function.
function convertJsFunctionToWasm(func, sig) {

  // The module is static, with the exception of the type section, which is
  // generated based on the signature passed in.
  var typeSection = [
    0x01, // id: section,
    0x00, // length: 0 (placeholder)
    0x01, // count: 1
    0x60, // form: func
  ];
  var sigRet = sig.slice(0, 1);
  var sigParam = sig.slice(1);
  var typeCodes = {
    'i': 0x7f, // i32
    'j': 0x7e, // i64
    'f': 0x7d, // f32
    'd': 0x7c, // f64
  };

  // Parameters, length + signatures
  typeSection.push(sigParam.length);
  for (var i = 0; i < sigParam.length; ++i) {
    typeSection.push(typeCodes[sigParam[i]]);
  }

  // Return values, length + signatures
  // With no multi-return in MVP, either 0 (void) or 1 (anything else)
  if (sigRet == 'v') {
    typeSection.push(0x00);
  } else {
    typeSection = typeSection.concat([0x01, typeCodes[sigRet]]);
  }

  // Write the overall length of the type section back into the section header
  // (excepting the 2 bytes for the section id and length)
  typeSection[1] = typeSection.length - 2;

  // Rest of the module is static
  var bytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
    0x01, 0x00, 0x00, 0x00, // version: 1
  ].concat(typeSection, [
    0x02, 0x07, // import section
      // (import "e" "f" (func 0 (type 0)))
      0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
    0x07, 0x05, // export section
      // (export "f" (func 0 (type 0)))
      0x01, 0x01, 0x66, 0x00, 0x00,
  ]));

   // We can compile this wasm module synchronously because it is very small.
  // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
  var module = new WebAssembly.Module(bytes);
  var instance = new WebAssembly.Instance(module, {
    e: {
      f: func
    }
  });
  var wrappedFunc = instance.exports.f;
  return wrappedFunc;
}

// Add a wasm function to the table.
function addFunctionWasm(func, sig) {
  var table = wasmTable;
  var ret = table.length;

  // Grow the table
  try {
    table.grow(1);
  } catch (err) {
    if (!err instanceof RangeError) {
      throw err;
    }
    throw 'Unable to grow wasm table. Use a higher value for RESERVED_FUNCTION_POINTERS or set ALLOW_TABLE_GROWTH.';
  }

  // Insert new element
  try {
    // Attempting to call this with JS function will cause of table.set() to fail
    table.set(ret, func);
  } catch (err) {
    if (!err instanceof TypeError) {
      throw err;
    }
    assert(typeof sig !== 'undefined', 'Missing signature argument to addFunction');
    var wrapped = convertJsFunctionToWasm(func, sig);
    table.set(ret, wrapped);
  }

  return ret;
}

function removeFunctionWasm(index) {
  // TODO(sbc): Look into implementing this to allow re-using of table slots
}

// 'sig' parameter is required for the llvm backend but only when func is not
// already a WebAssembly function.
function addFunction(func, sig) {

  return addFunctionWasm(func, sig);
}

function removeFunction(index) {
  removeFunctionWasm(index);
}

var funcWrappers = {};

function getFuncWrapper(func, sig) {
  if (!func) return; // on null pointer, return undefined
  assert(sig);
  if (!funcWrappers[sig]) {
    funcWrappers[sig] = {};
  }
  var sigCache = funcWrappers[sig];
  if (!sigCache[func]) {
    // optimize away arguments usage in common cases
    if (sig.length === 1) {
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func);
      };
    } else if (sig.length === 2) {
      sigCache[func] = function dynCall_wrapper(arg) {
        return dynCall(sig, func, [arg]);
      };
    } else {
      // general case
      sigCache[func] = function dynCall_wrapper() {
        return dynCall(sig, func, Array.prototype.slice.call(arguments));
      };
    }
  }
  return sigCache[func];
}


function makeBigInt(low, high, unsigned) {
  return unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0));
}

function dynCall(sig, ptr, args) {
  if (args && args.length) {
    return Module['dynCall_' + sig].apply(null, [ptr].concat(args));
  } else {
    return Module['dynCall_' + sig].call(null, ptr);
  }
}

var tempRet0 = 0;

var setTempRet0 = function(value) {
  tempRet0 = value;
};

var getTempRet0 = function() {
  return tempRet0;
};


var Runtime = {
};

// The address globals begin at. Very low in memory, for code size and optimization opportunities.
// Above 0 is static memory, starting with globals.
// Then the stack.
// Then 'dynamic' memory for sbrk.
var GLOBAL_BASE = 1024;




// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html


var wasmBinary;if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
var noExitRuntime;if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];


if (typeof WebAssembly !== 'object') {
  err('no native wasm support detected');
}


// In MINIMAL_RUNTIME, setValue() and getValue() are only available when building with safe heap enabled, for heap safety checking.
// In traditional runtime, setValue() and getValue() are always available (although their use is highly discouraged due to perf penalties)

/** @type {function(number, number, string, boolean=)} */
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[((ptr)>>0)]=value; break;
      case 'i8': HEAP8[((ptr)>>0)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}

/** @type {function(number, string, boolean=)} */
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[((ptr)>>0)];
      case 'i8': return HEAP8[((ptr)>>0)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for getValue: ' + type);
    }
  return null;
}





// Wasm globals

var wasmMemory;

// In fastcomp asm.js, we don't need a wasm Table at all.
// In the wasm backend, we polyfill the WebAssembly object,
// so this creates a (non-native-wasm) table for us.
var wasmTable = new WebAssembly.Table({
  'initial': 357,
  'maximum': 357 + 0,
  'element': 'anyfunc'
});


//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS = 0;

/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  var func = Module['_' + ident]; // closure exported function
  assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
  return func;
}

// C calling interface.
function ccall(ident, returnType, argTypes, args, opts) {
  // For fast lookup of conversion functions
  var toC = {
    'string': function(str) {
      var ret = 0;
      if (str !== null && str !== undefined && str !== 0) { // null string
        // at most 4 bytes per UTF-8 code point, +1 for the trailing '\0'
        var len = (str.length << 2) + 1;
        ret = stackAlloc(len);
        stringToUTF8(str, ret, len);
      }
      return ret;
    },
    'array': function(arr) {
      var ret = stackAlloc(arr.length);
      writeArrayToMemory(arr, ret);
      return ret;
    }
  };

  function convertReturnValue(ret) {
    if (returnType === 'string') return UTF8ToString(ret);
    if (returnType === 'boolean') return Boolean(ret);
    return ret;
  }

  var func = getCFunc(ident);
  var cArgs = [];
  var stack = 0;
  if (args) {
    for (var i = 0; i < args.length; i++) {
      var converter = toC[argTypes[i]];
      if (converter) {
        if (stack === 0) stack = stackSave();
        cArgs[i] = converter(args[i]);
      } else {
        cArgs[i] = args[i];
      }
    }
  }
  var ret = func.apply(null, cArgs);

  ret = convertReturnValue(ret);
  if (stack !== 0) stackRestore(stack);
  return ret;
}

function cwrap(ident, returnType, argTypes, opts) {
  argTypes = argTypes || [];
  // When the function takes numbers and returns a number, we can just return
  // the original function
  var numericArgs = argTypes.every(function(type){ return type === 'number'});
  var numericRet = returnType !== 'string';
  if (numericRet && numericArgs && !opts) {
    return getCFunc(ident);
  }
  return function() {
    return ccall(ident, returnType, argTypes, arguments, opts);
  }
}

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_DYNAMIC = 2; // Cannot be freed except through sbrk
var ALLOC_NONE = 3; // Do not allocate

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
/** @type {function((TypedArray|Array<number>|number), string, number, number=)} */
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc,
    stackAlloc,
    dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var stop;
    ptr = ret;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)>>0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(/** @type {!Uint8Array} */ (slab), ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}

// Allocate memory during any stage of startup - static memory early on, dynamic memory later, malloc when ready
function getMemory(size) {
  if (!runtimeInitialized) return dynamicAlloc(size);
  return _malloc(size);
}




/** @type {function(number, number=)} */
function Pointer_stringify(ptr, length) {
  abort("this function has been removed - you should use UTF8ToString(ptr, maxBytesToRead) instead!");
}

// Given a pointer 'ptr' to a null-terminated ASCII-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

function AsciiToString(ptr) {
  var str = '';
  while (1) {
    var ch = HEAPU8[((ptr++)>>0)];
    if (!ch) return str;
    str += String.fromCharCode(ch);
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in ASCII form. The copy will require at most str.length+1 bytes of space in the HEAP.

function stringToAscii(str, outPtr) {
  return writeAsciiToMemory(str, outPtr, false);
}


// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the given array that contains uint8 values, returns
// a copy of that string as a Javascript String object.

var UTF8Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf8') : undefined;

/**
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation, so that undefined means Infinity)
  while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
    return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
  } else {
    var str = '';
    // If building with TextDecoder, we have already computed the string length above, so test loop end condition against that
    while (idx < endPtr) {
      // For UTF8 byte structure, see:
      // http://en.wikipedia.org/wiki/UTF-8#Description
      // https://www.ietf.org/rfc/rfc2279.txt
      // https://tools.ietf.org/html/rfc3629
      var u0 = u8Array[idx++];
      if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
      var u1 = u8Array[idx++] & 63;
      if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
      var u2 = u8Array[idx++] & 63;
      if ((u0 & 0xF0) == 0xE0) {
        u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
      } else {
        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
      }

      if (u0 < 0x10000) {
        str += String.fromCharCode(u0);
      } else {
        var ch = u0 - 0x10000;
        str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
      }
    }
  }
  return str;
}

// Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the emscripten HEAP, returns a
// copy of that string as a Javascript String object.
// maxBytesToRead: an optional length that specifies the maximum number of bytes to read. You can omit
//                 this parameter to scan the string until the first \0 byte. If maxBytesToRead is
//                 passed, and the string at [ptr, ptr+maxBytesToReadr[ contains a null byte in the
//                 middle, then the string will cut short at that byte index (i.e. maxBytesToRead will
//                 not produce a string of exact length [ptr, ptr+maxBytesToRead[)
//                 N.B. mixing frequent uses of UTF8ToString() with and without maxBytesToRead may
//                 throw JS JIT optimizations off, so it is worth to consider consistently using one
//                 style or the other.
/**
 * @param {number} ptr
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : '';
}

// Copies the given Javascript String object 'str' to the given byte array at address 'outIdx',
// encoded in UTF8 form and null-terminated. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outU8Array: the array to copy to. Each index in this array is assumed to be one 8-byte element.
//   outIdx: The starting offset in the array to begin the copying.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array.
//                    This count should include the null terminator,
//                    i.e. if maxBytesToWrite=1, only the null terminator will be written and nothing else.
//                    maxBytesToWrite=0 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
  if (!(maxBytesToWrite > 0)) // Parameter maxBytesToWrite is not optional. Negative values, 0, null, undefined and false each don't write out any bytes.
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      outU8Array[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      outU8Array[outIdx++] = 0xC0 | (u >> 6);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      outU8Array[outIdx++] = 0xE0 | (u >> 12);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      outU8Array[outIdx++] = 0xF0 | (u >> 18);
      outU8Array[outIdx++] = 0x80 | ((u >> 12) & 63);
      outU8Array[outIdx++] = 0x80 | ((u >> 6) & 63);
      outU8Array[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  outU8Array[outIdx] = 0;
  return outIdx - startIdx;
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF8 form. The copy will require at most str.length*4+1 bytes of space in the HEAP.
// Use the function lengthBytesUTF8 to compute the exact number of bytes (excluding null terminator) that this function will write.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF8 byte array, EXCLUDING the null terminator byte.
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (str.charCodeAt(++i) & 0x3FF);
    if (u <= 0x7F) ++len;
    else if (u <= 0x7FF) len += 2;
    else if (u <= 0xFFFF) len += 3;
    else len += 4;
  }
  return len;
}


// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.

var UTF16Decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-16le') : undefined;
function UTF16ToString(ptr) {
  var endPtr = ptr;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on null terminator by itself.
  // Also, use the length info to avoid running tiny strings through TextDecoder, since .subarray() allocates garbage.
  var idx = endPtr >> 1;
  while (HEAP16[idx]) ++idx;
  endPtr = idx << 1;

  if (endPtr - ptr > 32 && UTF16Decoder) {
    return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
  } else {
    var i = 0;

    var str = '';
    while (1) {
      var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
      if (codeUnit == 0) return str;
      ++i;
      // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
      str += String.fromCharCode(codeUnit);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16 form. The copy will require at most str.length*4+2 bytes of space in the HEAP.
// Use the function lengthBytesUTF16() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=2, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<2 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF16(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 2) return 0;
  maxBytesToWrite -= 2; // Null terminator.
  var startPtr = outPtr;
  var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
  for (var i = 0; i < numCharsToWrite; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[((outPtr)>>1)]=codeUnit;
    outPtr += 2;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[((outPtr)>>1)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF16(str) {
  return str.length*2;
}

function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32 form. The copy will require at most str.length*4+4 bytes of space in the HEAP.
// Use the function lengthBytesUTF32() to compute the exact number of bytes (excluding null terminator) that this function will write.
// Parameters:
//   str: the Javascript string to copy.
//   outPtr: Byte address in Emscripten HEAP where to write the string to.
//   maxBytesToWrite: The maximum number of bytes this function can write to the array. This count should include the null
//                    terminator, i.e. if maxBytesToWrite=4, only the null terminator will be written and nothing else.
//                    maxBytesToWrite<4 does not write any bytes to the output, not even the null terminator.
// Returns the number of bytes written, EXCLUDING the null terminator.

function stringToUTF32(str, outPtr, maxBytesToWrite) {
  // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
  if (maxBytesToWrite === undefined) {
    maxBytesToWrite = 0x7FFFFFFF;
  }
  if (maxBytesToWrite < 4) return 0;
  var startPtr = outPtr;
  var endPtr = startPtr + maxBytesToWrite - 4;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++i);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[((outPtr)>>2)]=codeUnit;
    outPtr += 4;
    if (outPtr + 4 > endPtr) break;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[((outPtr)>>2)]=0;
  return outPtr - startPtr;
}

// Returns the number of bytes the given Javascript string takes if encoded as a UTF16 byte array, EXCLUDING the null terminator byte.

function lengthBytesUTF32(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var codeUnit = str.charCodeAt(i);
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) ++i; // possibly a lead surrogate, so skip over the tail surrogate.
    len += 4;
  }

  return len;
}

// Allocate heap space for a JS string, and write it there.
// It is the responsibility of the caller to free() that memory.
function allocateUTF8(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = _malloc(size);
  if (ret) stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Allocate stack space for a JS string, and write it there.
function allocateUTF8OnStack(str) {
  var size = lengthBytesUTF8(str) + 1;
  var ret = stackAlloc(size);
  stringToUTF8Array(str, HEAP8, ret, size);
  return ret;
}

// Deprecated: This function should not be called because it is unsafe and does not provide
// a maximum length limit of how many bytes it is allowed to write. Prefer calling the
// function stringToUTF8Array() instead, which takes in a maximum length that can be used
// to be secure from out of bounds writes.
/** @deprecated */
function writeStringToMemory(string, buffer, dontAddNull) {
  warnOnce('writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!');

  var /** @type {number} */ lastChar, /** @type {number} */ end;
  if (dontAddNull) {
    // stringToUTF8Array always appends null. If we don't want to do that, remember the
    // character that existed at the location where the null will be placed, and restore
    // that after the write (below).
    end = buffer + lengthBytesUTF8(string);
    lastChar = HEAP8[end];
  }
  stringToUTF8(string, buffer, Infinity);
  if (dontAddNull) HEAP8[end] = lastChar; // Restore the value under the null character.
}

function writeArrayToMemory(array, buffer) {
  HEAP8.set(array, buffer);
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; ++i) {
    HEAP8[((buffer++)>>0)]=str.charCodeAt(i);
  }
  // Null-terminate the pointer to the HEAP.
  if (!dontAddNull) HEAP8[((buffer)>>0)]=0;
}




// Memory management

var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;
var ASMJS_PAGE_SIZE = 16777216;

function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}

var HEAP,
/** @type {ArrayBuffer} */
  buffer,
/** @type {Int8Array} */
  HEAP8,
/** @type {Uint8Array} */
  HEAPU8,
/** @type {Int16Array} */
  HEAP16,
/** @type {Uint16Array} */
  HEAPU16,
/** @type {Int32Array} */
  HEAP32,
/** @type {Uint32Array} */
  HEAPU32,
/** @type {Float32Array} */
  HEAPF32,
/** @type {Float64Array} */
  HEAPF64;

function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = HEAP8 = new Int8Array(buf);
  Module['HEAP16'] = HEAP16 = new Int16Array(buf);
  Module['HEAP32'] = HEAP32 = new Int32Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
  Module['HEAPU16'] = HEAPU16 = new Uint16Array(buf);
  Module['HEAPU32'] = HEAPU32 = new Uint32Array(buf);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(buf);
  Module['HEAPF64'] = HEAPF64 = new Float64Array(buf);
}

var STATIC_BASE = 1024,
    STACK_BASE = 5266208,
    STACKTOP = STACK_BASE,
    STACK_MAX = 23328,
    DYNAMIC_BASE = 5266208,
    DYNAMICTOP_PTR = 23168;




var TOTAL_STACK = 5242880;

var INITIAL_TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;







// In standalone mode, the wasm creates the memory, and the user can't provide it.
// In non-standalone/normal mode, we create the memory here.

// Create the main memory. (Note: this isn't used in STANDALONE_WASM mode since the wasm
// memory is created in the wasm, not in JS.)

  if (Module['wasmMemory']) {
    wasmMemory = Module['wasmMemory'];
  } else
  {
    wasmMemory = new WebAssembly.Memory({
      'initial': INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
      ,
      'maximum': INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
    });
  }


if (wasmMemory) {
  buffer = wasmMemory.buffer;
}

// If the user provides an incorrect length, just use that length instead rather than providing the user to
// specifically provide the memory length with Module['TOTAL_MEMORY'].
INITIAL_TOTAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);

HEAP32[DYNAMICTOP_PTR>>2] = DYNAMIC_BASE;










function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Module['dynCall_v'](func);
      } else {
        Module['dynCall_vi'](func, callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the main() is called

var runtimeInitialized = false;
var runtimeExited = false;


function preRun() {

  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPRERUN__);
}

function initRuntime() {
  runtimeInitialized = true;
  if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  FS.ignorePermissions = false;
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  runtimeExited = true;
}

function postRun() {

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }

  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}

function addOnExit(cb) {
}

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}



var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_round = Math.round;
var Math_min = Math.min;
var Math_max = Math.max;
var Math_clz32 = Math.clz32;
var Math_trunc = Math.trunc;



// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// Module.preRun (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function getUniqueRunDependency(id) {
  return id;
}

function addRunDependency(id) {
  runDependencies++;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

}

function removeRunDependency(id) {
  runDependencies--;

  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }

  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }

  what += '';
  out(what);
  err(what);

  ABORT = true;
  EXITSTATUS = 1;

  what = 'abort(' + what + '). Build with -s ASSERTIONS=1 for more info.';

  // Throw a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  throw new WebAssembly.RuntimeError(what);
}


var memoryInitializer = null;







// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

// Prefix of data URIs emitted by SINGLE_FILE and related options.
var dataURIPrefix = 'data:application/octet-stream;base64,';

// Indicates whether filename is a base64 data URI.
function isDataURI(filename) {
  return String.prototype.startsWith ?
      filename.startsWith(dataURIPrefix) :
      filename.indexOf(dataURIPrefix) === 0;
}




var wasmBinaryFile = 'data:application/octet-stream;base64,AGFzbQEAAAABrwRHYAF/AX9gAn9/AX9gBH9/f38AYAN/f38AYAN/f38Bf2AFf39/f3wBf2ADf35/AX5gAn9/AGAIf39/f39/f38Bf2AFf39/f38Bf2AGf3x/f39/AX9gBn9/f39/fwF/YAF/AGAEf39/fwF/YAAAYAZ/f39/f38AYAV/f39/fwBgDX9/f39/f39/f39/f38AYAh/f39/f39/fwBgAAF/YAV/f35/fwBgAn9+AGAFf35+fn4AYAR/f39+AX5gBH9+fn8AYAJ/fQBgAn98AGAEfn5+fgF/YAJ+fgF8YAd/f39/f39/AGACf38BfmACfn4BfWADf39+AGACfH8BfGAHf39/f39/fwF/YAJ+fwF/YAN+f38Bf2AEf39/fwF+YAJ/fwF9YAJ/fwF8YAN/f38BfWADf39/AXxgCn9/f39/f39/f38Bf2AMf39/f39/f39/f39/AX9gBX9/f39+AX9gBn9/f39+fgF/YAt/f39/f39/f39/fwF/YAp/f39/f39/f39/AGAHf39/f39+fgF/YA9/f39/f39/f39/f39/f38AYAJ+fgF/YAd/f3x/f39/AX9gCX9/f39/f39/fwF/YAZ/f39/f3wBf2ABfwBgA39/fwBgAX8Bf2ABfQF/YAJ/fwBgAABgA39+fgBgAn5+AX9gAn9/AX9gAAF/YAN/f38Bf2AFf39/f38Bf2AEf39/fwF/YAV/f39/fwBgBH9/f38AYAZ/f39/f38Bf2ABfwF8As0FHANlbnYWX2VtYmluZF9yZWdpc3Rlcl9jbGFzcwARA2VudiJfZW1iaW5kX3JlZ2lzdGVyX2NsYXNzX2NvbnN0cnVjdG9yAA8DZW52H19lbWJpbmRfcmVnaXN0ZXJfY2xhc3NfZnVuY3Rpb24AEg13YXNpX3Vuc3RhYmxlCGZkX2Nsb3NlAAANd2FzaV91bnN0YWJsZQdmZF9yZWFkAA0Nd2FzaV91bnN0YWJsZQhmZF93cml0ZQANA2VudgZfX2xvY2sADANlbnYIX191bmxvY2sADA13YXNpX3Vuc3RhYmxlEWVudmlyb25fc2l6ZXNfZ2V0AAENd2FzaV91bnN0YWJsZQtlbnZpcm9uX2dldAABA2VudgpfX21hcF9maWxlAAEDZW52C19fc3lzY2FsbDkxAAEDZW52CnN0cmZ0aW1lX2wACQNlbnYFYWJvcnQADgNlbnYVX2VtYmluZF9yZWdpc3Rlcl92b2lkAAcDZW52FV9lbWJpbmRfcmVnaXN0ZXJfYm9vbAAQA2VudhtfZW1iaW5kX3JlZ2lzdGVyX3N0ZF9zdHJpbmcABwNlbnYcX2VtYmluZF9yZWdpc3Rlcl9zdGRfd3N0cmluZwADA2VudhZfZW1iaW5kX3JlZ2lzdGVyX2VtdmFsAAcDZW52GF9lbWJpbmRfcmVnaXN0ZXJfaW50ZWdlcgAQA2VudhZfZW1iaW5kX3JlZ2lzdGVyX2Zsb2F0AAMDZW52HF9lbWJpbmRfcmVnaXN0ZXJfbWVtb3J5X3ZpZXcAAwNlbnYWZW1zY3JpcHRlbl9yZXNpemVfaGVhcAAAA2VudhVlbXNjcmlwdGVuX21lbWNweV9iaWcABANlbnYLc2V0VGVtcFJldDAADA13YXNpX3Vuc3RhYmxlB2ZkX3NlZWsACQNlbnYGbWVtb3J5AgGAAoACA2VudgV0YWJsZQFwAOUCA64FrAUOAAwBAAIQDgQAAAA2DAAMAAcEFAIABDcAAAEEAAwABDcAAAQAAAwMNgABAAABATYBAAE2AAEAAQEBAAEAAAwMADg5Ojo6OgwHBwAAABMEBgQGAAwAAQAAAAQNAAA7DDY7Njs3Ojc6BwAADAcAAQABDAcAAQABBwAEAQcEARUAPBcNGBkYFgcWGhs9FgcWGBYcAg8dHh8EASA+BAQEAQ4BBAA6AT8+ASFAQQMANxAjJCMECgcNBAQ+PgwAQEINCRclJSYCJwMCDAkCAwQJAgMECwAiAQQLQQADAAcqDQILQSULQQ0LQQ0LQSULQRArKAtBKQtBAgsTQAwEAQsAIgtBPgMqC0ELQQtBC0ELQRArC0ELQQsEPgkAAAkCCQQdCwcABCwJLAUEAA0dLQkJAAkdCwcELAksBR0tCQcHCAALCwsPCw8LQwkIRENDQ0NDQ0QPQ0NDCAsLCw8LDwtDCQhEQ0NDQ0NDRA9DQ0MiDwcEIg8JOwQABwcHAAciLi86AwMiDDcAOgAEAToiLi86Igw3ADoABAEwLzEECzAvMQQLBAQEDzc6D0READs7OzYMBwA6OxM2AAwMNhM2DAcMDAQNDQ0BBAEEAQ0ECQAMAQQBBA0ECQgJCQwIQUAICwkJADgACQ0ACEUIRQlAAAhFCEUJQAAMAAwAAAcHBwc6Bwc6AA4MAA4MOgAODAAODAAODAAODAAMAAwADAAMAAwADAAMAAwMAD8BNj44Awc2OA0HNgIHDDgMDAMMOg4ABAQ2OzoDADcSOjoHQzc3BwMDNxJDNwcDNjsOBAQEPjcCAgICPgQBAUQQDxAQEA8PDwAADjs7Ozs7Ozs7Ozs7OwwMDAwMDDs7OzsAAAwBAQcAFkYyBAQ3BxMADAABBwQQDwMNMwkLNCI1CB0MHQkiNCoGEAJ/AUGAtcECC38AQfy0AQsHvQQhEV9fd2FzbV9jYWxsX2N0b3JzABoQX19lcnJub19sb2NhdGlvbgBnCHNldFRocmV3AKwFBGZyZWUAoQUGbWFsbG9jAKAFDV9fZ2V0VHlwZU5hbWUAhwUqX19lbWJpbmRfcmVnaXN0ZXJfbmF0aXZlX2FuZF9idWlsdGluX3R5cGVzAIgFCl9fZGF0YV9lbmQDAQlzdGFja1NhdmUArQUKc3RhY2tBbGxvYwCuBQxzdGFja1Jlc3RvcmUArwUQX19ncm93V2FzbU1lbW9yeQCwBQpkeW5DYWxsX2lpALEFCmR5bkNhbGxfdmkAsgULZHluQ2FsbF9paWkAswUNZHluQ2FsbF92aWlpaQC0BQ5keW5DYWxsX3ZpaWlpaQC1BQtkeW5DYWxsX3ZpaQC2BQxkeW5DYWxsX2lpaWkAtwUOZHluQ2FsbF92aWlqaWkAwQUMZHluQ2FsbF9qaWppAMIFD2R5bkNhbGxfaWlkaWlpaQC4BQ1keW5DYWxsX2lpaWlpALkFDmR5bkNhbGxfaWlpaWlpALoFEWR5bkNhbGxfaWlpaWlpaWlpALsFD2R5bkNhbGxfaWlpaWlpaQC8BQ5keW5DYWxsX2lpaWlpagDDBQ5keW5DYWxsX2lpaWlpZAC9BQ9keW5DYWxsX2lpaWlpamoAxAUQZHluQ2FsbF9paWlpaWlpaQC+BRBkeW5DYWxsX2lpaWlpaWpqAMUFD2R5bkNhbGxfdmlpaWlpaQC/BQlkeW5DYWxsX3YAwAUJ+AQBAEEBC+QCGxwdHh8gKCkrLC0uLy8wMjM0NTQ2NyssLS4vLzkyPDQ9ND5AP0E+QD9BVlhXWVZYV1klYSQnJCdmaGkvamt4hAGFAYYBiAGJAYoBiwGMAY4BjwGEAZABkQGSAZMBigGUAZEBlQGWAbYBzAHNAc8BoQVt1APX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IgJBgICAfGpB////9wdNBEAgAq1CGYZCgICAgICAgMA/fAwBCyACQYCAgPwHTwRAIAStQhmGQoCAgICAgMD//wCEDAELIAJFBEBCAAwBCyADIAKtQgAgAmciAkHRAGoQnAEgAykDACEGIAMpAwhCgICAgICAwACFQYn/ACACa61CMIaECyEHIAAgBjcDACAAIAcgBa1CIIaENwMIIANBEGokAAtRAQF+AkACfiADQcAAcQRAIAIgA0FAaq2IIQFCAAwBCyADRQ0BIAJBwAAgA2uthiABIAOtIgSIhCEBIAIgBIgLIQILIAAgATcDACAAIAI3AwgLpwsCBX8PfiMAQeAAayIFJAAgBEIvhiADQhGIhCEPIAJCIIYgAUIgiIQhDSAEQv///////z+DIg5CD4YgA0IxiIQhECACIASFQoCAgICAgICAgH+DIQogDkIRiCERIAJC////////P4MiC0IgiCESIARCMIinQf//AXEhBwJAAn8gAkIwiKdB//8BcSIJQX9qQf3/AU0EQEEAIAdBf2pB/v8BSQ0BGgsgAVAgAkL///////////8AgyIMQoCAgICAgMD//wBUIAxCgICAgICAwP//AFEbRQRAIAJCgICAgICAIIQhCgwCCyADUCAEQv///////////wCDIgJCgICAgICAwP//AFQgAkKAgICAgIDA//8AURtFBEAgBEKAgICAgIAghCEKIAMhAQwCCyABIAxCgICAgICAwP//AIWEQgBRBEAgAiADhFAEQEKAgICAgIDg//8AIQpCACEBDAMLIApCgICAgICAwP//AIQhCkIAIQEMAgsgAyACQoCAgICAgMD//wCFhEIAUQRAIAEgDIQhAkIAIQEgAlAEQEKAgICAgIDg//8AIQoMAwsgCkKAgICAgIDA//8AhCEKDAILIAEgDIRCAFEEQEIAIQEMAgsgAiADhEIAUQRAQgAhAQwCCyAMQv///////z9YBEAgBUHQAGogASALIAEgCyALUCIGG3kgBkEGdK18pyIGQXFqEJwBIAUpA1giC0IghiAFKQNQIgFCIIiEIQ0gC0IgiCESQRAgBmshBgsgBiACQv///////z9WDQAaIAVBQGsgAyAOIAMgDiAOUCIIG3kgCEEGdK18pyIIQXFqEJwBIAUpA0giAkIPhiAFKQNAIgNCMYiEIRAgAkIvhiADQhGIhCEPIAJCEYghESAGIAhrQRBqCyEGIA9C/////w+DIgIgAUL/////D4MiAX4iDyADQg+GQoCA/v8PgyIDIA1C/////w+DIgx+fCIEQiCGIg4gASADfnwiDSAOVK0gAiAMfiIVIAMgC0L/////D4MiC358IhMgEEL/////D4MiDiABfnwiECAEIA9UrUIghiAEQiCIhHwiFCACIAt+IhYgAyASQoCABIQiD358IgMgDCAOfnwiEiABIBFC/////weDQoCAgIAIhCIBfnwiEUIghnwiF3whBCAHIAlqIAZqQYGAf2ohBgJAIAsgDn4iGCACIA9+fCICIBhUrSACIAEgDH58IgwgAlStfCAMIBMgFVStIBAgE1StfHwiAiAMVK18IAEgD358IAEgC34iCyAOIA9+fCIBIAtUrUIghiABQiCIhHwgAiABQiCGfCIBIAJUrXwgASARIBJUrSADIBZUrSASIANUrXx8QiCGIBFCIIiEfCIDIAFUrXwgAyAUIBBUrSAXIBRUrXx8IgIgA1StfCIBQoCAgICAgMAAg1BFBEAgBkEBaiEGDAELIA1CP4ghAyABQgGGIAJCP4iEIQEgAkIBhiAEQj+IhCECIA1CAYYhDSADIARCAYaEIQQLIAZB//8BTgRAIApCgICAgICAwP//AIQhCkIAIQEMAQsCfiAGQQBMBEBBASAGayIHQf8ATQRAIAVBEGogDSAEIAcQngEgBUEgaiACIAEgBkH/AGoiBhCcASAFQTBqIA0gBCAGEJwBIAUgAiABIAcQngEgBSkDMCAFKQM4hEIAUq0gBSkDICAFKQMQhIQhDSAFKQMoIAUpAxiEIQQgBSkDACECIAUpAwgMAgtCACEBDAILIAFC////////P4MgBq1CMIaECyAKhCEKIA1QIARCf1UgBEKAgICAgICAgIB/URtFBEAgCiACQgF8IgEgAlStfCEKDAELIA0gBEKAgICAgICAgIB/hYRCAFIEQCACIQEMAQsgCiACIAJCAYN8IgEgAlStfCEKCyAAIAE3AwAgACAKNwMIIAVB4ABqJAALfwICfwF+IwBBEGsiAyQAIAACfiABRQRAQgAMAQsgAyABIAFBH3UiAmogAnMiAq1CACACZyICQdEAahCcASADKQMIQoCAgICAgMAAhUGegAEgAmutQjCGfCABQYCAgIB4ca1CIIaEIQQgAykDAAs3AwAgACAENwMIIANBEGokAAvMCQIEfwR+IwBB8ABrIgUkACAEQv///////////wCDIQoCQAJAIAFCf3wiC0J/USACQv///////////wCDIgkgCyABVK18Qn98IgtC////////v///AFYgC0L///////+///8AURtFBEAgA0J/fCILQn9SIAogCyADVK18Qn98IgtC////////v///AFQgC0L///////+///8AURsNAQsgAVAgCUKAgICAgIDA//8AVCAJQoCAgICAgMD//wBRG0UEQCACQoCAgICAgCCEIQQgASEDDAILIANQIApCgICAgICAwP//AFQgCkKAgICAgIDA//8AURtFBEAgBEKAgICAgIAghCEEDAILIAEgCUKAgICAgIDA//8AhYRCAFEEQEKAgICAgIDg//8AIAIgASADhSACIASFQoCAgICAgICAgH+FhFAiBhshBEIAIAEgBhshAwwCCyADIApCgICAgICAwP//AIWEUA0BIAEgCYRCAFEEQCADIAqEQgBSDQIgASADgyEDIAIgBIMhBAwCCyADIAqEUEUNACABIQMgAiEEDAELIAMgASADIAFWIAogCVYgCSAKURsiBxshCiAEIAIgBxsiC0L///////8/gyEJIAIgBCAHGyICQjCIp0H//wFxIQggC0IwiKdB//8BcSIGRQRAIAVB4ABqIAogCSAKIAkgCVAiBht5IAZBBnStfKciBkFxahCcASAFKQNoIQkgBSkDYCEKQRAgBmshBgsgASADIAcbIQMgAkL///////8/gyEBIAgEfiABBSAFQdAAaiADIAEgAyABIAFQIgcbeSAHQQZ0rXynIgdBcWoQnAFBECAHayEIIAUpA1AhAyAFKQNYC0IDhiADQj2IhEKAgICAgICABIQhBCAJQgOGIApCPYiEIQEgAiALhSEMAn4gA0IDhiIDIAYgCGsiB0UNABogB0H/AEsEQEIAIQRCAQwBCyAFQUBrIAMgBEGAASAHaxCcASAFQTBqIAMgBCAHEJ4BIAUpAzghBCAFKQMwIAUpA0AgBSkDSIRCAFKthAshAyABQoCAgICAgIAEhCEJIApCA4YhAgJAIAxCf1cEQCACIAN9IgEgCSAEfSACIANUrX0iA4RQBEBCACEDQgAhBAwDCyADQv////////8DVg0BIAVBIGogASADIAEgAyADUCIHG3kgB0EGdK18p0F0aiIHEJwBIAYgB2shBiAFKQMoIQMgBSkDICEBDAELIAIgA3wiASADVK0gBCAJfHwiA0KAgICAgICACINQDQAgAUIBgyADQj+GIAFCAYiEhCEBIAZBAWohBiADQgGIIQMLIAtCgICAgICAgICAf4MhAiAGQf//AU4EQCACQoCAgICAgMD//wCEIQRCACEDDAELQQAhBwJAIAZBAEoEQCAGIQcMAQsgBUEQaiABIAMgBkH/AGoQnAEgBSABIANBASAGaxCeASAFKQMAIAUpAxAgBSkDGIRCAFKthCEBIAUpAwghAwsgA0I9hiABQgOIhCIEIAGnQQdxIgZBBEutfCIBIARUrSADQgOIQv///////z+DIAKEIAetQjCGhHwgASABQgGDQgAgBkEERhsiAXwiAyABVK18IQQLIAAgAzcDACAAIAQ3AwggBUHwAGokAAuBAgICfwR+IwBBEGsiAiQAIAG9IgVCgICAgICAgICAf4MhBwJ+IAVC////////////AIMiBEKAgICAgICAeHxC/////////+//AFgEQCAEQjyGIQYgBEIEiEKAgICAgICAgDx8DAELIARCgICAgICAgPj/AFoEQCAFQjyGIQYgBUIEiEKAgICAgIDA//8AhAwBCyAEUARAQgAMAQsgAiAEQgAgBEKAgICAEFoEfyAEQiCIp2cFIAWnZ0EgagsiA0ExahCcASACKQMAIQYgAikDCEKAgICAgIDAAIVBjPgAIANrrUIwhoQLIQQgACAGNwMAIAAgBCAHhDcDCCACQRBqJAAL2wECAX8CfkEBIQQCQCAAQgBSIAFC////////////AIMiBUKAgICAgIDA//8AViAFQoCAgICAgMD//wBRGw0AIAJCAFIgA0L///////////8AgyIGQoCAgICAgMD//wBWIAZCgICAgICAwP//AFEbDQAgACAChCAFIAaEhFAEQEEADwsgASADg0IAWQRAQX8hBCAAIAJUIAEgA1MgASADURsNASAAIAKFIAEgA4WEQgBSDwtBfyEEIAAgAlYgASADVSABIANRGw0AIAAgAoUgASADhYRCAFIhBAsgBAvYAQIBfwF+QX8hAgJAIABCAFIgAUL///////////8AgyIDQoCAgICAgMD//wBWIANCgICAgICAwP//AFEbDQAgACADQoCAgICAgID/P4SEUARAQQAPCyABQoCAgICAgID/P4NCAFkEQCAAQgBUIAFCgICAgICAgP8/UyABQoCAgICAgID/P1EbDQEgACABQoCAgICAgID/P4WEQgBSDwsgAEIAViABQoCAgICAgID/P1UgAUKAgICAgICA/z9RGw0AIAAgAUKAgICAgICA/z+FhEIAUiECCyACCzUAIAAgATcDACAAIAJC////////P4MgBEIwiKdBgIACcSACQjCIp0H//wFxcq1CMIaENwMIC2QCAX8BfiMAQRBrIgIkACAAAn4gAUUEQEIADAELIAIgAa1CACABZyIBQdEAahCcASACKQMIQoCAgICAgMAAhUGegAEgAWutQjCGfCEDIAIpAwALNwMAIAAgAzcDCCACQRBqJAALRQEBfyMAQRBrIgUkACAFIAEgAiADIARCgICAgICAgICAf4UQoQEgBSkDACEBIAAgBSkDCDcDCCAAIAE3AwAgBUEQaiQAC8gCAQJ/IwBB0ABrIgQkAAJAIANBgIABTgRAIARBIGogASACQgBCgICAgICAgP//ABCfASAEKQMoIQIgBCkDICEBIANBgYB/aiIFQYCAAUgEQCAFIQMMAgsgBEEQaiABIAJCAEKAgICAgICA//8AEJ8BIANB/f8CIANB/f8CSBtBgoB+aiEDIAQpAxghAiAEKQMQIQEMAQsgA0GBgH9KDQAgBEFAayABIAJCAEKAgICAgIDAABCfASAEKQNIIQIgBCkDQCEBIANB/v8AaiIFQYGAf0oEQCAFIQMMAQsgBEEwaiABIAJCAEKAgICAgIDAABCfASADQYaAfSADQYaAfUobQfz/AWohAyAEKQM4IQIgBCkDMCEBCyAEIAEgAkIAIANB//8Aaq1CMIYQnwEgACAEKQMINwMIIAAgBCkDADcDACAEQdAAaiQAC78QAgV/DH4jAEHAAWsiBSQAIARC////////P4MhEiACQv///////z+DIQwgAiAEhUKAgICAgICAgIB/gyERIARCMIinQf//AXEhCAJAAkACQCACQjCIp0H//wFxIglBf2pB/f8BTQRAIAhBf2pB/v8BSQ0BCyABUCACQv///////////wCDIgpCgICAgICAwP//AFQgCkKAgICAgIDA//8AURtFBEAgAkKAgICAgIAghCERDAILIANQIARC////////////AIMiAkKAgICAgIDA//8AVCACQoCAgICAgMD//wBRG0UEQCAEQoCAgICAgCCEIREgAyEBDAILIAEgCkKAgICAgIDA//8AhYRCAFEEQCADIAJCgICAgICAwP//AIWEUARAQgAhAUKAgICAgIDg//8AIREMAwsgEUKAgICAgIDA//8AhCERQgAhAQwCCyADIAJCgICAgICAwP//AIWEQgBRBEBCACEBDAILIAEgCoRCAFENAiACIAOEQgBRBEAgEUKAgICAgIDA//8AhCERQgAhAQwCCyAKQv///////z9YBEAgBUGwAWogASAMIAEgDCAMUCIGG3kgBkEGdK18pyIGQXFqEJwBQRAgBmshBiAFKQO4ASEMIAUpA7ABIQELIAJC////////P1YNACAFQaABaiADIBIgAyASIBJQIgcbeSAHQQZ0rXynIgdBcWoQnAEgBiAHakFwaiEGIAUpA6gBIRIgBSkDoAEhAwsgBUGQAWogEkKAgICAgIDAAIQiFEIPhiADQjGIhCICQoTJ+c6/5ryC9QAgAn0iBBCZASAFQYABakIAIAUpA5gBfSAEEJkBIAVB8ABqIAUpA4gBQgGGIAUpA4ABQj+IhCIEIAIQmQEgBUHgAGogBEIAIAUpA3h9EJkBIAVB0ABqIAUpA2hCAYYgBSkDYEI/iIQiBCACEJkBIAVBQGsgBEIAIAUpA1h9EJkBIAVBMGogBSkDSEIBhiAFKQNAQj+IhCIEIAIQmQEgBUEgaiAEQgAgBSkDOH0QmQEgBUEQaiAFKQMoQgGGIAUpAyBCP4iEIgQgAhCZASAFIARCACAFKQMYfRCZASAGIAkgCGtqIQYCfkIAIAUpAwhCAYYgBSkDAEI/iIRCf3wiCkL/////D4MiBCACQiCIIg5+IhAgCkIgiCIKIAJC/////w+DIgt+fCICQiCGIg0gBCALfnwiCyANVK0gCiAOfiACIBBUrUIghiACQiCIhHx8IAsgBCADQhGIQv////8PgyIOfiIQIAogA0IPhkKAgP7/D4MiDX58IgJCIIYiDyAEIA1+fCAPVK0gCiAOfiACIBBUrUIghiACQiCIhHx8fCICIAtUrXwgAkIAUq18fSILQv////8PgyIOIAR+IhAgCiAOfiINIAQgC0IgiCIPfnwiC0IghnwiDiAQVK0gCiAPfiALIA1UrUIghiALQiCIhHx8IA5CACACfSICQiCIIgsgBH4iECACQv////8PgyINIAp+fCICQiCGIg8gBCANfnwgD1StIAogC34gAiAQVK1CIIYgAkIgiIR8fHwiAiAOVK18IAJCfnwiECACVK18Qn98IgtC/////w+DIgIgDEIChiABQj6IhEL/////D4MiBH4iDiABQh6IQv////8PgyIKIAtCIIgiC358Ig0gDlStIA0gEEIgiCIOIAxCHohC///v/w+DQoCAEIQiDH58Ig8gDVStfCALIAx+fCACIAx+IhMgBCALfnwiDSATVK1CIIYgDUIgiIR8IA8gDUIghnwiDSAPVK18IA0gCiAOfiITIBBC/////w+DIhAgBH58Ig8gE1StIA8gAiABQgKGQvz///8PgyITfnwiFSAPVK18fCIPIA1UrXwgDyALIBN+IgsgDCAQfnwiDCAEIA5+fCIEIAIgCn58IgJCIIggAiAEVK0gDCALVK0gBCAMVK18fEIghoR8IgwgD1StfCAMIBUgDiATfiIEIAogEH58IgpCIIggCiAEVK1CIIaEfCIEIBVUrSAEIAJCIIZ8IARUrXx8IgQgDFStfCICQv////////8AWARAIAFCMYYgBEL/////D4MiASADQv////8PgyIKfiIMQgBSrX1CACAMfSIQIARCIIgiDCAKfiINIAEgA0IgiCILfnwiDkIghiIPVK19IAJC/////w+DIAp+IAEgEkL/////D4N+fCALIAx+fCAOIA1UrUIghiAOQiCIhHwgBCAUQiCIfiADIAJCIIh+fCACIAt+fCAMIBJ+fEIghnx9IRIgBkF/aiEGIBAgD30MAQsgBEIhiCELIAFCMIYgAkI/hiAEQgGIhCIEQv////8PgyIBIANC/////w+DIgp+IgxCAFKtfUIAIAx9Ig4gASADQiCIIgx+IhAgCyACQh+GhCINQv////8PgyIPIAp+fCILQiCGIhNUrX0gDCAPfiAKIAJCAYgiCkL/////D4N+fCABIBJC/////w+DfnwgCyAQVK1CIIYgC0IgiIR8IAQgFEIgiH4gAyACQiGIfnwgCiAMfnwgDSASfnxCIIZ8fSESIAohAiAOIBN9CyEBIAZB//8AaiIGQf//AU4EQCARQoCAgICAgMD//wCEIRFCACEBDAELIAZBAEwEQEIAIQEMAQsgBCABQgGGIANaIBJCAYYgAUI/iIQiASAUWiABIBRRG618IgEgBFStIAJC////////P4MgBq1CMIaEfCARhCERCyAAIAE3AwAgACARNwMIIAVBwAFqJAAPCyAAQgA3AwAgACARQoCAgICAgOD//wAgAiADhEIAUhs3AwggBUHAAWokAAvZAwICfwJ+IwBBIGsiAiQAAkAgAUL///////////8AgyIFQoCAgICAgMD/Q3wgBUKAgICAgIDAgLx/fFQEQCABQgSGIABCPIiEIQQgAEL//////////w+DIgBCgYCAgICAgIAIWgRAIARCgYCAgICAgIDAAHwhBAwCCyAEQoCAgICAgICAQH0hBCAAQoCAgICAgICACIVCAFINASAEQgGDIAR8IQQMAQsgAFAgBUKAgICAgIDA//8AVCAFQoCAgICAgMD//wBRG0UEQCABQgSGIABCPIiEQv////////8Dg0KAgICAgICA/P8AhCEEDAELQoCAgICAgID4/wAhBCAFQv///////7//wwBWDQBCACEEIAVCMIinIgNBkfcASQ0AIAIgACABQv///////z+DQoCAgICAgMAAhCIEQYH4ACADaxCeASACQRBqIAAgBCADQf+If2oQnAEgAikDCEIEhiACKQMAIgBCPIiEIQQgAikDECACKQMYhEIAUq0gAEL//////////w+DhCIAQoGAgICAgICACFoEQCAEQgF8IQQMAQsgAEKAgICAgICAgAiFQgBSDQAgBEIBgyAEfCEECyACQSBqJAAgBCABQoCAgICAgICAgH+DhL8LoQgCBX8CfiMAQTBrIgUkAAJAIAJBAk0EQCACQQJ0IgJB3BhqKAIAIQcgAkHQGGooAgAhCANAAn8gASgCBCICIAEoAmhJBEAgASACQQFqNgIEIAItAAAMAQsgARCYAQsiAiIEQSBGIARBd2pBBUlyDQALAkAgAkFVaiIEQQJLBEBBASEGDAELQQEhBiAEQQFrRQ0AQX9BASACQS1GGyEGIAEoAgQiAiABKAJoSQRAIAEgAkEBajYCBCACLQAAIQIMAQsgARCYASECC0EAIQQCQAJAA0AgBEGMGGosAAAgAkEgckYEQAJAIARBBksNACABKAIEIgIgASgCaEkEQCABIAJBAWo2AgQgAi0AACECDAELIAEQmAEhAgsgBEEBaiIEQQhHDQEMAgsLIARBA0cEQCAE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DQALIASsIQYCQCACQQpPDQADQCADrSAGQgp+fCEGAn8gACgCBCIBIAAoAmhJBEAgACABQQFqNgIEIAEtAAAMAQsgABCYAQshAyAGQlB8IQYgA0FQaiICQQlLDQEgBkKuj4XXx8LrowFTDQALCyACQQpJBEADQAJ/IAAoAgQiASAAKAJoSQRAIAAgAUEBajYCBCABLQAADAELIAAQmAELQVBqQQpJDQALCyAAKAJoBEAgACAAKAIEQX9qNgIEC0IAIAZ9IAYgBRshBgwBC0KAgICAgICAgIB/IQYgACgCaEUNACAAIAAoAgRBf2o2AgRCgICAgICAgICAfw8LIAYLtgMCA38BfiMAQSBrIgMkAAJAIAFC////////////AIMiBUKAgICAgIDAv0B8IAVCgICAgICAwMC/f3xUBEAgAUIZiKchAiAAUCABQv///w+DIgVCgICACFQgBUKAgIAIURtFBEAgAkGBgICABGohAgwCCyACQYCAgIAEaiECIAAgBUKAgIAIhYRCAFINASACQQFxIAJqIQIMAQsgAFAgBUKAgICAgIDA//8AVCAFQoCAgICAgMD//wBRG0UEQCABQhmIp0H///8BcUGAgID+B3IhAgwBC0GAgID8ByECIAVC////////v7/AAFYNAEEAIQIgBUIwiKciBEGR/gBJDQAgAyAAIAFC////////P4NCgICAgICAwACEIgVBgf8AIARrEJ4BIANBEGogACAFIARB/4F/ahCcASADKQMIIgBCGYinIQIgAykDACADKQMQIAMpAxiEQgBSrYQiBVAgAEL///8PgyIAQoCAgAhUIABCgICACFEbRQRAIAJBAWohAgwBCyAFIABCgICACIWEQgBSDQAgAkEBcSACaiECCyADQSBqJAAgAiABQiCIp0GAgICAeHFyvgvgEwINfwN+IwBBsAJrIgYkACAAKAJMQQBOBH9BAQVBAAsaAkAgAS0AACIERQ0AAkADQAJAAkAgBEH/AXEiA0EgRiADQXdqQQVJcgRAA0AgASIEQQFqIQEgBC0AASIDQSBGIANBd2pBBUlyDQALIABCABCXAQNAAn8gACgCBCIBIAAoAmhJBEAgACABQQFqNgIEIAEtAAAMAQsgABCYAQsiAUEgRiABQXdqQQVJcg0ACwJAIAAoAmhFBEAgACgCBCEBDAELIAAgACgCBEF/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IgMQswEiBCABayADIAQbIgMgAiADIAJJGyICEKkFGiAAIAEgA2oiAzYCVCAAIAM2AgggACABIAJqNgIEIAILSgEBfyMAQZABayIDJAAgA0EAQZABEKoFIgNBfzYCTCADIAA2AiwgA0HUADYCICADIAA2AlQgAyABIAIQsAEhACADQZABaiQAIAALCwAgACABIAIQtAELTQECfyABLQAAIQICQCAALQAAIgNFDQAgAiADRw0AA0AgAS0AASECIAAtAAEiA0UNASABQQFqIQEgAEEBaiEAIAIgA0YNAAsLIAMgAmsLjgEBA38jAEEQayIAJAACQCAAQQxqIABBCGoQCA0AQdygASAAKAIMQQJ0QQRqEKAFIgE2AgAgAUUNAAJAIAAoAggQoAUiAQRAQdygASgCACICDQELQdygAUEANgIADAELIAIgACgCDEECdGpBADYCAEHcoAEoAgAgARAJRQ0AQdygAUEANgIACyAAQRBqJAAL2gEBAn8CQCABQf8BcSIDBEAgAEEDcQRAA0AgAC0AACICRQ0DIAIgAUH/AXFGDQMgAEEBaiIAQQNxDQALCwJAIAAoAgAiAkF/cyACQf/9+3dqcUGAgYKEeHENACADQYGChAhsIQMDQCACIANzIgJBf3MgAkH//ft3anFBgIGChHhxDQEgACgCBCECIABBBGohACACQf/9+3dqIAJBf3NxQYCBgoR4cUUNAAsLA0AgACICLQAAIgMEQCACQQFqIQAgAyABQf8BcUcNAQsLIAIPCyAAECMgAGoPCyAAC2YBA38gAkUEQEEADwsCQCAALQAAIgNFDQADQAJAIAMgAS0AACIFRw0AIAJBf2oiAkUNACAFRQ0AIAFBAWohASAALQABIQMgAEEBaiEAIAMNAQwCCwsgAyEECyAEQf8BcSABLQAAawuoAQEFfyAAECMhBAJAAkBB3KABKAIARQ0AIAAtAABFDQAgAEE9ELkBIgFBACABLQAAQT1GGw0AQdygASgCACgCACIBRQ0AA0ACQCAAIAEgBBC6ASEDQdygASgCACEBIANFBEAgASACQQJ0aigCACIDIARqIgUtAABBPUYNAQsgASACQQFqIgJBAnRqKAIAIgENAQwDCwsgA0UNASAFQQFqIQILIAIPC0EAC0QBAX8jAEEQayICJAAgAiABNgIEIAIgADYCAEHbACACEAsiAEGBYE8Ef0HQhwFBACAAazYCAEEABSAACxogAkEQaiQAC8oFAQl/IwBBkAJrIgUkAAJAIAEtAAANAEHQGRC7ASIBBEAgAS0AAA0BCyAAQQxsQeAZahC7ASIBBEAgAS0AAA0BC0GoGhC7ASIBBEAgAS0AAA0BC0GtGiEBCwJAA0ACQCABIAJqLQAAIgNFDQAgA0EvRg0AQQ8hBCACQQFqIgJBD0cNAQwCCwsgAiEEC0GtGiEDAkACQAJAAkACQCABLQAAIgJBLkYNACABIARqLQAADQAgASEDIAJBwwBHDQELIAMtAAFFDQELIANBrRoQtwFFDQAgA0G1GhC3AQ0BCyAARQRAQYQZIQIgAy0AAUEuRg0CC0EAIQIMAQtB6KABKAIAIgIEQANAIAMgAkEIahC3AUUNAiACKAIYIgINAAsLQeCgARAGQeigASgCACICBEADQCADIAJBCGoQtwFFBEBB4KABEAcMAwsgAigCGCICDQALC0EAIQECQAJAAkBBoKABKAIADQBBuxoQuwEiAkUNACACLQAARQ0AIARBAWohCEH+ASAEayEJA0AgAkE6ELkBIgcgAmsgBy0AACIKQQBHayIGIAlJBH8gBUEQaiACIAYQqQUaIAVBEGogBmoiAkEvOgAAIAJBAWogAyAEEKkFGiAFQRBqIAYgCGpqQQA6AAAgBUEQaiAFQQxqEAoiBgRAQRwQoAUiAg0EIAYgBSgCDBC8AQwDCyAHLQAABSAKC0EARyAHaiICLQAADQALC0EcEKAFIgJFDQEgAkGEGSkCADcCACACQQhqIgEgAyAEEKkFGiABIARqQQA6AAAgAkHooAEoAgA2AhhB6KABIAI2AgAgAiEBDAELIAIgBjYCACACIAUoAgw2AgQgAkEIaiIBIAMgBBCpBRogASAEakEAOgAAIAJB6KABKAIANgIYQeigASACNgIAIAIhAQtB4KABEAcgAUGEGSAAIAFyGyECCyAFQZACaiQAIAILhAEBBH8jAEEgayIBJAACfwNAIAFBCGogAEECdGogAEG1wABByBpBASAAdEH/////B3EbEL0BIgM2AgAgAiADQQBHaiECIABBAWoiAEEGRw0ACwJAIAJBAUsNAEGgGSACQQFrDQEaIAEoAghBhBlHDQBBuBkMAQtBAAshACABQSBqJAAgAAuLAgACQCAABH8gAUH/AE0NAQJAQYyHASgCACgCAEUEQCABQYB/cUGAvwNGDQMMAQsgAUH/D00EQCAAIAFBP3FBgAFyOgABIAAgAUEGdkHAAXI6AABBAg8LIAFBgLADT0EAIAFBgEBxQYDAA0cbRQRAIAAgAUE/cUGAAXI6AAIgACABQQx2QeABcjoAACAAIAFBBnZBP3FBgAFyOgABQQMPCyABQYCAfGpB//8/TQRAIAAgAUE/cUGAAXI6AAMgACABQRJ2QfABcjoAACAAIAFBBnZBP3FBgAFyOgACIAAgAUEMdkE/cUGAAXI6AAFBBA8LC0HQhwFBGTYCAEF/BUEBCw8LIAAgAToAAEEBCxIAIABFBEBBAA8LIAAgARC/AQt/AgF/AX4gAL0iA0I0iKdB/w9xIgJB/w9HBHwgAkUEQCABIABEAAAAAAAAAABhBH9BAAUgAEQAAAAAAADwQ6IgARDBASEAIAEoAgBBQGoLNgIAIAAPCyABIAJBgnhqNgIAIANC/////////4eAf4NCgICAgICAgPA/hL8FIAALC/ACAQN/IwBB0AFrIgMkACADIAI2AswBQQAhAiADQaABakEAQSgQqgUaIAMgAygCzAE2AsgBAkBBACABIANByAFqIANB0ABqIANBoAFqEMMBQQBIBEBBfyEBDAELIAAoAkxBAE4EQEEBIQILIAAoAgAhBCAALABKQQBMBEAgACAEQV9xNgIACyAEQSBxIQUCfyAAKAIwBEAgACABIANByAFqIANB0ABqIANBoAFqEMMBDAELIABB0AA2AjAgACADQdAAajYCECAAIAM2AhwgACADNgIUIAAoAiwhBCAAIAM2AiwgACABIANByAFqIANB0ABqIANBoAFqEMMBIgEgBEUNABogAEEAQQAgACgCJBEEABogAEEANgIwIAAgBDYCLCAAQQA2AhwgAEEANgIQIAAoAhQhBCAAQQA2AhQgAUF/IAQbCyEBIAAgACgCACIAIAVyNgIAQX8gASAAQSBxGyEBIAJFDQALIANB0AFqJAAgAQveEQIPfwF+IwBB0ABrIgUkACAFIAE2AkwgBUE3aiETIAVBOGohEUEAIQECQAJAA0ACQCAOQQBIDQAgAUH/////ByAOa0oEQEHQhwFBPTYCAEF/IQ4MAQsgASAOaiEOCyAFKAJMIgohAQJAAkACQAJ/AkACQAJAAkACQAJAAkACQAJAIAotAAAiBgRAA0ACQAJAAkAgBkH/AXEiB0UEQCABIQYMAQsgB0ElRw0BIAEhBgNAIAEtAAFBJUcNASAFIAFBAmoiBzYCTCAGQQFqIQYgAS0AAiEJIAchASAJQSVGDQALCyAGIAprIQEgAARAIAAgCiABEMQBCyABDRFBfyEPQQEhBiAFKAJMIQECQCAFKAJMLAABQVBqQQpPDQAgAS0AAkEkRw0AIAEsAAFBUGohD0EBIRJBAyEGCyAFIAEgBmoiATYCTEEAIQYCQCABLAAAIhBBYGoiCUEfSwRAIAEhBwwBCyABIQdBASAJdCIMQYnRBHFFDQADQCAFIAFBAWoiBzYCTCAGIAxyIQYgASwAASIQQWBqIglBH0sNASAHIQFBASAJdCIMQYnRBHENAAsLAkAgEEEqRgRAIAUCfwJAIAcsAAFBUGpBCk8NACAFKAJMIgEtAAJBJEcNACABLAABQQJ0IARqQcB+akEKNgIAIAEsAAFBA3QgA2pBgH1qKAIAIQ1BASESIAFBA2oMAQsgEg0VQQAhEkEAIQ0gAARAIAIgAigCACIBQQRqNgIAIAEoAgAhDQsgBSgCTEEBagsiATYCTCANQX9KDQFBACANayENIAZBgMAAciEGDAELIAVBzABqEMUBIg1BAEgNEyAFKAJMIQELQX8hCAJAIAEtAABBLkcNACABLQABQSpGBEACQCABLAACQVBqQQpPDQAgBSgCTCIBLQADQSRHDQAgASwAAkECdCAEakHAfmpBCjYCACABLAACQQN0IANqQYB9aigCACEIIAUgAUEEaiIBNgJMDAILIBINFCAABH8gAiACKAIAIgFBBGo2AgAgASgCAAVBAAshCCAFIAUoAkxBAmoiATYCTAwBCyAFIAFBAWo2AkwgBUHMAGoQxQEhCCAFKAJMIQELQQAhBwNAIAchDEF/IQsgASwAAEG/f2pBOUsNFCAFIAFBAWoiEDYCTCABLAAAIQcgECEBIAcgDEE6bGpBnxpqLQAAIgdBf2pBCEkNAAsgB0UNEwJAAkACQCAHQRNGBEAgD0F/TA0BDBcLIA9BAEgNASAEIA9BAnRqIAc2AgAgBSADIA9BA3RqKQMANwNAC0EAIQEgAEUNEwwBCyAARQ0RIAVBQGsgByACEMYBIAUoAkwhEAsgBkH//3txIgkgBiAGQYDAAHEbIQZBACELQckaIQ8gESEHIBBBf2osAAAiAUFfcSABIAFBD3FBA0YbIAEgDBsiAUGof2oiEEEgTQ0BAkACfwJAAkAgAUG/f2oiCUEGSwRAIAFB0wBHDRQgCEUNASAFKAJADAMLIAlBAWsOAxMBEwgLQQAhASAAQSAgDUEAIAYQxwEMAgsgBUEANgIMIAUgBSkDQD4CCCAFIAVBCGo2AkBBfyEIIAVBCGoLIQdBACEBAkADQCAHKAIAIglFDQECQCAFQQRqIAkQwAEiCkEASCIJDQAgCiAIIAFrSw0AIAdBBGohByAIIAEgCmoiAUsNAQwCCwtBfyELIAkNFQsgAEEgIA0gASAGEMcBIAFFBEBBACEBDAELQQAhDCAFKAJAIQcDQCAHKAIAIglFDQEgBUEEaiAJEMABIgkgDGoiDCABSg0BIAAgBUEEaiAJEMQBIAdBBGohByAMIAFJDQALCyAAQSAgDSABIAZBgMAAcxDHASANIAEgDSABShshAQwRCyAFIAFBAWoiBzYCTCABLQABIQYgByEBDAELCyAQQQFrDh8MDAwMDAwMDAEMAwQBAQEMBAwMDAwIBQYMDAIMCQwMBwsgDiELIAANDyASRQ0MQQEhAQNAIAQgAUECdGooAgAiAARAIAMgAUEDdGogACACEMYBQQEhCyABQQFqIgFBCkcNAQwRCwtBASELIAFBCUsND0F/IQsgBCABQQJ0aigCAA0PA0AgAUEBaiIBQQpHBEAgBCABQQJ0aigCAEUNAQsLQX9BASABQQpJGyELDA8LIAAgBSsDQCANIAggBiABQdUAEQoAIQEMDAsgBSgCQCIBQdMaIAEbIgogCBCzASIBIAggCmogARshByAJIQYgASAKayAIIAEbIQgMCQsgBSAFKQNAPAA3QQEhCCATIQogCSEGDAgLIAUpA0AiFEJ/VwRAIAVCACAUfSIUNwNAQQEhC0HJGgwGCyAGQYAQcQRAQQEhC0HKGgwGC0HLGkHJGiAGQQFxIgsbDAULIAUpA0AgERDIASEKIAZBCHFFDQUgCCARIAprIgFBAWogCCABShshCAwFCyAIQQggCEEISxshCCAGQQhyIQZB+AAhAQsgBSkDQCARIAFBIHEQyQEhCiAGQQhxRQ0DIAUpA0BQDQMgAUEEdkHJGmohD0ECIQsMAwtBACEBIAxB/wFxIgdBB0sNBQJAAkACQAJAAkACQAJAIAdBAWsOBwECAwQMBQYACyAFKAJAIA42AgAMCwsgBSgCQCAONgIADAoLIAUoAkAgDqw3AwAMCQsgBSgCQCAOOwEADAgLIAUoAkAgDjoAAAwHCyAFKAJAIA42AgAMBgsgBSgCQCAOrDcDAAwFCyAFKQNAIRRByRoLIQ8gFCAREMoBIQoLIAZB//97cSAGIAhBf0obIQYgBSkDQCEUAn8CQCAIDQAgFFBFDQAgESEKQQAMAQsgCCAUUCARIApraiIBIAggAUobCyEICyAAQSAgCyAHIAprIgkgCCAIIAlIGyIHaiIMIA0gDSAMSBsiASAMIAYQxwEgACAPIAsQxAEgAEEwIAEgDCAGQYCABHMQxwEgAEEwIAcgCUEAEMcBIAAgCiAJEMQBIABBICABIAwgBkGAwABzEMcBDAELC0EAIQsMAQtBfyELCyAFQdAAaiQAIAsLFwAgAC0AAEEgcUUEQCABIAIgABBzGgsLSgEDfyAAKAIALAAAQVBqQQpJBEADQCAAKAIAIgEsAAAhAyAAIAFBAWo2AgAgAyACQQpsakFQaiECIAEsAAFBUGpBCkkNAAsLIAILpAIAAkACQCABQRRLDQAgAUF3aiIBQQlLDQACQAJAAkACQAJAAkACQAJAIAFBAWsOCQECCQMEBQYJBwALIAIgAigCACIBQQRqNgIAIAAgASgCADYCAA8LIAIgAigCACIBQQRqNgIAIAAgATQCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATUCADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATIBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATMBADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATAAADcDAA8LIAIgAigCACIBQQRqNgIAIAAgATEAADcDAA8LIAAgAkHWABEHAAsPCyACIAIoAgBBB2pBeHEiAUEIajYCACAAIAEpAwA3AwALewEBfyMAQYACayIFJAACQCACIANMDQAgBEGAwARxDQAgBSABIAIgA2siBEGAAiAEQYACSSIBGxCqBRogACAFIAEEfyAEBSACIANrIQEDQCAAIAVBgAIQxAEgBEGAfmoiBEH/AUsNAAsgAUH/AXELEMQBCyAFQYACaiQACy0AIABQRQRAA0AgAUF/aiIBIACnQQdxQTByOgAAIABCA4giAEIAUg0ACwsgAQs0ACAAUEUEQANAIAFBf2oiASAAp0EPcUGwHmotAAAgAnI6AAAgAEIEiCIAQgBSDQALCyABC4MBAgN/AX4CQCAAQoCAgIAQVARAIAAhBQwBCwNAIAFBf2oiASAAIABCCoAiBUIKfn2nQTByOgAAIABC/////58BViECIAUhACACDQALCyAFpyICBEADQCABQX9qIgEgAiACQQpuIgNBCmxrQTByOgAAIAJBCUshBCADIQIgBA0ACwsgAQsLACAAIAEgAhDCAQveFgMRfwJ+AXwjAEGwBGsiCSQAIAlBADYCLAJ/IAG9IhdCf1cEQCABmiIBvSEXQQEhE0HAHgwBCyAEQYAQcQRAQQEhE0HDHgwBC0HGHkHBHiAEQQFxIhMbCyEWAkAgF0KAgICAgICA+P8Ag0KAgICAgICA+P8AUQRAIABBICACIBNBA2oiDCAEQf//e3EQxwEgACAWIBMQxAEgAEHbHkHfHiAFQQV2QQFxIgMbQdMeQdceIAMbIAEgAWIbQQMQxAEMAQsgASAJQSxqEMEBIgEgAaAiAUQAAAAAAAAAAGIEQCAJIAkoAixBf2o2AiwLIAlBEGohESAFQSByIhJB4QBGBEAgFkEJaiAWIAVBIHEiDhshDwJAIANBC0sNAEEMIANrIgZFDQBEAAAAAAAAIEAhGQNAIBlEAAAAAAAAMECiIRkgBkF/aiIGDQALIA8tAABBLUYEQCAZIAGaIBmhoJohAQwBCyABIBmgIBmhIQELIBEgCSgCLCIGIAZBH3UiBmogBnOtIBEQygEiBkYEQCAJQTA6AA8gCUEPaiEGCyATQQJyIQ0gCSgCLCEIIAZBfmoiECAFQQ9qOgAAIAZBf2pBLUErIAhBAEgbOgAAIARBCHEhCCAJQRBqIQcDQCAHIgUCfyABmUQAAAAAAADgQWMEQCABqgwBC0GAgICAeAsiBkGwHmotAAAgDnI6AAAgASAGt6FEAAAAAAAAMECiIQECQCAFQQFqIgcgCUEQamtBAUcNAAJAIAgNACADQQBKDQAgAUQAAAAAAAAAAGENAQsgBUEuOgABIAVBAmohBwsgAUQAAAAAAAAAAGINAAsgAEEgIAIgDQJ/AkAgA0UNACAHIAlrQW5qIANODQAgAyARaiAQa0ECagwBCyARIAlBEGprIBBrIAdqCyIDaiIMIAQQxwEgACAPIA0QxAEgAEEwIAIgDCAEQYCABHMQxwEgACAJQRBqIAcgCUEQamsiBRDEASAAQTAgAyAFIBEgEGsiA2prQQBBABDHASAAIBAgAxDEAQwBCyADQQBIIQYCQCABRAAAAAAAAAAAYQRAIAkoAiwhCgwBCyAJIAkoAixBZGoiCjYCLCABRAAAAAAAALBBoiEBC0EGIAMgBhshCyAJQTBqIAlB0AJqIApBAEgbIg4hCANAIAgCfyABRAAAAAAAAPBBYyABRAAAAAAAAAAAZnEEQCABqwwBC0EACyIDNgIAIAhBBGohCCABIAO4oUQAAAAAZc3NQaIiAUQAAAAAAAAAAGINAAsCQCAKQQFIBEAgCCEGIA4hBwwBCyAOIQcDQCAKQR0gCkEdSBshDQJAIAhBfGoiBiAHSQ0AIA2tIRhCACEXA0AgBiAXQv////8PgyAGNQIAIBiGfCIXIBdCgJTr3AOAIhdCgJTr3AN+fT4CACAGQXxqIgYgB08NAAsgF6ciA0UNACAHQXxqIgcgAzYCAAsDQCAIIgYgB0sEQCAGQXxqIggoAgBFDQELCyAJIAkoAiwgDWsiCjYCLCAGIQggCkEASg0ACwsgCkF/TARAIAtBGWpBCW1BAWohFCASQeYARiEQA0BBCUEAIAprIApBd0gbIRUCQCAHIAZPBEAgByAHQQRqIAcoAgAbIQcMAQtBgJTr3AMgFXYhD0F/IBV0QX9zIQ1BACEKIAchCANAIAggCCgCACIDIBV2IApqNgIAIAMgDXEgD2whCiAIQQRqIgggBkkNAAsgByAHQQRqIAcoAgAbIQcgCkUNACAGIAo2AgAgBkEEaiEGCyAJIAkoAiwgFWoiCjYCLCAOIAcgEBsiAyAUQQJ0aiAGIAYgA2tBAnUgFEobIQYgCkEASA0ACwtBACEIAkAgByAGTw0AIA4gB2tBAnVBCWwhCEEKIQogBygCACIDQQpJDQADQCAIQQFqIQggAyAKQQpsIgpPDQALCyALQQAgCCASQeYARhtrIBJB5wBGIAtBAEdxayIDIAYgDmtBAnVBCWxBd2pIBEAgA0GAyABqIg1BCW0iA0ECdCAOakGEYGohDEEKIQogDSADQQlsa0EBaiIDQQhMBEADQCAKQQpsIQogA0EBaiIDQQlHDQALCwJAQQAgBiAMQQRqIhRGIAwoAgAiDyAPIApuIg0gCmxrIhAbDQBEAAAAAAAA4D9EAAAAAAAA8D9EAAAAAAAA+D8gECAKQQF2IgNGG0QAAAAAAAD4PyAGIBRGGyAQIANJGyEZRAEAAAAAAEBDRAAAAAAAAEBDIA1BAXEbIQECQCATRQ0AIBYtAABBLUcNACAZmiEZIAGaIQELIAwgDyAQayIDNgIAIAEgGaAgAWENACAMIAMgCmoiAzYCACADQYCU69wDTwRAA0AgDEEANgIAIAxBfGoiDCAHSQRAIAdBfGoiB0EANgIACyAMIAwoAgBBAWoiAzYCACADQf+T69wDSw0ACwsgDiAHa0ECdUEJbCEIQQohCiAHKAIAIgNBCkkNAANAIAhBAWohCCADIApBCmwiCk8NAAsLIAxBBGoiAyAGIAYgA0sbIQYLAn8DQEEAIAYiDSAHTQ0BGiANQXxqIgYoAgBFDQALQQELIQoCQCASQecARwRAIARBCHEhEgwBCyAIQX9zQX8gC0EBIAsbIgYgCEogCEF7SnEiAxsgBmohC0F/QX4gAxsgBWohBSAEQQhxIhINAEEJIQYCQCAKRQ0AIA1BfGooAgAiD0UNAEEKIQNBACEGIA9BCnANAANAIAZBAWohBiAPIANBCmwiA3BFDQALCyANIA5rQQJ1QQlsQXdqIQMgBUEgckHmAEYEQEEAIRIgCyADIAZrIgNBACADQQBKGyIDIAsgA0gbIQsMAQtBACESIAsgAyAIaiAGayIDQQAgA0EAShsiAyALIANIGyELCyALIBJyIhVBAEchECAAQSAgAgJ/IAhBACAIQQBKGyAFQSByIg9B5gBGDQAaIBEgCCAIQR91IgNqIANzrSAREMoBIgZrQQFMBEADQCAGQX9qIgZBMDoAACARIAZrQQJIDQALCyAGQX5qIhQgBToAACAGQX9qQS1BKyAIQQBIGzoAACARIBRrCyALIBNqIBBqakEBaiIMIAQQxwEgACAWIBMQxAEgAEEwIAIgDCAEQYCABHMQxwECQCAPQeYARgRAIAlBEGpBCHIhAyAJQRBqQQlyIQggDiAHIAcgDksbIgUhBwNAIAc1AgAgCBDKASEGAkAgBSAHRwRAIAYgCUEQak0NAQNAIAZBf2oiBkEwOgAAIAYgCUEQaksNAAsMAQsgBiAIRw0AIAlBMDoAGCADIQYLIAAgBiAIIAZrEMQBIAdBBGoiByAOTQ0ACyAVBEAgAEHjHkEBEMQBCwJAIAcgDU8NACALQQFIDQADQCAHNQIAIAgQygEiBiAJQRBqSwRAA0AgBkF/aiIGQTA6AAAgBiAJQRBqSw0ACwsgACAGIAtBCSALQQlIGxDEASALQXdqIQsgB0EEaiIHIA1PDQEgC0EASg0ACwsgAEEwIAtBCWpBCUEAEMcBDAELAkAgC0EASA0AIA0gB0EEaiAKGyEFIAlBEGpBCHIhAyAJQRBqQQlyIQ4gByEIA0AgDiAINQIAIA4QygEiBkYEQCAJQTA6ABggAyEGCwJAIAcgCEcEQCAGIAlBEGpNDQEDQCAGQX9qIgZBMDoAACAGIAlBEGpLDQALDAELIAAgBkEBEMQBIAZBAWohBiASRUEAIAtBAUgbDQAgAEHjHkEBEMQBCyAAIAYgDiAGayIGIAsgCyAGShsQxAEgCyAGayELIAhBBGoiCCAFTw0BIAtBf0oNAAsLIABBMCALQRJqQRJBABDHASAAIBQgESAUaxDEAQsLIABBICACIAwgBEGAwABzEMcBIAlBsARqJAAgAiAMIAwgAkgbCykAIAEgASgCAEEPakFwcSIBQRBqNgIAIAAgASkDACABKQMIEKoBOQMAC7oBAQJ/IwBBoAFrIgQkACAEQQhqQegeQZABEKkFGgJAAkAgAUF/akH/////B08EQCABDQFBASEBIARBnwFqIQALIAQgADYCNCAEIAA2AhwgBEF+IABrIgUgASABIAVLGyIBNgI4IAQgACABaiIANgIkIAQgADYCGCAEQQhqIAIgAxDLASEAIAFFDQEgBCgCHCIBIAEgBCgCGEZrQQA6AAAMAQtB0IcBQT02AgBBfyEACyAEQaABaiQAIAALNAEBfyAAKAIUIgMgASACIAAoAhAgA2siASABIAJLGyIBEKkFGiAAIAAoAhQgAWo2AhQgAgtjAQJ/IwBBEGsiAyQAIAMgAjYCDCADIAI2AghBfyEEAkBBAEEAIAEgAhDOASICQQBIDQAgACACQQFqIgIQoAUiADYCACAARQ0AIAAgAiABIAMoAgwQzgEhBAsgA0EQaiQAIAQLKgEBfyMAQRBrIgIkACACIAE2AgwgAEGgwAAgARC1ASEAIAJBEGokACAACy0BAX8jAEEQayICJAAgAiABNgIMIABB5ABBr8AAIAEQzgEhACACQRBqJAAgAAsdACAAQQBHIABBoBlHcSAAQbgZR3EEQCAAEKEFCwsjAQJ/IAAhAQNAIAEiAkEEaiEBIAIoAgANAAsgAiAAa0ECdQu3AwEFfyMAQRBrIgckAAJAAkACQAJAIAAEQCACQQRPDQEgAiEDDAILQQAhAiABKAIAIgAoAgAiA0UNAwNAQQEhBSADQYABTwRAQX8hBiAHQQxqIAMQvwEiBUF/Rg0FCyAAKAIEIQMgAEEEaiEAIAIgBWoiAiEGIAMNAAsMAwsgASgCACEFIAIhAwNAAn8gBSgCACIEQX9qQf8ATwRAIARFBEAgAEEAOgAAIAFBADYCAAwFC0F/IQYgACAEEL8BIgRBf0YNBSADIARrIQMgACAEagwBCyAAIAQ6AAAgA0F/aiEDIAEoAgAhBSAAQQFqCyEAIAEgBUEEaiIFNgIAIANBA0sNAAsLIAMEQCABKAIAIQUDQAJ/IAUoAgAiBEF/akH/AE8EQCAERQRAIABBADoAACABQQA2AgAMBQtBfyEGIAdBDGogBBC/ASIEQX9GDQUgAyAESQ0EIAAgBSgCABC/ARogAyAEayEDIAAgBGoMAQsgACAEOgAAIANBf2ohAyABKAIAIQUgAEEBagshACABIAVBBGoiBTYCACADDQALCyACIQYMAQsgAiADayEGCyAHQRBqJAAgBgvdAgEGfyMAQZACayIFJAAgBSABKAIAIgc2AgwgACAFQRBqIAAbIQYCQCADQYACIAAbIgNFDQAgB0UNAAJAIAMgAk0iBA0AIAJBIEsNAAwBCwNAIAIgAyACIAQbIgRrIQIgBiAFQQxqIAQQ1QEiBEF/RgRAQQAhAyAFKAIMIQdBfyEIDAILIAYgBCAGaiAGIAVBEGpGIgkbIQYgBCAIaiEIIAUoAgwhByADQQAgBCAJG2siA0UNASAHRQ0BIAIgA08iBA0AIAJBIU8NAAsLAkACQCAHRQ0AIANFDQAgAkUNAANAIAYgBygCABC/ASIJQQFqQQFNBEBBfyEEIAkNAyAFQQA2AgwMAgsgBSAFKAIMQQRqIgc2AgwgCCAJaiEIIAMgCWsiA0UNASAGIAlqIQYgCCEEIAJBf2oiAg0ACwwBCyAIIQQLIAAEQCABIAUoAgw2AgALIAVBkAJqJAAgBAu6CAEFfyABKAIAIQQCQAJAAkACQAJAAkACQAJ/AkACQCADRQ0AIAMoAgAiBkUNACAARQRAIAIhAwwECyADQQA2AgAgAiEDDAELAkACQEGMhwEoAgAoAgBFBEAgAEUNASACRQ0LIAIhBgNAIAQsAAAiAwRAIAAgA0H/vwNxNgIAIABBBGohACAEQQFqIQQgBkF/aiIGDQEMDQsLIABBADYCACABQQA2AgAgAiAGaw8LIAIhAyAARQ0BIAIhBUEADAMLIAQQIw8LQQEhBQwCC0EBCyEHA0AgB0UEQCAFRQ0IA0ACQAJAAkAgBC0AACIHQX9qIghB/gBLBEAgByEGIAUhAwwBCyAEQQNxDQEgBUEFSQ0BIAUgBUF7akF8cWtBfGohAwJAAkADQCAEKAIAIgZB//37d2ogBnJBgIGChHhxDQEgACAGQf8BcTYCACAAIAQtAAE2AgQgACAELQACNgIIIAAgBC0AAzYCDCAAQRBqIQAgBEEEaiEEIAVBfGoiBUEESw0ACyAELQAAIQYMAQsgBSEDCyAGQf8BcSIHQX9qIQgLIAhB/gBLDQEgAyEFCyAAIAc2AgAgAEEEaiEAIARBAWohBCAFQX9qIgUNAQwKCwsgB0G+fmoiB0EySw0EIARBAWohBCAHQQJ0QcAWaigCACEGQQEhBwwBCyAELQAAIgVBA3YiB0FwaiAHIAZBGnVqckEHSw0CAkACQAJ/IARBAWogBUGAf2ogBkEGdHIiBUF/Sg0AGiAELQABQYB/aiIHQT9LDQEgBEECaiAHIAVBBnRyIgVBf0oNABogBC0AAkGAf2oiB0E/Sw0BIAcgBUEGdHIhBSAEQQNqCyEEIAAgBTYCACADQX9qIQUgAEEEaiEADAELQdCHAUEZNgIAIARBf2ohBAwGC0EAIQcMAAALAAsDQCAFRQRAIAQtAABBA3YiBUFwaiAGQRp1IAVqckEHSw0CAn8gBEEBaiAGQYCAgBBxRQ0AGiAELQABQcABcUGAAUcNAyAEQQJqIAZBgIAgcUUNABogBC0AAkHAAXFBgAFHDQMgBEEDagshBCADQX9qIQNBASEFDAELA0ACQCAELQAAIgZBf2pB/gBLDQAgBEEDcQ0AIAQoAgAiBkH//ft3aiAGckGAgYKEeHENAANAIANBfGohAyAEKAIEIQYgBEEEaiIFIQQgBiAGQf/9+3dqckGAgYKEeHFFDQALIAUhBAsgBkH/AXEiBUF/akH+AE0EQCADQX9qIQMgBEEBaiEEDAELCyAFQb5+aiIFQTJLDQIgBEEBaiEEIAVBAnRBwBZqKAIAIQZBACEFDAAACwALIARBf2ohBCAGDQEgBC0AACEGCyAGQf8BcQ0AIAAEQCAAQQA2AgAgAUEANgIACyACIANrDwtB0IcBQRk2AgAgAEUNAQsgASAENgIAC0F/DwsgASAENgIAIAILjAMBBn8jAEGQCGsiBiQAIAYgASgCACIJNgIMIAAgBkEQaiAAGyEHAkAgA0GAAiAAGyIDRQ0AIAlFDQAgAkECdiIFIANPIQogAkGDAU1BACAFIANJGw0AA0AgAiADIAUgChsiBWshAiAHIAZBDGogBSAEENcBIgVBf0YEQEEAIQMgBigCDCEJQX8hCAwCCyAHIAcgBUECdGogByAGQRBqRiIKGyEHIAUgCGohCCAGKAIMIQkgA0EAIAUgChtrIgNFDQEgCUUNASACQQJ2IgUgA08hCiACQYMBSw0AIAUgA08NAAsLAkACQCAJRQ0AIANFDQAgAkUNAANAIAcgCSACIAQQmwEiBUECakECTQRAIAVBAWoiAkEBTQRAIAJBAWsNBCAGQQA2AgwMAwsgBEEANgIADAILIAYgBigCDCAFaiIJNgIMIAhBAWohCCADQX9qIgNFDQEgB0EEaiEHIAIgBWshAiAIIQUgAg0ACwwBCyAIIQULIAAEQCABIAYoAgw2AgALIAZBkAhqJAAgBQt8AQF/IwBBkAFrIgQkACAEIAA2AiwgBCAANgIEIARBADYCACAEQX82AkwgBEF/IABB/////wdqIABBAEgbNgIIIARCABCXASAEIAJBASADEJoBIQMgAQRAIAEgACAEKAIEIAQoAnhqIAQoAghrajYCAAsgBEGQAWokACADCw0AIAAgASACQn8Q2QELFgAgACABIAJCgICAgICAgICAfxDZAQsyAgF/AX0jAEEQayICJAAgAiAAIAFBABDdASACKQMAIAIpAwgQrwEhAyACQRBqJAAgAwufAQIBfwN+IwBBoAFrIgQkACAEQRBqQQBBkAEQqgUaIARBfzYCXCAEIAE2AjwgBEF/NgIYIAQgATYCFCAEQRBqQgAQlwEgBCAEQRBqIANBARCrASAEKQMIIQUgBCkDACEGIAIEQCACIAEgASAEKQOIASAEKAIUIAQoAhhrrHwiB6dqIAdQGzYCAAsgACAGNwMAIAAgBTcDCCAEQaABaiQACzICAX8BfCMAQRBrIgIkACACIAAgAUEBEN0BIAIpAwAgAikDCBCqASEDIAJBEGokACADCzkCAX8BfiMAQRBrIgMkACADIAEgAkECEN0BIAMpAwAhBCAAIAMpAwg3AwggACAENwMAIANBEGokAAs1AQF+IwBBEGsiAyQAIAMgASACEN8BIAMpAwAhBCAAIAMpAwg3AwggACAENwMAIANBEGokAAsHACAAEKEFC1QBAn8CQANAIAMgBEcEQEF/IQAgASACRg0CIAEsAAAiBSADLAAAIgZIDQIgBiAFSARAQQEPBSADQQFqIQMgAUEBaiEBDAILAAsLIAEgAkchAAsgAAsZACAAQgA3AgAgAEEANgIIIAAgAiADEOQBC7oBAQR/IwBBEGsiBSQAIAIgAWsiBEFvTQRAAkAgBEEKTQRAIAAgBDoACyAAIQMMAQsgACAEQQtPBH8gBEEQakFwcSIDIANBf2oiAyADQQtGGwVBCgtBAWoiBhDCBCIDNgIAIAAgBkGAgICAeHI2AgggACAENgIECwNAIAEgAkcEQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohAQwBCwsgBUEAOgAPIAMgBS0ADzoAACAFQRBqJAAPCxDYBAALQAEBf0EAIQADfyABIAJGBH8gAAUgASwAACAAQQR0aiIAQYCAgIB/cSIDQRh2IANyIABzIQAgAUEBaiEBDAELCwtUAQJ/AkADQCADIARHBEBBfyEAIAEgAkYNAiABKAIAIgUgAygCACIGSA0CIAYgBUgEQEEBDwUgA0EEaiEDIAFBBGohAQwCCwALCyABIAJHIQALIAALGQAgAEIANwIAIABBADYCCCAAIAIgAxDoAQvBAQEEfyMAQRBrIgUkACACIAFrQQJ1IgRB7////wNNBEACQCAEQQFNBEAgACAEOgALIAAhAwwBCyAAIARBAk8EfyAEQQRqQXxxIgMgA0F/aiIDIANBAkYbBUEBC0EBaiIGEM0EIgM2AgAgACAGQYCAgIB4cjYCCCAAIAQ2AgQLA0AgASACRwRAIAMgASgCADYCACADQQRqIQMgAUEEaiEBDAELCyAFQQA2AgwgAyAFKAIMNgIAIAVBEGokAA8LENgEAAtAAQF/QQAhAAN/IAEgAkYEfyAABSABKAIAIABBBHRqIgBBgICAgH9xIgNBGHYgA3IgAHMhACABQQRqIQEMAQsLC/oCAQJ/IwBBIGsiBiQAIAYgATYCGAJAIAMoAgRBAXFFBEAgBkF/NgIAIAYgACABIAIgAyAEIAYgACgCACgCEBELACIBNgIYIAYoAgAiAEEBTQRAIABBAWsEQCAFQQA6AAAMAwsgBUEBOgAADAILIAVBAToAACAEQQQ2AgAMAQsgBiADKAIcIgA2AgAgACAAKAIEQQFqNgIEIAYQQyEHAn8gBigCACIAIAAoAgRBf2oiATYCBCABQX9GCwRAIAAgACgCACgCCBEMAAsgBiADKAIcIgA2AgAgACAAKAIEQQFqNgIEIAYQ6wEhAAJ/IAYoAgAiASABKAIEQX9qIgM2AgQgA0F/RgsEQCABIAEoAgAoAggRDAALIAYgACAAKAIAKAIYEQcAIAZBDHIgACAAKAIAKAIcEQcAIAUgBkEYaiACIAYgBkEYaiIDIAcgBEEBEOwBIAZGOgAAIAYoAhghAQNAIANBdGoQ2wQiAyAGRw0ACwsgBkEgaiQAIAELCwAgAEHkogEQ7QEL0gUBC38jAEGAAWsiCCQAIAggATYCeCADIAJrQQxtIQkgCEHYADYCECAIQQhqQQAgCEEQahDuASEMIAhBEGohCgJAIAlB5QBPBEAgCRCgBSIKRQ0BIAwoAgAhASAMIAo2AgAgAQRAIAEgDCgCBBEMAAsLIAohByACIQEDQCABIANGBEADQAJAIAlBACAAIAhB+ABqEEQbRQRAIAAgCEH4AGoQRwRAIAUgBSgCAEECcjYCAAsMAQsgABBFIQ0gBkUEQCAEIA0gBCgCACgCDBEBACENCyAOQQFqIQ9BACEQIAohByACIQEDQCABIANGBEAgDyEOIBBFDQMgABBGGiAKIQcgAiEBIAkgC2pBAkkNAwNAIAEgA0YNBAJAIActAABBAkcNAAJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLIA5GDQAgB0EAOgAAIAtBf2ohCwsgB0EBaiEHIAFBDGohAQwAAAsABQJAIActAABBAUcNAAJ/IAEsAAtBAEgEQCABKAIADAELIAELIA5qLAAAIRECQCANQf8BcSAGBH8gEQUgBCARIAQoAgAoAgwRAQALQf8BcUYEQEEBIRACfyABLAALQQBIBEAgASgCBAwBCyABLQALCyAPRw0CIAdBAjoAACALQQFqIQsMAQsgB0EAOgAACyAJQX9qIQkLIAdBAWohByABQQxqIQEMAQsAAAsACwsCQAJAA0AgAiADRg0BIAotAABBAkcEQCAKQQFqIQogAkEMaiECDAELCyACIQMMAQsgBSAFKAIAQQRyNgIACyAMIgAoAgAhASAAQQA2AgAgAQRAIAEgACgCBBEMAAsgCEGAAWokACADDwUCQAJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLBEAgB0EBOgAADAELIAdBAjoAACALQQFqIQsgCUF/aiEJCyAHQQFqIQcgAUEMaiEBDAELAAALAAsQ0wQACx4AIAAoAgAhACABEMkDIQEgACgCECABQQJ0aigCAAs0AQF/IwBBEGsiAyQAIAMgATYCDCAAIANBDGooAgA2AgAgACACKAIANgIEIANBEGokACAACw8AIAEgAiADIAQgBRDwAQvGBAECfyMAQZACayIFJAAgBSABNgKAAiAFIAA2AogCIAIQ8QEhBiAFQdABaiACIAVB/wFqEPIBIAVBwAFqEPMBIgAgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEKCxD0ASAFAn8gACwAC0EASARAIAAoAgAMAQsgAAsiATYCvAEgBSAFQRBqNgIMIAVBADYCCANAAkAgBUGIAmogBUGAAmoQREUNACAFKAK8AQJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLIAFqRgRAAn8gACIBLAALQQBIBEAgASgCBAwBCyABLQALCyECIAECfyABLAALQQBIBEAgASgCBAwBCyABLQALC0EBdBD0ASABIAEsAAtBAEgEfyABKAIIQf////8HcUF/agVBCgsQ9AEgBSACAn8gASwAC0EASARAIAAoAgAMAQsgAAsiAWo2ArwBCyAFQYgCahBFIAYgASAFQbwBaiAFQQhqIAUsAP8BIAVB0AFqIAVBEGogBUEMakGgPhD1AQ0AIAVBiAJqEEYaDAELCwJAAn8gBSwA2wFBAEgEQCAFKALUAQwBCyAFLQDbAQtFDQAgBSgCDCICIAVBEGprQZ8BSg0AIAUgAkEEajYCDCACIAUoAgg2AgALIAQgASAFKAK8ASADIAYQ9gE2AgAgBUHQAWogBUEQaiAFKAIMIAMQ9wEgBUGIAmogBUGAAmoQRwRAIAMgAygCAEECcjYCAAsgBSgCiAIhASAAENsEGiAFQdABahDbBBogBUGQAmokACABCy4AAkAgACgCBEHKAHEiAARAIABBwABGBEBBCA8LIABBCEcNAUEQDwtBAA8LQQoLhAEBAX8jAEEQayIDJAAgAyABKAIcIgE2AgggASABKAIEQQFqNgIEIAIgA0EIahDrASIBIgIgAigCACgCEBEAADoAACAAIAEgASgCACgCFBEHAAJ/IAMoAggiACAAKAIEQX9qIgE2AgQgAUF/RgsEQCAAIAAoAgAoAggRDAALIANBEGokAAsXACAAQgA3AgAgAEEANgIIIAAQkgIgAAsJACAAIAEQ3gQLhgMBA38jAEEQayIKJAAgCiAAOgAPAkACQAJAAkAgAygCACACRw0AIABB/wFxIgsgCS0AGEYiDEUEQCAJLQAZIAtHDQELIAMgAkEBajYCACACQStBLSAMGzoAAAwBCwJ/IAYsAAtBAEgEQCAGKAIEDAELIAYtAAsLRQ0BIAAgBUcNAUEAIQAgCCgCACIBIAdrQZ8BSg0CIAQoAgAhACAIIAFBBGo2AgAgASAANgIAC0EAIQAgBEEANgIADAELQX8hACAJIAlBGmogCkEPahCTAiAJayIFQRdKDQACQCABQXhqIgZBAksEQCABQRBHDQEgBUEWSA0BIAMoAgAiASACRg0CIAEgAmtBAkoNAiABQX9qLQAAQTBHDQJBACEAIARBADYCACADIAFBAWo2AgAgASAFQaA+ai0AADoAAAwCCyAGQQFrRQ0AIAUgAU4NAQsgAyADKAIAIgBBAWo2AgAgACAFQaA+ai0AADoAACAEIAQoAgBBAWo2AgBBACEACyAKQRBqJAAgAAu6AQICfwF+IwBBEGsiBCQAAn8gACABRwRAAkBB0IcBKAIAIQVB0IcBQQA2AgAgACAEQQxqIAMQkAIQ2wEhBkHQhwEoAgAiAEUEQEHQhwEgBTYCAAsgASAEKAIMRw0AAkACQCAAQcQARg0AIAZCgICAgHhTDQAgBkL/////B1cNAQsgAkEENgIAQf////8HIAZCAVkNAxpBgICAgHgMAwsgBqcMAgsLIAJBBDYCAEEACyEAIARBEGokACAAC+QBAQJ/AkACfyAALAALQQBIBEAgACgCBAwBCyAALQALC0UNACABIAIQywIgAkF8aiEEAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwsCfyAALAALQQBIBEAgACgCAAwBCyAACyICaiEFA0ACQCACLAAAIQAgASAETw0AAkAgAEEBSA0AIABB/wBODQAgASgCACACLAAARg0AIANBBDYCAA8LIAJBAWogAiAFIAJrQQFKGyECIAFBBGohAQwBCwsgAEEBSA0AIABB/wBODQAgBCgCAEF/aiACLAAASQ0AIANBBDYCAAsLDwAgASACIAMgBCAFEPkBC8YEAQJ/IwBBkAJrIgUkACAFIAE2AoACIAUgADYCiAIgAhDxASEGIAVB0AFqIAIgBUH/AWoQ8gEgBUHAAWoQ8wEiACAALAALQQBIBH8gACgCCEH/////B3FBf2oFQQoLEPQBIAUCfyAALAALQQBIBEAgACgCAAwBCyAACyIBNgK8ASAFIAVBEGo2AgwgBUEANgIIA0ACQCAFQYgCaiAFQYACahBERQ0AIAUoArwBAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwsgAWpGBEACfyAAIgEsAAtBAEgEQCABKAIEDAELIAEtAAsLIQIgAQJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLQQF0EPQBIAEgASwAC0EASAR/IAEoAghB/////wdxQX9qBUEKCxD0ASAFIAICfyABLAALQQBIBEAgACgCAAwBCyAACyIBajYCvAELIAVBiAJqEEUgBiABIAVBvAFqIAVBCGogBSwA/wEgBUHQAWogBUEQaiAFQQxqQaA+EPUBDQAgBUGIAmoQRhoMAQsLAkACfyAFLADbAUEASARAIAUoAtQBDAELIAUtANsBC0UNACAFKAIMIgIgBUEQamtBnwFKDQAgBSACQQRqNgIMIAIgBSgCCDYCAAsgBCABIAUoArwBIAMgBhD6ATcDACAFQdABaiAFQRBqIAUoAgwgAxD3ASAFQYgCaiAFQYACahBHBEAgAyADKAIAQQJyNgIACyAFKAKIAiEBIAAQ2wQaIAVB0AFqENsEGiAFQZACaiQAIAELzAECAn8BfiMAQRBrIgQkAAJAIAAgAUcEQAJAQdCHASgCACEFQdCHAUEANgIAIAAgBEEMaiADEJACENsBIQZB0IcBKAIAIgBFBEBB0IcBIAU2AgALIAEgBCgCDEcNAAJAIABBxABGDQAgBkKAgICAgICAgIB/Uw0AQv///////////wAgBlkNAwsgAkEENgIAIAZCAVkEQEL///////////8AIQYMAwtCgICAgICAgICAfyEGDAILCyACQQQ2AgBCACEGCyAEQRBqJAAgBgsPACABIAIgAyAEIAUQ/AELxgQBAn8jAEGQAmsiBSQAIAUgATYCgAIgBSAANgKIAiACEPEBIQYgBUHQAWogAiAFQf8BahDyASAFQcABahDzASIAIAAsAAtBAEgEfyAAKAIIQf////8HcUF/agVBCgsQ9AEgBQJ/IAAsAAtBAEgEQCAAKAIADAELIAALIgE2ArwBIAUgBUEQajYCDCAFQQA2AggDQAJAIAVBiAJqIAVBgAJqEERFDQAgBSgCvAECfyAALAALQQBIBEAgACgCBAwBCyAALQALCyABakYEQAJ/IAAiASwAC0EASARAIAEoAgQMAQsgAS0ACwshAiABAn8gASwAC0EASARAIAEoAgQMAQsgAS0ACwtBAXQQ9AEgASABLAALQQBIBH8gASgCCEH/////B3FBf2oFQQoLEPQBIAUgAgJ/IAEsAAtBAEgEQCAAKAIADAELIAALIgFqNgK8AQsgBUGIAmoQRSAGIAEgBUG8AWogBUEIaiAFLAD/ASAFQdABaiAFQRBqIAVBDGpBoD4Q9QENACAFQYgCahBGGgwBCwsCQAJ/IAUsANsBQQBIBEAgBSgC1AEMAQsgBS0A2wELRQ0AIAUoAgwiAiAFQRBqa0GfAUoNACAFIAJBBGo2AgwgAiAFKAIINgIACyAEIAEgBSgCvAEgAyAGEP0BOwEAIAVB0AFqIAVBEGogBSgCDCADEPcBIAVBiAJqIAVBgAJqEEcEQCADIAMoAgBBAnI2AgALIAUoAogCIQEgABDbBBogBUHQAWoQ2wQaIAVBkAJqJAAgAQvJAQIDfwF+IwBBEGsiBCQAAn8gACABRwRAAkACQCAALQAAIgVBLUcNACAAQQFqIgAgAUcNAAwBC0HQhwEoAgAhBkHQhwFBADYCACAAIARBDGogAxCQAhDaASEHQdCHASgCACIARQRAQdCHASAGNgIACyABIAQoAgxHDQAgAEHEAEdBACAHQv//A1gbRQRAIAJBBDYCAEH//wMMAwtBACAHpyIAayAAIAVBLUYbDAILCyACQQQ2AgBBAAshACAEQRBqJAAgAEH//wNxCw8AIAEgAiADIAQgBRD/AQvGBAECfyMAQZACayIFJAAgBSABNgKAAiAFIAA2AogCIAIQ8QEhBiAFQdABaiACIAVB/wFqEPIBIAVBwAFqEPMBIgAgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEKCxD0ASAFAn8gACwAC0EASARAIAAoAgAMAQsgAAsiATYCvAEgBSAFQRBqNgIMIAVBADYCCANAAkAgBUGIAmogBUGAAmoQREUNACAFKAK8AQJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLIAFqRgRAAn8gACIBLAALQQBIBEAgASgCBAwBCyABLQALCyECIAECfyABLAALQQBIBEAgASgCBAwBCyABLQALC0EBdBD0ASABIAEsAAtBAEgEfyABKAIIQf////8HcUF/agVBCgsQ9AEgBSACAn8gASwAC0EASARAIAAoAgAMAQsgAAsiAWo2ArwBCyAFQYgCahBFIAYgASAFQbwBaiAFQQhqIAUsAP8BIAVB0AFqIAVBEGogBUEMakGgPhD1AQ0AIAVBiAJqEEYaDAELCwJAAn8gBSwA2wFBAEgEQCAFKALUAQwBCyAFLQDbAQtFDQAgBSgCDCICIAVBEGprQZ8BSg0AIAUgAkEEajYCDCACIAUoAgg2AgALIAQgASAFKAK8ASADIAYQgAI2AgAgBUHQAWogBUEQaiAFKAIMIAMQ9wEgBUGIAmogBUGAAmoQRwRAIAMgAygCAEECcjYCAAsgBSgCiAIhASAAENsEGiAFQdABahDbBBogBUGQAmokACABC8QBAgN/AX4jAEEQayIEJAACfyAAIAFHBEACQAJAIAAtAAAiBUEtRw0AIABBAWoiACABRw0ADAELQdCHASgCACEGQdCHAUEANgIAIAAgBEEMaiADEJACENoBIQdB0IcBKAIAIgBFBEBB0IcBIAY2AgALIAEgBCgCDEcNACAAQcQAR0EAIAdC/////w9YG0UEQCACQQQ2AgBBfwwDC0EAIAenIgBrIAAgBUEtRhsMAgsLIAJBBDYCAEEACyEAIARBEGokACAACw8AIAEgAiADIAQgBRCCAgvGBAECfyMAQZACayIFJAAgBSABNgKAAiAFIAA2AogCIAIQ8QEhBiAFQdABaiACIAVB/wFqEPIBIAVBwAFqEPMBIgAgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEKCxD0ASAFAn8gACwAC0EASARAIAAoAgAMAQsgAAsiATYCvAEgBSAFQRBqNgIMIAVBADYCCANAAkAgBUGIAmogBUGAAmoQREUNACAFKAK8AQJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLIAFqRgRAAn8gACIBLAALQQBIBEAgASgCBAwBCyABLQALCyECIAECfyABLAALQQBIBEAgASgCBAwBCyABLQALC0EBdBD0ASABIAEsAAtBAEgEfyABKAIIQf////8HcUF/agVBCgsQ9AEgBSACAn8gASwAC0EASARAIAAoAgAMAQsgAAsiAWo2ArwBCyAFQYgCahBFIAYgASAFQbwBaiAFQQhqIAUsAP8BIAVB0AFqIAVBEGogBUEMakGgPhD1AQ0AIAVBiAJqEEYaDAELCwJAAn8gBSwA2wFBAEgEQCAFKALUAQwBCyAFLQDbAQtFDQAgBSgCDCICIAVBEGprQZ8BSg0AIAUgAkEEajYCDCACIAUoAgg2AgALIAQgASAFKAK8ASADIAYQgwI3AwAgBUHQAWogBUEQaiAFKAIMIAMQ9wEgBUGIAmogBUGAAmoQRwRAIAMgAygCAEECcjYCAAsgBSgCiAIhASAAENsEGiAFQdABahDbBBogBUGQAmokACABC70BAgN/AX4jAEEQayIEJAACfiAAIAFHBEACQAJAIAAtAAAiBUEtRw0AIABBAWoiACABRw0ADAELQdCHASgCACEGQdCHAUEANgIAIAAgBEEMaiADEJACENoBIQdB0IcBKAIAIgBFBEBB0IcBIAY2AgALIAEgBCgCDEcNACAAQcQAR0EAQn8gB1obRQRAIAJBBDYCAEJ/DAMLQgAgB30gByAFQS1GGwwCCwsgAkEENgIAQgALIQcgBEEQaiQAIAcLDwAgASACIAMgBCAFEIUCC/EEAQF/IwBBkAJrIgUkACAFIAE2AoACIAUgADYCiAIgBUHQAWogAiAFQeABaiAFQd8BaiAFQd4BahCGAiAFQcABahDzASIBIAEsAAtBAEgEfyABKAIIQf////8HcUF/agVBCgsQ9AEgBQJ/IAEsAAtBAEgEQCABKAIADAELIAELIgA2ArwBIAUgBUEQajYCDCAFQQA2AgggBUEBOgAHIAVBxQA6AAYDQAJAIAVBiAJqIAVBgAJqEERFDQAgBSgCvAECfyABLAALQQBIBEAgASgCBAwBCyABLQALCyAAakYEQAJ/IAEiACwAC0EASARAIAAoAgQMAQsgAC0ACwshAiAAAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwtBAXQQ9AEgACAALAALQQBIBH8gACgCCEH/////B3FBf2oFQQoLEPQBIAUgAgJ/IAAsAAtBAEgEQCABKAIADAELIAELIgBqNgK8AQsgBUGIAmoQRSAFQQdqIAVBBmogACAFQbwBaiAFLADfASAFLADeASAFQdABaiAFQRBqIAVBDGogBUEIaiAFQeABahCHAg0AIAVBiAJqEEYaDAELCwJAAn8gBSwA2wFBAEgEQCAFKALUAQwBCyAFLQDbAQtFDQAgBS0AB0UNACAFKAIMIgIgBUEQamtBnwFKDQAgBSACQQRqNgIMIAIgBSgCCDYCAAsgBCAAIAUoArwBIAMQiAI4AgAgBUHQAWogBUEQaiAFKAIMIAMQ9wEgBUGIAmogBUGAAmoQRwRAIAMgAygCAEECcjYCAAsgBSgCiAIhACABENsEGiAFQdABahDbBBogBUGQAmokACAAC7MBAQF/IwBBEGsiBSQAIAUgASgCHCIBNgIIIAEgASgCBEEBajYCBCAFQQhqEEMiAUGgPkHAPiACIAEoAgAoAiARDQAaIAMgBUEIahDrASIBIgIgAigCACgCDBEAADoAACAEIAEgASgCACgCEBEAADoAACAAIAEgASgCACgCFBEHAAJ/IAUoAggiACAAKAIEQX9qIgE2AgQgAUF/RgsEQCAAIAAoAgAoAggRDAALIAVBEGokAAvSBAEBfyMAQRBrIgwkACAMIAA6AA8CQAJAIAAgBUYEQCABLQAARQ0BQQAhACABQQA6AAAgBCAEKAIAIgFBAWo2AgAgAUEuOgAAAn8gBywAC0EASARAIAcoAgQMAQsgBy0ACwtFDQIgCSgCACIBIAhrQZ8BSg0CIAooAgAhAiAJIAFBBGo2AgAgASACNgIADAILAkAgACAGRw0AAn8gBywAC0EASARAIAcoAgQMAQsgBy0ACwtFDQAgAS0AAEUNAUEAIQAgCSgCACIBIAhrQZ8BSg0CIAooAgAhACAJIAFBBGo2AgAgASAANgIAQQAhACAKQQA2AgAMAgtBfyEAIAsgC0EgaiAMQQ9qEJMCIAtrIgZBH0oNASAGQaA+ai0AACEFIAZBamoiAEEDTQRAAkACQCAAQQJrDgIAAAELIAMgBCgCACIBRwRAQX8hACABQX9qLQAAQd8AcSACLQAAQf8AcUcNBAsgBCABQQFqNgIAIAEgBToAAEEAIQAMAwsgAkHQADoAACAEIAQoAgAiAEEBajYCACAAIAU6AABBACEADAILAkAgAiwAACIAIAVB3wBxRw0AIAIgAEGAAXI6AAAgAS0AAEUNACABQQA6AAACfyAHLAALQQBIBEAgBygCBAwBCyAHLQALC0UNACAJKAIAIgAgCGtBnwFKDQAgCigCACEBIAkgAEEEajYCACAAIAE2AgALIAQgBCgCACIAQQFqNgIAIAAgBToAAEEAIQAgBkEVSg0BIAogCigCAEEBajYCAAwBC0F/IQALIAxBEGokACAAC4oBAgN/An0jAEEQayIDJAACQCAAIAFHBEBB0IcBKAIAIQRB0IcBQQA2AgAgA0EMaiEFEJACGiAAIAUQ3AEhBkHQhwEoAgAiAEUEQEHQhwEgBDYCAAsgASADKAIMRgRAIAYhByAAQcQARw0CCyACQQQ2AgAgByEGDAELIAJBBDYCAAsgA0EQaiQAIAYLDwAgASACIAMgBCAFEIoCC/EEAQF/IwBBkAJrIgUkACAFIAE2AoACIAUgADYCiAIgBUHQAWogAiAFQeABaiAFQd8BaiAFQd4BahCGAiAFQcABahDzASIBIAEsAAtBAEgEfyABKAIIQf////8HcUF/agVBCgsQ9AEgBQJ/IAEsAAtBAEgEQCABKAIADAELIAELIgA2ArwBIAUgBUEQajYCDCAFQQA2AgggBUEBOgAHIAVBxQA6AAYDQAJAIAVBiAJqIAVBgAJqEERFDQAgBSgCvAECfyABLAALQQBIBEAgASgCBAwBCyABLQALCyAAakYEQAJ/IAEiACwAC0EASARAIAAoAgQMAQsgAC0ACwshAiAAAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwtBAXQQ9AEgACAALAALQQBIBH8gACgCCEH/////B3FBf2oFQQoLEPQBIAUgAgJ/IAAsAAtBAEgEQCABKAIADAELIAELIgBqNgK8AQsgBUGIAmoQRSAFQQdqIAVBBmogACAFQbwBaiAFLADfASAFLADeASAFQdABaiAFQRBqIAVBDGogBUEIaiAFQeABahCHAg0AIAVBiAJqEEYaDAELCwJAAn8gBSwA2wFBAEgEQCAFKALUAQwBCyAFLQDbAQtFDQAgBS0AB0UNACAFKAIMIgIgBUEQamtBnwFKDQAgBSACQQRqNgIMIAIgBSgCCDYCAAsgBCAAIAUoArwBIAMQiwI5AwAgBUHQAWogBUEQaiAFKAIMIAMQ9wEgBUGIAmogBUGAAmoQRwRAIAMgAygCAEECcjYCAAsgBSgCiAIhACABENsEGiAFQdABahDbBBogBUGQAmokACAAC4oBAgN/AnwjAEEQayIDJAACQCAAIAFHBEBB0IcBKAIAIQRB0IcBQQA2AgAgA0EMaiEFEJACGiAAIAUQ3gEhBkHQhwEoAgAiAEUEQEHQhwEgBDYCAAsgASADKAIMRgRAIAYhByAAQcQARw0CCyACQQQ2AgAgByEGDAELIAJBBDYCAAsgA0EQaiQAIAYLDwAgASACIAMgBCAFEI0CC4gFAgF/AX4jAEGgAmsiBSQAIAUgATYCkAIgBSAANgKYAiAFQeABaiACIAVB8AFqIAVB7wFqIAVB7gFqEIYCIAVB0AFqEPMBIgEgASwAC0EASAR/IAEoAghB/////wdxQX9qBUEKCxD0ASAFAn8gASwAC0EASARAIAEoAgAMAQsgAQsiADYCzAEgBSAFQSBqNgIcIAVBADYCGCAFQQE6ABcgBUHFADoAFgNAAkAgBUGYAmogBUGQAmoQREUNACAFKALMAQJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLIABqRgRAAn8gASIALAALQQBIBEAgACgCBAwBCyAALQALCyECIAACfyAALAALQQBIBEAgACgCBAwBCyAALQALC0EBdBD0ASAAIAAsAAtBAEgEfyAAKAIIQf////8HcUF/agVBCgsQ9AEgBSACAn8gACwAC0EASARAIAEoAgAMAQsgAQsiAGo2AswBCyAFQZgCahBFIAVBF2ogBUEWaiAAIAVBzAFqIAUsAO8BIAUsAO4BIAVB4AFqIAVBIGogBUEcaiAFQRhqIAVB8AFqEIcCDQAgBUGYAmoQRhoMAQsLAkACfyAFLADrAUEASARAIAUoAuQBDAELIAUtAOsBC0UNACAFLQAXRQ0AIAUoAhwiAiAFQSBqa0GfAUoNACAFIAJBBGo2AhwgAiAFKAIYNgIACyAFIAAgBSgCzAEgAxCOAiAFKQMAIQYgBCAFKQMINwMIIAQgBjcDACAFQeABaiAFQSBqIAUoAhwgAxD3ASAFQZgCaiAFQZACahBHBEAgAyADKAIAQQJyNgIACyAFKAKYAiEAIAEQ2wQaIAVB4AFqENsEGiAFQaACaiQAIAALpAECAn8EfiMAQSBrIgQkAAJAIAEgAkcEQEHQhwEoAgAhBUHQhwFBADYCACAEIAEgBEEcahDQBCAEKQMIIQYgBCkDACEHQdCHASgCACIBRQRAQdCHASAFNgIACyACIAQoAhxGBEAgByEIIAYhCSABQcQARw0CCyADQQQ2AgAgCCEHIAkhBgwBCyADQQQ2AgALIAAgBzcDACAAIAY3AwggBEEgaiQAC+wEAQF/IwBBkAJrIgAkACAAIAI2AoACIAAgATYCiAIgAEHQAWoQ8wEhBiAAIAMoAhwiATYCECABIAEoAgRBAWo2AgQgAEEQahBDIgFBoD5Buj4gAEHgAWogASgCACgCIBENABoCfyAAKAIQIgEgASgCBEF/aiICNgIEIAJBf0YLBEAgASABKAIAKAIIEQwACyAAQcABahDzASICIAIsAAtBAEgEfyACKAIIQf////8HcUF/agVBCgsQ9AEgAAJ/IAIsAAtBAEgEQCACKAIADAELIAILIgE2ArwBIAAgAEEQajYCDCAAQQA2AggDQAJAIABBiAJqIABBgAJqEERFDQAgACgCvAECfyACLAALQQBIBEAgAigCBAwBCyACLQALCyABakYEQAJ/IAIiASwAC0EASARAIAEoAgQMAQsgAS0ACwshAyABAn8gASwAC0EASARAIAEoAgQMAQsgAS0ACwtBAXQQ9AEgASABLAALQQBIBH8gASgCCEH/////B3FBf2oFQQoLEPQBIAAgAwJ/IAEsAAtBAEgEQCACKAIADAELIAILIgFqNgK8AQsgAEGIAmoQRUEQIAEgAEG8AWogAEEIakEAIAYgAEEQaiAAQQxqIABB4AFqEPUBDQAgAEGIAmoQRhoMAQsLIAIgACgCvAEgAWsQ9AECfyACLAALQQBIBEAgAigCAAwBCyACCyEBEJACIQMgACAFNgIAIAEgAyAAEJECQQFHBEAgBEEENgIACyAAQYgCaiAAQYACahBHBEAgBCAEKAIAQQJyNgIACyAAKAKIAiEBIAIQ2wQaIAYQ2wQaIABBkAJqJAAgAQtMAAJAQZSiAS0AAEEBcQ0AQZSiAS0AAEEAR0EBc0UNAEGQogEQvgE2AgBBlKIBQQA2AgBBlKIBQZSiASgCAEEBcjYCAAtBkKIBKAIAC2kBAX8jAEEQayIDJAAgAyABNgIMIAMgAjYCCCADIANBDGoQlAIhASAAQcE+IAMoAggQtQEhAiABKAIAIgAEQEGMhwEoAgAaIAAEQEGMhwFBwKABIAAgAEF/Rhs2AgALCyADQRBqJAAgAgstAQF/IAAhAUEAIQADQCAAQQNHBEAgASAAQQJ0akEANgIAIABBAWohAAwBCwsLMgAgAi0AACECA0ACQCAAIAFHBH8gAC0AACACRw0BIAAFIAELDwsgAEEBaiEADAAACwALPQEBf0GMhwEoAgAhAiABKAIAIgEEQEGMhwFBwKABIAEgAUF/Rhs2AgALIABBfyACIAJBwKABRhs2AgAgAAv6AgECfyMAQSBrIgYkACAGIAE2AhgCQCADKAIEQQFxRQRAIAZBfzYCACAGIAAgASACIAMgBCAGIAAoAgAoAhARCwAiATYCGCAGKAIAIgBBAU0EQCAAQQFrBEAgBUEAOgAADAMLIAVBAToAAAwCCyAFQQE6AAAgBEEENgIADAELIAYgAygCHCIANgIAIAAgACgCBEEBajYCBCAGEE4hBwJ/IAYoAgAiACAAKAIEQX9qIgE2AgQgAUF/RgsEQCAAIAAoAgAoAggRDAALIAYgAygCHCIANgIAIAAgACgCBEEBajYCBCAGEJYCIQACfyAGKAIAIgEgASgCBEF/aiIDNgIEIANBf0YLBEAgASABKAIAKAIIEQwACyAGIAAgACgCACgCGBEHACAGQQxyIAAgACgCACgCHBEHACAFIAZBGGogAiAGIAZBGGoiAyAHIARBARCXAiAGRjoAACAGKAIYIQEDQCADQXRqENsEIgMgBkcNAAsLIAZBIGokACABCwsAIABB7KIBEO0BC/UFAQt/IwBBgAFrIggkACAIIAE2AnggAyACa0EMbSEJIAhB2AA2AhAgCEEIakEAIAhBEGoQ7gEhDCAIQRBqIQoCQCAJQeUATwRAIAkQoAUiCkUNASAMKAIAIQEgDCAKNgIAIAEEQCABIAwoAgQRDAALCyAKIQcgAiEBA0AgASADRgRAA0ACQCAJQQAgACAIQfgAahBPG0UEQCAAIAhB+ABqEFEEQCAFIAUoAgBBAnI2AgALDAELAn8gACgCACIHKAIMIgEgBygCEEYEQCAHIAcoAgAoAiQRAAAMAQsgASgCAAshDSAGRQRAIAQgDSAEKAIAKAIcEQEAIQ0LIA5BAWohD0EAIRAgCiEHIAIhAQNAIAEgA0YEQCAPIQ4gEEUNAyAAEFAaIAohByACIQEgCSALakECSQ0DA0AgASADRg0EAkAgBy0AAEECRw0AAn8gASwAC0EASARAIAEoAgQMAQsgAS0ACwsgDkYNACAHQQA6AAAgC0F/aiELCyAHQQFqIQcgAUEMaiEBDAAACwAFAkAgBy0AAEEBRw0AAn8gASwAC0EASARAIAEoAgAMAQsgAQsgDkECdGooAgAhEQJAIAYEfyARBSAEIBEgBCgCACgCHBEBAAsgDUYEQEEBIRACfyABLAALQQBIBEAgASgCBAwBCyABLQALCyAPRw0CIAdBAjoAACALQQFqIQsMAQsgB0EAOgAACyAJQX9qIQkLIAdBAWohByABQQxqIQEMAQsAAAsACwsCQAJAA0AgAiADRg0BIAotAABBAkcEQCAKQQFqIQogAkEMaiECDAELCyACIQMMAQsgBSAFKAIAQQRyNgIACyAMIgAoAgAhASAAQQA2AgAgAQRAIAEgACgCBBEMAAsgCEGAAWokACADDwUCQAJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLBEAgB0EBOgAADAELIAdBAjoAACALQQFqIQsgCUF/aiEJCyAHQQFqIQcgAUEMaiEBDAELAAALAAsQ0wQACw8AIAEgAiADIAQgBRCZAgv3BAEEfyMAQeACayIFJAAgBSABNgLQAiAFIAA2AtgCIAIQ8QEhBiACIAVB4AFqEJoCIQcgBUHQAWogAiAFQcwCahCbAiAFQcABahDzASIAIAAsAAtBAEgEfyAAKAIIQf////8HcUF/agVBCgsQ9AEgBQJ/IAAsAAtBAEgEQCAAKAIADAELIAALIgE2ArwBIAUgBUEQajYCDCAFQQA2AggDQAJAIAVB2AJqIAVB0AJqEE9FDQAgBSgCvAECfyAALAALQQBIBEAgACgCBAwBCyAALQALCyABakYEQAJ/IAAiASwAC0EASARAIAEoAgQMAQsgAS0ACwshAiABAn8gASwAC0EASARAIAEoAgQMAQsgAS0ACwtBAXQQ9AEgASABLAALQQBIBH8gASgCCEH/////B3FBf2oFQQoLEPQBIAUgAgJ/IAEsAAtBAEgEQCAAKAIADAELIAALIgFqNgK8AQsCfyAFKALYAiICKAIMIgggAigCEEYEQCACIAIoAgAoAiQRAAAMAQsgCCgCAAsgBiABIAVBvAFqIAVBCGogBSgCzAIgBUHQAWogBUEQaiAFQQxqIAcQnAINACAFQdgCahBQGgwBCwsCQAJ/IAUsANsBQQBIBEAgBSgC1AEMAQsgBS0A2wELRQ0AIAUoAgwiAiAFQRBqa0GfAUoNACAFIAJBBGo2AgwgAiAFKAIINgIACyAEIAEgBSgCvAEgAyAGEPYBNgIAIAVB0AFqIAVBEGogBSgCDCADEPcBIAVB2AJqIAVB0AJqEFEEQCADIAMoAgBBAnI2AgALIAUoAtgCIQEgABDbBBogBUHQAWoQ2wQaIAVB4AJqJAAgAQsJACAAIAEQrwILhAEBAX8jAEEQayIDJAAgAyABKAIcIgE2AgggASABKAIEQQFqNgIEIAIgA0EIahCWAiIBIgIgAigCACgCEBEAADYCACAAIAEgASgCACgCFBEHAAJ/IAMoAggiACAAKAIEQX9qIgE2AgQgAUF/RgsEQCAAIAAoAgAoAggRDAALIANBEGokAAuKAwECfyMAQRBrIgokACAKIAA2AgwCQAJAAkACQCADKAIAIAJHDQAgCSgCYCAARiILRQRAIAkoAmQgAEcNAQsgAyACQQFqNgIAIAJBK0EtIAsbOgAADAELAn8gBiwAC0EASARAIAYoAgQMAQsgBi0ACwtFDQEgACAFRw0BQQAhACAIKAIAIgEgB2tBnwFKDQIgBCgCACEAIAggAUEEajYCACABIAA2AgALQQAhACAEQQA2AgAMAQtBfyEAIAkgCUHoAGogCkEMahCuAiAJayIGQdwASg0AIAZBAnUhBQJAIAFBeGoiB0ECSwRAIAFBEEcNASAGQdgASA0BIAMoAgAiASACRg0CIAEgAmtBAkoNAiABQX9qLQAAQTBHDQJBACEAIARBADYCACADIAFBAWo2AgAgASAFQaA+ai0AADoAAAwCCyAHQQFrRQ0AIAUgAU4NAQsgAyADKAIAIgBBAWo2AgAgACAFQaA+ai0AADoAACAEIAQoAgBBAWo2AgBBACEACyAKQRBqJAAgAAsPACABIAIgAyAEIAUQngIL9wQBBH8jAEHgAmsiBSQAIAUgATYC0AIgBSAANgLYAiACEPEBIQYgAiAFQeABahCaAiEHIAVB0AFqIAIgBUHMAmoQmwIgBUHAAWoQ8wEiACAALAALQQBIBH8gACgCCEH/////B3FBf2oFQQoLEPQBIAUCfyAALAALQQBIBEAgACgCAAwBCyAACyIBNgK8ASAFIAVBEGo2AgwgBUEANgIIA0ACQCAFQdgCaiAFQdACahBPRQ0AIAUoArwBAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwsgAWpGBEACfyAAIgEsAAtBAEgEQCABKAIEDAELIAEtAAsLIQIgAQJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLQQF0EPQBIAEgASwAC0EASAR/IAEoAghB/////wdxQX9qBUEKCxD0ASAFIAICfyABLAALQQBIBEAgACgCAAwBCyAACyIBajYCvAELAn8gBSgC2AIiAigCDCIIIAIoAhBGBEAgAiACKAIAKAIkEQAADAELIAgoAgALIAYgASAFQbwBaiAFQQhqIAUoAswCIAVB0AFqIAVBEGogBUEMaiAHEJwCDQAgBUHYAmoQUBoMAQsLAkACfyAFLADbAUEASARAIAUoAtQBDAELIAUtANsBC0UNACAFKAIMIgIgBUEQamtBnwFKDQAgBSACQQRqNgIMIAIgBSgCCDYCAAsgBCABIAUoArwBIAMgBhD6ATcDACAFQdABaiAFQRBqIAUoAgwgAxD3ASAFQdgCaiAFQdACahBRBEAgAyADKAIAQQJyNgIACyAFKALYAiEBIAAQ2wQaIAVB0AFqENsEGiAFQeACaiQAIAELDwAgASACIAMgBCAFEKACC/cEAQR/IwBB4AJrIgUkACAFIAE2AtACIAUgADYC2AIgAhDxASEGIAIgBUHgAWoQmgIhByAFQdABaiACIAVBzAJqEJsCIAVBwAFqEPMBIgAgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEKCxD0ASAFAn8gACwAC0EASARAIAAoAgAMAQsgAAsiATYCvAEgBSAFQRBqNgIMIAVBADYCCANAAkAgBUHYAmogBUHQAmoQT0UNACAFKAK8AQJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLIAFqRgRAAn8gACIBLAALQQBIBEAgASgCBAwBCyABLQALCyECIAECfyABLAALQQBIBEAgASgCBAwBCyABLQALC0EBdBD0ASABIAEsAAtBAEgEfyABKAIIQf////8HcUF/agVBCgsQ9AEgBSACAn8gASwAC0EASARAIAAoAgAMAQsgAAsiAWo2ArwBCwJ/IAUoAtgCIgIoAgwiCCACKAIQRgRAIAIgAigCACgCJBEAAAwBCyAIKAIACyAGIAEgBUG8AWogBUEIaiAFKALMAiAFQdABaiAFQRBqIAVBDGogBxCcAg0AIAVB2AJqEFAaDAELCwJAAn8gBSwA2wFBAEgEQCAFKALUAQwBCyAFLQDbAQtFDQAgBSgCDCICIAVBEGprQZ8BSg0AIAUgAkEEajYCDCACIAUoAgg2AgALIAQgASAFKAK8ASADIAYQ/QE7AQAgBUHQAWogBUEQaiAFKAIMIAMQ9wEgBUHYAmogBUHQAmoQUQRAIAMgAygCAEECcjYCAAsgBSgC2AIhASAAENsEGiAFQdABahDbBBogBUHgAmokACABCw8AIAEgAiADIAQgBRCiAgv3BAEEfyMAQeACayIFJAAgBSABNgLQAiAFIAA2AtgCIAIQ8QEhBiACIAVB4AFqEJoCIQcgBUHQAWogAiAFQcwCahCbAiAFQcABahDzASIAIAAsAAtBAEgEfyAAKAIIQf////8HcUF/agVBCgsQ9AEgBQJ/IAAsAAtBAEgEQCAAKAIADAELIAALIgE2ArwBIAUgBUEQajYCDCAFQQA2AggDQAJAIAVB2AJqIAVB0AJqEE9FDQAgBSgCvAECfyAALAALQQBIBEAgACgCBAwBCyAALQALCyABakYEQAJ/IAAiASwAC0EASARAIAEoAgQMAQsgAS0ACwshAiABAn8gASwAC0EASARAIAEoAgQMAQsgAS0ACwtBAXQQ9AEgASABLAALQQBIBH8gASgCCEH/////B3FBf2oFQQoLEPQBIAUgAgJ/IAEsAAtBAEgEQCAAKAIADAELIAALIgFqNgK8AQsCfyAFKALYAiICKAIMIgggAigCEEYEQCACIAIoAgAoAiQRAAAMAQsgCCgCAAsgBiABIAVBvAFqIAVBCGogBSgCzAIgBUHQAWogBUEQaiAFQQxqIAcQnAINACAFQdgCahBQGgwBCwsCQAJ/IAUsANsBQQBIBEAgBSgC1AEMAQsgBS0A2wELRQ0AIAUoAgwiAiAFQRBqa0GfAUoNACAFIAJBBGo2AgwgAiAFKAIINgIACyAEIAEgBSgCvAEgAyAGEIACNgIAIAVB0AFqIAVBEGogBSgCDCADEPcBIAVB2AJqIAVB0AJqEFEEQCADIAMoAgBBAnI2AgALIAUoAtgCIQEgABDbBBogBUHQAWoQ2wQaIAVB4AJqJAAgAQsPACABIAIgAyAEIAUQpAIL9wQBBH8jAEHgAmsiBSQAIAUgATYC0AIgBSAANgLYAiACEPEBIQYgAiAFQeABahCaAiEHIAVB0AFqIAIgBUHMAmoQmwIgBUHAAWoQ8wEiACAALAALQQBIBH8gACgCCEH/////B3FBf2oFQQoLEPQBIAUCfyAALAALQQBIBEAgACgCAAwBCyAACyIBNgK8ASAFIAVBEGo2AgwgBUEANgIIA0ACQCAFQdgCaiAFQdACahBPRQ0AIAUoArwBAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwsgAWpGBEACfyAAIgEsAAtBAEgEQCABKAIEDAELIAEtAAsLIQIgAQJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLQQF0EPQBIAEgASwAC0EASAR/IAEoAghB/////wdxQX9qBUEKCxD0ASAFIAICfyABLAALQQBIBEAgACgCAAwBCyAACyIBajYCvAELAn8gBSgC2AIiAigCDCIIIAIoAhBGBEAgAiACKAIAKAIkEQAADAELIAgoAgALIAYgASAFQbwBaiAFQQhqIAUoAswCIAVB0AFqIAVBEGogBUEMaiAHEJwCDQAgBUHYAmoQUBoMAQsLAkACfyAFLADbAUEASARAIAUoAtQBDAELIAUtANsBC0UNACAFKAIMIgIgBUEQamtBnwFKDQAgBSACQQRqNgIMIAIgBSgCCDYCAAsgBCABIAUoArwBIAMgBhCDAjcDACAFQdABaiAFQRBqIAUoAgwgAxD3ASAFQdgCaiAFQdACahBRBEAgAyADKAIAQQJyNgIACyAFKALYAiEBIAAQ2wQaIAVB0AFqENsEGiAFQeACaiQAIAELDwAgASACIAMgBCAFEKYCC5YFAQJ/IwBB8AJrIgUkACAFIAE2AuACIAUgADYC6AIgBUHIAWogAiAFQeABaiAFQdwBaiAFQdgBahCnAiAFQbgBahDzASIBIAEsAAtBAEgEfyABKAIIQf////8HcUF/agVBCgsQ9AEgBQJ/IAEsAAtBAEgEQCABKAIADAELIAELIgA2ArQBIAUgBUEQajYCDCAFQQA2AgggBUEBOgAHIAVBxQA6AAYDQAJAIAVB6AJqIAVB4AJqEE9FDQAgBSgCtAECfyABLAALQQBIBEAgASgCBAwBCyABLQALCyAAakYEQAJ/IAEiACwAC0EASARAIAAoAgQMAQsgAC0ACwshAiAAAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwtBAXQQ9AEgACAALAALQQBIBH8gACgCCEH/////B3FBf2oFQQoLEPQBIAUgAgJ/IAAsAAtBAEgEQCABKAIADAELIAELIgBqNgK0AQsCfyAFKALoAiICKAIMIgYgAigCEEYEQCACIAIoAgAoAiQRAAAMAQsgBigCAAsgBUEHaiAFQQZqIAAgBUG0AWogBSgC3AEgBSgC2AEgBUHIAWogBUEQaiAFQQxqIAVBCGogBUHgAWoQqAINACAFQegCahBQGgwBCwsCQAJ/IAUsANMBQQBIBEAgBSgCzAEMAQsgBS0A0wELRQ0AIAUtAAdFDQAgBSgCDCICIAVBEGprQZ8BSg0AIAUgAkEEajYCDCACIAUoAgg2AgALIAQgACAFKAK0ASADEIgCOAIAIAVByAFqIAVBEGogBSgCDCADEPcBIAVB6AJqIAVB4AJqEFEEQCADIAMoAgBBAnI2AgALIAUoAugCIQAgARDbBBogBUHIAWoQ2wQaIAVB8AJqJAAgAAuzAQEBfyMAQRBrIgUkACAFIAEoAhwiATYCCCABIAEoAgRBAWo2AgQgBUEIahBOIgFBoD5BwD4gAiABKAIAKAIwEQ0AGiADIAVBCGoQlgIiASICIAIoAgAoAgwRAAA2AgAgBCABIAEoAgAoAhARAAA2AgAgACABIAEoAgAoAhQRBwACfyAFKAIIIgAgACgCBEF/aiIBNgIEIAFBf0YLBEAgACAAKAIAKAIIEQwACyAFQRBqJAALwgQBAX8jAEEQayIMJAAgDCAANgIMAkACQCAAIAVGBEAgAS0AAEUNAUEAIQAgAUEAOgAAIAQgBCgCACIBQQFqNgIAIAFBLjoAAAJ/IAcsAAtBAEgEQCAHKAIEDAELIActAAsLRQ0CIAkoAgAiASAIa0GfAUoNAiAKKAIAIQIgCSABQQRqNgIAIAEgAjYCAAwCCwJAIAAgBkcNAAJ/IAcsAAtBAEgEQCAHKAIEDAELIActAAsLRQ0AIAEtAABFDQFBACEAIAkoAgAiASAIa0GfAUoNAiAKKAIAIQAgCSABQQRqNgIAIAEgADYCAEEAIQAgCkEANgIADAILQX8hACALIAtBgAFqIAxBDGoQrgIgC2siBUH8AEoNASAFQQJ1QaA+ai0AACEGAkAgBUGof2pBHnciAEEDTQRAAkACQCAAQQJrDgIAAAELIAMgBCgCACIBRwRAQX8hACABQX9qLQAAQd8AcSACLQAAQf8AcUcNBQsgBCABQQFqNgIAIAEgBjoAAEEAIQAMBAsgAkHQADoAAAwBCyACLAAAIgAgBkHfAHFHDQAgAiAAQYABcjoAACABLQAARQ0AIAFBADoAAAJ/IAcsAAtBAEgEQCAHKAIEDAELIActAAsLRQ0AIAkoAgAiACAIa0GfAUoNACAKKAIAIQEgCSAAQQRqNgIAIAAgATYCAAsgBCAEKAIAIgBBAWo2AgAgACAGOgAAQQAhACAFQdQASg0BIAogCigCAEEBajYCAAwBC0F/IQALIAxBEGokACAACw8AIAEgAiADIAQgBRCqAguWBQECfyMAQfACayIFJAAgBSABNgLgAiAFIAA2AugCIAVByAFqIAIgBUHgAWogBUHcAWogBUHYAWoQpwIgBUG4AWoQ8wEiASABLAALQQBIBH8gASgCCEH/////B3FBf2oFQQoLEPQBIAUCfyABLAALQQBIBEAgASgCAAwBCyABCyIANgK0ASAFIAVBEGo2AgwgBUEANgIIIAVBAToAByAFQcUAOgAGA0ACQCAFQegCaiAFQeACahBPRQ0AIAUoArQBAn8gASwAC0EASARAIAEoAgQMAQsgAS0ACwsgAGpGBEACfyABIgAsAAtBAEgEQCAAKAIEDAELIAAtAAsLIQIgAAJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLQQF0EPQBIAAgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEKCxD0ASAFIAICfyAALAALQQBIBEAgASgCAAwBCyABCyIAajYCtAELAn8gBSgC6AIiAigCDCIGIAIoAhBGBEAgAiACKAIAKAIkEQAADAELIAYoAgALIAVBB2ogBUEGaiAAIAVBtAFqIAUoAtwBIAUoAtgBIAVByAFqIAVBEGogBUEMaiAFQQhqIAVB4AFqEKgCDQAgBUHoAmoQUBoMAQsLAkACfyAFLADTAUEASARAIAUoAswBDAELIAUtANMBC0UNACAFLQAHRQ0AIAUoAgwiAiAFQRBqa0GfAUoNACAFIAJBBGo2AgwgAiAFKAIINgIACyAEIAAgBSgCtAEgAxCLAjkDACAFQcgBaiAFQRBqIAUoAgwgAxD3ASAFQegCaiAFQeACahBRBEAgAyADKAIAQQJyNgIACyAFKALoAiEAIAEQ2wQaIAVByAFqENsEGiAFQfACaiQAIAALDwAgASACIAMgBCAFEKwCC60FAgJ/AX4jAEGAA2siBSQAIAUgATYC8AIgBSAANgL4AiAFQdgBaiACIAVB8AFqIAVB7AFqIAVB6AFqEKcCIAVByAFqEPMBIgEgASwAC0EASAR/IAEoAghB/////wdxQX9qBUEKCxD0ASAFAn8gASwAC0EASARAIAEoAgAMAQsgAQsiADYCxAEgBSAFQSBqNgIcIAVBADYCGCAFQQE6ABcgBUHFADoAFgNAAkAgBUH4AmogBUHwAmoQT0UNACAFKALEAQJ/IAEsAAtBAEgEQCABKAIEDAELIAEtAAsLIABqRgRAAn8gASIALAALQQBIBEAgACgCBAwBCyAALQALCyECIAACfyAALAALQQBIBEAgACgCBAwBCyAALQALC0EBdBD0ASAAIAAsAAtBAEgEfyAAKAIIQf////8HcUF/agVBCgsQ9AEgBSACAn8gACwAC0EASARAIAEoAgAMAQsgAQsiAGo2AsQBCwJ/IAUoAvgCIgIoAgwiBiACKAIQRgRAIAIgAigCACgCJBEAAAwBCyAGKAIACyAFQRdqIAVBFmogACAFQcQBaiAFKALsASAFKALoASAFQdgBaiAFQSBqIAVBHGogBUEYaiAFQfABahCoAg0AIAVB+AJqEFAaDAELCwJAAn8gBSwA4wFBAEgEQCAFKALcAQwBCyAFLQDjAQtFDQAgBS0AF0UNACAFKAIcIgIgBUEgamtBnwFKDQAgBSACQQRqNgIcIAIgBSgCGDYCAAsgBSAAIAUoAsQBIAMQjgIgBSkDACEHIAQgBSkDCDcDCCAEIAc3AwAgBUHYAWogBUEgaiAFKAIcIAMQ9wEgBUH4AmogBUHwAmoQUQRAIAMgAygCAEECcjYCAAsgBSgC+AIhACABENsEGiAFQdgBahDbBBogBUGAA2okACAAC5EFAQJ/IwBB4AJrIgAkACAAIAI2AtACIAAgATYC2AIgAEHQAWoQ8wEhBiAAIAMoAhwiATYCECABIAEoAgRBAWo2AgQgAEEQahBOIgFBoD5Buj4gAEHgAWogASgCACgCMBENABoCfyAAKAIQIgEgASgCBEF/aiICNgIEIAJBf0YLBEAgASABKAIAKAIIEQwACyAAQcABahDzASICIAIsAAtBAEgEfyACKAIIQf////8HcUF/agVBCgsQ9AEgAAJ/IAIsAAtBAEgEQCACKAIADAELIAILIgE2ArwBIAAgAEEQajYCDCAAQQA2AggDQAJAIABB2AJqIABB0AJqEE9FDQAgACgCvAECfyACLAALQQBIBEAgAigCBAwBCyACLQALCyABakYEQAJ/IAIiASwAC0EASARAIAEoAgQMAQsgAS0ACwshAyABAn8gASwAC0EASARAIAEoAgQMAQsgAS0ACwtBAXQQ9AEgASABLAALQQBIBH8gASgCCEH/////B3FBf2oFQQoLEPQBIAAgAwJ/IAEsAAtBAEgEQCACKAIADAELIAILIgFqNgK8AQsCfyAAKALYAiIDKAIMIgcgAygCEEYEQCADIAMoAgAoAiQRAAAMAQsgBygCAAtBECABIABBvAFqIABBCGpBACAGIABBEGogAEEMaiAAQeABahCcAg0AIABB2AJqEFAaDAELCyACIAAoArwBIAFrEPQBAn8gAiwAC0EASARAIAIoAgAMAQsgAgshARCQAiEDIAAgBTYCACABIAMgABCRAkEBRwRAIARBBDYCAAsgAEHYAmogAEHQAmoQUQRAIAQgBCgCAEECcjYCAAsgACgC2AIhASACENsEGiAGENsEGiAAQeACaiQAIAELMgAgAigCACECA0ACQCAAIAFHBH8gACgCACACRw0BIAAFIAELDwsgAEEEaiEADAAACwALeAECfyMAQRBrIgIkACACIAAoAhwiADYCCCAAIAAoAgRBAWo2AgQgAkEIahBOIgBBoD5Buj4gASAAKAIAKAIwEQ0AGgJ/IAIoAggiACAAKAIEQX9qIgM2AgQgA0F/RgsEQCAAIAAoAgAoAggRDAALIAJBEGokACABC6MCAQF/IwBBMGsiBSQAIAUgATYCKAJAIAIoAgRBAXFFBEAgACABIAIgAyAEIAAoAgAoAhgRCQAhAgwBCyAFIAIoAhwiADYCGCAAIAAoAgRBAWo2AgQgBUEYahDrASEAAn8gBSgCGCIBIAEoAgRBf2oiAjYCBCACQX9GCwRAIAEgASgCACgCCBEMAAsC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GgwBCyAEIANrIAZJBEAgACAEIAMgBmogBGsgAyADEOEECwJ/IAAsAAtBAEgEQCAAKAIADAELIAALIANqIQQDQCABIAJHBEAgBCABLQAAOgAAIAFBAWohASAEQQFqIQQMAQsLIAVBADoADyAEIAUtAA86AAAgAyAGaiEBAkAgACwAC0EASARAIAAgATYCBAwBCyAAIAE6AAsLCyAFQSBqJAALCwAgAEHIoQEQ7QELIAAgABDOBCAAIAEoAgg2AgggACABKQIANwIAIAEQkgILCwAgAEHAoQEQ7QELfgEBfyMAQSBrIgMkACADIAE2AhAgAyAANgIYIAMgAjYCCANAAkACf0EBIAMoAhggAygCEEZBAXNFDQAaIAMoAhgtAAAgAygCCC0AAEYNAUEACyEAIANBIGokACAADwsgAyADKAIYQQFqNgIYIAMgAygCCEEBajYCCAwAAAsACzQBAX8jAEEQayICJAAgAiAAKAIANgIIIAIgAigCCCABajYCCCACKAIIIQAgAkEQaiQAIAALPQECfyABKAIAIQIgAUEANgIAIAIhAyAAKAIAIQIgACADNgIAIAIEQCACIAAoAgQRDAALIAAgASgCBDYCBAv5BAEBfyMAQfAEayIAJAAgACABNgLoBCAAIAI2AuAEIABB2QA2AhAgAEHIAWogAEHQAWogAEEQahDuASEHIAAgBCgCHCIBNgLAASABIAEoAgRBAWo2AgQgAEHAAWoQTiEBIABBADoAvwECQCAAQegEaiACIAMgAEHAAWogBCgCBCAFIABBvwFqIAEgByAAQcQBaiAAQeAEahCkA0UNACAAQavAACgAADYAtwEgAEGkwAApAAA3A7ABIAEgAEGwAWogAEG6AWogAEGAAWogASgCACgCMBENABogAEHYADYCECAAQQhqQQAgAEEQahDuASEBIABBEGohAgJAIAAoAsQBIAcoAgBrQYkDTgRAIAAoAsQBIAcoAgBrQQJ1QQJqEKAFIQMgASgCACECIAEgAzYCACACBEAgAiABKAIEEQwACyABKAIARQ0BIAEoAgAhAgsgAC0AvwEEQCACQS06AAAgAkEBaiECCyAHKAIAIQQDQAJAIAQgACgCxAFPBEAgAkEAOgAAIAAgBjYCACAAQRBqIAAQ0QFBAUcNASABKAIAIQIgAUEANgIAIAIEQCACIAEoAgQRDAALDAQLIAIgAEGwAWogAEGAAWogAEGoAWogBBCuAiAAQYABamtBAnVqLQAAOgAAIAJBAWohAiAEQQRqIQQMAQsLEIwDAAsQ0wQACyAAQegEaiAAQeAEahBRBEAgBSAFKAIAQQJyNgIACyAAKALoBCECAn8gACgCwAEiASABKAIEQX9qIgM2AgQgA0F/RgsEQCABIAEoAgAoAggRDAALIAcoAgAhASAHQQA2AgAgAQRAIAEgBygCBBEMAAsgAEHwBGokACACC98UAQh/IwBBsARrIgskACALIAo2AqQEIAsgATYCqAQgC0HZADYCYCALIAtBiAFqIAtBkAFqIAtB4ABqEO4BIg8oAgAiATYChAEgCyABQZADajYCgAEgC0HgAGoQ8wEhESALQdAAahDzASEOIAtBQGsQ8wEhDCALQTBqEPMBIQ0gC0EgahDzASEQIAIgAyALQfgAaiALQfQAaiALQfAAaiARIA4gDCANIAtBHGoQpQMgCSAIKAIANgIAIARBgARxIRJBACEBQQAhBANAIAQhCgJAAkACQCABQQRGDQAgACALQagEahBPRQ0AAkACQAJAIAtB+ABqIAFqLAAAIgJBBEsNAEEAIQQCQAJAAkACQAJAIAJBAWsOBAAEAwcBCyABQQNGDQQgB0GAwAACfyAAKAIAIgIoAgwiAyACKAIQRgRAIAIgAigCACgCJBEAAAwBCyADKAIACyAHKAIAKAIMEQQABEAgC0EQaiAAEKYDIBAgCygCEBDrBAwCCyAFIAUoAgBBBHI2AgBBACEADAgLIAFBA0YNAwsDQCAAIAtBqARqEE9FDQMgB0GAwAACfyAAKAIAIgIoAgwiAyACKAIQRgRAIAIgAigCACgCJBEAAAwBCyADKAIACyAHKAIAKAIMEQQARQ0DIAtBEGogABCmAyAQIAsoAhAQ6wQMAAALAAsCfyAMLAALQQBIBEAgDCgCBAwBCyAMLQALC0EAAn8gDSwAC0EASARAIA0oAgQMAQsgDS0ACwtrRg0BAkACfyAMLAALQQBIBEAgDCgCBAwBCyAMLQALCwRAAn8gDSwAC0EASARAIA0oAgQMAQsgDS0ACwsNAQsCfyAMLAALQQBIBEAgDCgCBAwBCyAMLQALCyEDAn8gACgCACICKAIMIgQgAigCEEYEQCACIAIoAgAoAiQRAAAMAQsgBCgCAAshAiADBEACfyAMLAALQQBIBEAgDCgCAAwBCyAMCygCACACRgRAIAAQUBogDCAKAn8gDCwAC0EASARAIAwoAgQMAQsgDC0ACwtBAUsbIQQMCQsgBkEBOgAADAMLIAICfyANLAALQQBIBEAgDSgCAAwBCyANCygCAEcNAiAAEFAaIAZBAToAACANIAoCfyANLAALQQBIBEAgDSgCBAwBCyANLQALC0EBSxshBAwHCwJ/IAAoAgAiAigCDCIDIAIoAhBGBEAgAiACKAIAKAIkEQAADAELIAMoAgALAn8gDCwAC0EASARAIAwoAgAMAQsgDAsoAgBGBEAgABBQGiAMIAoCfyAMLAALQQBIBEAgDCgCBAwBCyAMLQALC0EBSxshBAwHCwJ/IAAoAgAiAigCDCIDIAIoAhBGBEAgAiACKAIAKAIkEQAADAELIAMoAgALAn8gDSwAC0EASARAIA0oAgAMAQsgDQsoAgBGBEAgABBQGiAGQQE6AAAgDSAKAn8gDSwAC0EASARAIA0oAgQMAQsgDS0ACwtBAUsbIQQMBwsgBSAFKAIAQQRyNgIAQQAhAAwFCwJAIAFBAkkNACAKDQAgEg0AIAFBAkYgCy0Ae0EAR3FFDQYLIAsgDhCxAjYCCCALIAsoAgg2AhACQCABRQ0AIAEgC2otAHdBAUsNAANAAkAgCyAOEMcCNgIIIAsoAhAgCygCCEZBAXNFDQAgB0GAwAAgCygCECgCACAHKAIAKAIMEQQARQ0AIAsgCygCEEEEajYCEAwBCwsgCyAOELECNgIIIAsoAhAgCygCCGtBAnUiAgJ/IBAsAAtBAEgEQCAQKAIEDAELIBAtAAsLTQRAIAsgEBDHAjYCCCALQQhqQQAgAmsQrgMgEBDHAiAOELECEK0DDQELIAsgDhCxAjYCACALIAsoAgA2AgggCyALKAIINgIQCyALIAsoAhA2AggDQAJAIAsgDhDHAjYCACALKAIIIAsoAgBGQQFzRQ0AIAAgC0GoBGoQT0UNAAJ/IAAoAgAiAigCDCIDIAIoAhBGBEAgAiACKAIAKAIkEQAADAELIAMoAgALIAsoAggoAgBHDQAgABBQGiALIAsoAghBBGo2AggMAQsLIBJFDQAgCyAOEMcCNgIAIAsoAgggCygCAEZBAXMNAQsgCiEEDAQLIAUgBSgCAEEEcjYCAEEAIQAMAgsDQAJAIAAgC0GoBGoQT0UNAAJ/IAdBgBACfyAAKAIAIgIoAgwiAyACKAIQRgRAIAIgAigCACgCJBEAAAwBCyADKAIACyICIAcoAgAoAgwRBAAEQCAJKAIAIgMgCygCpARGBEAgCCAJIAtBpARqEJkDIAkoAgAhAwsgCSADQQRqNgIAIAMgAjYCACAEQQFqDAELAn8gESwAC0EASARAIBEoAgQMAQsgES0ACwshAyAERQ0BIANFDQEgAiALKAJwRw0BIAsoAoQBIgIgCygCgAFGBEAgDyALQYQBaiALQYABahCZAyALKAKEASECCyALIAJBBGo2AoQBIAIgBDYCAEEACyEEIAAQUBoMAQsLIA8oAgAhAwJAIARFDQAgAyALKAKEASICRg0AIAsoAoABIAJGBEAgDyALQYQBaiALQYABahCZAyALKAKEASECCyALIAJBBGo2AoQBIAIgBDYCAAsCQCALKAIcQQFIDQACQCAAIAtBqARqEFFFBEACfyAAKAIAIgIoAgwiAyACKAIQRgRAIAIgAigCACgCJBEAAAwBCyADKAIACyALKAJ0Rg0BCyAFIAUoAgBBBHI2AgBBACEADAMLA0AgABBQGiALKAIcQQFIDQECQCAAIAtBqARqEFFFBEAgB0GAEAJ/IAAoAgAiAigCDCIDIAIoAhBGBEAgAiACKAIAKAIkEQAADAELIAMoAgALIAcoAgAoAgwRBAANAQsgBSAFKAIAQQRyNgIAQQAhAAwECyAJKAIAIAsoAqQERgRAIAggCSALQaQEahCZAwsCfyAAKAIAIgIoAgwiAyACKAIQRgRAIAIgAigCACgCJBEAAAwBCyADKAIACyECIAkgCSgCACIDQQRqNgIAIAMgAjYCACALIAsoAhxBf2o2AhwMAAALAAsgCiEEIAgoAgAgCSgCAEcNAiAFIAUoAgBBBHI2AgBBACEADAELAkAgCkUNAEEBIQQDQCAEAn8gCiwAC0EASARAIAooAgQMAQsgCi0ACwtPDQECQCAAIAtBqARqEFFFBEACfyAAKAIAIgEoAgwiAiABKAIQRgRAIAEgASgCACgCJBEAAAwBCyACKAIACwJ/IAosAAtBAEgEQCAKKAIADAELIAoLIARBAnRqKAIARg0BCyAFIAUoAgBBBHI2AgBBACEADAMLIAAQUBogBEEBaiEEDAAACwALQQEhACAPKAIAIAsoAoQBRg0AQQAhACALQQA2AhAgESAPKAIAIAsoAoQBIAtBEGoQ9wEgCygCEARAIAUgBSgCAEEEcjYCAAwBC0EBIQALIBAQ2wQaIA0Q2wQaIAwQ2wQaIA4Q2wQaIBEQ2wQaIA8oAgAhASAPQQA2AgAgAQRAIAEgDygCBBEMAAsgC0GwBGokACAADwsgAUEBaiEBDAAACwALpQMBAX8jAEEQayIKJAAgCQJ/IAAEQCAKIAEQqgMiACIBIAEoAgAoAiwRBwAgAiAKKAIANgAAIAogACAAKAIAKAIgEQcAIAggChCrAyAKENsEGiAKIAAgACgCACgCHBEHACAHIAoQqwMgChDbBBogAyAAIAAoAgAoAgwRAAA2AgAgBCAAIAAoAgAoAhARAAA2AgAgCiAAIAAoAgAoAhQRBwAgBSAKEJ4DIAoQ2wQaIAogACAAKAIAKAIYEQcAIAYgChCrAyAKENsEGiAAIAAoAgAoAiQRAAAMAQsgCiABEKwDIgAiASABKAIAKAIsEQcAIAIgCigCADYAACAKIAAgACgCACgCIBEHACAIIAoQqwMgChDbBBogCiAAIAAoAgAoAhwRBwAgByAKEKsDIAoQ2wQaIAMgACAAKAIAKAIMEQAANgIAIAQgACAAKAIAKAIQEQAANgIAIAogACAAKAIAKAIUEQcAIAUgChCeAyAKENsEGiAKIAAgACgCACgCGBEHACAGIAoQqwMgChDbBBogACAAKAIAKAIkEQAACzYCACAKQRBqJAALHgEBfyABKAIAEFQhAiAAIAEoAgA2AgQgACACNgIAC/oCAQF/IwBBwANrIgAkACAAIAE2ArgDIAAgAjYCsAMgAEHZADYCFCAAQRhqIABBIGogAEEUahDuASEBIAAgBCgCHCIHNgIQIAcgBygCBEEBajYCBCAAQRBqEE4hByAAQQA6AA8gAEG4A2ogAiADIABBEGogBCgCBCAFIABBD2ogByABIABBFGogAEGwA2oQpAMEQCAGEKgDIAAtAA8EQCAGIAdBLSAHKAIAKAIsEQEAEOsECyAHQTAgBygCACgCLBEBACECIAEoAgAhBCAAKAIUIgNBfGohBwNAAkAgBCAHTw0AIAQoAgAgAkcNACAEQQRqIQQMAQsLIAYgBCADEKkDCyAAQbgDaiAAQbADahBRBEAgBSAFKAIAQQJyNgIACyAAKAK4AyEDAn8gACgCECICIAIoAgRBf2oiBDYCBCAEQX9GCwRAIAIgAigCACgCCBEMAAsgASgCACECIAFBADYCACACBEAgAiABKAIEEQwACyAAQcADaiQAIAMLWwECfyMAQRBrIgEkAAJAIAAsAAtBAEgEQCAAKAIAIQIgAUEANgIMIAIgASgCDDYCACAAQQA2AgQMAQsgAUEANgIIIAAgASgCCDYCACAAQQA6AAsLIAFBEGokAAuuAwEFfyMAQRBrIgMkAAJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLIQUgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEBCyEEAkAgAiABa0ECdSIGRQ0AAn8CfyAALAALQQBIBEAgACgCAAwBCyAACyEHIAECfyAALAALQQBIBEAgACgCAAwBCyAACwJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLQQJ0akkgByABTXELBEAgAAJ/An8gA0IANwIAIANBADYCCCADIAEgAhDoASADIgAsAAtBAEgLBEAgACgCAAwBCyAACwJ/IAMsAAtBAEgEQCADKAIEDAELIAMtAAsLEOoEIAMQ2wQaDAELIAQgBWsgBkkEQCAAIAQgBSAGaiAEayAFIAUQ6QQLAn8gACwAC0EASARAIAAoAgAMAQsgAAsgBUECdGohBANAIAEgAkcEQCAEIAEoAgA2AgAgAUEEaiEBIARBBGohBAwBCwsgA0EANgIAIAQgAygCADYCACAFIAZqIQECQCAALAALQQBIBEAgACABNgIEDAELIAAgAToACwsLIANBEGokAAsLACAAQdihARDtAQsgACAAEM8EIAAgASgCCDYCCCAAIAEpAgA3AgAgARCSAgsLACAAQdChARDtAQt+AQF/IwBBIGsiAyQAIAMgATYCECADIAA2AhggAyACNgIIA0ACQAJ/QQEgAygCGCADKAIQRkEBc0UNABogAygCGCgCACADKAIIKAIARg0BQQALIQAgA0EgaiQAIAAPCyADIAMoAhhBBGo2AhggAyADKAIIQQRqNgIIDAAACwALNwEBfyMAQRBrIgIkACACIAAoAgA2AgggAiACKAIIIAFBAnRqNgIIIAIoAgghACACQRBqJAAgAAvzBgELfyMAQdADayIAJAAgACAFNwMQIAAgBjcDGCAAIABB4AJqNgLcAiAAQeACaiAAQRBqENIBIQkgAEHYADYC8AEgAEHoAWpBACAAQfABahDuASELIABB2AA2AvABIABB4AFqQQAgAEHwAWoQ7gEhCiAAQfABaiEMAkAgCUHkAE8EQBCQAiEHIAAgBTcDACAAIAY3AwggAEHcAmogB0GvwAAgABDCAiEJIAAoAtwCIghFDQEgCygCACEHIAsgCDYCACAHBEAgByALKAIEEQwACyAJEKAFIQggCigCACEHIAogCDYCACAHBEAgByAKKAIEEQwACyAKKAIAQQBHQQFzDQEgCigCACEMCyAAIAMoAhwiBzYC2AEgByAHKAIEQQFqNgIEIABB2AFqEEMiESIHIAAoAtwCIgggCCAJaiAMIAcoAgAoAiARDQAaIAICfyAJBEAgACgC3AItAABBLUYhDwsgDwsgAEHYAWogAEHQAWogAEHPAWogAEHOAWogAEHAAWoQ8wEiECAAQbABahDzASINIABBoAFqEPMBIgcgAEGcAWoQsAMgAEHYADYCMCAAQShqQQAgAEEwahDuASEIAn8gCSAAKAKcASICSgRAAn8gBywAC0EASARAIAcoAgQMAQsgBy0ACwsgCSACa0EBdEEBcmoMAQsCfyAHLAALQQBIBEAgBygCBAwBCyAHLQALC0ECagshDiAAQTBqIQIgACgCnAECfyANLAALQQBIBEAgDSgCBAwBCyANLQALCyAOamoiDkHlAE8EQCAOEKAFIQ4gCCgCACECIAggDjYCACACBEAgAiAIKAIEEQwACyAIKAIAIgJFDQELIAIgAEEkaiAAQSBqIAMoAgQgDCAJIAxqIBEgDyAAQdABaiAALADPASAALADOASAQIA0gByAAKAKcARCxAyABIAIgACgCJCAAKAIgIAMgBBC4AiECIAgoAgAhASAIQQA2AgAgAQRAIAEgCCgCBBEMAAsgBxDbBBogDRDbBBogEBDbBBoCfyAAKALYASIBIAEoAgRBf2oiAzYCBCADQX9GCwRAIAEgASgCACgCCBEMAAsgCigCACEBIApBADYCACABBEAgASAKKAIEEQwACyALKAIAIQEgC0EANgIAIAEEQCABIAsoAgQRDAALIABB0ANqJAAgAg8LENMEAAvRAwEBfyMAQRBrIgokACAJAn8gAARAIAIQnQMhAAJAIAEEQCAKIAAgACgCACgCLBEHACADIAooAgA2AAAgCiAAIAAoAgAoAiARBwAMAQsgCiAAIAAoAgAoAigRBwAgAyAKKAIANgAAIAogACAAKAIAKAIcEQcACyAIIAoQngMgChDbBBogBCAAIAAoAgAoAgwRAAA6AAAgBSAAIAAoAgAoAhARAAA6AAAgCiAAIAAoAgAoAhQRBwAgBiAKEJ4DIAoQ2wQaIAogACAAKAIAKAIYEQcAIAcgChCeAyAKENsEGiAAIAAoAgAoAiQRAAAMAQsgAhCfAyEAAkAgAQRAIAogACAAKAIAKAIsEQcAIAMgCigCADYAACAKIAAgACgCACgCIBEHAAwBCyAKIAAgACgCACgCKBEHACADIAooAgA2AAAgCiAAIAAoAgAoAhwRBwALIAggChCeAyAKENsEGiAEIAAgACgCACgCDBEAADoAACAFIAAgACgCACgCEBEAADoAACAKIAAgACgCACgCFBEHACAGIAoQngMgChDbBBogCiAAIAAoAgAoAhgRBwAgByAKEJ4DIAoQ2wQaIAAgACgCACgCJBEAAAs2AgAgCkEQaiQAC/AHAQp/IwBBEGsiEyQAIAIgADYCACADQYAEcSEWA0ACQAJAAkACQCAUQQRGBEACfyANLAALQQBIBEAgDSgCBAwBCyANLQALC0EBSwRAIBMgDRCxAjYCCCACIBNBCGpBARChAyANELICIAIoAgAQsgM2AgALIANBsAFxIgNBEEYNAiADQSBHDQEgASACKAIANgIADAILIAggFGosAAAiD0EESw0DAkACQAJAAkACQCAPQQFrDgQBAwIEAAsgASACKAIANgIADAcLIAEgAigCADYCACAGQSAgBigCACgCHBEBACEPIAIgAigCACIQQQFqNgIAIBAgDzoAAAwGCwJ/IA0sAAtBAEgEQCANKAIEDAELIA0tAAsLRQ0FAn8gDSwAC0EASARAIA0oAgAMAQsgDQstAAAhDyACIAIoAgAiEEEBajYCACAQIA86AAAMBQsCfyAMLAALQQBIBEAgDCgCBAwBCyAMLQALC0UhDyAWRQ0EIA8NBCACIAwQsQIgDBCyAiACKAIAELIDNgIADAQLIAIoAgAhFyAEQQFqIAQgBxsiBCERA0ACQCARIAVPDQAgESwAACIPQQBOBH8gBigCCCAPQf8BcUEBdGovAQBBgBBxQQBHBUEAC0UNACARQQFqIREMAQsLIA4iD0EBTgRAA0ACQCAPQQFIIhANACARIARNDQAgEUF/aiIRLQAAIRAgAiACKAIAIhJBAWo2AgAgEiAQOgAAIA9Bf2ohDwwBCwsgEAR/QQAFIAZBMCAGKAIAKAIcEQEACyESA0AgAiACKAIAIhBBAWo2AgAgD0EBTgRAIBAgEjoAACAPQX9qIQ8MAQsLIBAgCToAAAsgBCARRgRAIAZBMCAGKAIAKAIcEQEAIQ8gAiACKAIAIhBBAWo2AgAgECAPOgAADAMLAn9BfwJ/IAssAAtBAEgEQCALKAIEDAELIAstAAsLRQ0AGgJ/IAssAAtBAEgEQCALKAIADAELIAsLLAAACyESQQAhD0EAIRADQCAEIBFGDQMCQCAPIBJHBEAgDyEVDAELIAIgAigCACISQQFqNgIAIBIgCjoAAEEAIRUgEEEBaiIQAn8gCywAC0EASARAIAsoAgQMAQsgCy0ACwtPBEAgDyESDAELAn8gCywAC0EASARAIAsoAgAMAQsgCwsgEGotAABB/wBGBEBBfyESDAELAn8gCywAC0EASARAIAsoAgAMAQsgCwsgEGosAAAhEgsgEUF/aiIRLQAAIQ8gAiACKAIAIhhBAWo2AgAgGCAPOgAAIBVBAWohDwwAAAsACyABIAA2AgALIBNBEGokAA8LIBcgAigCABC5AgsgFEEBaiEUDAAACwALCwAgACABIAIQuQML0QUBB38jAEHAAWsiACQAIAAgAygCHCIGNgK4ASAGIAYoAgRBAWo2AgQgAEG4AWoQQyEKIAICfwJ/IAUiAiwAC0EASARAIAIoAgQMAQsgAi0ACwsEQAJ/IAIsAAtBAEgEQCACKAIADAELIAILLQAAIApBLSAKKAIAKAIcEQEAQf8BcUYhCwsgCwsgAEG4AWogAEGwAWogAEGvAWogAEGuAWogAEGgAWoQ8wEiDCAAQZABahDzASIJIABBgAFqEPMBIgYgAEH8AGoQsAMgAEHYADYCECAAQQhqQQAgAEEQahDuASEHAn8CfyACLAALQQBIBEAgBSgCBAwBCyAFLQALCyAAKAJ8SgRAAn8gBSwAC0EASARAIAUoAgQMAQsgBS0ACwshAiAAKAJ8IQgCfyAGLAALQQBIBEAgBigCBAwBCyAGLQALCyACIAhrQQF0akEBagwBCwJ/IAYsAAtBAEgEQCAGKAIEDAELIAYtAAsLQQJqCyEIIABBEGohAgJAIAAoAnwCfyAJLAALQQBIBEAgCSgCBAwBCyAJLQALCyAIamoiCEHlAEkNACAIEKAFIQggBygCACECIAcgCDYCACACBEAgAiAHKAIEEQwACyAHKAIAIgINABDTBAALIAIgAEEEaiAAIAMoAgQCfyAFLAALQQBIBEAgBSgCAAwBCyAFCwJ/IAUsAAtBAEgEQCAFKAIADAELIAULAn8gBSwAC0EASARAIAUoAgQMAQsgBS0ACwtqIAogCyAAQbABaiAALACvASAALACuASAMIAkgBiAAKAJ8ELEDIAEgAiAAKAIEIAAoAgAgAyAEELgCIQIgBygCACEBIAdBADYCACABBEAgASAHKAIEEQwACyAGENsEGiAJENsEGiAMENsEGgJ/IAAoArgBIgEgASgCBEF/aiIDNgIEIANBf0YLBEAgASABKAIAKAIIEQwACyAAQcABaiQAIAIL/AYBC38jAEGwCGsiACQAIAAgBTcDECAAIAY3AxggACAAQcAHajYCvAcgAEHAB2ogAEEQahDSASEJIABB2AA2AqAEIABBmARqQQAgAEGgBGoQ7gEhCyAAQdgANgKgBCAAQZAEakEAIABBoARqEO4BIQogAEGgBGohDAJAIAlB5ABPBEAQkAIhByAAIAU3AwAgACAGNwMIIABBvAdqIAdBr8AAIAAQwgIhCSAAKAK8ByIIRQ0BIAsoAgAhByALIAg2AgAgBwRAIAcgCygCBBEMAAsgCUECdBCgBSEIIAooAgAhByAKIAg2AgAgBwRAIAcgCigCBBEMAAsgCigCAEEAR0EBcw0BIAooAgAhDAsgACADKAIcIgc2AogEIAcgBygCBEEBajYCBCAAQYgEahBOIhEiByAAKAK8ByIIIAggCWogDCAHKAIAKAIwEQ0AGiACAn8gCQRAIAAoArwHLQAAQS1GIQ8LIA8LIABBiARqIABBgARqIABB/ANqIABB+ANqIABB6ANqEPMBIhAgAEHYA2oQ8wEiDSAAQcgDahDzASIHIABBxANqELUDIABB2AA2AjAgAEEoakEAIABBMGoQ7gEhCAJ/IAkgACgCxAMiAkoEQAJ/IAcsAAtBAEgEQCAHKAIEDAELIActAAsLIAkgAmtBAXRBAXJqDAELAn8gBywAC0EASARAIAcoAgQMAQsgBy0ACwtBAmoLIQ4gAEEwaiECIAAoAsQDAn8gDSwAC0EASARAIA0oAgQMAQsgDS0ACwsgDmpqIg5B5QBPBEAgDkECdBCgBSEOIAgoAgAhAiAIIA42AgAgAgRAIAIgCCgCBBEMAAsgCCgCACICRQ0BCyACIABBJGogAEEgaiADKAIEIAwgDCAJQQJ0aiARIA8gAEGABGogACgC/AMgACgC+AMgECANIAcgACgCxAMQtgMgASACIAAoAiQgACgCICADIAQQygIhAiAIKAIAIQEgCEEANgIAIAEEQCABIAgoAgQRDAALIAcQ2wQaIA0Q2wQaIBAQ2wQaAn8gACgCiAQiASABKAIEQX9qIgM2AgQgA0F/RgsEQCABIAEoAgAoAggRDAALIAooAgAhASAKQQA2AgAgAQRAIAEgCigCBBEMAAsgCygCACEBIAtBADYCACABBEAgASALKAIEEQwACyAAQbAIaiQAIAIPCxDTBAAL0QMBAX8jAEEQayIKJAAgCQJ/IAAEQCACEKoDIQACQCABBEAgCiAAIAAoAgAoAiwRBwAgAyAKKAIANgAAIAogACAAKAIAKAIgEQcADAELIAogACAAKAIAKAIoEQcAIAMgCigCADYAACAKIAAgACgCACgCHBEHAAsgCCAKEKsDIAoQ2wQaIAQgACAAKAIAKAIMEQAANgIAIAUgACAAKAIAKAIQEQAANgIAIAogACAAKAIAKAIUEQcAIAYgChCeAyAKENsEGiAKIAAgACgCACgCGBEHACAHIAoQqwMgChDbBBogACAAKAIAKAIkEQAADAELIAIQrAMhAAJAIAEEQCAKIAAgACgCACgCLBEHACADIAooAgA2AAAgCiAAIAAoAgAoAiARBwAMAQsgCiAAIAAoAgAoAigRBwAgAyAKKAIANgAAIAogACAAKAIAKAIcEQcACyAIIAoQqwMgChDbBBogBCAAIAAoAgAoAgwRAAA2AgAgBSAAIAAoAgAoAhARAAA2AgAgCiAAIAAoAgAoAhQRBwAgBiAKEJ4DIAoQ2wQaIAogACAAKAIAKAIYEQcAIAcgChCrAyAKENsEGiAAIAAoAgAoAiQRAAALNgIAIApBEGokAAvoBwEKfyMAQRBrIhQkACACIAA2AgAgA0GABHEhFgJAA0ACQCAVQQRGBEACfyANLAALQQBIBEAgDSgCBAwBCyANLQALC0EBSwRAIBQgDRCxAjYCCCACIBRBCGpBARCuAyANEMcCIAIoAgAQtwM2AgALIANBsAFxIgNBEEYNAyADQSBHDQEgASACKAIANgIADAMLAkAgCCAVaiwAACIPQQRLDQACQAJAAkACQAJAIA9BAWsOBAEDAgQACyABIAIoAgA2AgAMBAsgASACKAIANgIAIAZBICAGKAIAKAIsEQEAIQ8gAiACKAIAIhBBBGo2AgAgECAPNgIADAMLAn8gDSwAC0EASARAIA0oAgQMAQsgDS0ACwtFDQICfyANLAALQQBIBEAgDSgCAAwBCyANCygCACEPIAIgAigCACIQQQRqNgIAIBAgDzYCAAwCCwJ/IAwsAAtBAEgEQCAMKAIEDAELIAwtAAsLRSEPIBZFDQEgDw0BIAIgDBCxAiAMEMcCIAIoAgAQtwM2AgAMAQsgAigCACEXIARBBGogBCAHGyIEIREDQAJAIBEgBU8NACAGQYAQIBEoAgAgBigCACgCDBEEAEUNACARQQRqIREMAQsLIA4iD0EBTgRAA0ACQCAPQQFIIhANACARIARNDQAgEUF8aiIRKAIAIRAgAiACKAIAIhJBBGo2AgAgEiAQNgIAIA9Bf2ohDwwBCwsgEAR/QQAFIAZBMCAGKAIAKAIsEQEACyETIAIoAgAhEANAIBBBBGohEiAPQQFOBEAgECATNgIAIA9Bf2ohDyASIRAMAQsLIAIgEjYCACAQIAk2AgALAkAgBCARRgRAIAZBMCAGKAIAKAIsEQEAIQ8gAiACKAIAIhBBBGoiETYCACAQIA82AgAMAQsCf0F/An8gCywAC0EASARAIAsoAgQMAQsgCy0ACwtFDQAaAn8gCywAC0EASARAIAsoAgAMAQsgCwssAAALIRNBACEPQQAhEgNAIAQgEUcEQAJAIA8gE0cEQCAPIRAMAQsgAiACKAIAIhBBBGo2AgAgECAKNgIAQQAhECASQQFqIhICfyALLAALQQBIBEAgCygCBAwBCyALLQALC08EQCAPIRMMAQsCfyALLAALQQBIBEAgCygCAAwBCyALCyASai0AAEH/AEYEQEF/IRMMAQsCfyALLAALQQBIBEAgCygCAAwBCyALCyASaiwAACETCyARQXxqIhEoAgAhDyACIAIoAgAiGEEEajYCACAYIA82AgAgEEEBaiEPDAELCyACKAIAIRELIBcgERDLAgsgFUEBaiEVDAELCyABIAA2AgALIBRBEGokAAsLACAAIAEgAhC6AwvXBQEHfyMAQfADayIAJAAgACADKAIcIgY2AugDIAYgBigCBEEBajYCBCAAQegDahBOIQogAgJ/An8gBSICLAALQQBIBEAgAigCBAwBCyACLQALCwRAAn8gAiwAC0EASARAIAIoAgAMAQsgAgsoAgAgCkEtIAooAgAoAiwRAQBGIQsLIAsLIABB6ANqIABB4ANqIABB3ANqIABB2ANqIABByANqEPMBIgwgAEG4A2oQ8wEiCSAAQagDahDzASIGIABBpANqELUDIABB2AA2AhAgAEEIakEAIABBEGoQ7gEhBwJ/An8gAiwAC0EASARAIAUoAgQMAQsgBS0ACwsgACgCpANKBEACfyAFLAALQQBIBEAgBSgCBAwBCyAFLQALCyECIAAoAqQDIQgCfyAGLAALQQBIBEAgBigCBAwBCyAGLQALCyACIAhrQQF0akEBagwBCwJ/IAYsAAtBAEgEQCAGKAIEDAELIAYtAAsLQQJqCyEIIABBEGohAgJAIAAoAqQDAn8gCSwAC0EASARAIAkoAgQMAQsgCS0ACwsgCGpqIghB5QBJDQAgCEECdBCgBSEIIAcoAgAhAiAHIAg2AgAgAgRAIAIgBygCBBEMAAsgBygCACICDQAQ0wQACyACIABBBGogACADKAIEAn8gBSwAC0EASARAIAUoAgAMAQsgBQsCfyAFLAALQQBIBEAgBSgCAAwBCyAFCwJ/IAUsAAtBAEgEQCAFKAIEDAELIAUtAAsLQQJ0aiAKIAsgAEHgA2ogACgC3AMgACgC2AMgDCAJIAYgACgCpAMQtgMgASACIAAoAgQgACgCACADIAQQygIhAiAHKAIAIQEgB0EANgIAIAEEQCABIAcoAgQRDAALIAYQ2wQaIAkQ2wQaIAwQ2wQaAn8gACgC6AMiASABKAIEQX9qIgM2AgQgA0F/RgsEQCABIAEoAgAoAggRDAALIABB8ANqJAAgAgtbAQF/IwBBEGsiAyQAIAMgATYCACADIAA2AggDQCADKAIIIAMoAgBGQQFzBEAgAiADKAIILQAAOgAAIAJBAWohAiADIAMoAghBAWo2AggMAQsLIANBEGokACACC1sBAX8jAEEQayIDJAAgAyABNgIAIAMgADYCCANAIAMoAgggAygCAEZBAXMEQCACIAMoAggoAgA2AgAgAkEEaiECIAMgAygCCEEEajYCCAwBCwsgA0EQaiQAIAILKABBfwJ/An8gASwAC0EASARAIAEoAgAMAQtBAAsaQf////8HC0EBGwviAQAjAEEgayIBJAACfyABQRBqEPMBIgMhBCMAQRBrIgIkACACIAQ2AgggAigCCCEEIAJBEGokACAECwJ/IAUsAAtBAEgEQCAFKAIADAELIAULAn8gBSwAC0EASARAIAUoAgAMAQsgBQsCfyAFLAALQQBIBEAgBSgCBAwBCyAFLQALC2oQvQMCfyADLAALQQBIBEAgAygCAAwBCyADCyECAn8gABDzASEEIwBBEGsiACQAIAAgBDYCCCAAKAIIIQQgAEEQaiQAIAQLIAIgAhAjIAJqEL0DIAMQ2wQaIAFBIGokAAs/AQF/IwBBEGsiAyQAIAMgADYCCANAIAEgAkkEQCADQQhqIAEQvgMgAUEBaiEBDAELCyADKAIIGiADQRBqJAALDwAgACgCACABLAAAEOQEC9ECACMAQSBrIgEkACABQRBqEPMBIQQCfyABQQhqIgMiAkEANgIEIAJB9O4ANgIAIAJBzMQANgIAIAJBoMgANgIAIANBlMkANgIAIAMLAn8jAEEQayICJAAgAiAENgIIIAIoAgghAyACQRBqJAAgAwsCfyAFLAALQQBIBEAgBSgCAAwBCyAFCwJ/IAUsAAtBAEgEQCAFKAIADAELIAULAn8gBSwAC0EASARAIAUoAgQMAQsgBS0ACwtBAnRqEMADAn8gBCwAC0EASARAIAQoAgAMAQsgBAshAiAAEPMBIQUCfyABQQhqIgMiAEEANgIEIABB9O4ANgIAIABBzMQANgIAIABBoMgANgIAIANB9MkANgIAIAMLAn8jAEEQayIAJAAgACAFNgIIIAAoAgghAyAAQRBqJAAgAwsgAiACECMgAmoQwQMgBBDbBBogAUEgaiQAC7YBAQN/IwBBQGoiBCQAIAQgATYCOCAEQTBqIQUCQANAAkAgBkECRg0AIAIgA08NACAEIAI2AgggACAEQTBqIAIgAyAEQQhqIARBEGogBSAEQQxqIAAoAgAoAgwRCAAiBkECRg0CIARBEGohASAEKAIIIAJGDQIDQCABIAQoAgxPBEAgBCgCCCECDAMLIARBOGogARC+AyABQQFqIQEMAAALAAsLIAQoAjgaIARBQGskAA8LEIwDAAvbAQEDfyMAQaABayIEJAAgBCABNgKYASAEQZABaiEFAkADQAJAIAZBAkYNACACIANPDQAgBCACNgIIIAAgBEGQAWogAiACQSBqIAMgAyACa0EgShsgBEEIaiAEQRBqIAUgBEEMaiAAKAIAKAIQEQgAIgZBAkYNAiAEQRBqIQEgBCgCCCACRg0CA0AgASAEKAIMTwRAIAQoAgghAgwDCyAEIAEoAgA2AgQgBCgCmAEgBEEEaigCABDrBCABQQRqIQEMAAALAAsLIAQoApgBGiAEQaABaiQADwsQjAMACyEAIABBiMEANgIAIAAoAggQkAJHBEAgACgCCBDTAQsgAAvNDQEBf0H0rgFBADYCAEHwrgFB9O4ANgIAQfCuAUHMxAA2AgBB8K4BQcDAADYCABDEAxDFA0EcEMYDQaCwAUG1wAAQYEGErwEoAgBBgK8BKAIAa0ECdSEAQYCvARDHA0GArwEgABDIA0G0rAFBADYCAEGwrAFB9O4ANgIAQbCsAUHMxAA2AgBBsKwBQfjMADYCAEGwrAFB8KABEMkDEMoDQbysAUEANgIAQbisAUH07gA2AgBBuKwBQczEADYCAEG4rAFBmM0ANgIAQbisAUH4oAEQyQMQygMQywNBwKwBQbyiARDJAxDKA0HUrAFBADYCAEHQrAFB9O4ANgIAQdCsAUHMxAA2AgBB0KwBQYTFADYCAEHQrAFBtKIBEMkDEMoDQdysAUEANgIAQdisAUH07gA2AgBB2KwBQczEADYCAEHYrAFBmMYANgIAQdisAUHEogEQyQMQygNB5KwBQQA2AgBB4KwBQfTuADYCAEHgrAFBzMQANgIAQeCsAUGIwQA2AgBB6KwBEJACNgIAQeCsAUHMogEQyQMQygNB9KwBQQA2AgBB8KwBQfTuADYCAEHwrAFBzMQANgIAQfCsAUGsxwA2AgBB8KwBQdSiARDJAxDKA0H8rAFBADYCAEH4rAFB9O4ANgIAQfisAUHMxAA2AgBB+KwBQaDIADYCAEH4rAFB3KIBEMkDEMoDQYStAUEANgIAQYCtAUH07gA2AgBBgK0BQczEADYCAEGIrQFBrtgAOwEAQYCtAUG4wQA2AgBBjK0BEPMBGkGArQFB5KIBEMkDEMoDQaStAUEANgIAQaCtAUH07gA2AgBBoK0BQczEADYCAEGorQFCroCAgMAFNwIAQaCtAUHgwQA2AgBBsK0BEPMBGkGgrQFB7KIBEMkDEMoDQcStAUEANgIAQcCtAUH07gA2AgBBwK0BQczEADYCAEHArQFBuM0ANgIAQcCtAUGAoQEQyQMQygNBzK0BQQA2AgBByK0BQfTuADYCAEHIrQFBzMQANgIAQcitAUGszwA2AgBByK0BQYihARDJAxDKA0HUrQFBADYCAEHQrQFB9O4ANgIAQdCtAUHMxAA2AgBB0K0BQYDRADYCAEHQrQFBkKEBEMkDEMoDQdytAUEANgIAQditAUH07gA2AgBB2K0BQczEADYCAEHYrQFB6NIANgIAQditAUGYoQEQyQMQygNB5K0BQQA2AgBB4K0BQfTuADYCAEHgrQFBzMQANgIAQeCtAUHA2gA2AgBB4K0BQcChARDJAxDKA0HsrQFBADYCAEHorQFB9O4ANgIAQeitAUHMxAA2AgBB6K0BQdTbADYCAEHorQFByKEBEMkDEMoDQfStAUEANgIAQfCtAUH07gA2AgBB8K0BQczEADYCAEHwrQFByNwANgIAQfCtAUHQoQEQyQMQygNB/K0BQQA2AgBB+K0BQfTuADYCAEH4rQFBzMQANgIAQfitAUG83QA2AgBB+K0BQdihARDJAxDKA0GErgFBADYCAEGArgFB9O4ANgIAQYCuAUHMxAA2AgBBgK4BQbDeADYCAEGArgFB4KEBEMkDEMoDQYyuAUEANgIAQYiuAUH07gA2AgBBiK4BQczEADYCAEGIrgFB1N8ANgIAQYiuAUHooQEQyQMQygNBlK4BQQA2AgBBkK4BQfTuADYCAEGQrgFBzMQANgIAQZCuAUH44AA2AgBBkK4BQfChARDJAxDKA0GcrgFBADYCAEGYrgFB9O4ANgIAQZiuAUHMxAA2AgBBmK4BQZziADYCAEGYrgFB+KEBEMkDEMoDQaSuAUEANgIAQaCuAUH07gA2AgBBoK4BQczEADYCAEGorgFBrO4ANgIAQaCuAUGw1AA2AgBBqK4BQeDUADYCAEGgrgFBoKEBEMkDEMoDQbSuAUEANgIAQbCuAUH07gA2AgBBsK4BQczEADYCAEG4rgFB0O4ANgIAQbCuAUG41gA2AgBBuK4BQejWADYCAEGwrgFBqKEBEMkDEMoDQcSuAUEANgIAQcCuAUH07gA2AgBBwK4BQczEADYCAEHIrgEQxQRBwK4BQaTYADYCAEHArgFBsKEBEMkDEMoDQdSuAUEANgIAQdCuAUH07gA2AgBB0K4BQczEADYCAEHYrgEQxQRB0K4BQcDZADYCAEHQrgFBuKEBEMkDEMoDQeSuAUEANgIAQeCuAUH07gA2AgBB4K4BQczEADYCAEHgrgFBwOMANgIAQeCuAUGAogEQyQMQygNB7K4BQQA2AgBB6K4BQfTuADYCAEHorgFBzMQANgIAQeiuAUG45AA2AgBB6K4BQYiiARDJAxDKAws2AQF/IwBBEGsiACQAQYCvAUIANwMAIABBADYCDEGQrwFBADYCAEGQsAFBADoAACAAQRBqJAALPgEBfxC+BEEcSQRAENgEAAtBgK8BQaCvAUEcEL8EIgA2AgBBhK8BIAA2AgBBkK8BIABB8ABqNgIAQQAQwAQLPQEBfyMAQRBrIgEkAANAQYSvASgCAEEANgIAQYSvAUGErwEoAgBBBGo2AgAgAEF/aiIADQALIAFBEGokAAsMACAAIAAoAgAQxAQLPgAgACgCABogACgCACAAKAIQIAAoAgBrQQJ1QQJ0ahogACgCABogACgCACAAKAIEIAAoAgBrQQJ1QQJ0ahoLWQECfyMAQSBrIgEkACABQQA2AgwgAUHaADYCCCABIAEpAwg3AwAgAAJ/IAFBEGoiAiABKQIANwIEIAIgADYCACACCxDVAyAAKAIEIQAgAUEgaiQAIABBf2oLjwIBA38jAEEQayIDJAAgACAAKAIEQQFqNgIEIwBBEGsiAiQAIAIgADYCDCADQQhqIgAgAigCDDYCACACQRBqJAAgACECQYSvASgCAEGArwEoAgBrQQJ1IAFNBEAgAUEBahDNAwtBgK8BKAIAIAFBAnRqKAIABEACf0GArwEoAgAgAUECdGooAgAiACAAKAIEQX9qIgQ2AgQgBEF/RgsEQCAAIAAoAgAoAggRDAALCyACKAIAIQAgAkEANgIAQYCvASgCACABQQJ0aiAANgIAIAIoAgAhACACQQA2AgAgAARAAn8gACAAKAIEQX9qIgE2AgQgAUF/RgsEQCAAIAAoAgAoAggRDAALCyADQRBqJAALSwBBxKwBQQA2AgBBwKwBQfTuADYCAEHArAFBzMQANgIAQcysAUEAOgAAQcisAUEANgIAQcCsAUHUwAA2AgBByKwBQfgfKAIANgIAC1sAAkBBoKIBLQAAQQFxDQBBoKIBLQAAQQBHQQFzRQ0AEMMDQZiiAUHwrgE2AgBBnKIBQZiiATYCAEGgogFBADYCAEGgogFBoKIBKAIAQQFyNgIAC0GcogEoAgALYAEBf0GErwEoAgBBgK8BKAIAa0ECdSIBIABJBEAgACABaxDRAw8LIAEgAEsEQEGErwEoAgBBgK8BKAIAa0ECdSEBQYCvAUGArwEoAgAgAEECdGoQxARBgK8BIAEQyAMLC7MBAQR/IABBwMAANgIAIABBEGohAQNAIAIgASgCBCABKAIAa0ECdUkEQCABKAIAIAJBAnRqKAIABEACfyABKAIAIAJBAnRqKAIAIgMgAygCBEF/aiIENgIEIARBf0YLBEAgAyADKAIAKAIIEQwACwsgAkEBaiECDAELCyAAQbABahDbBBogARDPAyABKAIABEAgARDHAyABQSBqIAEoAgAgASgCECABKAIAa0ECdRDDBAsgAAtQACAAKAIAGiAAKAIAIAAoAhAgACgCAGtBAnVBAnRqGiAAKAIAIAAoAgQgACgCAGtBAnVBAnRqGiAAKAIAIAAoAhAgACgCAGtBAnVBAnRqGgsKACAAEM4DEKEFC6gBAQJ/IwBBIGsiAiQAAkBBkK8BKAIAQYSvASgCAGtBAnUgAE8EQCAAEMYDDAELIAJBCGogAEGErwEoAgBBgK8BKAIAa0ECdWoQxgRBhK8BKAIAQYCvASgCAGtBAnVBoK8BEMcEIgEgABDIBCABEMkEIAEgASgCBBDLBCABKAIABEAgASgCECABKAIAIAFBDGooAgAgASgCAGtBAnUQwwQLCyACQSBqJAALawEBfwJAQayiAS0AAEEBcQ0AQayiAS0AAEEAR0EBc0UNAEGkogEQzAMoAgAiADYCACAAIAAoAgRBAWo2AgRBqKIBQaSiATYCAEGsogFBADYCAEGsogFBrKIBKAIAQQFyNgIAC0GoogEoAgALHAAgABDSAygCACIANgIAIAAgACgCBEEBajYCBAsfACAAAn9BsKIBQbCiASgCAEEBaiIANgIAIAALNgIECzkBAn8jAEEQayICJAAgACgCAEF/RwRAIAJBCGoiAyABNgIAIAIgAzYCACAAIAIQ0gQLIAJBEGokAAsUACAABEAgACAAKAIAKAIEEQwACwsNACAAKAIAKAIAEMwECyMAIAJB/wBNBH9B+B8oAgAgAkEBdGovAQAgAXFBAEcFQQALC0UAA0AgASACRwRAIAMgASgCAEH/AE0Ef0H4HygCACABKAIAQQF0ai8BAAVBAAs7AQAgA0ECaiEDIAFBBGohAQwBCwsgAgtEAANAAkAgAiADRwR/IAIoAgBB/wBLDQFB+B8oAgAgAigCAEEBdGovAQAgAXFFDQEgAgUgAwsPCyACQQRqIQIMAAALAAtEAAJAA0AgAiADRg0BAkAgAigCAEH/AEsNAEH4HygCACACKAIAQQF0ai8BACABcUUNACACQQRqIQIMAQsLIAIhAwsgAwsdACABQf8ATQR/QYAmKAIAIAFBAnRqKAIABSABCwtAAANAIAEgAkcEQCABIAEoAgAiAEH/AE0Ef0GAJigCACABKAIAQQJ0aigCAAUgAAs2AgAgAUEEaiEBDAELCyACCx0AIAFB/wBNBH9BkDIoAgAgAUECdGooAgAFIAELC0AAA0AgASACRwRAIAEgASgCACIAQf8ATQR/QZAyKAIAIAEoAgBBAnRqKAIABSAACzYCACABQQRqIQEMAQsLIAILBAAgAQsqAANAIAEgAkZFBEAgAyABLAAANgIAIANBBGohAyABQQFqIQEMAQsLIAILEwAgASACIAFBgAFJG0EYdEEYdQs1AANAIAEgAkZFBEAgBCABKAIAIgAgAyAAQYABSRs6AAAgBEEBaiEEIAFBBGohAQwBCwsgAgspAQF/IABB1MAANgIAAkAgACgCCCIBRQ0AIAAtAAxFDQAgARChBQsgAAsKACAAEOQDEKEFCyYAIAFBAE4Ef0GAJigCACABQf8BcUECdGooAgAFIAELQRh0QRh1Cz8AA0AgASACRwRAIAEgASwAACIAQQBOBH9BgCYoAgAgASwAAEECdGooAgAFIAALOgAAIAFBAWohAQwBCwsgAgsmACABQQBOBH9BkDIoAgAgAUH/AXFBAnRqKAIABSABC0EYdEEYdQs/AANAIAEgAkcEQCABIAEsAAAiAEEATgR/QZAyKAIAIAEsAABBAnRqKAIABSAACzoAACABQQFqIQEMAQsLIAILKgADQCABIAJGRQRAIAMgAS0AADoAACADQQFqIQMgAUEBaiEBDAELCyACCwwAIAEgAiABQX9KGws0AANAIAEgAkZFBEAgBCABLAAAIgAgAyAAQX9KGzoAACAEQQFqIQQgAUEBaiEBDAELCyACCxIAIAQgAjYCACAHIAU2AgBBAwsLACAEIAI2AgBBAwtYACMAQRBrIgAkACAAIAQ2AgwgACADIAJrNgIIIwBBEGsiASQAIABBCGoiAigCACAAQQxqIgMoAgBJIQQgAUEQaiQAIAIgAyAEGygCACEBIABBEGokACABCwoAIAAQwgMQoQUL3gMBBX8jAEEQayIJJAAgAiEIA0ACQCADIAhGBEAgAyEIDAELIAgoAgBFDQAgCEEEaiEIDAELCyAHIAU2AgAgBCACNgIAQQEhCgNAAkACQAJAIAUgBkYNACACIANGDQAgCSABKQIANwMIAkACQAJAIAUgBCAIIAJrQQJ1IAYgBWsgACgCCBDyAyILQQFqIgxBAU0EQCAMQQFrRQ0FIAcgBTYCAANAAkAgAiAEKAIARg0AIAUgAigCACAAKAIIEPMDIgFBf0YNACAHIAcoAgAgAWoiBTYCACACQQRqIQIMAQsLIAQgAjYCAAwBCyAHIAcoAgAgC2oiBTYCACAFIAZGDQIgAyAIRgRAIAQoAgAhAiADIQgMBwsgCUEEakEAIAAoAggQ8wMiCEF/Rw0BC0ECIQoMAwsgCUEEaiEFIAggBiAHKAIAa0sEQAwDCwNAIAgEQCAFLQAAIQIgByAHKAIAIgtBAWo2AgAgCyACOgAAIAhBf2ohCCAFQQFqIQUMAQsLIAQgBCgCAEEEaiICNgIAIAIhCANAIAMgCEYEQCADIQgMBQsgCCgCAEUNBCAIQQRqIQgMAAALAAsgBCgCACECCyACIANHIQoLIAlBEGokACAKDwsgBygCACEFDAAACwALYwEBfyMAQRBrIgUkACAFIAQ2AgwgBUEIaiAFQQxqEJQCIQQgACABIAIgAxDWASEBIAQoAgAiAARAQYyHASgCABogAARAQYyHAUHAoAEgACAAQX9GGzYCAAsLIAVBEGokACABC18BAX8jAEEQayIDJAAgAyACNgIMIANBCGogA0EMahCUAiECIAAgARC/ASEBIAIoAgAiAARAQYyHASgCABogAARAQYyHAUHAoAEgACAAQX9GGzYCAAsLIANBEGokACABC8ADAQN/IwBBEGsiCSQAIAIhCANAAkAgAyAIRgRAIAMhCAwBCyAILQAARQ0AIAhBAWohCAwBCwsgByAFNgIAIAQgAjYCAANAAkACfwJAIAUgBkYNACACIANGDQAgCSABKQIANwMIAkACQAJAAkAgBSAEIAggAmsgBiAFa0ECdSABIAAoAggQ9QMiCkF/RgRAA0ACQCAHIAU2AgAgAiAEKAIARg0AAkAgBSACIAggAmsgCUEIaiAAKAIIEPYDIgVBAmoiAUECSw0AQQEhBQJAIAFBAWsOAgABBwsgBCACNgIADAQLIAIgBWohAiAHKAIAQQRqIQUMAQsLIAQgAjYCAAwFCyAHIAcoAgAgCkECdGoiBTYCACAFIAZGDQMgBCgCACECIAMgCEYEQCADIQgMCAsgBSACQQEgASAAKAIIEPYDRQ0BC0ECDAQLIAcgBygCAEEEajYCACAEIAQoAgBBAWoiAjYCACACIQgDQCADIAhGBEAgAyEIDAYLIAgtAABFDQUgCEEBaiEIDAAACwALIAQgAjYCAEEBDAILIAQoAgAhAgsgAiADRwshCCAJQRBqJAAgCA8LIAcoAgAhBQwAAAsAC2UBAX8jAEEQayIGJAAgBiAFNgIMIAZBCGogBkEMahCUAiEFIAAgASACIAMgBBDYASEBIAUoAgAiAARAQYyHASgCABogAARAQYyHAUHAoAEgACAAQX9GGzYCAAsLIAZBEGokACABC2MBAX8jAEEQayIFJAAgBSAENgIMIAVBCGogBUEMahCUAiEEIAAgASACIAMQmwEhASAEKAIAIgAEQEGMhwEoAgAaIAAEQEGMhwFBwKABIAAgAEF/Rhs2AgALCyAFQRBqJAAgAQuUAQEBfyMAQRBrIgUkACAEIAI2AgBBAiECAkAgBUEMakEAIAAoAggQ8wMiAEEBakECSQ0AQQEhAiAAQX9qIgEgAyAEKAIAa0sNACAFQQxqIQIDfyABBH8gAi0AACEAIAQgBCgCACIDQQFqNgIAIAMgADoAACABQX9qIQEgAkEBaiECDAEFQQALCyECCyAFQRBqJAAgAgstAQF/QX8hAQJAIAAoAggQ+QMEf0F/BSAAKAIIIgANAUEBCw8LIAAQ+gNBAUYLZgECfyMAQRBrIgEkACABIAA2AgwgAUEIaiABQQxqEJQCIQAjAEEQayICJAAgAkEQaiQAIAAoAgAiAARAQYyHASgCABogAARAQYyHAUHAoAEgACAAQX9GGzYCAAsLIAFBEGokAEEAC2cBAn8jAEEQayIBJAAgASAANgIMIAFBCGogAUEMahCUAiEAQQRBAUGMhwEoAgAoAgAbIQIgACgCACIABEBBjIcBKAIAGiAABEBBjIcBQcCgASAAIABBf0YbNgIACwsgAUEQaiQAIAILWgEEfwNAAkAgAiADRg0AIAYgBE8NACACIAMgAmsgASAAKAIIEPwDIgdBAmoiCEECTQRAQQEhByAIQQJrDQELIAZBAWohBiAFIAdqIQUgAiAHaiECDAELCyAFC2oBAX8jAEEQayIEJAAgBCADNgIMIARBCGogBEEMahCUAiEDQQAgACABIAJB7KABIAIbEJsBIQEgAygCACIABEBBjIcBKAIAGiAABEBBjIcBQcCgASAAIABBf0YbNgIACwsgBEEQaiQAIAELFQAgACgCCCIARQRAQQEPCyAAEPoDC00AIwBBEGsiACQAIAAgAjYCDCAAIAU2AgggAiADIABBDGogBSAGIABBCGoQ/wMhASAEIAAoAgw2AgAgByAAKAIINgIAIABBEGokACABC78FAQJ/IAIgADYCACAFIAM2AgAgAigCACEGAkACQANAIAYgAU8EQEEAIQAMAwtBAiEAIAYvAQAiA0H//8MASw0CAkACQCADQf8ATQRAQQEhACAEIAUoAgAiBmtBAUgNBSAFIAZBAWo2AgAgBiADOgAADAELIANB/w9NBEAgBCAFKAIAIgBrQQJIDQQgBSAAQQFqNgIAIAAgA0EGdkHAAXI6AAAgBSAFKAIAIgBBAWo2AgAgACADQT9xQYABcjoAAAwBCyADQf+vA00EQCAEIAUoAgAiAGtBA0gNBCAFIABBAWo2AgAgACADQQx2QeABcjoAACAFIAUoAgAiAEEBajYCACAAIANBBnZBP3FBgAFyOgAAIAUgBSgCACIAQQFqNgIAIAAgA0E/cUGAAXI6AAAMAQsgA0H/twNNBEBBASEAIAEgBmtBBEgNBSAGLwECIgdBgPgDcUGAuANHDQIgBCAFKAIAa0EESA0FIAdB/wdxIANBCnRBgPgDcSADQcAHcSIAQQp0cnJBgIAEakH//8MASw0CIAIgBkECajYCACAFIAUoAgAiBkEBajYCACAGIABBBnZBAWoiAEECdkHwAXI6AAAgBSAFKAIAIgZBAWo2AgAgBiAAQQR0QTBxIANBAnZBD3FyQYABcjoAACAFIAUoAgAiAEEBajYCACAAIAdBBnZBD3EgA0EEdEEwcXJBgAFyOgAAIAUgBSgCACIAQQFqNgIAIAAgB0E/cUGAAXI6AAAMAQsgA0GAwANJDQQgBCAFKAIAIgBrQQNIDQMgBSAAQQFqNgIAIAAgA0EMdkHgAXI6AAAgBSAFKAIAIgBBAWo2AgAgACADQQZ2QT9xQYABcjoAACAFIAUoAgAiAEEBajYCACAAIANBP3FBgAFyOgAACyACIAIoAgBBAmoiBjYCAAwBCwtBAg8LQQEPCyAAC00AIwBBEGsiACQAIAAgAjYCDCAAIAU2AgggAiADIABBDGogBSAGIABBCGoQgQQhASAEIAAoAgw2AgAgByAAKAIINgIAIABBEGokACABC58FAQV/IAIgADYCACAFIAM2AgACQANAIAIoAgAiACABTwRAQQAhCQwCC0EBIQkgBSgCACIHIARPDQECQCAALQAAIgNB///DAEsNACACAn8gA0EYdEEYdUEATgRAIAcgAzsBACAAQQFqDAELIANBwgFJDQEgA0HfAU0EQCABIABrQQJIDQQgAC0AASIGQcABcUGAAUcNAkECIQkgBkE/cSADQQZ0QcAPcXIiA0H//8MASw0EIAcgAzsBACAAQQJqDAELIANB7wFNBEAgASAAa0EDSA0EIAAtAAIhCCAALQABIQYCQAJAIANB7QFHBEAgA0HgAUcNASAGQeABcUGgAUcNBQwCCyAGQeABcUGAAUcNBAwBCyAGQcABcUGAAUcNAwsgCEHAAXFBgAFHDQJBAiEJIAhBP3EgBkE/cUEGdCADQQx0cnIiA0H//wNxQf//wwBLDQQgByADOwEAIABBA2oMAQsgA0H0AUsNASABIABrQQRIDQMgAC0AAyEIIAAtAAIhBiAALQABIQACQAJAIANBkH5qIgpBBEsNAAJAAkAgCkEBaw4EAgICAQALIABB8ABqQf8BcUEwTw0EDAILIABB8AFxQYABRw0DDAELIABBwAFxQYABRw0CCyAGQcABcUGAAUcNASAIQcABcUGAAUcNASAEIAdrQQRIDQNBAiEJIAhBP3EiCCAGQQZ0IgpBwB9xIABBDHRBgOAPcSADQQdxIgNBEnRycnJB///DAEsNAyAHIABBAnQiAEHAAXEgA0EIdHIgBkEEdkEDcSAAQTxxcnJBwP8AakGAsANyOwEAIAUgB0ECajYCACAHIApBwAdxIAhyQYC4A3I7AQIgAigCAEEEags2AgAgBSAFKAIAQQJqNgIADAELC0ECDwsgCQsLACACIAMgBBCDBAuABAEHfyAAIQMDQAJAIAYgAk8NACADIAFPDQAgAy0AACIEQf//wwBLDQACfyADQQFqIARBGHRBGHVBAE4NABogBEHCAUkNASAEQd8BTQRAIAEgA2tBAkgNAiADLQABIgVBwAFxQYABRw0CIAVBP3EgBEEGdEHAD3FyQf//wwBLDQIgA0ECagwBCwJAAkAgBEHvAU0EQCABIANrQQNIDQQgAy0AAiEHIAMtAAEhBSAEQe0BRg0BIARB4AFGBEAgBUHgAXFBoAFGDQMMBQsgBUHAAXFBgAFHDQQMAgsgBEH0AUsNAyACIAZrQQJJDQMgASADa0EESA0DIAMtAAMhByADLQACIQggAy0AASEFAkACQCAEQZB+aiIJQQRLDQACQAJAIAlBAWsOBAICAgEACyAFQfAAakH/AXFBMEkNAgwGCyAFQfABcUGAAUYNAQwFCyAFQcABcUGAAUcNBAsgCEHAAXFBgAFHDQMgB0HAAXFBgAFHDQMgB0E/cSAIQQZ0QcAfcSAEQRJ0QYCA8ABxIAVBP3FBDHRycnJB///DAEsNAyAGQQFqIQYgA0EEagwCCyAFQeABcUGAAUcNAgsgB0HAAXFBgAFHDQEgB0E/cSAEQQx0QYDgA3EgBUE/cUEGdHJyQf//wwBLDQEgA0EDagshAyAGQQFqIQYMAQsLIAMgAGsLBABBBAtNACMAQRBrIgAkACAAIAI2AgwgACAFNgIIIAIgAyAAQQxqIAUgBiAAQQhqEIYEIQEgBCAAKAIMNgIAIAcgACgCCDYCACAAQRBqJAAgAQvXAwEBfyACIAA2AgAgBSADNgIAIAIoAgAhAwJAA0AgAyABTwRAQQAhBgwCC0ECIQYgAygCACIAQf//wwBLDQEgAEGAcHFBgLADRg0BAkACQCAAQf8ATQRAQQEhBiAEIAUoAgAiA2tBAUgNBCAFIANBAWo2AgAgAyAAOgAADAELIABB/w9NBEAgBCAFKAIAIgNrQQJIDQIgBSADQQFqNgIAIAMgAEEGdkHAAXI6AAAgBSAFKAIAIgNBAWo2AgAgAyAAQT9xQYABcjoAAAwBCyAEIAUoAgAiA2shBiAAQf//A00EQCAGQQNIDQIgBSADQQFqNgIAIAMgAEEMdkHgAXI6AAAgBSAFKAIAIgNBAWo2AgAgAyAAQQZ2QT9xQYABcjoAACAFIAUoAgAiA0EBajYCACADIABBP3FBgAFyOgAADAELIAZBBEgNASAFIANBAWo2AgAgAyAAQRJ2QfABcjoAACAFIAUoAgAiA0EBajYCACADIABBDHZBP3FBgAFyOgAAIAUgBSgCACIDQQFqNgIAIAMgAEEGdkE/cUGAAXI6AAAgBSAFKAIAIgNBAWo2AgAgAyAAQT9xQYABcjoAAAsgAiACKAIAQQRqIgM2AgAMAQsLQQEPCyAGC00AIwBBEGsiACQAIAAgAjYCDCAAIAU2AgggAiADIABBDGogBSAGIABBCGoQiAQhASAEIAAoAgw2AgAgByAAKAIINgIAIABBEGokACABC7oEAQZ/IAIgADYCACAFIAM2AgADQCACKAIAIgYgAU8EQEEADwtBASEJAkACQAJAIAUoAgAiCyAETw0AIAYsAAAiAEH/AXEhAyAAQQBOBEAgA0H//8MASw0DQQEhAAwCCyADQcIBSQ0CIANB3wFNBEAgASAGa0ECSA0BQQIhCSAGLQABIgdBwAFxQYABRw0BQQIhACAHQT9xIANBBnRBwA9xciIDQf//wwBNDQIMAQsCQCADQe8BTQRAIAEgBmtBA0gNAiAGLQACIQggBi0AASEHAkACQCADQe0BRwRAIANB4AFHDQEgB0HgAXFBoAFGDQIMBwsgB0HgAXFBgAFGDQEMBgsgB0HAAXFBgAFHDQULIAhBwAFxQYABRg0BDAQLIANB9AFLDQMgASAGa0EESA0BIAYtAAMhCCAGLQACIQogBi0AASEHAkACQCADQZB+aiIAQQRLDQACQAJAIABBAWsOBAICAgEACyAHQfAAakH/AXFBME8NBgwCCyAHQfABcUGAAUcNBQwBCyAHQcABcUGAAUcNBAsgCkHAAXFBgAFHDQMgCEHAAXFBgAFHDQNBBCEAQQIhCSAIQT9xIApBBnRBwB9xIANBEnRBgIDwAHEgB0E/cUEMdHJyciIDQf//wwBLDQEMAgtBAyEAQQIhCSAIQT9xIANBDHRBgOADcSAHQT9xQQZ0cnIiA0H//8MATQ0BCyAJDwsgCyADNgIAIAIgACAGajYCACAFIAUoAgBBBGo2AgAMAQsLQQILCwAgAiADIAQQigQL8wMBB38gACEDA0ACQCAHIAJPDQAgAyABTw0AIAMsAAAiBEH/AXEhBQJ/IARBAE4EQCAFQf//wwBLDQIgA0EBagwBCyAFQcIBSQ0BIAVB3wFNBEAgASADa0ECSA0CIAMtAAEiBEHAAXFBgAFHDQIgBEE/cSAFQQZ0QcAPcXJB///DAEsNAiADQQJqDAELAkACQCAFQe8BTQRAIAEgA2tBA0gNBCADLQACIQYgAy0AASEEIAVB7QFGDQEgBUHgAUYEQCAEQeABcUGgAUYNAwwFCyAEQcABcUGAAUcNBAwCCyAFQfQBSw0DIAEgA2tBBEgNAyADLQADIQYgAy0AAiEIIAMtAAEhBAJAAkAgBUGQfmoiCUEESw0AAkACQCAJQQFrDgQCAgIBAAsgBEHwAGpB/wFxQTBJDQIMBgsgBEHwAXFBgAFGDQEMBQsgBEHAAXFBgAFHDQQLIAhBwAFxQYABRw0DIAZBwAFxQYABRw0DIAZBP3EgCEEGdEHAH3EgBUESdEGAgPAAcSAEQT9xQQx0cnJyQf//wwBLDQMgA0EEagwCCyAEQeABcUGAAUcNAgsgBkHAAXFBgAFHDQEgBkE/cSAFQQx0QYDgA3EgBEE/cUEGdHJyQf//wwBLDQEgA0EDagshAyAHQQFqIQcMAQsLIAMgAGsLFgAgAEG4wQA2AgAgAEEMahDbBBogAAsKACAAEIsEEKEFCxYAIABB4MEANgIAIABBEGoQ2wQaIAALCgAgABCNBBChBQsHACAALAAICwcAIAAsAAkLDAAgACABQQxqENkECwwAIAAgAUEQahDZBAsKACAAQYDCABBgCwsAIABBiMIAEJUECxwAIABCADcCACAAQQA2AgggACABIAEQ1AEQ5gQLCgAgAEGcwgAQYAsLACAAQaTCABCVBAsNACAAIAEgARAjENwEC1AAAkBB+KIBLQAAQQFxDQBB+KIBLQAAQQBHQQFzRQ0AEJoEQfSiAUGwpAE2AgBB+KIBQQA2AgBB+KIBQfiiASgCAEEBcjYCAAtB9KIBKAIAC/EBAQF/AkBB2KUBLQAAQQFxDQBB2KUBLQAAQQBHQQFzRQ0AQbCkASEAA0AgABDzAUEMaiIAQdilAUcNAAtB2KUBQQA2AgBB2KUBQdilASgCAEEBcjYCAAtBsKQBQYjlABCYBEG8pAFBj+UAEJgEQcikAUGW5QAQmARB1KQBQZ7lABCYBEHgpAFBqOUAEJgEQeykAUGx5QAQmARB+KQBQbjlABCYBEGEpQFBweUAEJgEQZClAUHF5QAQmARBnKUBQcnlABCYBEGopQFBzeUAEJgEQbSlAUHR5QAQmARBwKUBQdXlABCYBEHMpQFB2eUAEJgECxwAQdilASEAA0AgAEF0ahDbBCIAQbCkAUcNAAsLUAACQEGAowEtAABBAXENAEGAowEtAABBAEdBAXNFDQAQnQRB/KIBQeClATYCAEGAowFBADYCAEGAowFBgKMBKAIAQQFyNgIAC0H8ogEoAgAL8QEBAX8CQEGIpwEtAABBAXENAEGIpwEtAABBAEdBAXNFDQBB4KUBIQADQCAAEPMBQQxqIgBBiKcBRw0AC0GIpwFBADYCAEGIpwFBiKcBKAIAQQFyNgIAC0HgpQFB4OUAEJ8EQeylAUH85QAQnwRB+KUBQZjmABCfBEGEpgFBuOYAEJ8EQZCmAUHg5gAQnwRBnKYBQYTnABCfBEGopgFBoOcAEJ8EQbSmAUHE5wAQnwRBwKYBQdTnABCfBEHMpgFB5OcAEJ8EQdimAUH05wAQnwRB5KYBQYToABCfBEHwpgFBlOgAEJ8EQfymAUGk6AAQnwQLHABBiKcBIQADQCAAQXRqENsEIgBB4KUBRw0ACwsOACAAIAEgARDUARDnBAtQAAJAQYijAS0AAEEBcQ0AQYijAS0AAEEAR0EBc0UNABChBEGEowFBkKcBNgIAQYijAUEANgIAQYijAUGIowEoAgBBAXI2AgALQYSjASgCAAvfAgEBfwJAQbCpAS0AAEEBcQ0AQbCpAS0AAEEAR0EBc0UNAEGQpwEhAANAIAAQ8wFBDGoiAEGwqQFHDQALQbCpAUEANgIAQbCpAUGwqQEoAgBBAXI2AgALQZCnAUG06AAQmARBnKcBQbzoABCYBEGopwFBxegAEJgEQbSnAUHL6AAQmARBwKcBQdHoABCYBEHMpwFB1egAEJgEQdinAUHa6AAQmARB5KcBQd/oABCYBEHwpwFB5ugAEJgEQfynAUHw6AAQmARBiKgBQfjoABCYBEGUqAFBgekAEJgEQaCoAUGK6QAQmARBrKgBQY7pABCYBEG4qAFBkukAEJgEQcSoAUGW6QAQmARB0KgBQdHoABCYBEHcqAFBmukAEJgEQeioAUGe6QAQmARB9KgBQaLpABCYBEGAqQFBpukAEJgEQYypAUGq6QAQmARBmKkBQa7pABCYBEGkqQFBsukAEJgECxwAQbCpASEAA0AgAEF0ahDbBCIAQZCnAUcNAAsLUAACQEGQowEtAABBAXENAEGQowEtAABBAEdBAXNFDQAQpARBjKMBQcCpATYCAEGQowFBADYCAEGQowFBkKMBKAIAQQFyNgIAC0GMowEoAgAL3wIBAX8CQEHgqwEtAABBAXENAEHgqwEtAABBAEdBAXNFDQBBwKkBIQADQCAAEPMBQQxqIgBB4KsBRw0AC0HgqwFBADYCAEHgqwFB4KsBKAIAQQFyNgIAC0HAqQFBuOkAEJ8EQcypAUHY6QAQnwRB2KkBQfzpABCfBEHkqQFBlOoAEJ8EQfCpAUGs6gAQnwRB/KkBQbzqABCfBEGIqgFB0OoAEJ8EQZSqAUHk6gAQnwRBoKoBQYDrABCfBEGsqgFBqOsAEJ8EQbiqAUHI6wAQnwRBxKoBQezrABCfBEHQqgFBkOwAEJ8EQdyqAUGg7AAQnwRB6KoBQbDsABCfBEH0qgFBwOwAEJ8EQYCrAUGs6gAQnwRBjKsBQdDsABCfBEGYqwFB4OwAEJ8EQaSrAUHw7AAQnwRBsKsBQYDtABCfBEG8qwFBkO0AEJ8EQcirAUGg7QAQnwRB1KsBQbDtABCfBAscAEHgqwEhAANAIABBdGoQ2wQiAEHAqQFHDQALC1AAAkBBmKMBLQAAQQFxDQBBmKMBLQAAQQBHQQFzRQ0AEKcEQZSjAUHwqwE2AgBBmKMBQQA2AgBBmKMBQZijASgCAEEBcjYCAAtBlKMBKAIAC20BAX8CQEGIrAEtAABBAXENAEGIrAEtAABBAEdBAXNFDQBB8KsBIQADQCAAEPMBQQxqIgBBiKwBRw0AC0GIrAFBADYCAEGIrAFBiKwBKAIAQQFyNgIAC0HwqwFBwO0AEJgEQfyrAUHD7QAQmAQLHABBiKwBIQADQCAAQXRqENsEIgBB8KsBRw0ACwtQAAJAQaCjAS0AAEEBcQ0AQaCjAS0AAEEAR0EBc0UNABCqBEGcowFBkKwBNgIAQaCjAUEANgIAQaCjAUGgowEoAgBBAXI2AgALQZyjASgCAAttAQF/AkBBqKwBLQAAQQFxDQBBqKwBLQAAQQBHQQFzRQ0AQZCsASEAA0AgABDzAUEMaiIAQaisAUcNAAtBqKwBQQA2AgBBqKwBQaisASgCAEEBcjYCAAtBkKwBQcjtABCfBEGcrAFB1O0AEJ8ECxwAQaisASEAA0AgAEF0ahDbBCIAQZCsAUcNAAsLSQACQEGwowEtAABBAXENAEGwowEtAABBAEdBAXNFDQBBpKMBQbzCABBgQbCjAUEANgIAQbCjAUGwowEoAgBBAXI2AgALQaSjAQsKAEGkowEQ2wQaC0oAAkBBwKMBLQAAQQFxDQBBwKMBLQAAQQBHQQFzRQ0AQbSjAUHIwgAQlQRBwKMBQQA2AgBBwKMBQcCjASgCAEEBcjYCAAtBtKMBCwoAQbSjARDbBBoLSQACQEHQowEtAABBAXENAEHQowEtAABBAEdBAXNFDQBBxKMBQezCABBgQdCjAUEANgIAQdCjAUHQowEoAgBBAXI2AgALQcSjAQsKAEHEowEQ2wQaC0oAAkBB4KMBLQAAQQFxDQBB4KMBLQAAQQBHQQFzRQ0AQdSjAUH4wgAQlQRB4KMBQQA2AgBB4KMBQeCjASgCAEEBcjYCAAtB1KMBCwoAQdSjARDbBBoLSQACQEHwowEtAABBAXENAEHwowEtAABBAEdBAXNFDQBB5KMBQZzDABBgQfCjAUEANgIAQfCjAUHwowEoAgBBAXI2AgALQeSjAQsKAEHkowEQ2wQaC0oAAkBBgKQBLQAAQQFxDQBBgKQBLQAAQQBHQQFzRQ0AQfSjAUG0wwAQlQRBgKQBQQA2AgBBgKQBQYCkASgCAEEBcjYCAAtB9KMBCwoAQfSjARDbBBoLSQACQEGQpAEtAABBAXENAEGQpAEtAABBAEdBAXNFDQBBhKQBQYjEABBgQZCkAUEANgIAQZCkAUGQpAEoAgBBAXI2AgALQYSkAQsKAEGEpAEQ2wQaC0oAAkBBoKQBLQAAQQFxDQBBoKQBLQAAQQBHQQFzRQ0AQZSkAUGUxAAQlQRBoKQBQQA2AgBBoKQBQaCkASgCAEEBcjYCAAtBlKQBCwoAQZSkARDbBBoLCgAgABC9BBChBQsYACAAKAIIEJACRwRAIAAoAggQ0wELIAALXwEFfyMAQRBrIgAkACAAQf////8DNgIMIABB/////wc2AggjAEEQayIBJAAgAEEIaiICKAIAIABBDGoiAygCAEkhBCABQRBqJAAgAiADIAQbKAIAIQEgAEEQaiQAIAELCQAgACABEMEEC04AQYCvASgCABpBgK8BKAIAQZCvASgCAEGArwEoAgBrQQJ1QQJ0ahpBgK8BKAIAQZCvASgCAEGArwEoAgBrQQJ1QQJ0ahpBgK8BKAIAGgslAAJAIAFBHEsNACAALQBwDQAgAEEBOgBwIAAPCyABQQJ0ENQECxMAQX8gAEkEQBCMAwALIAAQ1AQLGwACQCAAIAFGBEAgAEEAOgBwDAELIAEQoQULCyYBAX8gACgCBCECA0AgASACRwRAIAJBfGohAgwBCwsgACABNgIECwoAIAAQkAI2AgALhwEBBH8jAEEQayICJAAgAiAANgIMEL4EIgEgAE8EQEGQrwEoAgBBgK8BKAIAa0ECdSIAIAFBAXZJBEAgAiAAQQF0NgIIIwBBEGsiACQAIAJBCGoiASgCACACQQxqIgMoAgBJIQQgAEEQaiQAIAMgASAEGygCACEBCyACQRBqJAAgAQ8LENgEAAtuAQN/IwBBEGsiBSQAIAVBADYCDCAAQQxqIgZBADYCACAGIAM2AgQgAQRAIAAoAhAgARC/BCEECyAAIAQ2AgAgACAEIAJBAnRqIgI2AgggACACNgIEIABBDGogBCABQQJ0ajYCACAFQRBqJAAgAAszAQF/IAAoAhAaIAAoAgghAgNAIAJBADYCACAAIAAoAghBBGoiAjYCCCABQX9qIgENAAsLZAEBf0GArwEQzwNBoK8BQYCvASgCAEGErwEoAgAgAEEEaiIBEMoEQYCvASABEGNBhK8BIABBCGoQY0GQrwEgAEEMahBjIAAgACgCBDYCAEGErwEoAgBBgK8BKAIAa0ECdRDABAsoACADIAMoAgAgAiABayIAayICNgIAIABBAU4EQCACIAEgABCpBRoLCyUAA0AgASAAKAIIRwRAIAAoAhAaIAAgACgCCEF8ajYCCAwBCwsLOAECfyAAKAIAIAAoAggiAkEBdWohASAAKAIEIQAgASACQQFxBH8gASgCACAAaigCAAUgAAsRDAALGgBB/////wMgAEkEQBCMAwALIABBAnQQ1AQLUAEBfyAAEJsDIAAsAAtBAEgEQCAAKAIAIQEgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEKCxogARChBSAAQYCAgIB4NgIIIABBADoACwsLUAEBfyAAEKgDIAAsAAtBAEgEQCAAKAIAIQEgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEBCxogARChBSAAQYCAgIB4NgIIIABBADoACwsLOgIBfwF+IwBBEGsiAyQAIAMgASACEJACEOABIAMpAwAhBCAAIAMpAwg3AwggACAENwMAIANBEGokAAsDAAALLgADQCAAKAIAQQFGDQALIAAoAgBFBEAgAEEBNgIAIAFB2wARDAAgAEF/NgIACwsFABANAAsxAQJ/IABBASAAGyEAA0ACQCAAEKAFIgENAEH8sAEoAgAiAkUNACACEQ4ADAELCyABCykBAX8gAgRAIAAhAwNAIAMgATYCACADQQRqIQMgAkF/aiICDQALCyAAC2kBAX8CQCAAIAFrQQJ1IAJJBEADQCAAIAJBf2oiAkECdCIDaiABIANqKAIANgIAIAINAAwCAAsACyACRQ0AIAAhAwNAIAMgASgCADYCACADQQRqIQMgAUEEaiEBIAJBf2oiAg0ACwsgAAt+AQN/IwBBEGsiASQAIAFBCjoADwJAIAAoAhAiAkUEQCAAEHINASAAKAIQIQILAkAgACgCFCIDIAJPDQAgACwAS0EKRg0AIAAgA0EBajYCFCADQQo6AAAMAQsgACABQQ9qQQEgACgCJBEEAEEBRw0AIAEtAA8aCyABQRBqJAALBgAQjAMAC1kBAn8jAEEQayIDJAAgAEIANwIAIABBADYCCCAAIQICQCABLAALQQBOBEAgAiABKAIINgIIIAIgASkCADcCAAwBCyAAIAEoAgAgASgCBBDaBAsgA0EQaiQAC5sBAQN/IwBBEGsiBCQAQW8gAk8EQAJAIAJBCk0EQCAAIAI6AAsgACEDDAELIAAgAkELTwR/IAJBEGpBcHEiAyADQX9qIgMgA0ELRhsFQQoLQQFqIgUQwgQiAzYCACAAIAVBgICAgHhyNgIIIAAgAjYCBAsgAyABIAIQMSAEQQA6AA8gAiADaiAELQAPOgAAIARBEGokAA8LENgEAAsdACAALAALQQBIBEAgACgCCBogACgCABChBQsgAAvJAQEDfyMAQRBrIgQkAAJAIAAsAAtBAEgEfyAAKAIIQf////8HcUF/agVBCgsiAyACTwRAAn8gACwAC0EASARAIAAoAgAMAQsgAAsiAyEFIAIEQCAFIAEgAhCrBQsgBEEAOgAPIAIgA2ogBC0ADzoAAAJAIAAsAAtBAEgEQCAAIAI2AgQMAQsgACACOgALCwwBCyAAIAMgAiADawJ/IAAsAAtBAEgEQCAAKAIEDAELIAAtAAsLIgBBACAAIAIgARDdBAsgBEEQaiQAC8kCAQV/IwBBEGsiCCQAIAFBf3NBb2ogAk8EQAJ/IAAsAAtBAEgEQCAAKAIADAELIAALIQkCf0Hn////ByABSwRAIAggAUEBdDYCCCAIIAEgAmo2AgwCfyMAQRBrIgIkACAIQQxqIgooAgAgCEEIaiILKAIASSEMIAJBEGokACALIAogDBsoAgAiAkELTwsEfyACQRBqQXBxIgIgAkF/aiICIAJBC0YbBUEKCwwBC0FuC0EBaiIKEMIEIQIgBARAIAIgCSAEEDELIAYEQCACIARqIAcgBhAxCyADIAVrIgMgBGsiBwRAIAIgBGogBmogBCAJaiAFaiAHEDELIAFBCkcEQCAJEKEFCyAAIAI2AgAgACAKQYCAgIB4cjYCCCAAIAMgBmoiADYCBCAIQQA6AAcgACACaiAILQAHOgAAIAhBEGokAA8LENgEAAs4AQF/An8gACwAC0EASARAIAAoAgQMAQsgAC0ACwsiAiABSQRAIAAgASACaxDfBA8LIAAgARDgBAvJAQEEfyMAQRBrIgUkACABBEAgACwAC0EASAR/IAAoAghB/////wdxQX9qBUEKCyECAn8gACwAC0EASARAIAAoAgQMAQsgAC0ACwsiAyABaiEEIAIgA2sgAUkEQCAAIAIgBCACayADIAMQ4QQLIAMCfyAALAALQQBIBEAgACgCAAwBCyAACyICaiABQQAQ4gQCQCAALAALQQBIBEAgACAENgIEDAELIAAgBDoACwsgBUEAOgAPIAIgBGogBS0ADzoAAAsgBUEQaiQAC2EBAn8jAEEQayICJAACQCAALAALQQBIBEAgACgCACEDIAJBADoADyABIANqIAItAA86AAAgACABNgIEDAELIAJBADoADiAAIAFqIAItAA46AAAgACABOgALCyACQRBqJAALiwIBBX8jAEEQayIFJABBbyABayACTwRAAn8gACwAC0EASARAIAAoAgAMAQsgAAshBgJ/Qef///8HIAFLBEAgBSABQQF0NgIIIAUgASACajYCDAJ/IwBBEGsiAiQAIAVBDGoiBygCACAFQQhqIggoAgBJIQkgAkEQaiQAIAggByAJGygCACICQQtPCwR/IAJBEGpBcHEiAiACQX9qIgIgAkELRhsFQQoLDAELQW4LQQFqIgcQwgQhAiAEBEAgAiAGIAQQMQsgAyAEayIDBEAgAiAEaiAEIAZqIAMQMQsgAUEKRwRAIAYQoQULIAAgAjYCACAAIAdBgICAgHhyNgIIIAVBEGokAA8LENgEAAsVACABBEAgACACQf8BcSABEKoFGgsL1gEBA38jAEEQayIFJAACQCAALAALQQBIBH8gACgCCEH/////B3FBf2oFQQoLIgQCfyAALAALQQBIBEAgACgCBAwBCyAALQALCyIDayACTwRAIAJFDQECfyAALAALQQBIBEAgACgCAAwBCyAACyIEIANqIAEgAhAxIAIgA2oiAiEBAkAgACwAC0EASARAIAAgATYCBAwBCyAAIAE6AAsLIAVBADoADyACIARqIAUtAA86AAAMAQsgACAEIAIgA2ogBGsgAyADQQAgAiABEN0ECyAFQRBqJAALugEBA38jAEEQayIDJAAgAyABOgAPAkACQAJAAn8gACwAC0EASCIERQRAQQohAiAALQALDAELIAAoAghB/////wdxQX9qIQIgACgCBAsiASACRgRAIAAgAkEBIAIgAhDhBCAALAALQQBODQEMAgsgBA0BCyAAIgIgAUEBajoACwwBCyAAKAIAIQIgACABQQFqNgIECyABIAJqIgAgAy0ADzoAACADQQA6AA4gACADLQAOOgABIANBEGokAAucAQEDfyMAQRBrIgQkAEFvIAFPBEACQCABQQpNBEAgACABOgALIAAhAwwBCyAAIAFBC08EfyABQRBqQXBxIgMgA0F/aiIDIANBC0YbBUEKC0EBaiIFEMIEIgM2AgAgACAFQYCAgIB4cjYCCCAAIAE2AgQLIAMgASACEOIEIARBADoADyABIANqIAQtAA86AAAgBEEQaiQADwsQ2AQAC6IBAQN/IwBBEGsiBCQAQe////8DIAJPBEACQCACQQFNBEAgACACOgALIAAhAwwBCyAAIAJBAk8EfyACQQRqQXxxIgMgA0F/aiIDIANBAkYbBUEBC0EBaiIFEM0EIgM2AgAgACAFQYCAgIB4cjYCCCAAIAI2AgQLIAMgASACEDogBEEANgIMIAMgAkECdGogBCgCDDYCACAEQRBqJAAPCxDYBAAL0AEBA38jAEEQayIEJAACQCAALAALQQBIBH8gACgCCEH/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ACIDQXhqKAIAIQUgA0F8aigCACEDIAJBADYCFCACQZDwADYCECACIAA2AgwgAiABNgIIIAJBGGpBAEEnEKoFGiAAIAVqIQACQCADIAFBABDxBARAIAJBATYCOCADIAJBCGogACAAQQFBACADKAIAKAIUEQ8AIABBACACKAIgQQFGGyEEDAELIAMgAkEIaiAAQQFBACADKAIAKAIYERAAIAIoAiwiAEEBSw0AIABBAWsEQCACKAIcQQAgAigCKEEBRhtBACACKAIkQQFGG0EAIAIoAjBBAUYbIQQMAQsgAigCIEEBRwRAIAIoAjANASACKAIkQQFHDQEgAigCKEEBRw0BCyACKAIYIQQLIAJBQGskACAEC10BAX8gACgCECIDRQRAIABBATYCJCAAIAI2AhggACABNgIQDwsCQCABIANGBEAgACgCGEECRw0BIAAgAjYCGA8LIABBAToANiAAQQI2AhggACAAKAIkQQFqNgIkCwsaACAAIAEoAghBABDxBARAIAEgAiADEPQECwszACAAIAEoAghBABDxBARAIAEgAiADEPQEDwsgACgCCCIAIAEgAiADIAAoAgAoAhwRAgALUgEBfyAAKAIEIQQgACgCACIAIAECf0EAIAJFDQAaIARBCHUiASAEQQFxRQ0AGiACKAIAIAFqKAIACyACaiADQQIgBEECcRsgACgCACgCHBECAAtwAQJ/IAAgASgCCEEAEPEEBEAgASACIAMQ9AQPCyAAKAIMIQQgAEEQaiIFIAEgAiADEPcEAkAgBEECSA0AIAUgBEEDdGohBCAAQRhqIQADQCAAIAEgAiADEPcEIAEtADYNASAAQQhqIgAgBEkNAAsLC0AAAkAgACABIAAtAAhBGHEEf0EBBUEAIQAgAUUNASABQfDwABDzBCIBRQ0BIAEtAAhBGHFBAEcLEPEEIQALIAAL6QMBBH8jAEFAaiIFJAACQAJAAkAgAUH88gBBABDxBARAIAJBADYCAAwBCyAAIAEQ+QQEQEEBIQMgAigCACIARQ0DIAIgACgCADYCAAwDCyABRQ0BIAFBoPEAEPMEIgFFDQIgAigCACIEBEAgAiAEKAIANgIACyABKAIIIgQgACgCCCIGQX9zcUEHcQ0CIARBf3MgBnFB4ABxDQJBASEDIAAoAgwgASgCDEEAEPEEDQIgACgCDEHw8gBBABDx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AAsLIAAL5QIBAn8CQCAAIAFGDQACQCABIAJqIABLBEAgACACaiIEIAFLDQELIAAgASACEKkFGg8LIAAgAXNBA3EhAwJAAkAgACABSQRAIAMNAiAAQQNxRQ0BA0AgAkUNBCAAIAEtAAA6AAAgAUEBaiEBIAJBf2ohAiAAQQFqIgBBA3ENAAsMAQsCQCADDQAgBEEDcQRAA0AgAkUNBSAAIAJBf2oiAmoiAyABIAJqLQAAOgAAIANBA3ENAAsLIAJBA00NAANAIAAgAkF8aiICaiABIAJqKAIANgIAIAJBA0sNAAsLIAJFDQIDQCAAIAJBf2oiAmogASACai0AADoAACACDQALDAILIAJBA00NACACIQMDQCAAIAEoAgA2AgAgAUEEaiEBIABBBGohACADQXxqIgNBA0sNAAsgAkEDcSECCyACRQ0AA0AgACABLQAAOgAAIABBAWohACABQQFqIQEgAkF/aiICDQALCwsfAEH0tAEoAgBFBEBB+LQBIAE2AgBB9LQBIAA2AgALCwQAIwALEAAjACAAa0FwcSIAJAAgAAsGACAAJAALBgAgAEAACwkAIAEgABEAAAsJACABIAARDAALCwAgASACIAARAQALDwAgASACIAMgBCAAEQIACxEAIAEgAiADIAQgBSAAERAACwsAIAEgAiAAEQcACw0AIAEgAiADIAARBAALEwAgASACIAMgBCAFIAYgABEKAAsPACABIAIgAyAEIAARDQALEQAgASACIAMgBCAFIAARCQALFwAgASACIAMgBCAFIAYgByAIIAARCAALEwAgASACIAMgBCAFIAYgABELAAsRACABIAIgAyAEIAUgABEFAAsVACABIAIgAyAEIAUgBiAHIAARIgALEwAgASACIAMgBCAFIAYgABEPAAsHACAAEQ4ACxkAIAEgAiADrSAErUIghoQgBSAGIAARFAALIgEBfiABIAKtIAOtQiCGhCAEIAARBgAiBUIgiKcQGCAFpwsZACABIAIgAyAEIAWtIAatQiCGhCAAESwACyMAIAEgAiADIAQgBa0gBq1CIIaEIAetIAitQiCGhCAAES0ACyUAIAEgAiADIAQgBSAGrSAHrUIghoQgCK0gCa1CIIaEIAARMAALC8tkOQBBgAgLowFWYXJpYWJsZUJ1ZmZlcktlcm5lbABwcm9jZXNzADIwVmFyaWFibGVCdWZmZXJLZXJuZWwAHDoAAB0EAABQMjBWYXJpYWJsZUJ1ZmZlcktlcm5lbAD8OgAAPAQAAAAAAAA0BAAAUEsyMFZhcmlhYmxlQnVmZmVyS2VybmVsAAAAAPw6AABkBAAAAQAAADQEAABpaQB2AHZpAFQEAADcOQAAaWlpAEGwCQv9AXA5AABUBAAA9DkAAPQ5AADcOQAAdmlpaWlpAAAAAAAA/AYAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAABAAAAARAAAAEgAAABMAAAAUAAAAAAAAADgHAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAACAAAAAhAAAAIgAAAAgAAAAAAAAAcAcAACMAAAAkAAAA+P////j///9wBwAAJQAAACYAAABYBQAAbAUAAAgAAAAAAAAAuAcAACcAAAAoAAAA+P////j///+4BwAAKQAAACoAAACIBQAAnAUAAAQAQbULC+MMCAAAKwAAACwAAAD8/////P///wAIAAAtAAAALgAAALgFAADMBQAABAAAAAAAAABICAAALwAAADAAAAD8/////P///0gIAAAxAAAAMgAAAOgFAAD8BQAAAAAAADAGAAAzAAAANAAAAE5TdDNfXzI4aW9zX2Jhc2VFAAAAHDoAABwGAAAAAAAAdAYAADUAAAA2AAAATlN0M19fMjliYXNpY19pb3NJY05TXzExY2hhcl90cmFpdHNJY0VFRUUAAABEOgAASAYAADAGAAAAAAAAvAYAADcAAAA4AAAATlN0M19fMjliYXNpY19pb3NJd05TXzExY2hhcl90cmFpdHNJd0VFRUUAAABEOgAAkAYAADAGAABOU3QzX18yMTViYXNpY19zdHJlYW1idWZJY05TXzExY2hhcl90cmFpdHNJY0VFRUUAAAAAHDoAAMgGAABOU3QzX18yMTViYXNpY19zdHJlYW1idWZJd05TXzExY2hhcl90cmFpdHNJd0VFRUUAAAAAHDoAAAQHAABOU3QzX18yMTNiYXNpY19pc3RyZWFtSWNOU18xMWNoYXJfdHJhaXRzSWNFRUVFAACgOgAAQAcAAAAAAAABAAAAdAYAAAP0//9OU3QzX18yMTNiYXNpY19pc3RyZWFtSXdOU18xMWNoYXJfdHJhaXRzSXdFRUVFAACgOgAAiAcAAAAAAAABAAAAvAYAAAP0//9OU3QzX18yMTNiYXNpY19vc3RyZWFtSWNOU18xMWNoYXJfdHJhaXRzSWNFRUVFAACgOgAA0AcAAAAAAAABAAAAdAYAAAP0//9OU3QzX18yMTNiYXNpY19vc3RyZWFtSXdOU18xMWNoYXJfdHJhaXRzSXdFRUVFAACgOgAAGAgAAAAAAAABAAAAvAYAAAP0//8YQQAAqEEAAEBCAAAAAAAAxAgAAAcAAABAAAAAQQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAAEIAAABDAAAARAAAABMAAAAUAAAATlN0M19fMjEwX19zdGRpbmJ1ZkljRUUARDoAAKwIAAD8BgAAdW5zdXBwb3J0ZWQgbG9jYWxlIGZvciBzdGFuZGFyZCBpbnB1dAAAAAAAAABQCQAAFQAAAEUAAABGAAAAGAAAABkAAAAaAAAAGwAAABwAAAAdAAAARwAAAEgAAABJAAAAIQAAACIAAABOU3QzX18yMTBfX3N0ZGluYnVmSXdFRQBEOgAAOAkAADgHAAAAAAAAuAkAAAcAAABKAAAASwAAAAoAAAALAAAADAAAAEwAAAAOAAAADwAAABAAAAARAAAAEgAAAE0AAABOAAAATlN0M19fMjExX19zdGRvdXRidWZJY0VFAAAAAEQ6AACcCQAA/AYAAAAAAAAgCgAAFQAAAE8AAABQAAAAGAAAABkAAAAaAAAAUQAAABwAAAAdAAAAHgAAAB8AAAAgAAAAUgAAAFMAAABOU3QzX18yMTFfX3N0ZG91dGJ1Zkl3RUUAAAAARDoAAAQKAAA4BwAAAAAAAP////////////////////////////////////////////////////////////////8AAQIDBAUGBwgJ/////////woLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIj////////CgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiP/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAEC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AE5TdDNfXzI5bW9uZXlfZ2V0SWNOU18xOWlzdHJlYW1idWZfaXRlcmF0b3JJY05TXzExY2hhcl90cmFpdHNJY0VFRUVFRQBOU3QzX18yMTFfX21vbmV5X2dldEljRUUAABw6AACKLwAAoDoAAEQvAAAAAAAAAgAAAHAiAAACAAAApC8AQdDfAAuaAVAwAACOAAAAPAEAAGwAAAA9AQAAPgEAAE5TdDNfXzI5bW9uZXlfZ2V0SXdOU18xOWlzdHJlYW1idWZfaXRlcmF0b3JJd05TXzExY2hhcl90cmFpdHNJd0VFRUVFRQBOU3QzX18yMTFfX21vbmV5X2dldEl3RUUAABw6AAAuMAAAoDoAAOgvAAAAAAAAAgAAAHAiAAACAAAASDAAQfTgAAuaAfQwAACOAAAAPwEAAGwAAABAAQAAQQEAAE5TdDNfXzI5bW9uZXlfcHV0SWNOU18xOW9zdHJlYW1idWZfaXRlcmF0b3JJY05TXzExY2hhcl90cmFpdHNJY0VFRUVFRQBOU3QzX18yMTFfX21vbmV5X3B1dEljRUUAABw6AADSMAAAoDoAAIwwAAAAAAAAAgAAAHAiAAACAAAA7DAAQZjiAAuaAZgxAACOAAAAQgEAAGwAAABDAQAARAEAAE5TdDNfXzI5bW9uZXlfcHV0SXdOU18xOW9zdHJlYW1idWZfaXRlcmF0b3JJd05TXzExY2hhcl90cmFpdHNJd0VFRUVFRQBOU3QzX18yMTFfX21vbmV5X3B1dEl3RUUAABw6AAB2MQAAoDoAADAxAAAAAAAAAgAAAHAiAAACAAAAkDEAQbzjAAvWHhAyAACOAAAARQEAAGwAAABGAQAARwEAAEgBAABOU3QzX18yOG1lc3NhZ2VzSWNFRQBOU3QzX18yMTNtZXNzYWdlc19iYXNlRQAAAAAcOgAA7TEAAKA6AADYMQAAAAAAAAIAAABwIgAAAgAAAAgyAAACAAAAAAAAAGgyAACOAAAASQEAAGwAAABKAQAASwEAAEwBAABOU3QzX18yOG1lc3NhZ2VzSXdFRQAAAACgOgAAUDIAAAAAAAACAAAAcCIAAAIAAAAIMgAAAgAAAFN1bmRheQBNb25kYXkAVHVlc2RheQBXZWRuZXNkYXkAVGh1cnNkYXkARnJpZGF5AFNhdHVyZGF5AFN1bgBNb24AVHVlAFdl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AGoAAAAkOQAA2DkAAGwAAAAkOQAA5DkAAG0AAAAkOQAA8DkAAGYAAAAkOQAA/DkAAGQAAAAkOQAACDoAAAAAAABAOAAAUAEAAFUBAABSAQAAUwEAAFYBAABXAQAAWAEAAFkBAAAAAAAAjDoAAFABAABaAQAAUgEAAFMBAABWAQAAWwEAAFwBAABdAQAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAAEQ6AABkOgAAQDgAAAAAAADoOgAAUAEAAF4BAABSAQAAUwEAAFYBAABfAQAAYAEAAGEBAABOMTBfX2N4eGFiaXYxMjFfX3ZtaV9jbGFzc190eXBlX2luZm9FAAAARDoAAMA6AABAOAAAAAAAAKA4AABQAQAAYgEAAFIBAABTAQAAYwEAAHZvaWQAYm9vbABjaGFyAHNpZ25lZCBjaGFyAHVuc2lnbmVkIGNoYXIAc2hvcnQAdW5zaWduZWQgc2hvcnQAaW50AHVuc2lnbmVkIGludABsb25nAHVuc2lnbmVkIGxvbmcAZmxvYXQAZG91YmxlAHN0ZDo6c3RyaW5nAHN0ZDo6YmFzaWNfc3RyaW5nPHVuc2lnbmVkIGNoYXI+AHN0ZDo6d3N0cmluZwBlbXNjcmlwdGVuOjp2YWwAZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8Y2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGNoYXI+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBzaG9ydD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1bnNpZ25lZCBpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGxvbmc+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDhfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDE2X3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVpbnQzMl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxmbG9hdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8ZG91YmxlPgBOU3QzX18yMTJiYXNpY19zdHJpbmdJY05TXzExY2hhcl90cmFpdHNJY0VFTlNfOWFsbG9jYXRvckljRUVFRQBOU3QzX18yMjFfX2Jhc2ljX3N0cmluZ19jb21tb25JTGIxRUVFAAAAABw6AABHPgAAoDoAAAg+AAAAAAAAAQAAAHA+AAAAAAAATlN0M19fMjEyYmFzaWNfc3RyaW5nSWhOU18xMWNoYXJfdHJhaXRzSWhFRU5TXzlhbGxvY2F0b3JJaEVFRUUAAKA6AACQPgAAAAAAAAEAAABwPgAAAAAAAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0l3TlNfMTFjaGFyX3RyYWl0c0l3RUVOU185YWxsb2NhdG9ySXdFRUVFAACgOgAA6D4AAAAAAAABAAAAcD4AAAAAAABOMTBlbXNjcmlwdGVuM3ZhbEUAABw6AABAPwAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJY0VFAAAcOgAAXD8AAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWFFRQAAHDoAAIQ/AABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0loRUUAABw6AACsPwAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJc0VFAAAcOgAA1D8AAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXRFRQAAHDoAAPw/AABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lpRUUAABw6AAAkQAAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJakVFAAAcOgAATEAAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWxFRQAAHDoAAHRAAABOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ltRUUAABw6AACcQAAATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZkVFAAAcOgAAxEAAAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWRFRQAAHDoAAOxAAEGYggELAQkAQaSCAQsBOQBBuIIBCxI6AAAAAAAAADsAAADoQwAAAAQAQeSCAQsE/////wBBqIMBCwEFAEG0gwELATwAQcyDAQsOPQAAAD4AAAD4RwAAAAQAQeSDAQsBAQBB84MBCwUK/////wBBuIQBCwmoQQAAAAAAAAUAQcyEAQsBOQBB5IQBCwo9AAAAOwAAAABMAEH8hAELAQIAQYuFAQsF//////8AQYyHAQsCQFAAnYwFBG5hbWUBlIwFxgUAFl9lbWJpbmRfcmVnaXN0ZXJfY2xhc3MBIl9lbWJpbmRfcmVnaXN0ZXJfY2xhc3NfY29uc3RydWN0b3ICH19lbWJpbmRfcmVnaXN0ZXJfY2xhc3NfZnVuY3Rpb24DD19fd2FzaV9mZF9jbG9zZQQOX193YXNpX2ZkX3JlYWQFD19fd2FzaV9mZF93cml0ZQYGX19sb2NrBwhfX3VubG9jawgYX193YXNpX2Vudmlyb25fc2l6ZXNfZ2V0CRJfX3dhc2lfZW52aXJvbl9nZXQKCl9fbWFwX2ZpbGULC19fc3lzY2FsbDkxDApzdHJmdGltZV9sDQVhYm9ydA4VX2VtYmluZF9yZWdpc3Rlcl92b2lkDxVfZW1iaW5kX3JlZ2lzdGVyX2Jvb2wQG19lbWJpbmRfcmVnaXN0ZXJfc3RkX3N0cmluZxEcX2VtYmluZF9yZWdpc3Rlcl9zdGRfd3N0cmluZxIWX2VtYmluZF9yZWdpc3Rlcl9lbXZhbBMYX2VtYmluZF9yZWdpc3Rlcl9pbnRlZ2VyFBZfZW1iaW5kX3JlZ2lzdGVyX2Zsb2F0FRxfZW1iaW5kX3JlZ2lzdGVyX21lbW9yeV92aWV3FhZlbXNjcmlwdGVuX3Jlc2l6ZV9oZWFwFxVlbXNjcmlwdGVuX21lbWNweV9iaWcYC3NldFRlbXBSZXQwGRpsZWdhbGltcG9ydCRfX3dhc2lfZmRfc2VlaxoRX193YXNtX2NhbGxfY3RvcnMbXHZvaWQgY29uc3QqIGVtc2NyaXB0ZW46OmludGVybmFsOjpnZXRBY3R1YWxUeXBlPFZhcmlhYmxlQnVmZmVyS2VybmVsPihWYXJpYWJsZUJ1ZmZlcktlcm5lbCopHFZ2b2lkIGVtc2NyaXB0ZW46OmludGVybmFsOjpyYXdfZGVzdHJ1Y3RvcjxWYXJpYWJsZUJ1ZmZlcktlcm5lbD4oVmFyaWFibGVCdWZmZXJLZXJuZWwqKR2FAWVtc2NyaXB0ZW46OmludGVybmFsOjpJbnZva2VyPFZhcmlhYmxlQnVmZmVyS2VybmVsKiwgdW5zaWduZWQgaW50JiY+OjppbnZva2UoVmFyaWFibGVCdWZmZXJLZXJuZWwqICgqKSh1bnNpZ25lZCBpbnQmJiksIHVuc2lnbmVkIGludCkebFZhcmlhYmxlQnVmZmVyS2VybmVsKiBlbXNjcmlwdGVuOjppbnRlcm5hbDo6b3BlcmF0b3JfbmV3PFZhcmlhYmxlQnVmZmVyS2VybmVsLCB1bnNpZ25lZCBpbnQ+KHVuc2lnbmVkIGludCYmKR9JVmFyaWFibGVCdWZmZXJLZXJuZWw6OlByb2Nlc3ModW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgaW50KSDWAmVtc2NyaXB0ZW46OmludGVybmFsOjpNZXRob2RJbnZva2VyPHZvaWQgKFZhcmlhYmxlQnVmZmVyS2VybmVsOjoqKSh1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBpbnQpLCB2b2lkLCBWYXJpYWJsZUJ1ZmZlcktlcm5lbCosIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGludD46Omludm9rZSh2b2lkIChWYXJpYWJsZUJ1ZmZlcktlcm5lbDo6KiBjb25zdCYpKHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGludCksIFZhcmlhYmxlQnVmZmVyS2VybmVsKiwgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgaW50KSEmX0dMT0JBTF9fc3ViX0lfVmFyaWFibGVCdWZmZXJLZXJuZWwuY2MiB3dtZW1jcHkjBnN0cmxlbiRFc3RkOjpfXzI6OmJhc2ljX2lvczxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6fmJhc2ljX2lvcygpJR9zdGQ6Ol9fMjo6aW9zX2Jhc2U6On5pb3NfYmFzZSgpJj9zdGQ6Ol9fMjo6aW9zX2Jhc2U6Ol9fY2FsbF9jYWxsYmFja3Moc3RkOjpfXzI6Omlvc19iYXNlOjpldmVudCknR3N0ZDo6X18yOjpiYXNpY19pb3M8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46On5iYXNpY19pb3MoKS4xKFFzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojp+YmFzaWNfc3RyZWFtYnVmKCkpU3N0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46On5iYXNpY19zdHJlYW1idWYoKS4xKlBzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+OjpiYXNpY19zdHJlYW1idWYoKStdc3RkOjpfXzI6OmJhc2ljX3N0cmVhbWJ1ZjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6aW1idWUoc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYpLFJzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+OjpzZXRidWYoY2hhciosIGxvbmcpLXxzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+OjpzZWVrb2ZmKGxvbmcgbG9uZywgc3RkOjpfXzI6Omlvc19iYXNlOjpzZWVrZGlyLCB1bnNpZ25lZCBpbnQpLnFzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+OjpzZWVrcG9zKHN0ZDo6X18yOjpmcG9zPF9fbWJzdGF0ZV90PiwgdW5zaWduZWQgaW50KS9Fc3RkOjpfXzI6OmJhc2ljX3N0cmVhbWJ1ZjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6c3luYygpMFJzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojp4c2dldG4oY2hhciosIGxvbmcpMURzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj46OmNvcHkoY2hhciosIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nKTJKc3RkOjpfXzI6OmJhc2ljX3N0cmVhbWJ1ZjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6dW5kZXJmbG93KCkzRnN0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OnVmbG93KCk0TXN0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OnBiYWNrZmFpbChpbnQpNVhzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojp4c3B1dG4oY2hhciBjb25zdCosIGxvbmcpNldzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Ojp+YmFzaWNfc3RyZWFtYnVmKCk3WXN0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46On5iYXNpY19zdHJlYW1idWYoKS4xOFZzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+OjpiYXNpY19zdHJlYW1idWYoKTlbc3RkOjpfXzI6OmJhc2ljX3N0cmVhbWJ1Zjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPjo6eHNnZXRuKHdjaGFyX3QqLCBsb25nKTpNc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+Ojpjb3B5KHdjaGFyX3QqLCB3Y2hhcl90IGNvbnN0KiwgdW5zaWduZWQgbG9uZyk7OnN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Pjo6dG9fY2hhcl90eXBlKHVuc2lnbmVkIGludCk8THN0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46OnVmbG93KCk9YXN0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46OnhzcHV0bih3Y2hhcl90IGNvbnN0KiwgbG9uZyk+T3N0ZDo6X18yOjpiYXNpY19pc3RyZWFtPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojp+YmFzaWNfaXN0cmVhbSgpLjE/XnZpcnR1YWwgdGh1bmsgdG8gc3RkOjpfXzI6OmJhc2ljX2lzdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46On5iYXNpY19pc3RyZWFtKClAT3N0ZDo6X18yOjpiYXNpY19pc3RyZWFtPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojp+YmFzaWNfaXN0cmVhbSgpLjJBYHZpcnR1YWwgdGh1bmsgdG8gc3RkOjpfXzI6OmJhc2ljX2lzdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46On5iYXNpY19pc3RyZWFtKCkuMUJEc3RkOjpfXzI6OmJhc2ljX29zdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OmZsdXNoKClDYXN0ZDo6X18yOjpjdHlwZTxjaGFyPiBjb25zdCYgc3RkOjpfXzI6OnVzZV9mYWNldDxzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gPihzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JilE0QFib29sIHN0ZDo6X18yOjpvcGVyYXRvciE9PGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+IGNvbnN0Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gY29uc3QmKUVUc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46Om9wZXJhdG9yKigpIGNvbnN0Rk9zdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6b3BlcmF0b3IrKygpR9EBYm9vbCBzdGQ6Ol9fMjo6b3BlcmF0b3I9PTxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPihzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiBjb25zdCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+IGNvbnN0JilIiQFzdGQ6Ol9fMjo6YmFzaWNfb3N0cmVhbTxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6c2VudHJ5OjpzZW50cnkoc3RkOjpfXzI6OmJhc2ljX29zdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4mKUlOc3RkOjpfXzI6OmJhc2ljX29zdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OnNlbnRyeTo6fnNlbnRyeSgpSpgBc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OmVxdWFsKHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+IGNvbnN0JikgY29uc3RLR3N0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OnNidW1wYygpTEpzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+OjpzcHV0YyhjaGFyKU1Kc3RkOjpfXzI6OmJhc2ljX29zdHJlYW08d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46OmZsdXNoKClOZ3N0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYgc3RkOjpfXzI6OnVzZV9mYWNldDxzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD4gPihzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JilP4wFib29sIHN0ZDo6X18yOjpvcGVyYXRvciE9PHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+IGNvbnN0Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gY29uc3QmKVBVc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46Om9wZXJhdG9yKysoKVHjAWJvb2wgc3RkOjpfXzI6Om9wZXJhdG9yPT08d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4oc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gY29uc3QmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiBjb25zdCYpUpUBc3RkOjpfXzI6OmJhc2ljX29zdHJlYW08d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46OnNlbnRyeTo6c2VudHJ5KHN0ZDo6X18yOjpiYXNpY19vc3RyZWFtPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+JilTpAFzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPjo6ZXF1YWwoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gY29uc3QmKSBjb25zdFRNc3RkOjpfXzI6OmJhc2ljX3N0cmVhbWJ1Zjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPjo6c2J1bXBjKClVU3N0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46OnNwdXRjKHdjaGFyX3QpVk9zdGQ6Ol9fMjo6YmFzaWNfb3N0cmVhbTxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6fmJhc2ljX29zdHJlYW0oKS4xV152aXJ0dWFsIHRodW5rIHRvIHN0ZDo6X18yOjpiYXNpY19vc3RyZWFtPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojp+YmFzaWNfb3N0cmVhbSgpWE9zdGQ6Ol9fMjo6YmFzaWNfb3N0cmVhbTxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6fmJhc2ljX29zdHJlYW0oKS4yWWB2aXJ0dWFsIHRodW5rIHRvIHN0ZDo6X18yOjpiYXNpY19vc3RyZWFtPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojp+YmFzaWNfb3N0cmVhbSgpLjFaRXN0ZDo6X18yOjpiYXNpY19pb3M8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OmZpbGwoKSBjb25zdFtKc3RkOjpfXzI6OmJhc2ljX2lvczxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPjo6d2lkZW4oY2hhcikgY29uc3RcTnN0ZDo6X18yOjpiYXNpY19vc3RyZWFtPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+OjpvcGVyYXRvcjw8KGZsb2F0KV1Sc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46Om9wZXJhdG9yPShjaGFyKV5Gc3RkOjpfXzI6OmJhc2ljX29zdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OnB1dChjaGFyKV9bc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID46Om9wZXJhdG9yPSh3Y2hhcl90KWBwc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6YmFzaWNfc3RyaW5nKGNoYXIgY29uc3QqKWEhc3RkOjpfXzI6Omlvc19iYXNlOjp+aW9zX2Jhc2UoKS4xYh9zdGQ6Ol9fMjo6aW9zX2Jhc2U6OmluaXQodm9pZCopY7UBc3RkOjpfXzI6OmVuYWJsZV9pZjwoaXNfbW92ZV9jb25zdHJ1Y3RpYmxlPHVuc2lnbmVkIGludD46OnZhbHVlKSAmJiAoaXNfbW92ZV9hc3NpZ25hYmxlPHVuc2lnbmVkIGludD46OnZhbHVlKSwgdm9pZD46OnR5cGUgc3RkOjpfXzI6OnN3YXA8dW5zaWduZWQgaW50Pih1bnNpZ25lZCBpbnQmLCB1bnNpZ25lZCBpbnQmKWRZc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46Ol9fdGVzdF9mb3JfZW9mKCkgY29uc3RlX3N0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+OjpfX3Rlc3RfZm9yX2VvZigpIGNvbnN0Zg1fX3N0ZGlvX2Nsb3NlZxBfX2Vycm5vX2xvY2F0aW9uaAxfX3N0ZGlvX3JlYWRpDF9fc3RkaW9fc2Vla2oNX19zdGRpb193cml0ZWsYX19lbXNjcmlwdGVuX3N0ZG91dF9zZWVrbApfX2xvY2tmaWxlbQxfX3VubG9ja2ZpbGVuCF9fdG9yZWFkbwZ1bmdldGNwB19fdWZsb3dxBGdldGNyCV9fdG93cml0ZXMJX19md3JpdGV4dAZmd3JpdGV1BmZmbHVzaHYRX19mZmx1c2hfdW5sb2NrZWR3IHN0ZDo6X18yOjppb3NfYmFzZTo6SW5pdDo6SW5pdCgpeBdfX2N4eF9nbG9iYWxfYXJyYXlfZHRvcnk/c3RkOjpfXzI6Ol9fc3RkaW5idWY8Y2hhcj46Ol9fc3RkaW5idWYoX0lPX0ZJTEUqLCBfX21ic3RhdGVfdCopeooBc3RkOjpfXzI6OmJhc2ljX2lzdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OmJhc2ljX2lzdHJlYW0oc3RkOjpfXzI6OmJhc2ljX3N0cmVhbWJ1ZjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiope0JzdGQ6Ol9fMjo6X19zdGRpbmJ1Zjx3Y2hhcl90Pjo6X19zdGRpbmJ1ZihfSU9fRklMRSosIF9fbWJzdGF0ZV90Kil8lgFzdGQ6Ol9fMjo6YmFzaWNfaXN0cmVhbTx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPjo6YmFzaWNfaXN0cmVhbShzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Kil9QXN0ZDo6X18yOjpfX3N0ZG91dGJ1ZjxjaGFyPjo6X19zdGRvdXRidWYoX0lPX0ZJTEUqLCBfX21ic3RhdGVfdCopfooBc3RkOjpfXzI6OmJhc2ljX29zdHJlYW08Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID46OmJhc2ljX29zdHJlYW0oc3RkOjpfXzI6OmJhc2ljX3N0cmVhbWJ1ZjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiopf0RzdGQ6Ol9fMjo6X19zdGRvdXRidWY8d2NoYXJfdD46Ol9fc3Rkb3V0YnVmKF9JT19GSUxFKiwgX19tYnN0YXRlX3QqKYABlgFzdGQ6Ol9fMjo6YmFzaWNfb3N0cmVhbTx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPjo6YmFzaWNfb3N0cmVhbShzdGQ6Ol9fMjo6YmFzaWNfc3RyZWFtYnVmPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+KimBAX1zdGQ6Ol9fMjo6YmFzaWNfaW9zPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Ojppbml0KHN0ZDo6X18yOjpiYXNpY19zdHJlYW1idWY8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4qKYIBiwFzdGQ6Ol9fMjo6Y29kZWN2dDxjaGFyLCBjaGFyLCBfX21ic3RhdGVfdD4gY29uc3QmIHN0ZDo6X18yOjp1c2VfZmFjZXQ8c3RkOjpfXzI6OmNvZGVjdnQ8Y2hhciwgY2hhciwgX19tYnN0YXRlX3Q+ID4oc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYpgwGRAXN0ZDo6X18yOjpjb2RlY3Z0PHdjaGFyX3QsIGNoYXIsIF9fbWJzdGF0ZV90PiBjb25zdCYgc3RkOjpfXzI6OnVzZV9mYWNldDxzdGQ6Ol9fMjo6Y29kZWN2dDx3Y2hhcl90LCBjaGFyLCBfX21ic3RhdGVfdD4gPihzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JimEASlzdGQ6Ol9fMjo6X19zdGRpbmJ1ZjxjaGFyPjo6fl9fc3RkaW5idWYoKYUBOnN0ZDo6X18yOjpfX3N0ZGluYnVmPGNoYXI+OjppbWJ1ZShzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JimGASdzdGQ6Ol9fMjo6X19zdGRpbmJ1ZjxjaGFyPjo6dW5kZXJmbG93KCmHAStzdGQ6Ol9fMjo6X19zdGRpbmJ1ZjxjaGFyPjo6X19nZXRjaGFyKGJvb2wpiAEjc3RkOjpfXzI6Ol9fc3RkaW5idWY8Y2hhcj46OnVmbG93KCmJASpzdGQ6Ol9fMjo6X19zdGRpbmJ1ZjxjaGFyPjo6cGJhY2tmYWlsKGludCmKASxzdGQ6Ol9fMjo6X19zdGRpbmJ1Zjx3Y2hhcl90Pjo6fl9fc3RkaW5idWYoKYsBPXN0ZDo6X18yOjpfX3N0ZGluYnVmPHdjaGFyX3Q+OjppbWJ1ZShzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JimMASpzdGQ6Ol9fMjo6X19zdGRpbmJ1Zjx3Y2hhcl90Pjo6dW5kZXJmbG93KCmNAS5zdGQ6Ol9fMjo6X19zdGRpbmJ1Zjx3Y2hhcl90Pjo6X19nZXRjaGFyKGJvb2wpjgEmc3RkOjpfXzI6Ol9fc3RkaW5idWY8d2NoYXJfdD46OnVmbG93KCmPATZzdGQ6Ol9fMjo6X19zdGRpbmJ1Zjx3Y2hhcl90Pjo6cGJhY2tmYWlsKHVuc2lnbmVkIGludCmQATtzdGQ6Ol9fMjo6X19zdGRvdXRidWY8Y2hhcj46OmltYnVlKHN0ZDo6X18yOjpsb2NhbGUgY29uc3QmKZEBI3N0ZDo6X18yOjpfX3N0ZG91dGJ1ZjxjaGFyPjo6c3luYygpkgE2c3RkOjpfXzI6Ol9fc3Rkb3V0YnVmPGNoYXI+Ojp4c3B1dG4oY2hhciBjb25zdCosIGxvbmcpkwEqc3RkOjpfXzI6Ol9fc3Rkb3V0YnVmPGNoYXI+OjpvdmVyZmxvdyhpbnQplAE+c3RkOjpfXzI6Ol9fc3Rkb3V0YnVmPHdjaGFyX3Q+OjppbWJ1ZShzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JimVATxzdGQ6Ol9fMjo6X19zdGRvdXRidWY8d2NoYXJfdD46OnhzcHV0bih3Y2hhcl90IGNvbnN0KiwgbG9uZymWATZzdGQ6Ol9fMjo6X19zdGRvdXRidWY8d2NoYXJfdD46Om92ZXJmbG93KHVuc2lnbmVkIGludCmXAQdfX3NobGltmAEIX19zaGdldGOZAQhfX211bHRpM5oBCV9faW50c2NhbpsBB21icnRvd2OcAQlfX2FzaGx0aTOdAQ1fX2V4dGVuZHNmdGYyngEJX19sc2hydGkznwEIX19tdWx0ZjOgAQtfX2Zsb2F0c2l0ZqEBCF9fYWRkdGYzogENX19leHRlbmRkZnRmMqMBB19fbGV0ZjKkAQdfX2dldGYypQEJY29weXNpZ25spgENX19mbG9hdHVuc2l0ZqcBCF9fc3VidGYzqAEHc2NhbGJubKkBCF9fZGl2dGYzqgEMX190cnVuY3RmZGYyqwELX19mbG9hdHNjYW6sAQhoZXhmbG9hdK0BCGRlY2Zsb2F0rgEHc2NhbmV4cK8BDF9fdHJ1bmN0ZnNmMrABB3Zmc2NhbmaxAQVhcmdfbrIBCXN0b3JlX2ludLMBBm1lbWNocrQBDV9fc3RyaW5nX3JlYWS1AQd2c3NjYW5mtgEHZG9fcmVhZLcBBnN0cmNtcLgBIF9fZW1zY3JpcHRlbl9lbnZpcm9uX2NvbnN0cnVjdG9yuQELX19zdHJjaHJudWy6AQdzdHJuY21wuwEGZ2V0ZW52vAEIX19tdW5tYXC9AQxfX2dldF9sb2NhbGW+AQtfX25ld2xvY2FsZb8BB3djcnRvbWLAAQZ3Y3RvbWLBAQVmcmV4cMIBE19fdmZwcmludGZfaW50ZXJuYWzDAQtwcmludGZfY29yZcQBA291dMUBBmdldGludMYBB3BvcF9hcmfHAQNwYWTIAQVmbXRfb8kBBWZtdF94ygEFZm10X3XLAQh2ZnByaW50ZswBBmZtdF9mcM0BE3BvcF9hcmdfbG9uZ19kb3VibGXOAQl2c25wcmludGbPAQhzbl93cml0ZdABCXZhc3ByaW50ZtEBBnNzY2FuZtIBCHNucHJpbnRm0wEKZnJlZWxvY2FsZdQBBndjc2xlbtUBCXdjc3J0b21ic9YBCndjc25ydG9tYnPXAQltYnNydG93Y3PYAQptYnNucnRvd2Nz2QEGc3RydG942gEKc3RydG91bGxfbNsBCXN0cnRvbGxfbNwBBnN0cnRvZt0BCHN0cnRveC4x3gEGc3RydG9k3wEHc3RydG9sZOABCXN0cnRvbGRfbOEBJXN0ZDo6X18yOjpjb2xsYXRlPGNoYXI+Ojp+Y29sbGF0ZSgpLjHiAV1zdGQ6Ol9fMjo6Y29sbGF0ZTxjaGFyPjo6ZG9fY29tcGFyZShjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KikgY29uc3TjAUVzdGQ6Ol9fMjo6Y29sbGF0ZTxjaGFyPjo6ZG9fdHJhbnNmb3JtKGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KikgY29uc3TkAc8Bc3RkOjpfXzI6OmVuYWJsZV9pZjxfX2lzX2ZvcndhcmRfaXRlcmF0b3I8Y2hhciBjb25zdCo+Ojp2YWx1ZSwgdm9pZD46OnR5cGUgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6X19pbml0PGNoYXIgY29uc3QqPihjaGFyIGNvbnN0KiwgY2hhciBjb25zdCop5QFAc3RkOjpfXzI6OmNvbGxhdGU8Y2hhcj46OmRvX2hhc2goY2hhciBjb25zdCosIGNoYXIgY29uc3QqKSBjb25zdOYBbHN0ZDo6X18yOjpjb2xsYXRlPHdjaGFyX3Q+Ojpkb19jb21wYXJlKHdjaGFyX3QgY29uc3QqLCB3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCosIHdjaGFyX3QgY29uc3QqKSBjb25zdOcBTnN0ZDo6X18yOjpjb2xsYXRlPHdjaGFyX3Q+Ojpkb190cmFuc2Zvcm0od2NoYXJfdCBjb25zdCosIHdjaGFyX3QgY29uc3QqKSBjb25zdOgB5AFzdGQ6Ol9fMjo6ZW5hYmxlX2lmPF9faXNfZm9yd2FyZF9pdGVyYXRvcjx3Y2hhcl90IGNvbnN0Kj46OnZhbHVlLCB2b2lkPjo6dHlwZSBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+OjpfX2luaXQ8d2NoYXJfdCBjb25zdCo+KHdjaGFyX3QgY29uc3QqLCB3Y2hhcl90IGNvbnN0KinpAUlzdGQ6Ol9fMjo6Y29sbGF0ZTx3Y2hhcl90Pjo6ZG9faGFzaCh3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCopIGNvbnN06gGaAnN0ZDo6X18yOjpudW1fZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGJvb2wmKSBjb25zdOsBZ3N0ZDo6X18yOjpudW1wdW5jdDxjaGFyPiBjb25zdCYgc3RkOjpfXzI6OnVzZV9mYWNldDxzdGQ6Ol9fMjo6bnVtcHVuY3Q8Y2hhcj4gPihzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JinsAaQFc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPiBjb25zdCogc3RkOjpfXzI6Ol9fc2Nhbl9rZXl3b3JkPHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0Kiwgc3RkOjpfXzI6OmN0eXBlPGNoYXI+ID4oc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPiBjb25zdCosIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gY29uc3QqLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmLCB1bnNpZ25lZCBpbnQmLCBib29sKe0BOHN0ZDo6X18yOjpsb2NhbGU6OnVzZV9mYWNldChzdGQ6Ol9fMjo6bG9jYWxlOjppZCYpIGNvbnN07gHMAXN0ZDo6X18yOjp1bmlxdWVfcHRyPHVuc2lnbmVkIGNoYXIsIHZvaWQgKCopKHZvaWQqKT46OnVuaXF1ZV9wdHI8dHJ1ZSwgdm9pZD4odW5zaWduZWQgY2hhciosIHN0ZDo6X18yOjpfX2RlcGVuZGVudF90eXBlPHN0ZDo6X18yOjpfX3VuaXF1ZV9wdHJfZGVsZXRlcl9zZmluYWU8dm9pZCAoKikodm9pZCopPiwgdHJ1ZT46Ol9fZ29vZF9ydmFsX3JlZl90eXBlKe8BmgJzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCBsb25nJikgY29uc3TwAesCc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gc3RkOjpfXzI6Om51bV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19kb19nZXRfc2lnbmVkPGxvbmc+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgbG9uZyYpIGNvbnN08QE5c3RkOjpfXzI6Ol9fbnVtX2dldF9iYXNlOjpfX2dldF9iYXNlKHN0ZDo6X18yOjppb3NfYmFzZSYp8gFIc3RkOjpfXzI6Ol9fbnVtX2dldDxjaGFyPjo6X19zdGFnZTJfaW50X3ByZXAoc3RkOjpfXzI6Omlvc19iYXNlJiwgY2hhciYp8wFlc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6YmFzaWNfc3RyaW5nKCn0AWxzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+OjpyZXNpemUodW5zaWduZWQgbG9uZyn1AeUBc3RkOjpfXzI6Ol9fbnVtX2dldDxjaGFyPjo6X19zdGFnZTJfaW50X2xvb3AoY2hhciwgaW50LCBjaGFyKiwgY2hhciomLCB1bnNpZ25lZCBpbnQmLCBjaGFyLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0JiwgdW5zaWduZWQgaW50KiwgdW5zaWduZWQgaW50KiYsIGNoYXIgY29uc3QqKfYBXGxvbmcgc3RkOjpfXzI6Ol9fbnVtX2dldF9zaWduZWRfaW50ZWdyYWw8bG9uZz4oY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBpbnQmLCBpbnQp9wGlAXN0ZDo6X18yOjpfX2NoZWNrX2dyb3VwaW5nKHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gY29uc3QmLCB1bnNpZ25lZCBpbnQqLCB1bnNpZ25lZCBpbnQqLCB1bnNpZ25lZCBpbnQmKfgBnwJzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCBsb25nIGxvbmcmKSBjb25zdPkB9QJzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiBzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+OjpfX2RvX2dldF9zaWduZWQ8bG9uZyBsb25nPihzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGxvbmcgbG9uZyYpIGNvbnN0+gFmbG9uZyBsb25nIHN0ZDo6X18yOjpfX251bV9nZXRfc2lnbmVkX2ludGVncmFsPGxvbmcgbG9uZz4oY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBpbnQmLCBpbnQp+wGkAnN0ZDo6X18yOjpudW1fZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHVuc2lnbmVkIHNob3J0JikgY29uc3T8AYEDc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gc3RkOjpfXzI6Om51bV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19kb19nZXRfdW5zaWduZWQ8dW5zaWduZWQgc2hvcnQ+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdW5zaWduZWQgc2hvcnQmKSBjb25zdP0BcnVuc2lnbmVkIHNob3J0IHN0ZDo6X18yOjpfX251bV9nZXRfdW5zaWduZWRfaW50ZWdyYWw8dW5zaWduZWQgc2hvcnQ+KGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgaW50JiwgaW50Kf4BogJzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB1bnNpZ25lZCBpbnQmKSBjb25zdP8B/QJzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiBzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+OjpfX2RvX2dldF91bnNpZ25lZDx1bnNpZ25lZCBpbnQ+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdW5zaWduZWQgaW50JikgY29uc3SAAm51bnNpZ25lZCBpbnQgc3RkOjpfXzI6Ol9fbnVtX2dldF91bnNpZ25lZF9pbnRlZ3JhbDx1bnNpZ25lZCBpbnQ+KGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgaW50JiwgaW50KYECqAJzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB1bnNpZ25lZCBsb25nIGxvbmcmKSBjb25zdIICiQNzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiBzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+OjpfX2RvX2dldF91bnNpZ25lZDx1bnNpZ25lZCBsb25nIGxvbmc+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdW5zaWduZWQgbG9uZyBsb25nJikgY29uc3SDAnp1bnNpZ25lZCBsb25nIGxvbmcgc3RkOjpfXzI6Ol9fbnVtX2dldF91bnNpZ25lZF9pbnRlZ3JhbDx1bnNpZ25lZCBsb25nIGxvbmc+KGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgaW50JiwgaW50KYQCmwJzdGQ6Ol9fMjo6bnVtX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCBmbG9hdCYpIGNvbnN0hQL1AnN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+IHN0ZDo6X18yOjpudW1fZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46Ol9fZG9fZ2V0X2Zsb2F0aW5nX3BvaW50PGZsb2F0PihzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGZsb2F0JikgY29uc3SGAlhzdGQ6Ol9fMjo6X19udW1fZ2V0PGNoYXI+OjpfX3N0YWdlMl9mbG9hdF9wcmVwKHN0ZDo6X18yOjppb3NfYmFzZSYsIGNoYXIqLCBjaGFyJiwgY2hhciYphwLwAXN0ZDo6X18yOjpfX251bV9nZXQ8Y2hhcj46Ol9fc3RhZ2UyX2Zsb2F0X2xvb3AoY2hhciwgYm9vbCYsIGNoYXImLCBjaGFyKiwgY2hhciomLCBjaGFyLCBjaGFyLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0JiwgdW5zaWduZWQgaW50KiwgdW5zaWduZWQgaW50KiYsIHVuc2lnbmVkIGludCYsIGNoYXIqKYgCT2Zsb2F0IHN0ZDo6X18yOjpfX251bV9nZXRfZmxvYXQ8ZmxvYXQ+KGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgaW50JimJApwCc3RkOjpfXzI6Om51bV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgZG91YmxlJikgY29uc3SKAvcCc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gc3RkOjpfXzI6Om51bV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19kb19nZXRfZmxvYXRpbmdfcG9pbnQ8ZG91YmxlPihzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGRvdWJsZSYpIGNvbnN0iwJRZG91YmxlIHN0ZDo6X18yOjpfX251bV9nZXRfZmxvYXQ8ZG91YmxlPihjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIHVuc2lnbmVkIGludCYpjAKhAnN0ZDo6X18yOjpudW1fZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGxvbmcgZG91YmxlJikgY29uc3SNAoEDc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gc3RkOjpfXzI6Om51bV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19kb19nZXRfZmxvYXRpbmdfcG9pbnQ8bG9uZyBkb3VibGU+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgbG9uZyBkb3VibGUmKSBjb25zdI4CW2xvbmcgZG91YmxlIHN0ZDo6X18yOjpfX251bV9nZXRfZmxvYXQ8bG9uZyBkb3VibGU+KGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgaW50JimPApsCc3RkOjpfXzI6Om51bV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50Jiwgdm9pZComKSBjb25zdJACEnN0ZDo6X18yOjpfX2Nsb2MoKZECTHN0ZDo6X18yOjpfX2xpYmNwcF9zc2NhbmZfbChjaGFyIGNvbnN0KiwgX19sb2NhbGVfc3RydWN0KiwgY2hhciBjb25zdCosIC4uLimSAl9zdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+OjpfX3plcm8oKZMCVGNoYXIgY29uc3QqIHN0ZDo6X18yOjpmaW5kPGNoYXIgY29uc3QqLCBjaGFyPihjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QmKZQCSXN0ZDo6X18yOjpfX2xpYmNwcF9sb2NhbGVfZ3VhcmQ6Ol9fbGliY3BwX2xvY2FsZV9ndWFyZChfX2xvY2FsZV9zdHJ1Y3QqJimVAq8Cc3RkOjpfXzI6Om51bV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgYm9vbCYpIGNvbnN0lgJtc3RkOjpfXzI6Om51bXB1bmN0PHdjaGFyX3Q+IGNvbnN0JiBzdGQ6Ol9fMjo6dXNlX2ZhY2V0PHN0ZDo6X18yOjpudW1wdW5jdDx3Y2hhcl90PiA+KHN0ZDo6X18yOjpsb2NhbGUgY29uc3QmKZcC4AVzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+IGNvbnN0KiBzdGQ6Ol9fMjo6X19zY2FuX2tleXdvcmQ8c3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID4gY29uc3QqLCBzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD4gPihzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+IGNvbnN0Kiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiBjb25zdCosIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYsIHVuc2lnbmVkIGludCYsIGJvb2wpmAKvAnN0ZDo6X18yOjpudW1fZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGxvbmcmKSBjb25zdJkChgNzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiBzdGQ6Ol9fMjo6bnVtX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2RvX2dldF9zaWduZWQ8bG9uZz4oc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCBsb25nJikgY29uc3SaAk1zdGQ6Ol9fMjo6X19udW1fZ2V0PHdjaGFyX3Q+OjpfX2RvX3dpZGVuKHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QqKSBjb25zdJsCTnN0ZDo6X18yOjpfX251bV9nZXQ8d2NoYXJfdD46Ol9fc3RhZ2UyX2ludF9wcmVwKHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QmKZwC8QFzdGQ6Ol9fMjo6X19udW1fZ2V0PHdjaGFyX3Q+OjpfX3N0YWdlMl9pbnRfbG9vcCh3Y2hhcl90LCBpbnQsIGNoYXIqLCBjaGFyKiYsIHVuc2lnbmVkIGludCYsIHdjaGFyX3QsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gY29uc3QmLCB1bnNpZ25lZCBpbnQqLCB1bnNpZ25lZCBpbnQqJiwgd2NoYXJfdCBjb25zdCopnQK0AnN0ZDo6X18yOjpudW1fZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGxvbmcgbG9uZyYpIGNvbnN0ngKQA3N0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+IHN0ZDo6X18yOjpudW1fZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46Ol9fZG9fZ2V0X3NpZ25lZDxsb25nIGxvbmc+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgbG9uZyBsb25nJikgY29uc3SfArkCc3RkOjpfXzI6Om51bV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdW5zaWduZWQgc2hvcnQmKSBjb25zdKACnANzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiBzdGQ6Ol9fMjo6bnVtX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2RvX2dldF91bnNpZ25lZDx1bnNpZ25lZCBzaG9ydD4oc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB1bnNpZ25lZCBzaG9ydCYpIGNvbnN0oQK3AnN0ZDo6X18yOjpudW1fZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHVuc2lnbmVkIGludCYpIGNvbnN0ogKYA3N0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+IHN0ZDo6X18yOjpudW1fZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46Ol9fZG9fZ2V0X3Vuc2lnbmVkPHVuc2lnbmVkIGludD4oc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB1bnNpZ25lZCBpbnQmKSBjb25zdKMCvQJzdGQ6Ol9fMjo6bnVtX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB1bnNpZ25lZCBsb25nIGxvbmcmKSBjb25zdKQCpANzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiBzdGQ6Ol9fMjo6bnVtX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2RvX2dldF91bnNpZ25lZDx1bnNpZ25lZCBsb25nIGxvbmc+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdW5zaWduZWQgbG9uZyBsb25nJikgY29uc3SlArACc3RkOjpfXzI6Om51bV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgZmxvYXQmKSBjb25zdKYCkANzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiBzdGQ6Ol9fMjo6bnVtX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2RvX2dldF9mbG9hdGluZ19wb2ludDxmbG9hdD4oc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCBmbG9hdCYpIGNvbnN0pwJkc3RkOjpfXzI6Ol9fbnVtX2dldDx3Y2hhcl90Pjo6X19zdGFnZTJfZmxvYXRfcHJlcChzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB3Y2hhcl90Kiwgd2NoYXJfdCYsIHdjaGFyX3QmKagC/wFzdGQ6Ol9fMjo6X19udW1fZ2V0PHdjaGFyX3Q+OjpfX3N0YWdlMl9mbG9hdF9sb29wKHdjaGFyX3QsIGJvb2wmLCBjaGFyJiwgY2hhciosIGNoYXIqJiwgd2NoYXJfdCwgd2NoYXJfdCwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPiBjb25zdCYsIHVuc2lnbmVkIGludCosIHVuc2lnbmVkIGludComLCB1bnNpZ25lZCBpbnQmLCB3Y2hhcl90KimpArECc3RkOjpfXzI6Om51bV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgZG91YmxlJikgY29uc3SqApIDc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gc3RkOjpfXzI6Om51bV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19kb19nZXRfZmxvYXRpbmdfcG9pbnQ8ZG91YmxlPihzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGRvdWJsZSYpIGNvbnN0qwK2AnN0ZDo6X18yOjpudW1fZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGxvbmcgZG91YmxlJikgY29uc3SsApwDc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gc3RkOjpfXzI6Om51bV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19kb19nZXRfZmxvYXRpbmdfcG9pbnQ8bG9uZyBkb3VibGU+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgbG9uZyBkb3VibGUmKSBjb25zdK0CsAJzdGQ6Ol9fMjo6bnVtX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB2b2lkKiYpIGNvbnN0rgJmd2NoYXJfdCBjb25zdCogc3RkOjpfXzI6OmZpbmQ8d2NoYXJfdCBjb25zdCosIHdjaGFyX3Q+KHdjaGFyX3QgY29uc3QqLCB3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCYprwJnd2NoYXJfdCBjb25zdCogc3RkOjpfXzI6Ol9fbnVtX2dldDx3Y2hhcl90Pjo6X19kb193aWRlbl9wPHdjaGFyX3Q+KHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QqKSBjb25zdLACzQFzdGQ6Ol9fMjo6bnVtX3B1dDxjaGFyLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIGNoYXIsIGJvb2wpIGNvbnN0sQJec3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6YmVnaW4oKbICXHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID46OmVuZCgpswLNAXN0ZDo6X18yOjpudW1fcHV0PGNoYXIsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgY2hhciwgbG9uZykgY29uc3S0Ak5zdGQ6Ol9fMjo6X19udW1fcHV0X2Jhc2U6Ol9fZm9ybWF0X2ludChjaGFyKiwgY2hhciBjb25zdCosIGJvb2wsIHVuc2lnbmVkIGludCm1AldzdGQ6Ol9fMjo6X19saWJjcHBfc25wcmludGZfbChjaGFyKiwgdW5zaWduZWQgbG9uZywgX19sb2NhbGVfc3RydWN0KiwgY2hhciBjb25zdCosIC4uLim2AlVzdGQ6Ol9fMjo6X19udW1fcHV0X2Jhc2U6Ol9faWRlbnRpZnlfcGFkZGluZyhjaGFyKiwgY2hhciosIHN0ZDo6X18yOjppb3NfYmFzZSBjb25zdCYptwJ1c3RkOjpfXzI6Ol9fbnVtX3B1dDxjaGFyPjo6X193aWRlbl9hbmRfZ3JvdXBfaW50KGNoYXIqLCBjaGFyKiwgY2hhciosIGNoYXIqLCBjaGFyKiYsIGNoYXIqJiwgc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYpuAKFAnN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+IHN0ZDo6X18yOjpfX3BhZF9hbmRfb3V0cHV0PGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+KHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCBjaGFyKbkCK3ZvaWQgc3RkOjpfXzI6OnJldmVyc2U8Y2hhcio+KGNoYXIqLCBjaGFyKim6AiFzdGQ6Ol9fMjo6aW9zX2Jhc2U6OndpZHRoKCkgY29uc3S7AnhzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+OjpiYXNpY19zdHJpbmcodW5zaWduZWQgbG9uZywgY2hhcim8AtIBc3RkOjpfXzI6Om51bV9wdXQ8Y2hhciwgc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6ZG9fcHV0KHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCBjaGFyLCBsb25nIGxvbmcpIGNvbnN0vQLWAXN0ZDo6X18yOjpudW1fcHV0PGNoYXIsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgY2hhciwgdW5zaWduZWQgbG9uZykgY29uc3S+AtsBc3RkOjpfXzI6Om51bV9wdXQ8Y2hhciwgc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6ZG9fcHV0KHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCBjaGFyLCB1bnNpZ25lZCBsb25nIGxvbmcpIGNvbnN0vwLPAXN0ZDo6X18yOjpudW1fcHV0PGNoYXIsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgY2hhciwgZG91YmxlKSBjb25zdMACSnN0ZDo6X18yOjpfX251bV9wdXRfYmFzZTo6X19mb3JtYXRfZmxvYXQoY2hhciosIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBpbnQpwQIlc3RkOjpfXzI6Omlvc19iYXNlOjpwcmVjaXNpb24oKSBjb25zdMICSXN0ZDo6X18yOjpfX2xpYmNwcF9hc3ByaW50Zl9sKGNoYXIqKiwgX19sb2NhbGVfc3RydWN0KiwgY2hhciBjb25zdCosIC4uLinDAndzdGQ6Ol9fMjo6X19udW1fcHV0PGNoYXI+OjpfX3dpZGVuX2FuZF9ncm91cF9mbG9hdChjaGFyKiwgY2hhciosIGNoYXIqLCBjaGFyKiwgY2hhciomLCBjaGFyKiYsIHN0ZDo6X18yOjpsb2NhbGUgY29uc3QmKcQC1AFzdGQ6Ol9fMjo6bnVtX3B1dDxjaGFyLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIGNoYXIsIGxvbmcgZG91YmxlKSBjb25zdMUC1AFzdGQ6Ol9fMjo6bnVtX3B1dDxjaGFyLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIGNoYXIsIHZvaWQgY29uc3QqKSBjb25zdMYC3wFzdGQ6Ol9fMjo6bnVtX3B1dDx3Y2hhcl90LCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QsIGJvb2wpIGNvbnN0xwJlc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPjo6ZW5kKCnIAt8Bc3RkOjpfXzI6Om51bV9wdXQ8d2NoYXJfdCwgc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fcHV0KHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB3Y2hhcl90LCBsb25nKSBjb25zdMkCgQFzdGQ6Ol9fMjo6X19udW1fcHV0PHdjaGFyX3Q+OjpfX3dpZGVuX2FuZF9ncm91cF9pbnQoY2hhciosIGNoYXIqLCBjaGFyKiwgd2NoYXJfdCosIHdjaGFyX3QqJiwgd2NoYXJfdComLCBzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JinKAqMCc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gc3RkOjpfXzI6Ol9fcGFkX2FuZF9vdXRwdXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4oc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHdjaGFyX3QgY29uc3QqLCB3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCosIHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QpywI0dm9pZCBzdGQ6Ol9fMjo6cmV2ZXJzZTx3Y2hhcl90Kj4od2NoYXJfdCosIHdjaGFyX3QqKcwChAFzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+OjpiYXNpY19zdHJpbmcodW5zaWduZWQgbG9uZywgd2NoYXJfdCnNAuQBc3RkOjpfXzI6Om51bV9wdXQ8d2NoYXJfdCwgc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fcHV0KHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB3Y2hhcl90LCBsb25nIGxvbmcpIGNvbnN0zgLoAXN0ZDo6X18yOjpudW1fcHV0PHdjaGFyX3QsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgd2NoYXJfdCwgdW5zaWduZWQgbG9uZykgY29uc3TPAu0Bc3RkOjpfXzI6Om51bV9wdXQ8d2NoYXJfdCwgc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fcHV0KHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB3Y2hhcl90LCB1bnNpZ25lZCBsb25nIGxvbmcpIGNvbnN00ALhAXN0ZDo6X18yOjpudW1fcHV0PHdjaGFyX3QsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgd2NoYXJfdCwgZG91YmxlKSBjb25zdNECgwFzdGQ6Ol9fMjo6X19udW1fcHV0PHdjaGFyX3Q+OjpfX3dpZGVuX2FuZF9ncm91cF9mbG9hdChjaGFyKiwgY2hhciosIGNoYXIqLCB3Y2hhcl90Kiwgd2NoYXJfdComLCB3Y2hhcl90KiYsIHN0ZDo6X18yOjpsb2NhbGUgY29uc3QmKdIC5gFzdGQ6Ol9fMjo6bnVtX3B1dDx3Y2hhcl90LCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QsIGxvbmcgZG91YmxlKSBjb25zdNMC5gFzdGQ6Ol9fMjo6bnVtX3B1dDx3Y2hhcl90LCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QsIHZvaWQgY29uc3QqKSBjb25zdNQCU3ZvaWQgc3RkOjpfXzI6Ol9fcmV2ZXJzZTxjaGFyKj4oY2hhciosIGNoYXIqLCBzdGQ6Ol9fMjo6cmFuZG9tX2FjY2Vzc19pdGVyYXRvcl90YWcp1QJcdm9pZCBzdGQ6Ol9fMjo6X19yZXZlcnNlPHdjaGFyX3QqPih3Y2hhcl90Kiwgd2NoYXJfdCosIHN0ZDo6X18yOjpyYW5kb21fYWNjZXNzX2l0ZXJhdG9yX3RhZynWArACc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmdldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHRtKiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqKSBjb25zdNcCc3N0ZDo6X18yOjp0aW1lX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19kYXRlX29yZGVyKCkgY29uc3TYAp4Cc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX2dldF90aW1lKHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdG0qKSBjb25zdNkCngJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6ZG9fZ2V0X2RhdGUoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB0bSopIGNvbnN02gKhAnN0ZDo6X18yOjp0aW1lX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXRfd2Vla2RheShzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHRtKikgY29uc3TbAq8Cc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46Ol9fZ2V0X3dlZWtkYXluYW1lKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTxjaGFyPiBjb25zdCYpIGNvbnN03AKjAnN0ZDo6X18yOjp0aW1lX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXRfbW9udGhuYW1lKHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdG0qKSBjb25zdN0CrQJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfbW9udGhuYW1lKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTxjaGFyPiBjb25zdCYpIGNvbnN03gKeAnN0ZDo6X18yOjp0aW1lX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXRfeWVhcihzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHRtKikgY29uc3TfAqgCc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46Ol9fZ2V0X3llYXIoaW50Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPGNoYXI+IGNvbnN0JikgY29uc3TgAqUCaW50IHN0ZDo6X18yOjpfX2dldF91cF90b19uX2RpZ2l0czxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTxjaGFyPiBjb25zdCYsIGludCnhAqUCc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHRtKiwgY2hhciwgY2hhcikgY29uc3TiAqUCc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46Ol9fZ2V0X3BlcmNlbnQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPGNoYXI+IGNvbnN0JikgY29uc3TjAqcCc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46Ol9fZ2V0X2RheShpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmKSBjb25zdOQCqAJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfaG91cihpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmKSBjb25zdOUCqwJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfMTJfaG91cihpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmKSBjb25zdOYCsAJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfZGF5X3llYXJfbnVtKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTxjaGFyPiBjb25zdCYpIGNvbnN05wKpAnN0ZDo6X18yOjp0aW1lX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+OjpfX2dldF9tb250aChpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmKSBjb25zdOgCqgJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfbWludXRlKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTxjaGFyPiBjb25zdCYpIGNvbnN06QKpAnN0ZDo6X18yOjp0aW1lX2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+OjpfX2dldF93aGl0ZV9zcGFjZShzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmKSBjb25zdOoCqQJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfYW1fcG0oaW50Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPGNoYXI+IGNvbnN0JikgY29uc3TrAqoCc3RkOjpfXzI6OnRpbWVfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46Ol9fZ2V0X3NlY29uZChpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmKSBjb25zdOwCqwJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfd2Vla2RheShpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj4gY29uc3QmKSBjb25zdO0CqQJzdGQ6Ol9fMjo6dGltZV9nZXQ8Y2hhciwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6X19nZXRfeWVhcjQoaW50Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPGNoYXI+IGNvbnN0JikgY29uc3TuAssCc3RkOjpfXzI6OnRpbWVfZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmdldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHRtKiwgd2NoYXJfdCBjb25zdCosIHdjaGFyX3QgY29uc3QqKSBjb25zdO8CswJzdGQ6Ol9fMjo6dGltZV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fZ2V0X3RpbWUoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB0bSopIGNvbnN08AKzAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19nZXRfZGF0ZShzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIHRtKikgY29uc3TxArYCc3RkOjpfXzI6OnRpbWVfZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX2dldF93ZWVrZGF5KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdG0qKSBjb25zdPICxwJzdGQ6Ol9fMjo6dGltZV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19nZXRfd2Vla2RheW5hbWUoaW50Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+IGNvbnN0JikgY29uc3TzArgCc3RkOjpfXzI6OnRpbWVfZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX2dldF9tb250aG5hbWUoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCB0bSopIGNvbnN09ALFAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF9tb250aG5hbWUoaW50Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+IGNvbnN0JikgY29uc3T1ArMCc3RkOjpfXzI6OnRpbWVfZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX2dldF95ZWFyKHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdG0qKSBjb25zdPYCwAJzdGQ6Ol9fMjo6dGltZV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19nZXRfeWVhcihpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD4gY29uc3QmKSBjb25zdPcCvQJpbnQgc3RkOjpfXzI6Ol9fZ2V0X3VwX3RvX25fZGlnaXRzPHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID4oc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+IGNvbnN0JiwgaW50KfgCugJzdGQ6Ol9fMjo6dGltZV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50JiwgdG0qLCBjaGFyLCBjaGFyKSBjb25zdPkCvQJzdGQ6Ol9fMjo6dGltZV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19nZXRfcGVyY2VudChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD4gY29uc3QmKSBjb25zdPoCvwJzdGQ6Ol9fMjo6dGltZV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19nZXRfZGF5KGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYpIGNvbnN0+wLAAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF9ob3VyKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYpIGNvbnN0/ALDAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF8xMl9ob3VyKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYpIGNvbnN0/QLIAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF9kYXlfeWVhcl9udW0oaW50Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+IGNvbnN0JikgY29uc3T+AsECc3RkOjpfXzI6OnRpbWVfZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46Ol9fZ2V0X21vbnRoKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYpIGNvbnN0/wLCAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF9taW51dGUoaW50Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+IGNvbnN0JikgY29uc3SAA8ECc3RkOjpfXzI6OnRpbWVfZ2V0PHdjaGFyX3QsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46Ol9fZ2V0X3doaXRlX3NwYWNlKHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYpIGNvbnN0gQPBAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF9hbV9wbShpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD4gY29uc3QmKSBjb25zdIIDwgJzdGQ6Ol9fMjo6dGltZV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19nZXRfc2Vjb25kKGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYpIGNvbnN0gwPDAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF93ZWVrZGF5KGludCYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHVuc2lnbmVkIGludCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYpIGNvbnN0hAPBAnN0ZDo6X18yOjp0aW1lX2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+OjpfX2dldF95ZWFyNChpbnQmLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD4gY29uc3QmKSBjb25zdIUD3wFzdGQ6Ol9fMjo6dGltZV9wdXQ8Y2hhciwgc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4gPjo6ZG9fcHV0KHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCBjaGFyLCB0bSBjb25zdCosIGNoYXIsIGNoYXIpIGNvbnN0hgNKc3RkOjpfXzI6Ol9fdGltZV9wdXQ6Ol9fZG9fcHV0KGNoYXIqLCBjaGFyKiYsIHRtIGNvbnN0KiwgY2hhciwgY2hhcikgY29uc3SHA40Bc3RkOjpfXzI6OmVuYWJsZV9pZjwoaXNfbW92ZV9jb25zdHJ1Y3RpYmxlPGNoYXI+Ojp2YWx1ZSkgJiYgKGlzX21vdmVfYXNzaWduYWJsZTxjaGFyPjo6dmFsdWUpLCB2b2lkPjo6dHlwZSBzdGQ6Ol9fMjo6c3dhcDxjaGFyPihjaGFyJiwgY2hhciYpiAPuAXN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+IHN0ZDo6X18yOjpfX2NvcHk8Y2hhciosIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID4oY2hhciosIGNoYXIqLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPimJA/EBc3RkOjpfXzI6OnRpbWVfcHV0PHdjaGFyX3QsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgc3RkOjpfXzI6Omlvc19iYXNlJiwgd2NoYXJfdCwgdG0gY29uc3QqLCBjaGFyLCBjaGFyKSBjb25zdIoDUHN0ZDo6X18yOjpfX3RpbWVfcHV0OjpfX2RvX3B1dCh3Y2hhcl90Kiwgd2NoYXJfdComLCB0bSBjb25zdCosIGNoYXIsIGNoYXIpIGNvbnN0iwNlc3RkOjpfXzI6Ol9fbGliY3BwX21ic3J0b3djc19sKHdjaGFyX3QqLCBjaGFyIGNvbnN0KiosIHVuc2lnbmVkIGxvbmcsIF9fbWJzdGF0ZV90KiwgX19sb2NhbGVfc3RydWN0KimMAyxzdGQ6Ol9fMjo6X190aHJvd19ydW50aW1lX2Vycm9yKGNoYXIgY29uc3QqKY0DiQJzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiBzdGQ6Ol9fMjo6X19jb3B5PHdjaGFyX3QqLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+KHdjaGFyX3QqLCB3Y2hhcl90Kiwgc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4pjgM7c3RkOjpfXzI6Om1vbmV5cHVuY3Q8Y2hhciwgZmFsc2U+Ojpkb19kZWNpbWFsX3BvaW50KCkgY29uc3SPAzZzdGQ6Ol9fMjo6bW9uZXlwdW5jdDxjaGFyLCBmYWxzZT46OmRvX2dyb3VwaW5nKCkgY29uc3SQAztzdGQ6Ol9fMjo6bW9uZXlwdW5jdDxjaGFyLCBmYWxzZT46OmRvX25lZ2F0aXZlX3NpZ24oKSBjb25zdJEDOHN0ZDo6X18yOjptb25leXB1bmN0PGNoYXIsIGZhbHNlPjo6ZG9fcG9zX2Zvcm1hdCgpIGNvbnN0kgM+c3RkOjpfXzI6Om1vbmV5cHVuY3Q8d2NoYXJfdCwgZmFsc2U+Ojpkb19kZWNpbWFsX3BvaW50KCkgY29uc3STAz5zdGQ6Ol9fMjo6bW9uZXlwdW5jdDx3Y2hhcl90LCBmYWxzZT46OmRvX25lZ2F0aXZlX3NpZ24oKSBjb25zdJQDqQJzdGQ6Ol9fMjo6bW9uZXlfZ2V0PGNoYXIsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIGJvb2wsIHN0ZDo6X18yOjppb3NfYmFzZSYsIHVuc2lnbmVkIGludCYsIGxvbmcgZG91YmxlJikgY29uc3SVA4wDc3RkOjpfXzI6Om1vbmV5X2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+OjpfX2RvX2dldChzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiYsIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBib29sLCBzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JiwgdW5zaWduZWQgaW50LCB1bnNpZ25lZCBpbnQmLCBib29sJiwgc3RkOjpfXzI6OmN0eXBlPGNoYXI+IGNvbnN0Jiwgc3RkOjpfXzI6OnVuaXF1ZV9wdHI8Y2hhciwgdm9pZCAoKikodm9pZCopPiYsIGNoYXIqJiwgY2hhcioplgPdA3N0ZDo6X18yOjpfX21vbmV5X2dldDxjaGFyPjo6X19nYXRoZXJfaW5mbyhib29sLCBzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0Jiwgc3RkOjpfXzI6Om1vbmV5X2Jhc2U6OnBhdHRlcm4mLCBjaGFyJiwgY2hhciYsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+Jiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPiYsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4mLCBpbnQmKZcDUnN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+OjpvcGVyYXRvcisrKGludCmYA2Z2b2lkIHN0ZDo6X18yOjpfX2RvdWJsZV9vcl9ub3RoaW5nPGNoYXI+KHN0ZDo6X18yOjp1bmlxdWVfcHRyPGNoYXIsIHZvaWQgKCopKHZvaWQqKT4mLCBjaGFyKiYsIGNoYXIqJimZA4YBdm9pZCBzdGQ6Ol9fMjo6X19kb3VibGVfb3Jfbm90aGluZzx1bnNpZ25lZCBpbnQ+KHN0ZDo6X18yOjp1bmlxdWVfcHRyPHVuc2lnbmVkIGludCwgdm9pZCAoKikodm9pZCopPiYsIHVuc2lnbmVkIGludComLCB1bnNpZ25lZCBpbnQqJimaA/MCc3RkOjpfXzI6Om1vbmV5X2dldDxjaGFyLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+LCBib29sLCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+JikgY29uc3SbA15zdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+OjpjbGVhcigpnAPaAXN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4mIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID46Ol9fYXBwZW5kX2ZvcndhcmRfdW5zYWZlPGNoYXIqPihjaGFyKiwgY2hhciopnQN3c3RkOjpfXzI6Om1vbmV5cHVuY3Q8Y2hhciwgdHJ1ZT4gY29uc3QmIHN0ZDo6X18yOjp1c2VfZmFjZXQ8c3RkOjpfXzI6Om1vbmV5cHVuY3Q8Y2hhciwgdHJ1ZT4gPihzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0JimeA7kBc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6b3BlcmF0b3I9KHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4mJimfA3lzdGQ6Ol9fMjo6bW9uZXlwdW5jdDxjaGFyLCBmYWxzZT4gY29uc3QmIHN0ZDo6X18yOjp1c2VfZmFjZXQ8c3RkOjpfXzI6Om1vbmV5cHVuY3Q8Y2hhciwgZmFsc2U+ID4oc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYpoAPvAWJvb2wgc3RkOjpfXzI6OmVxdWFsPHN0ZDo6X18yOjpfX3dyYXBfaXRlcjxjaGFyKj4sIHN0ZDo6X18yOjpfX3dyYXBfaXRlcjxjaGFyKj4sIHN0ZDo6X18yOjpfX2VxdWFsX3RvPGNoYXIsIGNoYXI+ID4oc3RkOjpfXzI6Ol9fd3JhcF9pdGVyPGNoYXIqPiwgc3RkOjpfXzI6Ol9fd3JhcF9pdGVyPGNoYXIqPiwgc3RkOjpfXzI6Ol9fd3JhcF9pdGVyPGNoYXIqPiwgc3RkOjpfXzI6Ol9fZXF1YWxfdG88Y2hhciwgY2hhcj4poQMzc3RkOjpfXzI6Ol9fd3JhcF9pdGVyPGNoYXIqPjo6b3BlcmF0b3IrKGxvbmcpIGNvbnN0ogNlc3RkOjpfXzI6OnVuaXF1ZV9wdHI8Y2hhciwgdm9pZCAoKikodm9pZCopPjo6b3BlcmF0b3I9KHN0ZDo6X18yOjp1bmlxdWVfcHRyPGNoYXIsIHZvaWQgKCopKHZvaWQqKT4mJimjA74Cc3RkOjpfXzI6Om1vbmV5X2dldDx3Y2hhcl90LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBib29sLCBzdGQ6Ol9fMjo6aW9zX2Jhc2UmLCB1bnNpZ25lZCBpbnQmLCBsb25nIGRvdWJsZSYpIGNvbnN0pAOtA3N0ZDo6X18yOjptb25leV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6X19kb19nZXQoc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4mLCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgYm9vbCwgc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYsIHVuc2lnbmVkIGludCwgdW5zaWduZWQgaW50JiwgYm9vbCYsIHN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90PiBjb25zdCYsIHN0ZDo6X18yOjp1bmlxdWVfcHRyPHdjaGFyX3QsIHZvaWQgKCopKHZvaWQqKT4mLCB3Y2hhcl90KiYsIHdjaGFyX3QqKaUDgQRzdGQ6Ol9fMjo6X19tb25leV9nZXQ8d2NoYXJfdD46Ol9fZ2F0aGVyX2luZm8oYm9vbCwgc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYsIHN0ZDo6X18yOjptb25leV9iYXNlOjpwYXR0ZXJuJiwgd2NoYXJfdCYsIHdjaGFyX3QmLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+Jiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiYsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID4mLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+JiwgaW50JimmA1hzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPjo6b3BlcmF0b3IrKyhpbnQppwORA3N0ZDo6X18yOjptb25leV9nZXQ8d2NoYXJfdCwgc3RkOjpfXzI6OmlzdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4gPjo6ZG9fZ2V0KHN0ZDo6X18yOjppc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+LCBzdGQ6Ol9fMjo6aXN0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgYm9vbCwgc3RkOjpfXzI6Omlvc19iYXNlJiwgdW5zaWduZWQgaW50Jiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiYpIGNvbnN0qANnc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPjo6Y2xlYXIoKakD9QFzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+JiBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+OjpfX2FwcGVuZF9mb3J3YXJkX3Vuc2FmZTx3Y2hhcl90Kj4od2NoYXJfdCosIHdjaGFyX3QqKaoDfXN0ZDo6X18yOjptb25leXB1bmN0PHdjaGFyX3QsIHRydWU+IGNvbnN0JiBzdGQ6Ol9fMjo6dXNlX2ZhY2V0PHN0ZDo6X18yOjptb25leXB1bmN0PHdjaGFyX3QsIHRydWU+ID4oc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYpqwPLAXN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID46Om9wZXJhdG9yPShzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+JiYprAN/c3RkOjpfXzI6Om1vbmV5cHVuY3Q8d2NoYXJfdCwgZmFsc2U+IGNvbnN0JiBzdGQ6Ol9fMjo6dXNlX2ZhY2V0PHN0ZDo6X18yOjptb25leXB1bmN0PHdjaGFyX3QsIGZhbHNlPiA+KHN0ZDo6X18yOjpsb2NhbGUgY29uc3QmKa0DigJib29sIHN0ZDo6X18yOjplcXVhbDxzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8d2NoYXJfdCo+LCBzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8d2NoYXJfdCo+LCBzdGQ6Ol9fMjo6X19lcXVhbF90bzx3Y2hhcl90LCB3Y2hhcl90PiA+KHN0ZDo6X18yOjpfX3dyYXBfaXRlcjx3Y2hhcl90Kj4sIHN0ZDo6X18yOjpfX3dyYXBfaXRlcjx3Y2hhcl90Kj4sIHN0ZDo6X18yOjpfX3dyYXBfaXRlcjx3Y2hhcl90Kj4sIHN0ZDo6X18yOjpfX2VxdWFsX3RvPHdjaGFyX3QsIHdjaGFyX3Q+Ka4DNnN0ZDo6X18yOjpfX3dyYXBfaXRlcjx3Y2hhcl90Kj46Om9wZXJhdG9yKyhsb25nKSBjb25zdK8D3AFzdGQ6Ol9fMjo6bW9uZXlfcHV0PGNoYXIsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiwgYm9vbCwgc3RkOjpfXzI6Omlvc19iYXNlJiwgY2hhciwgbG9uZyBkb3VibGUpIGNvbnN0sAOLA3N0ZDo6X18yOjpfX21vbmV5X3B1dDxjaGFyPjo6X19nYXRoZXJfaW5mbyhib29sLCBib29sLCBzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0Jiwgc3RkOjpfXzI6Om1vbmV5X2Jhc2U6OnBhdHRlcm4mLCBjaGFyJiwgY2hhciYsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+Jiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPiYsIGludCYpsQPZA3N0ZDo6X18yOjpfX21vbmV5X3B1dDxjaGFyPjo6X19mb3JtYXQoY2hhciosIGNoYXIqJiwgY2hhciomLCB1bnNpZ25lZCBpbnQsIGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0Kiwgc3RkOjpfXzI6OmN0eXBlPGNoYXI+IGNvbnN0JiwgYm9vbCwgc3RkOjpfXzI6Om1vbmV5X2Jhc2U6OnBhdHRlcm4gY29uc3QmLCBjaGFyLCBjaGFyLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0Jiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPiBjb25zdCYsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gY29uc3QmLCBpbnQpsgOOAWNoYXIqIHN0ZDo6X18yOjpjb3B5PHN0ZDo6X18yOjpfX3dyYXBfaXRlcjxjaGFyIGNvbnN0Kj4sIGNoYXIqPihzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8Y2hhciBjb25zdCo+LCBzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8Y2hhciBjb25zdCo+LCBjaGFyKimzA60Cc3RkOjpfXzI6Om1vbmV5X3B1dDxjaGFyLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4sIGJvb2wsIHN0ZDo6X18yOjppb3NfYmFzZSYsIGNoYXIsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gY29uc3QmKSBjb25zdLQD7gFzdGQ6Ol9fMjo6bW9uZXlfcHV0PHdjaGFyX3QsIHN0ZDo6X18yOjpvc3RyZWFtYnVmX2l0ZXJhdG9yPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90PiA+ID46OmRvX3B1dChzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiwgYm9vbCwgc3RkOjpfXzI6Omlvc19iYXNlJiwgd2NoYXJfdCwgbG9uZyBkb3VibGUpIGNvbnN0tQOmA3N0ZDo6X18yOjpfX21vbmV5X3B1dDx3Y2hhcl90Pjo6X19nYXRoZXJfaW5mbyhib29sLCBib29sLCBzdGQ6Ol9fMjo6bG9jYWxlIGNvbnN0Jiwgc3RkOjpfXzI6Om1vbmV5X2Jhc2U6OnBhdHRlcm4mLCB3Y2hhcl90Jiwgd2NoYXJfdCYsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4mLCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+Jiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiYsIGludCYptgOGBHN0ZDo6X18yOjpfX21vbmV5X3B1dDx3Y2hhcl90Pjo6X19mb3JtYXQod2NoYXJfdCosIHdjaGFyX3QqJiwgd2NoYXJfdComLCB1bnNpZ25lZCBpbnQsIHdjaGFyX3QgY29uc3QqLCB3Y2hhcl90IGNvbnN0Kiwgc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+IGNvbnN0JiwgYm9vbCwgc3RkOjpfXzI6Om1vbmV5X2Jhc2U6OnBhdHRlcm4gY29uc3QmLCB3Y2hhcl90LCB3Y2hhcl90LCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0Jiwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiBjb25zdCYsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID4gY29uc3QmLCBpbnQptwOgAXdjaGFyX3QqIHN0ZDo6X18yOjpjb3B5PHN0ZDo6X18yOjpfX3dyYXBfaXRlcjx3Y2hhcl90IGNvbnN0Kj4sIHdjaGFyX3QqPihzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8d2NoYXJfdCBjb25zdCo+LCBzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8d2NoYXJfdCBjb25zdCo+LCB3Y2hhcl90Kim4A8gCc3RkOjpfXzI6Om1vbmV5X3B1dDx3Y2hhcl90LCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4gPiA+Ojpkb19wdXQoc3RkOjpfXzI6Om9zdHJlYW1idWZfaXRlcmF0b3I8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+ID4sIGJvb2wsIHN0ZDo6X18yOjppb3NfYmFzZSYsIHdjaGFyX3QsIHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID4gY29uc3QmKSBjb25zdLkDkAFjaGFyKiBzdGQ6Ol9fMjo6X19jb3B5PHN0ZDo6X18yOjpfX3dyYXBfaXRlcjxjaGFyIGNvbnN0Kj4sIGNoYXIqPihzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8Y2hhciBjb25zdCo+LCBzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8Y2hhciBjb25zdCo+LCBjaGFyKim6A6IBd2NoYXJfdCogc3RkOjpfXzI6Ol9fY29weTxzdGQ6Ol9fMjo6X193cmFwX2l0ZXI8d2NoYXJfdCBjb25zdCo+LCB3Y2hhcl90Kj4oc3RkOjpfXzI6Ol9fd3JhcF9pdGVyPHdjaGFyX3QgY29uc3QqPiwgc3RkOjpfXzI6Ol9fd3JhcF9pdGVyPHdjaGFyX3QgY29uc3QqPiwgd2NoYXJfdCopuwOeAXN0ZDo6X18yOjptZXNzYWdlczxjaGFyPjo6ZG9fb3BlbihzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0Jiwgc3RkOjpfXzI6OmxvY2FsZSBjb25zdCYpIGNvbnN0vAOUAXN0ZDo6X18yOjptZXNzYWdlczxjaGFyPjo6ZG9fZ2V0KGxvbmcsIGludCwgaW50LCBzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0JikgY29uc3S9A7gDc3RkOjpfXzI6OmJhY2tfaW5zZXJ0X2l0ZXJhdG9yPHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gPiBzdGQ6Ol9fMjo6X19uYXJyb3dfdG9fdXRmODw4dWw+OjpvcGVyYXRvcigpPHN0ZDo6X18yOjpiYWNrX2luc2VydF9pdGVyYXRvcjxzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+ID4sIGNoYXI+KHN0ZDo6X18yOjpiYWNrX2luc2VydF9pdGVyYXRvcjxzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+ID4sIGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KikgY29uc3S+A44Bc3RkOjpfXzI6OmJhY2tfaW5zZXJ0X2l0ZXJhdG9yPHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gPjo6b3BlcmF0b3I9KGNoYXIgY29uc3QmKb8DoAFzdGQ6Ol9fMjo6bWVzc2FnZXM8d2NoYXJfdD46OmRvX2dldChsb25nLCBpbnQsIGludCwgc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiBjb25zdCYpIGNvbnN0wAPCA3N0ZDo6X18yOjpiYWNrX2luc2VydF9pdGVyYXRvcjxzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+ID4gc3RkOjpfXzI6Ol9fbmFycm93X3RvX3V0Zjg8MzJ1bD46Om9wZXJhdG9yKCk8c3RkOjpfXzI6OmJhY2tfaW5zZXJ0X2l0ZXJhdG9yPHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gPiwgd2NoYXJfdD4oc3RkOjpfXzI6OmJhY2tfaW5zZXJ0X2l0ZXJhdG9yPHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID4gPiwgd2NoYXJfdCBjb25zdCosIHdjaGFyX3QgY29uc3QqKSBjb25zdMED0ANzdGQ6Ol9fMjo6YmFja19pbnNlcnRfaXRlcmF0b3I8c3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiA+IHN0ZDo6X18yOjpfX3dpZGVuX2Zyb21fdXRmODwzMnVsPjo6b3BlcmF0b3IoKTxzdGQ6Ol9fMjo6YmFja19pbnNlcnRfaXRlcmF0b3I8c3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPiA+ID4oc3RkOjpfXzI6OmJhY2tfaW5zZXJ0X2l0ZXJhdG9yPHN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID4gPiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqKSBjb25zdMIDOXN0ZDo6X18yOjpjb2RlY3Z0PHdjaGFyX3QsIGNoYXIsIF9fbWJzdGF0ZV90Pjo6fmNvZGVjdnQoKcMDLXN0ZDo6X18yOjpsb2NhbGU6Ol9faW1wOjpfX2ltcCh1bnNpZ25lZCBsb25nKcQDfnN0ZDo6X18yOjpfX3ZlY3Rvcl9iYXNlPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0Kiwgc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+ID46Ol9fdmVjdG9yX2Jhc2UoKcUDggFzdGQ6Ol9fMjo6dmVjdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0Kiwgc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+ID46Ol9fdmFsbG9jYXRlKHVuc2lnbmVkIGxvbmcpxgOJAXN0ZDo6X18yOjp2ZWN0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCBzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4gPjo6X19jb25zdHJ1Y3RfYXRfZW5kKHVuc2lnbmVkIGxvbmcpxwN2c3RkOjpfXzI6Ol9fdmVjdG9yX2Jhc2U8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCBzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4gPjo6Y2xlYXIoKcgDjgFzdGQ6Ol9fMjo6dmVjdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0Kiwgc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+ID46Ol9fYW5ub3RhdGVfc2hyaW5rKHVuc2lnbmVkIGxvbmcpIGNvbnN0yQMdc3RkOjpfXzI6OmxvY2FsZTo6aWQ6Ol9fZ2V0KCnKA0BzdGQ6Ol9fMjo6bG9jYWxlOjpfX2ltcDo6aW5zdGFsbChzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIGxvbmcpywNIc3RkOjpfXzI6OmN0eXBlPGNoYXI+OjpjdHlwZSh1bnNpZ25lZCBzaG9ydCBjb25zdCosIGJvb2wsIHVuc2lnbmVkIGxvbmcpzAMbc3RkOjpfXzI6OmxvY2FsZTo6Y2xhc3NpYygpzQN9c3RkOjpfXzI6OnZlY3RvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiA+OjpyZXNpemUodW5zaWduZWQgbG9uZynOAyFzdGQ6Ol9fMjo6bG9jYWxlOjpfX2ltcDo6fl9faW1wKCnPA4EBc3RkOjpfXzI6OnZlY3RvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiA+OjpfX2Fubm90YXRlX2RlbGV0ZSgpIGNvbnN00AMjc3RkOjpfXzI6OmxvY2FsZTo6X19pbXA6On5fX2ltcCgpLjHRA39zdGQ6Ol9fMjo6dmVjdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0Kiwgc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+ID46Ol9fYXBwZW5kKHVuc2lnbmVkIGxvbmcp0gMcc3RkOjpfXzI6OmxvY2FsZTo6X19nbG9iYWwoKdMDGnN0ZDo6X18yOjpsb2NhbGU6OmxvY2FsZSgp1AMec3RkOjpfXzI6OmxvY2FsZTo6aWQ6Ol9faW5pdCgp1QOMAXZvaWQgc3RkOjpfXzI6OmNhbGxfb25jZTxzdGQ6Ol9fMjo6KGFub255bW91cyBuYW1lc3BhY2UpOjpfX2Zha2VfYmluZD4oc3RkOjpfXzI6Om9uY2VfZmxhZyYsIHN0ZDo6X18yOjooYW5vbnltb3VzIG5hbWVzcGFjZSk6Ol9fZmFrZV9iaW5kJiYp1gMrc3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQ6Ol9fb25femVyb19zaGFyZWQoKdcDaXZvaWQgc3RkOjpfXzI6Ol9fY2FsbF9vbmNlX3Byb3h5PHN0ZDo6X18yOjp0dXBsZTxzdGQ6Ol9fMjo6KGFub255bW91cyBuYW1lc3BhY2UpOjpfX2Zha2VfYmluZCYmPiA+KHZvaWQqKdgDPnN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90Pjo6ZG9faXModW5zaWduZWQgc2hvcnQsIHdjaGFyX3QpIGNvbnN02QNWc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+Ojpkb19pcyh3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCosIHVuc2lnbmVkIHNob3J0KikgY29uc3TaA1pzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD46OmRvX3NjYW5faXModW5zaWduZWQgc2hvcnQsIHdjaGFyX3QgY29uc3QqLCB3Y2hhcl90IGNvbnN0KikgY29uc3TbA1tzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD46OmRvX3NjYW5fbm90KHVuc2lnbmVkIHNob3J0LCB3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCopIGNvbnN03AMzc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+Ojpkb190b3VwcGVyKHdjaGFyX3QpIGNvbnN03QNEc3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+Ojpkb190b3VwcGVyKHdjaGFyX3QqLCB3Y2hhcl90IGNvbnN0KikgY29uc3TeAzNzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD46OmRvX3RvbG93ZXIod2NoYXJfdCkgY29uc3TfA0RzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD46OmRvX3RvbG93ZXIod2NoYXJfdCosIHdjaGFyX3QgY29uc3QqKSBjb25zdOADLnN0ZDo6X18yOjpjdHlwZTx3Y2hhcl90Pjo6ZG9fd2lkZW4oY2hhcikgY29uc3ThA0xzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD46OmRvX3dpZGVuKGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0Kiwgd2NoYXJfdCopIGNvbnN04gM4c3RkOjpfXzI6OmN0eXBlPHdjaGFyX3Q+Ojpkb19uYXJyb3cod2NoYXJfdCwgY2hhcikgY29uc3TjA1ZzdGQ6Ol9fMjo6Y3R5cGU8d2NoYXJfdD46OmRvX25hcnJvdyh3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCosIGNoYXIsIGNoYXIqKSBjb25zdOQDH3N0ZDo6X18yOjpjdHlwZTxjaGFyPjo6fmN0eXBlKCnlAyFzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj46On5jdHlwZSgpLjHmAy1zdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj46OmRvX3RvdXBwZXIoY2hhcikgY29uc3TnAztzdGQ6Ol9fMjo6Y3R5cGU8Y2hhcj46OmRvX3RvdXBwZXIoY2hhciosIGNoYXIgY29uc3QqKSBjb25zdOgDLXN0ZDo6X18yOjpjdHlwZTxjaGFyPjo6ZG9fdG9sb3dlcihjaGFyKSBjb25zdOkDO3N0ZDo6X18yOjpjdHlwZTxjaGFyPjo6ZG9fdG9sb3dlcihjaGFyKiwgY2hhciBjb25zdCopIGNvbnN06gNGc3RkOjpfXzI6OmN0eXBlPGNoYXI+Ojpkb193aWRlbihjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIGNoYXIqKSBjb25zdOsDMnN0ZDo6X18yOjpjdHlwZTxjaGFyPjo6ZG9fbmFycm93KGNoYXIsIGNoYXIpIGNvbnN07ANNc3RkOjpfXzI6OmN0eXBlPGNoYXI+Ojpkb19uYXJyb3coY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCBjaGFyLCBjaGFyKikgY29uc3TtA4QBc3RkOjpfXzI6OmNvZGVjdnQ8Y2hhciwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19vdXQoX19tYnN0YXRlX3QmLCBjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqJiwgY2hhciosIGNoYXIqLCBjaGFyKiYpIGNvbnN07gNgc3RkOjpfXzI6OmNvZGVjdnQ8Y2hhciwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb191bnNoaWZ0KF9fbWJzdGF0ZV90JiwgY2hhciosIGNoYXIqLCBjaGFyKiYpIGNvbnN07wNyc3RkOjpfXzI6OmNvZGVjdnQ8Y2hhciwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19sZW5ndGgoX19tYnN0YXRlX3QmLCBjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIHVuc2lnbmVkIGxvbmcpIGNvbnN08AM7c3RkOjpfXzI6OmNvZGVjdnQ8d2NoYXJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojp+Y29kZWN2dCgpLjHxA5ABc3RkOjpfXzI6OmNvZGVjdnQ8d2NoYXJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19vdXQoX19tYnN0YXRlX3QmLCB3Y2hhcl90IGNvbnN0Kiwgd2NoYXJfdCBjb25zdCosIHdjaGFyX3QgY29uc3QqJiwgY2hhciosIGNoYXIqLCBjaGFyKiYpIGNvbnN08gN1c3RkOjpfXzI6Ol9fbGliY3BwX3djc25ydG9tYnNfbChjaGFyKiwgd2NoYXJfdCBjb25zdCoqLCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBsb25nLCBfX21ic3RhdGVfdCosIF9fbG9jYWxlX3N0cnVjdCop8wNMc3RkOjpfXzI6Ol9fbGliY3BwX3djcnRvbWJfbChjaGFyKiwgd2NoYXJfdCwgX19tYnN0YXRlX3QqLCBfX2xvY2FsZV9zdHJ1Y3QqKfQDjwFzdGQ6Ol9fMjo6Y29kZWN2dDx3Y2hhcl90LCBjaGFyLCBfX21ic3RhdGVfdD46OmRvX2luKF9fbWJzdGF0ZV90JiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiYsIHdjaGFyX3QqLCB3Y2hhcl90Kiwgd2NoYXJfdComKSBjb25zdPUDdXN0ZDo6X18yOjpfX2xpYmNwcF9tYnNucnRvd2NzX2wod2NoYXJfdCosIGNoYXIgY29uc3QqKiwgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgX19tYnN0YXRlX3QqLCBfX2xvY2FsZV9zdHJ1Y3QqKfYDYnN0ZDo6X18yOjpfX2xpYmNwcF9tYnJ0b3djX2wod2NoYXJfdCosIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nLCBfX21ic3RhdGVfdCosIF9fbG9jYWxlX3N0cnVjdCop9wNjc3RkOjpfXzI6OmNvZGVjdnQ8d2NoYXJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb191bnNoaWZ0KF9fbWJzdGF0ZV90JiwgY2hhciosIGNoYXIqLCBjaGFyKiYpIGNvbnN0+ANCc3RkOjpfXzI6OmNvZGVjdnQ8d2NoYXJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19lbmNvZGluZygpIGNvbnN0+QNTc3RkOjpfXzI6Ol9fbGliY3BwX21idG93Y19sKHdjaGFyX3QqLCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgbG9uZywgX19sb2NhbGVfc3RydWN0Kin6AzFzdGQ6Ol9fMjo6X19saWJjcHBfbWJfY3VyX21heF9sKF9fbG9jYWxlX3N0cnVjdCop+wN1c3RkOjpfXzI6OmNvZGVjdnQ8d2NoYXJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19sZW5ndGgoX19tYnN0YXRlX3QmLCBjaGFyIGNvbnN0KiwgY2hhciBjb25zdCosIHVuc2lnbmVkIGxvbmcpIGNvbnN0/ANXc3RkOjpfXzI6Ol9fbGliY3BwX21icmxlbl9sKGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nLCBfX21ic3RhdGVfdCosIF9fbG9jYWxlX3N0cnVjdCop/QNEc3RkOjpfXzI6OmNvZGVjdnQ8d2NoYXJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19tYXhfbGVuZ3RoKCkgY29uc3T+A5QBc3RkOjpfXzI6OmNvZGVjdnQ8Y2hhcjE2X3QsIGNoYXIsIF9fbWJzdGF0ZV90Pjo6ZG9fb3V0KF9fbWJzdGF0ZV90JiwgY2hhcjE2X3QgY29uc3QqLCBjaGFyMTZfdCBjb25zdCosIGNoYXIxNl90IGNvbnN0KiYsIGNoYXIqLCBjaGFyKiwgY2hhciomKSBjb25zdP8DtQFzdGQ6Ol9fMjo6dXRmMTZfdG9fdXRmOCh1bnNpZ25lZCBzaG9ydCBjb25zdCosIHVuc2lnbmVkIHNob3J0IGNvbnN0KiwgdW5zaWduZWQgc2hvcnQgY29uc3QqJiwgdW5zaWduZWQgY2hhciosIHVuc2lnbmVkIGNoYXIqLCB1bnNpZ25lZCBjaGFyKiYsIHVuc2lnbmVkIGxvbmcsIHN0ZDo6X18yOjpjb2RlY3Z0X21vZGUpgASTAXN0ZDo6X18yOjpjb2RlY3Z0PGNoYXIxNl90LCBjaGFyLCBfX21ic3RhdGVfdD46OmRvX2luKF9fbWJzdGF0ZV90JiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiYsIGNoYXIxNl90KiwgY2hhcjE2X3QqLCBjaGFyMTZfdComKSBjb25zdIEEtQFzdGQ6Ol9fMjo6dXRmOF90b191dGYxNih1bnNpZ25lZCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgY2hhciBjb25zdCosIHVuc2lnbmVkIGNoYXIgY29uc3QqJiwgdW5zaWduZWQgc2hvcnQqLCB1bnNpZ25lZCBzaG9ydCosIHVuc2lnbmVkIHNob3J0KiYsIHVuc2lnbmVkIGxvbmcsIHN0ZDo6X18yOjpjb2RlY3Z0X21vZGUpggR2c3RkOjpfXzI6OmNvZGVjdnQ8Y2hhcjE2X3QsIGNoYXIsIF9fbWJzdGF0ZV90Pjo6ZG9fbGVuZ3RoKF9fbWJzdGF0ZV90JiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nKSBjb25zdIMEgAFzdGQ6Ol9fMjo6dXRmOF90b191dGYxNl9sZW5ndGgodW5zaWduZWQgY2hhciBjb25zdCosIHVuc2lnbmVkIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBsb25nLCBzdGQ6Ol9fMjo6Y29kZWN2dF9tb2RlKYQERXN0ZDo6X18yOjpjb2RlY3Z0PGNoYXIxNl90LCBjaGFyLCBfX21ic3RhdGVfdD46OmRvX21heF9sZW5ndGgoKSBjb25zdIUElAFzdGQ6Ol9fMjo6Y29kZWN2dDxjaGFyMzJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19vdXQoX19tYnN0YXRlX3QmLCBjaGFyMzJfdCBjb25zdCosIGNoYXIzMl90IGNvbnN0KiwgY2hhcjMyX3QgY29uc3QqJiwgY2hhciosIGNoYXIqLCBjaGFyKiYpIGNvbnN0hgSuAXN0ZDo6X18yOjp1Y3M0X3RvX3V0ZjgodW5zaWduZWQgaW50IGNvbnN0KiwgdW5zaWduZWQgaW50IGNvbnN0KiwgdW5zaWduZWQgaW50IGNvbnN0KiYsIHVuc2lnbmVkIGNoYXIqLCB1bnNpZ25lZCBjaGFyKiwgdW5zaWduZWQgY2hhciomLCB1bnNpZ25lZCBsb25nLCBzdGQ6Ol9fMjo6Y29kZWN2dF9tb2RlKYcEkwFzdGQ6Ol9fMjo6Y29kZWN2dDxjaGFyMzJfdCwgY2hhciwgX19tYnN0YXRlX3Q+Ojpkb19pbihfX21ic3RhdGVfdCYsIGNoYXIgY29uc3QqLCBjaGFyIGNvbnN0KiwgY2hhciBjb25zdComLCBjaGFyMzJfdCosIGNoYXIzMl90KiwgY2hhcjMyX3QqJikgY29uc3SIBK4Bc3RkOjpfXzI6OnV0ZjhfdG9fdWNzNCh1bnNpZ25lZCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgY2hhciBjb25zdCosIHVuc2lnbmVkIGNoYXIgY29uc3QqJiwgdW5zaWduZWQgaW50KiwgdW5zaWduZWQgaW50KiwgdW5zaWduZWQgaW50KiYsIHVuc2lnbmVkIGxvbmcsIHN0ZDo6X18yOjpjb2RlY3Z0X21vZGUpiQR2c3RkOjpfXzI6OmNvZGVjdnQ8Y2hhcjMyX3QsIGNoYXIsIF9fbWJzdGF0ZV90Pjo6ZG9fbGVuZ3RoKF9fbWJzdGF0ZV90JiwgY2hhciBjb25zdCosIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nKSBjb25zdIoEf3N0ZDo6X18yOjp1dGY4X3RvX3VjczRfbGVuZ3RoKHVuc2lnbmVkIGNoYXIgY29uc3QqLCB1bnNpZ25lZCBjaGFyIGNvbnN0KiwgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgc3RkOjpfXzI6OmNvZGVjdnRfbW9kZSmLBCVzdGQ6Ol9fMjo6bnVtcHVuY3Q8Y2hhcj46On5udW1wdW5jdCgpjAQnc3RkOjpfXzI6Om51bXB1bmN0PGNoYXI+Ojp+bnVtcHVuY3QoKS4xjQQoc3RkOjpfXzI6Om51bXB1bmN0PHdjaGFyX3Q+Ojp+bnVtcHVuY3QoKY4EKnN0ZDo6X18yOjpudW1wdW5jdDx3Y2hhcl90Pjo6fm51bXB1bmN0KCkuMY8EMnN0ZDo6X18yOjpudW1wdW5jdDxjaGFyPjo6ZG9fZGVjaW1hbF9wb2ludCgpIGNvbnN0kAQyc3RkOjpfXzI6Om51bXB1bmN0PGNoYXI+Ojpkb190aG91c2FuZHNfc2VwKCkgY29uc3SRBC1zdGQ6Ol9fMjo6bnVtcHVuY3Q8Y2hhcj46OmRvX2dyb3VwaW5nKCkgY29uc3SSBDBzdGQ6Ol9fMjo6bnVtcHVuY3Q8d2NoYXJfdD46OmRvX2dyb3VwaW5nKCkgY29uc3STBC1zdGQ6Ol9fMjo6bnVtcHVuY3Q8Y2hhcj46OmRvX3RydWVuYW1lKCkgY29uc3SUBDBzdGQ6Ol9fMjo6bnVtcHVuY3Q8d2NoYXJfdD46OmRvX3RydWVuYW1lKCkgY29uc3SVBHxzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+OjpiYXNpY19zdHJpbmcod2NoYXJfdCBjb25zdCoplgQuc3RkOjpfXzI6Om51bXB1bmN0PGNoYXI+Ojpkb19mYWxzZW5hbWUoKSBjb25zdJcEMXN0ZDo6X18yOjpudW1wdW5jdDx3Y2hhcl90Pjo6ZG9fZmFsc2VuYW1lKCkgY29uc3SYBG1zdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+OjpvcGVyYXRvcj0oY2hhciBjb25zdCopmQQ1c3RkOjpfXzI6Ol9fdGltZV9nZXRfY19zdG9yYWdlPGNoYXI+OjpfX3dlZWtzKCkgY29uc3SaBBZzdGQ6Ol9fMjo6aW5pdF93ZWVrcygpmwQaX19jeHhfZ2xvYmFsX2FycmF5X2R0b3IuNTScBDhzdGQ6Ol9fMjo6X190aW1lX2dldF9jX3N0b3JhZ2U8d2NoYXJfdD46Ol9fd2Vla3MoKSBjb25zdJ0EF3N0ZDo6X18yOjppbml0X3d3ZWVrcygpngQaX19jeHhfZ2xvYmFsX2FycmF5X2R0b3IuNjmfBHlzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+OjpvcGVyYXRvcj0od2NoYXJfdCBjb25zdCopoAQ2c3RkOjpfXzI6Ol9fdGltZV9nZXRfY19zdG9yYWdlPGNoYXI+OjpfX21vbnRocygpIGNvbnN0oQQXc3RkOjpfXzI6OmluaXRfbW9udGhzKCmiBBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci44NKMEOXN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTx3Y2hhcl90Pjo6X19tb250aHMoKSBjb25zdKQEGHN0ZDo6X18yOjppbml0X3dtb250aHMoKaUEG19fY3h4X2dsb2JhbF9hcnJheV9kdG9yLjEwOKYENXN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTxjaGFyPjo6X19hbV9wbSgpIGNvbnN0pwQWc3RkOjpfXzI6OmluaXRfYW1fcG0oKagEG19fY3h4X2dsb2JhbF9hcnJheV9kdG9yLjEzMqkEOHN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTx3Y2hhcl90Pjo6X19hbV9wbSgpIGNvbnN0qgQXc3RkOjpfXzI6OmluaXRfd2FtX3BtKCmrBBtfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci4xMzWsBDFzdGQ6Ol9fMjo6X190aW1lX2dldF9jX3N0b3JhZ2U8Y2hhcj46Ol9feCgpIGNvbnN0rQQZX19jeHhfZ2xvYmFsX2FycmF5X2R0b3IuMa4ENHN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTx3Y2hhcl90Pjo6X194KCkgY29uc3SvBBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci4zMbAEMXN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTxjaGFyPjo6X19YKCkgY29uc3SxBBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci4zM7IENHN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTx3Y2hhcl90Pjo6X19YKCkgY29uc3SzBBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci4zNbQEMXN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTxjaGFyPjo6X19jKCkgY29uc3S1BBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci4zN7YENHN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTx3Y2hhcl90Pjo6X19jKCkgY29uc3S3BBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci4zObgEMXN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTxjaGFyPjo6X19yKCkgY29uc3S5BBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci40MboENHN0ZDo6X18yOjpfX3RpbWVfZ2V0X2Nfc3RvcmFnZTx3Y2hhcl90Pjo6X19yKCkgY29uc3S7BBpfX2N4eF9nbG9iYWxfYXJyYXlfZHRvci40M7wEaXN0ZDo6X18yOjp0aW1lX3B1dDxjaGFyLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojp+dGltZV9wdXQoKb0Ea3N0ZDo6X18yOjp0aW1lX3B1dDxjaGFyLCBzdGQ6Ol9fMjo6b3N0cmVhbWJ1Zl9pdGVyYXRvcjxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPiA+Ojp+dGltZV9wdXQoKS4xvgR4c3RkOjpfXzI6OnZlY3RvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiA+OjptYXhfc2l6ZSgpIGNvbnN0vwSrAXN0ZDo6X18yOjphbGxvY2F0b3JfdHJhaXRzPHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiA+OjphbGxvY2F0ZShzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4mLCB1bnNpZ25lZCBsb25nKcAEiwFzdGQ6Ol9fMjo6dmVjdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0Kiwgc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+ID46Ol9fYW5ub3RhdGVfbmV3KHVuc2lnbmVkIGxvbmcpIGNvbnN0wQRfc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+OjphbGxvY2F0ZSh1bnNpZ25lZCBsb25nLCB2b2lkIGNvbnN0KinCBD9zdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+OjphbGxvY2F0ZSh1bnNpZ25lZCBsb25nLCB2b2lkIGNvbnN0KinDBMgBc3RkOjpfXzI6OmFsbG9jYXRvcl90cmFpdHM8c3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+ID46OmRlYWxsb2NhdGUoc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+Jiwgc3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqKiwgdW5zaWduZWQgbG9uZynEBJsBc3RkOjpfXzI6Ol9fdmVjdG9yX2Jhc2U8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCBzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4gPjo6X19kZXN0cnVjdF9hdF9lbmQoc3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqKinFBCJzdGQ6Ol9fMjo6X190aW1lX3B1dDo6X190aW1lX3B1dCgpxgSIAXN0ZDo6X18yOjp2ZWN0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCBzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4gPjo6X19yZWNvbW1lbmQodW5zaWduZWQgbG9uZykgY29uc3THBNgBc3RkOjpfXzI6Ol9fc3BsaXRfYnVmZmVyPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0Kiwgc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+Jj46Ol9fc3BsaXRfYnVmZmVyKHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiYpyASRAXN0ZDo6X18yOjpfX3NwbGl0X2J1ZmZlcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiY+OjpfX2NvbnN0cnVjdF9hdF9lbmQodW5zaWduZWQgbG9uZynJBPMBc3RkOjpfXzI6OnZlY3RvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiA+OjpfX3N3YXBfb3V0X2NpcmN1bGFyX2J1ZmZlcihzdGQ6Ol9fMjo6X19zcGxpdF9idWZmZXI8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCBzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4mPiYpygTGA3N0ZDo6X18yOjplbmFibGVfaWY8KChzdGQ6Ol9fMjo6aW50ZWdyYWxfY29uc3RhbnQ8Ym9vbCwgZmFsc2U+Ojp2YWx1ZSkgfHwgKCEoX19oYXNfY29uc3RydWN0PHN0ZDo6X18yOjpfX3Nzb19hbGxvY2F0b3I8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqLCAyOHVsPiwgYm9vbCosIGJvb2w+Ojp2YWx1ZSkpKSAmJiAoaXNfdHJpdmlhbGx5X21vdmVfY29uc3RydWN0aWJsZTxib29sPjo6dmFsdWUpLCB2b2lkPjo6dHlwZSBzdGQ6Ol9fMjo6YWxsb2NhdG9yX3RyYWl0czxzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4gPjo6X19jb25zdHJ1Y3RfYmFja3dhcmQ8c3RkOjpfXzI6OmxvY2FsZTo6ZmFjZXQqPihzdGQ6Ol9fMjo6X19zc29fYWxsb2NhdG9yPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiwgMjh1bD4mLCBib29sKiwgYm9vbCosIGJvb2wqJinLBMYBc3RkOjpfXzI6Ol9fc3BsaXRfYnVmZmVyPHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0Kiwgc3RkOjpfXzI6Ol9fc3NvX2FsbG9jYXRvcjxzdGQ6Ol9fMjo6bG9jYWxlOjpmYWNldCosIDI4dWw+Jj46Ol9fZGVzdHJ1Y3RfYXRfZW5kKHN0ZDo6X18yOjpsb2NhbGU6OmZhY2V0KiosIHN0ZDo6X18yOjppbnRlZ3JhbF9jb25zdGFudDxib29sLCBmYWxzZT4pzARAc3RkOjpfXzI6Oihhbm9ueW1vdXMgbmFtZXNwYWNlKTo6X19mYWtlX2JpbmQ6Om9wZXJhdG9yKCkoKSBjb25zdM0EQnN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD46OmFsbG9jYXRlKHVuc2lnbmVkIGxvbmcsIHZvaWQgY29uc3QqKc4Ea3N0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID46Ol9fY2xlYXJfYW5kX3NocmluaygpzwR0c3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPjo6X19jbGVhcl9hbmRfc2hyaW5rKCnQBENsb25nIGRvdWJsZSBzdGQ6Ol9fMjo6X19kb19zdHJ0b2Q8bG9uZyBkb3VibGU+KGNoYXIgY29uc3QqLCBjaGFyKiop0QQtc3RkOjpfXzI6Ol9fc2hhcmVkX2NvdW50Ojp+X19zaGFyZWRfY291bnQoKS4x0gRGc3RkOjpfXzI6Ol9fY2FsbF9vbmNlKHVuc2lnbmVkIGxvbmcgdm9sYXRpbGUmLCB2b2lkKiwgdm9pZCAoKikodm9pZCopKdMEGHN0ZDo6X190aHJvd19iYWRfYWxsb2MoKdQEG29wZXJhdG9yIG5ldyh1bnNpZ25lZCBsb25nKdUEB3dtZW1zZXTWBAh3bWVtbW92ZdcECl9fb3ZlcmZsb3fYBENzdGQ6Ol9fMjo6X19iYXNpY19zdHJpbmdfY29tbW9uPHRydWU+OjpfX3Rocm93X2xlbmd0aF9lcnJvcigpIGNvbnN02QTBAXN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID46OmJhc2ljX3N0cmluZyhzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+IGNvbnN0JinaBHlzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+OjpfX2luaXQoY2hhciBjb25zdCosIHVuc2lnbmVkIGxvbmcp2wRmc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6fmJhc2ljX3N0cmluZygp3AR5c3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6YXNzaWduKGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nKd0E0wFzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiwgc3RkOjpfXzI6OmFsbG9jYXRvcjxjaGFyPiA+OjpfX2dyb3dfYnlfYW5kX3JlcGxhY2UodW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgY2hhciBjb25zdCop3gRyc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6cmVzaXplKHVuc2lnbmVkIGxvbmcsIGNoYXIp3wRyc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6YXBwZW5kKHVuc2lnbmVkIGxvbmcsIGNoYXIp4AR0c3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6X19lcmFzZV90b19lbmQodW5zaWduZWQgbG9uZynhBLoBc3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6X19ncm93X2J5KHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcp4gQ/c3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+Ojphc3NpZ24oY2hhciosIHVuc2lnbmVkIGxvbmcsIGNoYXIp4wR5c3RkOjpfXzI6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPjo6YXBwZW5kKGNoYXIgY29uc3QqLCB1bnNpZ25lZCBsb25nKeQEZnN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID46OnB1c2hfYmFjayhjaGFyKeUEcnN0ZDo6X18yOjpiYXNpY19zdHJpbmc8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPGNoYXI+ID46Ol9faW5pdCh1bnNpZ25lZCBsb25nLCBjaGFyKeYEhQFzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+OjpfX2luaXQod2NoYXJfdCBjb25zdCosIHVuc2lnbmVkIGxvbmcp5wSFAXN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID46OmFzc2lnbih3Y2hhcl90IGNvbnN0KiwgdW5zaWduZWQgbG9uZynoBN8Bc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPjo6X19ncm93X2J5X2FuZF9yZXBsYWNlKHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHdjaGFyX3QgY29uc3QqKekEwwFzdGQ6Ol9fMjo6YmFzaWNfc3RyaW5nPHdjaGFyX3QsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czx3Y2hhcl90Piwgc3RkOjpfXzI6OmFsbG9jYXRvcjx3Y2hhcl90PiA+OjpfX2dyb3dfYnkodW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZynqBIUBc3RkOjpfXzI6OmJhc2ljX3N0cmluZzx3Y2hhcl90LCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8d2NoYXJfdD4sIHN0ZDo6X18yOjphbGxvY2F0b3I8d2NoYXJfdD4gPjo6YXBwZW5kKHdjaGFyX3QgY29uc3QqLCB1bnNpZ25lZCBsb25nKesEcnN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID46OnB1c2hfYmFjayh3Y2hhcl90KewEfnN0ZDo6X18yOjpiYXNpY19zdHJpbmc8d2NoYXJfdCwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPHdjaGFyX3Q+LCBzdGQ6Ol9fMjo6YWxsb2NhdG9yPHdjaGFyX3Q+ID46Ol9faW5pdCh1bnNpZ25lZCBsb25nLCB3Y2hhcl90Ke0EBWZwdXRj7gQNYWJvcnRfbWVzc2FnZe8EEl9fY3hhX3B1cmVfdmlydHVhbPAEYV9fY3h4YWJpdjE6Ol9fZnVuZGFtZW50YWxfdHlwZV9pbmZvOjpjYW5fY2F0Y2goX19jeHhhYml2MTo6X19zaGltX3R5cGVfaW5mbyBjb25zdCosIHZvaWQqJikgY29uc3TxBDxpc19lcXVhbChzdGQ6OnR5cGVfaW5mbyBjb25zdCosIHN0ZDo6dHlwZV9pbmZvIGNvbnN0KiwgYm9vbCnyBFtfX2N4eGFiaXYxOjpfX2NsYXNzX3R5cGVfaW5mbzo6Y2FuX2NhdGNoKF9fY3h4YWJpdjE6Ol9fc2hpbV90eXBlX2luZm8gY29uc3QqLCB2b2lkKiYpIGNvbnN08wQOX19keW5hbWljX2Nhc3T0BGtfX2N4eGFiaXYxOjpfX2NsYXNzX3R5cGVfaW5mbzo6cHJvY2Vzc19mb3VuZF9iYXNlX2NsYXNzKF9fY3h4YWJpdjE6Ol9fZHluYW1pY19jYXN0X2luZm8qLCB2b2lkKiwgaW50KSBjb25zdPUEbl9fY3h4YWJpdjE6Ol9fY2xhc3NfdHlwZV9pbmZvOjpoYXNfdW5hbWJpZ3VvdXNfcHVibGljX2Jhc2UoX19jeHhhYml2MTo6X19keW5hbWljX2Nhc3RfaW5mbyosIHZvaWQqLCBpbnQpIGNvbnN09gRxX19jeHhhYml2MTo6X19zaV9jbGFzc190eXBlX2luZm86Omhhc191bmFtYmlndW91c19wdWJsaWNfYmFzZShfX2N4eGFiaXYxOjpfX2R5bmFtaWNfY2FzdF9pbmZvKiwgdm9pZCosIGludCkgY29uc3T3BHNfX2N4eGFiaXYxOjpfX2Jhc2VfY2xhc3NfdHlwZV9pbmZvOjpoYXNfdW5hbWJpZ3VvdXNfcHVibGljX2Jhc2UoX19jeHhhYml2MTo6X19keW5hbWljX2Nhc3RfaW5mbyosIHZvaWQqLCBpbnQpIGNvbnN0+ARyX19jeHhhYml2MTo6X192bWlfY2xhc3NfdHlwZV9pbmZvOjpoYXNfdW5hbWJpZ3VvdXNfcHVibGljX2Jhc2UoX19jeHhhYml2MTo6X19keW5hbWljX2Nhc3RfaW5mbyosIHZvaWQqLCBpbnQpIGNvbnN0+QRbX19jeHhhYml2MTo6X19wYmFzZV90eXBlX2luZm86OmNhbl9jYXRjaChfX2N4eGFiaXYxOjpfX3NoaW1fdHlwZV9pbmZvIGNvbnN0Kiwgdm9pZComKSBjb25zdPoEXV9fY3h4YWJpdjE6Ol9fcG9pbnRlcl90eXBlX2luZm86OmNhbl9jYXRjaChfX2N4eGFiaXYxOjpfX3NoaW1fdHlwZV9pbmZvIGNvbnN0Kiwgdm9pZComKSBjb25zdPsEXF9fY3h4YWJpdjE6Ol9fcG9pbnRlcl90eXBlX2luZm86OmNhbl9jYXRjaF9uZXN0ZWQoX19jeHhhYml2MTo6X19zaGltX3R5cGVfaW5mbyBjb25zdCopIGNvbnN0/ARmX19jeHhhYml2MTo6X19wb2ludGVyX3RvX21lbWJlcl90eXBlX2luZm86OmNhbl9jYXRjaF9uZXN0ZWQoX19jeHhhYml2MTo6X19zaGltX3R5cGVfaW5mbyBjb25zdCopIGNvbnN0/QSDAV9fY3h4YWJpdjE6Ol9fY2xhc3NfdHlwZV9pbmZvOjpwcm9jZXNzX3N0YXRpY190eXBlX2Fib3ZlX2RzdChfX2N4eGFiaXYxOjpfX2R5bmFtaWNfY2FzdF9pbmZvKiwgdm9pZCBjb25zdCosIHZvaWQgY29uc3QqLCBpbnQpIGNvbnN0/gRzX19jeHhhYml2MTo6X192bWlfY2xhc3NfdHlwZV9pbmZvOjpzZWFyY2hfYmVsb3dfZHN0KF9fY3h4YWJpdjE6Ol9fZHluYW1pY19jYXN0X2luZm8qLCB2b2lkIGNvbnN0KiwgaW50LCBib29sKSBjb25zdP8EgQFfX2N4eGFiaXYxOjpfX2Jhc2VfY2xhc3NfdHlwZV9pbmZvOjpzZWFyY2hfYWJvdmVfZHN0KF9fY3h4YWJpdjE6Ol9fZHluYW1pY19jYXN0X2luZm8qLCB2b2lkIGNvbnN0Kiwgdm9pZCBjb25zdCosIGludCwgYm9vbCkgY29uc3SABXRfX2N4eGFiaXYxOjpfX2Jhc2VfY2xhc3NfdHlwZV9pbmZvOjpzZWFyY2hfYmVsb3dfZHN0KF9fY3h4YWJpdjE6Ol9fZHluYW1pY19jYXN0X2luZm8qLCB2b2lkIGNvbnN0KiwgaW50LCBib29sKSBjb25zdIEFcl9fY3h4YWJpdjE6Ol9fc2lfY2xhc3NfdHlwZV9pbmZvOjpzZWFyY2hfYmVsb3dfZHN0KF9fY3h4YWJpdjE6Ol9fZHluYW1pY19jYXN0X2luZm8qLCB2b2lkIGNvbnN0KiwgaW50LCBib29sKSBjb25zdIIFb19fY3h4YWJpdjE6Ol9fY2xhc3NfdHlwZV9pbmZvOjpzZWFyY2hfYmVsb3dfZHN0KF9fY3h4YWJpdjE6Ol9fZHluYW1pY19jYXN0X2luZm8qLCB2b2lkIGNvbnN0KiwgaW50LCBib29sKSBjb25zdIMFgAFfX2N4eGFiaXYxOjpfX3ZtaV9jbGFzc190eXBlX2luZm86OnNlYXJjaF9hYm92ZV9kc3QoX19jeHhhYml2MTo6X19keW5hbWljX2Nhc3RfaW5mbyosIHZvaWQgY29uc3QqLCB2b2lkIGNvbnN0KiwgaW50LCBib29sKSBjb25zdIQFf19fY3h4YWJpdjE6Ol9fc2lfY2xhc3NfdHlwZV9pbmZvOjpzZWFyY2hfYWJvdmVfZHN0KF9fY3h4YWJpdjE6Ol9fZHluYW1pY19jYXN0X2luZm8qLCB2b2lkIGNvbnN0Kiwgdm9pZCBjb25zdCosIGludCwgYm9vbCkgY29uc3SFBXxfX2N4eGFiaXYxOjpfX2NsYXNzX3R5cGVfaW5mbzo6c2VhcmNoX2Fib3ZlX2RzdChfX2N4eGFiaXYxOjpfX2R5bmFtaWNfY2FzdF9pbmZvKiwgdm9pZCBjb25zdCosIHZvaWQgY29uc3QqLCBpbnQsIGJvb2wpIGNvbnN0hgUIX19zdHJkdXCHBQ1fX2dldFR5cGVOYW1liAUqX19lbWJpbmRfcmVnaXN0ZXJfbmF0aXZlX2FuZF9idWlsdGluX3R5cGVziQU/dm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX2ludGVnZXI8Y2hhcj4oY2hhciBjb25zdCopigVGdm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX2ludGVnZXI8c2lnbmVkIGNoYXI+KGNoYXIgY29uc3QqKYsFSHZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9pbnRlZ2VyPHVuc2lnbmVkIGNoYXI+KGNoYXIgY29uc3QqKYwFQHZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9pbnRlZ2VyPHNob3J0PihjaGFyIGNvbnN0KimNBUl2b2lkIChhbm9ueW1vdXMgbmFtZXNwYWNlKTo6cmVnaXN0ZXJfaW50ZWdlcjx1bnNpZ25lZCBzaG9ydD4oY2hhciBjb25zdCopjgU+dm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX2ludGVnZXI8aW50PihjaGFyIGNvbnN0KimPBUd2b2lkIChhbm9ueW1vdXMgbmFtZXNwYWNlKTo6cmVnaXN0ZXJfaW50ZWdlcjx1bnNpZ25lZCBpbnQ+KGNoYXIgY29uc3QqKZAFP3ZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9pbnRlZ2VyPGxvbmc+KGNoYXIgY29uc3QqKZEFSHZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9pbnRlZ2VyPHVuc2lnbmVkIGxvbmc+KGNoYXIgY29uc3QqKZIFPnZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9mbG9hdDxmbG9hdD4oY2hhciBjb25zdCopkwU/dm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX2Zsb2F0PGRvdWJsZT4oY2hhciBjb25zdCoplAVDdm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX21lbW9yeV92aWV3PGNoYXI+KGNoYXIgY29uc3QqKZUFSnZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9tZW1vcnlfdmlldzxzaWduZWQgY2hhcj4oY2hhciBjb25zdCoplgVMdm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX21lbW9yeV92aWV3PHVuc2lnbmVkIGNoYXI+KGNoYXIgY29uc3QqKZcFRHZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9tZW1vcnlfdmlldzxzaG9ydD4oY2hhciBjb25zdCopmAVNdm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX21lbW9yeV92aWV3PHVuc2lnbmVkIHNob3J0PihjaGFyIGNvbnN0KimZBUJ2b2lkIChhbm9ueW1vdXMgbmFtZXNwYWNlKTo6cmVnaXN0ZXJfbWVtb3J5X3ZpZXc8aW50PihjaGFyIGNvbnN0KimaBUt2b2lkIChhbm9ueW1vdXMgbmFtZXNwYWNlKTo6cmVnaXN0ZXJfbWVtb3J5X3ZpZXc8dW5zaWduZWQgaW50PihjaGFyIGNvbnN0KimbBUN2b2lkIChhbm9ueW1vdXMgbmFtZXNwYWNlKTo6cmVnaXN0ZXJfbWVtb3J5X3ZpZXc8bG9uZz4oY2hhciBjb25zdCopnAVMdm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX21lbW9yeV92aWV3PHVuc2lnbmVkIGxvbmc+KGNoYXIgY29uc3QqKZ0FRHZvaWQgKGFub255bW91cyBuYW1lc3BhY2UpOjpyZWdpc3Rlcl9tZW1vcnlfdmlldzxmbG9hdD4oY2hhciBjb25zdCopngVFdm9pZCAoYW5vbnltb3VzIG5hbWVzcGFjZSk6OnJlZ2lzdGVyX21lbW9yeV92aWV3PGRvdWJsZT4oY2hhciBjb25zdCopnwVuRW1zY3JpcHRlbkJpbmRpbmdJbml0aWFsaXplcl9uYXRpdmVfYW5kX2J1aWx0aW5fdHlwZXM6OkVtc2NyaXB0ZW5CaW5kaW5nSW5pdGlhbGl6ZXJfbmF0aXZlX2FuZF9idWlsdGluX3R5cGVzKCmgBQhkbG1hbGxvY6EFBmRsZnJlZaIFCWRscmVhbGxvY6MFEXRyeV9yZWFsbG9jX2NodW5rpAUNZGlzcG9zZV9jaHVua6UFBHNicmumBQVmbW9kbKcFBnNjYWxibqgFDV9fZnBjbGFzc2lmeWypBQZtZW1jcHmqBQZtZW1zZXSrBQdtZW1tb3ZlrAUIc2V0VGhyZXetBQlzdGFja1NhdmWuBQpzdGFja0FsbG9jrwUMc3RhY2tSZXN0b3JlsAUQX19ncm93V2FzbU1lbW9yebEFCmR5bkNhbGxfaWmyBQpkeW5DYWxsX3ZpswULZHluQ2FsbF9paWm0BQ1keW5DYWxsX3ZpaWlptQUOZHluQ2FsbF92aWlpaWm2BQtkeW5DYWxsX3ZpabcFDGR5bkNhbGxfaWlpabgFD2R5bkNhbGxfaWlkaWlpabkFDWR5bkNhbGxfaWlpaWm6BQ5keW5DYWxsX2lpaWlpabsFEWR5bkNhbGxfaWlpaWlpaWlpvAUPZHluQ2FsbF9paWlpaWlpvQUOZHluQ2FsbF9paWlpaWS+BRBkeW5DYWxsX2lpaWlpaWlpvwUPZHluQ2FsbF92aWlpaWlpwAUJZHluQ2FsbF92wQUYbGVnYWxzdHViJGR5bkNhbGxfdmlpamlpwgUWbGVnYWxzdHViJGR5bkNhbGxfamlqacMFGGxlZ2Fsc3R1YiRkeW5DYWxsX2lpaWlpasQFGWxlZ2Fsc3R1YiRkeW5DYWxsX2lpaWlpamrFBRpsZWdhbHN0dWIkZHluQ2FsbF9paWlpaWlqagCAYQsuZGVidWdfaW5mb3AwAAAEAAAAAAAEAQAAAAAaAJUAAAAAAAAA1AAAAAAAAAAoAQAAAgMBAAA1AAAAAUySAQAAAwVPAQAAAQFMBE8BAAABTAVMAAAAAAAGNQAAAAfjAQAAB+4BAAAICfcBAAAOBgAAAqQBBQOQBAAAAAgJ9wEAAC4GAAACpAEFA5MEAAAACAn3AQAADgYAAAKkAQUDlQQAAAADBfsCAAABA9YKGgIAAI8CAAAD1zsGAAALxAAAAPMCAAAADEUGAACTAgAAAykNmgIAAAgJ9wEAAGsGAAACpAEFA6AEAAAAAwVyBAAAAQPWCoEDAACPAgAAA9c7BgAAC/8AAADzAgAAAA34AwAACAn3AQAAmAYAAAKkAQUDxAQAAAAOBeMFAAABAlkED7cFAACPAgAAAl4EuQAAAAAMLwcAAEMGAAACIg4FegYAAAECswQQUwYAADAHAAACtAQAEV4GAAASAwYAAAAADgWcEQAAAQLGBAuYKQAAmhEAABPhEQAARRIAAALJBAuvBgAArQUAABReBgAAFZgpAAAAAAMFdhIAAAED4BFeBgAAEgMGAAAAAwWsEwAAAQPnFqMSAAAcEwAAA+gFBwAABfspAAAAFiUTAACeEwAAA+w7BgAABfspAAAAEacTAAAShykAABKoKQAAAAADBcMYAAABA+cWcxcAABwTAAAD6AUHAAAFDSsAAAAWBxgAAJ4TAAAD7DsGAAAFDSsAAAARpxMAABcSqAIAABIcBwAAEhwHAAASBQcAAAAAAA3hEwAAGJAVAADdFQAAAkwCkyoAAAELdCoAAJoRAAAZNBYAAAJMApgqAAAADgU2FgAAAQIABQt0KgAAmhEAABOZFgAAFBcAAAIDBQuvBgAAlhYAABFeBgAAEgMGAAAAFaoGAAAVdCoAAAAADZsYAAAaFAAAAAgAAADsJgAAMycAAAJvBLkAAAAZxSgAAAJvBIcpAAALrwYAAJoRAAAAGx0AAAASAAAAVycAAJ0nAAAC4wEZxSgAAALjAYcpAAALrwYAAK0FAAAAGmoAAAAkAAAAwicAAA4oAAAC0AGHKQAAGXESAAAC0AGoKQAAHJcuAAB8AAAADwAAAALRARgdpS4AAB2uLgAAAAuvBgAArQUAABGnEwAAEgUHAAAAAA4FpSQAAAECSwEeMCIAAGoSAAACTAG0AwAAFZgpAAAVAQQAAAALhykAAJokAAARpxMAABKoKQAAAAAOBUMjAAABA04BHoAiAADQIgAAA1ABtAMAABWHKQAAAB+HKQAA2yIAAANPAR7kIgAANiMAAANTAYcpAAAVtAMAAAALhykAAJoRAAAXAA4FdyQAAAEDQwEebSMAANAiAAADRQEBBAAAFbouAAAAH04EAADbIgAAA0QBHjwkAAA2IwAAA0gBBQcAABUBBAAAAAuoKQAAmhEAABcADgUcJAAAAQMNAR6oIwAA0CIAAAMNAU4EAAAVui4AAAAfBQcAANsiAAADDQEe4iMAADYjAAADDQEFBwAAFU4EAAAACwUHAACaEQAAFwAOBeYlAAABAhgCE9YkAABqEgAAAhkCFZgqAAAVtAMAABX4BAAAFfgEAAAVTgQAAAALdCoAAM8lAAAgmiQAAAuHKQAA3SUAABGnEwAAEhwHAAASHAcAABIFBwAAAAAOBa4lAAABAw8BHjolAADQIgAAAw8B+AQAABXqLgAAAB8cBwAA2yIAAAMPAR50JQAANiMAAAMPARwHAAAV+AQAAAALHAcAAJoRAAAXAAAhBf0FAAABAmwFIhMFAAACcQUBBaUGAAAAIxMFAAACcwUBBaUGAAAVqgYAAAALrwYAAK0FAAALGAEAAO8FAAAkBxQAAJIUAAACswUFKgAAAQs9AgAA9BMAAAuYKQAA/hMAABReBgAABQ8qAAAVmCkAAAAkDRUAAHYVAAACrAUFKgAAARH9FAAAEgUHAAAAFF4GAAAFDyoAAAAkQBkAAOMZAAACAwYFKgAAAQs9AgAA9BMAAAt0KgAA/hMAABFeBgAAEgMGAAAABQ8qAAAVqgYAABV0KgAAFQMGAAAAACUFZwYAAAECCgEAJhsGAAAnJwYAAAADACggBgAAKQECAAAGASoGAgAACAcmGwYAACcnBgAAAAIABkAGAAAouQAAAAZKBgAAKwgsewMAAF4GAAAD2AUDmAQAAAAmQAYAACcnBgAAAAIAJhsGAAAnJwYAAAAEAAgsewMAAIsGAAAD2AUDsAQAAAAmQAYAACcnBgAAAAUAJhsGAAAnJwYAAAAHAAYmBQAABhsGAAAtBU4FAAAIAR0uGgUAAAUHAAABSAAuOwUAAAUHAAABSQQvTgUAAAEfAQUMBwAAFQUHAAAAMGMFAACJBQAAASUBBQwHAAAVEQcAABURBwAAFQUHAAAAACkuBQAABwQGrwYAAAwcBwAAowUAAAR9KZEFAAAHBAYoBwAAKT0GAAAEBDEoNQcAAClZBgAAAgEHqAYAAAzQEwAAvgYAAAU5MsgGAAAzBzLcEwAAMwcz7hMAADMHOPkTAAAzCEXuEwAAMwhGBhQAADMIRysUAAAzCEhGFAAAMwhJaxQAADMISoYUAAAzCEucFAAAMwhMtxQAADMITdkUAAAzCE7vFAAAMwhPChUAADMIUCAVAAAzCFE7FQAAMwhSWhUAADMIU3QVAAAzCFSKFQAAMwhVpBUAADMIVr4VAAAzCFfUFQAAMwhZ7hUAADMIWwQWAAAzCFwfFgAAMwhdMBYAADMLmUEWAAAzC5pTFgAAMwubZRYAADMLnHAWAAAzC56CFgAAMwuflBYAADMLoKYWAAAzC6GxFgAAMwujwxYAADMLpM4WAAAzC6XZFgAAMwum5BYAADMLqO8WAAAzC6n6FgAAMwuqBRcAADMLqxAXAAAzC60bFwAAMwuuJhcAADMLrzEXAAAzC7A8FwAAMwuyRxcAADMLs1IXAAAzC7RdFwAAMwu1aBcAADMLt3MXAAAzC7gRBwAAMwu6fhcAADMLu4kXAAAzDmTuEwAAMw5llBcAADMOZqAXAAAzDmjJFwAAMw5q8hcAADMOawoYAAAzDmwbGAAAMw5uLBgAADMOcD0YAAAzDnFdGAAAMw5ycxgAADMOc5AYAAAzDnWrGAAAMw53xhgAADMOeeEYAAAzDnv8GAAAMw58BxkAADMOfRQZAAAzDn4qGQAAMw5/NxkAADMOgEgZAAAzDoFeGQAAMw6CZRkAADMOg3wZAAAzDoSJGQAAMw6GlhkAADMOh6cZAAAzDom4GQAAMw6K8hkAADMOiw4aAAAzDowjGgAAMw6ONBoAADMOkEUaAAAzDpFfGgAAMw6TdRoAADMOlYsaAAAzDpahGgAAMw6XzRoAADMOmOMaAAAzDpn+GgAAMxFsKBsAADMRbTkbAAAzEW7uEwAAMxFwSRsAADMRcV8bAAAzEXJwGwAAMxFzhxsAADMRdKcbAAAzEXW+GwAAMxF21RsAADMRd/EbAAAzEXgIHAAAMxF5HxwAADMRek4cAAAzEXtpHAAAMxF8hBwAADMRfaQcAAAzEX6/HAAAMxF/0BwAADMRgOscAAAzEYEBHQAAMxGCFx0AADMRgygdAAAzEYQ+HQAAMxGFVB0AADMRhnQdAAAzEYeUHQAAMxGItB0AADMRic8dAAAzEYrvHQAAMxGLAB4AADMRjA0eAAAzEY0aHgAAMxGOKx4AADMRjzweAAAzEZJJHgAAMxGTXx4AADMRlHoeAAAzEZWLHgAAMxGWoR4AADMRl6weAAAzEZu9HgAAMxGdyB4AADMRn9keAAAzEaDrHgAAMxGkAR8AADMRpRMfAAAzEaYkHwAAMxGnNR8AADMUaEsfAAAzFGlcHwAAMxRqbR8AADMUa34fAAAzFGyPHwAAMxRtoB8AADMUbrEfAAAzFG/CHwAAMxRw0x8AADMUceQfAAAzFHL1HwAAMxRzBiAAADMUdBcgAAAzFHUoIAAAMxU/OSAAADMVQEQgAAAzFUFZIAAAMxVCZSAAADMVQ3YgAAAzFUSHIAAAMxVFmCAAADMVRqkgAAAzFUe6IAAAMxVIyyAAADMVSdwgAAAzFUrtIAAAMxVL/iAAADMVTA8hAAAzFU0gIQAAMxVOMSEAADMVT0chAAAzFVBYIQAAMxVRaSEAADMVUnohAAAzFVOQIQAAMxd0oSEAADMXde4TAAAzF3bSIQAAMxd3OSAAADMXeCgbAAAzF3lgIgAAMxd6dyIAADMXe44iAAAzF3yqIgAAMxd9xSIAADMXfuUiAAAzF3/8IgAAMxeAFyMAADMXgTIjAAAzF4JDIwAAMxeDXiMAADMXhHQjAAAzF4WKIwAAMxeGoCMAADMXh7EjAAAzF4jHIwAAMxeJ3SMAADMXiv0jAAAzF4sTJAAAMxeMKSQAADMXjkQkAAAzF5BfJAAAMxeSeiQAADMXlJUkAAAzF5WrJAAAMxeWxiQAADMXl9wkAAAzF5j3JAAAMxeZDSUAADMXmiMlAAAzF5s+JQAAMxecWSUAADMXnXMlAAAzF56NJQAAMxefpyUAADMXoMElAAAzF6HgJQAAMxei9iUAADMXowcmAAAzF6QdJgAAMxelOCYAADMXplMmAAAzF6duJgAAMxeoiSYAADMXqaQmAAAzF6rTJgAAMxer5CYAADMXrPUmAAAzF60QJwAAMxeuNScAADMXr1UnAAAzF7BwJwAAMxexmicAADMXtMQnAAAzF7XPJwAAMxe25ScAADMXuvcnAAAzF7sIKAAAMxe8HigAADMbOjAoAAAzGzvuEwAAMxs8PCgAADMbPdIhAAAzG0FHKAAAMxtCUigAADMbQ2goAAAzG0R+KAAAMxtGlCgAADMbR6UoAAAzG0jAKAAAMxtJ0SgAADMbS+IoAAAzHCwCKQAANIIaAAAksBoAAOQaAAAdjAJyDgAAAQVgLAAAFSAGAAAAHyAGAADqGgAAHUwCABiPHQAA1B0AAB7oA6osAAABCyAGAAD4GgAAC68OAACHHQAAGS8eAAAe6AOqLAAAAAMFdR0AAAEgyDX/GgAAJhsAACDRFZEsAAAVliwAAAAMIAYAAOoaAAAgyhYtGwAATRsAACDSNQcAABXODgAAFc4OAAAAFlAbAABwGwAAINQ1BwAAFc4OAAAVzg4AAAAWcxsAAJ0bAAAg2NIUAAAVoCwAABWgLAAAFe4TAAAAFqUbAADKGwAAINruEwAAFaAsAAAAFtEbAAD5GwAAINygLAAAFaAsAAAV7hMAABWWLAAAABb+GwAAJBwAACDdpSwAABWlLAAAFaAsAAAV7hMAAAAWKRwAAE8cAAAg36UsAAAVpSwAABWgLAAAFe4TAAAAFlQcAAAmGwAAIOSlLAAAFaUsAAAV7hMAABXODgAAABZ6HAAAnhwAACDn0g8AABXSDwAAAAzSFAAAphwAACDLFq8cAADZHAAAIOnODgAAFdIPAAAAFuYcAAAPHQAAIOvSDwAAFc4OAAAAFhsdAABFHQAAIO01BwAAFdIPAAAV0g8AAAAKUR0AAHEdAAAg79IPAAALIAYAAPgaAAAANP0dAAA2NB4AAHEeAAAew6osAAABBa8sAAAVtCwAAAAAN5QeAADJHgAAH+joLAAAAQuAEAAAjR4AADjrHgAAH+jyLAAAADSBHgAAJOMhAADkGgAAH4cCoRAAAAEFVi0AABUgBgAAAB8gBgAA6hoAAB9KAgAtBDkfAAAEH2k57x4AAPwsAAAfcwEADNIUAAD0HgAAH3A5/R4AAPwsAAAfdAEIOQUfAAD8LAAAH3UBATkLHwAA/CwAAB92ARA5FB8AAPwsAAAfdwECOeIQAAD8LAAAH3gBBDkcHwAA/CwAAB95ASA5JR8AAPwsAAAfegE/LikfAAABLQAAH54AOjMfAAAvOR8AAB99AQUGLQAAAC85HwAAH34BBQYtAAAV8iwAAAA7OR8AAB9/AQUGLQAAFaoGAAAAOzkfAAAfgAEFBi0AABULLQAAAC85HwAAH4EBBQYtAAAV8iwAABWqBgAAFcQQAAAALzkfAAAfggEFBi0AABXyLAAAFQstAAAVxBAAAAAvOR8AAB+FAQUGLQAAFfIsAAAV8iwAABXEEAAAAC+THwAAH4cBBQYtAAAANpsfAAC0HwAAH4nyLAAAAQUGLQAAFfIsAAAANr4fAABrEQAAH5BnEwAAAQUVLQAAADbXHwAA8R8AAB+RNQcAAAEFFS0AABXyLAAAADb8HwAAFiAAAB+SNQcAAAEFFS0AABXyLAAAADYhIAAAPyAAAB+ZrhAAAAEV8iwAAAA8RiAAAGEgAAAfmvIsAAABNWkgAACdIAAAH6AFBi0AABXyLAAAFRotAAAV5xMAAAA6rCAAAAqyIAAAziAAAB+hHy0AABbXIAAA/SAAAB+iNQcAAAUVLQAAFSQtAAAALQROIQAACB+5LgchAAB3EwAAH7sALj4hAABlFgAAH7wEPUQhAABlFgAAH74vTiEAAB/AAQU9LQAAADVRIQAAbiEAAB/CBT0tAAAANXUhAAC0HwAAH8MFPS0AABVCLQAAAAROIQAAH8QFPS0AABVCLQAAADaRIQAArSEAAB/G5xMAAAEFPS0AAAAAFrMhAADZIQAAH6NMLQAABRUtAAAVJC0AAAAADHITAACMHwAAIdM6QB8AAA4EGCEAAAQiPQI+DyEAABwHAAAiRwIAAz8YIQAAIkECBSktAAAAIhghAAAiRAIDBSktAAAVLi0AAAAkIiEAALQfAAAiRQI4LQAAAwUpLQAAFS4tAAAAAAAAQKwGAAAzBjRBBwAADOcTAADVBgAABIIpzAYAAAUEDBwHAADfBgAABHgfBRQAAOYGAAAEGwFBQvIGAAAJGS8HAAAVIRQAABUmFAAAFe4TAAAAQy8HAABDRQYAAEL5BgAACRovBwAAFS8HAAAVRQYAABXuEwAAAEIBBwAACR9cFAAAFWEUAAAVZhQAAAAGIAYAAENcFAAAQ6oGAABCCAcAAAkgXBQAABVhFAAAFWYUAAAV7hMAAABCEAcAAAkiXBQAABVhFAAAFWYUAAAAQhcHAAAJI1wUAAAVYRQAABVmFAAAFe4TAAAAQh8HAAAJHNIUAAAVRQYAABVFBgAAFe4TAAAAKSYHAAAFBEIqBwAACSXSFAAAFaoGAAAVqgYAAABCMQcAAAkm0hQAABWqBgAAFaoGAAAV7hMAAABCOQcAAAko0hQAABWqBgAAFaoGAAAAQkEHAAAJKe4TAAAVYRQAABVmFAAAFe4TAAAAFkkHAABrBwAACmMvBwAAFS8HAAAV0hQAABXuEwAAABZyBwAAkwcAAApOXBQAABVcFAAAFdIUAAAAQpoHAAAJLu4TAAAVqgYAABWqBgAAABaiBwAAxgcAAApVXBQAABVcFAAAFaoGAAAAFs4HAADwBwAAClxcFAAAFVwUAAAV0hQAAABC+AcAAAkv7hMAABWqBgAAFaoGAAAAFv8HAAAiCAAACmpcFAAAFVwUAAAVqgYAAABCKQgAAAkyXBQAABVhFAAAFWYUAAAAQjAIAAAJGy8HAAAVLwcAABXSFAAAFe4TAAAAQjcIAAAJNlwUAAAV0hQAAABCQAgAAAk07hMAABWqBgAAAAxMFgAAUwgAAAScKUcIAAAGAQxeFgAAYAgAAAShKVoIAAAFAgzSFAAAaAgAAASmDHsWAAB+CAAABKspcAgAAAUIDI0WAACUCAAABLUphggAAAgBDJ8WAACrCAAABLopnAgAAAcCDAUHAAC0CAAABL8MvBYAANQIAAAExCm9CAAABwgMQRYAAN0IAAAMGQxTFgAA6ggAAAwaDGUWAAD4CAAADBsMcBYAAAYJAAAMHAyCFgAAFAkAAAwhDJQWAAAiCQAADCIMphYAADEJAAAMIwyxFgAAQAkAAAwkDEEWAABPCQAADBYMZRYAAFsJAAANAQxlFgAAaAkAAA0CDHAWAAB1CQAADBcMghYAAIIJAAAMHgymFgAAjwkAAA0DDKYWAACdCQAADQQMsRYAAKsJAAAMHwznEwAAuQkAAASMDHsWAADCCQAABLAMvBYAAMsJAAAEzgyfFwAA1QkAAA8+QQyrFwAA5AkAAA8/RAUIDz8u2wkAAOcTAAAPPwAu4AkAAOcTAAAPPwQADNQXAADrCQAAD0BEBRAPQC7bCQAAexYAAA9AAC7gCQAAexYAAA9ACABC8wkAAA8YAxgAABWqBgAAACn4CQAABAhC/wkAAA8V0hQAABWqBgAAAEIECgAADxbnEwAAFaoGAAAAQgkKAAAPF3sWAAAVqgYAAABCDwoAAA8bAxgAABVmFAAAFVMYAAAAQ1gYAAAGXBQAAEIWCgAADxooBwAAFWYUAAAVUxgAAABCHQoAAA8ciRgAABVmFAAAFVMYAAAAKSUKAAAEEEIxCgAADx7nEwAAFWYUAAAVUxgAABXSFAAAAEI4CgAADyB7FgAAFWYUAAAVUxgAABXSFAAAAEJACgAADx8cBwAAFWYUAAAVUxgAABXSFAAAAEJICgAADyG8FgAAFWYUAAAVUxgAABXSFAAAAEVRCgAADyPSFAAABFYKAAAPJBUFBwAAAEJcCgAADycvBwAAFe4TAAAV7hMAAAAEYwoAAA8pFS8HAAAAQmgKAAAPJi8HAAAV7hMAAABCbwoAAA8oLwcAABUvBwAAFe4TAAAARncKAAAPLEJ9CgAADy3SFAAAFXYZAAAABnsZAABHSIQKAAAPLhXSFAAAAEiJCgAADy8V0hQAAABCjwoAAA8zXBQAABWqBgAAAEKWCgAADzXSFAAAFaoGAAAAQp0KAAAPNy8HAAAVRQYAABVFBgAAFe4TAAAV7hMAABXdGQAAAAbiGQAASdIUAAAVRQYAABVFBgAAAASlCgAADzgVLwcAABXuEwAAFe4TAAAV3RkAAAAWqwoAALMKAAAQcXsWAAAVexYAAABCtwoAAA875xMAABXnEwAAAEK8CgAADzx7FgAAFXsWAAAAFsIKAADLCgAAEHbJFwAAFXsWAAAVexYAAABCzwoAAA9DoBcAABXnEwAAFecTAAAAQtQKAAAPRMkXAAAVexYAABV7FgAAAELaCgAAD0bSFAAAFaoGAAAV7hMAAABC4AoAAA9H0hQAABW8GgAAFWYUAAAV7hMAAABDwRoAAAbGGgAAKecKAAAFBELvCgAAD0jSFAAAFVwUAAAVxhoAAABC9goAAA9J7hMAABW8GgAAFWYUAAAV7hMAAABC/woAAA9K7hMAABVhFAAAFRkbAAAV7hMAAABDHhsAAAYjGwAAKMYaAAAfNBsAABELAAAEewENCAsAAAxEGwAAIgsAABI/ShYLAABCKQsAABJL0hQAABVaGwAAAAYoGwAAQjALAAASUtIUAAAVWhsAAAAENwsAABKEFYIbAAAVYRQAAABDWhsAAEI+CwAAEoPSFAAAFYIbAAAVYRQAABXSFAAAFe4TAAAAQkYLAAAScdIUAAAVghsAABVmFAAASwBCTgsAABJ70hQAABWCGwAAFWYUAABLAEJVCwAAEnPSFAAAFWEUAAAV7hMAABVmFAAASwBCXgsAABJy0hQAABVhFAAAFWYUAABLAEJmCwAAEnzSFAAAFWYUAAAVZhQAAEsAQm0LAAASdtIUAAAVghsAABVmFAAAFTocAAAADEUcAACICwAABAxMLwcAAHYLAABClwsAABJ+0hQAABWCGwAAFWYUAAAVOhwAAABCnwsAABJ/0hQAABVmFAAAFWYUAAAVOhwAAABCpwsAABJ40hQAABVhFAAAFe4TAAAVZhQAABU6HAAAAEKxCwAAEnfSFAAAFWEUAAAVZhQAABU6HAAAAEK6CwAAEl/SFAAAFVobAAAAQsALAAASaFwUAAAVYRQAABXSFAAAFYIbAAAAQsYLAAASZNIUAAAV0hQAABVaGwAAAELMCwAAEm3SFAAAFWYUAAAVghsAAABC0gsAABJg0hQAABVaGwAAAELXCwAAEmXSFAAAFdIUAAAVWhsAAABC3AsAABJi0hQAABXSFAAAFVobAAAAQuMLAAASXO4TAAAVIRQAABXuEwAAFe4TAAAVghsAAABC6QsAABJd7hMAABUmFAAAFe4TAAAV7hMAABWCGwAAAELwCwAAElnSFAAAFYIbAAAVqh0AAABDrx0AAAY5GwAAQvgLAAASVdIUAAAVWhsAABXnEwAAFdIUAAAAQv4LAAASWtIUAAAVWhsAABXlHQAAAAbqHQAAKDkbAABCBgwAABJW5xMAABVaGwAAAAQMDAAAElcVWhsAAAAEEwwAABJTFVobAAAAQhwMAAASUNIUAAAVWhsAAABCIQwAABJR0hQAABVaGwAAAAQoDAAAEoEVqgYAAABCLwwAABJJWhsAABVmFAAAFWYUAAAAQjUMAAASSlobAAAVZhQAABVmFAAAFYIbAAAAQj0MAAASTdIUAAAVqgYAAABCRAwAABJO0hQAABWqBgAAFaoGAAAARUsMAAASh1obAABCUwwAABKGXBQAABVcFAAAAEVaDAAAEmHSFAAAQmIMAAASalwUAAAVXBQAAABCZwwAABJ60hQAABVmFAAASwBCbQwAABJ90hQAABVmFAAAFTocAAAAQnQMAAAScNIUAAAVZhQAAEsAQnsMAAASZtIUAAAV0hQAAABCgwwAABJu0hQAABWqBgAAAEKIDAAAEnXSFAAAFWYUAAAVOhwAAABCkAwAABMK0hQAABXSFAAAAEKYDAAAEwvSFAAAFdIUAAAAQqAMAAATDNIUAAAV0hQAAABCqAwAABMN0hQAABXSFAAAAEKwDAAAEw7SFAAAFdIUAAAAQrgMAAATD9IUAAAV0hQAAABCwAwAABMQ0hQAABXSFAAAAELIDAAAExHSFAAAFdIUAAAAQtAMAAATEtIUAAAV0hQAAABC2AwAABMT0hQAABXSFAAAAELgDAAAExTSFAAAFdIUAAAAQugMAAATFdIUAAAV0hQAAABC8QwAABMW0hQAABXSFAAAAEL5DAAAExfSFAAAFdIUAAAADAUHAAABDQAABC0MTyAAAAgNAAAWFAZUIAAAKNIUAAAfHAcAABINAAAEBgFCGw0AABYb0hQAABU5IAAAAEIkDQAAFhzSFAAAFTkgAAAAQi0NAAAWHdIUAAAVOSAAAABCNg0AABYe0hQAABU5IAAAAEI/DQAAFh/SFAAAFTkgAAAAQkgNAAAWINIUAAAVOSAAAABCUQ0AABYh0hQAABU5IAAAAEJaDQAAFiLSFAAAFTkgAAAAQmMNAAAWI9IUAAAVOSAAAABCbA0AABYk0hQAABU5IAAAAEJ1DQAAFiXSFAAAFTkgAAAAQn4NAAAWJtIUAAAVOSAAAABCiA0AABYn0hQAABU5IAAAFVkgAAAAQpENAAAWLFkgAAAVqgYAAABCmA0AABYpOSAAABU5IAAAAEKhDQAAFio5IAAAFTkgAAAAQqoNAAAWKDkgAAAVOSAAABVEIAAAAEK0DQAAFitEIAAAFaoGAAAAH60hAADcDQAABIEBDgXQDQAACASBAU28DQAABQcAAASBAQBNxg0AAAUHAAAEgQEEAAMFPg4AACwYJi7mDQAA0hQAABgnAC7tDQAA0hQAABgoBC70DQAA0hQAABgpCC78DQAA0hQAABgqDC4EDgAA0hQAABgrEC4LDgAA0hQAABgsFC4TDgAA0hQAABgtGC4bDgAA0hQAABguHC4jDgAA0hQAABgvIC4sDgAA5xMAABgwJC42DgAAqgYAABgxKABCQQ4AABlq0hQAABWCGwAAFRkbAABLAEJKDgAAGXLSFAAAFYIbAAAVGRsAAEsAQlIOAAAZa9IUAAAVvBoAABXuEwAAFRkbAABLAEJbDgAAGW7SFAAAFYIbAAAVGRsAABU6HAAAAEJlDgAAGW/SFAAAFbwaAAAV7hMAABUZGwAAFTocAAAAQm8OAAAZc9IUAAAVGRsAABUZGwAASwBCdw4AABl20hQAABWCGwAAFRkbAAAVOhwAAABCgA4AABl30hQAABUZGwAAFRkbAAAVOhwAAABCiQ4AABl5OSAAABVaGwAAAEKQDgAAGYHBGgAAFbwaAAAV0hQAABWCGwAAAEKXDgAAGX05IAAAFcYaAAAVWhsAAABCng4AABmC0hQAABUZGwAAFYIbAAAAQqUOAAAZZtIUAAAVWhsAABXSFAAAAEKrDgAAGXo5IAAAFVobAAAAQrEOAAAZfjkgAAAVxhoAABVaGwAAAEK3DgAAGYQ5IAAAFTkgAAAVWhsAAABCvw4AABlbAxgAABUZGwAAFfMjAAAAQ/gjAAAGwRoAAELGDgAAGVooBwAAFRkbAAAV8yMAAABCzQ4AABlciRgAABUZGwAAFfMjAAAAQtUOAAAZXucTAAAVGRsAABXzIwAAFdIUAAAAQtwOAAAZYXsWAAAVGRsAABXzIwAAFdIUAAAAQuQOAAAZXxwHAAAVGRsAABXzIwAAFdIUAAAAQuwOAAAZYrwWAAAVGRsAABXzIwAAFdIUAAAAQvUOAAAZLsEaAAAVvBoAABUZGwAAAEL8DgAAGS/BGgAAFbwaAAAVGRsAABXuEwAAAEIEDwAAGTHBGgAAFbwaAAAVGRsAAABCCw8AABkywRoAABW8GgAAFRkbAAAV7hMAAABCEw8AABk00hQAABUeGwAAFR4bAAAAQhoPAAAZN9IUAAAVHhsAABUeGwAAAEIiDwAAGTXSFAAAFR4bAAAVHhsAABXuEwAAAEIqDwAAGTjuEwAAFbwaAAAVGRsAABXuEwAAABYyDwAAUw8AABqNwRoAABXBGgAAFcYaAAAAFloPAAB+DwAAGpTBGgAAFcEaAAAVHhsAAAAWhg8AAKgPAAAam8EaAAAVwRoAABXGGgAAABawDwAA0w8AABqiwRoAABXBGgAAFR4bAAAAFtoPAAD9DwAAGqnBGgAAFcEaAAAVxhoAABXuEwAAAEIFEAAAGT3uEwAAFR4bAAAVHhsAAABCDRAAABlD7hMAABUeGwAAAEIUEAAAGT7uEwAAFR4bAAAVHhsAAABCGxAAABlBwRoAABW8GgAAFRkbAAAV8yMAAABCIhAAABlJ0hQAABUeGwAAFR4bAAAV7hMAAABCKhAAABlKwRoAABW8GgAAFRkbAAAV7hMAAABCMhAAABlLwRoAABXBGgAAFR4bAAAV7hMAAABCOxAAABlMwRoAABXBGgAAFcYaAAAV7hMAAABCQxAAABmH7hMAABW8GgAAFe4TAAAVGRsAABXEJgAAAEPJJgAABs4mAAAo0iEAAEJMEAAAGU45IAAAFdIUAAAAQlIQAAAZT9IUAAAVOSAAAABCWBAAABlR0hQAABUGJwAAAAYLJwAAKKEhAABCYBAAABlV7hMAABVmFAAAFe4TAAAVKycAAABDMCcAAAahIQAAQmcQAAAZUu4TAAAVvBoAABVmFAAAFe4TAAAVKycAAABCbxAAABlT7hMAABVhFAAAFcYaAAAVKycAAABCdxAAABlX7hMAABW8GgAAFZAnAAAV7hMAABUrJwAAAEOVJwAABqoGAABCgRAAABlY7hMAABVhFAAAFbonAAAV7hMAABUrJwAAAEO/JwAABh4bAABFixAAABl7OSAAAEKUEAAAGXXSFAAAFRkbAAAVOhwAAABCnBAAABlx0hQAABUZGwAASwBCoxAAABl/OSAAABXGGgAAAEKsEAAAGW3SFAAAFRkbAAAVOhwAAABCtRAAABlp0hQAABUZGwAASwAf5xMAAL0QAAAEFgEM5xMAAMUQAAAES0XMEAAAGDQwKAAAQtIQAAAYNgMYAAAVPCgAABU8KAAAAELbEAAAGDc8KAAAFXkoAAAABtIhAABC4hAAABg1PCgAABWPKAAAAAY8KAAAQucQAAAYO1wUAAAVySYAAABC7xAAABg8XBQAABW2KAAAAAa7KAAAKDwoAABC9RAAABg5eSgAABW2KAAAAEL8EAAAGDp5KAAAFbYoAAAAQgYRAAAYOO4TAAAVYRQAABXuEwAAFWYUAAAVxCYAAAAMRRwAAA8RAAAEB04BFVEAAABPFxEAAD8FAAABIikAAFBmEQAAcikAABlrEQAAAnMFqgYAAFFScBEAAAJ5BXYZAABSdxEAAAJ6BXYZAABSgBEAAAJ4BXcpAABSjxEAAAJ7BYwpAABTAnQFVgAAAAAABiYFAAAGfCkAAElFBgAAFYcpAAAABq8GAAAGkSkAAFQVhykAAAAGnSkAAEmHKQAAFagpAAAAVQUHAABWdAEAAAELrwYAAK0FAAAUXgYAABliEgAAAskEmCkAAFJqEgAAAssE5ikAAFJxEgAAAsoEqQEAAAAG6ykAAEmHKQAAFZgpAAAVBQcAAAAGACoAACipAQAAVwoqAAAoJgUAAAYKKgAAWGUFAAABNSoAAAs9AgAA9BMAAAuYKQAA/hMAABReBgAAUGYRAABLKgAAGfQUAAACswWYKQAAAAYKKgAAWJgFAAABaioAABH9FAAAEgUHAAAAFF4GAABQZhEAAEsqAAAAWX0qAACvBgAAVAUMBwAAFRwHAAAVHAcAABUFBwAAAAZ0KgAAV50qAAAodCoAAFZ8AgAAAQuvBgAAlhYAABFeBgAAEgMGAAAAGVEXAAACAwWqBgAAGVwXAAACBAV0KgAAUmsXAAACBQXtKgAAUnESAAACBwXtAQAAAAbyKgAAVBWYKgAAFYcpAAAVHAcAABUcBwAAFQUHAAAABhIrAAAo7QEAAFi/BQAAAT4rAAALPQIAAPQTAAALdCoAAP4TAAARXgYAABIDBgAAAFBmEQAASyoAABlRFwAAAgMGqgYAABn0FAAAAgMGdCoAAFoCAwYDBgAAAFsAAAAAsgAAAHkrAAA+LwAAHUwvAABcFCkAAAAAAAABTQMdIikAAB0rKQAAXRgAAABeADgpAABeAEQpAABfUCkAAF9cKQAAUwJ0BVYAAAAAAGBQKgAAAAAAACAAAAABTggdaioAABwUKgAAAAAAACAAAAACrQUUHTUqAAAdPioAABytKQAAAAAAACAAAAACugUNHcEpAABfzSkAAAAAAFwXKwAAMAAAAAFPCB0+KwAAHUcrAABhAAAAAFMrAABioioAAEgAAAACCQYNHbwqAABhMAAAAMgqAABf1CoAABxCAgAAAAAAABIAAAACDwUVHVwCAAAAAAAABmUsAAAoUQ4AAGP1AlYOAAABdiwAAFBmEQAAjCwAABn0GgAAHYwCIAYAAAAGZSwAAFfODgAAV5ssAAAozg4AAAabLAAABs4OAABXOhAAAAY6EAAABrksAABJqiwAABWqLAAAAFg/EAAAAc4sAABQZhEAAOMsAAA4fB4AAB7DtCwAAAAGOhAAAFftLAAAKIAQAABX9ywAACiuEAAAKMQQAAAGNhEAAAauEAAAVxAtAAAoZxMAAAb3LAAABpQSAABXrhAAAFfCEgAABncTAABXMy0AACh3EwAAV3cTAAAGwhIAAFdHLQAAKMISAAAGUS0AACiUEgAABu0sAABYhRAAAAFlLQAAUGYRAAB7LQAAGfQaAAAfhwIgBgAAAAbtLAAAZJAAAADOAAAAkS0AAOMGAABQZhEAAIcpAAA4jSgAAAElEQcAADh0KAAAASURBwAAOGYoAAABJQUHAABlfygAAAEoIwcAAGWXKAAAAScjBwAAZmAAAACkKAAAATnSFAAAZ6QAAACuAAAAZn0AAACqKAAAAToFBwAAZ68AAACVAAAAZbIoAAABPCMHAABdqAAAAGW+KAAAAT4jBwAAXMQsAABgAAAAAT8fHc4sAABcfw4AAHgAAAAexA4dog4AAGJqLAAAkAAAAB7qAxMddiwAAGGZAAAAfywAABxbEAAA6wAAABUAAAAd9wIMHXQQAAAAHFstAAAAAQAAEQAAAB33AjMdZS0AAGG2AAAAbi0AAAAAAAAAAAAAT/8hAADQBgAAAaUuAABQZhEAAIcpAAA4HSIAAAEfBQcAAABXvy4AACgFBwAAaDAAAAA5AAAAZAMAABnJKAAAAk0BmCkAABlxEgAAAk4BAQQAAABX7y4AACgcBwAAaF8BAABDAAAAhQQAABnMKAAAAhoCmCoAABnTKAAAAhsCtAMAABlxEgAAAhwC+AQAABlxEgAAAhwC+AQAABlxEgAAAhwCTgQAAABPiiYAAD4AAAABTC8AAFBmEQAAVi8AAAAGNQAAAGnWJgAAAUwBaqQBAACwAAAAPygAAGtbLwAApAEAALAAAAAjAGA+LwAApAEAALAAAAABTAFcFCkAAMgAAAABTQMdIikAAB0rKQAAXeAAAABeADgpAABeAEQpAABfUCkAAF9cKQAAUwJ0BVYAAAAAAGBQKgAA9wEAACAAAAABTggdaioAABwUKgAA9wEAACAAAAACrQUUHTUqAAAdPioAABytKQAA9wEAACAAAAACugUNHcEpAABfzSkAAAAAAFwXKwAA+AAAAAFPCB0+KwAAHUcrAABh0wAAAFMrAABioioAABABAAACCQYNHbwqAABhAwEAAMgqAABf1CoAABxCAgAAFwIAABIAAAACDwUVHVwCAAAAAAAAAAAAABAOLmRlYnVnX21hY2luZm8AAL4CCi5kZWJ1Z19sb2P/////AAAAAHEAAACBAAAABgCTBDCfkwSBAAAAsgAAAAYAkwQwn5MEAAAAAAAAAAD/////AAAAAHEAAACBAAAABgCTBDCfkwSBAAAAsgAAAAYAkwQwn5MEAAAAAAAAAAD/////kAAAABQAAAAbAAAAAwARAJ8AAAAAAAAAAP////+QAAAAFAAAABsAAAACADCfAAAAAAAAAAD/////kAAAACEAAADAAAAAAwARCp8AAAAAAAAAAP////+QAAAAWwAAAMAAAAADABEKnwAAAAAAAAAA/////6QBAABxAAAAgQAAAAYAkwQwn5MEgQAAALAAAAAGAJMEMJ+TBAAAAAAAAAAA/////6QBAABxAAAAgQAAAAYAkwQwn5MEgQAAALAAAAAGAJMEMJ+TBAAAAAAAAAAAAP4CDS5kZWJ1Z19yYW5nZXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACvAAAAvAAAANcAAAAxAQAAAAAAAAAAAACvAAAAvAAAANcAAAAxAQAAAAAAAAAAAACvAAAAvAAAAOUAAAAdAQAAAAAAAAAAAACvAAAAvgAAAMkAAAAxAQAANgEAAEQBAAAAAAAAAAAAAKQBAAD3AQAAKQIAAC8CAAAAAAAAAAAAAKQBAAD3AQAAKQIAAC8CAAAAAAAAAAAAABcCAAApAgAALwIAAFQCAAAAAAAAAAAAABcCAAApAgAALwIAAFQCAAAAAAAAAAAAAAAAAAAAAAAAkAAAAF4BAAAUAAAAHAAAAB0AAAAvAAAAagAAAI4AAAAwAAAAaQAAAF8BAACiAQAApAEAAFQCAAAAAAAAAAAAAADVCg0uZGVidWdfYWJicmV2AREBJQ4TBQMOEBcbDhEBVRcAAAI0AAMOSRM6CzsLbg4AAAMTATYLAw4LCzoLOwsAAAQuAQMOOgs7CzwZPxkAAAUFAEkTNBkAAAYPAEkTAAAHOQEDDgAACC4BAAAJNAADDkkTPxk6CzsFAhgAAAouAG4OAw46CzsLSRM8GT8ZAAALLwBJEwMOAAAMFgBJEwMOOgs7CwAADRMAAw48GQAADhMBNgsDDgsLOgs7BQAADy4Abg4DDjoLOwVJEzwZPxkAABANAAMOSRM6CzsFPxk8GRwPAAARh4IBAQMOAAASLwBJEwAAEy4Bbg4DDjoLOwU8GT8ZAAAUh4IBAAMOAAAVBQBJEwAAFi4Bbg4DDjoLOwtJEzwZPxkAABcvAAAAGC4Bbg4DDjoLOwVJEz8ZIAsAABkFAAMOOgs7BUkTAAAaLgERARIGbg4DDjoLOwVJEz8ZAAAbLgERARIGbg4DDjoLOwU/GQAAHB0BMRMRARIGWAtZBVcLAAAdBQAxEwAAHi4Bbg4DDjoLOwVJEzwZPxkAAB8WAEkTAw46CzsFAAAgLwADDgAAIQIBNgsDDgsLOgs7BQAAIi4BAw46CzsFPBk/GTILAAAjLgEDDjoLOwU8GT8ZMgtjGQAAJC4Bbg4DDjoLOwVJEzwZPxkyCwAAJRMANgsDDgsLOgs7BQAAJgEBSRMAACchAEkTIgs3CwAAKCYASRMAACkkAAMOPgsLCwAAKiQAAw4LCz4LAAArJgAAACw0AAMOSRM/GToLOwsCGAAALQIBNgsDDgsLOgs7CwAALg0AAw5JEzoLOws4CwAALy4BAw46CzsLPBk/GTILAAAwLgFuDgMOOgs7CzwZPxkyCwAAMQ8AAAAyOQEDDokBGQAAMwgAOgs7CxgTAAA0AgEDDjwZAAA1LgFuDgMOOgs7CzwZPxkAADYuAW4OAw46CzsLSRM8GT8ZMgsAADcuAW4OAw46CzsLSRM/GSALAAA4BQADDjoLOwtJEwAAOQ0AAw5JEzoLOws/GTwZMgscDQAAOgIAAw48GQAAOy4BAw46CzsLPBk/GTILYxkAADwuAG4OAw46CzsLSRM8GT8ZMgsAAD0NAAMOSRM6CzsLPxk8GQAAPg0AAw5JEzoLOwU4CzILAAA/LgEDDjoLOwU8GT8ZAABAOwADDgAAQRMAPBkAAEIuAQMOOgs7C0kTPBk/GQAAQzcASRMAAEQTATYLCws6CzsLAABFLgADDjoLOwtJEzwZPxkAAEYuAAMOOgs7CzwZPxmHARkAAEcVAAAASC4BAw46CzsLPBk/GYcBGQAASRUBSRMAAEoXAAMOPBkAAEsYAAAATBYASRMDDgAATQ0AAw5JEzoLOwU4CwAATjoAOgs7CxgTAABPLgFuDkcTIAtkEwAAUAUAAw5JEzQZAABRCwEAAFI0AAMOOgs7BUkTAABTOgA6CzsFGBMAAFQVAQAAVUIASRMAAFYuAUcTIAsAAFcQAEkTAABYLgFHEyALZBMAAFkfAEkTHRMAAFoFADoLOwVJEwAAWy4BEQESBmQTMRMAAFwdATETVRdYC1kLVwsAAF0LAVUXAABeNAAcDzETAABfNAAxEwAAYB0BMRMRARIGWAtZC1cLAABhBQACFzETAABiHQExE1UXWAtZBVcLAABjLgE7BUcTIAtkEwAAZC4BEQESBmQTRxMAAGU0AAMOOgs7C0kTAABmNAACFwMOOgs7C0kTAABnCwERARIGAABoLgERARIGRxMAAGkuAAMOOgs7CyALAABqLgERARIGbg40GQAAax0BMRMRARIGWAtZCwAAAADkFAsuZGVidWdfbGluZVQKAAAEAGAIAAABAQH7Dg0AAQEBAQAAAAEAAAEvaG9tZS9zZXJnZXkvRGVza3RvcC90ZWxlZ3JhbS93YXNtAC9ob21lL3NlcmdleQAvaG9tZS9zZXJnZXkvRGVza3RvcC90ZWxlZ3JhbS93YXNtL3NyYwAAc3JjL1ZhcmlhYmxlQnVmZmVyS2VybmVsLmNjAAEAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvZW1zY3JpcHRlbi9iaW5kLmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9lbXNjcmlwdGVuL3dpcmUuaAACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9saWIvbGliYy9tdXNsL2FyY2gvZW1zY3JpcHRlbi9iaXRzL2FsbHR5cGVzLmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvX19udWxscHRyAAIAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvbGliY3h4L3N0ZGRlZi5oAAIAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvbGliY3h4L2NzdGRkZWYAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvY3N0cmluZwACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmMvc3RyaW5nLmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvc3RyaW5nLmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvY3N0ZGludAACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmMvc3RkaW50LmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vbGliL2xpYmMvbXVzbC9hcmNoL2Vtc2NyaXB0ZW4vYml0cy9zdGRpbnQuaAACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmN4eC9jc3RkbGliAAIAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvbGliYy9zdGRsaWIuaAACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmN4eC9zdGRsaWIuaAACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmN4eC9jc3RkaW8AAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjL3N0ZGlvLmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjL2N0eXBlLmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvY2N0eXBlAAIAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvbGliY3h4L2N3Y3R5cGUAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjL3djdHlwZS5oAAIAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvbGliY3h4L2N3Y2hhcgACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmMvdGltZS5oAAIAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvbGliYy93Y2hhci5oAAIAAGVtc2RrL3Vwc3RyZWFtL2Vtc2NyaXB0ZW4vc3lzdGVtL2luY2x1ZGUvbGliY3h4L3djaGFyLmgAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvY3RpbWUAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvY3N0ZGFyZwACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmN4eC9pb3MAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvb3N0cmVhbQACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmN4eC9fX2xvY2FsZQACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmN4eC9fX3N0cmluZwACAABlbXNkay91cHN0cmVhbS9lbXNjcmlwdGVuL3N5c3RlbS9pbmNsdWRlL2xpYmN4eC9pb3Nmd2QAAgAAZW1zZGsvdXBzdHJlYW0vZW1zY3JpcHRlbi9zeXN0ZW0vaW5jbHVkZS9saWJjeHgvbXV0ZXgAAgAAVmFyaWFibGVCdWZmZXJLZXJuZWwuY2MAAwAAAAAFAgAAAAADywABBAIFDQoDsQo8BREDz34CUAEGA7R2CMgFFAYDzgQuBQ0DrwYIIAURA4t/ZgYD+HVmA4gKLgQBBQEGA8p2CKwCAwABAQAFApAAAAADJAEFBQoDFQg8BgNGdAQdBSkGA/cFSgQBBSYDx3rIBTYsBTQGWAUqWAUmBiIFFj0FEgZYBB4FDgYDqwdmBB0FKQONftYEHwUsA/N7ZgYDln4IEgUQBgOJBUoEHQUFA+4ACBIEHgUKA/MBuq0EAQUqA9F4kAUJXAUlBi4FCVgFOQYDenQFKAZYBQVYBQMGAwtKAgwAAQEEAgAFAhQAAAAD7ggBBQ0KIQIHAAEBBAIABQIdAAAAA+IDAQUNCiEGA5x85AUJBgPlAyACAQABAQQCAAUCagAAAAPPAwEFFApZBSIGZgQBBQkGA898dFkFLwYuBQlYBAIFDQYDsAM8AgMAAQEEAgAFAjAAAAADzgIBBRkKCD8FFXMFEfECDgABAQQCAAUCXwEAAAOcBAEFGAo9BVMGLgUYkAVTSgPie3QFGAOeBC4D4nsISgOeBCAFEQgSAgEAAQEEIwAFAqQBAAARBAIFDQoD/Qo8BREDz34CUAEGA7R2CMgFFAYDzgQuBQ0DrwYIIAURA4t/ZgYD+HVmA4gKLgIdAAEBAOdRCi5kZWJ1Z19zdHJjbGFuZyB2ZXJzaW9uIDEwLjAuMCAoL2Ivcy93L2lyL2NhY2hlL2dpdC9jaHJvbWl1bS5nb29nbGVzb3VyY2UuY29tLWV4dGVybmFsLWdpdGh1Yi5jb20tbGx2bS1sbHZtLS1wcm9qZWN0IGY5MTliZTMzNjU4MzM0OWQ4ODNiYTBkZmRiM2IyNDc5YTE5MGI2N2MpAC9ob21lL3NlcmdleS9EZXNrdG9wL3RlbGVncmFtL3dhc20vc3JjL1ZhcmlhYmxlQnVmZmVyS2VybmVsLmNjAC9ob21lL3NlcmdleS9EZXNrdG9wL3RlbGVncmFtL3dhc20vYnVpbGQtYXVkaW8ARW1zY3JpcHRlbkJpbmRpbmdJbml0aWFsaXplcl9DTEFTU19BV1BLZXJuZWxXaXRoVmFyaWFibGVCdWZmZXJTaXplX2luc3RhbmNlAEVtc2NyaXB0ZW5CaW5kaW5nSW5pdGlhbGl6ZXJfQ0xBU1NfQVdQS2VybmVsV2l0aFZhcmlhYmxlQnVmZmVyU2l6ZQBfWkw3NUVtc2NyaXB0ZW5CaW5kaW5nSW5pdGlhbGl6ZXJfQ0xBU1NfQVdQS2VybmVsV2l0aFZhcmlhYmxlQnVmZmVyU2l6ZV9pbnN0YW5jZQBlbXNjcmlwdGVuAGludGVybmFsAHNpZ25hdHVyZQBjaGFyAF9fQVJSQVlfU0laRV9UWVBFX18AX1pOMTBlbXNjcmlwdGVuOGludGVybmFsMTRBcmdBcnJheUdldHRlcklOUzBfOFR5cGVMaXN0SUpOUzBfMTdBbGxvd2VkUmF3UG9pbnRlckkyMFZhcmlhYmxlQnVmZmVyS2VybmVsRUVPakVFRUUzZ2V0RXYAZ2V0AFRZUEVJRABUeXBlTGlzdDxlbXNjcmlwdGVuOjppbnRlcm5hbDo6QWxsb3dlZFJhd1BvaW50ZXI8VmFyaWFibGVCdWZmZXJLZXJuZWw+LCB1bnNpZ25lZCBpbnQgJiY+AEFyZ0xpc3QAQXJnQXJyYXlHZXR0ZXI8ZW1zY3JpcHRlbjo6aW50ZXJuYWw6OlR5cGVMaXN0PGVtc2NyaXB0ZW46OmludGVybmFsOjpBbGxvd2VkUmF3UG9pbnRlcjxWYXJpYWJsZUJ1ZmZlcktlcm5lbD4sIHVuc2lnbmVkIGludCAmJj4gPgB0eXBlcwBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxNEFyZ0FycmF5R2V0dGVySU5TMF84VHlwZUxpc3RJSnZOUzBfMTdBbGxvd2VkUmF3UG9pbnRlckkyMFZhcmlhYmxlQnVmZmVyS2VybmVsRUVtbWpFRUVFM2dldEV2AFR5cGVMaXN0PHZvaWQsIGVtc2NyaXB0ZW46OmludGVybmFsOjpBbGxvd2VkUmF3UG9pbnRlcjxWYXJpYWJsZUJ1ZmZlcktlcm5lbD4sIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGludD4AQXJnQXJyYXlHZXR0ZXI8ZW1zY3JpcHRlbjo6aW50ZXJuYWw6OlR5cGVMaXN0PHZvaWQsIGVtc2NyaXB0ZW46OmludGVybmFsOjpBbGxvd2VkUmF3UG9pbnRlcjxWYXJpYWJsZUJ1ZmZlcktlcm5lbD4sIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGludD4gPgBjbGFzc18Aa2VybmVsX2J1ZmZlcl9zaXplXwB1bnNpZ25lZCBpbnQAYnl0ZXNfcGVyX2NoYW5uZWxfAFZhcmlhYmxlQnVmZmVyS2VybmVsAF9aTjIwVmFyaWFibGVCdWZmZXJLZXJuZWw3UHJvY2Vzc0VtbWoAUHJvY2VzcwBsb25nIHVuc2lnbmVkIGludAB1aW50cHRyX3QAQ2xhc3NUeXBlAF9aTjEwZW1zY3JpcHRlbjhpbnRlcm5hbDExTm9CYXNlQ2xhc3MzZ2V0RXYATm9CYXNlQ2xhc3MAQmFzZVNwZWNpZmllcgBjbGFzc188VmFyaWFibGVCdWZmZXJLZXJuZWwsIGVtc2NyaXB0ZW46OmludGVybmFsOjpOb0Jhc2VDbGFzcz4AZmxvYXQAR2VuZXJpY0Z1bmN0aW9uAHZhbHVlAGJvb2wAUG9saWNpZXMAYWxsb3dfcmF3X3BvaW50ZXJzAGlzUHVyZVZpcnR1YWw8ZW1zY3JpcHRlbjo6YWxsb3dfcmF3X3BvaW50ZXJzPgBzdGQAZGVjbHR5cGUobnVsbHB0cikAbnVsbHB0cl90AF9fMgBsb25nIGludABwdHJkaWZmX3QAc2l6ZV90AG1heF9hbGlnbl90AG1lbWNweQBtZW1tb3ZlAHN0cmNweQBzdHJuY3B5AHN0cmNhdABzdHJuY2F0AG1lbWNtcABpbnQAc3RyY21wAHN0cm5jbXAAc3RyY29sbABzdHJ4ZnJtAF9aNm1lbWNoclVhOWVuYWJsZV9pZklYTGIxRUVFUHZpbQBtZW1jaHIAX1o2c3RyY2hyVWE5ZW5hYmxlX2lmSVhMYjFFRUVQY2kAc3RyY2hyAHN0cmNzcG4AX1o3c3RycGJya1VhOWVuYWJsZV9pZklYTGIxRUVFUGNQS2MAc3RycGJyawBfWjdzdHJyY2hyVWE5ZW5hYmxlX2lmSVhMYjFFRUVQY2kAc3RycmNocgBzdHJzcG4AX1o2c3Ryc3RyVWE5ZW5hYmxlX2lmSVhMYjFFRUVQY1BLYwBzdHJzdHIAc3RydG9rAG1lbXNldABzdHJlcnJvcgBzdHJsZW4Ac2lnbmVkIGNoYXIAaW50OF90AHNob3J0AGludDE2X3QAaW50MzJfdABsb25nIGxvbmcgaW50AGludDY0X3QAdW5zaWduZWQgY2hhcgB1aW50OF90AHVuc2lnbmVkIHNob3J0AHVpbnQxNl90AHVpbnQzMl90AGxvbmcgbG9uZyB1bnNpZ25lZCBpbnQAdWludDY0X3QAaW50X2xlYXN0OF90AGludF9sZWFzdDE2X3QAaW50X2xlYXN0MzJfdABpbnRfbGVhc3Q2NF90AHVpbnRfbGVhc3Q4X3QAdWludF9sZWFzdDE2X3QAdWludF9sZWFzdDMyX3QAdWludF9sZWFzdDY0X3QAaW50X2Zhc3Q4X3QAaW50X2Zhc3QxNl90AGludF9mYXN0MzJfdABpbnRfZmFzdDY0X3QAdWludF9mYXN0OF90AHVpbnRfZmFzdDE2X3QAdWludF9mYXN0MzJfdAB1aW50X2Zhc3Q2NF90AGludHB0cl90AGludG1heF90AHVpbnRtYXhfdABkaXZfdABxdW90AHJlbQBsZGl2X3QAbGxkaXZfdABhdG9mAGRvdWJsZQBhdG9pAGF0b2wAYXRvbGwAc3RydG9kAHN0cnRvZgBzdHJ0b2xkAGxvbmcgZG91YmxlAHN0cnRvbABzdHJ0b2xsAHN0cnRvdWwAc3RydG91bGwAcmFuZABzcmFuZABjYWxsb2MAZnJlZQBtYWxsb2MAcmVhbGxvYwBhYm9ydABhdGV4aXQAZXhpdABfRXhpdABnZXRlbnYAc3lzdGVtAGJzZWFyY2gAcXNvcnQAX1ozYWJzeABhYnMAbGFicwBsbGFicwBfWjNkaXZ4eABkaXYAbGRpdgBsbGRpdgBtYmxlbgBtYnRvd2MAd2NoYXJfdAB3Y3RvbWIAbWJzdG93Y3MAd2NzdG9tYnMAX0lPX0ZJTEUARklMRQBfR19mcG9zNjRfdABmcG9zX3QAZmNsb3NlAGZmbHVzaABzZXRidWYAc2V0dmJ1ZgBmcHJpbnRmAGZzY2FuZgBzbnByaW50ZgBzcHJpbnRmAHNzY2FuZgB2ZnByaW50ZgBfX2J1aWx0aW5fdmFfbGlzdABfX2lzb2NfdmFfbGlzdAB2ZnNjYW5mAHZzc2NhbmYAdnNucHJpbnRmAHZzcHJpbnRmAGZnZXRjAGZnZXRzAGZwdXRjAGZwdXRzAGdldGMAcHV0YwB1bmdldGMAZnJlYWQAZndyaXRlAGZnZXRwb3MAZnNlZWsAZnNldHBvcwBmdGVsbAByZXdpbmQAY2xlYXJlcnIAZmVvZgBmZXJyb3IAcGVycm9yAGZvcGVuAGZyZW9wZW4AcmVtb3ZlAHJlbmFtZQB0bXBmaWxlAHRtcG5hbQBnZXRjaGFyAGdldHMAc2NhbmYAdnNjYW5mAHByaW50ZgBwdXRjaGFyAHB1dHMAdnByaW50ZgBpc2FsbnVtAGlzYWxwaGEAaXNibGFuawBpc2NudHJsAGlzZGlnaXQAaXNncmFwaABpc2xvd2VyAGlzcHJpbnQAaXNwdW5jdABpc3NwYWNlAGlzdXBwZXIAaXN4ZGlnaXQAdG9sb3dlcgB0b3VwcGVyAHdpbnRfdAB3Y3RyYW5zX3QAd2N0eXBlX3QAaXN3YWxudW0AaXN3YWxwaGEAaXN3YmxhbmsAaXN3Y250cmwAaXN3ZGlnaXQAaXN3Z3JhcGgAaXN3bG93ZXIAaXN3cHJpbnQAaXN3cHVuY3QAaXN3c3BhY2UAaXN3dXBwZXIAaXN3eGRpZ2l0AGlzd2N0eXBlAHdjdHlwZQB0b3dsb3dlcgB0b3d1cHBlcgB0b3djdHJhbnMAd2N0cmFucwBfX29wYXF1ZTEAX19vcGFxdWUyAF9fbWJzdGF0ZV90AG1ic3RhdGVfdAB0bV9zZWMAdG1fbWluAHRtX2hvdXIAdG1fbWRheQB0bV9tb24AdG1feWVhcgB0bV93ZGF5AHRtX3lkYXkAdG1faXNkc3QAdG1fZ210b2ZmAHRtX3pvbmUAdG0AZndwcmludGYAZndzY2FuZgBzd3ByaW50ZgB2ZndwcmludGYAdnN3cHJpbnRmAHN3c2NhbmYAdmZ3c2NhbmYAdnN3c2NhbmYAZmdldHdjAGZnZXR3cwBmcHV0d2MAZnB1dHdzAGZ3aWRlAGdldHdjAHB1dHdjAHVuZ2V0d2MAd2NzdG9kAHdjc3RvZgB3Y3N0b2xkAHdjc3RvbAB3Y3N0b2xsAHdjc3RvdWwAd2NzdG91bGwAd2NzY3B5AHdjc25jcHkAd2NzY2F0AHdjc25jYXQAd2NzY21wAHdjc2NvbGwAd2NzbmNtcAB3Y3N4ZnJtAF9aNndjc2NoclVhOWVuYWJsZV9pZklYTGIxRUVFUHd3AHdjc2NocgBfWjd3Y3NwYnJrVWE5ZW5hYmxlX2lmSVhMYjFFRUVQd1BLdwB3Y3NwYnJrAF9aN3djc3JjaHJVYTllbmFibGVfaWZJWExiMUVFRVB3dwB3Y3NyY2hyAF9aNndjc3N0clVhOWVuYWJsZV9pZklYTGIxRUVFUHdQS3cAd2Nzc3RyAF9aN3dtZW1jaHJVYTllbmFibGVfaWZJWExiMUVFRVB3d20Ad21lbWNocgB3Y3Njc3BuAHdjc2xlbgB3Y3NzcG4Ad2NzdG9rAHdtZW1jbXAAd21lbWNweQB3bWVtbW92ZQB3bWVtc2V0AHdjc2Z0aW1lAGJ0b3djAHdjdG9iAG1ic2luaXQAbWJybGVuAG1icnRvd2MAd2NydG9tYgBtYnNydG93Y3MAd2NzcnRvbWJzAGdldHdjaGFyAHZ3c2NhbmYAd3NjYW5mAHB1dHdjaGFyAHZ3cHJpbnRmAHdwcmludGYAY2xvY2tfdAB0aW1lX3QAY2xvY2sAZGlmZnRpbWUAbWt0aW1lAHRpbWUAYXNjdGltZQBjdGltZQBnbXRpbWUAbG9jYWx0aW1lAHN0cmZ0aW1lAHZhX2xpc3QAX1pOMTBlbXNjcmlwdGVuNmNsYXNzX0kyMFZhcmlhYmxlQnVmZmVyS2VybmVsTlNfOGludGVybmFsMTFOb0Jhc2VDbGFzc0VFQzJFUEtjAHRoaXMAbmFtZQB1cGNhc3QAZG93bmNhc3QAX2dldEFjdHVhbFR5cGUAZGVzdHJ1Y3RvcgBUAFJlZ2lzdGVyQ2xhc3NDb25zdHJ1Y3RvcjxWYXJpYWJsZUJ1ZmZlcktlcm5lbCAqKCopKHVuc2lnbmVkIGludCAmJik+AF9aTjEwZW1zY3JpcHRlbjhpbnRlcm5hbDI0UmVnaXN0ZXJDbGFzc0NvbnN0cnVjdG9ySVBGUDIwVmFyaWFibGVCdWZmZXJLZXJuZWxPakVFNmludm9rZUlTMl9KRUVFdlM2XwBpbnZva2U8VmFyaWFibGVCdWZmZXJLZXJuZWw+AGZhY3RvcnkAaW52b2tlAGFyZ3MAV2l0aFBvbGljaWVzPGVtc2NyaXB0ZW46OmFsbG93X3Jhd19wb2ludGVycz4AX1pOSzEwZW1zY3JpcHRlbjhpbnRlcm5hbDEyV2l0aFBvbGljaWVzSUpOU18xOGFsbG93X3Jhd19wb2ludGVyc0VFRTExQXJnVHlwZUxpc3RJSlAyMFZhcmlhYmxlQnVmZmVyS2VybmVsT2pFRThnZXRDb3VudEV2AGdldENvdW50AF9aTksxMGVtc2NyaXB0ZW44aW50ZXJuYWwxMldpdGhQb2xpY2llc0lKTlNfMThhbGxvd19yYXdfcG9pbnRlcnNFRUUxMUFyZ1R5cGVMaXN0SUpQMjBWYXJpYWJsZUJ1ZmZlcktlcm5lbE9qRUU4Z2V0VHlwZXNFdgBnZXRUeXBlcwBBcmdzAEFyZ1R5cGVMaXN0PFZhcmlhYmxlQnVmZmVyS2VybmVsICosIHVuc2lnbmVkIGludCAmJj4ARGVkdWNlQXJndW1lbnRzVGFnAFNpZ25hdHVyZQBDYWxsYWJsZQBfWk5LMTBlbXNjcmlwdGVuNmNsYXNzX0kyMFZhcmlhYmxlQnVmZmVyS2VybmVsTlNfOGludGVybmFsMTFOb0Jhc2VDbGFzc0VFMTFjb25zdHJ1Y3RvcklOUzJfMThEZWR1Y2VBcmd1bWVudHNUYWdFUEZQUzFfT2pFSkVFRVJLUzRfVDBfRHBUMV8AY29uc3RydWN0b3I8ZW1zY3JpcHRlbjo6aW50ZXJuYWw6OkRlZHVjZUFyZ3VtZW50c1RhZywgVmFyaWFibGVCdWZmZXJLZXJuZWwgKigqKSh1bnNpZ25lZCBpbnQgJiYpPgBjYWxsYWJsZQBDb25zdHJ1Y3RvckFyZ3MAX1pOSzEwZW1zY3JpcHRlbjZjbGFzc19JMjBWYXJpYWJsZUJ1ZmZlcktlcm5lbE5TXzhpbnRlcm5hbDExTm9CYXNlQ2xhc3NFRTExY29uc3RydWN0b3JJSmpFSkVFRVJLUzRfRHBUMF8AY29uc3RydWN0b3I8dW5zaWduZWQgaW50PgBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxMGdldENvbnRleHRJTTIwVmFyaWFibGVCdWZmZXJLZXJuZWxGdm1takVFRVBUX1JLUzVfAGdldENvbnRleHQ8dm9pZCAoVmFyaWFibGVCdWZmZXJLZXJuZWw6OiopKHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGxvbmcsIHVuc2lnbmVkIGludCk+AHQAUmVnaXN0ZXJDbGFzc01ldGhvZDx2b2lkIChWYXJpYWJsZUJ1ZmZlcktlcm5lbDo6KikodW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgaW50KT4AQ1QAX1pOMTBlbXNjcmlwdGVuOGludGVybmFsMTlSZWdpc3RlckNsYXNzTWV0aG9kSU0yMFZhcmlhYmxlQnVmZmVyS2VybmVsRnZtbWpFRTZpbnZva2VJUzJfSk5TXzE4YWxsb3dfcmF3X3BvaW50ZXJzRUVFRXZQS2NTNF8AaW52b2tlPFZhcmlhYmxlQnVmZmVyS2VybmVsLCBlbXNjcmlwdGVuOjphbGxvd19yYXdfcG9pbnRlcnM+AG1ldGhvZE5hbWUAbWVtYmVyRnVuY3Rpb24AaW52b2tlcgBfWk5LMTBlbXNjcmlwdGVuOGludGVybmFsMTJXaXRoUG9saWNpZXNJSk5TXzE4YWxsb3dfcmF3X3BvaW50ZXJzRUVFMTFBcmdUeXBlTGlzdElKdk5TMF8xN0FsbG93ZWRSYXdQb2ludGVySTIwVmFyaWFibGVCdWZmZXJLZXJuZWxFRW1takVFOGdldENvdW50RXYAX1pOSzEwZW1zY3JpcHRlbjhpbnRlcm5hbDEyV2l0aFBvbGljaWVzSUpOU18xOGFsbG93X3Jhd19wb2ludGVyc0VFRTExQXJnVHlwZUxpc3RJSnZOUzBfMTdBbGxvd2VkUmF3UG9pbnRlckkyMFZhcmlhYmxlQnVmZmVyS2VybmVsRUVtbWpFRThnZXRUeXBlc0V2AEFsbG93ZWRSYXdQb2ludGVyPFZhcmlhYmxlQnVmZmVyS2VybmVsPgBBcmdUeXBlTGlzdDx2b2lkLCBlbXNjcmlwdGVuOjppbnRlcm5hbDo6QWxsb3dlZFJhd1BvaW50ZXI8VmFyaWFibGVCdWZmZXJLZXJuZWw+LCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBpbnQ+AF9aTksxMGVtc2NyaXB0ZW42Y2xhc3NfSTIwVmFyaWFibGVCdWZmZXJLZXJuZWxOU184aW50ZXJuYWwxMU5vQmFzZUNsYXNzRUU4ZnVuY3Rpb25JTlMyXzE4RGVkdWNlQXJndW1lbnRzVGFnRU1TMV9Gdm1takVKTlNfMThhbGxvd19yYXdfcG9pbnRlcnNFRUVFUktTNF9QS2NUMF9EcFQxXwBmdW5jdGlvbjxlbXNjcmlwdGVuOjppbnRlcm5hbDo6RGVkdWNlQXJndW1lbnRzVGFnLCB2b2lkIChWYXJpYWJsZUJ1ZmZlcktlcm5lbDo6KikodW5zaWduZWQgbG9uZywgdW5zaWduZWQgbG9uZywgdW5zaWduZWQgaW50KSwgZW1zY3JpcHRlbjo6YWxsb3dfcmF3X3BvaW50ZXJzPgBiYXNpY19pb3M8Y2hhciwgc3RkOjpfXzI6OmNoYXJfdHJhaXRzPGNoYXI+ID4AX1pOS1N0M19fMjliYXNpY19pb3NJY05TXzExY2hhcl90cmFpdHNJY0VFRTV3aWRlbkVjAHdpZGVuAGNoYXJfdHlwZQBfX2MAX0NoYXJUAF9aTlN0M19fMjExY2hhcl90cmFpdHNJY0U2YXNzaWduRVJjUktjAGFzc2lnbgBfWk5TdDNfXzIxMWNoYXJfdHJhaXRzSWNFMmVxRWNjAGVxAF9aTlN0M19fMjExY2hhcl90cmFpdHNJY0UybHRFY2MAbHQAX1pOU3QzX18yMTFjaGFyX3RyYWl0c0ljRTdjb21wYXJlRVBLY1MzX20AY29tcGFyZQBfWk5TdDNfXzIxMWNoYXJfdHJhaXRzSWNFNmxlbmd0aEVQS2MAbGVuZ3RoAF9aTlN0M19fMjExY2hhcl90cmFpdHNJY0U0ZmluZEVQS2NtUlMyXwBmaW5kAF9aTlN0M19fMjExY2hhcl90cmFpdHNJY0U0bW92ZUVQY1BLY20AbW92ZQBfWk5TdDNfXzIxMWNoYXJfdHJhaXRzSWNFNGNvcHlFUGNQS2NtAGNvcHkAX1pOU3QzX18yMTFjaGFyX3RyYWl0c0ljRTZhc3NpZ25FUGNtYwBfWk5TdDNfXzIxMWNoYXJfdHJhaXRzSWNFN25vdF9lb2ZFaQBub3RfZW9mAGludF90eXBlAF9aTlN0M19fMjExY2hhcl90cmFpdHNJY0UxMnRvX2NoYXJfdHlwZUVpAHRvX2NoYXJfdHlwZQBfWk5TdDNfXzIxMWNoYXJfdHJhaXRzSWNFMTF0b19pbnRfdHlwZUVjAHRvX2ludF90eXBlAF9aTlN0M19fMjExY2hhcl90cmFpdHNJY0UxMWVxX2ludF90eXBlRWlpAGVxX2ludF90eXBlAF9aTlN0M19fMjExY2hhcl90cmFpdHNJY0UzZW9mRXYAZW9mAGNoYXJfdHJhaXRzPGNoYXI+AF9UcmFpdHMAX1pOU3QzX18yNGVuZGxJY05TXzExY2hhcl90cmFpdHNJY0VFRUVSTlNfMTNiYXNpY19vc3RyZWFtSVRfVDBfRUVTN18AZW5kbDxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4gPgBiYXNpY19vc3RyZWFtPGNoYXIsIHN0ZDo6X18yOjpjaGFyX3RyYWl0czxjaGFyPiA+AF9fb3MAX1pOU3QzX18yMTNiYXNpY19vc3RyZWFtSWNOU18xMWNoYXJfdHJhaXRzSWNFRUVsc0VQRlJTM19TNF9FAG9wZXJhdG9yPDwAX19wZgBjdHlwZTxjaGFyPgBfRmFjZXQAX1pOU3QzX18yOXVzZV9mYWNldElOU181Y3R5cGVJY0VFRUVSS1RfUktOU182bG9jYWxlRQB1c2VfZmFjZXQ8c3RkOjpfXzI6OmN0eXBlPGNoYXI+ID4AX19sAG5vbmUAY2F0ZWdvcnkAY29sbGF0ZQBjdHlwZQBtb25ldGFyeQBudW1lcmljAG1lc3NhZ2VzAGFsbABfX2xvY2FsZV8AX19pbXAAbG9jYWxlAGJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6Ol9fMjo6Y2hhcl90cmFpdHM8Y2hhcj4sIHN0ZDo6X18yOjphbGxvY2F0b3I8Y2hhcj4gPgBzdHJpbmcAfmxvY2FsZQBfWk5TdDNfXzI2bG9jYWxlYVNFUktTMF8Ab3BlcmF0b3I9AF9aTktTdDNfXzI2bG9jYWxlNG5hbWVFdgBfWk5LU3QzX18yNmxvY2FsZWVxRVJLUzBfAG9wZXJhdG9yPT0AX1pOS1N0M19fMjZsb2NhbGVuZUVSS1MwXwBvcGVyYXRvciE9AF9aTlN0M19fMjZsb2NhbGU2Z2xvYmFsRVJLUzBfAGdsb2JhbABfWk5TdDNfXzI2bG9jYWxlN2NsYXNzaWNFdgBjbGFzc2ljAF9aTlN0M19fMjZsb2NhbGUxNF9faW5zdGFsbF9jdG9yRVJLUzBfUE5TMF81ZmFjZXRFbABfX2luc3RhbGxfY3RvcgBmYWNldABfWk5TdDNfXzI2bG9jYWxlOF9fZ2xvYmFsRXYAX19nbG9iYWwAX1pOS1N0M19fMjZsb2NhbGU5aGFzX2ZhY2V0RVJOUzBfMmlkRQBoYXNfZmFjZXQAX19mbGFnXwBfX3N0YXRlXwBvbmNlX2ZsYWcAX1pOU3QzX18yOW9uY2VfZmxhZ2FTRVJLUzBfAF9faWRfAF9fbmV4dF9pZABpZABfWk5TdDNfXzI2bG9jYWxlMmlkNl9faW5pdEV2AF9faW5pdABfWk5TdDNfXzI2bG9jYWxlMmlkYVNFUktTMV8AX1pOU3QzX18yNmxvY2FsZTJpZDVfX2dldEV2AF9fZ2V0AF9aTktTdDNfXzI2bG9jYWxlOXVzZV9mYWNldEVSTlMwXzJpZEUAdXNlX2ZhY2V0AF9aTktTdDNfXzI1Y3R5cGVJY0U1d2lkZW5FYwBfWk4yMFZhcmlhYmxlQnVmZmVyS2VybmVsQzJFagBrZXJuZWxfYnVmZmVyX3NpemUAX1pOMTBlbXNjcmlwdGVuOGludGVybmFsN0ludm9rZXJJUDIwVmFyaWFibGVCdWZmZXJLZXJuZWxKT2pFRTZpbnZva2VFUEZTM19TNF9FagBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxMUJpbmRpbmdUeXBlSVAyMFZhcmlhYmxlQnVmZmVyS2VybmVsdkUxMHRvV2lyZVR5cGVFUzNfAHRvV2lyZVR5cGUAV2lyZVR5cGUAX1pOMTBlbXNjcmlwdGVuOGludGVybmFsMTFCaW5kaW5nVHlwZUlQMjBWYXJpYWJsZUJ1ZmZlcktlcm5lbHZFMTJmcm9tV2lyZVR5cGVFUzNfAGZyb21XaXJlVHlwZQBCaW5kaW5nVHlwZTxWYXJpYWJsZUJ1ZmZlcktlcm5lbCAqLCB2b2lkPgBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxMUJpbmRpbmdUeXBlSU9qdkUxMHRvV2lyZVR5cGVFUktqAF9aTjEwZW1zY3JpcHRlbjhpbnRlcm5hbDExQmluZGluZ1R5cGVJanZFMTB0b1dpcmVUeXBlRVJLagBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxMUJpbmRpbmdUeXBlSWp2RTEyZnJvbVdpcmVUeXBlRWoAQmluZGluZ1R5cGU8dW5zaWduZWQgaW50LCB2b2lkPgBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxMUJpbmRpbmdUeXBlSU9qdkUxMmZyb21XaXJlVHlwZUVqAEJpbmRpbmdUeXBlPHVuc2lnbmVkIGludCAmJiwgdm9pZD4AUmV0dXJuVHlwZQBJbnZva2VyPFZhcmlhYmxlQnVmZmVyS2VybmVsICosIHVuc2lnbmVkIGludCAmJj4AX1pOMTBlbXNjcmlwdGVuOGludGVybmFsMTNNZXRob2RJbnZva2VySU0yMFZhcmlhYmxlQnVmZmVyS2VybmVsRnZtbWpFdlBTMl9KbW1qRUU2aW52b2tlRVJLUzRfUzVfbW1qAF9aTjEwZW1zY3JpcHRlbjhpbnRlcm5hbDExQmluZGluZ1R5cGVJbXZFMTB0b1dpcmVUeXBlRVJLbQBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxMUJpbmRpbmdUeXBlSW12RTEyZnJvbVdpcmVUeXBlRW0AQmluZGluZ1R5cGU8dW5zaWduZWQgbG9uZywgdm9pZD4ATWVtYmVyUG9pbnRlcgBUaGlzVHlwZQBNZXRob2RJbnZva2VyPHZvaWQgKFZhcmlhYmxlQnVmZmVyS2VybmVsOjoqKSh1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBpbnQpLCB2b2lkLCBWYXJpYWJsZUJ1ZmZlcktlcm5lbCAqLCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBsb25nLCB1bnNpZ25lZCBpbnQ+AF9aTjY2RW1zY3JpcHRlbkJpbmRpbmdJbml0aWFsaXplcl9DTEFTU19BV1BLZXJuZWxXaXRoVmFyaWFibGVCdWZmZXJTaXplQzJFdgBfX2N4eF9nbG9iYWxfdmFyX2luaXQAX1pOMTBlbXNjcmlwdGVuOGludGVybmFsMTNnZXRBY3R1YWxUeXBlSTIwVmFyaWFibGVCdWZmZXJLZXJuZWxFRVBLdlBUXwBnZXRBY3R1YWxUeXBlPFZhcmlhYmxlQnVmZmVyS2VybmVsPgBfWk4xMGVtc2NyaXB0ZW44aW50ZXJuYWwxNHJhd19kZXN0cnVjdG9ySTIwVmFyaWFibGVCdWZmZXJLZXJuZWxFRXZQVF8AcmF3X2Rlc3RydWN0b3I8VmFyaWFibGVCdWZmZXJLZXJuZWw+AF9aTjEwZW1zY3JpcHRlbjhpbnRlcm5hbDEyb3BlcmF0b3JfbmV3STIwVmFyaWFibGVCdWZmZXJLZXJuZWxKakVFRVBUX0RwT1QwXwBvcGVyYXRvcl9uZXc8VmFyaWFibGVCdWZmZXJLZXJuZWwsIHVuc2lnbmVkIGludD4AX0dMT0JBTF9fc3ViX0lfVmFyaWFibGVCdWZmZXJLZXJuZWwuY2MAY2hhbm5lbF9jb3VudABvdXRwdXRfcHRyAG91dHB1dF9idWZmZXIAaW5wdXRfcHRyAGlucHV0X2J1ZmZlcgBjb3VudABjaGFubmVsAGRlc3RpbmF0aW9uAHNvdXJjZQBwdHIAZm4AbWV0aG9kAHdpcmVUaGlzAA==';
if (!isDataURI(wasmBinaryFile)) {
  wasmBinaryFile = locateFile(wasmBinaryFile);
}

function getBinary() {
  try {
    if (wasmBinary) {
      return new Uint8Array(wasmBinary);
    }

    var binary = tryParseAsDataURI(wasmBinaryFile);
    if (binary) {
      return binary;
    }
    if (readBinary) {
      return readBinary(wasmBinaryFile);
    } else {
      throw "sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)";
    }
  }
  catch (err) {
    abort(err);
  }
}

function getBinaryPromise() {
  // if we don't have the binary yet, and have the Fetch api, use that
  // in some environments, like Electron's render process, Fetch api may be present, but have a different context than expected, let's only use it on the Web
  if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === 'function') {
    return fetch(wasmBinaryFile, { credentials: 'same-origin' }).then(function(response) {
      if (!response['ok']) {
        throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
      }
      return response['arrayBuffer']();
    }).catch(function () {
      return getBinary();
    });
  }
  // Otherwise, getBinary should be able to get it synchronously
  return new Promise(function(resolve, reject) {
    resolve(getBinary());
  });
}



// Create the wasm instance.
// Receives the wasm imports, returns the exports.
function createWasm() {
  // prepare imports
  var info = {
    'env': asmLibraryArg,
    'wasi_unstable': asmLibraryArg
  };
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module['asm'] = exports;
    removeRunDependency('wasm-instantiate');
  }
   // we can't run yet (except in a pthread, where we have a custom sync instantiator)
  addRunDependency('wasm-instantiate');


  function receiveInstantiatedSource(output) {
    // 'output' is a WebAssemblyInstantiatedSource object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
      // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
      // When the regression is fixed, can restore the above USE_PTHREADS-enabled path.
    receiveInstance(output['instance']);
  }


  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise().then(function(binary) {
      return WebAssembly.instantiate(binary, info);
    }).then(receiver, function(reason) {
      err('failed to asynchronously prepare wasm: ' + reason);
      abort(reason);
    });
  }

  // Prefer streaming instantiation if available.
  function instantiateSync() {
    var instance;
    var module;
    var binary;
    try {
      binary = getBinary();
      module = new WebAssembly.Module(binary);
      instance = new WebAssembly.Instance(module, info);
    } catch (e) {
      var str = e.toString();
      err('failed to compile wasm module: ' + str);
      if (str.indexOf('imported Memory') >= 0 ||
          str.indexOf('memory import') >= 0) {
        err('Memory size incompatibility issues may be due to changing TOTAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set TOTAL_MEMORY at runtime to something smaller than it was at compile time).');
      }
      throw e;
    }
    receiveInstance(instance, module);
  }
  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to run the instantiation parallel
  // to any other async startup actions they are performing.
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch(e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }

  instantiateSync();
  return Module['asm']; // exports were assigned here
}


// Globals used by JS i64 conversions
var tempDouble;
var tempI64;

// === Body ===

var ASM_CONSTS = [];




// STATICTOP = STATIC_BASE + 22304;
/* global initializers */  __ATINIT__.push({ func: function() { ___wasm_call_ctors() } });



/* no memory initializer */
// {{PRE_LIBRARY}}


  function demangle(func) {
      return func;
    }

  function demangleAll(text) {
      var regex =
        /\b_Z[\w\d_]+/g;
      return text.replace(regex,
        function(x) {
          var y = demangle(x);
          return x === y ? x : (y + ' [' + x + ']');
        });
    }

  function jsStackTrace() {
      var err = new Error();
      if (!err.stack) {
        // IE10+ special cases: It does have callstack info, but it is only populated if an Error object is thrown,
        // so try that as a special-case.
        try {
          throw new Error(0);
        } catch(e) {
          err = e;
        }
        if (!err.stack) {
          return '(no stack trace available)';
        }
      }
      return err.stack.toString();
    }

  function stackTrace() {
      var js = jsStackTrace();
      if (Module['extraStackTrace']) js += '\n' + Module['extraStackTrace']();
      return demangleAll(js);
    }

  
  function _atexit(func, arg) {
      __ATEXIT__.unshift({ func: func, arg: arg });
    }function ___cxa_atexit(
  ) {
  return _atexit.apply(null, arguments)
  }

  function ___lock() {}

  
  function ___setErrNo(value) {
      if (Module['___errno_location']) HEAP32[((Module['___errno_location']())>>2)]=value;
      return value;
    }function ___map_file(pathname, size) {
      ___setErrNo(63);
      return -1;
    }

  
  
  
  var PATH={splitPath:function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function(parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function(path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function(path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function(path) {
        return PATH.splitPath(path)[3];
      },join:function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function(l, r) {
        return PATH.normalize(l + '/' + r);
      }};
  
  
  var PATH_FS={resolve:function() {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            return ''; // an invalid portion invalidates the whole thing
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function(from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function(stream) {
          // flush any pending line data
          stream.tty.ops.flush(stream.tty);
        },flush:function(stream) {
          stream.tty.ops.flush(stream.tty);
        },read:function(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function(tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              // we will read data by chunks of BUFSIZE
              var BUFSIZE = 256;
              var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
              var bytesRead = 0;
  
              try {
                bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null);
              } catch(e) {
                // Cross-platform differences: on Windows, reading EOF throws an exception, but on other OSes,
                // reading EOF returns 0. Uniformize behavior by treating the EOF exception to return 0.
                if (e.toString().indexOf('EOF') != -1) bytesRead = 0;
                else throw e;
              }
  
              if (bytesRead > 0) {
                result = buf.slice(0, bytesRead).toString('utf-8');
              } else {
                result = null;
              }
            } else
            if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            out(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }},default_tty1_ops:{put_char:function(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },flush:function(tty) {
          if (tty.output && tty.output.length > 0) {
            err(UTF8ArrayToString(tty.output, 0));
            tty.output = [];
          }
        }}};
  
  var MEMFS={ops_table:null,mount:function(mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(63);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap,
                msync: MEMFS.stream_ops.msync
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            }
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },getFileDataAsRegularArray:function(node) {
        if (node.contents && node.contents.subarray) {
          var arr = [];
          for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
          return arr; // Returns a copy of the original data.
        }
        return node.contents; // No-op, the file contents are already in a JS array. Return as-is.
      },getFileDataAsTypedArray:function(node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },expandFileStorage:function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) | 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
        return;
      },resizeFileStorage:function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
          return;
        }
        if (!node.contents || node.contents.subarray) { // Resize a typed array if that is being used as the backing store.
          var oldContents = node.contents;
          node.contents = new Uint8Array(new ArrayBuffer(newSize)); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
          return;
        }
        // Backing with a JS array.
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize;
      },node_ops:{getattr:function(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function(node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },lookup:function(parent, name) {
          throw FS.genericErrors[44];
        },mknod:function(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function(old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function(parent, name) {
          delete parent.contents[name];
        },rmdir:function(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
        },readdir:function(node) {
          var entries = ['.', '..'];
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        }},stream_ops:{read:function(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },write:function(stream, buffer, offset, length, position, canOwn) {
  
          if (!length) return 0;
          var node = stream.node;
          node.timestamp = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position); // Use typed array write if available.
          else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position+length);
          return length;
        },llseek:function(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },allocate:function(stream, offset, length) {
          MEMFS.expandFileStorage(stream.node, offset + length);
          stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length);
        },mmap:function(stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < stream.node.usedBytes) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            // malloc() can lead to growing the heap. If targeting the heap, we need to
            // re-acquire the heap buffer object in case growth had occurred.
            var fromHeap = (buffer.buffer == HEAP8.buffer);
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            (fromHeap ? HEAP8 : buffer).set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        },msync:function(stream, buffer, offset, length, mmapFlags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          if (mmapFlags & 2) {
            // MAP_PRIVATE calls need not to be synced back to underlying fs
            return 0;
          }
  
          var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        }}};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,handleFSError:function(e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function(path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};
  
        if (!path) return { path: '', node: null };
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(32);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
  
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(32);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function(parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function(parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err, parent);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function(parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); }
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); }
            }
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function(node) {
        FS.hashRemoveNode(node);
      },isRoot:function(node) {
        return node === node.parent;
      },isMountpoint:function(node) {
        return !!node.mounted;
      },isFile:function(mode) {
        return (mode & 61440) === 32768;
      },isDir:function(mode) {
        return (mode & 61440) === 16384;
      },isLink:function(mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function(mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function(mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function(mode) {
        return (mode & 61440) === 4096;
      },isSocket:function(mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return 2;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return 2;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },mayLookup:function(dir) {
        var err = FS.nodePermissions(dir, 'x');
        if (err) return err;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },mayCreate:function(dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },mayOpen:function(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' || // opening for write
              (flags & 512)) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },getStream:function(fd) {
        return FS.streams[fd];
      },createStream:function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        // clone it, so we can return an instance of FSStream
        var newStream = new FS.FSStream();
        for (var p in stream) {
          newStream[p] = stream[p];
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function(fd) {
        FS.streams[fd] = null;
      },chrdev_stream_ops:{open:function(stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function() {
          throw new FS.ErrnoError(70);
        }},major:function(dev) {
        return ((dev) >> 8);
      },minor:function(dev) {
        return ((dev) & 0xff);
      },makedev:function(ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function(dev) {
        return FS.devices[dev];
      },getMounts:function(mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function(populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          console.log('warning: ' + FS.syncFSRequests + ' FS.syncfs operations in flight at once, probably just doing extra work');
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(err) {
          FS.syncFSRequests--;
          return callback(err);
        }
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function(type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1);
      },lookup:function(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === '.' || name === '..') {
          throw new FS.ErrnoError(28);
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function(path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function(path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdirTree:function(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var i = 0; i < dirs.length; ++i) {
          if (!dirs[i]) continue;
          d += '/' + dirs[i];
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },mkdev:function(path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(10);
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        try {
          if (FS.trackingDelegate['willMovePath']) {
            FS.trackingDelegate['willMovePath'](old_path, new_path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
        try {
          if (FS.trackingDelegate['onMovePath']) FS.trackingDelegate['onMovePath'](old_path, new_path);
        } catch(e) {
          console.log("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: " + e.message);
        }
      },rmdir:function(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readdir:function(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(54);
        }
        return node.node_ops.readdir(node);
      },unlink:function(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        try {
          if (FS.trackingDelegate['willDeletePath']) {
            FS.trackingDelegate['willDeletePath'](path);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: " + e.message);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
          if (FS.trackingDelegate['onDeletePath']) FS.trackingDelegate['onDeletePath'](path);
        } catch(e) {
          console.log("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: " + e.message);
        }
      },readlink:function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link));
      },stat:function(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(63);
        }
        return node.node_ops.getattr(node);
      },lstat:function(path) {
        return FS.stat(path, true);
      },chmod:function(path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function(path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chmod(stream.node, mode);
      },chown:function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.truncate(stream.node, len);
      },utime:function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var err = FS.mayOpen(node, flags);
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            console.log("FS.trackingDelegate error on read file: " + path);
          }
        }
        try {
          if (FS.trackingDelegate['onOpenFile']) {
            var trackingFlags = 0;
            if ((flags & 2097155) !== 1) {
              trackingFlags |= FS.tracking.openFlags.READ;
            }
            if ((flags & 2097155) !== 0) {
              trackingFlags |= FS.tracking.openFlags.WRITE;
            }
            FS.trackingDelegate['onOpenFile'](path, trackingFlags);
          }
        } catch(e) {
          console.log("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: " + e.message);
        }
        return stream;
      },close:function(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },isClosed:function(stream) {
        return stream.fd === null;
      },llseek:function(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },read:function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position !== 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position !== 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
          if (stream.path && FS.trackingDelegate['onWriteToFile']) FS.trackingDelegate['onWriteToFile'](stream.path);
        } catch(e) {
          console.log("FS.trackingDelegate['onWriteToFile']('"+stream.path+"') threw an exception: " + e.message);
        }
        return bytesWritten;
      },allocate:function(stream, offset, length) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(28);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(138);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function(stream, buffer, offset, length, position, prot, flags) {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },msync:function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },munmap:function(stream) {
        return 0;
      },ioctl:function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = UTF8ArrayToString(buf, 0);
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === 'string') {
          var buf = new Uint8Array(lengthBytesUTF8(data)+1);
          var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
          FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn);
        } else if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          throw new Error('Unsupported data type');
        }
        FS.close(stream);
      },cwd:function() {
        return FS.currentPath;
      },chdir:function(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },createDefaultDevices:function() {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function(stream, buffer, offset, length, pos) { return length; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        var random_device;
        if (typeof crypto === 'object' && typeof crypto['getRandomValues'] === 'function') {
          // for modern web browsers
          var randomBuffer = new Uint8Array(1);
          random_device = function() { crypto.getRandomValues(randomBuffer); return randomBuffer[0]; };
        } else
        if (ENVIRONMENT_IS_NODE) {
          // for nodejs with or without crypto support included
          try {
            var crypto_module = require('crypto');
            // nodejs has crypto support
            random_device = function() { return crypto_module['randomBytes'](1)[0]; };
          } catch (e) {
            // nodejs doesn't have crypto support
          }
        } else
        {}
        if (!random_device) {
          // we couldn't find a proper implementation, as Math.random() is not suitable for /dev/random, see emscripten-core/emscripten/pull/7096
          random_device = function() { abort("random_device"); };
        }
        FS.createDevice('/dev', 'random', random_device);
        FS.createDevice('/dev', 'urandom', random_device);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createSpecialDirectories:function() {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount: function() {
            var node = FS.createNode('/proc/self', 'fd', 16384 | 511 /* 0777 */, 73);
            node.node_ops = {
              lookup: function(parent, name) {
                var fd = +name;
                var stream = FS.getStream(fd);
                if (!stream) throw new FS.ErrnoError(8);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: function() { return stream.path } }
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },createStandardStreams:function() {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        var stdout = FS.open('/dev/stdout', 'w');
        var stderr = FS.open('/dev/stderr', 'w');
      },ensureErrnoError:function() {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
          this.node = node;
          this.setErrno = function(errno) {
            this.errno = errno;
          };
          this.setErrno(errno);
          this.message = 'FS error';
  
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [44].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function() {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },init:function(input, output, error) {
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function() {
        FS.init.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        var fflush = Module['_fflush'];
        if (fflush) fflush(0);
        // close all of our streams
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function(canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function(relative, base) {
        return PATH_FS.resolve(base, relative);
      },standardizePath:function(path) {
        return PATH.normalize(path);
      },findObject:function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function(path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function(parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (read_) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(read_(obj.url), true);
            obj.usedBytes = obj.contents.length;
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(29);
        return success;
      },createLazyFile:function(parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
        function LazyUint8Array() {
          this.lengthKnown = false;
          this.chunks = []; // Loaded chunks. Index is the chunk number
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
          if (idx > this.length-1 || idx < 0) {
            return undefined;
          }
          var chunkOffset = idx % this.chunkSize;
          var chunkNum = (idx / this.chunkSize)|0;
          return this.getter(chunkNum)[chunkOffset];
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
          this.getter = getter;
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
          // Find length
          var xhr = new XMLHttpRequest();
          xhr.open('HEAD', url, false);
          xhr.send(null);
          if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
          var datalength = Number(xhr.getResponseHeader("Content-length"));
          var header;
          var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
          var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
          var chunkSize = 1024*1024; // Chunk size in bytes
  
          if (!hasByteServing) chunkSize = datalength;
  
          // Function to get a range from the remote URL.
          var doXHR = (function(from, to) {
            if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
            if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
            // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
            // Some hints to the browser that we want binary data.
            if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
            if (xhr.overrideMimeType) {
              xhr.overrideMimeType('text/plain; charset=x-user-defined');
            }
  
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            if (xhr.response !== undefined) {
              return new Uint8Array(xhr.response || []);
            } else {
              return intArrayFromString(xhr.responseText || '', true);
            }
          });
          var lazyArray = this;
          lazyArray.setDataGetter(function(chunkNum) {
            var start = chunkNum * chunkSize;
            var end = (chunkNum+1) * chunkSize - 1; // including this byte
            end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
              lazyArray.chunks[chunkNum] = doXHR(start, end);
            }
            if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
            return lazyArray.chunks[chunkNum];
          });
  
          if (usesGzip || !datalength) {
            // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
            chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
            datalength = this.getter(0).length;
            chunkSize = datalength;
            console.log("LazyFiles on gzip forces download of the whole file when length is accessed");
          }
  
          this._length = datalength;
          this._chunkSize = chunkSize;
          this.lengthKnown = true;
        };
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          var lazyArray = new LazyUint8Array();
          Object.defineProperties(lazyArray, {
            length: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._length;
              }
            },
            chunkSize: {
              get: function() {
                if(!this.lengthKnown) {
                  this.cacheLength();
                }
                return this._chunkSize;
              }
            }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(29);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(29);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init(); // XXX perhaps this method should move onto Browser?
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency('cp ' + fullname); // might have several active requests for the same fullname
        function processData(byteArray) {
          function finish(byteArray) {
            if (preFinish) preFinish();
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency(dep);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency(dep);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency(dep);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function() {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function(paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function(paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};var SYSCALLS={DEFAULT_POLLMASK:5,mappings:{},umask:511,calculateAt:function(dirfd, path) {
        if (path[0] !== '/') {
          // relative path
          var dir;
          if (dirfd === -100) {
            dir = FS.cwd();
          } else {
            var dirstream = FS.getStream(dirfd);
            if (!dirstream) throw new FS.ErrnoError(8);
            dir = dirstream.path;
          }
          path = PATH.join2(dir, path);
        }
        return path;
      },doStat:function(func, path, buf) {
        try {
          var stat = func(path);
        } catch (e) {
          if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
            // an error occurred while trying to look up the path; we should just report ENOTDIR
            return -54;
          }
          throw e;
        }
        HEAP32[((buf)>>2)]=stat.dev;
        HEAP32[(((buf)+(4))>>2)]=0;
        HEAP32[(((buf)+(8))>>2)]=stat.ino;
        HEAP32[(((buf)+(12))>>2)]=stat.mode;
        HEAP32[(((buf)+(16))>>2)]=stat.nlink;
        HEAP32[(((buf)+(20))>>2)]=stat.uid;
        HEAP32[(((buf)+(24))>>2)]=stat.gid;
        HEAP32[(((buf)+(28))>>2)]=stat.rdev;
        HEAP32[(((buf)+(32))>>2)]=0;
        (tempI64 = [stat.size>>>0,(tempDouble=stat.size,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(40))>>2)]=tempI64[0],HEAP32[(((buf)+(44))>>2)]=tempI64[1]);
        HEAP32[(((buf)+(48))>>2)]=4096;
        HEAP32[(((buf)+(52))>>2)]=stat.blocks;
        HEAP32[(((buf)+(56))>>2)]=(stat.atime.getTime() / 1000)|0;
        HEAP32[(((buf)+(60))>>2)]=0;
        HEAP32[(((buf)+(64))>>2)]=(stat.mtime.getTime() / 1000)|0;
        HEAP32[(((buf)+(68))>>2)]=0;
        HEAP32[(((buf)+(72))>>2)]=(stat.ctime.getTime() / 1000)|0;
        HEAP32[(((buf)+(76))>>2)]=0;
        (tempI64 = [stat.ino>>>0,(tempDouble=stat.ino,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[(((buf)+(80))>>2)]=tempI64[0],HEAP32[(((buf)+(84))>>2)]=tempI64[1]);
        return 0;
      },doMsync:function(addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags);
      },doMkdir:function(path, mode) {
        // remove a trailing slash, if one - /a/b/ has basename of '', but
        // we want to create b in the context of this function
        path = PATH.normalize(path);
        if (path[path.length-1] === '/') path = path.substr(0, path.length-1);
        FS.mkdir(path, mode, 0);
        return 0;
      },doMknod:function(path, mode, dev) {
        // we don't want this in the JS API as it uses mknod to create all nodes.
        switch (mode & 61440) {
          case 32768:
          case 8192:
          case 24576:
          case 4096:
          case 49152:
            break;
          default: return -28;
        }
        FS.mknod(path, mode, dev);
        return 0;
      },doReadlink:function(path, buf, bufsize) {
        if (bufsize <= 0) return -28;
        var ret = FS.readlink(path);
  
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf+len];
        stringToUTF8(ret, buf, bufsize+1);
        // readlink is one of the rare functions that write out a C string, but does never append a null to the output buffer(!)
        // stringToUTF8() always appends a null byte, so restore the character under the null byte after the write.
        HEAP8[buf+len] = endChar;
  
        return len;
      },doAccess:function(path, amode) {
        if (amode & ~7) {
          // need a valid mode
          return -28;
        }
        var node;
        var lookup = FS.lookupPath(path, { follow: true });
        node = lookup.node;
        if (!node) {
          return -44;
        }
        var perms = '';
        if (amode & 4) perms += 'r';
        if (amode & 2) perms += 'w';
        if (amode & 1) perms += 'x';
        if (perms /* otherwise, they've just passed F_OK */ && FS.nodePermissions(node, perms)) {
          return -2;
        }
        return 0;
      },doDup:function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd;
      },doReadv:function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.read(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
          if (curr < len) break; // nothing more to read
        }
        return ret;
      },doWritev:function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(((iov)+(i*8))>>2)];
          var len = HEAP32[(((iov)+(i*8 + 4))>>2)];
          var curr = FS.write(stream, HEAP8,ptr, len, offset);
          if (curr < 0) return -1;
          ret += curr;
        }
        return ret;
      },varargs:0,get:function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(((SYSCALLS.varargs)-(4))>>2)];
        return ret;
      },getStr:function() {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret;
      },getStreamFromFD:function(fd) {
        // TODO: when all syscalls use wasi, can remove the next line
        if (fd === undefined) fd = SYSCALLS.get();
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream;
      },get64:function() {
        var low = SYSCALLS.get(), high = SYSCALLS.get();
        return low;
      },getZero:function() {
        SYSCALLS.get();
      }};function __emscripten_syscall_munmap(addr, len) {
      if (addr === -1 || len === 0) {
        return -28;
      }
      // TODO: support unmmap'ing parts of allocations
      var info = SYSCALLS.mappings[addr];
      if (!info) return 0;
      if (len === info.len) {
        var stream = FS.getStream(info.fd);
        SYSCALLS.doMsync(addr, stream, len, info.flags);
        FS.munmap(stream);
        SYSCALLS.mappings[addr] = null;
        if (info.allocated) {
          _free(info.malloc);
        }
      }
      return 0;
    }function ___syscall91(which, varargs) {SYSCALLS.varargs = varargs;
  try {
   // munmap
      var addr = SYSCALLS.get(), len = SYSCALLS.get();
      return __emscripten_syscall_munmap(addr, len);
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return -e.errno;
  }
  }

  function ___unlock() {}

  
  function getShiftFromSize(size) {
      switch (size) {
          case 1: return 0;
          case 2: return 1;
          case 4: return 2;
          case 8: return 3;
          default:
              throw new TypeError('Unknown type size: ' + size);
      }
    }
  
  
  
  function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
          codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }var embind_charCodes=undefined;function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
          ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    }
  
  
  var awaitingDependencies={};
  
  var registeredTypes={};
  
  var typeDependencies={};
  
  
  
  
  
  
  var char_0=48;
  
  var char_9=57;function makeLegalFunctionName(name) {
      if (undefined === name) {
          return '_unknown';
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, '$');
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
          return '_' + name;
      } else {
          return name;
      }
    }function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      /*jshint evil:true*/
      return new Function(
          "body",
          "return function " + name + "() {\n" +
          "    \"use strict\";" +
          "    return body.apply(this, arguments);\n" +
          "};\n"
      )(body);
    }function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function(message) {
          this.name = errorName;
          this.message = message;
  
          var stack = (new Error(message)).stack;
          if (stack !== undefined) {
              this.stack = this.toString() + '\n' +
                  stack.replace(/^Error(:[^\n]*)?\n/, '');
          }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function() {
          if (this.message === undefined) {
              return this.name;
          } else {
              return this.name + ': ' + this.message;
          }
      };
  
      return errorClass;
    }var BindingError=undefined;function throwBindingError(message) {
      throw new BindingError(message);
    }
  
  
  
  var InternalError=undefined;function throwInternalError(message) {
      throw new InternalError(message);
    }function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
      myTypes.forEach(function(type) {
          typeDependencies[type] = dependentTypes;
      });
  
      function onComplete(typeConverters) {
          var myTypeConverters = getTypeConverters(typeConverters);
          if (myTypeConverters.length !== myTypes.length) {
              throwInternalError('Mismatched type converter count');
          }
          for (var i = 0; i < myTypes.length; ++i) {
              registerType(myTypes[i], myTypeConverters[i]);
          }
      }
  
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function(dt, i) {
          if (registeredTypes.hasOwnProperty(dt)) {
              typeConverters[i] = registeredTypes[dt];
          } else {
              unregisteredTypes.push(dt);
              if (!awaitingDependencies.hasOwnProperty(dt)) {
                  awaitingDependencies[dt] = [];
              }
              awaitingDependencies[dt].push(function() {
                  typeConverters[i] = registeredTypes[dt];
                  ++registered;
                  if (registered === unregisteredTypes.length) {
                      onComplete(typeConverters);
                  }
              });
          }
      });
      if (0 === unregisteredTypes.length) {
          onComplete(typeConverters);
      }
    }function registerType(rawType, registeredInstance, options) {
      options = options || {};
  
      if (!('argPackAdvance' in registeredInstance)) {
          throw new TypeError('registerType registeredInstance requires argPackAdvance');
      }
  
      var name = registeredInstance.name;
      if (!rawType) {
          throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
          if (options.ignoreDuplicateRegistrations) {
              return;
          } else {
              throwBindingError("Cannot register type '" + name + "' twice");
          }
      }
  
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
  
      if (awaitingDependencies.hasOwnProperty(rawType)) {
          var callbacks = awaitingDependencies[rawType];
          delete awaitingDependencies[rawType];
          callbacks.forEach(function(cb) {
              cb();
          });
      }
    }function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
      var shift = getShiftFromSize(size);
  
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(wt) {
              // ambiguous emscripten ABI: sometimes return values are
              // true or false, and sometimes integers (0 or 1)
              return !!wt;
          },
          'toWireType': function(destructors, o) {
              return o ? trueValue : falseValue;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': function(pointer) {
              // TODO: if heap is fixed (like in asm.js) this could be executed outside
              var heap;
              if (size === 1) {
                  heap = HEAP8;
              } else if (size === 2) {
                  heap = HEAP16;
              } else if (size === 4) {
                  heap = HEAP32;
              } else {
                  throw new TypeError("Unknown boolean type size: " + name);
              }
              return this['fromWireType'](heap[pointer >> shift]);
          },
          destructorFunction: null, // This type does not need a destructor
      });
    }

  
  
  
  function ClassHandle_isAliasOf(other) {
      if (!(this instanceof ClassHandle)) {
          return false;
      }
      if (!(other instanceof ClassHandle)) {
          return false;
      }
  
      var leftClass = this.$$.ptrType.registeredClass;
      var left = this.$$.ptr;
      var rightClass = other.$$.ptrType.registeredClass;
      var right = other.$$.ptr;
  
      while (leftClass.baseClass) {
          left = leftClass.upcast(left);
          leftClass = leftClass.baseClass;
      }
  
      while (rightClass.baseClass) {
          right = rightClass.upcast(right);
          rightClass = rightClass.baseClass;
      }
  
      return leftClass === rightClass && left === right;
    }
  
  
  function shallowCopyInternalPointer(o) {
      return {
          count: o.count,
          deleteScheduled: o.deleteScheduled,
          preservePointerOnDelete: o.preservePointerOnDelete,
          ptr: o.ptr,
          ptrType: o.ptrType,
          smartPtr: o.smartPtr,
          smartPtrType: o.smartPtrType,
      };
    }
  
  function throwInstanceAlreadyDeleted(obj) {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + ' instance already deleted');
    }
  
  
  var finalizationGroup=false;
  
  function detachFinalizer(handle) {}
  
  
  function runDestructor($$) {
      if ($$.smartPtr) {
          $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
          $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    }function releaseClassHandle($$) {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
          runDestructor($$);
      }
    }function attachFinalizer(handle) {
      if ('undefined' === typeof FinalizationGroup) {
          attachFinalizer = function (handle) { return handle; };
          return handle;
      }
      // If the running environment has a FinalizationGroup (see
      // https://github.com/tc39/proposal-weakrefs), then attach finalizers
      // for class handles.  We check for the presence of FinalizationGroup
      // at run-time, not build-time.
      finalizationGroup = new FinalizationGroup(function (iter) {
          for (var result = iter.next(); !result.done; result = iter.next()) {
              var $$ = result.value;
              if (!$$.ptr) {
                  console.warn('object already deleted: ' + $$.ptr);
              } else {
                  releaseClassHandle($$);
              }
          }
      });
      attachFinalizer = function(handle) {
          finalizationGroup.register(handle, handle.$$, handle.$$);
          return handle;
      };
      detachFinalizer = function(handle) {
          finalizationGroup.unregister(handle.$$);
      };
      return attachFinalizer(handle);
    }function ClassHandle_clone() {
      if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
      }
  
      if (this.$$.preservePointerOnDelete) {
          this.$$.count.value += 1;
          return this;
      } else {
          var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
              $$: {
                  value: shallowCopyInternalPointer(this.$$),
              }
          }));
  
          clone.$$.count.value += 1;
          clone.$$.deleteScheduled = false;
          return clone;
      }
    }
  
  function ClassHandle_delete() {
      if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
      }
  
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError('Object already scheduled for deletion');
      }
  
      detachFinalizer(this);
      releaseClassHandle(this.$$);
  
      if (!this.$$.preservePointerOnDelete) {
          this.$$.smartPtr = undefined;
          this.$$.ptr = undefined;
      }
    }
  
  function ClassHandle_isDeleted() {
      return !this.$$.ptr;
    }
  
  
  var delayFunction=undefined;
  
  var deletionQueue=[];
  
  function flushPendingDeletes() {
      while (deletionQueue.length) {
          var obj = deletionQueue.pop();
          obj.$$.deleteScheduled = false;
          obj['delete']();
      }
    }function ClassHandle_deleteLater() {
      if (!this.$$.ptr) {
          throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
          throwBindingError('Object already scheduled for deletion');
      }
      deletionQueue.push(this);
      if (deletionQueue.length === 1 && delayFunction) {
          delayFunction(flushPendingDeletes);
      }
      this.$$.deleteScheduled = true;
      return this;
    }function init_ClassHandle() {
      ClassHandle.prototype['isAliasOf'] = ClassHandle_isAliasOf;
      ClassHandle.prototype['clone'] = ClassHandle_clone;
      ClassHandle.prototype['delete'] = ClassHandle_delete;
      ClassHandle.prototype['isDeleted'] = ClassHandle_isDeleted;
      ClassHandle.prototype['deleteLater'] = ClassHandle_deleteLater;
    }function ClassHandle() {
    }
  
  var registeredPointers={};
  
  
  function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
          var prevFunc = proto[methodName];
          // Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
          proto[methodName] = function() {
              // TODO This check can be removed in -O3 level "unsafe" optimizations.
              if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                  throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
              }
              return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
          };
          // Move the previous function into the overload table.
          proto[methodName].overloadTable = [];
          proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
          if (undefined === numArguments || (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])) {
              throwBindingError("Cannot register public name '" + name + "' twice");
          }
  
          // We are exposing a function with the same name as an existing function. Create an overload table and a function selector
          // that routes between the two.
          ensureOverloadTable(Module, name, name);
          if (Module.hasOwnProperty(numArguments)) {
              throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
          }
          // Add the new function into the overload table.
          Module[name].overloadTable[numArguments] = value;
      }
      else {
          Module[name] = value;
          if (undefined !== numArguments) {
              Module[name].numArguments = numArguments;
          }
      }
    }
  
  function RegisteredClass(
      name,
      constructor,
      instancePrototype,
      rawDestructor,
      baseClass,
      getActualType,
      upcast,
      downcast
    ) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
  
  
  
  function upcastPointer(ptr, ptrClass, desiredClass) {
      while (ptrClass !== desiredClass) {
          if (!ptrClass.upcast) {
              throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
          }
          ptr = ptrClass.upcast(ptr);
          ptrClass = ptrClass.baseClass;
      }
      return ptr;
    }function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
          if (this.isReference) {
              throwBindingError('null is not a valid ' + this.name);
          }
          return 0;
      }
  
      if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
          throwBindingError('Cannot pass deleted object as a pointer of type ' + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
          if (this.isReference) {
              throwBindingError('null is not a valid ' + this.name);
          }
  
          if (this.isSmartPointer) {
              ptr = this.rawConstructor();
              if (destructors !== null) {
                  destructors.push(this.rawDestructor, ptr);
              }
              return ptr;
          } else {
              return 0;
          }
      }
  
      if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
          throwBindingError('Cannot pass deleted object as a pointer of type ' + this.name);
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
          throwBindingError('Cannot convert argument of type ' + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + ' to parameter type ' + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
  
      if (this.isSmartPointer) {
          // TODO: this is not strictly true
          // We could support BY_EMVAL conversions from raw pointers to smart pointers
          // because the smart pointer can hold a reference to the handle
          if (undefined === handle.$$.smartPtr) {
              throwBindingError('Passing raw pointer to smart pointer is illegal');
          }
  
          switch (this.sharingPolicy) {
              case 0: // NONE
                  // no upcasting
                  if (handle.$$.smartPtrType === this) {
                      ptr = handle.$$.smartPtr;
                  } else {
                      throwBindingError('Cannot convert argument of type ' + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + ' to parameter type ' + this.name);
                  }
                  break;
  
              case 1: // INTRUSIVE
                  ptr = handle.$$.smartPtr;
                  break;
  
              case 2: // BY_EMVAL
                  if (handle.$$.smartPtrType === this) {
                      ptr = handle.$$.smartPtr;
                  } else {
                      var clonedHandle = handle['clone']();
                      ptr = this.rawShare(
                          ptr,
                          __emval_register(function() {
                              clonedHandle['delete']();
                          })
                      );
                      if (destructors !== null) {
                          destructors.push(this.rawDestructor, ptr);
                      }
                  }
                  break;
  
              default:
                  throwBindingError('Unsupporting sharing policy');
          }
      }
      return ptr;
    }
  
  function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
          if (this.isReference) {
              throwBindingError('null is not a valid ' + this.name);
          }
          return 0;
      }
  
      if (!handle.$$) {
          throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
          throwBindingError('Cannot pass deleted object as a pointer of type ' + this.name);
      }
      if (handle.$$.ptrType.isConst) {
          throwBindingError('Cannot convert argument of type ' + handle.$$.ptrType.name + ' to parameter type ' + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  
  function simpleReadValueFromPointer(pointer) {
      return this['fromWireType'](HEAPU32[pointer >> 2]);
    }
  
  function RegisteredPointer_getPointee(ptr) {
      if (this.rawGetPointee) {
          ptr = this.rawGetPointee(ptr);
      }
      return ptr;
    }
  
  function RegisteredPointer_destructor(ptr) {
      if (this.rawDestructor) {
          this.rawDestructor(ptr);
      }
    }
  
  function RegisteredPointer_deleteObject(handle) {
      if (handle !== null) {
          handle['delete']();
      }
    }
  
  
  function downcastPointer(ptr, ptrClass, desiredClass) {
      if (ptrClass === desiredClass) {
          return ptr;
      }
      if (undefined === desiredClass.baseClass) {
          return null; // no conversion
      }
  
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
          return null;
      }
      return desiredClass.downcast(rv);
    }
  
  
  
  
  function getInheritedInstanceCount() {
      return Object.keys(registeredInstances).length;
    }
  
  function getLiveInheritedInstances() {
      var rv = [];
      for (var k in registeredInstances) {
          if (registeredInstances.hasOwnProperty(k)) {
              rv.push(registeredInstances[k]);
          }
      }
      return rv;
    }
  
  function setDelayFunction(fn) {
      delayFunction = fn;
      if (deletionQueue.length && delayFunction) {
          delayFunction(flushPendingDeletes);
      }
    }function init_embind() {
      Module['getInheritedInstanceCount'] = getInheritedInstanceCount;
      Module['getLiveInheritedInstances'] = getLiveInheritedInstances;
      Module['flushPendingDeletes'] = flushPendingDeletes;
      Module['setDelayFunction'] = setDelayFunction;
    }var registeredInstances={};
  
  function getBasestPointer(class_, ptr) {
      if (ptr === undefined) {
          throwBindingError('ptr should not be undefined');
      }
      while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
      }
      return ptr;
    }function getInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    }
  
  function makeClassHandle(prototype, record) {
      if (!record.ptrType || !record.ptr) {
          throwInternalError('makeClassHandle requires ptr and ptrType');
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
          throwInternalError('Both smartPtrType and smartPtr must be specified');
      }
      record.count = { value: 1 };
      return attachFinalizer(Object.create(prototype, {
          $$: {
              value: record,
          },
      }));
    }function RegisteredPointer_fromWireType(ptr) {
      // ptr is a raw pointer (or a raw smartpointer)
  
      // rawPointer is a maybe-null raw pointer
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
          this.destructor(ptr);
          return null;
      }
  
      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
      if (undefined !== registeredInstance) {
          // JS object has been neutered, time to repopulate it
          if (0 === registeredInstance.$$.count.value) {
              registeredInstance.$$.ptr = rawPointer;
              registeredInstance.$$.smartPtr = ptr;
              return registeredInstance['clone']();
          } else {
              // else, just increment reference count on existing object
              // it already has a reference to the smart pointer
              var rv = registeredInstance['clone']();
              this.destructor(ptr);
              return rv;
          }
      }
  
      function makeDefaultHandle() {
          if (this.isSmartPointer) {
              return makeClassHandle(this.registeredClass.instancePrototype, {
                  ptrType: this.pointeeType,
                  ptr: rawPointer,
                  smartPtrType: this,
                  smartPtr: ptr,
              });
          } else {
              return makeClassHandle(this.registeredClass.instancePrototype, {
                  ptrType: this,
                  ptr: ptr,
              });
          }
      }
  
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
          return makeDefaultHandle.call(this);
      }
  
      var toType;
      if (this.isConst) {
          toType = registeredPointerRecord.constPointerType;
      } else {
          toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(
          rawPointer,
          this.registeredClass,
          toType.registeredClass);
      if (dp === null) {
          return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
              ptrType: toType,
              ptr: dp,
              smartPtrType: this,
              smartPtr: ptr,
          });
      } else {
          return makeClassHandle(toType.registeredClass.instancePrototype, {
              ptrType: toType,
              ptr: dp,
          });
      }
    }function init_RegisteredPointer() {
      RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
      RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
      RegisteredPointer.prototype['argPackAdvance'] = 8;
      RegisteredPointer.prototype['readValueFromPointer'] = simpleReadValueFromPointer;
      RegisteredPointer.prototype['deleteObject'] = RegisteredPointer_deleteObject;
      RegisteredPointer.prototype['fromWireType'] = RegisteredPointer_fromWireType;
    }function RegisteredPointer(
      name,
      registeredClass,
      isReference,
      isConst,
  
      // smart pointer properties
      isSmartPointer,
      pointeeType,
      sharingPolicy,
      rawGetPointee,
      rawConstructor,
      rawShare,
      rawDestructor
    ) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
  
      // smart pointer properties
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
  
      if (!isSmartPointer && registeredClass.baseClass === undefined) {
          if (isConst) {
              this['toWireType'] = constNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
          } else {
              this['toWireType'] = nonConstNoSmartPtrRawPointerToWireType;
              this.destructorFunction = null;
          }
      } else {
          this['toWireType'] = genericPointerToWireType;
          // Here we must leave this.destructorFunction undefined, since whether genericPointerToWireType returns
          // a pointer that needs to be freed up is runtime-dependent, and cannot be evaluated at registration time.
          // TODO: Create an alternative mechanism that allows removing the use of var destructors = []; array in
          //       craftInvokerFunction altogether.
      }
    }
  
  function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
          throwInternalError('Replacing nonexistant public symbol');
      }
      // If there's an overload table for this symbol, replace the symbol in the overload table instead.
      if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
          Module[name].overloadTable[numArguments] = value;
      }
      else {
          Module[name] = value;
          Module[name].argCount = numArguments;
      }
    }
  
  function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);
  
      function makeDynCaller(dynCall) {
          var args = [];
          for (var i = 1; i < signature.length; ++i) {
              args.push('a' + i);
          }
  
          var name = 'dynCall_' + signature + '_' + rawFunction;
          var body = 'return function ' + name + '(' + args.join(', ') + ') {\n';
          body    += '    return dynCall(rawFunction' + (args.length ? ', ' : '') + args.join(', ') + ');\n';
          body    += '};\n';
  
          return (new Function('dynCall', 'rawFunction', body))(dynCall, rawFunction);
      }
  
      var fp;
      if (Module['FUNCTION_TABLE_' + signature] !== undefined) {
          fp = Module['FUNCTION_TABLE_' + signature][rawFunction];
      } else if (typeof FUNCTION_TABLE !== "undefined") {
          fp = FUNCTION_TABLE[rawFunction];
      } else {
          // asm.js does not give direct access to the function tables,
          // and thus we must go through the dynCall interface which allows
          // calling into a signature's function table by pointer value.
          //
          // https://github.com/dherman/asm.js/issues/83
          //
          // This has three main penalties:
          // - dynCall is another function call in the path from JavaScript to C++.
          // - JITs may not predict through the function table indirection at runtime.
          var dc = Module['dynCall_' + signature];
          if (dc === undefined) {
              // We will always enter this branch if the signature
              // contains 'f' and PRECISE_F32 is not enabled.
              //
              // Try again, replacing 'f' with 'd'.
              dc = Module['dynCall_' + signature.replace(/f/g, 'd')];
              if (dc === undefined) {
                  throwBindingError("No dynCall invoker for signature: " + signature);
              }
          }
          fp = makeDynCaller(dc);
      }
  
      if (typeof fp !== "function") {
          throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
      }
      return fp;
    }
  
  
  var UnboundTypeError=undefined;
  
  function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
          if (seen[type]) {
              return;
          }
          if (registeredTypes[type]) {
              return;
          }
          if (typeDependencies[type]) {
              typeDependencies[type].forEach(visit);
              return;
          }
          unboundTypes.push(type);
          seen[type] = true;
      }
      types.forEach(visit);
  
      throw new UnboundTypeError(message + ': ' + unboundTypes.map(getTypeName).join([', ']));
    }function __embind_register_class(
      rawType,
      rawPointerType,
      rawConstPointerType,
      baseClassRawType,
      getActualTypeSignature,
      getActualType,
      upcastSignature,
      upcast,
      downcastSignature,
      downcast,
      name,
      destructorSignature,
      rawDestructor
    ) {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
      if (upcast) {
          upcast = embind__requireFunction(upcastSignature, upcast);
      }
      if (downcast) {
          downcast = embind__requireFunction(downcastSignature, downcast);
      }
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
  
      exposePublicSymbol(legalFunctionName, function() {
          // this code cannot run if baseClassRawType is zero
          throwUnboundTypeError('Cannot construct ' + name + ' due to unbound types', [baseClassRawType]);
      });
  
      whenDependentTypesAreResolved(
          [rawType, rawPointerType, rawConstPointerType],
          baseClassRawType ? [baseClassRawType] : [],
          function(base) {
              base = base[0];
  
              var baseClass;
              var basePrototype;
              if (baseClassRawType) {
                  baseClass = base.registeredClass;
                  basePrototype = baseClass.instancePrototype;
              } else {
                  basePrototype = ClassHandle.prototype;
              }
  
              var constructor = createNamedFunction(legalFunctionName, function() {
                  if (Object.getPrototypeOf(this) !== instancePrototype) {
                      throw new BindingError("Use 'new' to construct " + name);
                  }
                  if (undefined === registeredClass.constructor_body) {
                      throw new BindingError(name + " has no accessible constructor");
                  }
                  var body = registeredClass.constructor_body[arguments.length];
                  if (undefined === body) {
                      throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
                  }
                  return body.apply(this, arguments);
              });
  
              var instancePrototype = Object.create(basePrototype, {
                  constructor: { value: constructor },
              });
  
              constructor.prototype = instancePrototype;
  
              var registeredClass = new RegisteredClass(
                  name,
                  constructor,
                  instancePrototype,
                  rawDestructor,
                  baseClass,
                  getActualType,
                  upcast,
                  downcast);
  
              var referenceConverter = new RegisteredPointer(
                  name,
                  registeredClass,
                  true,
                  false,
                  false);
  
              var pointerConverter = new RegisteredPointer(
                  name + '*',
                  registeredClass,
                  false,
                  false,
                  false);
  
              var constPointerConverter = new RegisteredPointer(
                  name + ' const*',
                  registeredClass,
                  false,
                  true,
                  false);
  
              registeredPointers[rawType] = {
                  pointerType: pointerConverter,
                  constPointerType: constPointerConverter
              };
  
              replacePublicSymbol(legalFunctionName, constructor);
  
              return [referenceConverter, pointerConverter, constPointerConverter];
          }
      );
    }

  
  function heap32VectorToArray(count, firstElement) {
      var array = [];
      for (var i = 0; i < count; i++) {
          array.push(HEAP32[(firstElement >> 2) + i]);
      }
      return array;
    }
  
  function runDestructors(destructors) {
      while (destructors.length) {
          var ptr = destructors.pop();
          var del = destructors.pop();
          del(ptr);
      }
    }function __embind_register_class_constructor(
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor
    ) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
  
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
          classType = classType[0];
          var humanName = 'constructor ' + classType.name;
  
          if (undefined === classType.registeredClass.constructor_body) {
              classType.registeredClass.constructor_body = [];
          }
          if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
              throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount-1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
          }
          classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
              throwUnboundTypeError('Cannot construct ' + classType.name + ' due to unbound types', rawArgTypes);
          };
  
          whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
              classType.registeredClass.constructor_body[argCount - 1] = function constructor_body() {
                  if (arguments.length !== argCount - 1) {
                      throwBindingError(humanName + ' called with ' + arguments.length + ' arguments, expected ' + (argCount-1));
                  }
                  var destructors = [];
                  var args = new Array(argCount);
                  args[0] = rawConstructor;
                  for (var i = 1; i < argCount; ++i) {
                      args[i] = argTypes[i]['toWireType'](destructors, arguments[i - 1]);
                  }
  
                  var ptr = invoker.apply(null, args);
                  runDestructors(destructors);
  
                  return argTypes[0]['fromWireType'](ptr);
              };
              return [];
          });
          return [];
      });
    }

  
  
  function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
          throw new TypeError('new_ called with constructor type ' + typeof(constructor) + " which is not a function");
      }
  
      /*
       * Previously, the following line was just:
  
       function dummy() {};
  
       * Unfortunately, Chrome was preserving 'dummy' as the object's name, even though at creation, the 'dummy' has the
       * correct constructor name.  Thus, objects created with IMVU.new would show up in the debugger as 'dummy', which
       * isn't very helpful.  Using IMVU.createNamedFunction addresses the issue.  Doublely-unfortunately, there's no way
       * to write a test for this behavior.  -NRD 2013.02.22
       */
      var dummy = createNamedFunction(constructor.name || 'unknownFunctionName', function(){});
      dummy.prototype = constructor.prototype;
      var obj = new dummy;
  
      var r = constructor.apply(obj, argumentList);
      return (r instanceof Object) ? r : obj;
    }function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
      // humanName: a human-readable string name for the function to be generated.
      // argTypes: An array that contains the embind type objects for all types in the function signature.
      //    argTypes[0] is the type object for the function return value.
      //    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
      //    argTypes[2...] are the actual function parameters.
      // classType: The embind type object for the class to be bound, or null if this is not a method of a class.
      // cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
      // cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
      var argCount = argTypes.length;
  
      if (argCount < 2) {
          throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
  
      var isClassMethodFunc = (argTypes[1] !== null && classType !== null);
  
      // Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
  // TODO: This omits argument count check - enable only at -O3 or similar.
  //    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
  //       return FUNCTION_TABLE[fn];
  //    }
  
  
      // Determine if we need to use a dynamic stack to store the destructors for the function parameters.
      // TODO: Remove this completely once all function invokers are being dynamically generated.
      var needsDestructorStack = false;
  
      for(var i = 1; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here.
          if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) { // The type does not define a destructor function - must use dynamic stack
              needsDestructorStack = true;
              break;
          }
      }
  
      var returns = (argTypes[0].name !== "void");
  
      var argsList = "";
      var argsListWired = "";
      for(var i = 0; i < argCount - 2; ++i) {
          argsList += (i!==0?", ":"")+"arg"+i;
          argsListWired += (i!==0?", ":"")+"arg"+i+"Wired";
      }
  
      var invokerFnBody =
          "return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n" +
          "if (arguments.length !== "+(argCount - 2)+") {\n" +
              "throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount - 2)+" args!');\n" +
          "}\n";
  
  
      if (needsDestructorStack) {
          invokerFnBody +=
              "var destructors = [];\n";
      }
  
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
      var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
  
  
      if (isClassMethodFunc) {
          invokerFnBody += "var thisWired = classParam.toWireType("+dtorStack+", this);\n";
      }
  
      for(var i = 0; i < argCount - 2; ++i) {
          invokerFnBody += "var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";
          args1.push("argType"+i);
          args2.push(argTypes[i+2]);
      }
  
      if (isClassMethodFunc) {
          argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }
  
      invokerFnBody +=
          (returns?"var rv = ":"") + "invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";
  
      if (needsDestructorStack) {
          invokerFnBody += "runDestructors(destructors);\n";
      } else {
          for(var i = isClassMethodFunc?1:2; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
              var paramName = (i === 1 ? "thisWired" : ("arg"+(i - 2)+"Wired"));
              if (argTypes[i].destructorFunction !== null) {
                  invokerFnBody += paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";
                  args1.push(paramName+"_dtor");
                  args2.push(argTypes[i].destructorFunction);
              }
          }
      }
  
      if (returns) {
          invokerFnBody += "var ret = retType.fromWireType(rv);\n" +
                           "return ret;\n";
      } else {
      }
      invokerFnBody += "}\n";
  
      args1.push(invokerFnBody);
  
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }function __embind_register_class_function(
      rawClassType,
      methodName,
      argCount,
      rawArgTypesAddr, // [ReturnType, ThisType, Args...]
      invokerSignature,
      rawInvoker,
      context,
      isPureVirtual
    ) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
  
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
          classType = classType[0];
          var humanName = classType.name + '.' + methodName;
  
          if (isPureVirtual) {
              classType.registeredClass.pureVirtualFunctions.push(methodName);
          }
  
          function unboundTypesHandler() {
              throwUnboundTypeError('Cannot call ' + humanName + ' due to unbound types', rawArgTypes);
          }
  
          var proto = classType.registeredClass.instancePrototype;
          var method = proto[methodName];
          if (undefined === method || (undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2)) {
              // This is the first overload to be registered, OR we are replacing a function in the base class with a function in the derived class.
              unboundTypesHandler.argCount = argCount - 2;
              unboundTypesHandler.className = classType.name;
              proto[methodName] = unboundTypesHandler;
          } else {
              // There was an existing function with the same name registered. Set up a function overload routing table.
              ensureOverloadTable(proto, methodName, humanName);
              proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
          }
  
          whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
  
              var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
  
              // Replace the initial unbound-handler-stub function with the appropriate member function, now that all types
              // are resolved. If multiple overloads are registered for this function, the function goes into an overload table.
              if (undefined === proto[methodName].overloadTable) {
                  // Set argCount in case an overload is registered later
                  memberFunction.argCount = argCount - 2;
                  proto[methodName] = memberFunction;
              } else {
                  proto[methodName].overloadTable[argCount - 2] = memberFunction;
              }
  
              return [];
          });
          return [];
      });
    }

  
  
  var emval_free_list=[];
  
  var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
          emval_handle_array[handle] = undefined;
          emval_free_list.push(handle);
      }
    }
  
  
  
  function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
              ++count;
          }
      }
      return count;
    }
  
  function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
          if (emval_handle_array[i] !== undefined) {
              return emval_handle_array[i];
          }
      }
      return null;
    }function init_emval() {
      Module['count_emval_handles'] = count_emval_handles;
      Module['get_first_emval'] = get_first_emval;
    }function __emval_register(value) {
  
      switch(value){
        case undefined :{ return 1; }
        case null :{ return 2; }
        case true :{ return 3; }
        case false :{ return 4; }
        default:{
          var handle = emval_free_list.length ?
              emval_free_list.pop() :
              emval_handle_array.length;
  
          emval_handle_array[handle] = {refcount: 1, value: value};
          return handle;
          }
        }
    }function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(handle) {
              var rv = emval_handle_array[handle].value;
              __emval_decref(handle);
              return rv;
          },
          'toWireType': function(destructors, value) {
              return __emval_register(value);
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: null, // This type does not need a destructor
  
          // TODO: do we need a deleteObject here?  write a test where
          // emval is passed into JS via an interface
      });
    }

  
  function _embind_repr(v) {
      if (v === null) {
          return 'null';
      }
      var t = typeof v;
      if (t === 'object' || t === 'array' || t === 'function') {
          return v.toString();
      } else {
          return '' + v;
      }
    }
  
  function floatReadValueFromPointer(name, shift) {
      switch (shift) {
          case 2: return function(pointer) {
              return this['fromWireType'](HEAPF32[pointer >> 2]);
          };
          case 3: return function(pointer) {
              return this['fromWireType'](HEAPF64[pointer >> 3]);
          };
          default:
              throw new TypeError("Unknown float type: " + name);
      }
    }function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              return value;
          },
          'toWireType': function(destructors, value) {
              // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
              // avoid the following if() and assume value is of proper type.
              if (typeof value !== "number" && typeof value !== "boolean") {
                  throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
              }
              return value;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': floatReadValueFromPointer(name, shift),
          destructorFunction: null, // This type does not need a destructor
      });
    }

  
  function integerReadValueFromPointer(name, shift, signed) {
      // integers are quite common, so generate very specialized functions
      switch (shift) {
          case 0: return signed ?
              function readS8FromPointer(pointer) { return HEAP8[pointer]; } :
              function readU8FromPointer(pointer) { return HEAPU8[pointer]; };
          case 1: return signed ?
              function readS16FromPointer(pointer) { return HEAP16[pointer >> 1]; } :
              function readU16FromPointer(pointer) { return HEAPU16[pointer >> 1]; };
          case 2: return signed ?
              function readS32FromPointer(pointer) { return HEAP32[pointer >> 2]; } :
              function readU32FromPointer(pointer) { return HEAPU32[pointer >> 2]; };
          default:
              throw new TypeError("Unknown integer type: " + name);
      }
    }function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
      name = readLatin1String(name);
      if (maxRange === -1) { // LLVM doesn't have signed and unsigned 32-bit types, so u32 literals come out as 'i32 -1'. Always treat those as max u32.
          maxRange = 4294967295;
      }
  
      var shift = getShiftFromSize(size);
  
      var fromWireType = function(value) {
          return value;
      };
  
      if (minRange === 0) {
          var bitshift = 32 - 8*size;
          fromWireType = function(value) {
              return (value << bitshift) >>> bitshift;
          };
      }
  
      var isUnsignedType = (name.indexOf('unsigned') != -1);
  
      registerType(primitiveType, {
          name: name,
          'fromWireType': fromWireType,
          'toWireType': function(destructors, value) {
              // todo: Here we have an opportunity for -O3 level "unsafe" optimizations: we could
              // avoid the following two if()s and assume value is of proper type.
              if (typeof value !== "number" && typeof value !== "boolean") {
                  throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
              }
              if (value < minRange || value > maxRange) {
                  throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ', ' + maxRange + ']!');
              }
              return isUnsignedType ? (value >>> 0) : (value | 0);
          },
          'argPackAdvance': 8,
          'readValueFromPointer': integerReadValueFromPointer(name, shift, minRange !== 0),
          destructorFunction: null, // This type does not need a destructor
      });
    }

  function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
          Int8Array,
          Uint8Array,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
      ];
  
      var TA = typeMapping[dataTypeIndex];
  
      function decodeMemoryView(handle) {
          handle = handle >> 2;
          var heap = HEAPU32;
          var size = heap[handle]; // in elements
          var data = heap[handle + 1]; // byte offset into emscripten heap
          return new TA(heap['buffer'], data, size);
      }
  
      name = readLatin1String(name);
      registerType(rawType, {
          name: name,
          'fromWireType': decodeMemoryView,
          'argPackAdvance': 8,
          'readValueFromPointer': decodeMemoryView,
      }, {
          ignoreDuplicateRegistrations: true,
      });
    }

  function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8
      //process only std::string bindings with UTF8 support, in contrast to e.g. std::basic_string<unsigned char>
      = (name === "std::string");
  
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              var length = HEAPU32[value >> 2];
  
              var str;
              if(stdStringIsUTF8) {
                  //ensure null termination at one-past-end byte if not present yet
                  var endChar = HEAPU8[value + 4 + length];
                  var endCharSwap = 0;
                  if(endChar != 0)
                  {
                    endCharSwap = endChar;
                    HEAPU8[value + 4 + length] = 0;
                  }
  
                  var decodeStartPtr = value + 4;
                  //looping here to support possible embedded '0' bytes
                  for (var i = 0; i <= length; ++i) {
                    var currentBytePtr = value + 4 + i;
                    if(HEAPU8[currentBytePtr] == 0)
                    {
                      var stringSegment = UTF8ToString(decodeStartPtr);
                      if(str === undefined)
                        str = stringSegment;
                      else
                      {
                        str += String.fromCharCode(0);
                        str += stringSegment;
                      }
                      decodeStartPtr = currentBytePtr + 1;
                    }
                  }
  
                  if(endCharSwap != 0)
                    HEAPU8[value + 4 + length] = endCharSwap;
              } else {
                  var a = new Array(length);
                  for (var i = 0; i < length; ++i) {
                      a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
                  }
                  str = a.join('');
              }
  
              _free(value);
              
              return str;
          },
          'toWireType': function(destructors, value) {
              if (value instanceof ArrayBuffer) {
                  value = new Uint8Array(value);
              }
              
              var getLength;
              var valueIsOfTypeString = (typeof value === 'string');
  
              if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                  throwBindingError('Cannot pass non-string to std::string');
              }
              if (stdStringIsUTF8 && valueIsOfTypeString) {
                  getLength = function() {return lengthBytesUTF8(value);};
              } else {
                  getLength = function() {return value.length;};
              }
              
              // assumes 4-byte alignment
              var length = getLength();
              var ptr = _malloc(4 + length + 1);
              HEAPU32[ptr >> 2] = length;
  
              if (stdStringIsUTF8 && valueIsOfTypeString) {
                  stringToUTF8(value, ptr + 4, length + 1);
              } else {
                  if(valueIsOfTypeString) {
                      for (var i = 0; i < length; ++i) {
                          var charCode = value.charCodeAt(i);
                          if (charCode > 255) {
                              _free(ptr);
                              throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
                          }
                          HEAPU8[ptr + 4 + i] = charCode;
                      }
                  } else {
                      for (var i = 0; i < length; ++i) {
                          HEAPU8[ptr + 4 + i] = value[i];
                      }
                  }
              }
  
              if (destructors !== null) {
                  destructors.push(_free, ptr);
              }
              return ptr;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: function(ptr) { _free(ptr); },
      });
    }

  function __embind_register_std_wstring(rawType, charSize, name) {
      // nb. do not cache HEAPU16 and HEAPU32, they may be destroyed by emscripten_resize_heap().
      name = readLatin1String(name);
      var getHeap, shift;
      if (charSize === 2) {
          getHeap = function() { return HEAPU16; };
          shift = 1;
      } else if (charSize === 4) {
          getHeap = function() { return HEAPU32; };
          shift = 2;
      }
      registerType(rawType, {
          name: name,
          'fromWireType': function(value) {
              var HEAP = getHeap();
              var length = HEAPU32[value >> 2];
              var a = new Array(length);
              var start = (value + 4) >> shift;
              for (var i = 0; i < length; ++i) {
                  a[i] = String.fromCharCode(HEAP[start + i]);
              }
              _free(value);
              return a.join('');
          },
          'toWireType': function(destructors, value) {
              // assumes 4-byte alignment
              var length = value.length;
              var ptr = _malloc(4 + length * charSize);
              var HEAP = getHeap();
              HEAPU32[ptr >> 2] = length;
              var start = (ptr + 4) >> shift;
              for (var i = 0; i < length; ++i) {
                  HEAP[start + i] = value.charCodeAt(i);
              }
              if (destructors !== null) {
                  destructors.push(_free, ptr);
              }
              return ptr;
          },
          'argPackAdvance': 8,
          'readValueFromPointer': simpleReadValueFromPointer,
          destructorFunction: function(ptr) { _free(ptr); },
      });
    }

  function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
          isVoid: true, // void return values can be optimized out sometimes
          name: name,
          'argPackAdvance': 0,
          'fromWireType': function() {
              return undefined;
          },
          'toWireType': function(destructors, o) {
              // TODO: assert if anything else is given?
              return undefined;
          },
      });
    }

  function _abort() {
      abort();
    }

  function _emscripten_get_heap_size() {
      return HEAP8.length;
    }

  function _emscripten_get_sbrk_ptr() {
      return 23168;
    }

  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
    }

  
  function abortOnCannotGrowMemory(requestedSize) {
      abort('OOM');
    }function _emscripten_resize_heap(requestedSize) {
      abortOnCannotGrowMemory(requestedSize);
    }

  
  
  var ENV={};function _emscripten_get_environ() {
      if (!_emscripten_get_environ.strings) {
        // Default values.
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          // Browser language detection #8751
          'LANG': ((typeof navigator === 'object' && navigator.languages && navigator.languages[0]) || 'C').replace('-', '_') + '.UTF-8',
          '_': thisProgram
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(x + '=' + env[x]);
        }
        _emscripten_get_environ.strings = strings;
      }
      return _emscripten_get_environ.strings;
    }function _environ_get(__environ, environ_buf) {
      var strings = _emscripten_get_environ();
      var bufSize = 0;
      strings.forEach(function(string, i) {
        var ptr = environ_buf + bufSize;
        HEAP32[(((__environ)+(i * 4))>>2)]=ptr;
        writeAsciiToMemory(string, ptr);
        bufSize += string.length + 1;
      });
      return 0;
    }

  function _environ_sizes_get(penviron_count, penviron_buf_size) {
      var strings = _emscripten_get_environ();
      HEAP32[((penviron_count)>>2)]=strings.length;
      var bufSize = 0;
      strings.forEach(function(string) {
        bufSize += string.length + 1;
      });
      HEAP32[((penviron_buf_size)>>2)]=bufSize;
      return 0;
    }

  function _fd_close(fd) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_read(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doReadv(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var HIGH_OFFSET = 0x100000000; // 2^32
      // use an unsigned operator on low and shift high by 32-bits
      var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
  
      var DOUBLE_LIMIT = 0x20000000000000; // 2^53
      // we also check for equality since DOUBLE_LIMIT + 1 == DOUBLE_LIMIT
      if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
        return -61;
      }
  
      FS.llseek(stream, offset, whence);
      (tempI64 = [stream.position>>>0,(tempDouble=stream.position,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((newOffset)>>2)]=tempI64[0],HEAP32[(((newOffset)+(4))>>2)]=tempI64[1]);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  function _fd_write(fd, iov, iovcnt, pnum) {try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = SYSCALLS.doWritev(stream, iov, iovcnt);
      HEAP32[((pnum)>>2)]=num
      return 0;
    } catch (e) {
    if (typeof FS === 'undefined' || !(e instanceof FS.ErrnoError)) abort(e);
    return e.errno;
  }
  }

  
  function _memcpy(dest, src, num) {
      dest = dest|0; src = src|0; num = num|0;
      var ret = 0;
      var aligned_dest_end = 0;
      var block_aligned_dest_end = 0;
      var dest_end = 0;
      // Test against a benchmarked cutoff limit for when HEAPU8.set() becomes faster to use.
      if ((num|0) >= 8192) {
        _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
        return dest|0;
      }
  
      ret = dest|0;
      dest_end = (dest + num)|0;
      if ((dest&3) == (src&3)) {
        // The initial unaligned < 4-byte front.
        while (dest & 3) {
          if ((num|0) == 0) return ret|0;
          HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
          dest = (dest+1)|0;
          src = (src+1)|0;
          num = (num-1)|0;
        }
        aligned_dest_end = (dest_end & -4)|0;
        block_aligned_dest_end = (aligned_dest_end - 64)|0;
        while ((dest|0) <= (block_aligned_dest_end|0) ) {
          HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
          HEAP32[(((dest)+(4))>>2)]=((HEAP32[(((src)+(4))>>2)])|0);
          HEAP32[(((dest)+(8))>>2)]=((HEAP32[(((src)+(8))>>2)])|0);
          HEAP32[(((dest)+(12))>>2)]=((HEAP32[(((src)+(12))>>2)])|0);
          HEAP32[(((dest)+(16))>>2)]=((HEAP32[(((src)+(16))>>2)])|0);
          HEAP32[(((dest)+(20))>>2)]=((HEAP32[(((src)+(20))>>2)])|0);
          HEAP32[(((dest)+(24))>>2)]=((HEAP32[(((src)+(24))>>2)])|0);
          HEAP32[(((dest)+(28))>>2)]=((HEAP32[(((src)+(28))>>2)])|0);
          HEAP32[(((dest)+(32))>>2)]=((HEAP32[(((src)+(32))>>2)])|0);
          HEAP32[(((dest)+(36))>>2)]=((HEAP32[(((src)+(36))>>2)])|0);
          HEAP32[(((dest)+(40))>>2)]=((HEAP32[(((src)+(40))>>2)])|0);
          HEAP32[(((dest)+(44))>>2)]=((HEAP32[(((src)+(44))>>2)])|0);
          HEAP32[(((dest)+(48))>>2)]=((HEAP32[(((src)+(48))>>2)])|0);
          HEAP32[(((dest)+(52))>>2)]=((HEAP32[(((src)+(52))>>2)])|0);
          HEAP32[(((dest)+(56))>>2)]=((HEAP32[(((src)+(56))>>2)])|0);
          HEAP32[(((dest)+(60))>>2)]=((HEAP32[(((src)+(60))>>2)])|0);
          dest = (dest+64)|0;
          src = (src+64)|0;
        }
        while ((dest|0) < (aligned_dest_end|0) ) {
          HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
          dest = (dest+4)|0;
          src = (src+4)|0;
        }
      } else {
        // In the unaligned copy case, unroll a bit as well.
        aligned_dest_end = (dest_end - 4)|0;
        while ((dest|0) < (aligned_dest_end|0) ) {
          HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
          HEAP8[(((dest)+(1))>>0)]=((HEAP8[(((src)+(1))>>0)])|0);
          HEAP8[(((dest)+(2))>>0)]=((HEAP8[(((src)+(2))>>0)])|0);
          HEAP8[(((dest)+(3))>>0)]=((HEAP8[(((src)+(3))>>0)])|0);
          dest = (dest+4)|0;
          src = (src+4)|0;
        }
      }
      // The remaining unaligned < 4 byte tail.
      while ((dest|0) < (dest_end|0)) {
        HEAP8[((dest)>>0)]=((HEAP8[((src)>>0)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
      }
      return ret|0;
    }

  function _memset(ptr, value, num) {
      ptr = ptr|0; value = value|0; num = num|0;
      var end = 0, aligned_end = 0, block_aligned_end = 0, value4 = 0;
      end = (ptr + num)|0;
  
      value = value & 0xff;
      if ((num|0) >= 67 /* 64 bytes for an unrolled loop + 3 bytes for unaligned head*/) {
        while ((ptr&3) != 0) {
          HEAP8[((ptr)>>0)]=value;
          ptr = (ptr+1)|0;
        }
  
        aligned_end = (end & -4)|0;
        value4 = value | (value << 8) | (value << 16) | (value << 24);
  
        block_aligned_end = (aligned_end - 64)|0;
  
        while((ptr|0) <= (block_aligned_end|0)) {
          HEAP32[((ptr)>>2)]=value4;
          HEAP32[(((ptr)+(4))>>2)]=value4;
          HEAP32[(((ptr)+(8))>>2)]=value4;
          HEAP32[(((ptr)+(12))>>2)]=value4;
          HEAP32[(((ptr)+(16))>>2)]=value4;
          HEAP32[(((ptr)+(20))>>2)]=value4;
          HEAP32[(((ptr)+(24))>>2)]=value4;
          HEAP32[(((ptr)+(28))>>2)]=value4;
          HEAP32[(((ptr)+(32))>>2)]=value4;
          HEAP32[(((ptr)+(36))>>2)]=value4;
          HEAP32[(((ptr)+(40))>>2)]=value4;
          HEAP32[(((ptr)+(44))>>2)]=value4;
          HEAP32[(((ptr)+(48))>>2)]=value4;
          HEAP32[(((ptr)+(52))>>2)]=value4;
          HEAP32[(((ptr)+(56))>>2)]=value4;
          HEAP32[(((ptr)+(60))>>2)]=value4;
          ptr = (ptr + 64)|0;
        }
  
        while ((ptr|0) < (aligned_end|0) ) {
          HEAP32[((ptr)>>2)]=value4;
          ptr = (ptr+4)|0;
        }
      }
      // The remaining bytes.
      while ((ptr|0) < (end|0)) {
        HEAP8[((ptr)>>0)]=value;
        ptr = (ptr+1)|0;
      }
      return (end-num)|0;
    }

  function _setTempRet0($i) {
      setTempRet0(($i) | 0);
    }

  
  
  function __isLeapYear(year) {
        return year%4 === 0 && (year%100 !== 0 || year%400 === 0);
    }
  
  function __arraySum(array, index) {
      var sum = 0;
      for (var i = 0; i <= index; sum += array[i++]);
      return sum;
    }
  
  
  var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];
  
  var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date, days) {
      var newDate = new Date(date.getTime());
      while(days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
  
        if (days > daysInCurrentMonth-newDate.getDate()) {
          // we spill over to next month
          days -= (daysInCurrentMonth-newDate.getDate()+1);
          newDate.setDate(1);
          if (currentMonth < 11) {
            newDate.setMonth(currentMonth+1)
          } else {
            newDate.setMonth(0);
            newDate.setFullYear(newDate.getFullYear()+1);
          }
        } else {
          // we stay in current month
          newDate.setDate(newDate.getDate()+days);
          return newDate;
        }
      }
  
      return newDate;
    }function _strftime(s, maxsize, format, tm) {
      // size_t strftime(char *restrict s, size_t maxsize, const char *restrict format, const struct tm *restrict timeptr);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/strftime.html
  
      var tm_zone = HEAP32[(((tm)+(40))>>2)];
  
      var date = {
        tm_sec: HEAP32[((tm)>>2)],
        tm_min: HEAP32[(((tm)+(4))>>2)],
        tm_hour: HEAP32[(((tm)+(8))>>2)],
        tm_mday: HEAP32[(((tm)+(12))>>2)],
        tm_mon: HEAP32[(((tm)+(16))>>2)],
        tm_year: HEAP32[(((tm)+(20))>>2)],
        tm_wday: HEAP32[(((tm)+(24))>>2)],
        tm_yday: HEAP32[(((tm)+(28))>>2)],
        tm_isdst: HEAP32[(((tm)+(32))>>2)],
        tm_gmtoff: HEAP32[(((tm)+(36))>>2)],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ''
      };
  
      var pattern = UTF8ToString(format);
  
      // expand format
      var EXPANSION_RULES_1 = {
        '%c': '%a %b %d %H:%M:%S %Y',     // Replaced by the locale's appropriate date and time representation - e.g., Mon Aug  3 14:02:01 2013
        '%D': '%m/%d/%y',                 // Equivalent to %m / %d / %y
        '%F': '%Y-%m-%d',                 // Equivalent to %Y - %m - %d
        '%h': '%b',                       // Equivalent to %b
        '%r': '%I:%M:%S %p',              // Replaced by the time in a.m. and p.m. notation
        '%R': '%H:%M',                    // Replaced by the time in 24-hour notation
        '%T': '%H:%M:%S',                 // Replaced by the time
        '%x': '%m/%d/%y',                 // Replaced by the locale's appropriate date representation
        '%X': '%H:%M:%S',                 // Replaced by the locale's appropriate time representation
        // Modified Conversion Specifiers
        '%Ec': '%c',                      // Replaced by the locale's alternative appropriate date and time representation.
        '%EC': '%C',                      // Replaced by the name of the base year (period) in the locale's alternative representation.
        '%Ex': '%m/%d/%y',                // Replaced by the locale's alternative date representation.
        '%EX': '%H:%M:%S',                // Replaced by the locale's alternative time representation.
        '%Ey': '%y',                      // Replaced by the offset from %EC (year only) in the locale's alternative representation.
        '%EY': '%Y',                      // Replaced by the full alternative year representation.
        '%Od': '%d',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading zeros if there is any alternative symbol for zero; otherwise, with leading <space> characters.
        '%Oe': '%e',                      // Replaced by the day of the month, using the locale's alternative numeric symbols, filled as needed with leading <space> characters.
        '%OH': '%H',                      // Replaced by the hour (24-hour clock) using the locale's alternative numeric symbols.
        '%OI': '%I',                      // Replaced by the hour (12-hour clock) using the locale's alternative numeric symbols.
        '%Om': '%m',                      // Replaced by the month using the locale's alternative numeric symbols.
        '%OM': '%M',                      // Replaced by the minutes using the locale's alternative numeric symbols.
        '%OS': '%S',                      // Replaced by the seconds using the locale's alternative numeric symbols.
        '%Ou': '%u',                      // Replaced by the weekday as a number in the locale's alternative representation (Monday=1).
        '%OU': '%U',                      // Replaced by the week number of the year (Sunday as the first day of the week, rules corresponding to %U ) using the locale's alternative numeric symbols.
        '%OV': '%V',                      // Replaced by the week number of the year (Monday as the first day of the week, rules corresponding to %V ) using the locale's alternative numeric symbols.
        '%Ow': '%w',                      // Replaced by the number of the weekday (Sunday=0) using the locale's alternative numeric symbols.
        '%OW': '%W',                      // Replaced by the week number of the year (Monday as the first day of the week) using the locale's alternative numeric symbols.
        '%Oy': '%y',                      // Replaced by the year (offset from %C ) using the locale's alternative numeric symbols.
      };
      for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_1[rule]);
      }
  
      var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
      function leadingSomething(value, digits, character) {
        var str = typeof value === 'number' ? value.toString() : (value || '');
        while (str.length < digits) {
          str = character[0]+str;
        }
        return str;
      }
  
      function leadingNulls(value, digits) {
        return leadingSomething(value, digits, '0');
      }
  
      function compareByDay(date1, date2) {
        function sgn(value) {
          return value < 0 ? -1 : (value > 0 ? 1 : 0);
        }
  
        var compare;
        if ((compare = sgn(date1.getFullYear()-date2.getFullYear())) === 0) {
          if ((compare = sgn(date1.getMonth()-date2.getMonth())) === 0) {
            compare = sgn(date1.getDate()-date2.getDate());
          }
        }
        return compare;
      }
  
      function getFirstWeekStartDate(janFourth) {
          switch (janFourth.getDay()) {
            case 0: // Sunday
              return new Date(janFourth.getFullYear()-1, 11, 29);
            case 1: // Monday
              return janFourth;
            case 2: // Tuesday
              return new Date(janFourth.getFullYear(), 0, 3);
            case 3: // Wednesday
              return new Date(janFourth.getFullYear(), 0, 2);
            case 4: // Thursday
              return new Date(janFourth.getFullYear(), 0, 1);
            case 5: // Friday
              return new Date(janFourth.getFullYear()-1, 11, 31);
            case 6: // Saturday
              return new Date(janFourth.getFullYear()-1, 11, 30);
          }
      }
  
      function getWeekBasedYear(date) {
          var thisDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
          var janFourthNextYear = new Date(thisDate.getFullYear()+1, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            // this date is after the start of the first week of this year
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
              return thisDate.getFullYear()+1;
            } else {
              return thisDate.getFullYear();
            }
          } else {
            return thisDate.getFullYear()-1;
          }
      }
  
      var EXPANSION_RULES_2 = {
        '%a': function(date) {
          return WEEKDAYS[date.tm_wday].substring(0,3);
        },
        '%A': function(date) {
          return WEEKDAYS[date.tm_wday];
        },
        '%b': function(date) {
          return MONTHS[date.tm_mon].substring(0,3);
        },
        '%B': function(date) {
          return MONTHS[date.tm_mon];
        },
        '%C': function(date) {
          var year = date.tm_year+1900;
          return leadingNulls((year/100)|0,2);
        },
        '%d': function(date) {
          return leadingNulls(date.tm_mday, 2);
        },
        '%e': function(date) {
          return leadingSomething(date.tm_mday, 2, ' ');
        },
        '%g': function(date) {
          // %g, %G, and %V give values according to the ISO 8601:2000 standard week-based year.
          // In this system, weeks begin on a Monday and week 1 of the year is the week that includes
          // January 4th, which is also the week that includes the first Thursday of the year, and
          // is also the first week that contains at least four days in the year.
          // If the first Monday of January is the 2nd, 3rd, or 4th, the preceding days are part of
          // the last week of the preceding year; thus, for Saturday 2nd January 1999,
          // %G is replaced by 1998 and %V is replaced by 53. If December 29th, 30th,
          // or 31st is a Monday, it and any following days are part of week 1 of the following year.
          // Thus, for Tuesday 30th December 1997, %G is replaced by 1998 and %V is replaced by 01.
  
          return getWeekBasedYear(date).toString().substring(2);
        },
        '%G': function(date) {
          return getWeekBasedYear(date);
        },
        '%H': function(date) {
          return leadingNulls(date.tm_hour, 2);
        },
        '%I': function(date) {
          var twelveHour = date.tm_hour;
          if (twelveHour == 0) twelveHour = 12;
          else if (twelveHour > 12) twelveHour -= 12;
          return leadingNulls(twelveHour, 2);
        },
        '%j': function(date) {
          // Day of the year (001-366)
          return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon-1), 3);
        },
        '%m': function(date) {
          return leadingNulls(date.tm_mon+1, 2);
        },
        '%M': function(date) {
          return leadingNulls(date.tm_min, 2);
        },
        '%n': function() {
          return '\n';
        },
        '%p': function(date) {
          if (date.tm_hour >= 0 && date.tm_hour < 12) {
            return 'AM';
          } else {
            return 'PM';
          }
        },
        '%S': function(date) {
          return leadingNulls(date.tm_sec, 2);
        },
        '%t': function() {
          return '\t';
        },
        '%u': function(date) {
          return date.tm_wday || 7;
        },
        '%U': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Sunday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year+1900, 0, 1);
          var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7-janFirst.getDay());
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Sunday?
          if (compareByDay(firstSunday, endDate) < 0) {
            // calculate difference in days between first Sunday and endDate
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstSundayUntilEndJanuary = 31-firstSunday.getDate();
            var days = firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
  
          return compareByDay(firstSunday, janFirst) === 0 ? '01': '00';
        },
        '%V': function(date) {
          // Replaced by the week number of the year (Monday as the first day of the week)
          // as a decimal number [01,53]. If the week containing 1 January has four
          // or more days in the new year, then it is considered week 1.
          // Otherwise, it is the last week of the previous year, and the next week is week 1.
          // Both January 4th and the first Thursday of January are always in week 1. [ tm_year, tm_wday, tm_yday]
          var janFourthThisYear = new Date(date.tm_year+1900, 0, 4);
          var janFourthNextYear = new Date(date.tm_year+1901, 0, 4);
  
          var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
          var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
  
          var endDate = __addDays(new Date(date.tm_year+1900, 0, 1), date.tm_yday);
  
          if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
            // if given date is before this years first week, then it belongs to the 53rd week of last year
            return '53';
          }
  
          if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
            // if given date is after next years first week, then it belongs to the 01th week of next year
            return '01';
          }
  
          // given date is in between CW 01..53 of this calendar year
          var daysDifference;
          if (firstWeekStartThisYear.getFullYear() < date.tm_year+1900) {
            // first CW of this year starts last year
            daysDifference = date.tm_yday+32-firstWeekStartThisYear.getDate()
          } else {
            // first CW of this year starts this year
            daysDifference = date.tm_yday+1-firstWeekStartThisYear.getDate();
          }
          return leadingNulls(Math.ceil(daysDifference/7), 2);
        },
        '%w': function(date) {
          return date.tm_wday;
        },
        '%W': function(date) {
          // Replaced by the week number of the year as a decimal number [00,53].
          // The first Monday of January is the first day of week 1;
          // days in the new year before this are in week 0. [ tm_year, tm_wday, tm_yday]
          var janFirst = new Date(date.tm_year, 0, 1);
          var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7-janFirst.getDay()+1);
          var endDate = new Date(date.tm_year+1900, date.tm_mon, date.tm_mday);
  
          // is target date after the first Monday?
          if (compareByDay(firstMonday, endDate) < 0) {
            var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth()-1)-31;
            var firstMondayUntilEndJanuary = 31-firstMonday.getDate();
            var days = firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();
            return leadingNulls(Math.ceil(days/7), 2);
          }
          return compareByDay(firstMonday, janFirst) === 0 ? '01': '00';
        },
        '%y': function(date) {
          // Replaced by the last two digits of the year as a decimal number [00,99]. [ tm_year]
          return (date.tm_year+1900).toString().substring(2);
        },
        '%Y': function(date) {
          // Replaced by the year as a decimal number (for example, 1997). [ tm_year]
          return date.tm_year+1900;
        },
        '%z': function(date) {
          // Replaced by the offset from UTC in the ISO 8601:2000 standard format ( +hhmm or -hhmm ).
          // For example, "-0430" means 4 hours 30 minutes behind UTC (west of Greenwich).
          var off = date.tm_gmtoff;
          var ahead = off >= 0;
          off = Math.abs(off) / 60;
          // convert from minutes into hhmm format (which means 60 minutes = 100 units)
          off = (off / 60)*100 + (off % 60);
          return (ahead ? '+' : '-') + String("0000" + off).slice(-4);
        },
        '%Z': function(date) {
          return date.tm_zone;
        },
        '%%': function() {
          return '%';
        }
      };
      for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
          pattern = pattern.replace(new RegExp(rule, 'g'), EXPANSION_RULES_2[rule](date));
        }
      }
  
      var bytes = intArrayFromString(pattern, false);
      if (bytes.length > maxsize) {
        return 0;
      }
  
      writeArrayToMemory(bytes, s);
      return bytes.length-1;
    }function _strftime_l(s, maxsize, format, tm) {
      return _strftime(s, maxsize, format, tm); // no locale support yet
    }
FS.staticInit();;
embind_init_charCodes();
BindingError = Module['BindingError'] = extendError(Error, 'BindingError');;
InternalError = Module['InternalError'] = extendError(Error, 'InternalError');;
init_ClassHandle();
init_RegisteredPointer();
init_embind();;
UnboundTypeError = Module['UnboundTypeError'] = extendError(Error, 'UnboundTypeError');;
init_emval();;
var ASSERTIONS = false;

// Copyright 2017 The Emscripten Authors.  All rights reserved.
// Emscripten is available under two separate licenses, the MIT license and the
// University of Illinois/NCSA Open Source License.  Both these licenses can be
// found in the LICENSE file.

/** @type {function(string, boolean=, number=)} */
function intArrayFromString(stringy, dontAddNull, length) {
  var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
  var u8array = new Array(len);
  var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
  if (dontAddNull) u8array.length = numBytesWritten;
  return u8array;
}

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      if (ASSERTIONS) {
        assert(false, 'Character code ' + chr + ' (' + String.fromCharCode(chr) + ')  at offset ' + i + ' not in 0x00-0xFF.');
      }
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}


// Copied from https://github.com/strophe/strophejs/blob/e06d027/src/polyfills.js#L149

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

/**
 * Decodes a base64 string.
 * @param {String} input The string to decode.
 */
var decodeBase64 = typeof atob === 'function' ? atob : function (input) {
  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  var output = '';
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 !== 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output = output + String.fromCharCode(chr3);
    }
  } while (i < input.length);
  return output;
};

// Converts a string of base64 into a byte array.
// Throws error on invalid input.
function intArrayFromBase64(s) {
  if (typeof ENVIRONMENT_IS_NODE === 'boolean' && ENVIRONMENT_IS_NODE) {
    var buf;
    try {
      buf = Buffer.from(s, 'base64');
    } catch (_) {
      buf = new Buffer(s, 'base64');
    }
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  try {
    var decoded = decodeBase64(s);
    var bytes = new Uint8Array(decoded.length);
    for (var i = 0 ; i < decoded.length ; ++i) {
      bytes[i] = decoded.charCodeAt(i);
    }
    return bytes;
  } catch (_) {
    throw new Error('Converting base64 string to bytes failed.');
  }
}

// If filename is a base64 data URI, parses and returns data (Buffer on node,
// Uint8Array otherwise). If filename is not a base64 data URI, returns undefined.
function tryParseAsDataURI(filename) {
  if (!isDataURI(filename)) {
    return;
  }

  return intArrayFromBase64(filename.slice(dataURIPrefix.length));
}


// ASM_LIBRARY EXTERN PRIMITIVES: Int8Array,Int32Array

var asmGlobalArg = {};
var asmLibraryArg = { "__cxa_atexit": ___cxa_atexit, "__lock": ___lock, "__map_file": ___map_file, "__syscall91": ___syscall91, "__unlock": ___unlock, "_embind_register_bool": __embind_register_bool, "_embind_register_class": __embind_register_class, "_embind_register_class_constructor": __embind_register_class_constructor, "_embind_register_class_function": __embind_register_class_function, "_embind_register_emval": __embind_register_emval, "_embind_register_float": __embind_register_float, "_embind_register_integer": __embind_register_integer, "_embind_register_memory_view": __embind_register_memory_view, "_embind_register_std_string": __embind_register_std_string, "_embind_register_std_wstring": __embind_register_std_wstring, "_embind_register_void": __embind_register_void, "abort": _abort, "emscripten_get_sbrk_ptr": _emscripten_get_sbrk_ptr, "emscripten_memcpy_big": _emscripten_memcpy_big, "emscripten_resize_heap": _emscripten_resize_heap, "environ_get": _environ_get, "environ_sizes_get": _environ_sizes_get, "fd_close": _fd_close, "fd_read": _fd_read, "fd_seek": _fd_seek, "fd_write": _fd_write, "memory": wasmMemory, "setTempRet0": _setTempRet0, "strftime_l": _strftime_l, "table": wasmTable };
var asm = createWasm();
var ___wasm_call_ctors = Module["___wasm_call_ctors"] = asm["__wasm_call_ctors"];
var ___errno_location = Module["___errno_location"] = asm["__errno_location"];
var _setThrew = Module["_setThrew"] = asm["setThrew"];
var _free = Module["_free"] = asm["free"];
var _malloc = Module["_malloc"] = asm["malloc"];
var ___getTypeName = Module["___getTypeName"] = asm["__getTypeName"];
var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = asm["__embind_register_native_and_builtin_types"];
var stackSave = Module["stackSave"] = asm["stackSave"];
var stackAlloc = Module["stackAlloc"] = asm["stackAlloc"];
var stackRestore = Module["stackRestore"] = asm["stackRestore"];
var __growWasmMemory = Module["__growWasmMemory"] = asm["__growWasmMemory"];
var dynCall_ii = Module["dynCall_ii"] = asm["dynCall_ii"];
var dynCall_vi = Module["dynCall_vi"] = asm["dynCall_vi"];
var dynCall_iii = Module["dynCall_iii"] = asm["dynCall_iii"];
var dynCall_viiii = Module["dynCall_viiii"] = asm["dynCall_viiii"];
var dynCall_viiiii = Module["dynCall_viiiii"] = asm["dynCall_viiiii"];
var dynCall_vii = Module["dynCall_vii"] = asm["dynCall_vii"];
var dynCall_iiii = Module["dynCall_iiii"] = asm["dynCall_iiii"];
var dynCall_viijii = Module["dynCall_viijii"] = asm["dynCall_viijii"];
var dynCall_jiji = Module["dynCall_jiji"] = asm["dynCall_jiji"];
var dynCall_iidiiii = Module["dynCall_iidiiii"] = asm["dynCall_iidiiii"];
var dynCall_iiiii = Module["dynCall_iiiii"] = asm["dynCall_iiiii"];
var dynCall_iiiiii = Module["dynCall_iiiiii"] = asm["dynCall_iiiiii"];
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = asm["dynCall_iiiiiiiii"];
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = asm["dynCall_iiiiiii"];
var dynCall_iiiiij = Module["dynCall_iiiiij"] = asm["dynCall_iiiiij"];
var dynCall_iiiiid = Module["dynCall_iiiiid"] = asm["dynCall_iiiiid"];
var dynCall_iiiiijj = Module["dynCall_iiiiijj"] = asm["dynCall_iiiiijj"];
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = asm["dynCall_iiiiiiii"];
var dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = asm["dynCall_iiiiiijj"];
var dynCall_viiiiii = Module["dynCall_viiiiii"] = asm["dynCall_viiiiii"];
var dynCall_v = Module["dynCall_v"] = asm["dynCall_v"];



// === Auto-generated postamble setup entry stuff ===

Module['asm'] = asm;
















































































var calledRun;


/**
 * @constructor
 * @this {ExitStatus}
 */
function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
}

var calledMain = false;


dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
};





/** @type {function(Array=)} */
function run(args) {
  args = args || arguments_;

  if (runDependencies > 0) {
    return;
  }


  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    if (calledRun) return;
    calledRun = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();


    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
}
Module['run'] = run;


function exit(status, implicit) {

  // if this is just main exit-ing implicitly, and the status is 0, then we
  // don't need to do anything here and can just leave. if the status is
  // non-zero, though, then we need to report it.
  // (we may have warned about this earlier, if a situation justifies doing so)
  if (implicit && noExitRuntime && status === 0) {
    return;
  }

  if (noExitRuntime) {
  } else {

    ABORT = true;
    EXITSTATUS = status;

    exitRuntime();

    if (Module['onExit']) Module['onExit'](status);
  }

  quit_(status, new ExitStatus(status));
}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}


  noExitRuntime = true;

run();





// {{MODULE_ADDITIONS}}



/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

// EXPORT_ES6 option does not work as described at
// https://github.com/kripken/emscripten/issues/6284, so we have to
// manually add this by '--post-js' setting when the Emscripten compilation.
export default Module;

