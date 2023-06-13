'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _createTenantAccessRoleAssignment = require('../../../models/tenantAccessRoleAssignment/methods/createTenantAccessRoleAssignment'),
      getTenantAccessRoleAssignmentById = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentById');

const createTenantAccessRoleAssignment = tenantAccessRoleAssignmentData => {
  return Promise.resolve(tenantAccessRoleAssignmentData)
    .then(_createTenantAccessRoleAssignment)
    .then(R.prop('insertId'))
    .then(getTenantAccessRoleAssignmentById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = createTenantAccessRoleAssignment;
