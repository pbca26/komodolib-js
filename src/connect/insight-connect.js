// insight api: https://github.com/bitpay/insight-api/tree/45ebf7a152c1abfd179bf1b0d32734a2bd36e105
// TODO: - normalize transactions history
//       - normalize utxo
//       - add extended insight api functions e.g. raw blocks
//       - extend end points method

const fetch = require('node-fetch');
const insightEndPoints = {
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
  OUR: 'http://our.explorer.dexstats.info/insight-api-komodo',
  RICK: 'https://rick.kmd.dev/insight-api-komodo',
  MORTY: 'https://morty.kmd.dev/insight-api-komodo',
  MTST3:  'http://explorer.marmara.io/insight-api-komodo',
  RFOX: 'https://rfox.kmdexplorer.io/insight-api-komodo',
  LABS: 'http://labs.explorer.dexstats.info/insight-api-komodo',
  // non-kmd coins
  BTC: 'https://insight.bitpay.com/api',
  QTUM: 'https://explorer.qtum.org/insight-api',
  LTC: 'https://insight.litecore.io/api',
  DASH: 'https://insight.dash.org/insight-api',
  MONA: 'https://mona.chainsight.info/api',
  VIA: 'https://explorer.viacoin.org/api/peer',
  VTC: 'https://insight.vertcoin.org/insight-vtc-api',
  DGB: 'https://digiexplorer.info/api',
  //GAME: 'https://blockexplorer.gamecredits.org/api/transactions/latest?limit=5',
  IOP: 'http://mainnet.iop.global/insight-api',
  BTG: 'https://btgexplorer.com/api',
  BCH: 'https://api.bitcore.io/api/BCH/mainnet',
  ZCL: 'https://explorer.zcl.zeltrez.io/api',
  SNG: 'https://explorer.snowgem.org/api',
  BTX: 'https://insight.bitcore.cc/api',
  BTCZ: 'https://explorer.btcz.rocks/api',
  ZEC: 'https://zcashnetwork.info/api',
  HTML: 'https://explorer.htmlcoin.com/api',
  FTC: 'https://explorer.feathercoin.com/api',
  NLG: 'https://guldenblocks.com/api',
  GRS: 'http://groestlsight.groestlcoin.org/api',  
  AUR: 'http://insight.auroracoin.is/api',
  GBX: 'https://insight.gobyte.network/insight-api-gobyte',
};

const urlParams = (params) => {
  const query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');
  return '?' + query;
}

const serverData = (obj) => {
  return {
    endPointName: obj.endPointName,
  };
}

const request = (server, options) => {
  return new Promise((resolve, reject) => {
    let _urlParams = {};

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

    let url;
    
    if (!options.hasOwnProperty('slash')) {
      url = `${insightEndPoints[server.endPointName.toUpperCase()]}/${options.url}${options.method === 'GET' ? urlParams(_urlParams) : ''}`;
    } else {
      url = `${insightEndPoints[server.endPointName.toUpperCase()]}/${options.url}`;
    }

    fetch(
      url,
      options.method === 'GET' ? {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
        },
      } : {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_urlParams),
      }
    )
    .catch((error) => {
      console.log(error);
      resolve(error)
    })
    .then((response) => {
      const _response = response.text().then((text) => { return text; });
      return _response;
    })
    .catch((error) => {
      console.log(error);
      resolve(error)
    })
    .then(json => {
      try {
        json = JSON.parse(json);
      } catch (e) {}

      if (typeof json === 'object' ||
          options.hasOwnProperty('returnValStr')) {
        resolve(json);
      } else {
        resolve(options.method === 'GET' ? {
          error: json,
          method: options.method,
          url,
        } : {
          error: json,
          method: options.method,
          url,
          body: JSON.stringify(_urlParams),
        });
      }
    });
  });
}

class insightConnnect {
  constructor(endPointName, options = void 0) {
    this.endPointName = endPointName;
  }

  getInfo() {
    return request(serverData(this), {
      method: 'GET',
      url: 'status',
      q: 'getInfo',
    });
  }

  getBalance(address) {
    return request(serverData(this), {
      method: 'GET',
      url: `addr/${address}/balance`,
      slash: true,
      returnValStr: true,
    });
  }

  // TODO: extended usage
  getHistory(address) {
    return request(serverData(this), {
      method: 'GET',
      url: 'txs',
      address,
      pageNum: 0,
    });
  }

  getUTXO(address) {
    return request(serverData(this), {
      method: 'GET',
      url: `addr/${address}/utxo`,
      slash: true,
    });
  }

  getTransaction(txid) {
    return request(serverData(this), {
      method: 'GET',
      url: `tx/${txid}`,
      slash: true,
    });
  }

  getFeeEstimate(blocks) {
    return request(serverData(this), {
      method: 'GET',
      url: 'utils/estimatefee',
      blocks,
    });
  }

  broadcast(rawtx) {
    return request(serverData(this), {
      method: 'POST',
      url: 'tx/send',
      rawtx,
    });
  }
}

module.exports = insightConnnect;