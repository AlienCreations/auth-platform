'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getAgentByUuid = require('../../../models/agent/methods/getAgentByUuid');

const getAgentByUuid = uuid => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, ['secret']);

  return Promise.resolve(R.defaultTo(undefined, uuid))
    .then(_getAgentByUuid)
    .then(R.omit(privateFields));
};

module.exports = getAgentByUuid;
