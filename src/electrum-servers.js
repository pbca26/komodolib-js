let electrumServers = {
  bntn: { // !estimatefee
    address: 'electrum1.cipig.net',
    port: 10026,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'BNTN',
    serverList: [
      'electrum1.cipig.net:10026',
      'electrum2.cipig.net:10026'
    ],
  },
  eql: { // !estimatefee
    address:'159.65.91.235',
    port: 10801,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'EQL',
    serverList: [
      '159.65.91.235:10801',
      '167.99.204.42:10801'
    ],
  },
   glxt: { // !estimatefee
    address: 'electrum1.glx.co',
    port: 60012,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'GLXT',
    serverList: [
      'electrum1.glx.co:60012',
      'electrum2.glx.co:60012'
    ],
  },
  coqui: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10011,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'COQUI',
    serverList: [
      'electrum1.cipig.net:10011',
      'electrum2.cipig.net:10011'
    ],
  },
  revs: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10003,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'REVS',
    serverList: [
      'electrum1.cipig.net:10003',
      'electrum2.cipig.net:10003'
    ],
  },
  supernet: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10005,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'SUPERNET',
    serverList: [
      'electrum1.cipig.net:10005',
      'electrum2.cipig.net:10005'
    ],
  },
  dex: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10006,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'DEX',
    serverList: [
      'electrum1.cipig.net:10006',
      'electrum2.cipig.net:10006'
    ],
  },
  bots: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10007,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'BOTS',
    serverList: [
      'electrum1.cipig.net:10007',
      'electrum2.cipig.net:10007'
    ],
  },
  crypto: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10008,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'CRYPTO',
    serverList: [
      'electrum1.cipig.net:10008',
      'electrum2.cipig.net:10008'
    ],
  },
  hodl: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10009,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'HODL',
    serverList: [
      'electrum1.cipig.net:10009',
      'electrum2.cipig.net:10009'
    ],
  },
  pangea: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10010,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'PANGEA',
    serverList: [
      'electrum1.cipig.net:10010',
      'electrum2.cipig.net:10010'
    ],
  },
  bet: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10012,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'BET',
    serverList: [
      'electrum1.cipig.net:10012',
      'electrum2.cipig.net:10012'
    ],
  },
  mshark: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10013,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'MSHARK',
    serverList: [
      'electrum1.cipig.net:10013',
      'electrum2.cipig.net:10013'
    ],
  },
  mnz: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10002,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'MNZ',
    serverList: [
      'electrum1.cipig.net:10002',
      'electrum2.cipig.net:10002'/*,
      '18.216.195.109:10002',
      '52.41.58.116:10002',
      '52.67.48.29:10002',
      '13.124.87.194:10002',
      '52.63.107.102:10002'*/
    ],
  },
  wlc: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10014,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'WLC',
    serverList: [
      'electrum1.cipig.net:10014',
      'electrum2.cipig.net:10014'
    ],
  },
  mgw: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10015,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'MGW',
    serverList: [
      'electrum1.cipig.net:10015',
      'electrum2.cipig.net:10015'
    ],
  },
  btch: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10020,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'BTCH',
    serverList: [
      'electrum1.cipig.net:10020',
      'electrum2.cipig.net:10020'
    ],
  },
  beer: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10022,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'BEER',
    serverList: [
      'electrum1.cipig.net:10022',
      'electrum2.cipig.net:10022'
    ],
  },
  oot: { // !estimatefee
    ip: 'electrum1.utrum.io',
    port: 10088,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'OOT',
    serverList: [
      'electrum1.utrum.io:10088',
      'electrum2.utrum.io:10088'
    ],
  },
  pizza: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10024,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'PIZZA',
    serverList: [
      'electrum1.cipig.net:10024',
      'electrum2.cipig.net:10024'
    ],
  },
  vote: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10021,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'VOTE',
    serverList: [
      'electrum1.cipig.net:10021',
      'electrum2.cipig.net:10021'
    ],
  },
  jumblr: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10004,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'JUMBLR',
    serverList: [
      'electrum1.cipig.net:10004',
      'electrum2.cipig.net:10004'
    ],
  },
  komodo: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10001,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'KMD',
    serverList: [
      'electrum1.cipig.net:10001',
      'electrum2.cipig.net:10001',
    ],
  },
  dogecoin: { // !estimatefee
    ip: '173.212.225.176',
    port: 50015,
    proto: 'tcp',
    txfee: 100000000,
    abbr: 'DOGE',
    serverList: [
      '173.212.225.176:50015',
      '136.243.45.140:50015'
    ],
  },
  viacoin: { // !estimatefee
    ip: '173.212.225.176',
    port: 50033,
    proto: 'tcp',
    txfee: 100000,
    abbr: 'VIA',
    serverList: [
      '173.212.225.176:50033',
      '136.243.45.140:50033'
    ],
  },
  vertcoin: {
    ip: '173.212.225.176',
    port: 50088,
    proto: 'tcp',
    txfee: 100000,
    abbr: 'VTC',
    serverList: [
      '173.212.225.176:50088',
      '136.243.45.140:50088'
    ],
  },
  namecoin: {
    ip: '173.212.225.176',
    port: 50036,
    proto: 'tcp',
    txfee: 100000,
    abbr: 'NMC',
    serverList: [
      '173.212.225.176:50036',
      '136.243.45.140:50036'
    ],
  },
  monacoin: { // !estimatefee
    ip: '173.212.225.176',
    port: 50002,
    proto: 'tcp',
    txfee: 100000,
    abbr: 'MONA',
    serverList: [
      '173.212.225.176:50002',
      '136.243.45.140:50002'
    ],
  },
  litecoin: {
    ip: '173.212.225.176',
    port: 50012,
    proto: 'tcp',
    txfee: 100000,
    abbr: 'LTC',
    serverList: [
      '173.212.225.176:50012',
      '136.243.45.140:50012'
    ],
  },
  faircoin: {
    ip: '173.212.225.176',
    port: 50005,
    proto: 'tcp',
    txfee: 1000000,
    abbr: 'FAIR',
    serverList: [
      '173.212.225.176:50005',
      '136.243.45.140:50005'
    ],
  },
  dgb: {
    ip: '173.212.225.176',
    port: 50022,
    proto: 'tcp',
    txfee: 100000,
    abbr: 'DGB',
    serverList: [
      '173.212.225.176:50022',
      '136.243.45.140:50022'
    ],
  },
  dash: {
    ip: '173.212.225.176',
    port: 50098,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'DASH',
    serverList: [
      '173.212.225.176:50098',
      '136.243.45.140:50098'
    ],
  },
  crown: {
    ip: '173.212.225.176',
    port: 50041,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'CRW',
    serverList: [
      '173.212.225.176:50041',
      '136.243.45.140:50041'
    ],
  },
  btc: {
    ip: 'e-x.not.fyi',
    port: 50001,
    proto: 'tcp',
    abbr: 'BTC',
    serverList: [
      'mooo.not.fyi:50011',
      'e-x.not.fyi:50001',
      'vps.hsmiths.com:50001',
      'us.electrum.be:50001',
      'electrumx.bot.nu:50001',
      'btc.asis.io:50001',
      'electrum.backplanedns.org:50001',
      'electrum.festivaldelhumor.org:50001'
    ],
  },
  btg: {
    ip: '173.212.225.176',
    port: 10052,
    proto: 'tcp',
    abbr: 'BTG',
    txfee: 10000,
    serverList: [
      '173.212.225.176:10052',
      '94.130.224.11:10052'
    ],
  },
  blk: { // pos
    ip: 'electrum1.cipig.net',
    port: 10054,
    proto: 'tcp',
    abbr: 'BLK',
    txfee: 10000,
    serverList: [
      'electrum1.cipig.net:10054',
      'electrum2.cipig.net:10054'
    ],
  },
  sib: {
    ip: 'electrum1.cipig.net',
    port: 10050,
    proto: 'tcp',
    abbr: 'SIB',
    txfee: 10000,
    serverList: [
      'electrum1.cipig.net:10050',
      'electrum2.cipig.net:10050'
    ],
  },
  bch: {
    ip: 'electrum1.cipig.net',
    port: 10051,
    proto: 'tcp',
    abbr: 'BCH',
    txfee: 10000,
    serverList: [
      'electrum1.cipig.net:10051',
      'electrum2.cipig.net:10051'
    ],
  },
  argentum: { // !estimatefee
    ip: '173.212.225.176',
    port: 50081,
    proto: 'tcp',
    txfee: 50000,
    abbr: 'ARG',
    serverList: [
      '173.212.225.176:50081',
      '136.243.45.140:50081'
    ],
  },
  chips: { // !estimatefee
    ip: 'electrum1.cipig.net',
    port: 10053,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'CHIPS',
    serverList: [
      'electrum1.cipig.net:10053',
      'electrum2.cipig.net:10053'
    ],
  },
  zec: {
    ip: '173.212.225.176',
    port: 50032,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'ZEC',
    serverList: [
      '173.212.225.176:50032',
      '136.243.45.140:50032'
    ],
  },
  hush: {
    ip: '173.212.225.176',
    port: 50013,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'HUSH',
    serverList: [
      '173.212.225.176:50013',
      '136.243.45.140:50013'
    ],
  },
  xmy: {
    ip: 'cetus.cryptap.us',
    port: 50004,
    proto: 'ssl',
    txfee: 5000,
    abbr: 'XMY',
    serverList: [
      'cetus.cryptap.us:50004',
      'kraken.cryptap.us:50004'
    ],
  },
  zcl: {
    ip: 'electrum1.cipig.net',
    port: 50055,
    proto: 'tcp',
    txfee: 1000,
    abbr: 'ZCL',
    serverList: [
      'electrum1.cipig.net:10055',
      'electrum2.cipig.net:10055'
    ],
  },
  hodlc: {
    ip: 'hodl.amit177.cf',
    port: 17989,
    proto: 'tcp',
    txfee: 5000,
    abbr: 'HODLC',
    serverList: [
      'hodl.amit177.cf:17989',
      'hodl2.amit177.cf:17898'
    ],
  },
  btx: {
    ip: 'electrum1.cipig.net',
    port: 10057,
    proto: 'tcp',
    txfee: 50000,
    abbr: 'BTX',
    serverList: [
      'electrum1.cipig.net:10057',
      'electrum2.cipig.net:10057'
    ],
  },
  btcz: {
    ip: 'electrum1.cipig.net',
    port: 10056,
    proto: 'tcp',
    txfee: 10000,
    abbr: 'BTCZ',
    serverList: [
      'electrum1.cipig.net:10056',
      'electrum2.cipig.net:10056'
    ],
  },
  grs: {
    ip: 'electrum10.groestlcoin.org',
    port: 50001,
    proto: 'tcp',
    txfee: 50000,
    abbr: 'GRS',
    serverList: [
      'electrum10.groestlcoin.org:50001',
      'electrum11.groestlcoin.org:50001'
    ],
  },
  qtum: {
    ip: 's1.qtum.info',
    port: 50001,
    proto: 'tcp',
    txfee: 400000,
    abbr: 'QTUM',
    serverList: [
      's1.qtum.info:50001',
      's2.qtum.info:50001'
    ],
  },
};

electrumServers.kmd = electrumServers.komodo;
electrumServers.crw = electrumServers.crown;
electrumServers.fair = electrumServers.faircoin;
electrumServers.arg = electrumServers.argentum;
electrumServers.ltc = electrumServers.litecoin;
electrumServers.mona = electrumServers.litecoin;
electrumServers.nmc = electrumServers.namecoin;
electrumServers.vtc = electrumServers.vertcoin;
electrumServers.via = electrumServers.viacoin;
electrumServers.doge = electrumServers.dogecoin;

module.exports = electrumServers;
