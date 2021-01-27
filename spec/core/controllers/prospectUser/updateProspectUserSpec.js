'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateProspectUser = require('../../../../server/core/controllers/api/prospectUser/updateProspectUser');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const FAKE_PROSPECT_USER_UPDATE_DATA = {
        firstName : 'foo',
        lastName  : 'bar'
      },
      FAKE_UNKNOWN_ID = 99999;

let KNOWN_TEST_PROSPECT_USER_DATA,
    KNOWN_TEST_EXISTING_EMAIL,
    FAKE_PROSPECT_USER_UPDATE_DATA_EXISTING_EMAIL,
    KNOWN_TEST_ID,
    updatedProspectUserData;

const emailLens = R.lensPath(['email']);

describe('prospectUserCtrl.updateProspectUser', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectUsers.csv'), (err, data) => {

      KNOWN_TEST_PROSPECT_USER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_ID                 = R.prop('id', KNOWN_TEST_PROSPECT_USER_DATA);

      KNOWN_TEST_EXISTING_EMAIL                     = R.compose(R.prop('email'), R.last, commonMocks.transformDbColsToJsProps)(data);
      FAKE_PROSPECT_USER_UPDATE_DATA_EXISTING_EMAIL = R.set(emailLens, KNOWN_TEST_EXISTING_EMAIL, R.omit(['id'], KNOWN_TEST_PROSPECT_USER_DATA));

      updatedProspectUserData = R.omit(privateFields, R.mergeDeepRight(KNOWN_TEST_PROSPECT_USER_DATA, FAKE_PROSPECT_USER_UPDATE_DATA));

      done();
    });
  });

  it('updates a prospectUser when provided an id and new properties to update', done => {
    updateProspectUser(FAKE_PROSPECT_USER_UPDATE_DATA, KNOWN_TEST_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(updatedProspectUserData);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating a prospectUser that does not exist', done => {
    updateProspectUser(FAKE_PROSPECT_USER_UPDATE_DATA, FAKE_UNKNOWN_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an existing email', done => {
    updateProspectUser(FAKE_PROSPECT_USER_UPDATE_DATA_EXISTING_EMAIL, KNOWN_TEST_ID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

});
