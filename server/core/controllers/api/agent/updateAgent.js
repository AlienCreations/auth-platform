'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateAgent   = require('../../../models/agent/methods/updateAgent'),
      _getAgentByKey = require('../../../models/agent/methods/getAgentByKey');

/**
 * Update an agent record
 * @param {Object} agentData
 * @param {String} key
 */
const updateAgent = R.curry((agentData, key) => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, ['secret']);

  return Promise.resolve(agentData)
    .then(_updateAgent(key))
    .then(R.always(key))
    .then(_getAgentByKey)
    .then(R.omit(privateFields));
});

module.exports = updateAgent;
