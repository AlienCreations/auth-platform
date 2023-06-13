'use strict';

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantMember', isObjectOf({
  tenantUuid    : isRequired(prr.isUuid),
  cloudUserUuid : isRequired(prr.isUuid),
  referenceId   : isRequired(prr.isStringOfLengthAtMost(60)),
  status        : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantMember', isObjectOf({
  tenantUuid    : isOptional(prr.isUuid),
  cloudUserUuid : isOptional(prr.isUuid),
  referenceId   : isOptional(prr.isStringOfLengthAtMost(60)),
  status        : isOptional(prr.isAtLeastZero)
}));

const validateForGetByTenantUuidAndReferenceId = label('getTenantMemberByTenantUuidAndReferenceId', isObjectOf({
  tenantUuid  : isRequired(prr.isUuid),
  referenceId : isRequired(prr.isStringOfLengthAtMost(60))
}));

const validateId = label('getTenantMemberById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getTenantMemberByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateTenantUuid = label('getTenantMemberByTenantUuid', isObjectOf({
  tenantUuid : isRequired(prr.isUuid)
}));

module.exports = {
  validateForGetById         : validateId,
  validateForGetByUuid       : validateUuid,
  validateForGetByTenantUuid : validateTenantUuid,
  validateForDelete          : validateUuid,
  validateId,
  validateUuid,
  validateForGetByTenantUuidAndReferenceId,
  validateForInsert,
  validateForUpdate
};
