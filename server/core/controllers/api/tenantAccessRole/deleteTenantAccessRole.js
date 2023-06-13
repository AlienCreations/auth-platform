'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessRole   = require('../../../models/tenantAccessRole/methods/deleteTenantAccessRole'),
      getTenantAccessRoleByUuid = require('../../../models/tenantAccessRole/methods/getTenantAccessRoleByUuid');

const deleteTenantAccessRole = uuid => Promise.resolve(uuid)
  .then(getTenantAccessRoleByUuid)
  .then(R.always(uuid))
  .then(_deleteTenantAccessRole)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantAccessRole;
