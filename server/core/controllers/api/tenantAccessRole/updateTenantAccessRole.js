'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessRole  = require('../../../models/tenantAccessRole/methods/updateTenantAccessRole'),
      _getTenantAccessRoleById = require('../../../models/tenantAccessRole/methods/getTenantAccessRoleById');

/**
 * Update a tenantAccessRole record
 * @param {Object} tenantAccessRoleData
 * @param {Number} id
 */
const updateTenantAccessRole = (tenantAccessRoleData, id) => {
  return Promise.resolve(tenantAccessRoleData)
    .then(_updateTenantAccessRole(id))
    .then(R.always(id))
    .then(_getTenantAccessRoleById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessRole;
