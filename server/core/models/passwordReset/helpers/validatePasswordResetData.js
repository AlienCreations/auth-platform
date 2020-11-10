'use strict';

const {
  isObjectOf,
  isRequired,
  label,
  prr
} = require('@aliencreations/node-validator');

const cloudUserEmailQueryType = isObjectOf({
  cloudUserEmail : isRequired(prr.isEmail)
});

const passwordResetTokenQueryType = isObjectOf({
  token : isRequired(prr.isStringOfLength(60))
});

const validateForReplace = label('createPasswordResetToken', cloudUserEmailQueryType);

const validateForGetByToken = label('getPasswordResetByToken', passwordResetTokenQueryType);

const validateForGetByEmail = label('getPasswordResetByEmail', cloudUserEmailQueryType);

const validateForDelete = label('deletePasswordResetToken', passwordResetTokenQueryType);

module.exports = {
  validateForReplace,
  validateForGetByToken,
  validateForGetByEmail,
  validateForDelete
};
