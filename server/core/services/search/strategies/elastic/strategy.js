'use strict';

const elasticsearch = require('@elastic/elasticsearch'),
      axios         = require('axios'),
      config        = require('config');

const cacheUtils = require('../../../../utils/cache');

const { protocol, host, port, user, password } = config.search;

const client = new elasticsearch.Client({
  node : `${protocol}://${user}:${password}@${host}:${port}`
});

module.exports = {
  addItem      : require('./methods/addItem'),
  updateItem   : require('./methods/updateItem'),
  deleteItem   : require('./methods/deleteItem'),
  batchProcess : require('./methods/batchProcess')(cacheUtils)(client),
  putMapping   : require('./methods/putMapping')(client),
  search       : require('./methods/search')(axios)
};
