'use strict';

var sort = function sort(data, sortKey, desc) {
  if (!desc) {
    return data.sort(function (a, b) {
      if (a[sortKey] < b[sortKey]) {
        return -1;
      }

      if (a[sortKey] > b[sortKey]) {
        return 1;
      }

      return 0;
    });
  } else {
    return data.sort(function (b, a) {
      if (a[sortKey] < b[sortKey]) {
        return -1;
      }

      if (a[sortKey] > b[sortKey]) {
        return 1;
      }

      return 0;
    });
  }
};

var getRandomIntInclusive = function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min; // the maximum is inclusive and the minimum is inclusive
};

var getRandomElectrumServer = function getRandomElectrumServer(servers, excludeServer) {
  var randomServer = void 0;
  var _servers = [];

  for (var i = 0; i < servers.length; i++) {
    if (excludeServer !== servers[i]) {
      _servers.push(servers[i]);
    }
  }

  // pick a random server to communicate with
  if (_servers && _servers.length > 0) {
    var _randomServerId = getRandomIntInclusive(0, _servers.length - 1);
    var _randomServer = _servers[_randomServerId];
    var _serverDetails = _randomServer.split(':');

    if (_serverDetails.length === 3) {
      return {
        ip: _serverDetails[0],
        port: _serverDetails[1],
        proto: _serverDetails[2]
      };
    }
  } else {
    var _serverDetails2 = _servers[0].split(':');

    return {
      ip: _serverDetails2[0],
      port: _serverDetails2[1],
      proto: _serverDetails2[2]
    };
  }
};

var isNumber = function isNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

var isPositiveNumber = function isPositiveNumber(value) {
  return isNumber(value) && +value > 0;
};

// display rounding
var formatValue = function formatValue(_formatValue) {
  var _valueToStr = _formatValue.toString();

  if (_valueToStr.indexOf('.') === -1) {
    return _formatValue;
  } else {
    if (_valueToStr) {
      var _decimal = _valueToStr.substr(_valueToStr.indexOf('.') + 1, _valueToStr.length);
      var newVal = _valueToStr.substr(0, _valueToStr.indexOf('.') + 1);

      for (var i = 0; i < _decimal.length; i++) {
        if (_decimal[i] === '0') {
          newVal = newVal + _decimal[i];
        } else {
          newVal = newVal + _decimal[i];
          break;
        }
      }

      return newVal;
    }
  }
};

var formatBytes = function formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  var k = 1000;
  var dm = decimals + 1 || 3;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

var estimateTxSize = function estimateTxSize(numVins, numOuts) {
  // in x 180 + out x 34 + 10 plus or minus in
  return numVins * 180 + numOuts * 34 + 11;
};

var maxSpendBalance = function maxSpendBalance(utxoList, fee) {
  var maxSpendBalance = 0;

  for (var i = 0; i < utxoList.length; i++) {
    maxSpendBalance += Number(utxoList[i].value);
  }

  if (fee) {
    return Number(maxSpendBalance) - Number(fee);
  } else {
    return maxSpendBalance;
  }
};

var fromSats = function fromSats(value) {
  return value * 0.00000001;
};

var toSats = function toSats(value) {
  return Number(value).toFixed(8) * 100000000;
};

module.exports = {
  formatValue: formatValue,
  formatBytes: formatBytes,
  sort: sort,
  getRandomIntInclusive: getRandomIntInclusive,
  getRandomElectrumServer: getRandomElectrumServer,
  estimateTxSize: estimateTxSize,
  maxSpendBalance: maxSpendBalance,
  fromSats: fromSats,
  toSats: toSats,
  isNumber: isNumber,
  isPositiveNumber: isPositiveNumber
};