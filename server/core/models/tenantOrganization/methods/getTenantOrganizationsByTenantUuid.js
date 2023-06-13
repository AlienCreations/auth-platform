'use strict';

const DB                             = require('../../../utils/db'),
      { validateForGetByTenantUuid } = require('../helpers/validateTenantOrganizationData');

const createAndExecuteQuery = tenantUuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_organizations 
                          WHERE tenant_uuid = ? 
                            AND status > 0
                          ORDER BY title ASC`,
        queryStatement = [query, [tenantUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantOrganizationsByTenantUuid = tenantUuid => {
  validateForGetByTenantUuid({ tenantUuid });
  return createAndExecuteQuery(tenantUuid);
};

module.exports = getTenantOrganizationsByTenantUuid;
