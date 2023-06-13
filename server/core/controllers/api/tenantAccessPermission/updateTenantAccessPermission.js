'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessPermission    = require('../../../models/tenantAccessPermission/methods/updateTenantAccessPermission'),
      _getTenantAccessPermissionByUuid = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionByUuid');

const updateTenantAccessPermission = (tenantAccessPermissionData, uuid) => {
  return Promise.resolve(tenantAccessPermissionData)
    .then(_updateTenantAccessPermission(uuid))
    .then(R.always(uuid))
    .then(_getTenantAccessPermissionByUuid)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessPermission;
