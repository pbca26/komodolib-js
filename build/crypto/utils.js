"use strict";

var maskPubAddress = function maskPubAddress(pub) {
  // keep 3 first and 3 last chars unmasked
  var masked = '';

  for (var i = 0; i < pub.length - 3 * 2; i++) {
    masked += '*';
  }

  return pub[0] + pub[1] + pub[2] + masked + pub[pub.length - 3] + pub[pub.length - 2] + pub[pub.length - 1];
};

var hex2str = function hex2str(hex) {
  var _hex = hex.toString(); // force conversion


  var str = '';

  for (var i = 0; i < _hex.length; i += 2) {
    str += String.fromCharCode(parseInt(_hex.substr(i, 2), 16));
  }

  return str;
}; // ref: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array


var shuffleArray = function shuffleArray(a) {
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var _ref = [a[j], a[i]];
    a[i] = _ref[0];
    a[j] = _ref[1];
  }

  return a;
};

module.exports = {
  maskPubAddress: maskPubAddress,
  hex2str: hex2str,
  shuffleArray: shuffleArray
};