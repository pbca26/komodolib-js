'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var jsonToBuffer = function jsonToBuffer(json) {
  for (var key in json) {
    if (_typeof(json[key]) === 'object' && (key === 'buffer' || key === 'chunks')) {
      if (json[key].data) {
        json[key] = Buffer.from(json[key].data);
      }
    } else if (_typeof(json[key]) === 'object' && key !== 'buffer' && key !== 'chunks') {
      jsonToBuffer(json[key]);
    }
  }

  return json;
};

module.exports = jsonToBuffer;