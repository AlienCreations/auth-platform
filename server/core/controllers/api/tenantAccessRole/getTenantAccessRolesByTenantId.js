'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessRolesByTenantId = require('../../../models/tenantAccessRole/methods/getTenantAccessRolesByTenantId');

/**
 * Get all access roles under a tenant from the database
 * @param {Number} tenantId
 */
const getTenantAccessRolesByTenantId = tenantId => Promise.resolve(tenantId)
  .then(_getTenantAccessRolesByTenantId)
  .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));

module.exports = getTenantAccessRolesByTenantId;
