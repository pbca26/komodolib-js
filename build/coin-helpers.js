'use strict';

var _explorerList;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _komodoAssetChains = ['SUPERNET', 'REVS', 'PANGEA', 'PGT', 'DEX', 'JUMBLR', 'BET', 'CRYPTO', 'COQUI', 'HODL', 'MSHARK', 'BOTS', 'MGW', 'MVP', 'KV', 'CEAL', 'MESH', 'WLC', 'AXO', 'ETOMIC', 'BTCH', 'BEER', 'PIZZA', 'OOT', 'NINJA', 'VOTE2018', 'GLXT', 'EQL', 'BNTN', 'PRLPAY', 'CHAIN', 'ZILLA', 'DSEC', 'VRSC', 'MGNX', 'CCL', 'PIRATE', 'KOIN', 'DION', 'KMDICE', 'PTX', 'ZEX', 'SPLTEST', 'LUMBER', 'KSB', 'OUR'];

var _komodoCoins = _komodoAssetChains.concat(['CHIPS', 'KMD', 'KOMODO']);

var isKomodoCoin = function isKomodoCoin(coin, skipKMD) {
  return _komodoCoins.find(function (element) {
    if (skipKMD) {
      return element === coin.toUpperCase() && coin.toUpperCase() !== 'KMD' && coin.toUpperCase() !== 'KOMODO';
    }
    return element === coin.toUpperCase();
  });
};

// TODO: add at least 2 explorers per coin
var explorerList = (_explorerList = {
  KMD: 'https://www.kmdexplorer.io',
  // KMD asset chains
  DION: 'https://explorer.dionpay.com',
  KOIN: 'http://live.block.koinon.cloud',
  PTX: 'http://explorer1.patenttx.com',
  ZILLA: 'http://zilla.explorer.dexstats.info',
  MGNX: 'http://mgnx.explorer.dexstats.info',
  CCL: 'http://ccl.explorer.dexstats.info',
  PIRATE: 'http://pirate.explorer.dexstats.info',
  KV: 'https://kv.kmdexplorer.io',
  OOT: 'http://explorer.utrum.io',
  BNTN: 'http://chain.blocnation.io',
  CHAIN: 'http://explorer.chainmakers.co',
  GLXT: 'http://glx.info',
  PRLPAY: 'http://explorer.prlpay.com',
  PGT: 'https://pgt.komodo.build/',
  MSHARK: 'https://mshark.kmdexplorer.io',
  REVS: 'https://revs.kmdexplorer.io',
  SUPERNET: 'https://supernet.kmdexplorer.io',
  DEX: 'https://dex.kmdexplorer.io',
  PANGEA: 'https://pangea.kmdexplorer.io',
  JUMBLR: 'https://jumblr.kmdexplorer.io',
  BET: 'https://bet.kmdexplorer.io',
  CRYPTO: 'https://crypto.kmdexplorer.io',
  HODL: 'https://hodl.kmdexplorer.io',
  SHARK: 'http://SHARK.explorer.supernet.org',
  BOTS: 'https://bots.kmdexplorer.io',
  MGW: 'https://mgw.kmdexplorer.io',
  WLC: 'https://wlc.kmdexplorer.io',
  CHIPS: 'https://explorer.chips.cash',
  COQUI: 'https://explorer.coqui.cash',
  EQL: 'http://178.62.240.191',
  BTCH: 'https://btch.kmdexplorer.io',
  BTC: 'https://blockchain.info',
  HUSH: 'https://explorer.myhush.org',
  PIZZA: 'http://pizza.komodochainz.info',
  BEER: 'https://beer.kmdexplorer.io',
  NINJA: 'https://ninja.kmdexplorer.io',
  VOTE2018: 'http://88.99.226.252',
  DSEC: 'https://dsec.kmdexplorer.io',
  VRSC: 'https://explorer.veruscoin.io'
}, _defineProperty(_explorerList, 'DION', 'https://explorer.dionpay.com'), _defineProperty(_explorerList, 'KMDICE', 'http://kmdice.explorer.dexstats.info'), _defineProperty(_explorerList, 'PTX', 'http://explorer1.patenttx.com'), _defineProperty(_explorerList, 'ZEX', 'http://zex.explorer.dexstats.info'), _defineProperty(_explorerList, 'LUMBER', 'https://explorer.lumberscout.io'), _defineProperty(_explorerList, 'KSB', 'http://ksb.explorer.dexstats.info'), _defineProperty(_explorerList, 'OUR', 'http://our.explorer.dexstats.info'), _defineProperty(_explorerList, 'QTUM', 'https://explorer.qtum.org'), _defineProperty(_explorerList, 'DNR', 'http://denarius.name'), _defineProperty(_explorerList, 'LTC', 'https://live.blockcypher.com/ltc/tx/'), _defineProperty(_explorerList, 'DOGE', 'https://live.blockcypher.com/doge/tx/'), _defineProperty(_explorerList, 'DASH', 'https://live.blockcypher.com/dash/tx/'), _defineProperty(_explorerList, 'MONA', 'https://bchain.info/MONA'), _defineProperty(_explorerList, 'VIA', 'https://explorer.viacoin.org'), _defineProperty(_explorerList, 'VTC', 'http://explorer.vertcoin.info'), _defineProperty(_explorerList, 'NMC', 'https://namecha.in'), _defineProperty(_explorerList, 'DGB', 'https://digiexplorer.info'), _defineProperty(_explorerList, 'CRW', 'http://ex.crownlab.eu'), _defineProperty(_explorerList, 'ABY', 'http://explorer.artbyte.me'), _defineProperty(_explorerList, 'GAME', 'https://blockexplorer.gamecredits.com/transactions/'), _defineProperty(_explorerList, 'MAC', 'http://explorer.machinecoin.org'), _defineProperty(_explorerList, 'IOP', 'http://mainnet.iop.cash'), _defineProperty(_explorerList, 'BTG', 'https://btgexplorer.com'), _defineProperty(_explorerList, 'BCH', 'https://bitcoincash.blockexplorer.com'), _defineProperty(_explorerList, 'ZCL', 'http://explorer.zclmine.pro'), _defineProperty(_explorerList, 'SNG', 'https://explorer.snowgem.org/'), _defineProperty(_explorerList, 'ZMY', 'https://myriadexplorer.com'), _defineProperty(_explorerList, 'BTX', 'http://explorer.bitcore.cc'), _defineProperty(_explorerList, 'BTCZ', 'https://explorer.bitcoinz.site'), _defineProperty(_explorerList, 'HODLC', 'http://www.fuzzbawls.pw/explore/HOdlcoin/tx.php?tx='), _defineProperty(_explorerList, 'SUQA', 'http://suqaexplorer.com'), _defineProperty(_explorerList, 'SIB', 'https://chain.sibcoin.net/en/tx/'), _defineProperty(_explorerList, 'ZEC', 'https://explorer.zcha.in/transactions/'), _defineProperty(_explorerList, 'BLK', 'https://explorer.coinpayments.net/transaction.php?chain=4&hash='), _defineProperty(_explorerList, 'ARG', 'https://prohashing.com/explorer/Argentum/'), _defineProperty(_explorerList, 'FAIR', 'https://chain.fair.to/transaction?transaction='), _defineProperty(_explorerList, 'CRAVE', 'http://explorer.craveproject.net'), _defineProperty(_explorerList, 'FTC', 'https://explorer.feathercoin.com'), _defineProperty(_explorerList, 'NLG', 'https://guldenchain.com'), _defineProperty(_explorerList, 'PIVX', 'http://www.presstab.pw/phpexplorer/PIVX/tx.php?tx='), _defineProperty(_explorerList, 'DMD', 'https://chainz.cryptoid.info/dmd/search.dws?q='), _defineProperty(_explorerList, 'EFL', 'https://chainz.cryptoid.info/efl/search.dws?q='), _defineProperty(_explorerList, 'BSD', 'https://chainz.cryptoid.info/bsd/search.dws?q='), _defineProperty(_explorerList, 'ERC', 'https://chainz.cryptoid.info/erc/search.dws?q='), _defineProperty(_explorerList, 'SYS', 'https://chainz.cryptoid.info/sys/search.dws?q='), _defineProperty(_explorerList, 'EMC2', 'https://chainz.cryptoid.info/emc2/search.dws?q='), _defineProperty(_explorerList, 'IXC', 'https://chainz.cryptoid.info/ixc/search.dws?q='), _defineProperty(_explorerList, 'DGC', 'https://chainz.cryptoid.info/dgc/search.dws?q='), _defineProperty(_explorerList, 'XMY', 'https://chainz.cryptoid.info/xmy/search.dws?q='), _defineProperty(_explorerList, 'MUE', 'https://chainz.cryptoid.info/mue/search.dws?q='), _defineProperty(_explorerList, 'UNO', 'https://chainz.cryptoid.info/uno/search.dws?q='), _defineProperty(_explorerList, 'GRS', 'https://chainz.cryptoid.info/grs/search.dws?q='), _defineProperty(_explorerList, 'VOX', 'http://206.189.74.116:3001'), _defineProperty(_explorerList, 'AUR', 'http://insight.auroracoin.is'), _defineProperty(_explorerList, 'LBC', 'https://explorer.lbry.io'), _defineProperty(_explorerList, 'ACC', 'http://explorer.getadcoin.com:5000'), _defineProperty(_explorerList, 'VIVO', 'http://vivo.explorerz.top:3003'), _defineProperty(_explorerList, 'GBX', 'http://explorer.gobyte.network:5001'), _defineProperty(_explorerList, 'FJC', 'http://explorer.fujicoin.org'), _defineProperty(_explorerList, 'LINX', 'http://explorer.mylinx.io/?'), _defineProperty(_explorerList, 'CDN', 'https://explorer.canadaecoin.ca'), _defineProperty(_explorerList, 'FLASH', 'https://explorer.flashcoin.io'), _defineProperty(_explorerList, 'XZC', 'https://explorer.zcoin.io'), _defineProperty(_explorerList, 'XMCC', 'http://block.monacocoin.net:8080/tx/'), _defineProperty(_explorerList, 'STAK', 'https://straks.info/transaction/'), _defineProperty(_explorerList, 'SMART', 'https://explorer3.smartcash.cc/tx/'), _defineProperty(_explorerList, 'RAP', 'http://explorer.our-rapture.com/tx/'), _defineProperty(_explorerList, 'QMC', 'http://54.38.145.192:8080/tx/'), _defineProperty(_explorerList, 'POLIS', 'https://explorer.polispay.org/tx/'), _defineProperty(_explorerList, 'PAC', 'http://usa.pacblockexplorer.com:3002/tx/'), _defineProperty(_explorerList, 'MNX', 'https://minexexplorer.com/?r=explorer/tx&hash='), _defineProperty(_explorerList, 'BCBC', 'http://be.cleanblockchain.org/tx/'), _defineProperty(_explorerList, 'RDD', 'https://live.reddcoin.com'), _defineProperty(_explorerList, 'BZC', 'http://35.204.174.237:3001/insight/tx/'), _defineProperty(_explorerList, 'ETH', 'https://etherscan.io/tx/'), _defineProperty(_explorerList, 'ETH_ROPSTEN', 'https://ropsten.etherscan.io/tx/'), _defineProperty(_explorerList, 'SPLTEST', 'http://spltest.explorer.dexstats.info'), _explorerList);

var explorerListExt = {
  DEX: 'http://dex.explorer.komodo.services',
  SUPERNET: 'http://supernet.explorer.komodo.services'
};

module.exports = {
  isKomodoCoin: isKomodoCoin,
  explorerList: explorerList,
  explorerListExt: explorerListExt,
  kmdAssetChains: _komodoAssetChains,
  kmdCoins: _komodoCoins // all coins that share R-addresses
};