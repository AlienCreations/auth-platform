'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _getTenantAccessResourcesByUuids = require('../../../models/tenantAccessResource/methods/getTenantAccessResourcesByUuids');

const getTenantAccessResourcesByUuids = uuids => Promise.resolve(uuids)
  .then(_getTenantAccessResourcesByUuids)
  .then(R.map(R.omit(COMMON_PRIVATE_FIELDS)));

module.exports = getTenantAccessResourcesByUuids;
