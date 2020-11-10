'use strict';

const R = require('ramda');

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForInsert;

const decorateDataForDbInsertion = agentData => {
  const dataCopy = R.clone(agentData);
  return dataCopy;
};

const createAndExecuteQuery = agentData => {
  agentData = decorateDataForDbInsertion(agentData);

  const fields = R.keys(agentData);
  const query  = 'INSERT INTO ' + DB.coreDbName + '.agents SET ' +
                 DB.prepareProvidedFieldsForSet(fields);

  const queryStatement = [query, DB.prepareValues(agentData)];
  return DB.query(queryStatement);
};

/**
 * Create an agent record
 * @param {Object} agentData
 * @throws {Error}
 * @returns {Promise}
 */
const createAgent = agentData => {
  validateAgentData(R.defaultTo({}, agentData));
  return createAndExecuteQuery(agentData);
};

module.exports = createAgent;
