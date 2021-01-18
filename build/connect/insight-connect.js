'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _insightEndPoints;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// insight api: https://github.com/bitpay/insight-api/tree/45ebf7a152c1abfd179bf1b0d32734a2bd36e105
// TODO: - normalize transactions history
//       - normalize utxo
//       - add extended insight api functions e.g. raw blocks
//       - extend end points method

var fetch = require('node-fetch');
var insightEndPoints = (_insightEndPoints = {
  KMD: 'https://www.kmdexplorer.io/insight-api-komodo',
  RICK: 'https://rick.kmd.dev/insight-api-komodo',
  MORTY: 'https://morty.kmd.dev/insight-api-komodo',
  DEX: 'https://dex.kmdexplorer.io/insight-api-komodo',
  SUPERNET: 'https://supernet.kmdexplorer.io/insight-api-komodo',
  DION: 'https://explorer.dionpay.com/insight-api-komodo',
  ZILLA: 'https://zilla.kmdexplorer.io/insight-api-komodo',
  CCL: 'https://ccl.kmdexplorer.io/insight-api-komodo',
  PIRATE: 'https://pirate.kmdexplorer.io/insight-api-komodo',
  KV: 'https://kv.kmdexplorer.io/insight-api-komodo',
  OOT: 'http://explorer.utrum.io/insight-api-komodo',
  BNTN: 'http://chain.blocnation.io/insight-api-komodo',
  CHAIN: 'https://chain.kmdexplorer.io/insight-api-komodo',
  GLXT: 'https://glxt.kmdexplorer.io/insight-api-komodo',
  PRLPAY: 'https://prlpay.kmdexplorer.io/insight-api-komodo',
  PGT: 'https://pgt.kmdexplorer.io/insight-api-komodo',
  MSHARK: 'https://mshark.kmdexplorer.io/insight-api-komodo',
  REVS: 'https://revs.kmdexplorer.io/insight-api-komodo',
  PANGEA: 'https://pangea.kmdexplorer.io/insight-api-komodo',
  JUMBLR: 'https://jumblr.kmdexplorer.io/insight-api-komodo',
  BET: 'https://bet.kmdexplorer.io/insight-api-komodo',
  CRYPTO: 'https://crypto.kmdexplorer.io/insight-api-komodo',
  HODL: 'https://hodl.kmdexplorer.io/insight-api-komodo',
  ILN: 'https://explorer.ilien.io/insight-api-komodo',
  SHARK: 'https://shark.kmdexplorer.io/insight-api-komodo',
  BOTS: 'https://bots.kmdexplorer.io/insight-api-komodo',
  MGW: 'https://mgw.kmdexplorer.io/insight-api-komodo',
  WLC: 'https://wlc.kmdexplorer.io/insight-api-komodo',
  K64: 'http://explorer.komodore64.com/insight-api-komodo',
  COQUI: 'https://coqui.kmdexplorer.io/insight-api-komodo',
  EQL: 'https://eql.kmdexplorer.io/insight-api-komodo',
  BTCH: 'https://btch.kmdexplorer.io/insight-api-komodo',
  HUSH: 'https://explorer.myhush.org/insight-api-komodo',
  PIZZA: 'https://pizza.kmdexplorer.io/insight-api-komodo',
  BEER: 'https://beer.kmdexplorer.io/insight-api-komodo',
  NINJA: 'https://ninja.kmdexplorer.io/insight-api-komodo',
  DSEC: 'https://dsec.kmdexplorer.io/insight-api-komodo',
  KMDICE: 'https://kmdice.explorer.dexstats.info/insight-api-komodo',
  ZEXO: 'http://zex.explorer.dexstats.info/insight-api-komodo',
  LUMBER: 'https://explorer.lumberscout.io/insight-api-komodo',
  KSB: 'http://ksb.explorer.dexstats.info/insight-api-komodo',
  OUR: 'http://our.explorer.dexstats.info/insight-api-komodo'
}, _defineProperty(_insightEndPoints, 'RICK', 'https://rick.kmd.dev/insight-api-komodo'), _defineProperty(_insightEndPoints, 'MORTY', 'https://morty.kmd.dev/insight-api-komodo'), _defineProperty(_insightEndPoints, 'MTST3', 'http://explorer.marmara.io/insight-api-komodo'), _defineProperty(_insightEndPoints, 'RFOX', 'https://rfox.kmdexplorer.io/insight-api-komodo'), _defineProperty(_insightEndPoints, 'LABS', 'http://labs.explorer.dexstats.info/insight-api-komodo'), _defineProperty(_insightEndPoints, 'BTC', 'https://insight.bitpay.com/api'), _defineProperty(_insightEndPoints, 'QTUM', 'https://explorer.qtum.org/insight-api'), _defineProperty(_insightEndPoints, 'LTC', 'https://insight.litecore.io/api'), _defineProperty(_insightEndPoints, 'DASH', 'https://insight.dash.org/insight-api'), _defineProperty(_insightEndPoints, 'MONA', 'https://mona.chainsight.info/api'), _defineProperty(_insightEndPoints, 'VIA', 'https://explorer.viacoin.org/api/peer'), _defineProperty(_insightEndPoints, 'VTC', 'https://insight.vertcoin.org/insight-vtc-api'), _defineProperty(_insightEndPoints, 'DGB', 'https://digiexplorer.info/api'), _defineProperty(_insightEndPoints, 'IOP', 'http://mainnet.iop.global/insight-api'), _defineProperty(_insightEndPoints, 'BTG', 'https://btgexplorer.com/api'), _defineProperty(_insightEndPoints, 'BCH', 'https://api.bitcore.io/api/BCH/mainnet'), _defineProperty(_insightEndPoints, 'ZCL', 'https://explorer.zcl.zeltrez.io/api'), _defineProperty(_insightEndPoints, 'SNG', 'https://explorer.snowgem.org/api'), _defineProperty(_insightEndPoints, 'BTX', 'https://insight.bitcore.cc/api'), _defineProperty(_insightEndPoints, 'BTCZ', 'https://explorer.btcz.rocks/api'), _defineProperty(_insightEndPoints, 'ZEC', 'https://zcashnetwork.info/api'), _defineProperty(_insightEndPoints, 'HTML', 'https://explorer.htmlcoin.com/api'), _defineProperty(_insightEndPoints, 'FTC', 'https://explorer.feathercoin.com/api'), _defineProperty(_insightEndPoints, 'NLG', 'https://guldenblocks.com/api'), _defineProperty(_insightEndPoints, 'GRS', 'http://groestlsight.groestlcoin.org/api'), _defineProperty(_insightEndPoints, 'AUR', 'http://insight.auroracoin.is/api'), _defineProperty(_insightEndPoints, 'GBX', 'https://insight.gobyte.network/insight-api-gobyte'), _insightEndPoints);

var urlParams = function urlParams(params) {
  var query = Object.keys(params).map(function (k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
  }).join('&');
  return '?' + query;
};

var serverData = function serverData(obj) {
  return {
    endPointName: obj.endPointName
  };
};

var request = function request(server, options) {
  return new Promise(function (resolve, reject) {
    var _urlParams = {};

    if (options.address) {
      _urlParams.address = options.address;
    }

    if (options.txid) {
      _urlParams.txid = options.txid;
    }

    if (options.blocks) {
      _urlParams.nbBlocks = options.blocks;
    }

    if (options.rawtx) {
      _urlParams.rawtx = options.rawtx;
    }

    var url = void 0;

    if (!options.hasOwnProperty('slash')) {
      url = insightEndPoints[server.endPointName.toUpperCase()] + '/' + options.url + (options.method === 'GET' ? urlParams(_urlParams) : '');
    } else {
      url = insightEndPoints[server.endPointName.toUpperCase()] + '/' + options.url;
    }

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
      resolve(error);
    }).then(function (response) {
      var _response = response.text().then(function (text) {
        return text;
      });
      return _response;
    }).catch(function (error) {
      console.log(error);
      resolve(error);
    }).then(function (json) {
      try {
        json = JSON.parse(json);
      } catch (e) {}

      if ((typeof json === 'undefined' ? 'undefined' : _typeof(json)) === 'object' || options.hasOwnProperty('returnValStr')) {
        resolve(json);
      } else {
        resolve(options.method === 'GET' ? {
          error: json,
          method: options.method,
          url: url
        } : {
          error: json,
          method: options.method,
          url: url,
          body: JSON.stringify(_urlParams)
        });
      }
    });
  });
};

var insightConnnect = function () {
  function insightConnnect(endPointName) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : void 0;

    _classCallCheck(this, insightConnnect);

    this.endPointName = endPointName;
  }

  _createClass(insightConnnect, [{
    key: 'getInfo',
    value: function getInfo() {
      return request(serverData(this), {
        method: 'GET',
        url: 'status',
        q: 'getInfo'
      });
    }
  }, {
    key: 'getBalance',
    value: function getBalance(address) {
      return request(serverData(this), {
        method: 'GET',
        url: 'addr/' + address + '/balance',
        slash: true,
        returnValStr: true
      });
    }

    // TODO: extended usage

  }, {
    key: 'getHistory',
    value: function getHistory(address) {
      return request(serverData(this), {
        method: 'GET',
        url: 'txs',
        address: address,
        pageNum: 0
      });
    }
  }, {
    key: 'getUTXO',
    value: function getUTXO(address) {
      return request(serverData(this), {
        method: 'GET',
        url: 'addr/' + address + '/utxo',
        slash: true
      });
    }
  }, {
    key: 'getTransaction',
    value: function getTransaction(txid) {
      return request(serverData(this), {
        method: 'GET',
        url: 'tx/' + txid,
        slash: true
      });
    }
  }, {
    key: 'getFeeEstimate',
    value: function getFeeEstimate(blocks) {
      return request(serverData(this), {
        method: 'GET',
        url: 'utils/estimatefee',
        blocks: blocks
      });
    }
  }, {
    key: 'broadcast',
    value: function broadcast(rawtx) {
      return request(serverData(this), {
        method: 'POST',
        url: 'tx/send',
        rawtx: rawtx
      });
    }
  }]);

  return insightConnnect;
}();

module.exports = insightConnnect;