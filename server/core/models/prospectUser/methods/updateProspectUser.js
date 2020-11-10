'use strict';

const R = require('ramda');

const DB                       = require('../../../utils/db'),
      validateProspectUserData = require('../helpers/validateProspectUserData');


const decorateDataForDbInsertion = (prospectUserData) => {
  const dataCopy = R.clone(prospectUserData);
  return dataCopy;
};

const createAndExecuteQuery = R.curry((id, _prospectUserData) => {
  const prospectUserData = decorateDataForDbInsertion(_prospectUserData);

  const fields = R.keys(prospectUserData);
  const query  = 'UPDATE ' + DB.coreDbName + '.prospect_users SET ' +
                 DB.prepareProvidedFieldsForSet(fields) + ' ' +
                 'WHERE id = ?';
  const values = R.append(id, DB.prepareValues(prospectUserData));

  const queryStatement = [query, values];

  return DB.query(queryStatement);
});

/**
 * Update a prospect user record.
 * @param {Number} id The affected record id.
 * @param {Object} prospectUserData
 * @returns {Promise}
 */
const updateProspectUser = R.curry((id, prospectUserData) => {

  if (R.either(R.isNil, R.compose(R.identical(JSON.stringify({})), JSON.stringify))(prospectUserData)) {
    return Promise.resolve(false);
  }

  validateProspectUserData.validateId({ id });
  validateProspectUserData.validateForUpdate(prospectUserData);

  return Promise.resolve(prospectUserData)
    .then(createAndExecuteQuery(id));
});

module.exports = updateProspectUser;
