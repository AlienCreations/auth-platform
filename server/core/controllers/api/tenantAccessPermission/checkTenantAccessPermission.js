'use strict';

const _checkTenantAccessPermission = require('../../../models/tenantAccessPermission/methods/checkTenantAccessPermission');

/**
 * Check if provided cloudUserUuid has permission to access resource matching uri and method.
 * Wildcards supported for both/either uri and method as *
 * @param {String} uri
 * @param {String} method
 * @param {String} cloudUserUuid
 * @param {String} tenantUuid
 * @param {String} tenantOrganizationUuid
 */
const checkTenantAccessPermission = (uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid) => {
  return Promise.resolve()
    .then(() => _checkTenantAccessPermission(uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid));
};

module.exports = checkTenantAccessPermission;
