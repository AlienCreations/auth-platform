'use strict';

module.exports = {
  createTenantConnection                     : require('./methods/createTenantConnection'),
  deleteTenantConnection                     : require('./methods/deleteTenantConnection'),
  getTenantConnectionById                    : require('./methods/getTenantConnectionById'),
  getTenantConnectionByUuid                  : require('./methods/getTenantConnectionByUuid'),
  getTenantConnectionForTenantLocationByType : require('./methods/getTenantConnectionsForTenantOrganizationByType'),
  getTenantConnectionsByTenantUuid           : require('./methods/getTenantConnectionsByTenantUuid'),
  updateTenantConnection                     : require('./methods/updateTenantConnection')
};
