/*
 *  Usage: - clone https://github.com/jl777/coinscopy
 *         - paste coins data into coins.js
 *         - run node jl777-coins-parser -flags=
 *         - params can be a combination of flags: spv/eth, names/tickers/ids(for ecrc20 tokens)
 */

const coins = require('./coins.js');
let flags = {};

process.argv.forEach((val, index) => {  
  if (index === 2 &&
      val.indexOf('-flags=') > -1) {
    const _flags = val.split('-flags=')[1].split(',');

    for (let i = 0; i < _flags.length; i++) {
      flags[_flags[i]] = true;
    }

    console.log(`flags ${JSON.stringify(flags)}`);
  }
});

if (!Object.keys(flags).length) {
  console.log('no flags provided');
} else {
  if (flags.eth) {
    if (flags.ids) {
      for (let i = 0; i < coins.length; i++) {
        if (coins[i].etomic) {
          console.log(`${coins[i].coin}: '${coins[i].etomic}',`);
        }
      }
    }

    if (flags.names) {
      for (let i = 0; i < coins.length; i++) {
        if (coins[i].etomic) {
          console.log(`${coins[i].coin}: '${coins[i].fname}',`);
        }
      }
    } else if (flags.tickers) {
      for (let i = 0; i < coins.length; i++) {
        if (coins[i].etomic) {
          console.log(`'${coins[i].coin}',`);
        }
      }
    }
  } else if (flags.spv) {
    if (flags.names) {
      for (let i = 0; i < coins.length; i++) {
        if (!coins[i].etomic) {
          console.log(`${coins[i].coin}: '${coins[i].fname}',`);
        }
      }
    } else if (flags.tickers) {
      for (let i = 0; i < coins.length; i++) {
        if (!coins[i].etomic) {
          console.log(`'${coins[i].coin}',`);
        }
      }
    }
  }
}