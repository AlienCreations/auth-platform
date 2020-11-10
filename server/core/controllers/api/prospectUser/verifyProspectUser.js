'use strict';

const R      = require('ramda'),
      config = require('config');

const getProspectUserByEmailAndToken = require('./getProspectUserByEmailAndToken'),
      createCloudUser                = require('../cloudUser/createCloudUser');

const inferFullName = R.compose(R.join(' '), R.props(['firstName', 'lastName']));

const sendConfirmationEmail = MailSvc => prospectTenantData => {
  const data = R.prop(R.__, prospectTenantData);

  return MailSvc.send({
    template_name : 'verifyProspectUserConfirm',
    from_email    : R.pathOr('service@aliencreations.com', ['mail', 'platform', 'from', 'email'])(config),
    from_name     : R.pathOr('Alien Creations', ['mail', 'platform', 'from', 'name'])(config),
    message       : {
      subject : 'Alien Creations Account Verified',
      to      : [
        {
          email : data('email'),
          name  : inferFullName(prospectTenantData),
          type  : 'to'
        }
      ],
      global_merge_vars : [
        {
          name    : 'logoUrl',
          content : R.path(['mail', 'templateHeaderLogoUrl'])(config)
        },
        {
          name    : 'firstName',
          content : data('firstName')
        }
      ]
    }
  });
};

/**
 * Verify a prospect user exists, and if so, create a cloudUser and notify said user.
 * @param {Object} MailSvc
 * @returns {function(*, *): Promise<*[]>}
 */
const verifyProspectUser = MailSvc => (email, token) => {
  return Promise.resolve([email, token])
    .then(R.apply(getProspectUserByEmailAndToken))
    .then(createCloudUser)
    .then(R.tap(sendConfirmationEmail(MailSvc)));
};

module.exports = verifyProspectUser;
