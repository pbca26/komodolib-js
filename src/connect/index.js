const providers = [
  'electrum',
  'insight',
];
const electrumConnectProxy = require('./electrum-connect-proxy');
const insightConnect = require('./insight-connect');

const connect = (provider, params) => {
  if (provider &&
      providers.indexOf(provider) > -1) {
    if (provider === 'electrum') {
      return new electrumConnectProxy(params.server, params.options);
    } else if (provider === 'insight') {
      return new insightConnect(params.server, params.options);
    }
  }
};

module.exports = connect;