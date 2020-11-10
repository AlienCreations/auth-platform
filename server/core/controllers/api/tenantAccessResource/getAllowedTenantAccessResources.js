'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getAllowedTenantAccessResources = require('../../../models/tenantAccessResource/methods/getAllowedTenantAccessResources');

/**
 * Get all tenantAccessResource by tenantId, and potentially tenantOrganizationId
 * @param {Number} tenantId
 * @param {Number} tenantOrganizationId
 * @returns {Promise}
 */
const getAllowedTenantAccessResources = (tenantId, tenantOrganizationId) => {
  return Promise.resolve()
    .then(() => _getAllowedTenantAccessResources(tenantId, tenantOrganizationId))
    .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));
};

module.exports = getAllowedTenantAccessResources;
