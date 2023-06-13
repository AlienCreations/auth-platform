'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessRoleAssignment    = require('../../../models/tenantAccessRoleAssignment/methods/updateTenantAccessRoleAssignment'),
      _getTenantAccessRoleAssignmentByUuid = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentByUuid');

const updateTenantAccessRoleAssignment = (tenantAccessRoleAssignmentData, uuid) => {
  return Promise.resolve(tenantAccessRoleAssignmentData)
    .then(_updateTenantAccessRoleAssignment(uuid))
    .then(R.always(uuid))
    .then(_getTenantAccessRoleAssignmentByUuid)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessRoleAssignment;
