'use strict';

const R      = require('ramda'),
      config = require('config');

const getPasswordResetByEmail = require('../../../../server/core/models/passwordReset/methods/getPasswordResetByEmail'),
      commonMocks             = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_EMAIL               = 'foo@bar.com',
      FAKE_MALFORMED_EMAIL             = 'foo',
      KNOWN_TEST_TOKEN                 = '$2a$10$JKPLCeIZ8jCF36Q/vRWth.NVO.wnpPNJXD7Upq5uCUSgbhj7F8286',
      KNOWN_TEST_USER_EMAIL            = 'test@user.com',
      DYNAMICALLY_POPULATED_DB_COLUMNS = R.concat(['created'], R.path(['db', 'mysql', 'DYNAMICALLY_POPULATED_DB_COLUMNS'], config)),
      A_STRING                         = 'foo';

describe('getPasswordResetByEmail', () => {

  it('gets a passwordReset when given a known email', done => {
    getPasswordResetByEmail(KNOWN_TEST_USER_EMAIL).then(data => {
      expect(R.omit(DYNAMICALLY_POPULATED_DB_COLUMNS, data)).toEqual({
        cloudUserEmail : KNOWN_TEST_USER_EMAIL,
        token          : KNOWN_TEST_TOKEN
      });
      done();
    });
  });

  it('throws an error when given an unknown email', done => {
    getPasswordResetByEmail(FAKE_UNKNOWN_EMAIL)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      getPasswordResetByEmail(FAKE_MALFORMED_EMAIL);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      getPasswordResetByEmail(A_STRING);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      getPasswordResetByEmail();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null email', () => {
    expect(() => {
      getPasswordResetByEmail(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
