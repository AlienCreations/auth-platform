'use strict';

const R = require('ramda');

const DB                               = require('../../../utils/db'),
      validateTenantAccessResourceData = require('../helpers/validateTenantAccessResourceData').validateForGetByUuids;

const createAndExecuteQuery = uuids => {
  const query          = `SELECT * 
                          FROM ${DB.coreDbName}.tenant_access_resources 
                          WHERE uuid IN ?`,
        queryStatement = [query, [uuids]];

  return DB.query(queryStatement)
    .then(R.filter(R.propEq(1, 'status')));
};

const getTenantAccessResourcesByUuids = uuids => {
  validateTenantAccessResourceData({ uuids });
  return createAndExecuteQuery(uuids);
};

module.exports = getTenantAccessResourcesByUuids;
