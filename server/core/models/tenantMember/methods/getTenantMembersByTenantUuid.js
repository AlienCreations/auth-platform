'use strict';

const DB                             = require('../../../utils/db'),
      { validateForGetByTenantUuid } = require('../helpers/validateTenantMemberData');

const createAndExecuteQuery = tenantUuid => {
  const query = `SELECT tm.reference_id,    
                        tm.tenant_uuid,       
                        tm.cloud_user_uuid,   
                        tm.id,              
                        tm.uuid,              
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
                RIGHT JOIN ${DB.coreDbName}.cloud_users cu ON cu.uuid = tm.cloud_user_uuid 
                WHERE tm.tenant_uuid = ? 
                  AND tm.status > 0
                  AND cu.status > 0
                ORDER BY cu.last_name ASC`;

  const queryStatement = [query, [tenantUuid]];

  return DB.querySafe(queryStatement);
};

const getTenantMembersByTenantUuid = tenantUuid => {
  validateForGetByTenantUuid({ tenantUuid });
  return createAndExecuteQuery(tenantUuid);
};

module.exports = getTenantMembersByTenantUuid;
