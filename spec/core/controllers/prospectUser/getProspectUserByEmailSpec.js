'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectUserByEmail = require('../../../../server/core/controllers/api/prospectUser/getProspectUserByEmail');

const FAKE_UNKNOWN_EMAIL   = 'zxc@zxzxc.com',
      FAKE_MALFORMED_EMAIL = 'foo';

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      USER_PRIVATE_FIELDS   = R.path(['api', 'USER_PRIVATE_FIELDS'],   config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, USER_PRIVATE_FIELDS);

let KNOWN_TEST_PROSPECT_USER_DATA,
    KNOWN_TEST_EMAIL;

describe('prospectUserCtrl.getProspectUserByEmail', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectUsers.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_USER_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_EMAIL              = R.prop('email', KNOWN_TEST_PROSPECT_USER_DATA);
      done();
    });
  });

  it('returns prospectUserData when looking for an prospectUser by email', done => {
    getProspectUserByEmail(KNOWN_TEST_EMAIL)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(privateFields, KNOWN_TEST_PROSPECT_USER_DATA));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an prospectUser that does not exist', done => {
    getProspectUserByEmail(FAKE_UNKNOWN_EMAIL)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed email', done => {
    getProspectUserByEmail(FAKE_MALFORMED_EMAIL)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an prospectUser without an email', done => {
    getProspectUserByEmail()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a null email', done => {
    getProspectUserByEmail(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
