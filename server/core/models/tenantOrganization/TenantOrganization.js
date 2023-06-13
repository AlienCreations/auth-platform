'use strict';

module.exports = {
  createTenantOrganization                      : require('./methods/createTenantOrganization'),
  deleteTenantOrganization                      : require('./methods/deleteTenantOrganization'),
  getAllTenantOrganizations                     : require('./methods/getAllTenantOrganizations'),
  getTenantOrganizationById                     : require('./methods/getTenantOrganizationById'),
  getTenantOrganizationByUuid                   : require('./methods/getTenantOrganizationByUuid'),
  getTenantOrganizationsByTenantUuid            : require('./methods/getTenantOrganizationsByTenantUuid'),
  getTenantOrganizationByTenantUuidAndSubdomain : require('./methods/getTenantOrganizationByTenantUuidAndSubdomain'),
  updateTenantOrganization                      : require('./methods/updateTenantOrganization')
};
