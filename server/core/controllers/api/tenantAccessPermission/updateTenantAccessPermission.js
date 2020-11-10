'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessPermission  = require('../../../models/tenantAccessPermission/methods/updateTenantAccessPermission'),
      _getTenantAccessPermissionById = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionById');

/**
 * Update a tenantAccessPermission record
 * @param {Object} tenantAccessPermissionData
 * @param {Number} id
 */
const updateTenantAccessPermission = (tenantAccessPermissionData, id) => {
  return Promise.resolve(tenantAccessPermissionData)
    .then(_updateTenantAccessPermission(id))
    .then(R.always(id))
    .then(_getTenantAccessPermissionById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessPermission;
