'use strict';

const DB                       = require('../../../utils/db'),
      validateTenantMemberData = require('../helpers/validateTenantMemberData').validateForGetById;

const createAndExecuteQuery = id => {
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
                WHERE tm.id = ?  
                ORDER BY cu.last_name ASC`;

  const queryStatement = [query, [id]];

  return DB.lookup(queryStatement);
};

/**
 * Look up an tenantMember by id
 * @param {Number} id
 * @throws {Error}
 * @returns {Promise}
 */
const getTenantMemberById = id => {
  validateTenantMemberData({ id });
  return createAndExecuteQuery(id);
};

module.exports = getTenantMemberById;
