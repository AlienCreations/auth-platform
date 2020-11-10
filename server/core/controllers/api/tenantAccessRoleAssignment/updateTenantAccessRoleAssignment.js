'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessRoleAssignment  = require('../../../models/tenantAccessRoleAssignment/methods/updateTenantAccessRoleAssignment'),
      _getTenantAccessRoleAssignmentById = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentById');

/**
 * Update a tenantAccessRoleAssignment record
 * @param {Object} tenantAccessRoleAssignmentData
 * @param {Number} id
 */
const updateTenantAccessRoleAssignment = (tenantAccessRoleAssignmentData, id) => {
  return Promise.resolve(tenantAccessRoleAssignmentData)
    .then(_updateTenantAccessRoleAssignment(id))
    .then(R.always(id))
    .then(_getTenantAccessRoleAssignmentById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessRoleAssignment;
