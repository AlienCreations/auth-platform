'use strict';

const R = require('ramda');

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantConnection', isObjectOf({
  tenantUuid             : isRequired(prr.isUuid),
  tenantOrganizationUuid : isOptional(R.either(prr.isUuid, prr.isNil)),
  title                  : isRequired(prr.isStringOfLengthAtMost(40)),
  description            : isOptional(prr.isString),
  protocol               : isRequired(prr.isStringOfLengthAtMost(8)),
  host                   : isRequired(prr.isStringOfLengthAtMost(64)),
  user                   : isRequired(prr.isStringOfLengthAtMost(64)),
  password               : isRequired(prr.isStringOfLengthAtMost(255)),
  port                   : isRequired(prr.isPositiveNumber),
  type                   : isRequired(prr.isPositiveNumber),
  strategy               : isRequired(prr.isStringOfLengthAtMost(64)),
  metaJson               : isOptional(prr.isJSON),
  status                 : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantConnection', isObjectOf({
  tenantUuid             : isOptional(prr.isUuid),
  tenantOrganizationUuid : isOptional(prr.isUuid),
  title                  : isOptional(prr.isStringOfLengthAtMost(40)),
  description            : isOptional(prr.isString),
  protocol               : isOptional(prr.isStringOfLengthAtMost(8)),
  host                   : isOptional(prr.isStringOfLengthAtMost(64)),
  user                   : isOptional(prr.isStringOfLengthAtMost(64)),
  password               : isOptional(prr.isStringOfLengthAtMost(255)),
  port                   : isOptional(prr.isPositiveNumber),
  type                   : isOptional(prr.isPositiveNumber),
  strategy               : isOptional(prr.isStringOfLengthAtMost(64)),
  metaJson               : isOptional(prr.isJSON),
  status                 : isOptional(prr.isAtLeastZero)
}));

const validateForGetByTenantOrganizationUuidAndType = label('getTenantConnectionsForTenantOrganizationByType', isObjectOf({
  tenantOrganizationUuid : isRequired(prr.isUuid),
  connectionType         : isRequired(prr.isPositiveNumber)
}));

const validateForGetByTenantUuid = label('getTenantConnectionsByTenantUuid', isObjectOf({
  tenantUuid : isRequired(prr.isUuid)
}));

const validateId = label('getTenantConnectionsById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getTenantConnectionsByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

module.exports = {
  validateForInsert,
  validateForUpdate,
  validateForGetByTenantOrganizationUuidAndType,
  validateId,
  validateUuid,
  validateForGetByTenantUuid,
  validateForGetById   : validateId,
  validateForGetByUuid : validateUuid,
  validateForDelete    : validateUuid
};
