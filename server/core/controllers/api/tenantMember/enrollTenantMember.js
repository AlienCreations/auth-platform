'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config),
      PRIVATE_FIELDS        = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const _enrollTenantMember          = require('../../../models/tenantMember/methods/enrollTenantMember'),
      getTenantMemberById          = require('../../../controllers/api/tenantMember/getTenantMemberById'),
      createTokenAndSendResetEmail = require('../passwordReset/createTokenAndSendResetEmail');

const inferFullName = R.compose(R.join(' '), R.props(['firstName', 'lastName']));

const sendConfirmationEmail = (tenancy, MailSvc) => tenantMemberData => {
  const data = R.prop(R.__, tenantMemberData);

  const tenancyTitle = R.compose(
    R.join(' '),
    R.values,
    R.pluck('title'),
    R.defaultTo([])
  )(tenancy);

  return MailSvc.send({
    template_name : 'enrollTenantMemberConfirm',
    from_email    : R.pathOr('noreply@aliencreations.com', ['mail', 'platform', 'from', 'email'])(config),
    from_name     : R.pathOr('Alien Creations', ['mail', 'platform', 'from', 'name'])(config),
    message       : {
      to : [
        {
          email : data('email'),
          name  : inferFullName(tenantMemberData),
          type  : 'to'
        }
      ],
      global_merge_vars : [
        {
          name    : 'tenancyTitle',
          content : tenancyTitle
        }
      ]
    }
  });
};

/**
 * Create new cloudUser & tenantMember records with a transaction
 * @param logger
 * @param MailSvc
 * @returns {function(*=, *=, *=): Promise<any>}
 */
const enrollTenantMember = ({ logger, MailSvc }) => (tenancy, rootUrl, tenantMemberData) => {
  return Promise.resolve(tenantMemberData)
    .then(_enrollTenantMember(logger))
    .then(R.prop('insertId'))
    .then(getTenantMemberById)
    .then(R.omit(PRIVATE_FIELDS))
    .then(R.tap(sendConfirmationEmail(tenancy, MailSvc)))
    .then(R.tap(() => createTokenAndSendResetEmail(MailSvc, rootUrl, tenantMemberData.email)));
};

module.exports = enrollTenantMember;
