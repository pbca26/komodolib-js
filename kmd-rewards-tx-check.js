/*
 *  Reconstruct KMD rewards claiming conditions for a specific tx
 *  Note: inputs must exist on main chain
 */

const network = require('./src/bitcoinjs-networks-all');
const connect = require('./src/connect');
const decoder = require('./src/transaction-decoder');
const {fromSats, toSats} = require('./src/utils');
const decodedTx = decoder('0400008085202f890e86aeb0e33ffb7c0dd4e02c80c1170d668e9cb04194239e2f9585988627695915010000006b483045022100e01abe08aae65d160ca254d3bb0737079c7f257a4085b477c3ddb6f800563d1002202e7c419126a851a8f67fe4bb46faf54b2b5b1f381f413b97adc93802ee2963ad0121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffffc9abe13172d5b2c3db7cbcd9918c4ef795b4f36237ddd3ef491c70a10ae20be6010000006b483045022100a118cbb4716a7a8edaa07854ccbd6b5f412c25aecb5b39125f9d8739110e8b03022019484bd4885b5a94d16c6c7fad3b1c7fbccebfc8b71ff44254996963ba3066480121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff0db7c2bc08a147646e8bc0169d5dec4c966cd578e2cb9cdfa07019d262940732010000006a47304402207cd0d8e03140e1c86d1dad4cb52d6d6973d3abf264a6598e5a0a7ccca22510ce02207ceb77a5e576d837434b5c0c5ec0e91ab53acb4cc0a05b3b6988e04d5c7a0e310121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff8173babe40090a82f5217525c9e4a3adce812f88c3c576a43965ef17b50df80f010000006b483045022100b840109d3531c1ea25f7824fcc7e447dffde2388d9e37a01682d6ce5c832bc890220191449323cbdee82b2967458959b57faf20365a6ceeab67c44cc86dd2009fa810121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff006114f832605d8d078ba2bb33648cb8a0d2adb48655cc26b23ac9e014273ca3010000006a47304402207969b4b545ec175ed87214fce6f65ef1976ea3a80645293b1c513731f86a44c60220472ad8eccf959a25d994649e93d0bc79d390283599ca014f52a186bcdacacaaf0121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff5dbe52624397728e8110e062e760f529460a3b8cd70339b82b852931b9869698010000006b483045022100d705c38b74ba3502354e0cf91f5e9e1e2b3199b681656f4f7562f079076f75f10220512d5a2287a4e2d915432c6ead642ffdadf0969c4b0b5b3884ca7c4cd6a2f2180121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff9052701b4cde198cd585b5314ffaa79d2c0c34945738189349a4be66dd8c3937010000006a47304402203528c86e57e8ebd70563f2ec28acbe638a2bfba8d4212f027c3dd76b69c62086022031d3d2c4b9b84e459cce837a973edaf1191ec152b68c0ad04ae73e5935d795200121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffffb71cec3af5811b1d3561172a4b5eb7aa7d24f1100708e20908f9920305a72a12010000006b483045022100d2b94d77ce1b326e17fd44711096a46eda930b1d967759210dfd8f5ee7c0c85202203964c2c8f9afaaa6464562dc8e338afdf92789d658fb668e6a3465e9848202090121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffffb1390326831f8d894a1129baa43e94e9adb8130213e93cdebf11a0f72ce8794c010000006a4730440220715a6f1c5993bd1cb4e18f03bec1c8ec338b80ce199fc007d07ccab317dfa30d0220593abc404d69404163f394b2aea1cf860e5c1ba35e003fcfa892925591c339ed0121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff7c2426203b6fc5b62c6253fc9ca254fd773f324d942753098fbbcdd25759735b010000006a473044022064691e457faa3595e5b85bd8193b6b3ddbab75ecad87f67297ab2691279e4796022006633b549ae905639c2d3ddb8193e6a1495a7af7f9b8590099ac334ab1a641e90121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6fffffffffbd51f54babda4fb64fbbab29c21052b5cf3c297bbf25c14621a4ef8bea1ca62010000006a4730440220377aa553755c17bb13ad43a8babbe6732b7d1d0926b27ebfee31b368c59000960220793bd0f9fd0d2ceab5a915c1f183076dd20d8e85e06dd8ef16a71743bf29fe7a0121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffffc805ed251438bacad0b185332581a708bc2de89f841a98a975bde20cdb3d8e9e000000006a47304402204a2dee876595db4d2f35593fd5d44064eed07f21e5940533adcf3df27b8c386e02203538e21b0f6ae06bbc14a1e5ed1bcd3c62d2b7b461961c6da508177f094ee5e70121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff07e7a02109bfd3fb2b5e96dfaddeb18674d976f6ae54d2e5873e77569d3fae8d010000006a473044022002c9b83a64fd9a6785a5a325904a7fa48c217b0db072227a158fe2202e48a5f8022022f443336cc2db4467bd0ad7aa9febea3ce0874c6fc5234617a2556ae3604cfd0121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff1a11aff8b46469c6f59de6b820ad2b006ff41f7e095cb55da97e5e89635d2fd2010000006b483045022100edd98da5786f4ad960bddf481354dda0faa96cfa29630c1c28d3bb92f9e2947902204b62c887b8798094360c043f990bde4b812dc344427dc99f07a563ee1734993a0121036e5693e75a7180feb9850e635b0d1cc81607154d879d52a5a6b81e735e0c43a6ffffffff01d6693c9fd60100001976a9142535440a74b0c2149c525a9d01e9698ebd08429a88ac67e1095f000000000000000000000000000000', network.kmd);

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

    //console.log(input);
    sumInputs += Number(input.vout[decodedTx.inputs[i].n].value);

    console.log(`vin ${i} txid ${decodedTx.inputs[i].txid} val ${input.vout[decodedTx.inputs[i].n].value}`);

    const rewards = komodoInterest(input.locktime || 0, decodedTx.format.locktime, toSats(input.vout[decodedTx.inputs[i].n].value), 6777777);
    console.log('rewards', rewards);
    sumRewards += rewards;
  }

  console.log(`sum vin ${sumInputs}`);
  console.log(`sum vout ${sumOutputs}`);
  console.log(`sum rewards ${sumRewards}`);
  console.log(`fee ${Math.abs(sumInputs - sumOutputs)}`);

  if (Math.abs(sumInputs - sumOutputs) > sumRewards) {
    console.log('trying to claim too much!');
    console.log(`${Math.abs(sumInputs - sumOutputs) - sumRewards} over the limit!`);
  }
})();