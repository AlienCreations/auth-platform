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

const FORMATTED_DATE_PATTERN = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
const ALLOWED_SEARCH_FIELDS  = ['id', 'first_name', 'last_name', 'email', 'phone'];
const RECOGNIZED_GENDERS     = ['M', 'F', 'T', 'X'];

const validateForSearch = label('searchCloudUsers', isObjectOf({
  field      : isRequired(prr.stringIsOneOf(ALLOWED_SEARCH_FIELDS)),
  searchTerm : isRequired(prr.isString)
}));

const validateForGetByEmail = label('getCloudUserByEmail', isObjectOf({
  email : isRequired(prr.isEmail)
}));

const validateForGetByStrategyRef = label('getCloudUserByStrategyRef', isObjectOf({
  strategy : isRequired(prr.isString),
  id       : isRequired(R.either(prr.isString, prr.isNumber))
}));

const validateId = label('getCloudUserById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getCloudUserByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateIds = label('getCloudUsersByIds', isObjectOf({
  ids : isRequired(isArrayOf(prr.isPositiveNumber))
}));

const validateUuids = label('getCloudUsersByUuids', isObjectOf({
  uuids : isRequired(isArrayOf(prr.isUuid))
}));

const validateForInsert = label('createCloudUser', isObjectOf({
  firstName      : isRequired(prr.isStringOfLengthAtMost(40)),
  lastName       : isRequired(prr.isStringOfLengthAtMost(40)),
  middleInitial  : isOptional(prr.isStringOfLength(1)),
  strategyRefs   : isOptional(prr.isJSON),
  authConfig     : isOptional(prr.isJSON),
  gender         : isOptional(prr.stringIsOneOf(RECOGNIZED_GENDERS)),
  email          : isRequired(prr.isEmail),
  password       : isRequired(prr.isStringOfLengthAtMost(64)),
  phone          : isOptional(prr.isStringOfLengthAtMost(25)),
  alternatePhone : isOptional(prr.isStringOfLengthAtMost(25)),
  address1       : isOptional(prr.isStringOfLengthAtMost(50)),
  address2       : isOptional(prr.isStringOfLengthAtMost(40)),
  city           : isOptional(prr.isStringOfLengthAtMost(40)),
  state          : isOptional(prr.isStringOfLength(2)),
  zip            : isOptional(prr.isStringOfLengthAtMost(10)),
  country        : isOptional(prr.isStringOfLength(2)),
  occupation     : isOptional(prr.isStringOfLengthAtMost(40)),
  language       : isOptional(prr.isStringOfLengthAtMost(5)),
  portrait       : isOptional(prr.isStringOfLengthAtMost(255)),
  birthday       : isOptional(prr.isStringMatching(FORMATTED_DATE_PATTERN)),
  metaJson       : isOptional(prr.isJSON),
  status         : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateCloudUser', isObjectOf({
  firstName      : isOptional(prr.isStringOfLengthAtMost(40)),
  lastName       : isOptional(prr.isStringOfLengthAtMost(40)),
  middleInitial  : isOptional(prr.isStringOfLength(1)),
  strategyRefs   : isOptional(prr.isJSON),
  authConfig     : isOptional(prr.isJSON),
  gender         : isOptional(prr.stringIsOneOf(RECOGNIZED_GENDERS)),
  email          : isOptional(prr.isEmail),
  password       : isOptional(prr.isStringOfLengthAtMost(64)),
  phone          : isOptional(prr.isStringOfLengthAtMost(25)),
  alternatePhone : isOptional(prr.isStringOfLengthAtMost(25)),
  address1       : isOptional(prr.isStringOfLengthAtMost(50)),
  address2       : isOptional(prr.isStringOfLengthAtMost(40)),
  city           : isOptional(prr.isStringOfLengthAtMost(40)),
  state          : isOptional(prr.isStringOfLength(2)),
  zip            : isOptional(prr.isStringOfLengthAtMost(10)),
  country        : isOptional(prr.isStringOfLength(2)),
  occupation     : isOptional(prr.isStringOfLengthAtMost(40)),
  language       : isOptional(prr.isStringOfLengthAtMost(5)),
  portrait       : isOptional(prr.isStringOfLengthAtMost(255)),
  birthday       : isOptional(prr.isStringMatching(FORMATTED_DATE_PATTERN)),
  metaJson       : isOptional(prr.isJSON),
  status         : isOptional(prr.isAtLeastZero)
}));

module.exports = {
  validateForGetById    : validateId,
  validateForGetByUuid  : validateUuid,
  validateForGetByIds   : validateIds,
  validateForGetByUuids : validateUuids,
  validateId,
  validateUuid,
  validateForGetByEmail,
  validateForGetByStrategyRef,
  validateForInsert,
  validateForUpdate,
  validateForSearch
};
