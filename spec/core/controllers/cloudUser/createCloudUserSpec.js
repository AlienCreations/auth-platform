'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createCloudUser = require('../../../../server/core/controllers/api/cloudUser/createCloudUser'),
      commonMocks     = require('../../../_helpers/commonMocks');

const FAKE_CLOUD_USER_DATA            = {
        firstName      : 'Testfirstname',
        middleInitial  : 'T',
        lastName       : 'Testlastname',
        password       : 'abcd',
        gender         : 'M',
        email          : 'test999@9999.com',
        phone          : '555-555-5555',
        alternatePhone : '',
        address1       : '123 A Street',
        address2       : '4th floor',
        city           : 'Beverly Hills',
        state          : 'CA',
        zip            : '90210',
        occupation     : '',
        language       : 'en-US',
        portrait       : '',
        country        : 'US',
        strategyRefs   : JSON.stringify({ legacyUser : 1 }),
        authConfig     : JSON.stringify({}),
        metaJson       : JSON.stringify({}),
        status         : 1
      },
      FAKE_CLOUD_USER_DATA_INCOMPLETE = R.omit(['email', 'password'], FAKE_CLOUD_USER_DATA);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

const strategyRefsLens = R.lensProp('strategyRefs'),
      authConfigLens   = R.lensProp('authConfig'),
      metaJsonLens     = R.lensProp('metaJson');

let FAKE_CLOUD_USER_DATA_WITH_KNOWN_TEST_CLOUD_USER_EMAIL,
    decorateFakeDataToMatchResponse;

describe('cloudUserCtrl.createCloudUser', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {

      FAKE_CLOUD_USER_DATA_WITH_KNOWN_TEST_CLOUD_USER_EMAIL = R.compose(
        R.mergeDeepRight(FAKE_CLOUD_USER_DATA),
        R.objOf('email'),
        R.prop('email'),
        R.head
      )(data);

      decorateFakeDataToMatchResponse = R.compose(
        R.over(metaJsonLens, JSON.parse),
        R.over(authConfigLens, JSON.parse),
        R.over(strategyRefsLens, JSON.parse),
        R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.prop('id'), R.last)(data))
      );

      done();
    });
  });

  it('returns FAKE_CLOUD_USER_DATA when creating a cloudUser with all correct params', done => {
    createCloudUser(FAKE_CLOUD_USER_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'birthday'], res))
          .toEqual(R.omit(privateFields, decorateFakeDataToMatchResponse(FAKE_CLOUD_USER_DATA)));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when creating a cloudUser with incomplete params', done => {
    createCloudUser(FAKE_CLOUD_USER_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate cloudUser (key should be unique)', done => {
    createCloudUser(FAKE_CLOUD_USER_DATA_WITH_KNOWN_TEST_CLOUD_USER_EMAIL)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isDuplicateRecordErr(err)).toBe(true);
        done();
      });
  });
});
