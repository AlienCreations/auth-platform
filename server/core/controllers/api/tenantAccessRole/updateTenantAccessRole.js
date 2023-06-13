'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessRole    = require('../../../models/tenantAccessRole/methods/updateTenantAccessRole'),
      _getTenantAccessRoleByUuid = require('../../../models/tenantAccessRole/methods/getTenantAccessRoleByUuid');

const updateTenantAccessRole = (tenantAccessRoleData, uuid) => {
  return Promise.resolve(tenantAccessRoleData)
    .then(_updateTenantAccessRole(uuid))
    .then(R.always(uuid))
    .then(_getTenantAccessRoleByUuid)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessRole;
