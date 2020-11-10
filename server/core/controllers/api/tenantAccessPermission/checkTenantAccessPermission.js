'use strict';

const _checkTenantAccessPermission = require('../../../models/tenantAccessPermission/methods/checkTenantAccessPermission');

/**
 * Check if provided cloudUserId has permission to access resource matching uri and method.
 * Wildcards supported for both/either uri and method as *
 * @param {String} uri
 * @param {String} method
 * @param {Number} cloudUserId
 * @param {Number} tenantId
 * @param {Number} tenantOrganizationId
 */
const checkTenantAccessPermission = (uri, method, cloudUserId, tenantId, tenantOrganizationId) => {
  return Promise.resolve()
    .then(() => _checkTenantAccessPermission(uri, method, cloudUserId, tenantId, tenantOrganizationId));
};

module.exports = checkTenantAccessPermission;
