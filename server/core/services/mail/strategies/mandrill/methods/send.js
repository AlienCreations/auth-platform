'use strict';

const R = require('ramda');

const validateEmailData = require('../helpers/validateEmailData');

const send = R.curry((client, params) => {

  return new Promise((resolve, reject) => {

    const param        = R.prop(R.__, params),
          message      = R.defaultTo({}, param('message')),
          messageProp  = R.prop(R.__, message);

    let clientMethod = '';

    try {

      if (param('template_name')) {
        validateEmailData.validateTemplateParams({
          templateName    : param('template_name'),
          templateContent : param('template_content')
        });
        clientMethod = 'sendTemplate';
      } else {
        validateEmailData.validateHtml({
          html : param('html')
        });
        clientMethod = 'send';
      }

      validateEmailData.validateMessageParams(message);

      R.map(validateEmailData.validateTo,                R.defaultTo([], messageProp('to')));
      R.map(validateEmailData.validateGlobalMergeVar,    R.defaultTo([], messageProp('global_merge_vars')));
      R.map(validateEmailData.validateMergeVar,          R.defaultTo([], messageProp('merge_vars')));
      R.map(validateEmailData.validateRecipientMetaData, R.defaultTo([], messageProp('recipient_metadata')));
      R.map(validateEmailData.validateAttachment,        R.defaultTo([], messageProp('attachments')));
      R.map(validateEmailData.validateImage,             R.defaultTo([], messageProp('images')));

    } catch (err) {
      reject(err);
    }

    params.async   = R.defaultTo(false, param('async'));
    params.ip_pool = R.defaultTo('Main Pool', param('ip_pool'));

    client.messages[clientMethod](params,
      resolve,
      reject
    );
  });
});

module.exports = send;
