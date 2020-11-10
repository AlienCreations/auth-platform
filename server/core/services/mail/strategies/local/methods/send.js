'use strict';

const R    = require('ramda'),
      path = require('path'),
      pug  = require('pug');

const validateEmailData = require('../helpers/validateEmailData');

const mergeMessageBody = o => R.compose(R.mergeDeepRight(o), R.prop('message'))(o);

const assignRecipientEmailsToAddresses = R.over(
  R.lensPath(['message', 'to']),
  R.map(to => R.assoc('address', to.email, to))
);

const tidy = R.omit(['from_name', 'from_email', 'message']);

const createSenderString = o => R.compose(
  R.assoc('from', R.__, o),
  R.join(' '),
  R.over(R.lensIndex(0), a => `"${a}"`),
  R.props(['from_name', 'from_email'])
)(o);

const transformEmailPayload = R.compose(
  tidy,
  mergeMessageBody,
  assignRecipientEmailsToAddresses,
  createSenderString
);

const send = R.curry((client, _params) => {

  return new Promise((resolve, reject) => {

    const param        = R.prop(R.__, _params),
          message      = R.defaultTo({}, param('message')),
          messageProp  = R.propOr([], R.__, message);

    let params = R.clone(_params);

    try {

      if (param('template_name')) {
        validateEmailData.validateTemplateParams({
          templateName    : param('template_name'),
          templateContent : param('template_content')
        });

        const getPaths = o =>  R.compose(
          R.mergeAll,
          R.map(o => ({ [o.name] : o.content })),
          R.unnest,
          R.map(R.pathOr([], R.__, o))
        );

        const template = pug.compileFile(
          path.resolve(__dirname, `../../../../../views/emails/${params.template_name}.pug`)
        );

        params.html = template(getPaths(params)([
          ['message', 'global_merge_vars'],
          ['message', 'merge_vars']
        ]));

      } else {
        validateEmailData.validateHtml({
          html : param('html')
        });
      }

      validateEmailData.validateMessageParams(message);

      R.map(validateEmailData.validateTo,         messageProp('to'));
      R.map(validateEmailData.validateAttachment, messageProp('attachments'));

    } catch (err) {
      reject(err);
    }

    client.sendMail(transformEmailPayload(params), (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve('Message sent: %s', info.messageId);
      }
    });
  });

});

module.exports = send;
