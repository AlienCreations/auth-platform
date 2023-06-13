'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRolesByTenantUuid = require('../../../models/tenantAccessRole/methods/getTenantAccessRolesByTenantUuid');

const getTenantAccessRolesByTenantUuid = tenantUuid => Promise.resolve(tenantUuid)
  .then(_getTenantAccessRolesByTenantUuid)
  .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));

module.exports = getTenantAccessRolesByTenantUuid;
