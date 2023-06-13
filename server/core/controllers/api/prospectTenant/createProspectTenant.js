'use strict';

const R         = require('ramda'),
      titleCase = require('change-case').titleCase,
      config    = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config),
      PRIVATE_FIELDS        = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const _createProspectTenant = require('../../../models/prospectTenant/methods/createProspectTenant'),
      getProspectTenantById = require('../../../models/prospectTenant/methods/getProspectTenantById');

const inferFullName = R.compose(R.join(' '), R.props(['firstName', 'lastName']));

const sendConfirmationEmail = MailSvc => prospectTenantData => {
  const data = R.prop(R.__, prospectTenantData);

  return MailSvc.send({
    template_name : 'createProspectTenantConfirm',
    from_email    : R.pathOr('service@aliencreations.com', ['mail', 'platform', 'from', 'email'])(config),
    from_name     : R.pathOr('Alien Creations', ['mail', 'platform', 'from', 'name'])(config),
    message       : {
      subject : 'Alien Creations Next Steps',
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
        }
      ]
    }
  });
};


const sendLeadGenEmail = MailSvc => prospectTenantData => {
  return MailSvc.send({
    template_name : 'prospectTenantSalesNotification',
    from_email    : R.pathOr('service@aliencreations.com', ['mail', 'platform', 'from', 'email'])(config),
    from_name     : R.pathOr('Alien Creations', ['mail', 'platform', 'from', 'name'])(config),
    message       : {
      subject : 'New Prospect Tenant',
      to      : [
        {
          email : 'sales@aliencreations.com',
          name  : 'Alien Creations LeadGen',
          type  : 'to'
        }
      ],
      global_merge_vars : [
        {
          name    : 'data',
          content : R.compose(R.invertObj, R.map(titleCase), R.invertObj)(prospectTenantData)
        }
      ]
    }
  });
};

const createProspectTenant = MailSvc => prospectTenantData => {
  return Promise.resolve(prospectTenantData)
    .then(_createProspectTenant)
    .then(R.prop('insertId'))
    .then(getProspectTenantById)
    .then(R.omit(PRIVATE_FIELDS))
    .then(R.tap(sendConfirmationEmail(MailSvc)))
    .then(R.tap(sendLeadGenEmail(MailSvc)));
};

module.exports = createProspectTenant;
