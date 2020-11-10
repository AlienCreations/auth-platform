'use strict';

const R      = require('ramda'),
      config = require('config');

const Search = require('../server/core/services/search/Search')(R.path(['search', 'strategy'], config));

const startBatchProcessSearchHeartbeat = () => {
  if (process.env.__batchProcessSearchHeartbeat) {
    clearInterval(process.env.__batchProcessSearchHeartbeat);
  }
  process.env.__batchProcessSearchHeartbeat = setInterval(() => {
    Search.batchProcess(100);
  }, 60000);
};

module.exports = startBatchProcessSearchHeartbeat;
