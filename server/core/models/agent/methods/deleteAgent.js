'use strict';

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForDelete;

const createAndExecuteQuery = key => {
  const query          = 'DELETE FROM ' + DB.coreDbName + '.agents WHERE `key` = ?',
        queryStatement = [query, [key]];

  return DB.query(queryStatement);
};

/**
 * Delete an agent record
 * @param {String} key
 * @throws {Error}
 * @returns {Promise}
 */
const deleteAgent = key => {
  validateAgentData({ key });
  return createAndExecuteQuery(key);
};

module.exports = deleteAgent;
