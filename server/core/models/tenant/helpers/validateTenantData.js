'use strict';

const {
        isObjectOf,
        isOptional,
        isRequired,
        label,
        prr
      } = require('@aliencreations/node-validator');

const validateForInsert = label('createTenant', isObjectOf({
  domain      : isRequired(prr.isStringOfLengthAtMost(30)),
  title       : isRequired(prr.isStringOfLengthAtMost(40)),
  description : isOptional(prr.isString),
  logo        : isOptional(prr.isStringOfLengthAtMost(30)),
  email       : isRequired(prr.isEmail),
  phone       : isRequired(prr.isStringOfLengthAtMost(16)),
  fax         : isOptional(prr.isStringOfLengthAtMost(16)),
  address1    : isRequired(prr.isStringOfLengthAtMost(50)),
  address2    : isOptional(prr.isStringOfLengthAtMost(40)),
  city        : isRequired(prr.isStringOfLengthAtMost(40)),
  state       : isRequired(prr.isStringOfLength(2)),
  zip         : isRequired(prr.isStringOfLengthAtMost(16)),
  country     : isRequired(prr.isStringOfLength(2)),
  url         : isOptional(prr.isStringOfLengthAtMost(255)),
  status      : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateTenant', isObjectOf({
  domain      : isOptional(prr.isStringOfLengthAtMost(30)),
  title       : isOptional(prr.isStringOfLengthAtMost(40)),
  description : isOptional(prr.isString),
  logo        : isOptional(prr.isStringOfLengthAtMost(30)),
  email       : isOptional(prr.isEmail),
  phone       : isOptional(prr.isStringOfLengthAtMost(16)),
  fax         : isOptional(prr.isStringOfLengthAtMost(16)),
  address1    : isOptional(prr.isStringOfLengthAtMost(50)),
  address2    : isOptional(prr.isStringOfLengthAtMost(40)),
  city        : isOptional(prr.isStringOfLengthAtMost(40)),
  state       : isOptional(prr.isStringOfLength(2)),
  zip         : isOptional(prr.isStringOfLengthAtMost(16)),
  country     : isOptional(prr.isStringOfLength(2)),
  status      : isOptional(prr.isAtLeastZero),
  url         : isOptional(prr.isStringOfLengthAtMost(255))
}));

const validateForGetByTenantDomain = label('getTenantByDomain', isObjectOf({
  domain : isRequired(prr.isStringOfLengthAtMost(30))
}));

const validateId = label('getTenantById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getTenantByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

module.exports = {
  validateForInsert,
  validateForUpdate,
  validateId,
  validateUuid,
  validateForGetByDomain : validateForGetByTenantDomain,
  validateForGetById     : validateId,
  validateForGetByUuid   : validateUuid
};
