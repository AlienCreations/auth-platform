'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleByUuid = require('../../../models/tenantAccessRole/methods/getTenantAccessRoleByUuid');

const getTenantAccessRoleByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantAccessRoleByUuid)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessRoleByUuid;
