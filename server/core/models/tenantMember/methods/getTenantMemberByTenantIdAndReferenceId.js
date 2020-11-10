'use strict';

const R = require('ramda');

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForGetByTenantIdAndReferenceId;

const createAndExecuteQuery = (tenantId, referenceId) => {
  const query = `SELECT tm.reference_id,     
                        tm.tenant_id,        
                        tm.cloud_user_id,    
                        tm.id,               
                        tm.status,           
                        cu.first_name,       
                        cu.last_name,        
                        cu.gender,           
                        cu.email,            
                        cu.phone,            
                        cu.alternate_phone,  
                        cu.portrait,         
                        cu.birthday,         
                        cu.address_1,        
                        cu.address_2,        
                        cu.city,             
                        cu.state,            
                        cu.zip,              
                        cu.created,          
                        cu.timestamp         
                FROM ${DB.coreDbName}.tenant_members tm  
                RIGHT JOIN ${DB.coreDbName}.cloud_users cu ON cu.id = tm.cloud_user_id  
                WHERE tm.tenant_id = ? AND tm.reference_id = ?  
                ORDER BY cu.last_name ASC`;

  const queryStatement = [query, [tenantId, referenceId]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an tenantMember by tenantId and referenceId
 * @param {Number} tenantId
 * @param {String} referenceId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantMemberByTenantIdAndReferenceId = R.curry((tenantId, referenceId) => {
  validateTenantMemberData({ tenantId, referenceId });
  return createAndExecuteQuery(tenantId, referenceId);
});

module.exports = getTenantMemberByTenantIdAndReferenceId;
