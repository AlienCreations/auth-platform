'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessPermissionsByTenantAccessRoleUuid = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantAccessRoleUuid');

const getTenantAccessPermissionsByTenantAccessRoleUuid = tenantAccessRoleUuid => {
  return Promise.resolve(tenantAccessRoleUuid)
    .then(_getTenantAccessPermissionsByTenantAccessRoleUuid)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessPermissionsByTenantAccessRoleUuid;
