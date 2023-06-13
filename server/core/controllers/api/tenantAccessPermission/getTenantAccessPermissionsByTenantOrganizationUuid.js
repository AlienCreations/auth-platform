'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessPermissionsByTenantOrganizationUuid = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantOrganizationUuid');

const getTenantAccessPermissionsByTenantOrganizationUuid = tenantOrganizationUuid => {
  return Promise.resolve(tenantOrganizationUuid)
    .then(_getTenantAccessPermissionsByTenantOrganizationUuid)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessPermissionsByTenantOrganizationUuid;
