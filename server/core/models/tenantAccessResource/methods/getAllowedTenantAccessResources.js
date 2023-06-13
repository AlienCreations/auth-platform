'use strict';

const config = require('config');

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetAllowed;

const createAndExecutePlatformTenantQuery = () => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          ORDER BY uri ASC`;
  const queryStatement = [query, []];
  return DB.querySafe(queryStatement);
};

const createAndExecuteTenantQuery = tenantUuid => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE (tenant_uuid = ? OR tenant_uuid IS NULL)
                            AND status > 0
                          ORDER BY uri ASC`;
  const queryStatement = [query, [tenantUuid]];
  return DB.querySafe(queryStatement);
};

const createAndExecuteTenantOrganizationQuery = (tenantUuid, tenantOrganizationUuid) => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE (
                            (tenant_uuid = ? AND tenant_organization_uuid = ?)
                              OR (tenant_uuid IS NULL AND tenant_organization_uuid IS NULL)
                          )
                            AND status > 0
                          ORDER BY uri ASC`;
  const queryStatement = [query, [tenantUuid, tenantOrganizationUuid, tenantUuid]];
  return DB.querySafe(queryStatement);
};

const createAndExecuteAppropriateQuery = (tenantUuid, tenantOrganizationUuid) => {
  if (tenantUuid === config.tenancy.platformTenantUuid) {
    return createAndExecutePlatformTenantQuery();
  }
  if (tenantOrganizationUuid) {
    return createAndExecuteTenantOrganizationQuery(tenantUuid, tenantOrganizationUuid);
  }
  return createAndExecuteTenantQuery(tenantUuid);
};

const getAllowedTenantAccessResources = (tenantUuid, tenantOrganizationUuid) => {
  validateTenantAccessResourceData({ tenantUuid, tenantOrganizationUuid });
  return createAndExecuteAppropriateQuery(tenantUuid, tenantOrganizationUuid);
};

module.exports = getAllowedTenantAccessResources;
