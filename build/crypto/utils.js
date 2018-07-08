'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var maskPubAddress = exports.maskPubAddress = function maskPubAddress(pub) {
  // keep 3 first and 3 last chars unmasked
  var masked = '';

  for (var i = 0; i < pub.length - 3 * 2; i++) {
    masked = masked + '*';
  }

  return pub[0] + pub[1] + pub[2] + masked + pub[pub.length - 3] + pub[pub.length - 2] + pub[pub.length - 1];
};

module.exports = {
  maskPubAddress: maskPubAddress
};