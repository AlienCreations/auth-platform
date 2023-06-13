'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantMember   = require('../../../models/tenantMember/methods/deleteTenantMember'),
      getTenantMemberByUuid = require('../../../models/tenantMember/methods/getTenantMemberByUuid');

const deleteTenantMember = uuid => Promise.resolve(uuid)
  .then(getTenantMemberByUuid)
  .then(R.always(uuid))
  .then(_deleteTenantMember)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantMember;
