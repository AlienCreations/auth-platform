'use strict';

const DB                       = require('../../../utils/db'),
      validateProspectUserData = require('../helpers/validateProspectUserData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.prospect_users WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup a prospect user by id
 * @param {Number} id
 * @returns {Promise}
 */
const getProspectUserById = id => {
  validateProspectUserData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getProspectUserById;
