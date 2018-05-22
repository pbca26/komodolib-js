/*
  Bitcoinjs-lib network params file
*/

// TODO: runtime extend for kmd assets

const bitcoin = require('bitcoinjs-lib');

let networks = {
  btc: bitcoin.networks.bitcoin,
  ltc: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
    dustThreshold: 0 // https://github.com/litecoin-project/litecoin/blob/v0.8.7.2/src/main.cpp#L360-L365
  },
  dnr: {
    messagePrefix: '\x19Denarius Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x5a,
    wif: 0x9e,
    dustThreshold: 1000,
    isPoS: true,
  },
  doge: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
    dustThreshold: 0, // https://github.com/dogecoin/dogecoin/blob/v1.7.1/src/core.h#L155-L160
  },
  // https://github.com/monacoinproject/monacoin/blob/master-0.10/src/chainparams.cpp#L161
  mona: {
    messagePrefix: '\x19Monacoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x32,
    scriptHash: 0x05,
    wif: 0xB2,
    dustThreshold: 546, // https://github.com/bitcoin/bitcoin/blob/v0.9.2/src/core.h#L151-L162
  },
  game: {
    messagePrefix: '\x19GameCredits Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x26,
    scriptHash: 0x5,
    wif: 0xA6,
    dustThreshold: 546,
  },
  // https://github.com/dashpay/dash/blob/master/src/chainparams.cpp#L171
  dash: {
    messagePrefix: '\x19DarkCoin Signed Message:\n',
    bip32: {
      public: 0x02fe52f8,
      private: 0x02fe52cc,
    },
    pubKeyHash: 0x4c,
    scriptHash: 0x10,
    wif: 0xcc,
    dustThreshold: 5460, // https://github.com/dashpay/dash/blob/v0.12.0.x/src/primitives/transaction.h#L144-L155
  },
  // https://github.com/zcoinofficial/zcoin/blob/c93eccb39b07a6132cb3d787ac18be406b24c3fa/src/base58.h#L275
  xzc: {
    messagePrefix: '\x19ZCoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x52,
    scriptHash: 0x07,
    wif: 0x52 + 128,
    dustThreshold: 1000, // https://github.com/zcoinofficial/zcoin/blob/f755f95a036eedfef7c96bcfb6769cb79278939f/src/main.h#L59,
    isZcash: true,
  },
  // https://raw.githubusercontent.com/jl777/komodo/beta/src/chainparams.cpp
  kmd: {
    messagePrefix: '\x19Komodo Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3c,
    scriptHash: 0x55,
    wif: 0xbc,
    dustThreshold: 1000,
    isZcash: true,
  },
  via: {
    messagePrefix: '\x19Viacoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x47,
    scriptHash: 0x21,
    wif: 0xc7,
    dustThreshold: 1000,
  },
  vert: {
    messagePrefix: '\x19Vertcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x47,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
  name: {
    messagePrefix: '\x19Namecoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x34,
    scriptHash: 0xd,
    wif: 0xb4,
    dustThreshold: 1000,
  },
  fair: {
    messagePrefix: '\x19Faircoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x5f,
    scriptHash: 0x24,
    wif: 0xdf,
    dustThreshold: 1000,
  },
  dgb: {
    messagePrefix: '\x19Digibyte Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
  crown: {
    messagePrefix: '\x19Crown Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x0,
    scriptHash: 0x1c,
    wif: 0x80,
    dustThreshold: 1000,
  },
  arg: {
    messagePrefix: '\x19Argentum Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x17,
    scriptHash: 0x5,
    wif: 0x97,
    dustThreshold: 1000,
  },
  chips: {
    messagePrefix: '\x19Chips Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3c,
    scriptHash: 0x55,
    wif: 0xbc,
    dustThreshold: 1000,
  },
  btg: {
    messagePrefix: '\x19BitcoinGold Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x26,
    scriptHash: 0x17,
    wif: 0x80,
    dustThreshold: 1000,
  },
  bch: {
    messagePrefix: '\x19BitcoinCash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x0,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
  blk: {
    messagePrefix: '\x19BlackCoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x19,
    scriptHash: 0x55,
    wif: 0x99,
    dustThreshold: 1000,
    isPoS: true,
  },
  sib: {
    messagePrefix: '\x19SibCoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3f,
    scriptHash: 0x28,
    wif: 0x80,
    dustThreshold: 1000,
  },
  zec: {
    messagePrefix: '\x19Zcash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x05358394,
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  hush: {
    messagePrefix: '\x19Hush Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  zcl: {
    messagePrefix: '\x19Zclassic Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  sng: {
    messagePrefix: '\x19Snowgem Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x05358394,
    },
    pubKeyHash: 0x1c28,
    scriptHash: 0x1c2D,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  xmy: {
    messagePrefix: '\x19Myriad Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x32,
    scriptHash: 0x9,
    wif: 0xB2,
    dustThreshold: 1000,
  },
  hodlc: {
    messagePrefix: '\x19Hodlc Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x28,
    scriptHash: 0x5,
    wif: 0x28 + 128,
    dustThreshold: 1000,
  },
  qtum: {
    messagePrefix: '\x19Qtum Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3A,
    scriptHash: 0x32,
    wif: 0x80,
    dustThreshold: 1000,
  },
  btx: {
    messagePrefix: '\x19Bitcore Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x0,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
  btcz: {
    messagePrefix: '\x19BitcoinZ Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  grs: { // fails to gen a proper addr
    messagePrefix: '\x19Groestlcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x24,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
  aby: {
    messagePrefix: '\x19ArtByte Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x17,
    scriptHash: 0x5,
    wif: 0x97,
    dustThreshold: 1000,
  },
  mac: {
    messagePrefix: '\x19Machinecoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x32,
    scriptHash: 0x5,
    wif: 0xB2,
    dustThreshold: 1000,
  },
  vot: {
    messagePrefix: '\x19VoteCoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x05358394,
    },
    pubKeyHash: 0x1cb8,
    scriptHash: 0x1cbd,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  iop: {
    messagePrefix: '\x19IOP Signed Message:\n',
    bip32: {
      public: 0x2780915F,
      private: 0xAE3416F6,
    },
    pubKeyHash: 0x75,
    scriptHash: 0xAE,
    wif: 0x31,
    dustThreshold: 1000,
  },
  bdl: {
    messagePrefix: '\x19Bitdeal Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x26,
    scriptHash: 0x5,
    wif: 0xB0,
    dustThreshold: 1000,
  },
  btcp: {
    messagePrefix: '\x19BitcoinPrivate Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1325,
    scriptHash: 0x13AF,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  // https://github.com/zencashio/zen/blob/master/src/chainparams.cpp#L118
  zen: { // new address type
    messagePrefix: '\x19Zencashio Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x2089,
    scriptHash: 0x2086,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  sys: { // zec based
    messagePrefix: '\x19Syscoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3F,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
    isZcash: true,
  },
  emc2: {
    messagePrefix: '\x19Einsteinium Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x21,
    scriptHash: 0x5,
    wif: 0x37,
    dustThreshold: 1000,
  },
  // https://github.com/BTA-BATA/BATA-SOURCE/blob/master/src/chainparams.cpp#L156
  bta: {
    messagePrefix: '\x19Bata Signed Message:\n',
    bip32: {
      public: 0xA40C86FA,
      private: 0xA40B91BD,
    },
    pubKeyHash: 0x19,
    scriptHash: 0x5,
    wif: 0x55,
    dustThreshold: 1000,
  },
  // https://github.com/EuropecoinEUORG/Europecoin-V3/blob/master/src/chainparams.cpp#L139
  erc: {
    messagePrefix: '\x19Europecoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x21,
    scriptHash: 0x5,
    wif: 0x28 + 128,
    dustThreshold: 1000,
  },
  // https://github.com/lbryio/lbrycrd/blob/master/src/chainparams.cpp#L176
  lbc: {
    messagePrefix: '\x19LBRY Credits Signed Message:\n',
    bip32: {
      public: 0x019C354f,
      private: 0x019C3118,
    },
    pubKeyHash: 0x55,
    scriptHash: 0x7a,
    wif: 0x1c,
    dustThreshold: 1000,
  },
  // https://github.com/LIMXTEC/BitSend/blob/master/src/chainparams.cpp#L136
  bsd: {
    messagePrefix: '\x19Bitsend Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x66,
    scriptHash: 0x5,
    wif: 0xCC,
    dustThreshold: 1000,
  },
  // https://github.com/gobytecoin/gobyte/blob/master/src/chainparams.cpp#L127
  gbx: {
    messagePrefix: '\x19GoByte Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x26,
    scriptHash: 0xA,
    wif: 0xC6,
    dustThreshold: 1000,
  },
  // https://github.com/Electronic-Gulden-Foundation/egulden/blob/master/src/chainparams.cpp#L139
  efl: {
    messagePrefix: '\x19E-Gulden Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x5,
    wif: 0xB0,
    dustThreshold: 1000,
  },
  // https://github.com/Whitecoin-org/whitecoin/blob/master/src/chainparams.cpp#L91
  xwc: { // wrong address generated
    messagePrefix: '\x19Whitecoin Signed Message:\n',
    bip32: {
      public: 0x043587CF,
      private: 0x04358394,
    },
    pubKeyHash: 0x6F,
    scriptHash: 0xC4,
    wif: 0xEF,
    dustThreshold: 1000,
  },
  // https://github.com/vivocoin/vivo/blob/master/src/chainparams.cpp#L133
  vivo: {
    messagePrefix: '\x19Vivo Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x46,
    scriptHash: 0xA,
    wif: 0xC6,
    dustThreshold: 1000,
  },
  xvg: {
    messagePrefix: '\x19Verge Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x9e,
    wif: 0x6,
    dustThreshold: 1000,
  },
  vcash: { // wrong address generated
    messagePrefix: '\x19Vcash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x47,
    scriptHash: 0xc7,
    wif: 0x6,
    dustThreshold: 1000,
  },
  // https://github.com/unobtanium-official/Unobtanium/blob/master/src/chainparams.cpp#L157
  uno: {
    messagePrefix: '\x19Unobtanium Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x82,
    scriptHash: 0x1E,
    wif: 0xBF,
    dustThreshold: 1000,
  },
  smart: { // wrong address generated
    messagePrefix: '\x19Smartcash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3F,
    scriptHash: 0x12,
    wif: 0xBF,
    dustThreshold: 1000,
    isZcash: true,
  },
  // https://github.com/reddcoin-project/reddcoin/blob/master/src/chainparams.cpp#L79
  rdd: {
    messagePrefix: '\x19Reddcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3D,
    scriptHash: 0x5,
    wif: 0xBD,
    dustThreshold: 1000,
  },
  // https://github.com/PIVX-Project/PIVX/blob/master/src/chainparams.cpp#L180
  pivx: {
    messagePrefix: '\x19Pivx Signed Message:\n',
    bip32: {
      public: 0x022D2533,
      private: 0x0221312B,
    },
    pubKeyHash: 0x1E,
    scriptHash: 0xD,
    wif: 0xD4,
    dustThreshold: 1000,
  },
  // https://github.com/OmniLayer/omnicore/blob/master/src/chainparams.cpp#L128
  omni: {
    messagePrefix: '\x19OmniLayer Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x0,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
  ok: {
    messagePrefix: '\x19OKCash Signed Message:\n',
    bip32: {
      public: 0x03CC23D7,
      private: 0x03CC1C73,
    },
    pubKeyHash: 0x37,
    scriptHash: 0x1C,
    wif: 0xB7,
    dustThreshold: 1000,
  },
  neos: {
    messagePrefix: '\x19Neoscoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x35,
    scriptHash: 0x5,
    wif: 0xB1,
    dustThreshold: 1000,
  },
  // https://github.com/NAVCoin/navcoin-core/blob/master/src/chainparams.cpp#L160
  nav: {
    messagePrefix: '\x19Navcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x35,
    scriptHash: 0x55,
    wif: 0x96,
    dustThreshold: 1000,
  },
  // https://github.com/minexcoin/minexcoin/blob/master/src/chainparams.cpp#L259
  mnx: {
    messagePrefix: '\x19Minexcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x4B,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
  lcc: {
    messagePrefix: '\x19Litecoin Cash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1C,
    scriptHash: 0x5,
    wif: 0x32,
    dustThreshold: 1000,
  },
  // https://github.com/Gulden/gulden-official/blob/master/src/chainparams.cpp#L128
  nlg: {
    messagePrefix: '\x19Gulden Cash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x26,
    scriptHash: 0x62,
    wif: 0x26 + 128,
    dustThreshold: 1000,
  },
  // https://github.com/fujicoin/fujicoin/blob/master/src/chainparams.cpp#L132
  fjc: {
    messagePrefix: '\x19Fujicoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x24,
    scriptHash: 0x10,
    wif: 0xA4,
    dustThreshold: 1000,
  },
  // https://github.com/flash-coin/bitcore-lib/commit/97d72267f3577173ee90d46b43553af801b214f2#diff-014a66be6f0ee0e90f9357d497267195R144
  flash: {
    messagePrefix: '\x19Flash Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x44,
    scriptHash: 0x82,
    wif: 0xc4,
    dustThreshold: 1000,
  },
  // https://github.com/FeatherCoin/Feathercoin/blob/master-0.13/src/chainparams.cpp#L132
  ftc: {
    messagePrefix: '\x19FeatherCoin Signed Message:\n',
    bip32: {
      public: 0x048BC26,
      private: 0x0488DAEE,
    },
    pubKeyHash: 0xE,
    scriptHash: 0x5,
    wif: 0x8E,
    dustThreshold: 1000,
  },
  // https://github.com/exclfork/ExclusiveCoin/blob/master/src/chainparams.cpp#L82
  excl: {
    messagePrefix: '\x19ExclusiveCoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x21,
    scriptHash: 0x89,
    wif: 0xA1,
    dustThreshold: 1000,
  },
  // https://github.com/DMDcoin/Diamond/blob/master/src/chainparams.cpp#L166
  dmd: {
    messagePrefix: '\x19Diamond Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x5A,
    scriptHash: 0x8,
    wif: 0xDA,
    dustThreshold: 1000,
  },
  // https://github.com/CooleRRSA/crave/blob/master/src/chainparams.cpp#L99
  crave: { // wrong address generated, another fork is used?
    messagePrefix: '\x19Crave Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1B,
    scriptHash: 0x55,
    wif: 0x99,
    dustThreshold: 1000,
  },
  // https://github.com/BitClubDev/ClubCoin/blob/master/src/chainparams.cpp#L114
  club: {
    messagePrefix: '\x19ClubCoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x1C,
    scriptHash: 0x55,
    wif: 0x99,
    dustThreshold: 1000,
  },
  // https://github.com/nochowderforyou/clams/blob/master/src/chainparams.cpp#L93
  clam: {
    messagePrefix: '\x19Clams Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x89,
    scriptHash: 0xD,
    wif: 0x85,
    dustThreshold: 1000,
  },
  // https://github.com/bitcoin-atom/bitcoin-atom/blob/master/src/chainparams.cpp#L168
  bca: {
    messagePrefix: '\x19Bitcoin Atom Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x17,
    scriptHash: 0xA,
    wif: 0x80,
    dustThreshold: 1000,
  },
  // https://github.com/aurarad/Auroracoin/blob/master/src/chainparams.cpp#L77
  aur: {
    messagePrefix: '\x19Auroracoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x17,
    scriptHash: 0xA,
    wif: 0xB0,
    dustThreshold: 1000,
  },
  // https://github.com/adcoin-project/AdCoin/blob/master/src/chainparams.cpp#L129
  acc: {
    messagePrefix: '\x19AdCoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x17,
    scriptHash: 0x5,
    wif: 0xB0,
    dustThreshold: 1000,
  },
  bcbc: {
    messagePrefix: '\x19Bitcoin CBC Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x0,
    scriptHash: 0x5,
    wif: 0x80,
    dustThreshold: 1000,
  },
}

module.exports = networks;