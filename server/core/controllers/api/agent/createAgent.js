'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _createAgent = require('../../../models/agent/methods/createAgent'),
      getAgentById = require('../../../models/agent/methods/getAgentById');

/**
 * Create a new agent record
 * @param {Object} agentData
 */
const createAgent = agentData => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, ['secret']);

  return Promise.resolve(agentData)
    .then(_createAgent)
    .then(R.prop('insertId'))
    .then(getAgentById)
    .then(R.omit(privateFields));
};

module.exports = createAgent;
