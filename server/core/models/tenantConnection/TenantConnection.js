'use strict';

module.exports = {
  createTenantConnection                     : require('./methods/createTenantConnection'),
  deleteTenantConnection                     : require('./methods/deleteTenantConnection'),
  getTenantConnectionForTenantLocationByType : require('./methods/getTenantConnectionsForTenantOrganizationByType'),
  getTenantConnectionsByTenantId             : require('./methods/getTenantConnectionsByTenantId'),
  getTenantConnectionById                    : require('./methods/getTenantConnectionById'),
  updateTenantConnection                     : require('./methods/updateTenantConnection')
};
