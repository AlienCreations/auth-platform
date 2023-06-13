'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _updateTenantAccessResource    = require('../../../models/tenantAccessResource/methods/updateTenantAccessResource'),
      _getTenantAccessResourceByUuid = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceByUuid');

const updateTenantAccessResource = (tenantAccessResourceData, uuid) => {
  return Promise.resolve(tenantAccessResourceData)
    .then(_updateTenantAccessResource(uuid))
    .then(R.always(uuid))
    .then(_getTenantAccessResourceByUuid)
    .then(R.omit(COMMON_PRIVATE_FIELDS));
};

module.exports = updateTenantAccessResource;
