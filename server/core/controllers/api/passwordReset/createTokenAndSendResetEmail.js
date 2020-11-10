'use strict';

const R      = require('ramda'),
      btoa   = require('btoa'),
      config = require('config');

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const PasswordReset = require('../../../models/passwordReset/PasswordReset'),
      CloudUser     = require('../../../models/cloudUser/CloudUser');

const makeTokenLink = (rootUrl, token, email) => {
  return `${rootUrl}/password-reset/${authenticator.urlBase64Encode(token)}/${btoa(email)}`;
};

const inferFullName = R.compose(R.join(' '), R.props(['firstName', 'lastName']));

const sendPasswordResetEmail = (MailSvc, rootUrl) => resetData => {
  const data = R.prop(R.__, resetData);

  return MailSvc.send({
    template_name : 'passwordReset',
    from_email    : R.pathOr('noreply@aliencreations.com', ['mail', 'platform', 'from', 'email'])(config),
    from_name     : R.pathOr('Alien Creations', ['mail', 'platform', 'from', 'name'])(config),
    message       : {
      to : [
        {
          email : data('email'),
          name  : inferFullName(resetData),
          type  : 'to'
        }
      ],
      global_merge_vars : [
        {
          name    : 'link',
          content : makeTokenLink(rootUrl, data('token'), data('email'))
        }
      ]
    }
  });

};

/**
 * Create a new password_reset record
 * @param {Object} MailSvc
 * @param {String} rootUrl
 * @param {String} email
 */
const createTokenAndSendResetEmail = (MailSvc, rootUrl, email) => {
  return Promise.resolve({ cloudUserEmail : email })
    .then(PasswordReset.createPasswordResetToken)
    .then(R.always(email))
    .then(PasswordReset.getPasswordResetByEmail)
    .then(R.prop('token'))
    .then(token => {
      return Promise.resolve(email)
        .then(CloudUser.getCloudUserByEmail)
        .then(R.pick(['firstName', 'lastName', 'email']))
        .then(R.mergeDeepRight({ token }))
        .then(sendPasswordResetEmail(MailSvc, rootUrl));
    });
};

module.exports = createTokenAndSendResetEmail;
