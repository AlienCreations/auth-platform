'use strict';

const R            = require('ramda'),
      path         = require('path'),
      moment       = require('moment'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getCloudUserByUuid = require('../../../../server/core/controllers/api/cloudUser/getCloudUserByUuid');

const FAKE_UNKNOWN_UUID    = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID  = 'foo',
      CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_CLOUD_USER_DATA,
    KNOWN_TEST_UUID;

const birthdayLens = R.lensProp('birthday');

describe('cloudUserCtrl.getCloudUserByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_CLOUD_USER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_UUID            = KNOWN_TEST_CLOUD_USER_DATA.uuid;
      done();
    });
  });

  it('returns cloudUserData when looking for an cloudUser by uuid', done => {
    getCloudUserByUuid(KNOWN_TEST_UUID)
      .then(res => {
        res = R.over(birthdayLens, d => moment(d).format(CALENDAR_DATE_FORMAT), res);
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_CLOUD_USER_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for an cloudUser that does not exist', done => {
    getCloudUserByUuid(FAKE_UNKNOWN_UUID)
      .then(res => {
        expect(res).toEqual({});
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uuid', done => {
    getCloudUserByUuid(FAKE_MALFORMED_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an cloudUser without an uuid', done => {
    getCloudUserByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null uuid', done => {
    getCloudUserByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
