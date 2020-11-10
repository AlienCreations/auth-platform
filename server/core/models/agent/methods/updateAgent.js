'use strict';

const R = require('ramda');

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData');

const decorateDataForDbInsertion = agentData => {
  const dataCopy = R.clone(agentData);
  return dataCopy;
};

const createAndExecuteQuery = (key, agentData) => {
  agentData = decorateDataForDbInsertion(agentData);

  const fields = R.keys(agentData);

  const query = 'UPDATE ' + DB.coreDbName + '.agents SET ' +
                DB.prepareProvidedFieldsForSet(fields) + ' ' +
                'WHERE `key` = ?';

  const values = R.append(key, DB.prepareValues(agentData));

  const queryStatement = [query, values];
  return DB.query(queryStatement);
};

/**
 * Update a agent record.
 * @param {String} key
 * @param {Object} agentData
 * @throws {Error}
 * @returns {Promise}
 */
const updateAgent = (key, agentData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(agentData)) {
    return Promise.resolve(false);
  }

  validateAgentData.validateKey({ key });
  validateAgentData.validateForUpdate(agentData);
  return createAndExecuteQuery(key, agentData);
};

module.exports = R.curry(updateAgent);
