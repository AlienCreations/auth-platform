'use strict';

module.exports = {
  createTenantMember                        : require('./methods/createTenantMember'),
  deleteTenantMember                        : require('./methods/deleteTenantMember'),
  getTenantMemberById                       : require('./methods/getTenantMemberById'),
  getTenantMemberByUuid                     : require('./methods/getTenantMemberByUuid'),
  getTenantMembersByTenantUuid              : require('./methods/getTenantMembersByTenantUuid'),
  getTenantMemberByTenantUuidAndReferenceId : require('./methods/getTenantMemberByTenantUuidAndReferenceId'),
  updateTenantMember                        : require('./methods/updateTenantMember')
};
