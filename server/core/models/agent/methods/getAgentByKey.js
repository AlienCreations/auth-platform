'use strict';

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForGetByKey;

const createAndExecuteQuery = key => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.agents WHERE `key` = ?',
        queryStatement = [query, [key]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an agent by key
 * @param {String} key
 * @throws {Error}
 * @returns {Promise}
 */
const getAgentByKey = key => {
  validateAgentData({ key });
  return createAndExecuteQuery(key);
};

module.exports = getAgentByKey;
