'use strict';

const R      = require('ramda'),
      config = require('config');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const _getProspectUserByUuid = require('../../../models/prospectUser/methods/getProspectUserByUuid');

const getProspectUserByUuid = uuid => {
  const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

  return Promise.resolve(uuid)
    .then(_getProspectUserByUuid)
    .then(R.omit(privateFields));
};

module.exports = getProspectUserByUuid;
