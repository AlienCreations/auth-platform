'use strict';

const R = require('ramda');

const DB = require('../../../utils/db');

const {
  validateUuid,
  validateForUpdate
} = require('../helpers/validateAgentData');

const decorateDataForDbInsertion = R.identity;

const createAndExecuteQuery = (uuid, _agentData) => {
  const agentData = decorateDataForDbInsertion(_agentData);

  const query = `UPDATE ${DB.coreDbName}.agents
                 SET ${DB.prepareProvidedFieldsForSet(agentData)}
                 WHERE uuid = ?`;

  const values = R.append(uuid, DB.prepareValues(agentData));

  const queryStatement = [query, values];
  return DB.query(queryStatement);
};

const updateAgent = (uuid, agentData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(agentData)) {
    return Promise.resolve(false);
  }

  validateUuid({ uuid });
  validateForUpdate(agentData);
  return createAndExecuteQuery(uuid, agentData);
};

module.exports = R.curry(updateAgent);
