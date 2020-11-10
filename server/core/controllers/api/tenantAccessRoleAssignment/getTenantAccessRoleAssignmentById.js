'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentById = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentById');

/**
 * Get a tenantAccessRoleAssignment by id from the database
 * @param {Number} id
 */
const getTenantAccessRoleAssignmentById = id => Promise.resolve(id)
  .then(_getTenantAccessRoleAssignmentById)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessRoleAssignmentById;
