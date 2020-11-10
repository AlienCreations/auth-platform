'use strict';

const R            = require('ramda'),
      path         = require('path'),
      moment       = require('moment'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getCloudUserById = require('../../../../server/core/controllers/api/cloudUser/getCloudUserById');

const FAKE_UNKNOWN_ID      = 999,
      FAKE_MALFORMED_ID    = 'foo',
      CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_CLOUD_USER_DATA,
    KNOWN_TEST_ID;

const birthdayLens = R.lensProp('birthday');

describe('cloudUserCtrl.getCloudUserById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_CLOUD_USER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_ID              = KNOWN_TEST_CLOUD_USER_DATA.id;
      done();
    });
  });

  it('returns cloudUserData when looking for an cloudUser by id', done => {
    getCloudUserById(KNOWN_TEST_ID)
      .then(res => {
        res = R.over(birthdayLens, d => moment(d).format(CALENDAR_DATE_FORMAT), res);
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_CLOUD_USER_DATA));
        done();
      });
  });

  it('throws an error when looking for an cloudUser that does not exist', done => {
    getCloudUserById(FAKE_UNKNOWN_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getCloudUserById(FAKE_MALFORMED_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an cloudUser without an id', done => {
    getCloudUserById()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null id', done => {
    getCloudUserById(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
