'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// electrum proxy api: https://github.com/pbca26/electrum-proxy
// TODO: check if params are missing, params type check

var fetch = require('node-fetch');

var electrumProxy = [{
  ip: '94.130.225.86',
  port: 80
}, {
  ip: '94.130.98.74',
  port: 80
}];

var urlParams = function urlParams(params) {
  var query = Object.keys(params).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  }).join('&');
  return '?' + query;
};

var serverData = function serverData(obj) {
  return {
    ip: obj.ip,
    port: obj.port,
    proto: obj.connectionProtocol,
    proxy: obj.proxy
  };
};

var request = function request(server, options) {
  return new Promise(function (resolve, reject) {
    // TODO: random proxy
    var proxy = options && options.proxy ? proxy : electrumProxy[0];
    var _serverEndpoint = (proxy.ssl ? 'https' : 'http') + '://' + proxy.ip + ':' + proxy.port;
    var _urlParams = {
      ip: server.ip,
      port: server.port,
      proto: server.proto
    };

    if (Number(options.protocolVersion) >= 1.2) {
      _urlParams.eprotocol = options.protocolVersion;
    }

    if (options.address) {
      _urlParams.address = options.address;
    }

    if (options.height) {
      _urlParams.height = options.height;
    }

    if (options.txid) {
      _urlParams.txid = options.txid;
    }

    if (options.blocks) {
      _urlParams.blocks = options.blocks;
    }

    if (options.rawtx) {
      _urlParams.rawtx = options.rawtx;
    }

    var url = _serverEndpoint + '/api/' + options.url + (options.method === 'GET' ? urlParams(_urlParams) : '');

    fetch(url, options.method === 'GET' ? {
      method: options.method,
      headers: {
        'Content-Type': 'application/json'
      }
    } : {
      method: options.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_urlParams)
    }).catch(function (error) {
      console.log(error);
      reject(error);
    }).then(function (response) {
      return response.json();
    }).then(function (json) {
      // console.log(json);
      if (json.msg === 'success') {
        resolve(json.result);
      } else {
        resolve(options.method === 'GET' ? {
          error: json.result,
          method: options.method,
          url: url
        } : {
          error: json.result,
          method: options.method,
          url: url,
          body: JSON.stringify(_urlParams)
        });
      }
    });
  });
};

var electrumConnnect = function () {
  function electrumConnnect(server) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;

    _classCallCheck(this, electrumConnnect);

    this.port = server.port;
    this.ip = server.ip;
    this.connectionProtocol = server.protocol || 'tcp';
    this.protocolVersion = null;
    this.proxy = options && options.proxy ? options.proxy : null;
  }

  _createClass(electrumConnnect, [{
    key: 'setProtocolVersion',
    value: function setProtocolVersion(version) {
      this.protocolVersion = version;
    }
  }, {
    key: 'getServerVersion',
    value: function getServerVersion() {
      return request(serverData(this), {
        method: 'GET',
        url: '/server/version',
        protocolVersion: this.protocolVersion
      });
    }

    // chain tip

  }, {
    key: 'getCurrentBlockNumber',
    value: function getCurrentBlockNumber() {
      return request(serverData(this), {
        method: 'GET',
        url: 'getcurrentblock',
        protocolVersion: this.protocolVersion
      });
    }
  }, {
    key: 'getBalance',
    value: function getBalance(address) {
      return request(serverData(this), {
        method: 'GET',
        url: 'getbalance',
        protocolVersion: this.protocolVersion,
        address: address
      });
    }

    // TODO: extended usage

  }, {
    key: 'getHistory',
    value: function getHistory(address) {
      return request(serverData(this), {
        method: 'GET',
        url: 'listtransactions',
        protocolVersion: this.protocolVersion,
        address: address
      });
    }
  }, {
    key: 'getUTXO',
    value: function getUTXO(address) {
      return request(serverData(this), {
        method: 'GET',
        url: 'listunspent',
        protocolVersion: this.protocolVersion,
        address: address
      });
    }
  }, {
    key: 'getBlockInfo',
    value: function getBlockInfo(height) {
      return request(serverData(this), {
        method: 'GET',
        url: 'getblockinfo',
        protocolVersion: this.protocolVersion,
        height: height
      });
    }
  }, {
    key: 'getTransaction',
    value: function getTransaction(txid) {
      return request(serverData(this), {
        method: 'GET',
        url: 'gettransaction',
        protocolVersion: this.protocolVersion,
        txid: txid
      });
    }
  }, {
    key: 'getMerkle',
    value: function getMerkle(txid, height) {
      return request(serverData(this), {
        method: 'GET',
        url: 'getmerkle',
        protocolVersion: this.protocolVersion,
        txid: txid,
        height: height
      });
    }
  }, {
    key: 'getFeeEstimate',
    value: function getFeeEstimate(blocks) {
      return request(serverData(this), {
        method: 'GET',
        url: 'estimatefee',
        protocolVersion: this.protocolVersion,
        blocks: blocks
      });
    }
  }, {
    key: 'broadcast',
    value: function broadcast(rawtx) {
      return request(serverData(this), {
        method: 'POST',
        url: 'pushtx',
        protocolVersion: this.protocolVersion,
        rawtx: rawtx
      });
    }
  }]);

  return electrumConnnect;
}();

module.exports = electrumConnnect;