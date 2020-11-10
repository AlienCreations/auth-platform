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

const createAndExecuteTenantQuery = tenantId => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE (tenant_id = ? OR tenant_id IS NULL)
                          AND status = 1
                          ORDER BY uri ASC`;
  const queryStatement = [query, [tenantId]];
  return DB.querySafe(queryStatement);
};

const createAndExecuteTenantOrganizationQuery = (tenantId, tenantOrganizationId) => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE ((tenant_id = ? AND tenant_organization_id = ?)
                          OR (tenant_id IS NULL AND tenant_organization_id IS NULL))
                          AND status = 1
                          ORDER BY uri ASC`;
  const queryStatement = [query, [tenantId, tenantOrganizationId, tenantId]];
  return DB.querySafe(queryStatement);
};

const createAndExecuteAppropriateQuery = (tenantId, tenantOrganizationId) => {
  if (tenantId === config.tenancy.platformTenantId) {
    return createAndExecutePlatformTenantQuery();
  }
  if (tenantOrganizationId) {
    return createAndExecuteTenantOrganizationQuery(tenantId, tenantOrganizationId);
  }
  return createAndExecuteTenantQuery(tenantId);
};

/**
 * Query all tenantAccessResources for a tenant or tenant organization
 * @param {Number} tenantId
 * @param {Number} tenantOrganizationId
 * @throws {Error}
 * @returns {Promise}
 */
const getAllowedTenantAccessResources = (tenantId, tenantOrganizationId) => {
  validateTenantAccessResourceData({ tenantId, tenantOrganizationId });
  return createAndExecuteAppropriateQuery(tenantId, tenantOrganizationId);
};

module.exports = getAllowedTenantAccessResources;
