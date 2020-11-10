'use strict';

const DB                = require('../../../utils/db'),
      validateAgentData = require('../helpers/validateAgentData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.agents WHERE `id` = ?',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an agent by id
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const getAgentById = id => {
  validateAgentData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getAgentById;
