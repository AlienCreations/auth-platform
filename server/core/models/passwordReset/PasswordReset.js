'use strict';

module.exports = {
  createPasswordResetToken : require('./methods/createPasswordResetToken'),
  deletePasswordResetToken : require('./methods/deletePasswordResetToken'),
  getPasswordResetByToken  : require('./methods/getPasswordResetByToken'),
  getPasswordResetByEmail  : require('./methods/getPasswordResetByEmail')
};
