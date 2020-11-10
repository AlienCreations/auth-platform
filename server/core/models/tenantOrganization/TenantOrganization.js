'use strict';

module.exports = {
  createTenantOrganization                    : require('./methods/createTenantOrganization'),
  deleteTenantOrganization                    : require('./methods/deleteTenantOrganization'),
  getAllTenantOrganizations                   : require('./methods/getAllTenantOrganizations'),
  getTenantOrganizationById                   : require('./methods/getTenantOrganizationById'),
  getTenantOrganizationsByTenantId            : require('./methods/getTenantOrganizationsByTenantId'),
  getTenantOrganizationByTenantIdAndSubdomain : require('./methods/getTenantOrganizationByTenantIdAndSubdomain'),
  updateTenantOrganization                    : require('./methods/updateTenantOrganization')
};
