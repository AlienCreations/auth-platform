'use strict';

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantMember', isObjectOf({
  tenantId    : isRequired(prr.isPositiveNumber),
  cloudUserId : isRequired(prr.isPositiveNumber),
  referenceId : isRequired(prr.isStringOfLengthAtMost(60)),
  status      : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantMember', isObjectOf({
  tenantId    : isOptional(prr.isPositiveNumber),
  cloudUserId : isOptional(prr.isPositiveNumber),
  referenceId : isOptional(prr.isStringOfLengthAtMost(60)),
  status      : isOptional(prr.isAtLeastZero)
}));

const validateForGetByTenantIdAndReferenceId = label('getTenantMemberByTenantIdAndReferenceId', isObjectOf({
  tenantId    : isRequired(prr.isPositiveNumber),
  referenceId : isRequired(prr.isStringOfLengthAtMost(60))
}));

const validateId = label('getTenantMemberById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateTenantId = label('getTenantMemberByTenantId', isObjectOf({
  tenantId : isRequired(prr.isPositiveNumber)
}));

module.exports = {
  validateForGetById       : validateId,
  validateForGetByTenantId : validateTenantId,
  validateForDelete        : validateId,
  validateId,
  validateForGetByTenantIdAndReferenceId,
  validateForInsert,
  validateForUpdate
};
