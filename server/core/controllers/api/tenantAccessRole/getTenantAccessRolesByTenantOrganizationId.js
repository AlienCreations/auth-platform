'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRolesByTenantOrganizationId = require('../../../models/tenantAccessRole/methods/getTenantAccessRolesByTenantOrganizationId');

/**
 * Get all access roles under a tenant organization from the database
 * @param {Number} tenantOrganizationId
 */
const getTenantAccessRolesByTenantOrganizationId = tenantOrganizationId => {
  return Promise.resolve(tenantOrganizationId)
    .then(_getTenantAccessRolesByTenantOrganizationId)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessRolesByTenantOrganizationId;
