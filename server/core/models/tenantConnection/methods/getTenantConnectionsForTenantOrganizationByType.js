'use strict';

const R = require('ramda');

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForGetByTenantOrganizationUuidAndType;

const createAndExecuteQuery = (tenantOrganizationUuid, connectionType) => {
  const query          = `SELECT * FROM ${DB.coreDbName}.tenant_connections 
                          WHERE tenant_organization_uuid = ? 
                            AND type = ?
                            AND status > 0`,
        queryStatement = [query, [tenantOrganizationUuid, connectionType]];

  return DB.querySafe(queryStatement);
};

const getTenantConnectionsForTenantOrganizationByType = R.curry((tenantOrganizationUuid, connectionType) => {
  validateTenantConnectionData({
    tenantOrganizationUuid,
    connectionType
  });
  return createAndExecuteQuery(tenantOrganizationUuid, connectionType);
});

module.exports = getTenantConnectionsForTenantOrganizationByType;
