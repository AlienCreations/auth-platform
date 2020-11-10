'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const _createTenantConnection = require('../../../models/tenantConnection/methods/createTenantConnection'),
      getTenantConnectionById = require('../../../controllers/api/tenantConnection/getTenantConnectionById');

/**
 * Create a new tenantConnection record
 * @param {Object} tenantConnectionData
 */
const createTenantConnection = tenantConnectionData => {
  return Promise.resolve(tenantConnectionData)
    .then(_createTenantConnection)
    .then(R.prop('insertId'))
    .then(getTenantConnectionById)
    .then(R.omit(privateFields));
};

module.exports = createTenantConnection;
