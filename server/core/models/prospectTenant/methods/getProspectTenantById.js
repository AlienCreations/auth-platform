'use strict';

const DB                         = require('../../../utils/db'),
      validateProspectTenantData = require('../helpers/validateProspectTenantData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.prospect_tenants WHERE id = ?',
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Lookup a prospect tenant by id
 * @param {Number} id
 * @returns {Promise}
 */
const getProspectTenantById = id => {
  validateProspectTenantData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getProspectTenantById;
