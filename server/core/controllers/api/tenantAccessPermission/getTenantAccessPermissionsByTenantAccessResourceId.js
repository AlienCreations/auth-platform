'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessPermissionsByTenantAccessResourceId = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantAccessResourceId');

/**
 * Get all permissions for a resource from the database
 * @param {Number} tenantAccessResourceId
 */
const getTenantAccessPermissionsByTenantAccessResourceId = tenantAccessResourceId => {
  return Promise.resolve(tenantAccessResourceId)
    .then(_getTenantAccessPermissionsByTenantAccessResourceId)
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getTenantAccessPermissionsByTenantAccessResourceId;
