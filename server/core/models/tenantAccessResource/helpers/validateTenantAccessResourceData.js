'use strict';

const R = require('ramda');

const {
  isObjectOf,
  isArrayOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const RECOGNIZED_REQUEST_METHODS = ['POST', 'PUT', 'DELETE', 'GET', '*'];

const validateForInsert = label('createTenantAccessResource', isObjectOf({
  tenantOrganizationUuid : isOptional(R.either(R.isNil, prr.isUuid)),
  tenantUuid             : isOptional(R.either(R.isNil, prr.isUuid)),
  title                  : isRequired(prr.isStringOfLengthAtMost(50)),
  key                    : isRequired(prr.isStringOfLengthAtMost(50)),
  uri                    : isRequired(prr.isStringOfLengthAtMost(255)),
  method                 : isRequired(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS)),
  status                 : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantAccessResource', isObjectOf({
  title  : isOptional(prr.isStringOfLengthAtMost(50)),
  key    : isOptional(prr.isStringOfLengthAtMost(50)),
  uri    : isOptional(prr.isStringOfLengthAtMost(255)),
  method : isOptional(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS)),
  status : isOptional(prr.isAtLeastZero)
}));

const validateForGetByKey = label('validateForGetByKey', isObjectOf({
  key : isRequired(prr.isStringOfLengthAtMost(50))
}));

const validateId = label('validateId', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateForGetByIds = label('validateForGetByIds', isObjectOf({
  ids : isRequired(isArrayOf(prr.isPositiveNumber))
}));

const validateUuid = label('validateUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateForGetByUuids = label('validateForGetByUuids', isObjectOf({
  uuids : isRequired(isArrayOf(prr.isUuid))
}));

const validateForGetByUriAndMethod = label('validateForGetByUriAndMethod', isObjectOf({
  tenantUuid             : isOptional(R.either(R.isNil, prr.isUuid)),
  tenantOrganizationUuid : isOptional(R.either(R.isNil, prr.isUuid)),
  uri                    : isRequired(prr.isStringOfLengthAtMost(255)),
  method                 : isRequired(prr.stringIsOneOf(RECOGNIZED_REQUEST_METHODS))
}));

const validateForGetAllowed = label('validateForGetAllowed', isObjectOf({
  tenantUuid             : isRequired(prr.isUuid),
  tenantOrganizationUuid : isOptional(R.either(R.isNil, prr.isUuid))
}));

module.exports = {
  validateForGetById   : validateId,
  validateForGetByUuid : validateUuid,
  validateForDelete    : validateUuid,
  validateId,
  validateForGetByIds,
  validateUuid,
  validateForGetByUuids,
  validateForGetAllowed,
  validateForGetByKey,
  validateForGetByUriAndMethod,
  validateForInsert,
  validateForUpdate
};
