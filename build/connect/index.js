'use strict';

var providers = ['electrum', 'insight'];
var electrumConnectProxy = require('./electrum-connect-proxy');
var insightConnect = require('./insight-connect');

var connect = function connect(provider, params) {
  if (provider && providers.indexOf(provider) > -1) {
    if (provider === 'electrum') {
      return new electrumConnectProxy(params.server, params.options);
    } else if (provider === 'insight') {
      return new insightConnect(params.server, params.options);
    }
  }
};

module.exports = connect;