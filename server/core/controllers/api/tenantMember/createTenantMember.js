'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const _createTenantMember = require('../../../models/tenantMember/methods/createTenantMember'),
      getTenantMemberById = require('../../../controllers/api/tenantMember/getTenantMemberById'),
      getCloudUserByUuid  = require('../cloudUser/getCloudUserByUuid');

const inferFullName = R.compose(R.join(' '), R.props(['firstName', 'lastName']));

const sendConfirmationEmail = (tenancy, MailSvc) => ({ cloudUserUuid }) => {
  return Promise.resolve(cloudUserUuid)
    .then(getCloudUserByUuid)
    .then(cloudUser => {
      const data = R.prop(R.__, cloudUser);

      const tenancyTitle = R.compose(
        R.join(' '),
        R.values,
        R.pluck('title'),
        R.defaultTo([])
      )(tenancy);

      return MailSvc.send({
        template_name : 'linkTenantMemberConfirm',
        from_email    : R.pathOr('noreply@aliencreations.com', ['mail', 'platform', 'from', 'email'])(config),
        from_name     : R.pathOr('Alien Creations', ['mail', 'platform', 'from', 'name'])(config),
        message       : {
          subject : `Alien Creations Account Linked To ${tenancyTitle}`,
          to      : [
            {
              email : data('email'),
              name  : inferFullName(cloudUser),
              type  : 'to'
            }
          ],
          global_merge_vars : [
            {
              name    : 'logoUrl',
              content : R.path(['mail', 'templateHeaderLogoUrl'])(config)
            },
            {
              name    : 'tenancyTitle',
              content : tenancyTitle
            }
          ]
        }
      });
    });
};

const createTenantMember = ({ MailSvc }) => (tenancy, tenantMemberData) => {
  return Promise.resolve(tenantMemberData)
    .then(_createTenantMember)
    .then(R.prop('insertId'))
    .then(getTenantMemberById)
    .then(R.omit(COMMON_PRIVATE_FIELDS))
    .then(R.tap(sendConfirmationEmail(tenancy, MailSvc)));
};

module.exports = createTenantMember;
