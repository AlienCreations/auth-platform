'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantAccessResource   = require('../../../models/tenantAccessResource/methods/deleteTenantAccessResource'),
      getTenantAccessResourceByUuid = require('../../../models/tenantAccessResource/methods/getTenantAccessResourceByUuid');

const deleteTenantAccessResource = uuid => Promise.resolve(uuid)
  .then(getTenantAccessResourceByUuid)
  .then(R.always(uuid))
  .then(_deleteTenantAccessResource)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantAccessResource;
