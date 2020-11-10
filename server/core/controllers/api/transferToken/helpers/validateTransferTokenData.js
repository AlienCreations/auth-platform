'use strict';

const {
  isObjectOf,
  isRequired,
  isOptional,
  label,
  prr
} = require('@aliencreations/node-validator');

const validateForCreate = label('createTransferToken', isObjectOf({
  payload : isRequired(isObjectOf({
    destination  : isRequired(prr.isString),
    authToken    : isRequired(prr.isString),
    refreshToken : isRequired(prr.isString),
    cookies      : isOptional(prr.isObject)
  })),
  expires : isOptional(prr.isNumber)
}));

const validateForVerify = label('verifyTransferToken', isObjectOf({
  transferToken : isRequired(prr.isString),
  origin        : isRequired(prr.isString)
}));

module.exports = {
  validateForCreate,
  validateForVerify
};
