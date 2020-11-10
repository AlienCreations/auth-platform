'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantOrganization = require('../../../models/tenantOrganization/methods/deleteTenantOrganization'),
      getTenantOrganizationById = require('../../../models/tenantOrganization/methods/getTenantOrganizationById');

/**
 * Delete a tenantOrganization record
 * @param {Number} id
 */
const deleteTenantOrganization = id => Promise.resolve(id)
  .then(getTenantOrganizationById)
  .then(R.always(id))
  .then(_deleteTenantOrganization)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantOrganization;
