'use strict';

const R      = require('ramda'),
      atob   = require('atob'),
      config = require('config');

const { error, errors } = require('@aliencreations/node-error');

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const PasswordReset = require('../../../models/passwordReset/PasswordReset'),
      CloudUser     = require('../../../models/cloudUser/CloudUser');

const emailMismatchErr = () => {
  throw error(errors.auth.UNAUTHORIZED_API_ACCESS({
    message : 'Unauthorized',
    debug   : {
      internalMessage : 'Provided email does not match that on file for provided token'
    }
  }));
};

const sendConfirmationEmail = R.curry((MailSvc, cloudUserData) => {
  const data = R.prop(R.__, cloudUserData);

  return MailSvc.send({
    template_name : 'passwordResetConfirm',
    message       : {
      to : [
        {
          email : data('email'),
          name  : data('firstName') + ' ' + data('lastName'),
          type  : 'to'
        }
      ],
      merge_vars : [
        {
          name    : 'name',
          content : data('firstName') + ' ' + data('lastName')
        }
      ]
    }
  });
});

/**
 * Maybe reset a cloudUser's password
 * @param {Object} MailSvc
 * @param {Object} data
 */
const maybeResetPassword = (MailSvc, data) => {
  const cloudUserEmail = atob(data.emailHash),
        password       = data.password,
        token          = R.tryCatch(authenticator.urlBase64Decode, R.always(''))(data.token);

  return Promise.resolve(token)
    .then(PasswordReset.getPasswordResetByToken)
    .then(R.unless(R.propEq('cloudUserEmail', cloudUserEmail), emailMismatchErr))
    .then(R.always(cloudUserEmail))
    .then(CloudUser.getCloudUserByEmail)
    .then(cloudUser => {
      return Promise.resolve(cloudUser)
        .then(R.prop('id'))
        .then(CloudUser.updateCloudUser(R.__, { password }))
        .then(R.always(token))
        .then(PasswordReset.deletePasswordResetToken)
        .then(R.always(cloudUser))
        .then(R.pick(['email', 'firstName', 'lastName']))
        .then(sendConfirmationEmail(MailSvc));
    });
};

module.exports = maybeResetPassword;
