'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantOrganization   = require('../../../models/tenantOrganization/methods/deleteTenantOrganization'),
      getTenantOrganizationByUuid = require('../../../models/tenantOrganization/methods/getTenantOrganizationByUuid');

const deleteTenantOrganization = uuid => Promise.resolve(uuid)
  .then(getTenantOrganizationByUuid)
  .then(R.always(uuid))
  .then(_deleteTenantOrganization)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantOrganization;
