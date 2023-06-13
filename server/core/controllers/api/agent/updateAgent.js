'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateAgent    = require('../../../models/agent/methods/updateAgent'),
      _getAgentByUuid = require('../../../models/agent/methods/getAgentByUuid');

const updateAgent = R.curry((agentData, uuid) => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, ['secret']);

  return Promise.resolve(agentData)
    .then(_updateAgent(uuid))
    .then(R.always(uuid))
    .then(_getAgentByUuid)
    .then(R.omit(privateFields));
});

module.exports = updateAgent;
