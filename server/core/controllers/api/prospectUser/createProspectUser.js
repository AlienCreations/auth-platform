'use strict';

const R      = require('ramda'),
      btoa   = require('btoa'),
      config = require('config');

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config),
      PRIVATE_FIELDS        = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const _createProspectUser = require('../../../models/prospectUser/methods/createProspectUser'),
      getProspectUserById = require('../../../controllers/api/prospectUser/getProspectUserById');

const inferFullName = R.compose(R.join(' '), R.props(['firstName', 'lastName']));

const makeTokenLink = (rootUrl, token, email) => {
  return `${rootUrl}/verify/${authenticator.urlBase64Encode(token)}/${btoa(email)}`;
};

const sendConfirmationEmail = (MailSvc, rootUrl) => prospectTenantData => {
  const data = R.prop(R.__, prospectTenantData);

  return MailSvc.send({
    template_name : 'createProspectUserConfirm',
    from_email    : R.pathOr('service@aliencreations.com', ['mail', 'platform', 'from', 'email'])(config),
    from_name     : R.pathOr('Alien Creations', ['mail', 'platform', 'from', 'name'])(config),
    message       : {
      subject : 'Welcome to Alien Creations!',
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
        },
        {
          name    : 'link',
          content : makeTokenLink(rootUrl, data('token'), data('email'))
        }
      ]
    }
  });
};

/**
 * Create a new prospectUser record
 */
const createProspectUser = (MailSvc, rootUrl) => prospectUserData => {
  return Promise.resolve(prospectUserData)
    .then(_createProspectUser)
    .then(R.prop('insertId'))
    .then(getProspectUserById)
    .then(R.omit(PRIVATE_FIELDS))
    .then(R.tap(sendConfirmationEmail(MailSvc, rootUrl)));
};

module.exports = createProspectUser;
