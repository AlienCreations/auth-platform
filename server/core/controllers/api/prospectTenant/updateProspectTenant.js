'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateProspectTenant   = require('../../../models/prospectTenant/methods/updateProspectTenant'),
      getProspectTenantByUuid = require('../../../models/prospectTenant/methods/getProspectTenantByUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.reject(
  R.identical('email'),
  R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS)
);

const updateProspectTenant = R.curry((prospectTenantData, uuid) => {
  return Promise.resolve(prospectTenantData)
    .then(_updateProspectTenant(uuid))
    .then(R.always(uuid))
    .then(getProspectTenantByUuid)
    .then(R.omit(privateFields));
});

module.exports = updateProspectTenant;
