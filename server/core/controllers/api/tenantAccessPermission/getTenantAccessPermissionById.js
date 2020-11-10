'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessPermissionById = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionById');

/**
 * Get a tenantAccessPermission by id from the database
 * @param {Number} id
 */
const getTenantAccessPermissionById = id => Promise.resolve(id)
  .then(_getTenantAccessPermissionById)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessPermissionById;
