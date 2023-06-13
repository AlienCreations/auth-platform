'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenant   = require('../../../models/tenant/methods/updateTenant'),
      getTenantByUuid = require('../../../models/tenant/methods/getTenantByUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const updateTenant = (tenantData, uuid) => {
  return Promise.resolve(tenantData)
    .then(_updateTenant(uuid))
    .then(R.always(uuid))
    .then(getTenantByUuid)
    .then(R.omit(privateFields));
};

module.exports = updateTenant;
