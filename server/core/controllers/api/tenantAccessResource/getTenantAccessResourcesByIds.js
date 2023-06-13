'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessResourcesByIds = require('../../../models/tenantAccessResource/methods/getTenantAccessResourcesByIds');

const getTenantAccessResourcesByIds = ids => Promise.resolve(ids)
  .then(_getTenantAccessResourcesByIds)
  .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));

module.exports = getTenantAccessResourcesByIds;
