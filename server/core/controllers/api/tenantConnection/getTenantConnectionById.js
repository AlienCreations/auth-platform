'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const _getTenantConnectionById = require('../../../models/tenantConnection/methods/getTenantConnectionById'),
      maybeJsonParse           = require('../_helpers/maybeConvertJsonFields').parse;

const maybeParseJson = maybeJsonParse(['metaJson']);

/**
 * Get a tenantConnection by id from the database
 * @param {Number} id
 */
const getTenantConnectionById = id => Promise.resolve(id)
  .then(_getTenantConnectionById)
  .then(maybeParseJson)
  .then(R.omit(privateFields));

module.exports = getTenantConnectionById;
