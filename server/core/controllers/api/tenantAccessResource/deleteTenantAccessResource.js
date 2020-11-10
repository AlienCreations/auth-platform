'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessResource = require('../../../models/tenantAccessResource/methods/deleteTenantAccessResource'),
      getTenantAccessResourceById = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceById');

/**
 * Delete a tenantAccessResource record
 * @param {Number} id
 */
const deleteTenantAccessResource = id => Promise.resolve(id)
  .then(getTenantAccessResourceById)
  .then(R.always(id))
  .then(_deleteTenantAccessResource)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantAccessResource;
