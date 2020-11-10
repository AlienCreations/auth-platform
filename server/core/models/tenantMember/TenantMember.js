'use strict';

module.exports = {
  createTenantMember                      : require('./methods/createTenantMember'),
  deleteTenantMember                      : require('./methods/deleteTenantMember'),
  getTenantMemberById                     : require('./methods/getTenantMemberById'),
  getTenantMembersByTenantId              : require('./methods/getTenantMembersByTenantId'),
  getTenantMemberByTenantIdAndReferenceId : require('./methods/getTenantMemberByTenantIdAndReferenceId'),
  updateTenantMember                      : require('./methods/updateTenantMember')
};
