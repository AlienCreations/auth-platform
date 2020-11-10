'use strict';

const R                                      = require('ramda'),
      { V, prr, validatePayload : validate } = require('@aliencreations/node-validator');

const isBoolean = R.is(Boolean);

const validateTemplateParams = validate('template')({
  templateName    : prr.isString,
  templateContent : prr.isArray
});

const validateHtml = validate('html')({
  html : V.required(prr.isString)
});

const validateMessageParams = validate('message')({
  html                      : prr.isString,
  text                      : prr.isString,
  subject                   : prr.isStringOfLengthAtMost(255),
  from_email                : prr.isString,
  from_name                 : prr.isString,
  to                        : prr.isArrayOfLengthAtLeast(1),
  headers                   : R.both(R.is(Object), R.has('Reply-To')),
  important                 : isBoolean,
  track_opens               : isBoolean,
  track_clicks              : isBoolean,
  auto_text                 : isBoolean,
  auto_html                 : isBoolean,
  inline_css                : isBoolean,
  url_strip_qs              : isBoolean,
  preserve_recipients       : isBoolean,
  view_content_link         : isBoolean,
  bcc_address               : prr.isString,
  tracking_domain           : prr.isString,
  signing_domain            : prr.isString,
  return_path_domain        : prr.isString,
  merge                     : isBoolean,
  merge_language            : prr.isString,
  global_merge_vars         : prr.isArray,
  merge_vars                : prr.isArray,
  tags                      : prr.isArray,
  subaccount                : prr.isString,
  google_analytics_domains  : prr.isArray,
  google_analytics_campaign : prr.isString,
  metadata                  : R.is(Object),
  recipient_metadata        : prr.isArray,
  attachments               : prr.isArray,
  images                    : prr.isArray
});

const validateTo = validate('message.to')({
  email : V.required(prr.isString),
  name  : V.required(prr.isString),
  type  : V.required(R.identical('to'))
});

const validateGlobalMergeVar = validate('message.global_merge_var')({
  name    : prr.isString,
  content : prr.isString
});

const validateMergeVar = validate('message.merge_var')({
  rcpt : prr.isString,
  vars : prr.isArrayOfLengthAtLeast(1)
});

// Might be inaccurate, `user_id` was used in Mandrill example.
const validateRecipientMetaData = validate('message.recipient_metadata')({
  rcpt   : prr.isString,
  values : R.has('user_id')
});

const validateAttachment = validate('message.attachment')({
  type    : R.test(/\w\/\w/gi),
  name    : prr.isString,
  content : prr.isString
});

const validateImage = validate('message.image')({
  type    : R.test(/image\/\w/gi),
  name    : prr.isString,
  content : prr.isString
});

module.exports = {
  validateMessageParams,
  validateTemplateParams,
  validateTo,
  validateGlobalMergeVar,
  validateMergeVar,
  validateRecipientMetaData,
  validateAttachment,
  validateImage,
  validateHtml
};
