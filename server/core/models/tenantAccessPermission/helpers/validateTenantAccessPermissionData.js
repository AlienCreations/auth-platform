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
  tenantAccessRoleId     : isRequired(prr.isPositiveNumber),
  tenantAccessResourceId : isRequired(prr.isPositiveNumber),
  status                 : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantAccessPermission', isObjectOf({
  status : isOptional(prr.isAtLeastZero)
}));

const validateId = label('getTenantAccessPermissionById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateResourceId = label('getTenantAccessPermissionsByTenantAccessResourceId', isObjectOf({
  tenantAccessResourceId : isRequired(prr.isPositiveNumber)
}));

const validateTenantAccessRoleId = label('getTenantAccessPermissionsByTenantAccessRoleId', isObjectOf({
  tenantAccessRoleId : isRequired(prr.isPositiveNumber)
}));

const validateTenantOrganizationId = label('getTenantAccessPermissionsByTenantOrganizationId', isObjectOf({
  tenantOrganizationId : isRequired(prr.isPositiveNumber)
}));

const validateForCheckPermission = label('checkPermission', isObjectOf({
  tenantAccessResourceUri    : isRequired(prr.isStringOfLengthAtMost(255)),
  tenantAccessResourceMethod : isRequired(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS)),
  cloudUserId                : isRequired(prr.isPositiveNumber),
  tenantId                   : isOptional(R.either(prr.isPositiveNumber, R.isNil)),
  tenantOrganizationId       : isOptional(R.either(prr.isPositiveNumber, R.isNil))
}));

module.exports = {
  validateForGetById                     : validateId,
  validateForGetByTenantAccessRoleId     : validateTenantAccessRoleId,
  validateForGetByTenantAccessResourceId : validateResourceId,
  validateForGetByTenantOrganizationId   : validateTenantOrganizationId,
  validateForDelete                      : validateId,
  validateId                             : validateId,
  validateForInsert,
  validateForUpdate,
  validateForCheckPermission
};
