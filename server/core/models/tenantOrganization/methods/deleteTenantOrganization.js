'use strict';

const DB                             = require('../../../utils/db'),
      validateTenantOrganizationData = require('../helpers/validateTenantOrganizationData').validateForDelete;

const createAndExecuteQuery = uuid => {
  const query          = `DELETE FROM ${DB.coreDbName}.tenant_organizations 
                          WHERE uuid = ?`,
        queryStatement = [query, [uuid]];

  return DB.query(queryStatement);
};

const deleteTenantOrganization = uuid => {
  validateTenantOrganizationData({ uuid });
  return createAndExecuteQuery(uuid);
};

module.exports = deleteTenantOrganization;
