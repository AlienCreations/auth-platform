'use strict';

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantConnection', isObjectOf({
  tenantId             : isRequired(prr.isPositiveNumber),
  tenantOrganizationId : isRequired(prr.isPositiveNumber),
  title                : isRequired(prr.isStringOfLengthAtMost(40)),
  description          : isOptional(prr.isString),
  protocol             : isRequired(prr.isStringOfLengthAtMost(8)),
  host                 : isRequired(prr.isStringOfLengthAtMost(64)),
  user                 : isRequired(prr.isStringOfLengthAtMost(64)),
  password             : isRequired(prr.isStringOfLengthAtMost(255)),
  port                 : isRequired(prr.isPositiveNumber),
  type                 : isRequired(prr.isPositiveNumber),
  strategy             : isRequired(prr.isStringOfLengthAtMost(64)),
  metaJson             : isOptional(prr.isJSON),
  status               : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantConnection', isObjectOf({
  tenantId             : isOptional(prr.isPositiveNumber),
  tenantOrganizationId : isOptional(prr.isPositiveNumber),
  title                : isOptional(prr.isStringOfLengthAtMost(40)),
  description          : isOptional(prr.isString),
  protocol             : isOptional(prr.isStringOfLengthAtMost(8)),
  host                 : isOptional(prr.isStringOfLengthAtMost(64)),
  user                 : isOptional(prr.isStringOfLengthAtMost(64)),
  password             : isOptional(prr.isStringOfLengthAtMost(255)),
  port                 : isOptional(prr.isPositiveNumber),
  type                 : isOptional(prr.isPositiveNumber),
  strategy             : isOptional(prr.isStringOfLengthAtMost(64)),
  metaJson             : isOptional(prr.isJSON),
  status               : isOptional(prr.isAtLeastZero)
}));

const validateForGetByTenantOrganizationIdAndType = label('getTenantConnectionsForTenantOrganizationByType', isObjectOf({
  tenantOrganizationId : isRequired(prr.isPositiveNumber),
  connectionType       : isRequired(prr.isPositiveNumber)
}));

const validateForGetByTenantId = label('getTenantConnectionsByTenantId', isObjectOf({
  tenantId : isRequired(prr.isPositiveNumber)
}));

const validateId = label('getTenantConnectionsById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

module.exports = {
  validateForInsert,
  validateForUpdate,
  validateForGetByTenantOrganizationIdAndType,
  validateId,
  validateForGetByTenantId,
  validateForGetById : validateId,
  validateForDelete  : validateId
};
