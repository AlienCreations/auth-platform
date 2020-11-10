'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _createTenantAccessRole = require('../../../models/tenantAccessRole/methods/createTenantAccessRole'),
      getTenantAccessRoleById = require('../../../models/tenantAccessRole/methods/getTenantAccessRoleById');

/**
 * Create a new tenantAccessRole record
 * @param {Object} tenantAccessRoleData
 */
const createTenantAccessRole = tenantAccessRoleData => {
  return Promise.resolve(tenantAccessRoleData)
    .then(_createTenantAccessRole)
    .then(R.prop('insertId'))
    .then(getTenantAccessRoleById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = createTenantAccessRole;
