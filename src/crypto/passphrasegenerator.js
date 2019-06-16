/******************************************************************************
 * Copyright © 2016 The Waves Core Developers.                             	  *
 *                                                                            *
 * See the LICENSE files at     											  											*
 * the top-level directory of this distribution for the individual copyright  *
 * holder information and the developer policies on copyright and licensing.  *
 *                                                                            *
 * Unless otherwise agreed in a custom licensing agreement, no part of the    *
 * Waves software, including this file, may be copied, modified, propagated,  *
 * or distributed except according to the terms contained in the LICENSE.txt  *
 * file.                                                                      *
 *                                                                            *
 * Removal or modification of this copyright notice is prohibited.            *
 *                                                                            *
 ******************************************************************************/

const bip39 = require('bip39');

const hasDuplicates = (seed) => {
  seed = seed.split(' ');
  return (new Set(seed)).size !== seed.length;
};

const passphraseGenerator = {
  hasDuplicates: (seed) => hasDuplicates(seed),
  generatePassPhrase: (bitsval) => {
    let seed = bip39.generateMnemonic(bitsval);
    
    while (hasDuplicates(seed)) {
      seed = bip39.generateMnemonic(bitsval);
    }

    return seed;
  },
  // checks if it's possible that the pass phrase words supplied as the first parameter
  // were generated with the number of bits supplied as the second parameter
  isPassPhraseValid: (seed, bits) => {
    // the required number of words based on the number of bits
    // mirrors the generatePassPhrase function above
    const wordsCount = bits / 32 * 3;
    return seed && seed.length === wordsCount;
  },
  arePassPhraseWordsValid: passphrase => bip39.validateMnemonic(passphrase),
};

module.exports = passphraseGenerator;
