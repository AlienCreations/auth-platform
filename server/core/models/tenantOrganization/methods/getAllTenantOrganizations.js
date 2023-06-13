'use strict';

const DB = require('../../../utils/db');

const getAllTenantOrganizations = () => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_organizations 
                          WHERE status > 0
                          ORDER BY tenant_id ASC, title ASC`,
        queryStatement = [query, []];

  return DB.querySafe(queryStatement);
};

module.exports = getAllTenantOrganizations;
