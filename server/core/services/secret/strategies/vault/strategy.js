'use strict';

const R      = require('ramda'),
      config = require('config');

const { apiVersion, endpoint, token } = R.path(['secret', 'vault'], config);

const setItem    = require('./methods/setItem'),
      getItem    = require('./methods/getItem'),
      deleteItem = require('./methods/deleteItem');

const client = require('node-vault')({ apiVersion, endpoint, token });

module.exports = {
  setItem    : setItem(client),
  getItem    : getItem(client),
  deleteItem : deleteItem(client)
};
