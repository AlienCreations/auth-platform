'use strict';

const DB                             = require('../../../utils/db'),
      { validateForGetByTenantUuid } = require('../helpers/validateTenantConnectionData');

const createAndExecuteQuery = tenantUuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_connections
                          WHERE tenant_uuid = ?
                            AND status > 0
                          ORDER BY id ASC`,
        queryStatement = [query, [tenantUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantConnectionsByTenantUuid = tenantUuid => {
  validateForGetByTenantUuid({ tenantUuid });
  return createAndExecuteQuery(tenantUuid);
};

module.exports = getTenantConnectionsByTenantUuid;
