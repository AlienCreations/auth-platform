'use strict';

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const ALLOWED_SEARCH_FIELDS = ['id', 'first_name', 'last_name', 'email', 'zip'];

const validateForSearch = label('searchProspectUsers', isObjectOf({
  field      : isRequired(prr.stringIsOneOf(ALLOWED_SEARCH_FIELDS)),
  searchTerm : isRequired(prr.isString)
}));

const validateForGetByEmail = label('searchProspectUsers', isObjectOf({
  email : isRequired(prr.isEmail)
}));

const validateForGetByEmailAndToken = label('getProspectUserByEmailAndToken', isObjectOf({
  email : isRequired(prr.isEmail),
  token : isRequired(prr.isStringOfLengthAtMost(60))
}));

const validateId = label('getProspectUserById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getProspectUserByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateForInsert = label('createProspectUser', isObjectOf({
  firstName : isRequired(prr.isStringOfLengthAtMost(40)),
  lastName  : isRequired(prr.isStringOfLengthAtMost(40)),
  email     : isRequired(prr.isEmail),
  zip       : isRequired(prr.isStringOfLengthAtMost(10)),
  token     : isOptional(prr.isStringOfLengthAtMost(60)),
  status    : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateProspectUser', isObjectOf({
  firstName : isOptional(prr.isStringOfLengthAtMost(40)),
  lastName  : isOptional(prr.isStringOfLengthAtMost(40)),
  email     : isOptional(prr.isEmail),
  zip       : isOptional(prr.isStringOfLengthAtMost(10)),
  token     : isOptional(prr.isStringOfLengthAtMost(60)),
  status    : isOptional(prr.isAtLeastZero)
}));

module.exports = {
  validateId,
  validateUuid,
  validateForGetByEmailAndToken,
  validateForGetByEmail,
  validateForInsert,
  validateForUpdate,
  validateForSearch,
  validateForGetById   : validateId,
  validateForGetByUuid : validateUuid
};
