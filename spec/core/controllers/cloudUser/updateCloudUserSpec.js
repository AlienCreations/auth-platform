'use strict';

const R            = require('ramda'),
      path         = require('path'),
      moment       = require('moment'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateCloudUser = require('../../../../server/core/controllers/api/cloudUser/updateCloudUser');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const FAKE_CLOUD_USER_UPDATE_DATA = {
        address1 : '123 new address',
        address2 : '3rd floor'
      },
      FAKE_UNKNOWN_ID             = 99999,
      CALENDAR_DATE_FORMAT        = 'YYYY-MM-DD';

let KNOWN_TEST_CLOUD_USER_DATA,
    KNOWN_TEST_EXISTING_EMAIL,
    FAKE_CLOUD_USER_UPDATE_DATA_EXISTING_EMAIL,
    KNOWN_TEST_ID,
    updatedCloudUserData;

const birthdayLens = R.lensProp('birthday');

describe('cloudUserCtrl.updateCloudUser', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {

      KNOWN_TEST_CLOUD_USER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_ID              = KNOWN_TEST_CLOUD_USER_DATA.id;

      KNOWN_TEST_EXISTING_EMAIL                  = R.compose(R.prop('email'), R.last, commonMocks.transformDbColsToJsProps)(data);
      FAKE_CLOUD_USER_UPDATE_DATA_EXISTING_EMAIL = R.objOf('email', KNOWN_TEST_EXISTING_EMAIL);

      updatedCloudUserData = R.omit(privateFields, R.mergeRight(KNOWN_TEST_CLOUD_USER_DATA, FAKE_CLOUD_USER_UPDATE_DATA));

      done();
    });
  });

  it('updates a cloudUser when provided an id and new properties to update', done => {
    updateCloudUser(FAKE_CLOUD_USER_UPDATE_DATA, KNOWN_TEST_ID)
      .then(res => {
        res = R.over(birthdayLens, d => moment(d).format(CALENDAR_DATE_FORMAT), res);
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(updatedCloudUserData);
        done();
      });
  });

  it('throws an error when updating a cloudUser that does not exist', done => {
    updateCloudUser(FAKE_CLOUD_USER_UPDATE_DATA, FAKE_UNKNOWN_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an existing email', done => {
    updateCloudUser(FAKE_CLOUD_USER_UPDATE_DATA_EXISTING_EMAIL, KNOWN_TEST_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });

});
