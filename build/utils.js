"use strict";

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
  }

  return data.sort(function (b, a) {
    if (a[sortKey] < b[sortKey]) {
      return -1;
    }

    if (a[sortKey] > b[sortKey]) {
      return 1;
    }

    return 0;
  });
};

var getRandomIntInclusive = function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // the maximum is inclusive and the minimum is inclusive
};

var getRandomElectrumServer = function getRandomElectrumServer(servers, excludeServer) {
  var randomServer;
  var _servers = [];

  for (var i = 0; i < servers.length; i++) {
    if (excludeServer !== servers[i]) {
      _servers.push(servers[i]);
    }
  } // pick a random server to communicate with


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
}; // display rounding


var formatValue = function formatValue(value) {
  if (value.toString().indexOf('.') === -1) {
    return value;
  } // ref: https://stackoverflow.com/questions/3612744/remove-insignificant-trailing-zeros-from-a-number


  var c = Math.pow(10, 8); // 8 decimal places

  var newVal = Math.trunc(value * c) / c;
  var str = newVal.toString();
  var splitNum = str.split('.');

  if (Number(splitNum[0]) !== 0) {
    return newVal.toFixed(4);
  }

  return newVal;
};

var formatBytes = function formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 Bytes';
  }

  var k = 1000;
  var dm = decimals + 1 || 3;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return "".concat(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), " ").concat(sizes[i]);
};

var estimateTxSize = function estimateTxSize(numVins, numOuts) {
  return numVins * 180 + numOuts * 34 + 11;
};

var maxSpendBalance = function maxSpendBalance(utxoList, fee) {
  var maxSpendBalance = 0;

  for (var i = 0; i < utxoList.length; i++) {
    maxSpendBalance += Number(utxoList[i].value);
  }

  if (fee) {
    return Number(maxSpendBalance) - Number(fee);
  }

  return maxSpendBalance;
};

var fromSats = function fromSats(value) {
  return Math.round(value) / 100000000;
};

var toSats = function toSats(value) {
  return Math.round(value * 10000000000) / 100;
}; // https://stackoverflow.com/questions/5467129/sort-javascript-object-by-key


var sortObject = function sortObject(o) {
  return Object.keys(o).sort().reduce(function (r, k) {
    return r[k] = o[k], r;
  }, {});
}; // ref: https://gist.github.com/matthewhudson/7999278 


var parseBitcoinURL = function parseBitcoinURL(url) {
  var r = /^[a-zA-Z0-9]*:([a-zA-Z0-9]{27,34})(?:\?(.*))?$/;
  var match = r.exec(url);
  if (!match) return null;
  var parsed = {
    url: url
  };

  if (match[2]) {
    var queries = match[2].split('&');

    for (var i = 0; i < queries.length; i++) {
      var query = queries[i].split('=');

      if (query.length == 2) {
        parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
      }
    }
  }

  parsed.address = match[1];
  return parsed;
};

var sortTransactions = function sortTransactions(transactions, sortBy) {
  return transactions.sort(function (b, a) {
    if (a[sortBy ? sortBy : 'height'] < b[sortBy ? sortBy : 'height'] && a[sortBy ? sortBy : 'height'] && b[sortBy ? sortBy : 'height']) {
      return -1;
    }

    if (a[sortBy ? sortBy : 'height'] > b[sortBy ? sortBy : 'height'] && a[sortBy ? sortBy : 'height'] && b[sortBy ? sortBy : 'height']) {
      return 1;
    }

    if (!a[sortBy ? sortBy : 'height'] && b[sortBy ? sortBy : 'height']) {
      return 1;
    }

    if (!b[sortBy ? sortBy : 'height'] && a[sortBy ? sortBy : 'height']) {
      return -1;
    }

    return 0;
  });
};

module.exports = {
  formatValue: formatValue,
  formatBytes: formatBytes,
  sort: sort,
  sortTransactions: sortTransactions,
  getRandomIntInclusive: getRandomIntInclusive,
  getRandomElectrumServer: getRandomElectrumServer,
  estimateTxSize: estimateTxSize,
  maxSpendBalance: maxSpendBalance,
  fromSats: fromSats,
  toSats: toSats,
  isNumber: isNumber,
  isPositiveNumber: isPositiveNumber,
  sortObject: sortObject,
  parseBitcoinURL: parseBitcoinURL
};