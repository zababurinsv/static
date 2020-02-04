var Module;Module||(Module=(void 0!==Module?Module:null)||{});var moduleOverrides={};for(var key in Module)Module.hasOwnProperty(key)&&(moduleOverrides[key]=Module[key]);var ENVIRONMENT_IS_WEB=!1,ENVIRONMENT_IS_WORKER=!1,ENVIRONMENT_IS_NODE=!1,ENVIRONMENT_IS_SHELL=!1,nodeFS,nodePath;if(Module.ENVIRONMENT)if("WEB"===Module.ENVIRONMENT)ENVIRONMENT_IS_WEB=!0;else if("WORKER"===Module.ENVIRONMENT)ENVIRONMENT_IS_WORKER=!0;else if("NODE"===Module.ENVIRONMENT)ENVIRONMENT_IS_NODE=!0;else{if("SHELL"!==Module.ENVIRONMENT)throw new Error("The provided Module['ENVIRONMENT'] value is not valid. It must be one of: WEB|WORKER|NODE|SHELL.");ENVIRONMENT_IS_SHELL=!0}else ENVIRONMENT_IS_WEB="object"==typeof window,ENVIRONMENT_IS_WORKER="function"==typeof importScripts,ENVIRONMENT_IS_NODE="object"==typeof process&&"function"==typeof require&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER,ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;if(ENVIRONMENT_IS_NODE)Module.print||(Module.print=console.log),Module.printErr||(Module.printErr=console.warn),Module.read=function(e,r){nodeFS||(nodeFS=require("fs")),nodePath||(nodePath=require("path")),e=nodePath.normalize(e);var t=nodeFS.readFileSync(e);return r?t:t.toString()},Module.readBinary=function(e){var r=Module.read(e,!0);return r.buffer||(r=new Uint8Array(r)),assert(r.buffer),r},Module.load=function(e){globalEval(read(e))},Module.thisProgram||(process.argv.length>1?Module.thisProgram=process.argv[1].replace(/\\/g,"/"):Module.thisProgram="unknown-program"),Module.arguments=process.argv.slice(2),"undefined"!=typeof module&&(module.exports=Module),process.on("uncaughtException",function(e){if(!(e instanceof ExitStatus))throw e}),Module.inspect=function(){return"[Emscripten Module object]"};else if(ENVIRONMENT_IS_SHELL)Module.print||(Module.print=print),"undefined"!=typeof printErr&&(Module.printErr=printErr),"undefined"!=typeof read?Module.read=read:Module.read=function(){throw"no read() available"},Module.readBinary=function(e){if("function"==typeof readbuffer)return new Uint8Array(readbuffer(e));var r=read(e,"binary");return assert("object"==typeof r),r},"undefined"!=typeof scriptArgs?Module.arguments=scriptArgs:"undefined"!=typeof arguments&&(Module.arguments=arguments),"function"==typeof quit&&(Module.quit=function(e,r){quit(e)});else{if(!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER)throw"Unknown runtime environment. Where are we?";if(Module.read=function(e){var r=new XMLHttpRequest;return r.open("GET",e,!1),r.send(null),r.responseText},ENVIRONMENT_IS_WORKER&&(Module.readBinary=function(e){var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffer",r.send(null),r.response}),Module.readAsync=function(e,r,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=function(){200==n.status||0==n.status&&n.response?r(n.response):t()},n.onerror=t,n.send(null)},"undefined"!=typeof arguments&&(Module.arguments=arguments),"undefined"!=typeof console)Module.print||(Module.print=function(e){console.log(e)}),Module.printErr||(Module.printErr=function(e){console.warn(e)});else{var TRY_USE_DUMP=!1;Module.print||(Module.print=TRY_USE_DUMP&&"undefined"!=typeof dump?function(e){dump(e)}:function(e){})}ENVIRONMENT_IS_WORKER&&(Module.load=importScripts),void 0===Module.setWindowTitle&&(Module.setWindowTitle=function(e){document.title=e})}function globalEval(e){eval.call(null,e)}for(var key in!Module.load&&Module.read&&(Module.load=function(e){globalEval(Module.read(e))}),Module.print||(Module.print=function(){}),Module.printErr||(Module.printErr=Module.print),Module.arguments||(Module.arguments=[]),Module.thisProgram||(Module.thisProgram="./this.program"),Module.quit||(Module.quit=function(e,r){throw r}),Module.print=Module.print,Module.printErr=Module.printErr,Module.preRun=[],Module.postRun=[],moduleOverrides)moduleOverrides.hasOwnProperty(key)&&(Module[key]=moduleOverrides[key]);moduleOverrides=void 0;var Runtime={setTempRet0:function(e){return tempRet0=e,e},getTempRet0:function(){return tempRet0},stackSave:function(){return STACKTOP},stackRestore:function(e){STACKTOP=e},getNativeTypeSize:function(e){switch(e){case"i1":case"i8":return 1;case"i16":return 2;case"i32":return 4;case"i64":return 8;case"float":return 4;case"double":return 8;default:if("*"===e[e.length-1])return Runtime.QUANTUM_SIZE;if("i"===e[0]){var r=parseInt(e.substr(1));return assert(r%8==0),r/8}return 0}},getNativeFieldSize:function(e){return Math.max(Runtime.getNativeTypeSize(e),Runtime.QUANTUM_SIZE)},STACK_ALIGN:16,prepVararg:function(e,r){return"double"===r||"i64"===r?7&e&&(assert(4==(7&e)),e+=4):assert(0==(3&e)),e},getAlignSize:function(e,r,t){return t||"i64"!=e&&"double"!=e?e?Math.min(r||(e?Runtime.getNativeFieldSize(e):0),Runtime.QUANTUM_SIZE):Math.min(r,8):8},dynCall:function(e,r,t){return t&&t.length?Module["dynCall_"+e].apply(null,[r].concat(t)):Module["dynCall_"+e].call(null,r)},functionPointers:[],addFunction:function(e){for(var r=0;r<Runtime.functionPointers.length;r++)if(!Runtime.functionPointers[r])return Runtime.functionPointers[r]=e,2*(1+r);throw"Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."},removeFunction:function(e){Runtime.functionPointers[(e-2)/2]=null},warnOnce:function(e){Runtime.warnOnce.shown||(Runtime.warnOnce.shown={}),Runtime.warnOnce.shown[e]||(Runtime.warnOnce.shown[e]=1,Module.printErr(e))},funcWrappers:{},getFuncWrapper:function(e,r){assert(r),Runtime.funcWrappers[r]||(Runtime.funcWrappers[r]={});var t=Runtime.funcWrappers[r];return t[e]||(1===r.length?t[e]=function(){return Runtime.dynCall(r,e)}:2===r.length?t[e]=function(t){return Runtime.dynCall(r,e,[t])}:t[e]=function(){return Runtime.dynCall(r,e,Array.prototype.slice.call(arguments))}),t[e]},getCompilerSetting:function(e){throw"You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"},stackAlloc:function(e){var r=STACKTOP;return STACKTOP=(STACKTOP=STACKTOP+e|0)+15&-16,r},staticAlloc:function(e){var r=STATICTOP;return STATICTOP=(STATICTOP=STATICTOP+e|0)+15&-16,r},dynamicAlloc:function(e){var r=HEAP32[DYNAMICTOP_PTR>>2],t=-16&(r+e+15|0);if((HEAP32[DYNAMICTOP_PTR>>2]=t,t>=TOTAL_MEMORY)&&!enlargeMemory())return HEAP32[DYNAMICTOP_PTR>>2]=r,0;return r},alignMemory:function(e,r){return e=Math.ceil(e/(r||16))*(r||16)},makeBigInt:function(e,r,t){return t?+(e>>>0)+4294967296*+(r>>>0):+(e>>>0)+4294967296*+(0|r)},GLOBAL_BASE:1024,QUANTUM_SIZE:4,__dummy__:0};Module.Runtime=Runtime;var ABORT=0,EXITSTATUS=0,cwrap,ccall;function assert(e,r){e||abort("Assertion failed: "+r)}function getCFunc(ident){var func=Module["_"+ident];if(!func)try{func=eval("_"+ident)}catch(e){}return assert(func,"Cannot call unknown function "+ident+" (perhaps LLVM optimizations or closure removed it?)"),func}function setValue(e,r,t,n){switch("*"===(t=t||"i8").charAt(t.length-1)&&(t="i32"),t){case"i1":case"i8":HEAP8[e>>0]=r;break;case"i16":HEAP16[e>>1]=r;break;case"i32":HEAP32[e>>2]=r;break;case"i64":tempI64=[r>>>0,(tempDouble=r,+Math_abs(tempDouble)>=1?tempDouble>0?(0|Math_min(+Math_floor(tempDouble/4294967296),4294967295))>>>0:~~+Math_ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[e>>2]=tempI64[0],HEAP32[e+4>>2]=tempI64[1];break;case"float":HEAPF32[e>>2]=r;break;case"double":HEAPF64[e>>3]=r;break;default:abort("invalid type for setValue: "+t)}}function getValue(e,r,t){switch("*"===(r=r||"i8").charAt(r.length-1)&&(r="i32"),r){case"i1":case"i8":return HEAP8[e>>0];case"i16":return HEAP16[e>>1];case"i32":case"i64":return HEAP32[e>>2];case"float":return HEAPF32[e>>2];case"double":return HEAPF64[e>>3];default:abort("invalid type for setValue: "+r)}return null}!function(){var JSfuncs={stackSave:function(){Runtime.stackSave()},stackRestore:function(){Runtime.stackRestore()},arrayToC:function(e){var r=Runtime.stackAlloc(e.length);return writeArrayToMemory(e,r),r},stringToC:function(e){var r=0;if(null!=e&&0!==e){var t=1+(e.length<<2);stringToUTF8(e,r=Runtime.stackAlloc(t),t)}return r}},toC={string:JSfuncs.stringToC,array:JSfuncs.arrayToC};ccall=function(e,r,t,n,o){var a=getCFunc(e),u=[],i=0;if(n)for(var l=0;l<n.length;l++){var s=toC[t[l]];s?(0===i&&(i=Runtime.stackSave()),u[l]=s(n[l])):u[l]=n[l]}var d=a.apply(null,u);if("string"===r&&(d=Pointer_stringify(d)),0!==i){if(o&&o.async)return void EmterpreterAsync.asyncFinalizers.push(function(){Runtime.stackRestore(i)});Runtime.stackRestore(i)}return d};var sourceRegex=/^function\s*[a-zA-Z$_0-9]*\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/;function parseJSFunc(e){var r=e.toString().match(sourceRegex).slice(1);return{arguments:r[0],body:r[1],returnValue:r[2]}}var JSsource=null;function ensureJSsource(){if(!JSsource)for(var e in JSsource={},JSfuncs)JSfuncs.hasOwnProperty(e)&&(JSsource[e]=parseJSFunc(JSfuncs[e]))}cwrap=function cwrap(ident,returnType,argTypes){argTypes=argTypes||[];var cfunc=getCFunc(ident),numericArgs=argTypes.every(function(e){return"number"===e}),numericRet="string"!==returnType;if(numericRet&&numericArgs)return cfunc;var argNames=argTypes.map(function(e,r){return"$"+r}),funcstr="(function("+argNames.join(",")+") {",nargs=argTypes.length;if(!numericArgs){ensureJSsource(),funcstr+="var stack = "+JSsource.stackSave.body+";";for(var i=0;i<nargs;i++){var arg=argNames[i],type=argTypes[i];if("number"!==type){var convertCode=JSsource[type+"ToC"];funcstr+="var "+convertCode.arguments+" = "+arg+";",funcstr+=convertCode.body+";",funcstr+=arg+"=("+convertCode.returnValue+");"}}}var cfuncname=parseJSFunc(function(){return cfunc}).returnValue;if(funcstr+="var ret = "+cfuncname+"("+argNames.join(",")+");",!numericRet){var strgfy=parseJSFunc(function(){return Pointer_stringify}).returnValue;funcstr+="ret = "+strgfy+"(ret);"}return numericArgs||(ensureJSsource(),funcstr+=JSsource.stackRestore.body.replace("()","(stack)")+";"),funcstr+="return ret})",eval(funcstr)}}(),Module.ccall=ccall,Module.cwrap=cwrap,Module.setValue=setValue,Module.getValue=getValue;var ALLOC_NORMAL=0,ALLOC_STACK=1,ALLOC_STATIC=2,ALLOC_DYNAMIC=3,ALLOC_NONE=4;function allocate(e,r,t,n){var o,a;"number"==typeof e?(o=!0,a=e):(o=!1,a=e.length);var u,i="string"==typeof r?r:null;if(u=t==ALLOC_NONE?n:["function"==typeof _malloc?_malloc:Runtime.staticAlloc,Runtime.stackAlloc,Runtime.staticAlloc,Runtime.dynamicAlloc][void 0===t?ALLOC_STATIC:t](Math.max(a,i?1:r.length)),o){var l;n=u;for(assert(0==(3&u)),l=u+(-4&a);n<l;n+=4)HEAP32[n>>2]=0;for(l=u+a;n<l;)HEAP8[n++>>0]=0;return u}if("i8"===i)return e.subarray||e.slice?HEAPU8.set(e,u):HEAPU8.set(new Uint8Array(e),u),u;for(var s,d,c,f=0;f<a;){var M=e[f];"function"==typeof M&&(M=Runtime.getFunctionIndex(M)),0!==(s=i||r[f])?("i64"==s&&(s="i32"),setValue(u+f,M,s),c!==s&&(d=Runtime.getNativeTypeSize(s),c=s),f+=d):f++}return u}function getMemory(e){return staticSealed?runtimeInitialized?_malloc(e):Runtime.dynamicAlloc(e):Runtime.staticAlloc(e)}function Pointer_stringify(e,r){if(0===r||!e)return"";for(var t,n=0,o=0;n|=t=HEAPU8[e+o>>0],(0!=t||r)&&(o++,!r||o!=r););r||(r=o);var a="";if(n<128){for(var u;r>0;)u=String.fromCharCode.apply(String,HEAPU8.subarray(e,e+Math.min(r,1024))),a=a?a+u:u,e+=1024,r-=1024;return a}return Module.UTF8ToString(e)}function AsciiToString(e){for(var r="";;){var t=HEAP8[e++>>0];if(!t)return r;r+=String.fromCharCode(t)}}function stringToAscii(e,r){return writeAsciiToMemory(e,r,!1)}Module.ALLOC_NORMAL=ALLOC_NORMAL,Module.ALLOC_STACK=ALLOC_STACK,Module.ALLOC_STATIC=ALLOC_STATIC,Module.ALLOC_DYNAMIC=ALLOC_DYNAMIC,Module.ALLOC_NONE=ALLOC_NONE,Module.allocate=allocate,Module.getMemory=getMemory,Module.Pointer_stringify=Pointer_stringify,Module.AsciiToString=AsciiToString,Module.stringToAscii=stringToAscii;var UTF8Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function UTF8ArrayToString(e,r){for(var t=r;e[t];)++t;if(t-r>16&&e.subarray&&UTF8Decoder)return UTF8Decoder.decode(e.subarray(r,t));for(var n,o,a,u,i,l="";;){if(!(n=e[r++]))return l;if(128&n)if(o=63&e[r++],192!=(224&n))if(a=63&e[r++],224==(240&n)?n=(15&n)<<12|o<<6|a:(u=63&e[r++],240==(248&n)?n=(7&n)<<18|o<<12|a<<6|u:(i=63&e[r++],n=248==(252&n)?(3&n)<<24|o<<18|a<<12|u<<6|i:(1&n)<<30|o<<24|a<<18|u<<12|i<<6|63&e[r++])),n<65536)l+=String.fromCharCode(n);else{var s=n-65536;l+=String.fromCharCode(55296|s>>10,56320|1023&s)}else l+=String.fromCharCode((31&n)<<6|o);else l+=String.fromCharCode(n)}}function UTF8ToString(e){return UTF8ArrayToString(HEAPU8,e)}function stringToUTF8Array(e,r,t,n){if(!(n>0))return 0;for(var o=t,a=t+n-1,u=0;u<e.length;++u){var i=e.charCodeAt(u);if(i>=55296&&i<=57343&&(i=65536+((1023&i)<<10)|1023&e.charCodeAt(++u)),i<=127){if(t>=a)break;r[t++]=i}else if(i<=2047){if(t+1>=a)break;r[t++]=192|i>>6,r[t++]=128|63&i}else if(i<=65535){if(t+2>=a)break;r[t++]=224|i>>12,r[t++]=128|i>>6&63,r[t++]=128|63&i}else if(i<=2097151){if(t+3>=a)break;r[t++]=240|i>>18,r[t++]=128|i>>12&63,r[t++]=128|i>>6&63,r[t++]=128|63&i}else if(i<=67108863){if(t+4>=a)break;r[t++]=248|i>>24,r[t++]=128|i>>18&63,r[t++]=128|i>>12&63,r[t++]=128|i>>6&63,r[t++]=128|63&i}else{if(t+5>=a)break;r[t++]=252|i>>30,r[t++]=128|i>>24&63,r[t++]=128|i>>18&63,r[t++]=128|i>>12&63,r[t++]=128|i>>6&63,r[t++]=128|63&i}}return r[t]=0,t-o}function stringToUTF8(e,r,t){return stringToUTF8Array(e,HEAPU8,r,t)}function lengthBytesUTF8(e){for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n>=55296&&n<=57343&&(n=65536+((1023&n)<<10)|1023&e.charCodeAt(++t)),n<=127?++r:r+=n<=2047?2:n<=65535?3:n<=2097151?4:n<=67108863?5:6}return r}Module.UTF8ArrayToString=UTF8ArrayToString,Module.UTF8ToString=UTF8ToString,Module.stringToUTF8Array=stringToUTF8Array,Module.stringToUTF8=stringToUTF8,Module.lengthBytesUTF8=lengthBytesUTF8;var UTF16Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf-16le"):void 0;function demangle(e){var r=Module.___cxa_demangle||Module.__cxa_demangle;if(r){try{var t=e.substr(1),n=lengthBytesUTF8(t)+1,o=_malloc(n);stringToUTF8(t,o,n);var a=_malloc(4),u=r(o,0,0,a);if(0===getValue(a,"i32")&&u)return Pointer_stringify(u)}catch(e){}finally{o&&_free(o),a&&_free(a),u&&_free(u)}return e}return Runtime.warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"),e}function demangleAll(e){return e.replace(/__Z[\w\d_]+/g,function(e){var r=demangle(e);return e===r?e:e+" ["+r+"]"})}function jsStackTrace(){var e=new Error;if(!e.stack){try{throw new Error(0)}catch(r){e=r}if(!e.stack)return"(no stack trace available)"}return e.stack.toString()}function stackTrace(){var e=jsStackTrace();return Module.extraStackTrace&&(e+="\n"+Module.extraStackTrace()),demangleAll(e)}Module.stackTrace=stackTrace;var WASM_PAGE_SIZE=65536,ASMJS_PAGE_SIZE=16777216,MIN_TOTAL_MEMORY=16777216,HEAP,buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64,STATIC_BASE,STATICTOP,staticSealed,STACK_BASE,STACKTOP,STACK_MAX,DYNAMIC_BASE,DYNAMICTOP_PTR,byteLength;function alignUp(e,r){return e%r>0&&(e+=r-e%r),e}function updateGlobalBuffer(e){Module.buffer=buffer=e}function updateGlobalBufferViews(){Module.HEAP8=HEAP8=new Int8Array(buffer),Module.HEAP16=HEAP16=new Int16Array(buffer),Module.HEAP32=HEAP32=new Int32Array(buffer),Module.HEAPU8=HEAPU8=new Uint8Array(buffer),Module.HEAPU16=HEAPU16=new Uint16Array(buffer),Module.HEAPU32=HEAPU32=new Uint32Array(buffer),Module.HEAPF32=HEAPF32=new Float32Array(buffer),Module.HEAPF64=HEAPF64=new Float64Array(buffer)}function abortOnCannotGrowMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+TOTAL_MEMORY+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}function enlargeMemory(){var e=Module.usingWasm?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE,r=2147483648-e;if(HEAP32[DYNAMICTOP_PTR>>2]>r)return!1;for(TOTAL_MEMORY=Math.max(TOTAL_MEMORY,MIN_TOTAL_MEMORY);TOTAL_MEMORY<HEAP32[DYNAMICTOP_PTR>>2];)TOTAL_MEMORY=TOTAL_MEMORY<=536870912?alignUp(2*TOTAL_MEMORY,e):Math.min(alignUp((3*TOTAL_MEMORY+2147483648)/4,e),r);var t=Module.reallocBuffer(TOTAL_MEMORY);return!(!t||t.byteLength!=TOTAL_MEMORY)&&(updateGlobalBuffer(t),updateGlobalBufferViews(),!0)}STATIC_BASE=STATICTOP=STACK_BASE=STACKTOP=STACK_MAX=DYNAMIC_BASE=DYNAMICTOP_PTR=0,staticSealed=!1,Module.reallocBuffer||(Module.reallocBuffer=function(e){var r;try{if(ArrayBuffer.transfer)r=ArrayBuffer.transfer(buffer,e);else{var t=HEAP8;r=new ArrayBuffer(e),new Int8Array(r).set(t)}}catch(e){return!1}return!!_emscripten_replace_memory(r)&&r});try{byteLength=Function.prototype.call.bind(Object.getOwnPropertyDescriptor(ArrayBuffer.prototype,"byteLength").get),byteLength(new ArrayBuffer(4))}catch(e){byteLength=function(e){return e.byteLength}}var TOTAL_STACK=Module.TOTAL_STACK||5242880,TOTAL_MEMORY=Module.TOTAL_MEMORY||16777216;function getTotalMemory(){return TOTAL_MEMORY}if(TOTAL_MEMORY<TOTAL_STACK&&Module.printErr("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")"),Module.buffer?buffer=Module.buffer:"object"==typeof WebAssembly&&"function"==typeof WebAssembly.Memory?(Module.wasmMemory=new WebAssembly.Memory({initial:TOTAL_MEMORY/WASM_PAGE_SIZE}),buffer=Module.wasmMemory.buffer):buffer=new ArrayBuffer(TOTAL_MEMORY),updateGlobalBufferViews(),HEAP32[0]=1668509029,HEAP16[1]=25459,115!==HEAPU8[2]||99!==HEAPU8[3])throw"Runtime error: expected the system to be little-endian!";function callRuntimeCallbacks(e){for(;e.length>0;){var r=e.shift();if("function"!=typeof r){var t=r.func;"number"==typeof t?void 0===r.arg?Module.dynCall_v(t):Module.dynCall_vi(t,r.arg):t(void 0===r.arg?null:r.arg)}else r()}}Module.HEAP=HEAP,Module.buffer=buffer,Module.HEAP8=HEAP8,Module.HEAP16=HEAP16,Module.HEAP32=HEAP32,Module.HEAPU8=HEAPU8,Module.HEAPU16=HEAPU16,Module.HEAPU32=HEAPU32,Module.HEAPF32=HEAPF32,Module.HEAPF64=HEAPF64;var __ATPRERUN__=[],__ATINIT__=[],__ATMAIN__=[],__ATEXIT__=[],__ATPOSTRUN__=[],runtimeInitialized=!1,runtimeExited=!1;function preRun(){if(Module.preRun)for("function"==typeof Module.preRun&&(Module.preRun=[Module.preRun]);Module.preRun.length;)addOnPreRun(Module.preRun.shift());callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){runtimeInitialized||(runtimeInitialized=!0,callRuntimeCallbacks(__ATINIT__))}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){callRuntimeCallbacks(__ATEXIT__),runtimeExited=!0}function postRun(){if(Module.postRun)for("function"==typeof Module.postRun&&(Module.postRun=[Module.postRun]);Module.postRun.length;)addOnPostRun(Module.postRun.shift());callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(e){__ATPRERUN__.unshift(e)}function addOnInit(e){__ATINIT__.unshift(e)}function addOnPreMain(e){__ATMAIN__.unshift(e)}function addOnExit(e){__ATEXIT__.unshift(e)}function addOnPostRun(e){__ATPOSTRUN__.unshift(e)}function intArrayFromString(e,r,t){var n=t>0?t:lengthBytesUTF8(e)+1,o=new Array(n),a=stringToUTF8Array(e,o,0,o.length);return r&&(o.length=a),o}function intArrayToString(e){for(var r=[],t=0;t<e.length;t++){var n=e[t];n>255&&(n&=255),r.push(String.fromCharCode(n))}return r.join("")}function writeStringToMemory(e,r,t){var n,o;Runtime.warnOnce("writeStringToMemory is deprecated and should not be called! Use stringToUTF8() instead!"),t&&(o=r+lengthBytesUTF8(e),n=HEAP8[o]),stringToUTF8(e,r,1/0),t&&(HEAP8[o]=n)}function writeArrayToMemory(e,r){HEAP8.set(e,r)}function writeAsciiToMemory(e,r,t){for(var n=0;n<e.length;++n)HEAP8[r++>>0]=e.charCodeAt(n);t||(HEAP8[r>>0]=0)}if(Module.addOnPreRun=addOnPreRun,Module.addOnInit=addOnInit,Module.addOnPreMain=addOnPreMain,Module.addOnExit=addOnExit,Module.addOnPostRun=addOnPostRun,Module.intArrayFromString=intArrayFromString,Module.intArrayToString=intArrayToString,Module.writeStringToMemory=writeStringToMemory,Module.writeArrayToMemory=writeArrayToMemory,Module.writeAsciiToMemory=writeAsciiToMemory,Math.imul&&-5===Math.imul(4294967295,5)||(Math.imul=function(e,r){var t=65535&e,n=65535&r;return t*n+((e>>>16)*n+t*(r>>>16)<<16)|0}),Math.imul=Math.imul,!Math.fround){var froundBuffer=new Float32Array(1);Math.fround=function(e){return froundBuffer[0]=e,froundBuffer[0]}}Math.fround=Math.fround,Math.clz32||(Math.clz32=function(e){e>>>=0;for(var r=0;r<32;r++)if(e&1<<31-r)return r;return 32}),Math.clz32=Math.clz32,Math.trunc||(Math.trunc=function(e){return e<0?Math.ceil(e):Math.floor(e)}),Math.trunc=Math.trunc;var Math_abs=Math.abs,Math_cos=Math.cos,Math_sin=Math.sin,Math_tan=Math.tan,Math_acos=Math.acos,Math_asin=Math.asin,Math_atan=Math.atan,Math_atan2=Math.atan2,Math_exp=Math.exp,Math_log=Math.log,Math_sqrt=Math.sqrt,Math_ceil=Math.ceil,Math_floor=Math.floor,Math_pow=Math.pow,Math_imul=Math.imul,Math_fround=Math.fround,Math_round=Math.round,Math_min=Math.min,Math_clz32=Math.clz32,Math_trunc=Math.trunc,runDependencies=0,runDependencyWatcher=null,dependenciesFulfilled=null;function addRunDependency(e){runDependencies++,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies)}function removeRunDependency(e){if(runDependencies--,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies),0==runDependencies&&(null!==runDependencyWatcher&&(clearInterval(runDependencyWatcher),runDependencyWatcher=null),dependenciesFulfilled)){var r=dependenciesFulfilled;dependenciesFulfilled=null,r()}}Module.addRunDependency=addRunDependency,Module.removeRunDependency=removeRunDependency,Module.preloadedImages={},Module.preloadedAudios={};var memoryInitializer=null;function integrateWasmJS(Module){var method=Module.wasmJSMethod||"native-wasm";Module.wasmJSMethod=method;var wasmTextFile=Module.wasmTextFile||"webdsp_c.wast",wasmBinaryFile=Module.wasmBinaryFile||"webdsp_c.wasm",asmjsCodeFile=Module.asmjsCodeFile||"webdsp_c.temp.asm.js",wasmPageSize=65536,asm2wasmImports={"f64-rem":function(e,r){return e%r},"f64-to-int":function(e){return 0|e},"i32s-div":function(e,r){return(0|e)/(0|r)|0},"i32u-div":function(e,r){return(e>>>0)/(r>>>0)>>>0},"i32s-rem":function(e,r){return(0|e)%(0|r)|0},"i32u-rem":function(e,r){return(e>>>0)%(r>>>0)>>>0},debugger:function(){}},info={global:null,env:null,asm2wasm:asm2wasmImports,parent:Module},exports=null;function lookupImport(e,r){var t=info;if(e.indexOf(".")<0)t=(t||{})[e];else{var n=e.split(".");t=((t=(t||{})[n[0]])||{})[n[1]]}return r&&(t=(t||{})[r]),void 0===t&&abort("bad lookupImport to ("+e+")."+r),t}function mergeMemory(e){var r=Module.buffer;e.byteLength<r.byteLength&&Module.printErr("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");var t=new Int8Array(r),n=new Int8Array(e);memoryInitializer||t.set(n.subarray(Module.STATIC_BASE,Module.STATIC_BASE+Module.STATIC_BUMP),Module.STATIC_BASE),n.set(t),updateGlobalBuffer(e),updateGlobalBufferViews()}var WasmTypes={none:0,i32:1,i64:2,f32:3,f64:4};function fixImports(e){return e}function getBinary(){var e;if(Module.wasmBinary)e=Module.wasmBinary,e=new Uint8Array(e);else{if(!Module.readBinary)throw"on the web, we need the wasm binary to be preloaded and set on Module['wasmBinary']. emcc.py will do that for you when generating HTML (but not JS)";e=Module.readBinary(wasmBinaryFile)}return e}function getBinaryPromise(){return Module.wasmBinary||"function"!=typeof fetch?new Promise(function(e,r){e(getBinary())}):fetch(wasmBinaryFile).then(function(e){return e.arrayBuffer()})}function doJustAsm(global,env,providedBuffer){return"function"==typeof Module.asm&&Module.asm!==methodHandler||(Module.asmPreload?Module.asm=Module.asmPreload:eval(Module.read(asmjsCodeFile))),"function"!=typeof Module.asm?(Module.printErr("asm evalling did not set the module properly"),!1):Module.asm(global,env,providedBuffer)}function doNativeWasm(e,r,t){if("object"!=typeof WebAssembly)return Module.printErr("no native wasm support detected"),!1;if(!(Module.wasmMemory instanceof WebAssembly.Memory))return Module.printErr("no native wasm Memory in use"),!1;function n(e){(exports=e.exports).memory&&mergeMemory(exports.memory),Module.asm=exports,Module.usingWasm=!0,removeRunDependency("wasm-instantiate")}if(r.memory=Module.wasmMemory,info.global={NaN:NaN,Infinity:1/0},info["global.Math"]=e.Math,info.env=r,addRunDependency("wasm-instantiate"),Module.instantiateWasm)try{return Module.instantiateWasm(info,n)}catch(e){return Module.printErr("Module.instantiateWasm callback failed with error: "+e),!1}return Module.printErr("asynchronously preparing wasm"),getBinaryPromise().then(function(e){return WebAssembly.instantiate(e,info)}).then(function(e){n(e.instance)}).catch(function(e){Module.printErr("failed to asynchronously prepare wasm: "+e),Module.quit(1,e)}),{}}function doWasmPolyfill(e,r,t,n){if("function"!=typeof WasmJS)return Module.printErr("WasmJS not detected - polyfill not bundled?"),!1;var o,a,u=WasmJS({});if(u.outside=Module,u.info=info,u.lookupImport=lookupImport,assert(t===Module.buffer),info.global=e,info.env=r,assert(t===Module.buffer),r.memory=t,assert(r.memory instanceof ArrayBuffer),u.providedTotalMemory=Module.buffer.byteLength,o="interpret-binary"===n?getBinary():Module.read("interpret-asm2wasm"==n?asmjsCodeFile:wasmTextFile),"interpret-asm2wasm"==n)a=u._malloc(o.length+1),u.writeAsciiToMemory(o,a),u._load_asm2wasm(a);else if("interpret-s-expr"===n)a=u._malloc(o.length+1),u.writeAsciiToMemory(o,a),u._load_s_expr2wasm(a);else{if("interpret-binary"!==n)throw"what? "+n;a=u._malloc(o.length),u.HEAPU8.set(o,a),u._load_binary2wasm(a,o.length)}return u._free(a),u._instantiate(a),Module.newBuffer&&(mergeMemory(Module.newBuffer),Module.newBuffer=null),exports=u.asmExports}Module.asmPreload=Module.asm,Module.reallocBuffer=function(e){e=alignUp(e,Module.usingWasm?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE);var r=Module.buffer,t=r.byteLength;if(!Module.usingWasm)return exports.__growWasmMemory((e-t)/wasmPageSize),Module.buffer!==r?Module.buffer:null;try{return-1!==Module.wasmMemory.grow((e-t)/wasmPageSize)?Module.buffer=Module.wasmMemory.buffer:null}catch(e){return null}},Module.asm=function(e,r,t){if(e=fixImports(e),!(r=fixImports(r)).table){var n=Module.wasmTableSize;void 0===n&&(n=1024);var o=Module.wasmMaxTableSize;"object"==typeof WebAssembly&&"function"==typeof WebAssembly.Table?r.table=void 0!==o?new WebAssembly.Table({initial:n,maximum:o,element:"anyfunc"}):new WebAssembly.Table({initial:n,element:"anyfunc"}):r.table=new Array(n),Module.wasmTable=r.table}var a;r.memoryBase||(r.memoryBase=Module.STATIC_BASE),r.tableBase||(r.tableBase=0);for(var u=method.split(","),i=0;i<u.length;i++){var l=u[i];if(Module.printErr("trying binaryen method: "+l),"native-wasm"===l){if(a=doNativeWasm(e,r,t))break}else if("asmjs"===l){if(a=doJustAsm(e,r,t))break}else{if("interpret-asm2wasm"!==l&&"interpret-s-expr"!==l&&"interpret-binary"!==l)throw"bad method: "+l;if(a=doWasmPolyfill(e,r,t,l))break}}if(!a)throw"no binaryen method succeeded. consider enabling more options, like interpreting, if you want that: https://github.com/kripken/emscripten/wiki/WebAssembly#binaryen-methods";return Module.printErr("binaryen method succeeded."),a};var methodHandler=Module.asm}integrateWasmJS(Module);var ASM_CONSTS=[];STATIC_BASE=1024,STATICTOP=STATIC_BASE+3024,__ATINIT__.push(),memoryInitializer=Module.wasmJSMethod.indexOf("asmjs")>=0||Module.wasmJSMethod.indexOf("interpret-asm2wasm")>=0?"webdsp_c.js.mem":null;var STATIC_BUMP=3024;Module.STATIC_BASE=STATIC_BASE,Module.STATIC_BUMP=STATIC_BUMP;var tempDoublePtr=STATICTOP;function ___setErrNo(e){return Module.___errno_location&&(HEAP32[Module.___errno_location()>>2]=e),e}function ___lock(){}function _emscripten_memcpy_big(e,r,t){return HEAPU8.set(HEAPU8.subarray(r,r+t),e),e}function _abort(){Module.abort()}STATICTOP+=16,Module._sbrk=_sbrk,Module._memset=_memset,Module._memcpy=_memcpy;var SYSCALLS={varargs:0,get:function(e){return SYSCALLS.varargs+=4,HEAP32[SYSCALLS.varargs-4>>2]},getStr:function(){return Pointer_stringify(SYSCALLS.get())},get64:function(){var e=SYSCALLS.get(),r=SYSCALLS.get();return assert(e>=0?0===r:-1===r),e},getZero:function(){assert(0===SYSCALLS.get())}};function ___syscall140(e,r){SYSCALLS.varargs=r;try{var t=SYSCALLS.getStreamFromFD(),n=SYSCALLS.get(),o=SYSCALLS.get(),a=SYSCALLS.get(),u=SYSCALLS.get(),i=o;return assert(0===n),FS.llseek(t,i,u),HEAP32[a>>2]=t.position,t.getdents&&0===i&&0===u&&(t.getdents=null),0}catch(e){return"undefined"!=typeof FS&&e instanceof FS.ErrnoError||abort(e),-e.errno}}function ___syscall146(e,r){SYSCALLS.varargs=r;try{var t=SYSCALLS.get(),n=SYSCALLS.get(),o=SYSCALLS.get(),a=0;___syscall146.buffer||(___syscall146.buffers=[null,[],[]],___syscall146.printChar=function(e,r){var t=___syscall146.buffers[e];assert(t),0===r||10===r?((1===e?Module.print:Module.printErr)(UTF8ArrayToString(t,0)),t.length=0):t.push(r)});for(var u=0;u<o;u++){for(var i=HEAP32[n+8*u>>2],l=HEAP32[n+(8*u+4)>>2],s=0;s<l;s++)___syscall146.printChar(t,HEAPU8[i+s]);a+=l}return a}catch(e){return"undefined"!=typeof FS&&e instanceof FS.ErrnoError||abort(e),-e.errno}}function ___syscall54(e,r){SYSCALLS.varargs=r;try{return 0}catch(e){return"undefined"!=typeof FS&&e instanceof FS.ErrnoError||abort(e),-e.errno}}function ___unlock(){}function ___syscall6(e,r){SYSCALLS.varargs=r;try{var t=SYSCALLS.getStreamFromFD();return FS.close(t),0}catch(e){return"undefined"!=typeof FS&&e instanceof FS.ErrnoError||abort(e),-e.errno}}function invoke_ii(e,r){try{return Module.dynCall_ii(e,r)}catch(e){if("number"!=typeof e&&"longjmp"!==e)throw e;Module.setThrew(1,0)}}function invoke_iiii(e,r,t,n){try{return Module.dynCall_iiii(e,r,t,n)}catch(e){if("number"!=typeof e&&"longjmp"!==e)throw e;Module.setThrew(1,0)}}__ATEXIT__.push(function(){var e=Module._fflush;e&&e(0);var r=___syscall146.printChar;if(r){var t=___syscall146.buffers;t[1].length&&r(1,10),t[2].length&&r(2,10)}}),DYNAMICTOP_PTR=allocate(1,"i32",ALLOC_STATIC),STACK_BASE=STACKTOP=Runtime.alignMemory(STATICTOP),STACK_MAX=STACK_BASE+TOTAL_STACK,DYNAMIC_BASE=Runtime.alignMemory(STACK_MAX),HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE,staticSealed=!0,Module.wasmTableSize=6,Module.wasmMaxTableSize=6,Module.asmGlobalArg={Math:Math,Int8Array:Int8Array,Int16Array:Int16Array,Int32Array:Int32Array,Uint8Array:Uint8Array,Uint16Array:Uint16Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array,NaN:NaN,Infinity:1/0,byteLength:byteLength},Module.asmLibraryArg={abort:abort,assert:assert,enlargeMemory:enlargeMemory,getTotalMemory:getTotalMemory,abortOnCannotGrowMemory:abortOnCannotGrowMemory,invoke_ii:invoke_ii,invoke_iiii:invoke_iiii,___lock:___lock,___syscall6:___syscall6,___setErrNo:___setErrNo,_abort:_abort,___syscall140:___syscall140,_emscripten_memcpy_big:_emscripten_memcpy_big,___syscall54:___syscall54,___unlock:___unlock,___syscall146:___syscall146,DYNAMICTOP_PTR:DYNAMICTOP_PTR,tempDoublePtr:tempDoublePtr,ABORT:ABORT,STACKTOP:STACKTOP,STACK_MAX:STACK_MAX};var asm=Module.asm(Module.asmGlobalArg,Module.asmLibraryArg,buffer);Module.asm=asm;var _grayScale=Module._grayScale=function(){return Module.asm._grayScale.apply(null,arguments)},_invert=Module._invert=function(){return Module.asm._invert.apply(null,arguments)},setThrew=Module.setThrew=function(){return Module.asm.setThrew.apply(null,arguments)},_multiFilterFloat=Module._multiFilterFloat=function(){return Module.asm._multiFilterFloat.apply(null,arguments)},_noise=Module._noise=function(){return Module.asm._noise.apply(null,arguments)},_fflush=Module._fflush=function(){return Module.asm._fflush.apply(null,arguments)},___errno_location=Module.___errno_location=function(){return Module.asm.___errno_location.apply(null,arguments)},_memset=Module._memset=function(){return Module.asm._memset.apply(null,arguments)},_sbrk=Module._sbrk=function(){return Module.asm._sbrk.apply(null,arguments)},_memcpy=Module._memcpy=function(){return Module.asm._memcpy.apply(null,arguments)},stackAlloc=Module.stackAlloc=function(){return Module.asm.stackAlloc.apply(null,arguments)},getTempRet0=Module.getTempRet0=function(){return Module.asm.getTempRet0.apply(null,arguments)},setTempRet0=Module.setTempRet0=function(){return Module.asm.setTempRet0.apply(null,arguments)},_emscripten_get_global_libc=Module._emscripten_get_global_libc=function(){return Module.asm._emscripten_get_global_libc.apply(null,arguments)},_sobelFilter=Module._sobelFilter=function(){return Module.asm._sobelFilter.apply(null,arguments)},stackSave=Module.stackSave=function(){return Module.asm.stackSave.apply(null,arguments)},_multiFilter=Module._multiFilter=function(){return Module.asm._multiFilter.apply(null,arguments)},_free=Module._free=function(){return Module.asm._free.apply(null,arguments)},runPostSets=Module.runPostSets=function(){return Module.asm.runPostSets.apply(null,arguments)},establishStackSpace=Module.establishStackSpace=function(){return Module.asm.establishStackSpace.apply(null,arguments)},stackRestore=Module.stackRestore=function(){return Module.asm.stackRestore.apply(null,arguments)},_malloc=Module._malloc=function(){return Module.asm._malloc.apply(null,arguments)},_emscripten_replace_memory=Module._emscripten_replace_memory=function(){return Module.asm._emscripten_replace_memory.apply(null,arguments)},_convFilter=Module._convFilter=function(){return Module.asm._convFilter.apply(null,arguments)},_brighten=Module._brighten=function(){return Module.asm._brighten.apply(null,arguments)},dynCall_ii=Module.dynCall_ii=function(){return Module.asm.dynCall_ii.apply(null,arguments)},dynCall_iiii=Module.dynCall_iiii=function(){return Module.asm.dynCall_iiii.apply(null,arguments)},initialStackTop;if(Runtime.stackAlloc=Module.stackAlloc,Runtime.stackSave=Module.stackSave,Runtime.stackRestore=Module.stackRestore,Runtime.establishStackSpace=Module.establishStackSpace,Runtime.setTempRet0=Module.setTempRet0,Runtime.getTempRet0=Module.getTempRet0,Module.asm=asm,memoryInitializer)if("function"==typeof Module.locateFile?memoryInitializer=Module.locateFile(memoryInitializer):Module.memoryInitializerPrefixURL&&(memoryInitializer=Module.memoryInitializerPrefixURL+memoryInitializer),ENVIRONMENT_IS_NODE||ENVIRONMENT_IS_SHELL){var data=Module.readBinary(memoryInitializer);HEAPU8.set(data,Runtime.GLOBAL_BASE)}else{addRunDependency("memory initializer");var applyMemoryInitializer=function(e){e.byteLength&&(e=new Uint8Array(e)),HEAPU8.set(e,Runtime.GLOBAL_BASE),Module.memoryInitializerRequest&&delete Module.memoryInitializerRequest.response,removeRunDependency("memory initializer")};function doBrowserLoad(){Module.readAsync(memoryInitializer,applyMemoryInitializer,function(){throw"could not load memory initializer "+memoryInitializer})}if(Module.memoryInitializerRequest){function useRequest(){var e=Module.memoryInitializerRequest;if(200!==e.status&&0!==e.status)return console.warn("a problem seems to have happened with Module.memoryInitializerRequest, status: "+e.status+", retrying "+memoryInitializer),void doBrowserLoad();applyMemoryInitializer(e.response)}Module.memoryInitializerRequest.response?setTimeout(useRequest,0):Module.memoryInitializerRequest.addEventListener("load",useRequest)}else doBrowserLoad()}function ExitStatus(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}ExitStatus.prototype=new Error,ExitStatus.prototype.constructor=ExitStatus;var preloadStartTime=null,calledMain=!1;function run(e){function r(){Module.calledRun||(Module.calledRun=!0,ABORT||(ensureInitRuntime(),preMain(),Module.onRuntimeInitialized&&Module.onRuntimeInitialized(),Module._main&&shouldRunNow&&Module.callMain(e),postRun()))}e=e||Module.arguments,null===preloadStartTime&&(preloadStartTime=Date.now()),runDependencies>0||(preRun(),runDependencies>0||Module.calledRun||(Module.setStatus?(Module.setStatus("Running..."),setTimeout(function(){setTimeout(function(){Module.setStatus("")},1),r()},1)):r(),script.dispatchEvent(doneEvent)))}function exit(e,r){r&&Module.noExitRuntime||(Module.noExitRuntime||(ABORT=!0,EXITSTATUS=e,STACKTOP=initialStackTop,exitRuntime(),Module.onExit&&Module.onExit(e)),ENVIRONMENT_IS_NODE&&process.exit(e),Module.quit(e,new ExitStatus(e)))}dependenciesFulfilled=function e(){Module.calledRun||run(),Module.calledRun||(dependenciesFulfilled=e)},Module.callMain=Module.callMain=function(e){e=e||[],ensureInitRuntime();var r=e.length+1;function t(){for(var e=0;e<3;e++)n.push(0)}var n=[allocate(intArrayFromString(Module.thisProgram),"i8",ALLOC_NORMAL)];t();for(var o=0;o<r-1;o+=1)n.push(allocate(intArrayFromString(e[o]),"i8",ALLOC_NORMAL)),t();n.push(0),n=allocate(n,"i32",ALLOC_NORMAL);try{exit(Module._main(r,n,0),!0)}catch(e){if(e instanceof ExitStatus)return;if("SimulateInfiniteLoop"==e)return void(Module.noExitRuntime=!0);var a=e;e&&"object"==typeof e&&e.stack&&(a=[e,e.stack]),Module.printErr("exception thrown: "+a),Module.quit(1,e)}finally{calledMain=!0}},Module.run=Module.run=run,Module.exit=Module.exit=exit;var abortDecorators=[];function abort(e){void 0!==e?(Module.print(e),Module.printErr(e),e=JSON.stringify(e)):e="",ABORT=!0,EXITSTATUS=1;var r="abort("+e+") at "+stackTrace()+"\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.";throw abortDecorators&&abortDecorators.forEach(function(t){r=t(r,e)}),r}if(Module.abort=Module.abort=abort,Module.preInit)for("function"==typeof Module.preInit&&(Module.preInit=[Module.preInit]);Module.preInit.length>0;)Module.preInit.pop()();var shouldRunNow=!0;Module.noInitialRun&&(shouldRunNow=!1),run();