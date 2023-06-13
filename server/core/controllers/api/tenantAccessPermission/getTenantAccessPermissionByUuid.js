'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessPermissionByUuid = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionByUuid');

const getTenantAccessPermissionByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantAccessPermissionByUuid)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessPermissionByUuid;
