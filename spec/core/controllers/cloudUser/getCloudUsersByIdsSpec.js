'use strict';

const R            = require('ramda'),
      path         = require('path'),
      moment       = require('moment'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getCloudUsersByIds = require('../../../../server/core/controllers/api/cloudUser/getCloudUsersByIds');

const FAKE_UNKNOWN_IDS     = [999],
      FAKE_MALFORMED_IDS   = 'foo',
      CALENDAR_DATE_FORMAT = 'YYYY-MM-DD';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_CLOUD_USER_DATA,
    KNOWN_TEST_IDS;

const birthdayLens = R.lensProp('birthday');

describe('cloudUserCtrl.getCloudUsersByIds', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_CLOUD_USER_DATA = R.compose(
        R.map(R.omit(privateFields)),
        R.take(2),
        commonMocks.transformDbColsToJsProps
      )(data);
      KNOWN_TEST_IDS = R.pluck('id', KNOWN_TEST_CLOUD_USER_DATA);
      done();
    });
  });

  it('returns cloudUserData when looking for an cloudUser by ids', done => {
    getCloudUsersByIds(KNOWN_TEST_IDS)
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
      });
  });

  it('returns an empty array when looking for cloudUsers that does not exist', done => {
    getCloudUsersByIds(FAKE_UNKNOWN_IDS)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed ids', done => {
    getCloudUsersByIds(FAKE_MALFORMED_IDS)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for cloudUsers without ids', done => {
    getCloudUsersByIds()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
