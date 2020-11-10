'use strict';

const R = require('ramda');

const DB                           = require('../../../utils/db'),
      validateTenantConnectionData = require('../helpers/validateTenantConnectionData').validateForGetByTenantOrganizationIdAndType;

const createAndExecuteQuery = (tenantOrganizationId, connectionType) => {
  const query          = 'SELECT * FROM ' + DB.coreDbName + '.tenant_connections WHERE tenant_organization_id = ? AND type = ?',
        queryStatement = [query, [tenantOrganizationId, connectionType]];

  return DB.querySafe(queryStatement);
};

/**
 * Select the appropriate connection from the
 * provided tenant organization id and connection type.
 * @param {Number} tenantOrganizationId
 * @param {Number} connectionType
 * @returns {Promise}
 */
const getTenantConnectionsForTenantOrganizationByType = R.curry((tenantOrganizationId, connectionType) => {
  validateTenantConnectionData({
    tenantOrganizationId,
    connectionType
  });
  return createAndExecuteQuery(tenantOrganizationId, connectionType);
});

module.exports = getTenantConnectionsForTenantOrganizationByType;
