'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantConnection = require('../../../models/tenantConnection/methods/deleteTenantConnection'),
      getTenantConnectionById = require('../../../models/tenantConnection/methods/getTenantConnectionById');

/**
 * Delete a tenantConnection record
 * @param {Number} id
 */
const deleteTenantConnection = id => Promise.resolve(id)
  .then(getTenantConnectionById)
  .then(R.always(id))
  .then(_deleteTenantConnection)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantConnection;
