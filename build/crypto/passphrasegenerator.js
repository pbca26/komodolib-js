'use strict';

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

var bip39 = require('bip39');

var passphraseGenerator = {
  generatePassPhrase: function generatePassPhrase(bitsval) {
    return bip39.generateMnemonic(bitsval);
  },

  // checks if it's possible that the pass phrase words supplied as the first parameter
  // were generated with the number of bits supplied as the second parameter
  isPassPhraseValid: function isPassPhraseValid(passPhraseWords, bits) {
    // the required number of words based on the number of bits
    // mirrors the generatePassPhrase function above
    var wordsCount = bits / 32 * 3;
    return passPhraseWords && passPhraseWords.length === wordsCount;
  },

  arePassPhraseWordsValid: function arePassPhraseWordsValid(passphrase) {
    return bip39.validateMnemonic(passphrase);
  }
};

module.exports = passphraseGenerator;