'use strict';

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForGetByTenantId;

const createAndExecuteQuery = tenantId => {
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
                WHERE tm.tenant_id = ? 
                ORDER BY cu.last_name ASC`;

  const queryStatement = [query, [tenantId]];

  return DB.querySafe(queryStatement);
};

/**
 * Look up all members under a tenant
 * @param {Number} tenantId
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantMembersByTenantId = tenantId => {
  validateTenantMemberData({ tenantId });
  return createAndExecuteQuery(tenantId);
};

module.exports = getTenantMembersByTenantId;
