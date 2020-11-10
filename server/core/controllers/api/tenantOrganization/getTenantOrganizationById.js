'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const _getTenantOrganizationById = require('../../../models/tenantOrganization/methods/getTenantOrganizationById'),
      maybeJsonParse             = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

/**
 * Get a tenantOrganization by id from the database
 * @param {Number} id
 */
const getTenantOrganizationById = id => Promise.resolve(id)
  .then(_getTenantOrganizationById)
  .then(maybeParseJson)
  .then(R.omit(privateFields));

module.exports = getTenantOrganizationById;
