'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentByUuid = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentByUuid');

const getTenantAccessRoleAssignmentByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantAccessRoleAssignmentByUuid)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessRoleAssignmentByUuid;
