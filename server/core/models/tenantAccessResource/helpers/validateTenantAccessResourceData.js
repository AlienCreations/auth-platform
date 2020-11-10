'use strict';

const R = require('ramda');

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const RECOGNIZED_REQUEST_METHODS = ['POST', 'PUT', 'DELETE', 'GET', '*'];

const validateForInsert = label('createTenantAccessResource', isObjectOf({
  tenantOrganizationId : isOptional(R.either(R.isNil, prr.isPositiveNumber)),
  tenantId             : isOptional(R.either(R.isNil, prr.isPositiveNumber)),
  title                : isRequired(prr.isStringOfLengthAtMost(50)),
  key                  : isRequired(prr.isStringOfLengthAtMost(50)),
  uri                  : isRequired(prr.isStringOfLengthAtMost(255)),
  method               : isRequired(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS)),
  status               : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('createTenantAccessResource', isObjectOf({
  title  : isOptional(prr.isStringOfLengthAtMost(50)),
  key    : isOptional(prr.isStringOfLengthAtMost(50)),
  uri    : isOptional(prr.isStringOfLengthAtMost(255)),
  method : isOptional(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS)),
  status : isOptional(prr.isAtLeastZero)
}));

const validateForGetByKey = label('createTenantAccessResource', isObjectOf({
  key : isRequired(prr.isStringOfLengthAtMost(50))
}));

const validateId = label('createTenantAccessResource', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateForGetByIds = label('createTenantAccessResource', isObjectOf({
  ids : isRequired(prr.isArray)
}));

const validateForGetByUriAndMethod = label('createTenantAccessResource', isObjectOf({
  tenantId             : isOptional(R.either(R.isNil, prr.isPositiveNumber)),
  tenantOrganizationId : isOptional(R.either(R.isNil, prr.isPositiveNumber)),
  uri                  : isRequired(prr.isStringOfLengthAtMost(255)),
  method               : isRequired(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS))
}));

const validateForGetAllowed = label('createTenantAccessResource', isObjectOf({
  tenantId             : isRequired(prr.isPositiveNumber),
  tenantOrganizationId : isOptional(R.either(R.isNil, prr.isPositiveNumber))
}));

module.exports = {
  validateForGetById : validateId,
  validateForDelete  : validateId,
  validateId,
  validateForGetByIds,
  validateForGetAllowed,
  validateForGetByKey,
  validateForGetByUriAndMethod,
  validateForInsert,
  validateForUpdate
};
