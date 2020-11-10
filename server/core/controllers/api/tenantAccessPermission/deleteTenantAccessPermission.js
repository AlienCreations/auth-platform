'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessPermission = require('../../../models/tenantAccessPermission/methods/deleteTenantAccessPermission'),
      getTenantAccessPermissionById = require('../../../models/tenantAccessPermission/methods/getTenantAccessPermissionById');

/**
 * Delete a tenantAccessPermission record
 * @param {Number} id
 */
const deleteTenantAccessPermission = id => {
  return Promise.resolve(id)
    .then(getTenantAccessPermissionById)
    .then(R.always(id))
    .then(_deleteTenantAccessPermission)
    .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));
};

module.exports = deleteTenantAccessPermission;
