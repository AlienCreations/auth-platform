'use strict';

const R = require('ramda');

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantAccessRole', isObjectOf({
  tenantId             : isRequired(prr.isPositiveNumber),
  tenantOrganizationId : isOptional(R.either(R.isNil, prr.isPositiveNumber)),
  title                : isRequired(prr.isStringOfLengthAtMost(255)),
  status               : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantAccessRole', isObjectOf({
  tenantId             : isOptional(prr.isPositiveNumber),
  tenantOrganizationId : isOptional(R.either(R.isNil, prr.isPositiveNumber)),
  title                : isOptional(prr.isStringOfLengthAtMost(255)),
  status               : isOptional(prr.isAtLeastZero)
}));

const validateId = label('getTenantAccessRoleById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateTenantId = label('getTenantAccessRolesById', isObjectOf({
  tenantId : isRequired(prr.isPositiveNumber)
}));

const validateForGetByTitle = label('getTenantAccessRoleByTitle', isObjectOf({
  title : isRequired(prr.isStringOfLengthAtMost(255))
}));

const validateTenantOrganizationId = label('getTenantAccessRolesByTenantOrganizationId', isObjectOf({
  tenantOrganizationId : isRequired(prr.isPositiveNumber)
}));

module.exports = {
  validateForGetById                   : validateId,
  validateForGetByTenantId             : validateTenantId,
  validateForGetByTenantOrganizationId : validateTenantOrganizationId,
  validateForDelete                    : validateId,
  validateId                           : validateId,
  validateForGetByTitle,
  validateForInsert,
  validateForUpdate
};
