'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRoleAssignmentsByTenantOrganizationId = require('../../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantOrganizationId');

/**
 * Get all role assignments under a tenant organization from the database
 * The tenantOrganizationId does not live on this record, it's inferred from a JOIN so it won't be provided
 * when we set the cache.
 * @param {Number} tenantOrganizationId
 */
const getTenantAccessRoleAssignmentsByTenantOrganizationId = tenantOrganizationId => {
  return Promise.resolve(tenantOrganizationId)
    .then(_getTenantAccessRoleAssignmentsByTenantOrganizationId)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRoleAssignmentsByTenantOrganizationId;
