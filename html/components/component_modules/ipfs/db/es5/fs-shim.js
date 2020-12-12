"use strict";

/* eslint-disable */
// adapted from https://github.com/cheton/is-electron - (c) Cheton Wu
var isElectron = function isElectron() {
  if (typeof window !== 'undefined' && typeof window.process === 'object') {
    return true;
  }

  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true;
  }

  return false;
};

var fs = !isElectron() && (typeof window === 'object' || typeof self === 'object') ? null : eval('require("fs")');
module.exports = fs;