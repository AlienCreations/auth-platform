'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessPermissionsByTenantAccessResourceUuid = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantAccessResourceUuid');

const getTenantAccessPermissionsByTenantAccessResourceUuid = tenantAccessResourceUuid => {
  return Promise.resolve(tenantAccessResourceUuid)
    .then(_getTenantAccessPermissionsByTenantAccessResourceUuid)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessPermissionsByTenantAccessResourceUuid;
