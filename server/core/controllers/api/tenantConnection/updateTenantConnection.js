'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenantConnection = require('../../../models/tenantConnection/methods/updateTenantConnection'),
      getTenantConnectionById = require('../../../models/tenantConnection/methods/getTenantConnectionById');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

/**
 * Update a tenantConnection record
 * @param {Object} tenantConnectionData
 * @param {Number} id
 */
const updateTenantConnection = (tenantConnectionData, id) => {
  return Promise.resolve(tenantConnectionData)
    .then(_updateTenantConnection(id))
    .then(R.always(id))
    .then(getTenantConnectionById)
    .then(R.omit(privateFields));
};

module.exports = updateTenantConnection;
