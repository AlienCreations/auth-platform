'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const _getTenantByUuid = require('../../../models/tenant/methods/getTenantByUuid');

const getTenantByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantByUuid)
  .then(R.omit(privateFields));

module.exports = getTenantByUuid;
