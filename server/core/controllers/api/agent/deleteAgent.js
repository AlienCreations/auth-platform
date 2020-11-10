'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteAgent  = require('../../../models/agent/methods/deleteAgent'),
      getAgentByKey = require('../../../models/agent/methods/getAgentByKey');

/**
 * Delete an agent record
 * @param {String} key
 */
const deleteAgent = key => {
  return Promise.resolve(key)
    .then(getAgentByKey)
    .then(R.always(key))
    .then(_deleteAgent)
    .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));
};

module.exports = deleteAgent;
