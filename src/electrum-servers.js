const fees = require('./fees');

// TODO: add a script to sync electrum severs list from https://github.com/jl777/coins/tree/master/electrums

let _electrumServers = {
  zilla: [
    'electrum1.cipig.net:10028:tcp',
    'electrum2.cipig.net:10028:tcp',
  ],
  prlpay: [
    'electrum1.prlpay.com:9681:tcp',
    'electrum2.prlpay.com:9681:tcp',
  ],
  kv: [
    'electrum1.cipig.net:10016:tcp',
    'electrum2.cipig.net:10016:tcp',
  ],
  bntn: [
    'electrum1.cipig.net:10026:tcp',
    'electrum2.cipig.net:10026:tcp',
  ],
  eql: [
    '159.65.91.235:10801:tcp',
    '167.99.204.42:10801:tcp',
  ],
  oot: [
    'electrum1.utrum.io:10088:tcp',
    'electrum2.utrum.io:10088:tcp',
  ],
  coqui: [
    'electrum1.cipig.net:10011:tcp',
    'electrum2.cipig.net:10011:tcp',
  ],
  chain: [
    'electrum1.chainmakers.co:55417:tcp',
    'electrum2.chainmakers.co:55417:tcp',
  ],
  glxt: [
    'electrum1.glx.co:60012:tcp',
    'electrum2.glx.co:60012:tcp',
  ],
  revs: [
    'electrum1.cipig.net:10003:tcp',
    'electrum2.cipig.net:10003:tcp',
  ],
  supernet: [
    'electrum1.cipig.net:10005:tcp',
    'electrum2.cipig.net:10005:tcp',
  ],
  dex: [
    'electrum1.cipig.net:10006:tcp',
    'electrum2.cipig.net:10006:tcp',
  ],
  bots: [
    'electrum1.cipig.net:10007:tcp',
    'electrum2.cipig.net:10007:tcp',
  ],
  crypto: [
    'electrum1.cipig.net:10008:tcp',
    'electrum2.cipig.net:10008:tcp',
  ],
  dnr: [
    '144.202.95.223:50001:tcp',
    '45.77.137.111:50001:tcp',
  ],
  hodl: [
    'electrum1.cipig.net:10009:tcp',
    'electrum2.cipig.net:10009:tcp',
  ],
  pangea: [
    'electrum1.cipig.net:10010:tcp',
    'electrum2.cipig.net:10010:tcp',
  ],
  bet: [
    'electrum1.cipig.net:10012:tcp',
    'electrum2.cipig.net:10012:tcp',
  ],
  mshark: [
    'electrum1.cipig.net:10013:tcp',
    'electrum2.cipig.net:10013:tcp',
  ],
  mnz: [
    'electrum1.cipig.net:10002:tcp',
    'electrum2.cipig.net:10002:tcp',
  ],
  wlc: [
    'electrum1.cipig.net:10014:tcp',
    'electrum2.cipig.net:10014:tcp',
  ],
  mgw: [
    'electrum1.cipig.net:10015:tcp',
    'electrum2.cipig.net:10015:tcp',
  ],
  btch: [
    'electrum1.cipig.net:10020:tcp',
    'electrum2.cipig.net:10020:tcp',
  ],
  beer: [
    'electrum1.cipig.net:10022:tcp',
    'electrum2.cipig.net:10022:tcp',
  ],
  pizza: [
    'electrum1.cipig.net:10024:tcp',
    'electrum2.cipig.net:10024:tcp',
  ],
  vote2018: [
    'electrum1.cipig.net:10021:tcp',
    'electrum2.cipig.net:10021:tcp',
  ],
  ninja: [
    'electrum1.fund.ninja:50001:tcp',
    'electrum2.fund.ninja:50001:tcp',
  ],
  jumblr: [
    'electrum1.cipig.net:10004:tcp',
    'electrum2.cipig.net:10004:tcp',
  ],
  kmd: [
    'electrum1.cipig.net:10001:tcp',
    'electrum2.cipig.net:10001:tcp',
  ],
  doge: [
    'electrum1.cipig.net:10060:tcp',
    'electrum2.cipig.net:10060:tcp',
  ],
  via: [
    'viax1.bitops.me:50001:tcp',
    'viax2.bitops.me:50001:tcp',
    'viax3.bitops.me:50001.tcp',
  ],
  vtc: [
    'fr1.vtconline.org:55001:tcp',
    'uk1.vtconline.org:55001:tcp',
  ],
  nmc: [
    'electrum1.cipig.net:10066:tcp',
    'electrum2.cipig.net:10066:tcp',
  ],
  mona: [
    'electrumx1.monacoin.nl:50001:tcp',
    'electrumx2.monacoin.nl:50001:tcp',
    'electrumx1.monacoin.ninja:50001:tcp',
    'electrumx2.monacoin.ninja:50001:tcp',
  ],
  ltc: [
    'electrum1.cipig.net:10065:tcp',
    'electrum2.cipig.net:10065:tcp',
  ],
  fair: [
    'electrum1.cipig.net:10063:tcp',
    'electrum2.cipig.net:10063:tcp',
  ],
  dgb: [
    'electrum1.cipig.net:10059:tcp',
    'electrum2.cipig.net:10059:tcp',
  ],
  dash: [
    'electrum1.cipig.net:10061:tcp',
    'electrum2.cipig.net:10061:tcp',
  ],
  crw: [
    'sgp-crwseed.crowndns.info:50001:tcp',
    'blr-crwseed.crowndns.info:50001:tcp',
    'sfo-crwseed.crowndns.info:50001:tcp',
    'nyc-crwseed.crowndns.info:50001:tcp',
    'ams-crwseed.crowndns.info:50001:tcp',
    'tor-crwseed.crowndns.info:50001:tcp',
    'lon-crwseed.crowndns.info:50001:tcp',
    'fra-crwseed.crowndns.info:50001:tcp',
  ],
  btc: [
    'electrum1.cipig.net:10000:tcp',
    'electrum2.cipig.net:10000:tcp',
    'electrum3.cipig.net:10000:tcp',
  ],
  btg: [
    'electrumx-eu.bitcoingold.org:50001:tcp',
    'electrumx-us.bitcoingold.org:50001:tcp',
    'electrumx-eu.btcgpu.org:50001:tcp',
    'electrumx-us.btcgpu.org:50001:tcp',
  ],
  blk: [
    'electrum1.cipig.net:10054:tcp',
    'electrum2.cipig.net:10054:tcp',
  ],
  sib: [
    'electrum1.cipig.net:10050:tcp',
    'electrum2.cipig.net:10050:tcp',
  ],
  bch: [
    'electrum1.cipig.net:10051:tcp',
    'electrum2.cipig.net:10051:tcp',
  ],
  arg: [
    'electrum1.cipig.net:10068:tcp',
    'electrum2.cipig.net:10068:tcp',
  ],
  chips: [
    'electrum1.cipig.net:10053:tcp',
    'electrum2.cipig.net:10053:tcp',
  ],
  zec: [
    'electrum1.cipig.net:10058:tcp',
    'electrum2.cipig.net:10058:tcp',
  ],
  hush: [
    'electrum1.cipig.net:10064:tcp',
    'electrum2.cipig.net:10064:tcp',
  ],
  sng: [
    'electrumsvr.snowgem.org:50001:tcp',
    'electrumsvr2.snowgem.org:50001:tcp',
    'electrumsvr.snowgem.org:50002:ssl',
    'electrumsvr2.snowgem.org:50002:ssl',
  ],
  xmy: [
    'cetus.cryptap.us:50004:ssl',
    'kraken.cryptap.us:50004:ssl',
  ],
  zcl: [
    'electrum1.cipig.net:10055:tcp',
    'electrum2.cipig.net:10055:tcp',
  ],
  hodlc: [
    'hodl.amit177.cf:17989:tcp',
    'hodl2.amit177.cf:17898:tcp',
  ],
  btx: [
    'electrum1.cipig.net:10057:tcp',
    'electrum2.cipig.net:10057:tcp',
  ],
  btcz: [
    'electrum1.cipig.net:10056:tcp',
    'electrum2.cipig.net:10056:tcp',
  ],
  grs: [
    'electrum10.groestlcoin.org:50001:tcp',
    'electrum11.groestlcoin.org:50001:tcp',
  ],
  qtum: [
    's1.qtum.info:50001:tcp',
    's2.qtum.info:50001:tcp',
  ],
  btcp: [
    'electrum.btcprivate.org:5222:tcp',
    'electrum2.btcprivate.org:5222:tcp',
  ],
  emc2: [
    'electrum1.cipig.net:10062:tcp',
    'electrum2.cipig.net:10062:tcp',
  ],
  bcbc: [
    'bsmn0.cleanblockchain.io:50001:tcp',
    'bsmn1.cleanblockchain.io:50001:tcp',
  ],
  game: [
    'electrum1.cipig.net:10072:tcp',
    'electrum2.cipig.net:10072:tcp',
  ],
  fjc: [
    'electrumx1.fujicoin.org:50001:tcp',
    'electrumx2.fujicoin.org:50001:tcp',
    'electrumx3.fujicoin.org:50001:tcp',
  ],
  ftc: [
    'electrum1.cipig.net:10074:tcp',
    'electrum2.cipig.net:10074:tcp',
    'electrum3.cipig.net:10074:tcp',
  ],
  polis: [
    'electrum1.cipig.net:10075:tcp',
    'electrum2.cipig.net:10075:tcp',
    'electrum3.cipig.net:10075:tcp',
  ],
  xmcc: [
    'electrum1.cipig.net:10076:tcp',
    'electrum2.cipig.net:10076:tcp',
    'electrum3.cipig.net:10076:tcp',
  ],
  xzc: [
    'electrumx01.zcoin.io:50001:tcp',
    'electrumx02.zcoin.io":50001:tcp',
    '45.63.92.224:50001:tcp',
    '45.77.67.235:50001:tcp',
  ],
  gbx: [
    'electrum1.cipig.net:10073:tcp',
    'electrum2.cipig.net:10073:tcp',
    'electrum3.cipig.net:10073:tcp',
  ],
  mac: [
    'electrum1.cipig.net:10077:tcp',
    'electrum2.cipig.net:10077:tcp',
    'electrum3.cipig.net:10077:tcp',
  ],
  mnx: [
    'electrum1.cipig.net:10079:tcp',
    'electrum2.cipig.net:10079:tcp',
    'electrum3.cipig.net:10079:tcp',
  ],
  call: [
    'electrum1.mycapitalco.in:10000:tcp',
    'electrum2.mycapitalco.in:10000:tcp',
  ],
  ccl: [
    'electrum1.cipig.net:10029:tcp',
    'electrum2.cipig.net:10029:tcp',
    'electrum3.cipig.net:10029:tcp',
  ],
  vrsc: [
    'el0.vrsc.0x03.services:10000:tcp',
    'el1.vrsc.0x03.services:10000:tcp',
  ],
  // src: CryptoWallet.si
  arco: [
    'node1.cryptowallet.si:5095:tcp',
    'node2.cryptowallet.si:5095:tcp',
  ],
  lana: [
    'node1.cryptowallet.si:5097:tcp',
    'node2.cryptowallet.si:5097:tcp',
  ],
  neva: [
    'node1.cryptowallet.si:5096:tcp',
    'node2.cryptowallet.si:5096:tcp',
  ],
  netko: [
    'node1.cryptowallet.si:5108:tcp',
    'node2.cryptowallet.si:5108:tcp',
  ],
  taj: [
    'node1.cryptowallet.si:5098:tcp',
    'node2.cryptowallet.si:5098:tcp',
  ],
  xvg: [
    'e1.verge-electrum.com:50002:tcp',
    'e2.verge-electrum.com:50002:tcp',
    'e1.verge-electrum.com:50003:ssl',
    'e2.verge-electrum.com:50003:ssl',
    '46.163.118.201:50002:ssl',
  ],
  cesc: [
    'electrum1.cryptoescudo.org:50001:tcp',
    'electrum2.cryptoescudo.org:50001:tcp',
    'electrum3.cryptoescudo.org:50001:tcp',
  ],
  mue: [
    '181.214.148.6:50001:tcp',
    '37.59.209.76:50001:tcp',
    '181.214.148.6:50002:tcp',
  ],
  uno: [
    'electrum1.unobtanium.uno:50006:ssl',
    'electrum2.unobtanium.uno:50006:ssl',
    'nigeria1.unobtanium.uno:50006:ssl',
    'nigeria2.unobtanium.uno:50006:ssl',
  ],
  koto: [
    'kotocoin.info:50001:tcp',
    'kotocoin.info:50002:ssl',
    'fr3.kotocoin.info:50002:ssl',
    'fr.kotocoin.info:50001:tcp',
    'fr.kotocoin.info:50002:ssl',
    'electrum.okoto.xyz:50002:ssl',
    'fr3.kotocoin.info:50001:tcp',
    'electrumx-koto.tamami-foundation.org:50002:ssl',
    'electrum.kotocoin.info:50002:ssl',
    'electrum.kotocoin.info:50001:tcp',
    'electrumx-koto.tamami-foundation.org:50001:tcp',
  ],
  rdd: [
    'reddcoin.corgi.party:50002:ssl', // (?)
    'corgicoe4n4bmchm.onion:50001:tcp',
  ],
  pak: [
    '108.61.246.159:50001:tcp',
  ],
  cpc: [
    'electrum1.capricoin.org:50011:tcp',
    'electrum2.capricoin.org:50011:tcp',
    'electrum1.capricoin.org:50012:ssl',
    'electrum2.capricoin.org:50012:ssl',
  ],
  rap: [
    'electrum.our-rapture.com:50001:tcp:',
    'electrum2.our-rapture.com:50001:tcp',
    '194.87.145.250:50016:ssl',
  ],
  qmc: [
    '45.32.185.157:50001:tcp',
    '95.179.134.215:50001:tcp',
  ],
  smart: [
    'electrum1.smartcash.cc:50001:tcp',
    'electrum2.smartcash.cc:50001:tcp',
    'electrum3.smartcash.cc:50001:tcp',
    'electrum4.smartcash.cc:50001:tcp',
  ],
  pac: [
    'electrum.paccoin.io:50001:tcp',
    'electro-pac.paccoin.io:50001:tcp',
  ],
  stak: [
    'ex001-stak.qxu.io:50001:tcp',
    'ex002-stak.qxu.io:50001:tcp',
    'electrumx.straks.info:50001:tcp',
  ],
  // src: altcoin wallet
  goa: [ // goacoin
    '194.87.145.250:50002:ssl',
  ],
  inn: [ // innova
    '194.87.145.250:50004:ssl',
  ],
  crc: [ // crowd
    '194.87.145.250:50006:ssl',
  ],
  tzc: [ // trezarcoin
    '194.87.145.250:50018:ssl',
  ],
  eny: [ // emergencycoin
    '194.87.145.250:50028:ssl',
  ],
  xsc: [ // sobercoin
    '194.87.145.250:50030:ssl',
  ],
  vcash: [
    'ex01.vcash.info:50001:ssl', // ssl?
  ],
  piggy: [
    'electrum.piggy-coin.com:54485:tcp', // ssl?
    'piggy.electrum.blockpunk.com:54485:tcp'
  ],
  onix: [ // onixcoin
    '159.203.80.31:23000:tcp', // ssl?
    '159.203.80.31:23001:tcp',
  ],
  lkr: [ // lkrcoin
    '190.202.15.196:23000:tcp', // ssl?
    '190.202.15.196:23001:tcp',
  ],
  arepa: [ // arepacoin
    '107.150.6.159:50001:tcp', // ssl?
    '107.150.6.159:50002:tcp',
  ],
  aib: [
    'aib-cce-1.iobond.com:5037:tcp',
    'aib-cce-2.iobond.com:5037:tcp',
    'server1.payoto.com:5037:tcp',
    'server2.payoto.com:5037:tcp',
    'server3.payoto.com:5037:tcp',
    'server4.payoto.com:5037:tcp',
  ],
};

let electrumServers = {};

for (let key in _electrumServers) {
  electrumServers[key] = {
    txfee: fees[key] ? fees[key] : 0,
    serverList: _electrumServers[key],
  };
}

module.exports = electrumServers;