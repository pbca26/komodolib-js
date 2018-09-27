const networks = {
  '1337': {
    messagePrefix: '\x18Elite Signed Message:\n',
    pubKeyHash: 48,
    scriptHash: 28,
    wif: 176,
  },
  bun: {
    messagePrefix: '\x18BunnyCoin Signed Message:\n',
    pubKeyHash: 26,
    scriptHash: 22,
    wif: 154,
    headerHashAlgo: 'scrypt',
  },
  cat: {
    messagePrefix: '\x18Catcoin Signed Message:\n',
    pubKeyHash: 21,
    scriptHash: 5,
    wif: 149,
  },
  cloak: {
    messagePrefix: '\x18CloakCoin Signed Message:\n',
    pubKeyHash: 27,
    scriptHash: 85,
    wif: 155,
  },
  xcp: {
    messagePrefix: '\x18CounterParty Signed Message:\n',
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128,
  },
  cj: {
    messagePrefix: '\x18CryptoJacks Signed Message:\n', 
    pubKeyHash: 28, 
    scriptHash: 5, 
    wif: 156,   
  },
  note: {
    messagePrefix: '\x18DNotes Signed Message:\n',
    pubKeyHash: 31,
    scriptHash: 5,
    wif: 159,
  },
  dime: {
    messagePrefix: '\x18Dimecoin Signed Message:\n',
    pubKeyHash: 15,
    scriptHash: 9,
    wif: 143,
  },
  dope: {
    messagePrefix: '\x18Dopecoin Signed Message:\n',
    bip32: {
      public: 0x0488B21E,
      private: 0x0488ADE4,
    },
    pubKeyHash: 30,
    pubKeyHashAlt: 8,
    scriptHash: 5,
    wif: 158,
  },
  emc: {
    messagePrefix: '\x18Emercoin Signed Message:\n',
    pubKeyHash: 33,
    scriptHash: 5,
    wif: 128,
  },
  flap: {
    messagePrefix: '\x18FlappyCoin Signed Message:\n',
    pubKeyHash: 35,
    scriptHash: 5,
    wif: 163,
  },
  geert: {
    messagePrefix: '\x18Geertcoin Signed Message:\n',
    pubKeyHash: 38,
    scriptHash: 5,
    wif: 176,
  },
  huc: {
    messagePrefix: '\x18HunterCoin Signed Message:\n',
    pubKeyHash: 40,
    scriptHash: 5,
    wif: 168,
  },
  leo: {
    messagePrefix: '\x18LEOcoin Signed Message:\n',
    pubKeyHash: 18,
    scriptHash: 88,
    wif: 144,
  },
  lemon: {
    messagePrefix: '\x18LemonCoin Signed Message:\n',
    pubKeyHash: 48,
    scriptHash: 5,
    wif: 176,
  },
  mars: {
    messagePrefix: '\x18MarsCoin Signed Message:\n',
    pubKeyHash: 50,
    scriptHash: 5,
    wif: 178,
    headerHashAlgo: 'scrypt',
  },
  mgc: {
    messagePrefix: '\x18MergeCoin Signed Message:\n',
    pubKeyHash: 50,
    scriptHash: 5,
    wif: 178,
    transactionForm: 'ppc-timestamp',
    isPoS: true, // ?
  },
  moon: {
    messagePrefix: '\x18Mooncoin Signed Message:\n',
    pubKeyHash: 3,
    scriptHash: 5,
    wif: 131,
  },
  nlc2: {
    messagePrefix: '\x18NoLimitCoin Signed Message:\n',
    pubKeyHash: 53,
    scriptHash: 92,
    wif: 181,
  },
  pnd: {
    messagePrefix: '\x18PandaCoin Signed Message:\n',
    pubKeyHash: 55,
    scriptHash: 5,
    wif: 183,
  },
  part: {
    messagePrefix: '\x18Particl Signed Message:\n',
    pubKeyHash: 56,
    scriptHash: 60,
    wif: 108,
  },
  ptc: {
    messagePrefix: '\x18Pesetacoin Signed Message:\n',
    pubKeyHash: 47,
    scriptHash: 5,
    wif: 175,
  },
  xpm: {
    messagePrefix: '\x18Primecoin Signed Message:\n',
    pubKeyHash: 23,
    scriptHash: 5,
    wif: 151,
  },
  qrk: {
    messagePrefix: '\x18Quark Signed Message:\n',
    pubKeyHash: 58,
    scriptHash: 5,
    wif: 186,
  },
  song: {
    messagePrefix: '\x18SongCoin Signed Message:\n',
    pubKeyHash: 63,
    scriptHash: 5,
    wif: 191,
  },
  trc: {
    messagePrefix: '\x18TerraCoin Signed Message:\n',
    pubKeyHash: 0,
    scriptHash: 5,
    wif: 128,
  },
  tes: {
    messagePrefix: '\x18TeslaCoin Signed Message:\n',
    pubKeyHash: 11,
    scriptHash: 5,
    wif: 139,
  },
  tx: {
    messagePrefix: '\x18TransferCoin Signed Message:\n',
    pubKeyHash: 66,
    scriptHash: 5,
    wif: 153,
  },
  unify: {
    messagePrefix: '\x18Unify Signed Message:\n',
    pubKeyHash: 68,
    scriptHash: 5,
    wif: 196,    
  },
  bvc: {
    messagePrefix: '\x18BeaverCoin Signed Message:\n',
    pubKeyHash: 25,
    scriptHash: 5,
    wif: 176,
  },
};

for (let key in networks) {
  let _newParams = networks[key];
  _newParams.pubKeyHash = networks[key].pubKeyHash.toString(16);
  _newParams.scriptHash = networks[key].scriptHash.toString(16);
  _newParams.wif = networks[key].wif.toString(16);
  
  console.log(key + ': ' + JSON.stringify(_newParams));
}