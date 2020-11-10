'use strict';

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const ALLOWED_SEARCH_FIELDS = ['id', 'first_name', 'last_name', 'email', 'zip'];

const validateForSearch = label('searchProspectTenants', isObjectOf({
  field      : isRequired(prr.stringIsOneOf(ALLOWED_SEARCH_FIELDS)),
  searchTerm : isRequired(prr.isString)
}));

const validateForGetByEmail = label('searchProspectTenants', isObjectOf({
  email : isRequired(prr.isEmail)
}));

const validateForGetByEmailAndToken = label('getProspectTenantByEmailAndToken', isObjectOf({
  email : isRequired(prr.isEmail),
  token : isRequired(prr.isStringOfLengthAtMost(60))
}));

const validateId = label('getProspectTenantById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateForInsert = label('createProspectTenant', isObjectOf({
  firstName   : isRequired(prr.isStringOfLengthAtMost(40)),
  lastName    : isRequired(prr.isStringOfLengthAtMost(40)),
  email       : isRequired(prr.isEmail),
  phone       : isRequired(prr.isStringOfLengthAtMost(16)),
  zip         : isRequired(prr.isStringOfLengthAtMost(10)),
  tenantTitle : isRequired(prr.isStringOfLengthAtMost(40)),
  token       : isOptional(prr.isStringOfLengthAtMost(60)),
  status      : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateProspectTenant', isObjectOf({
  firstName   : isOptional(prr.isStringOfLengthAtMost(40)),
  lastName    : isOptional(prr.isStringOfLengthAtMost(40)),
  email       : isOptional(prr.isEmail),
  phone       : isOptional(prr.isStringOfLengthAtMost(16)),
  zip         : isOptional(prr.isStringOfLengthAtMost(10)),
  token       : isOptional(prr.isStringOfLengthAtMost(60)),
  tenantTitle : isOptional(prr.isStringOfLengthAtMost(40)),
  status      : isOptional(prr.isAtLeastZero)
}));

module.exports = {
  validateId,
  validateForGetByEmail,
  validateForGetByEmailAndToken,
  validateForInsert,
  validateForUpdate,
  validateForSearch,
  validateForGetById : validateId
};
