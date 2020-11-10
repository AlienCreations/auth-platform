'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenant = require('../../../models/tenant/methods/updateTenant'),
      getTenantById = require('../../../models/tenant/methods/getTenantById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

/**
 * Update a tenant record
 * @param {Object} tenantData
 * @param {Number} id
 */
const updateTenant = (tenantData, id) => {
  return Promise.resolve(tenantData)
    .then(_updateTenant(id))
    .then(R.always(id))
    .then(getTenantById)
    .then(R.omit(privateFields));
};

module.exports = updateTenant;
