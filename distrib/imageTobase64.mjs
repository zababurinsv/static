!function(e){"use strict";function n(e){return window.btoa([].slice.call(new Uint8Array(e)).map(function(e){return String.fromCharCode(e)}).join(""))}function t(e){return e.toString("base64")}function r(e){return/(\.(jpg)|\.(png)|\.(jpeg))/gi.test(e)?Promise.resolve((n=e,r=require("fs"),i=require("path"),r.statSync(n).isFile()?t(r.readFileSync(i.resolve(n)).toString("base64")):null)):Promise.reject("[*] Occurent some error... [validTypeImage] == false");var n,r,i}function i(e, i){return"undefined"!=typeof window&&"document"in window&&"navigator"in window?function(e, t){return"fetch"in window&&"Promise"in window?fetch(e,t||{}).then(function(e){return e.arrayBuffer()}).then(n):Promise.reject("[*] It's image2base64 not compatible with your browser.")}(e,i):function(e){return/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(e)?require("node-fetch")(e).then(function(e){return e.buffer()}).then(t):r(e)}(e)}"undefined"!=typeof module?module.exports=i:e.imageToBase64=i}(this);