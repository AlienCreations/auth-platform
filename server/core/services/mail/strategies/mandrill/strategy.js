'use strict';

const R        = require('ramda'),
      config   = require('config'),
      mandrill = require('mandrill-api/mandrill');

const client = new mandrill.Mandrill(R.path(['mail', 'mandrill', 'apiKey'], config));

module.exports = {
  send : require('./methods/send')(client)
};
