const wallet = require('./src/wallet');

/*
regular

const myWallet = new wallet();
myWallet.setMainPrivKey('test');
myWallet.addCoin('rick');


(async function() {
  //const balance = await myWallet.getHistory('rick');
  //console.log(JSON.stringify(balance, null, 2));
  //const transaction = await myWallet.getTransaction('rick1', 'eb47a948f8b38c48c7746c657620304ffae3f2c94f331ae50ac2c909ea7da996');
  //console.log(JSON.stringify(transaction, null, 2));

  const estimate = await myWallet.createTransaction('rick', {
    value: 2,
    address: myWallet.coins.rick.keys.pub,
    estimate: true,
  });

  console.log(JSON.stringify(estimate, null, 2));

  const txid = await myWallet.createTransaction('rick', {
    value: 2,
    address: myWallet.coins.rick.keys.pub,
    estimate: false,
  });

  console.log(JSON.stringify(txid, null, 2));

  console.log(myWallet.storageTransactions('rick'))

  //const broadcastResult = await myWallet.broadcastTransaction('rick', txid);
  //console.log(broadcastResult);
})();
*/

/*
multisig 1of1
*/

const myWallet = new wallet();
myWallet.setMainPrivKey(
  'test',
  '512102743d2afdb88ede68fb5938e961b1f41c2b6267b3286516543eb4e4ab87ad0d0a2102f90c3067e449ad6277eed1999ba42903068a2adb67506a32d5c760ee7765735952ae'
);
myWallet.addCoin('rick');

(async function() {
  const balance = await myWallet.getBalance('rick');
  console.log('balance: ' + balance.float);

  const estimate = await myWallet.createTransaction('rick', {
    value: 2,
    address: myWallet.coins.rick.keys.pub,
    estimate: true,
  });

  console.log(JSON.stringify(estimate, null, 2));

  const txid = await myWallet.createTransaction('rick', {
    value: 2,
    address: myWallet.coins.rick.keys.pub,
    estimate: false,
  });

  console.log(JSON.stringify(txid, null, 2));

  console.log(myWallet.storageTransactions('rick'))

  //const broadcastResult = await myWallet.broadcastTransaction('rick', txid);
  //console.log(broadcastResult);*/
})();