'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessRoleAssignment   = require('../../../models/tenantAccessRoleAssignment/methods/deleteTenantAccessRoleAssignment'),
      getTenantAccessRoleAssignmentByUuid = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentByUuid');

const deleteTenantAccessRoleAssignment = uuid => Promise.resolve(uuid)
  .then(getTenantAccessRoleAssignmentByUuid)
  .then(R.always(uuid))
  .then(_deleteTenantAccessRoleAssignment)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantAccessRoleAssignment;
