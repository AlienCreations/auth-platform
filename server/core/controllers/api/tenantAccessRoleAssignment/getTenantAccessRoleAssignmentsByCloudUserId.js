'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentsByCloudUserId = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByCloudUserId');

/**
 * Get all access role assignments under a tenant from the database
 * @param {Number} cloudUserId
 */
const getTenantAccessRoleAssignmentsByCloudUserId = cloudUserId => {
  return Promise.resolve(cloudUserId)
    .then(_getTenantAccessRoleAssignmentsByCloudUserId)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRoleAssignmentsByCloudUserId;
