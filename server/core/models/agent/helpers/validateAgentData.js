'use strict';

const R = require('ramda');

const {
  isObjectOf,
  isOptional,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForInsert = label('createAgent', isObjectOf({
  key      : isRequired(prr.isStringOfLengthAtMost(60)),
  tenantId : isRequired(prr.isPositiveNumber),
  secret   : isRequired(prr.isStringOfLength(60)),
  name     : isRequired(R.both(prr.isStringOfLengthAtLeast(3), prr.isStringOfLengthAtMost(30))),
  status   : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateAgent', isObjectOf({
  key      : isOptional(prr.isStringOfLengthAtMost(60)),
  tenantId : isOptional(prr.isPositiveNumber),
  secret   : isOptional(prr.isStringOfLength(60)),
  name     : isOptional(R.both(prr.isStringOfLengthAtLeast(3), prr.isStringOfLengthAtMost(30))),
  status   : isOptional(prr.isAtLeastZero)
}));

const validateForDelete = label('deleteAgent', isObjectOf({
  key : isRequired(prr.isStringOfLengthAtMost(60))
}));

const validateKey = label('getAgentByKey', isObjectOf({
  key : isRequired(prr.isStringOfLengthAtMost(60))
}));

const validateId = label('getAgentById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

module.exports = {
  validateForGetByKey : validateKey,
  validateForGetById  : validateId,
  validateForInsert,
  validateForUpdate,
  validateForDelete,
  validateKey
};
