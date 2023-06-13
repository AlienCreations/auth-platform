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
  key        : isRequired(prr.isStringOfLengthAtMost(60)),
  tenantUuid : isRequired(prr.isUuid),
  secret     : isRequired(prr.isStringOfLength(60)),
  name       : isRequired(R.both(prr.isStringOfLengthAtLeast(3), prr.isStringOfLengthAtMost(30))),
  status     : isOptional(prr.isAtLeastZero)
}));

const validateForUpdate = label('updateAgent', isObjectOf({
  key        : isOptional(prr.isStringOfLengthAtMost(60)),
  tenantUuid : isOptional(prr.isUuid),
  secret     : isOptional(prr.isStringOfLength(60)),
  name       : isOptional(R.both(prr.isStringOfLengthAtLeast(3), prr.isStringOfLengthAtMost(30))),
  status     : isOptional(prr.isAtLeastZero)
}));

const validateForDelete = label('deleteAgent', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

const validateKey = label('getAgentByKey', isObjectOf({
  key : isRequired(prr.isStringOfLengthAtMost(60))
}));

const validateId = label('getAgentById', isObjectOf({
  id : isRequired(prr.isPositiveNumber)
}));

const validateUuid = label('getAgentByUuid', isObjectOf({
  uuid : isRequired(prr.isUuid)
}));

module.exports = {
  validateForGetByKey  : validateKey,
  validateForGetById   : validateId,
  validateForGetByUuid : validateUuid,
  validateForInsert,
  validateForUpdate,
  validateForDelete,
  validateId,
  validateKey,
  validateUuid
};
