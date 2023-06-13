'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessPermission   = require('../../../models/tenantAccessPermission/methods/deleteTenantAccessPermission'),
      getTenantAccessPermissionByUuid = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionByUuid');

const deleteTenantAccessPermission = uuid => Promise.resolve(uuid)
  .then(getTenantAccessPermissionByUuid)
  .then(R.always(uuid))
  .then(_deleteTenantAccessPermission)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantAccessPermission;
