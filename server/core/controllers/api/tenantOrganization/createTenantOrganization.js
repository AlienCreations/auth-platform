'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const _createTenantOrganization = require('../../../models/tenantOrganization/methods/createTenantOrganization'),
      getTenantOrganizationById = require('./getTenantOrganizationById');

const createTenantOrganization = tenantOrganizationData => {
  return Promise.resolve(tenantOrganizationData)
    .then(_createTenantOrganization)
    .then(R.prop('insertId'))
    .then(getTenantOrganizationById)
    .then(R.omit(privateFields));
};

module.exports = createTenantOrganization;
