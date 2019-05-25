const maskPubAddress = (pub) => {
  // keep 3 first and 3 last chars unmasked
  let masked = '';

  for (let i = 0; i < pub.length - 3 * 2; i++) {
    masked += '*';
  }

  return pub[0] + pub[1] + pub[2] + masked + pub[pub.length - 3] + pub[pub.length - 2] + pub[pub.length - 1];
};

const hex2str = (hex) => {
  const _hex = hex.toString(); // force conversion
  let str = '';

  for (let i = 0; i < _hex.length; i += 2) {
    str += String.fromCharCode(parseInt(_hex.substr(i, 2), 16));
  }

  return str;
};

// ref: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffleArray = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    
    [a[i], a[j]] = [a[j], a[i]];
  }

  return a;
};

module.exports = {
  maskPubAddress,
  hex2str,
  shuffleArray,
};