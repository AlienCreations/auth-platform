'use strict';

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantAccessRoleAssignment', isObjectOf({
  tenantAccessRoleUuid : isRequired(prr.isUuid),
  cloudUserUuid        : isRequired(prr.isUuid),
  status               : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantAccessRoleAssignment', isObjectOf({
  status : isOptional(prr.isAtLeastZero)
}));

const validateId = label('getTenantAccessRoleAssignmentById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getTenantAccessRoleAssignmentByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateCloudUserUuid = label('getTenantAccessRoleAssignmentByCloudUserUuid', isObjectOf({
  cloudUserUuid : isRequired(prr.isUuid)
}));

const validateTenantAccessRoleUuid = label('getTenantAccessRoleAssignmentByTenantAccessRoleUuid', isObjectOf({
  tenantAccessRoleUuid : isRequired(prr.isUuid)
}));

const validateTenantOrganizationUuid = label('getTenantAccessRoleAssignmentByTenantOrganizationUuid', isObjectOf({
  tenantOrganizationUuid : isRequired(prr.isUuid)
}));

module.exports = {
  validateForGetById                     : validateId,
  validateForGetByUuid                   : validateUuid,
  validateForGetByTenantAccessRoleUuid   : validateTenantAccessRoleUuid,
  validateForGetByCloudUserUuid          : validateCloudUserUuid,
  validateForGetByTenantOrganizationUuid : validateTenantOrganizationUuid,
  validateForDelete                      : validateUuid,
  validateForDeleteByCloudUserUuid       : validateCloudUserUuid,
  validateId,
  validateUuid,
  validateForInsert,
  validateForUpdate
};
