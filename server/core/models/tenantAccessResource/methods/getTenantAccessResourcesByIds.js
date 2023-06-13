'use strict';

const R = require('ramda');

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByIds;

const createAndExecuteQuery = ids => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE id IN ?`,
        queryStatement = [query, [ids]];

  return DB.query(queryStatement)
    .then(R.filter(R.propEq(1, 'status')));
};

const getTenantAccessResourcesByIds = ids => {
  validateTenantAccessResourceData({ ids });
  return createAndExecuteQuery(ids);
};

module.exports = getTenantAccessResourcesByIds;
