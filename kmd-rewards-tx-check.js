/*
 *  Reconstruct KMD rewards claiming conditions for a specific tx
 *  Note: inputs must exist on main chain
 */

const network = require('./src/bitcoinjs-networks-all');
const connect = require('./src/connect');
const decoder = require('./src/transaction-decoder');
const {fromSats, toSats} = require('./src/utils');
const decodedTx = decoder('0400008085202f8901c42dfdd48ea366b63c52700bdba07e4039508c7ba75ee9754278832532117089000000006a473044022007eecfca66fd0f71667c652aa78691c7854fdcd80d33adaab1a4a68378cd421202202406ee7627922b3bfc6feb66ab0dcff14f8e7bedd55241e7faa220b4bbe363f70121039b43d8b09f743bb11c4c22155e802fb22939c387449988dacf6cbcd2ad09da90ffffffff0200ca9a3b000000001976a914b680d79bd4e070c8455e87dc6bdceb79c142301888aca4a13a81000000001976a914ced5cac836af11b029630883bca8226b60731bff88ac87509c5e000000000000000000000000000000', network.kmd);

const komodoInterest = (locktime, dateNow = Date.now() / 1000, value, height, inSats) => { // value in sats, inSats - return output in sats
  const KOMODO_ENDOFERA = 7777777;
  const LOCKTIME_THRESHOLD = 500000000;
  if (inSats ? value < 10 * 100000000 : value < 10) return 0;
  const timestampDiff = Math.floor(dateNow) - locktime - 777;
  const hoursPassed = Math.floor(timestampDiff / 3600);
  const minutesPassed = Math.floor((timestampDiff - (hoursPassed * 3600)) / 60);
  const secondsPassed = timestampDiff - (hoursPassed * 3600) - (minutesPassed * 60);
  let timestampDiffMinutes = timestampDiff / 60;
  let interest = 0;

  // calc interest
  if (height < KOMODO_ENDOFERA &&
      locktime >= LOCKTIME_THRESHOLD) {
    if (timestampDiffMinutes >= 60) {
      if (height >= 1000000 &&
          timestampDiffMinutes > 31 * 24 * 60) {
        timestampDiffMinutes = 31 * 24 * 60;
      } else {
        if (timestampDiffMinutes > 365 * 24 * 60) {
          timestampDiffMinutes = 365 * 24 * 60;
        }
      }
    }

    timestampDiffMinutes -= 59;
    interest = Number(((Math.floor(value / 10512000) * timestampDiffMinutes) * (inSats ? 1 : 0.00000001)).toFixed(inSats ? 0 : 8));
  }

  return interest > 0 ? interest : 0;
};

// console.log(decodedTx);

(async function() {
  const c = connect('insight', { server: 'kmd' });

  // parse inputs
  let inputs = [];
  let sumInputs = 0, sumOutputs = 0;
  let sumRewards = 0;

  sumOutputs = decodedTx.outputs.map(x => Number(x.value)).reduce((a, b) => a + b);

  for (let i = 0; i < decodedTx.inputs.length; i++) {
    
    const input = await c.getTransaction(decodedTx.inputs[i].txid);

    console.log(input);
    sumInputs =+ Number(input.vout[decodedTx.inputs[i].n].value);

    console.log(`vin ${i} txid ${decodedTx.inputs[i].txid} val ${input.vout[decodedTx.inputs[i].n].value}`);

    const rewards = komodoInterest(input.locktime || 0, decodedTx.format.locktime, toSats(input.vout[decodedTx.inputs[i].n].value), 6777777);
    console.log('rewards', rewards);
    sumRewards =+ rewards;
  }

  console.log(`sum vin ${sumInputs}`);
  console.log(`sum vout ${sumOutputs}`);
  console.log(`fee ${Math.abs(sumInputs - sumOutputs)}`);

  if (Math.abs(sumInputs - sumOutputs) > sumRewards) {
    console.log('trying to claim too much!');
    console.log(`${Math.abs(sumInputs - sumOutputs) - sumRewards} over the limit!`);
  }
})();