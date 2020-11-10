'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessRole = require('../../../models/tenantAccessRole/methods/deleteTenantAccessRole'),
      getTenantAccessRoleById = require('../../../models/tenantAccessRole/methods/getTenantAccessRoleById');

/**
 * Delete a tenantAccessRole record
 * @param {Number} id
 */
const deleteTenantAccessRole = id => Promise.resolve(id)
  .then(getTenantAccessRoleById)
  .then(R.always(id))
  .then(_deleteTenantAccessRole)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantAccessRole;
