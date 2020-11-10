'use strict';

const R      = require('ramda');
const config = require('config');

const FAILOVER_BUILD_NUM = new Date().getTime();

const index = (req, res) => res.render('layout', {
  ip          : req.header('X-Real-Ip'),
  cacheRev    : R.prop('_cacheRev', process),
  awsBucket   : R.path(['aws', 'bucket'], config),
  sessionUser : R.defaultTo('', JSON.stringify(req.user)),
  buildNum    : R.pathOr(FAILOVER_BUILD_NUM, ['env', 'BUILD_NUM'], process)
});

module.exports = index;
