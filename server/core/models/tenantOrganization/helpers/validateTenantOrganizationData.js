'use strict';

const {
        isObjectOf,
        isOptional,
        isRequired,
        label,
        prr
      } = require('@aliencreations/node-validator');

const validateForInsert = label('createTenantOrganization', isObjectOf({
  tenantUuid : isRequired(prr.isUuid),
  title      : isRequired(prr.isStringOfLengthAtMost(40)),
  email      : isRequired(prr.isEmail),
  password   : isRequired(prr.isStringOfLengthAtMost(64)),
  phone      : isRequired(prr.isStringOfLengthAtMost(16)),
  fax        : isOptional(prr.isStringOfLengthAtMost(16)),
  address1   : isRequired(prr.isStringOfLengthAtMost(50)),
  address2   : isOptional(prr.isStringOfLengthAtMost(40)),
  city       : isRequired(prr.isStringOfLengthAtMost(40)),
  state      : isRequired(prr.isStringOfLength(2)),
  zip        : isRequired(prr.isStringOfLengthAtMost(10)),
  country    : isRequired(prr.isStringOfLength(2)),
  taxRate    : isRequired(prr.isAtLeastZero),
  subdomain  : isRequired(prr.isStringOfLengthAtMost(30)),
  metaJson   : isOptional(prr.isJSON),
  status     : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenantOrganization', isObjectOf({
  tenantUuid : isOptional(prr.isUuid),
  title      : isOptional(prr.isStringOfLengthAtMost(40)),
  email      : isOptional(prr.isEmail),
  password   : isOptional(prr.isStringOfLengthAtMost(64)),
  phone      : isOptional(prr.isStringOfLengthAtMost(16)),
  fax        : isOptional(prr.isStringOfLengthAtMost(16)),
  address1   : isOptional(prr.isStringOfLengthAtMost(50)),
  address2   : isOptional(prr.isStringOfLengthAtMost(40)),
  city       : isOptional(prr.isStringOfLengthAtMost(40)),
  state      : isOptional(prr.isStringOfLength(2)),
  zip        : isOptional(prr.isStringOfLengthAtMost(10)),
  country    : isOptional(prr.isStringOfLength(2)),
  taxRate    : isOptional(prr.isAtLeastZero),
  subdomain  : isOptional(prr.isStringOfLengthAtMost(30)),
  metaJson   : isOptional(prr.isJSON),
  status     : isOptional(prr.isAtLeastZero)
}));

const validateForGetByTenantUuid = label('getTenantOrganizationByTenantUuid', isObjectOf({
  tenantUuid : isRequired(prr.isUuid)
}));

const validateForGetByTenantUuidAndSubdomain = label('getTenantOrganizationByTenantUuidAndSubdomain', isObjectOf({
  tenantUuid : isRequired(prr.isUuid),
  subdomain  : isRequired(prr.isStringOfLengthAtMost(30))
}));

const validateId = label('getTenantOrganizationById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getTenantOrganizationByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

module.exports = {
  validateForInsert,
  validateForUpdate,
  validateForGetByTenantUuid,
  validateForGetByTenantUuidAndSubdomain,
  validateId,
  validateUuid,
  validateForGetById   : validateId,
  validateForGetByUuid : validateUuid,
  validateForDelete    : validateUuid
};
