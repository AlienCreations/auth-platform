'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantConnection = require('../../../models/tenantConnection/methods/deleteTenantConnection'),
      getTenantConnectionByUuid = require('../../../models/tenantConnection/methods/getTenantConnectionByUuid');

const deleteTenantConnection = uuid => Promise.resolve(uuid)
  .then(getTenantConnectionByUuid)
  .then(R.always(uuid))
  .then(_deleteTenantConnection)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantConnection;
