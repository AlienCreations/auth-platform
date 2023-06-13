'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const _getProspectTenantByUuid = require('../../../models/prospectTenant/methods/getProspectTenantByUuid');

const getProspectTenantByUuid = uuid => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

  return Promise.resolve(uuid)
    .then(_getProspectTenantByUuid)
    .then(R.omit(privateFields));
};

module.exports = getProspectTenantByUuid;
