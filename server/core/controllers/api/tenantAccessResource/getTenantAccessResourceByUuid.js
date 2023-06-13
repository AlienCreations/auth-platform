'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessResourceByUuid = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceByUuid');

const getTenantAccessResourceByUuid = uuid => Promise.resolve(uuid)
  .then(_getTenantAccessResourceByUuid)
  .then(R.omit(COMMON_PRIVATE_FIELDS));

module.exports = getTenantAccessResourceByUuid;
