'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenantConnection   = require('../../../models/tenantConnection/methods/updateTenantConnection'),
      getTenantConnectionByUuid = require('../../../models/tenantConnection/methods/getTenantConnectionByUuid');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const updateTenantConnection = (tenantConnectionData, uuid) => {
  return Promise.resolve(tenantConnectionData)
    .then(_updateTenantConnection(uuid))
    .then(R.always(uuid))
    .then(getTenantConnectionByUuid)
    .then(R.omit(privateFields));
};

module.exports = updateTenantConnection;
