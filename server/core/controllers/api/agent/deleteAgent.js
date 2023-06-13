'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteAgent   = require('../../../models/agent/methods/deleteAgent'),
      getAgentByUuid = require('../../../models/agent/methods/getAgentByUuid');

const deleteAgent = uuid => {
  return Promise.resolve(uuid)
    .then(getAgentByUuid)
    .then(R.always(uuid))
    .then(_deleteAgent)
    .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));
};

module.exports = deleteAgent;
