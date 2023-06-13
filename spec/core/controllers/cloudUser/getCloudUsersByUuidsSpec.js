'use strict';

const R            = require('ramda'),
      path         = require('path'),
      uuid         = require('uuid/v4'),
      moment       = require('moment'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getCloudUsersByUuids = require('../../../../server/core/controllers/api/cloudUser/getCloudUsersByUuids');

const FAKE_UNKNOWN_UUIDS   = [uuid()],
      FAKE_MALFORMED_UUIDS = 'foo',
      FAKE_MALFORMED_UUID  = [uuid(), uuid(), 'foo', uuid()],
      CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_CLOUD_USER_DATA,
    KNOWN_TEST_UUIDS;

const birthdayLens = R.lensProp('birthday');

describe('cloudUserCtrl.getCloudUsersByUuids', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_CLOUD_USER_DATA = R.compose(
        R.map(R.omit(privateFields)),
        R.take(2),
        commonMocks.transformDbColsToJsProps
      )(data);

      KNOWN_TEST_UUIDS = R.pluck('uuid', KNOWN_TEST_CLOUD_USER_DATA);
      done();
    });
  });

  it('returns cloudUserData when looking for an cloudUser by ids', done => {
    getCloudUsersByUuids(KNOWN_TEST_UUIDS)
      .then(res => {
        res = R.map(
          R.over(birthdayLens, d => {
            const obj = moment(d);
            return obj.isValid() ? obj.format(CALENDAR_DATE_FORMAT) : d;
          })
        )(res);
        expect(R.map(commonMocks.recursivelyOmitProps(['timestamp', 'created']))(res))
          .toEqual(R.map(R.omit(privateFields))(KNOWN_TEST_CLOUD_USER_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('returns an empty array when looking for cloudUsers that does not exist', done => {
    getCloudUsersByUuids(FAKE_UNKNOWN_UUIDS)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uuids', done => {
    getCloudUsersByUuids(FAKE_MALFORMED_UUIDS)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid in an array of uuids', done => {
    getCloudUsersByUuids(FAKE_MALFORMED_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for cloudUsers without uuids', done => {
    getCloudUsersByUuids()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
