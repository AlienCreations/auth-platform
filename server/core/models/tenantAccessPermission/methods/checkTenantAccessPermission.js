'use strict';

const config = require('config');

const DB                                 = require('../../../utils/db'),
      validateTenantAccessPermissionData = require('../helpers/validateTenantAccessPermissionData').validateForCheckPermission;

const createAndExecutePlatformRootUserQuery = () => {
  const query          = 'SELECT 1 > 0 AS has_permission';
  const queryStatement = [query, []];
  return DB.lookupSafe(queryStatement);
};

const createAndExecuteTenantQuery = (uri, method, cloudUserUuid, tenantUuid) => {
  const query = `
      SELECT COUNT(permissions.tenant_access_resource_uuid) > 0 AS has_permission 
      FROM ${DB.coreDbName}.tenant_access_permissions permissions
      RIGHT JOIN ${DB.coreDbName}.tenant_access_resources resources
        ON resources.uuid = permissions.tenant_access_resource_uuid
      RIGHT JOIN ${DB.coreDbName}.tenant_access_role_assignments assignments
        ON assignments.tenant_access_role_uuid = permissions.tenant_access_role_uuid
      RIGHT JOIN ${DB.coreDbName}.tenant_access_roles roles
        ON roles.uuid = permissions.tenant_access_role_uuid
      WHERE assignments.cloud_user_uuid = ?
        AND ( resources.uri         = ? OR resources.uri    = '*' )
        AND ( resources.method      = ? OR resources.method = '*' )
        AND ( resources.tenant_uuid = ? OR resources.tenant_uuid IS NULL )
        AND resources.status        = 1
  `;

  const queryStatement = [query, [cloudUserUuid, uri, method, tenantUuid]];
  return DB.lookupSafe(queryStatement);
};

const createAndExecuteTenantOrganizationQuery = (uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid) => {
  const query = `
      SELECT COUNT(permissions.tenant_access_resource_uuid) > 0 AS has_permission 
      FROM ${DB.coreDbName}.tenant_access_permissions permissions
      RIGHT JOIN ${DB.coreDbName}.tenant_access_resources resources
        ON resources.uuid = permissions.tenant_access_resource_uuid
      RIGHT JOIN ${DB.coreDbName}.tenant_access_role_assignments assignments
        ON assignments.tenant_access_role_uuid = permissions.tenant_access_role_uuid
      RIGHT JOIN ${DB.coreDbName}.tenant_access_roles roles
        ON roles.uuid = permissions.tenant_access_role_uuid
      WHERE assignments.cloud_user_uuid    = ?
        AND resources.uri                  = ?
        AND resources.method               = ?
        AND roles.tenant_uuid              = ? 
        AND roles.tenant_organization_uuid = ?
        AND resources.status               = 1
  `;

  const queryStatement = [query, [cloudUserUuid, uri, method, tenantUuid, tenantOrganizationUuid]];
  return DB.lookupSafe(queryStatement);
};

const createAndExecuteAppropriateQuery = (uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid) => {
  if (cloudUserUuid === config.tenancy.platformRootUserUuid) {
    return createAndExecutePlatformRootUserQuery(uri, method, cloudUserUuid);
  }
  if (tenantOrganizationUuid) {
    return createAndExecuteTenantOrganizationQuery(uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid);
  }
  return createAndExecuteTenantQuery(uri, method, cloudUserUuid, tenantUuid);
};

/**
 * Check permissions for a cloud user against a resource uri and method
 * Wildcards are supported for both uri and method.
 * User could be allowed to [GET *] or [* /api/v1/reward]
 * @param {String} uri
 * @param {String} method - One of GET, POST, PUT, DELETE
 * @param {String} cloudUserUuid
 * @param {String} tenantUuid
 * @param {String} tenantOrganizationUuid
 * @throws {Error}
 * @returns {Promise}
 */
const checkTenantAccessPermission = (uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid) => {
  validateTenantAccessPermissionData({
    tenantAccessResourceUri    : uri,
    tenantAccessResourceMethod : method,
    cloudUserUuid,
    tenantUuid,
    tenantOrganizationUuid
  });
  return createAndExecuteAppropriateQuery(uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid);
};

module.exports = checkTenantAccessPermission;
