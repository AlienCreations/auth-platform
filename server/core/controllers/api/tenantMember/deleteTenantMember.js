'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_SQL_RETURNABLE_PROPERTIES = R.path(['api', 'COMMON_SQL_RETURNABLE_PROPERTIES'], config);

const _deleteTenantMember = require('../../../models/tenantMember/methods/deleteTenantMember'),
      getTenantMemberById = require('../../../models/tenantMember/methods/getTenantMemberById');

/**
 * Delete a tenantMember record
 * @param {Number} id
 */
const deleteTenantMember = id => Promise.resolve(id)
  .then(getTenantMemberById)
  .then(R.always(id))
  .then(_deleteTenantMember)
  .then(R.pick(COMMON_SQL_RETURNABLE_PROPERTIES));

module.exports = deleteTenantMember;
