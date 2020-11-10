'use strict';

const R          = require('ramda'),
      config     = require('config'),
      nodemailer = require('nodemailer');

const client = nodemailer.createTransport(R.path(['mail', 'local'], config));

module.exports = {
  send : require('./methods/send')(client)
};
