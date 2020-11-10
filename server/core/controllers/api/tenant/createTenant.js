'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const _createTenant = require('../../../models/tenant/methods/createTenant'),
      getTenantById = require('../../../models/tenant/methods/getTenantById');

/**
 * Create a new tenant record
 * @param {Object} tenantData
 */
const createTenant = tenantData => {
  return Promise.resolve(tenantData)
    .then(_createTenant)
    .then(R.prop('insertId'))
    .then(getTenantById)
    .then(R.omit(privateFields));
};

module.exports = createTenant;
