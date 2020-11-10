'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _createTenantAccessPermission = require('../../../models/tenantAccessPermission/methods/createTenantAccessPermission'),
      getTenantAccessPermissionById = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionById');

/**
 * Create a new tenantAccessPermission record
 * @param {Object} tenantAccessPermissionData
 */
const createTenantAccessPermission = tenantAccessPermissionData => {
  return Promise.resolve(tenantAccessPermissionData)
    .then(_createTenantAccessPermission)
    .then(R.prop('insertId'))
    .then(getTenantAccessPermissionById)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = createTenantAccessPermission;
