'use strict';

const R            = require('ramda'),
      moment       = require('moment'),
      config       = require('config'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAllCloudUsers = require('../../../../server/core/controllers/api/cloudUser/getAllCloudUsers');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config),
      CALENDAR_DATE_FORMAT  = 'YYYY-MM-DD';

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_CLOUD_USER_DATA;

const birthdayLens = R.lensProp('birthday');

describe('cloudUserCtrl.getAllCloudUsers', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {

      KNOWN_TEST_CLOUD_USER_DATA = R.compose(
        R.sortWith([
          R.ascend(R.prop('lastName')),
          R.ascend(R.prop('firstName'))
        ]),
        R.map(R.omit(privateFields)),
        commonMocks.transformDbColsToJsProps
      )(data);

      done();
    });
  });

  it('returns all cloudUsers', done => {
    getAllCloudUsers()
      .then(res => {
        res = R.map(R.compose(
          R.over(birthdayLens, d => d === '0000-00-00' ? d : moment(d).format(CALENDAR_DATE_FORMAT)),
          R.omit(privateFields)
        ))(res);
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_CLOUD_USER_DATA);
        done();
      })
      .catch(done.fail);
  });
});
