'use strict';

const R = require('ramda');

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const isUuidButNotSuperAdminRole = uuid => prr.isUuid(uuid) && uuid !== process.env.SUPER_ADMIN_ROLE_UUID;

const validateForInsert = label('createTenantAccessRole', isObjectOf({
  tenantUuid             : isRequired(prr.isUuid),
  tenantOrganizationUuid : isOptional(R.either(R.isNil, prr.isUuid)),
  title                  : isRequired(prr.isStringOfLengthAtMost(255)),
  status                 : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantAccessRole', isObjectOf({
  tenantUuid             : isOptional(prr.isUuid),
  tenantOrganizationUuid : isOptional(R.either(R.isNil, prr.isUuid)),
  title                  : isOptional(prr.isStringOfLengthAtMost(255)),
  status                 : isOptional(prr.isAtLeastZero)
}));

const validateForDelete = label('deleteTenantAccessRole', isObjectOf({
  uuid : isRequired(isUuidButNotSuperAdminRole)
}));

const validateId = label('getTenantAccessRoleById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getTenantAccessRoleByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateTenantUuid = label('getTenantAccessRolesByUuid', isObjectOf({
  tenantUuid : isRequired(prr.isUuid)
}));

const validateForGetByTitle = label('getTenantAccessRoleByTitle', isObjectOf({
  title : isRequired(prr.isStringOfLengthAtMost(255))
}));

const validateTenantOrganizationUuid = label('getTenantAccessRolesByTenantOrganizationUuid', isObjectOf({
  tenantOrganizationUuid : isRequired(prr.isUuid)
}));

module.exports = {
  validateForGetById                     : validateId,
  validateForGetByUuid                   : validateUuid,
  validateForGetByTenantUuid             : validateTenantUuid,
  validateForGetByTenantOrganizationUuid : validateTenantOrganizationUuid,
  validateId,
  validateUuid,
  validateForDelete,
  validateForGetByTitle,
  validateForInsert,
  validateForUpdate
};
