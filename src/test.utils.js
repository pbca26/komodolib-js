const jsonToBuffer = (json) => {
  for (let key in json) {
    if (typeof json[key] === 'object' &&
        (key === 'buffer' || key === 'chunks')) {
      if (json[key].data) {
        json[key] = Buffer.from(json[key].data);
      }
    } else if (
      typeof json[key] === 'object' &&
      key !== 'buffer' &&
      key !== 'chunks'
    ) {
      jsonToBuffer(json[key]);
    }
  }

  return json;
};

module.exports = jsonToBuffer;