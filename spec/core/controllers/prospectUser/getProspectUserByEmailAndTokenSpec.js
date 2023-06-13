'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectUserByEmailAndToken = require('../../../../server/core/controllers/api/prospectUser/getProspectUserByEmailAndToken');

const FAKE_UNKNOWN_EMAIL   = 'zxc@zxzxc.com',
      FAKE_UNKNOWN_TOKEN   = 'asdasdasd',
      FAKE_MALFORMED_EMAIL = 'foo',
      FAKE_MALFORMED_TOKEN = '*'.repeat(300);

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_PROSPECT_USER_DATA,
    KNOWN_TEST_EMAIL,
    KNOWN_TEST_TOKEN;

describe('prospectUserCtrl.getProspectUserByEmailAndToken', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectUsers.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_USER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_EMAIL              = KNOWN_TEST_PROSPECT_USER_DATA.email;
      KNOWN_TEST_TOKEN              = KNOWN_TEST_PROSPECT_USER_DATA.token;

      done();
    });
  });

  it('returns prospectUserData when looking for a prospectUser by email', done => {
    getProspectUserByEmailAndToken(KNOWN_TEST_EMAIL, KNOWN_TEST_TOKEN)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_PROSPECT_USER_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a prospectUser that does not exist', done => {
    getProspectUserByEmailAndToken(FAKE_UNKNOWN_EMAIL, KNOWN_TEST_TOKEN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a prospectUser given an incorrect token', done => {
    getProspectUserByEmailAndToken(KNOWN_TEST_EMAIL, FAKE_UNKNOWN_TOKEN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed email', done => {
    getProspectUserByEmailAndToken(FAKE_MALFORMED_EMAIL, KNOWN_TEST_TOKEN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed token', done => {
    getProspectUserByEmailAndToken(KNOWN_TEST_EMAIL, FAKE_MALFORMED_TOKEN)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an prospectUser with no params', done => {
    getProspectUserByEmailAndToken()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null email', done => {
    getProspectUserByEmailAndToken(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
