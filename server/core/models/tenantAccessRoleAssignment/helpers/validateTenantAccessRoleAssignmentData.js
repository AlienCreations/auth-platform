'use strict';

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantAccessRoleAssignment', isObjectOf({
  tenantAccessRoleId : isRequired(prr.isPositiveNumber),
  cloudUserId        : isRequired(prr.isPositiveNumber),
  status             : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantAccessRoleAssignment', isObjectOf({
  status : isOptional(prr.isAtLeastZero)
}));

const validateId = label('getTenantAccessRoleAssignmentById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateCloudUserId = label('getTenantAccessRoleAssignmentByCloudUserId', isObjectOf({
  cloudUserId : isRequired(prr.isPositiveNumber)
}));

const validateTenantAccessRoleId = label('getTenantAccessRoleAssignmentByTenantAccessRoleId', isObjectOf({
  tenantAccessRoleId : isRequired(prr.isPositiveNumber)
}));

const validateTenantOrganizationId = label('getTenantAccessRoleAssignmentByTenantOrganizationId', isObjectOf({
  tenantOrganizationId : isRequired(prr.isPositiveNumber)
}));

module.exports = {
  validateForGetById                   : validateId,
  validateForGetByTenantAccessRoleId   : validateTenantAccessRoleId,
  validateForGetByCloudUserId          : validateCloudUserId,
  validateForGetByTenantOrganizationId : validateTenantOrganizationId,
  validateForDelete                    : validateId,
  validateForDeleteByCloudUserId       : validateCloudUserId,
  validateId                           : validateId,
  validateForInsert,
  validateForUpdate
};
