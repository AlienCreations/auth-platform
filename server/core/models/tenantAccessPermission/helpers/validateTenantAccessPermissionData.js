'use strict';

const R = require('ramda');

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const RECOGNIZED_REQUEST_METHODS = ['POST', 'PUT', 'DELETE', 'GET'];

const validateForInsert = label('createTenantAccessPermission', isObjectOf({
  tenantAccessRoleUuid     : isRequired(prr.isUuid),
  tenantAccessResourceUuid : isRequired(prr.isUuid),
  status                   : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantAccessPermission', isObjectOf({
  status : isOptional(prr.isAtLeastZero)
}));

const validateId = label('getTenantAccessPermissionById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getTenantAccessPermissionByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateResourceUuid = label('getTenantAccessPermissionsByTenantAccessResourceUuid', isObjectOf({
  tenantAccessResourceUuid : isRequired(prr.isUuid)
}));

const validateTenantAccessRoleUuid = label('getTenantAccessPermissionsByTenantAccessRoleUuid', isObjectOf({
  tenantAccessRoleUuid : isRequired(prr.isUuid)
}));

const validateTenantOrganizationUuid = label('getTenantAccessPermissionsByTenantOrganizationUuid', isObjectOf({
  tenantOrganizationUuid : isRequired(prr.isUuid)
}));

const validateForCheckPermission = label('checkPermission', isObjectOf({
  tenantAccessResourceUri    : isRequired(prr.isStringOfLengthAtMost(255)),
  tenantAccessResourceMethod : isRequired(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS)),
  cloudUserUuid              : isRequired(prr.isUuid),
  tenantUuid                 : isOptional(R.either(prr.isUuid, R.isNil)),
  tenantOrganizationUuid     : isOptional(R.either(prr.isUuid, R.isNil))
}));

module.exports = {
  validateId,
  validateUuid,
  validateForInsert,
  validateForUpdate,
  validateForCheckPermission,
  validateForGetById                       : validateId,
  validateForGetByUuid                     : validateUuid,
  validateForGetByTenantAccessRoleUuid     : validateTenantAccessRoleUuid,
  validateForGetByTenantAccessResourceUuid : validateResourceUuid,
  validateForGetByTenantOrganizationUuid   : validateTenantOrganizationUuid,
  validateForDelete                        : validateUuid
};
