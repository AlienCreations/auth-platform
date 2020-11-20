'use strict';

const R = require('ramda');

const logger = require('../../../../log/Log');

const putMapping = client => mapping => Promise.resolve(mapping)
  .then(R.pick(['index']))
  .then(client.indices.create.bind(client))
  .then(client.indices.putMapping.bind(client))
  .catch(err => {
    logger({}).warn({ msg : 'putMapping failed, likely already exists' });
    return err;
  });

module.exports = putMapping;
