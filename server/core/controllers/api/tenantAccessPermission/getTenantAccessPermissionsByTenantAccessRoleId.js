'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessPermissionsByTenantAccessRoleId = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantAccessRoleId');

/**
 * Get all permissions for a role from the database
 * @param {Number} tenantAccessRoleId
 */
const getTenantAccessPermissionsByTenantAccessRoleId = tenantAccessRoleId => {
  return Promise.resolve(tenantAccessRoleId)
    .then(_getTenantAccessPermissionsByTenantAccessRoleId)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessPermissionsByTenantAccessRoleId;
