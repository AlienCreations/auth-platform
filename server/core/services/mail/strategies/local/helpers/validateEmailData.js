'use strict';

const R = require('ramda');

const {
  label,
  isRequired,
  isOptional,
  isObjectOf,
  prr
} = require('@aliencreations/node-validator');


const validateTemplateParams = label('template', isObjectOf({
  templateName    : isOptional(prr.isString),
  templateContent : isOptional(prr.isArray)
}));

const validateHtml = label('html', isObjectOf({
  html : isRequired(prr.isString)
}));

const validateMessageParams = label('message', isObjectOf({
  html                      : isOptional(prr.isString),
  text                      : isOptional(prr.isString),
  subject                   : isOptional(prr.isStringOfLengthAtMost(255)),
  from_email                : isOptional(prr.isString),
  from_name                 : isOptional(prr.isString),
  to                        : isOptional(prr.isArrayOfLengthAtLeast(1)),
  headers                   : isOptional(R.both(R.is(Object), R.has('Reply-To'))),
  important                 : isOptional(prr.isBoolean),
  track_opens               : isOptional(prr.isBoolean),
  track_clicks              : isOptional(prr.isBoolean),
  auto_text                 : isOptional(prr.isBoolean),
  auto_html                 : isOptional(prr.isBoolean),
  inline_css                : isOptional(prr.isBoolean),
  url_strip_qs              : isOptional(prr.isBoolean),
  preserve_recipients       : isOptional(prr.isBoolean),
  view_content_link         : isOptional(prr.isBoolean),
  bcc_address               : isOptional(prr.isString),
  tracking_domain           : isOptional(prr.isString),
  signing_domain            : isOptional(prr.isString),
  return_path_domain        : isOptional(prr.isString),
  merge                     : isOptional(prr.isBoolean),
  merge_language            : isOptional(prr.isString),
  global_merge_vars         : isOptional(prr.isArray),
  merge_vars                : isOptional(prr.isArray),
  tags                      : isOptional(prr.isArray),
  subaccount                : isOptional(prr.isString),
  google_analytics_domains  : isOptional(prr.isArray),
  google_analytics_campaign : isOptional(prr.isString),
  metadata                  : isOptional(prr.isObject),
  recipient_metadata        : isOptional(prr.isArray),
  attachments               : isOptional(prr.isArray),
  images                    : isOptional(prr.isArray)
}));

const validateTo = label('message.to', isObjectOf({
  email : isRequired(prr.isString),
  name  : isRequired(prr.isString),
  type  : isRequired(R.identical('to'))
}));

const validateGlobalMergeVar = label('message.global_merge_var', isObjectOf({
  name    : isOptional(prr.isString),
  content : isOptional(prr.isString)
}));

const validateMergeVar = label('message.merge_var', isObjectOf({
  rcpt : isOptional(prr.isString),
  vars : isOptional(prr.isArrayOfLengthAtLeast(1))
}));

// Might be inaccurate, `user_id` was used in Mandrill example.
const validateRecipientMetaData = label('message.recipient_metadata', isObjectOf({
  rcpt   : isOptional(prr.isString),
  values : isOptional(R.has('user_id'))
}));

const validateAttachment = label('message.attachment', isObjectOf({
  type    : isOptional(R.test(/\w\/\w/gi)),
  name    : isOptional(prr.isString),
  content : isOptional(prr.isString)
}));

const validateImage = label('message.image', isObjectOf({
  type    : isOptional(R.test(/image\/\w/gi)),
  name    : isOptional(prr.isString),
  content : isOptional(prr.isString)
}));

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
