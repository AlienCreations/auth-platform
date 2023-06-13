'use strict';

const DB                             = require('../../../utils/db'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForGetById;

const createAndExecuteQuery = id => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_organizations 
                          WHERE id = ?
                            AND status > 0`,
        queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

const getTenantOrganizationById = id => {
  validateTenantOrganizationData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantOrganizationById;
