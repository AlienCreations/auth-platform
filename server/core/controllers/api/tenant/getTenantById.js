'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const _getTenantById = require('../../../models/tenant/methods/getTenantById');

const getTenantById = id => Promise.resolve(id)
  .then(_getTenantById)
  .then(R.omit(privateFields));

module.exports = getTenantById;
