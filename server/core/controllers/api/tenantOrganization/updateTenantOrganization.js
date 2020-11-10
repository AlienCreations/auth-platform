'use strict';

const R      = require('ramda'),
      config = require('config');

const _updateTenantOrganization = require('../../../models/tenantOrganization/methods/updateTenantOrganization'),
      getTenantOrganizationById = require('../../../models/tenantOrganization/methods/getTenantOrganizationById');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const metaJsonLens       = R.lensProp('metaJson');
const maybeStringifyJson = R.when(R.has('metaJson'), R.over(metaJsonLens, JSON.stringify));

/**
 * Update a tenantOrganization record
 * @param {Object} tenantOrganizationData
 * @param {Number} id
 */
const updateTenantOrganization = (tenantOrganizationData, id) => {
  return Promise.resolve(tenantOrganizationData)
    .then(maybeStringifyJson)
    .then(_updateTenantOrganization(id))
    .then(R.always(id))
    .then(getTenantOrganizationById)
    .then(R.omit(privateFields));
};

module.exports = updateTenantOrganization;
