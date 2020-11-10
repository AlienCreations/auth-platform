'use strict';

const R            = require('ramda'),
      path         = require('path'),
      moment       = require('moment'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getCloudUserByEmail = require('../../../../server/core/controllers/api/cloudUser/getCloudUserByEmail');

const FAKE_UNKNOWN_EMAIL   = 'zxc@zxzxc.com',
      FAKE_MALFORMED_EMAIL = 'foo',
      CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_CLOUD_USER_DATA,
    KNOWN_TEST_EMAIL;

const birthdayLens = R.lensProp('birthday');

describe('cloudUserCtrl.getCloudUserByEmail', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_CLOUD_USER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_EMAIL           = KNOWN_TEST_CLOUD_USER_DATA.email;
      done();
    });
  });

  it('returns cloudUserData when looking for an cloudUser by email', done => {
    getCloudUserByEmail(KNOWN_TEST_EMAIL)
      .then(res => {
        res = R.over(birthdayLens, d => moment(d).format(CALENDAR_DATE_FORMAT), res);
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_CLOUD_USER_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('returns an empty object when looking for an cloudUser that does not exist', done => {
    getCloudUserByEmail(FAKE_UNKNOWN_EMAIL)
      .then(res => {
        expect(res).toEqual({});
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed email', done => {
    getCloudUserByEmail(FAKE_MALFORMED_EMAIL)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an cloudUser without an email', done => {
    getCloudUserByEmail()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null email', done => {
    getCloudUserByEmail(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
