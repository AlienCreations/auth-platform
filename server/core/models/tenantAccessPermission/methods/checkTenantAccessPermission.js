'use strict';

const config = require('config');

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForCheckPermission;

const createAndExecutePlatformRootUserQuery = () => {
  const query          = 'SELECT 1 > 0 AS has_permission';
  const queryStatement = [query, []];
  return DB.lookupSafe(queryStatement);
};

const createAndExecuteTenantQuery = (uri, method, cloudUserId, tenantId) => {
  const query = `
      SELECT COUNT(permissions.tenant_access_resource_id) > 0 AS has_permission 
      FROM ${DB.coreDbName}.tenant_access_permissions permissions
      RIGHT JOIN ${DB.coreDbName}.tenant_access_resources resources
        ON resources.id = permissions.tenant_access_resource_id
      RIGHT JOIN ${DB.coreDbName}.tenant_access_role_assignments assignments
        ON assignments.tenant_access_role_id = permissions.tenant_access_role_id
      RIGHT JOIN ${DB.coreDbName}.tenant_access_roles roles
        ON roles.id = permissions.tenant_access_role_id
      WHERE assignments.cloud_user_id = ?
        AND ( resources.uri       = ? OR resources.uri    = '*' )
        AND ( resources.method    = ? OR resources.method = '*' )
        AND ( resources.tenant_id = ? OR resources.tenant_id IS NULL )
        AND resources.status      = 1
  `;

  const queryStatement = [query, [cloudUserId, uri, method, tenantId]];
  return DB.lookupSafe(queryStatement);
};

const createAndExecuteTenantOrganizationQuery = (uri, method, cloudUserId, tenantId, tenantOrganizationId) => {
  const query = `
      SELECT COUNT(permissions.tenant_access_resource_id) > 0 AS has_permission 
      FROM ${DB.coreDbName}.tenant_access_permissions permissions
      RIGHT JOIN ${DB.coreDbName}.tenant_access_resources resources
        ON resources.id = permissions.tenant_access_resource_id
      RIGHT JOIN ${DB.coreDbName}.tenant_access_role_assignments assignments
        ON assignments.tenant_access_role_id = permissions.tenant_access_role_id
      RIGHT JOIN ${DB.coreDbName}.tenant_access_roles roles
        ON roles.id = permissions.tenant_access_role_id
      WHERE assignments.cloud_user_id    = ?
        AND resources.uri                = ?
        AND resources.method             = ?
        AND roles.tenant_id              = ? 
        AND roles.tenant_organization_id = ?
        AND resources.status             = 1
  `;

  const queryStatement = [query, [cloudUserId, uri, method, tenantId, tenantOrganizationId]];
  return DB.lookupSafe(queryStatement);
};

const createAndExecuteAppropriateQuery = (uri, method, cloudUserId, tenantId, tenantOrganizationId) => {
  if (cloudUserId === config.tenancy.platformRootUserId) {
    return createAndExecutePlatformRootUserQuery(uri, method, cloudUserId);
  }
  if (tenantOrganizationId) {
    return createAndExecuteTenantOrganizationQuery(uri, method, cloudUserId, tenantId, tenantOrganizationId);
  }
  return createAndExecuteTenantQuery(uri, method, cloudUserId, tenantId);
};

/**
 * Look check permissions for a cloud user against a resource uri and method
 * Wildcards are supported for both uri and method.
 * User could be allowed to [GET *] or [* /api/v1/reward]
 * @param {String} uri
 * @param {String} method - One of GET, POST, PUT, DELETE
 * @param {Number} cloudUserId
 * @param {Number} tenantId
 * @param {Number} tenantOrganizationId
 * @throws {Error}
 * @returns {Promise}
 */
const checkTenantAccessPermission = (uri, method, cloudUserId, tenantId, tenantOrganizationId) => {
  validateTenantAccessPermissionData({
    tenantAccessResourceUri    : uri,
    tenantAccessResourceMethod : method,
    cloudUserId,
    tenantId,
    tenantOrganizationId
  });
  return createAndExecuteAppropriateQuery(uri, method, cloudUserId, tenantId, tenantOrganizationId);
};

module.exports = checkTenantAccessPermission;
