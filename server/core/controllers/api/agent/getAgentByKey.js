'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getAgentByKey = require('../../../models/agent/methods/getAgentByKey');

const getAgentByKey = key => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, ['secret']);

  return Promise.resolve(R.defaultTo(undefined, key))
    .then(_getAgentByKey)
    .then(R.omit(privateFields));
};

module.exports = getAgentByKey;
