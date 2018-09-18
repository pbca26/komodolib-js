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
var formatValue = function formatValue(value) {
  if (value.toString().indexOf('.') === -1) {
    return value;
  } else {
    // ref: https://stackoverflow.com/questions/3612744/remove-insignificant-trailing-zeros-from-a-number
    var c = Math.pow(10, 8); // 8 decimal places
    var newVal = Math.trunc(value * c) / c;
    var str = newVal.toString();
    var splitNum = str.split('.');

    if (Number(splitNum[0]) !== 0) {
      return newVal.toFixed(4);
    } else {
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

// https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
var sortObject = function sortObject(o) {
  return Object.keys(o).sort().reduce(function (r, k) {
    return r[k] = o[k], r;
  }, {});
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
  isPositiveNumber: isPositiveNumber,
  sortObject: sortObject
};