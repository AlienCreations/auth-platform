'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const _getTenantOrganizationByUuid = require('../../../models/tenantOrganization/methods/getTenantOrganizationByUuid'),
      maybeJsonParse               = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

const getTenantOrganizationByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantOrganizationByUuid)
  .then(maybeParseJson)
  .then(R.omit(privateFields));

module.exports = getTenantOrganizationByUuid;
