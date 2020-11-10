'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessRoleAssignment = require('../../../models/tenantAccessRoleAssignment/methods/deleteTenantAccessRoleAssignment'),
      getTenantAccessRoleAssignmentById = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentById');

/**
 * Delete a tenantAccessRoleAssignment record
 * @param {Number} id
 */
const deleteTenantAccessRoleAssignment = id => Promise.resolve(id)
  .then(getTenantAccessRoleAssignmentById)
  .then(R.always(id))
  .then(_deleteTenantAccessRoleAssignment)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantAccessRoleAssignment;
