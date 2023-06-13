'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForInsert;

const decorateDataForDbInsertion = data => R.compose(
  R.assoc('uuid', uuid())
)(data);

const createAndExecuteQuery = _agentData => {
  const agentData = decorateDataForDbInsertion(_agentData);

  const query = `INSERT INTO ${DB.coreDbName}.agents
                 SET ${DB.prepareProvidedFieldsForSet(agentData)}`;

  const queryStatement = [query, DB.prepareValues(agentData)];
  return DB.query(queryStatement);
};

const createAgent = agentData => {
  validateAgentData(R.defaultTo({}, agentData));
  return createAndExecuteQuery(agentData);
};

module.exports = createAgent;
