'use strict';

const R      = require('ramda'),
      config = require('config');

const getPasswordResetByToken = require('../../../../server/core/models/passwordReset/methods/getPasswordResetByToken'),
      commonMocks             = require('../../../_helpers/commonMocks');

const KNOWN_TEST_TOKEN                 = '$2a$10$JKPLCeIZ8jCF36Q/vRWth.NVO.wnpPNJXD7Upq5uCUSgbhj7F8286',
      FAKE_UNKNOWN_TOKEN               = 'xxxxxx$JKPLCeIZ8jCF36Q/vRWth.NVO.wnpPNJXD7Upq5uCUSgbhj7F8286',
      FAKE_MALFORMED_TOKEN             = 'foo',
      KNOWN_TEST_USER_EMAIL            = 'test@user.com',
      DYNAMICALLY_POPULATED_DB_COLUMNS = R.concat(['created'], R.path(['db', 'mysql', 'DYNAMICALLY_POPULATED_DB_COLUMNS'], config)),
      A_STRING                         = 'foo';

describe('getPasswordResetByToken', () => {
  it('gets a passwordReset when given a known token', done => {
    getPasswordResetByToken(KNOWN_TEST_TOKEN)
      .then(data => {
        expect(R.omit(DYNAMICALLY_POPULATED_DB_COLUMNS, data)).toEqual({
          cloudUserEmail : KNOWN_TEST_USER_EMAIL,
          token          : KNOWN_TEST_TOKEN,
          status         : 1
        });
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unknown token', done => {
    getPasswordResetByToken(FAKE_UNKNOWN_TOKEN)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed token', () => {
    expect(() => {
      getPasswordResetByToken(FAKE_MALFORMED_TOKEN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a token of type other than String', () => {
    expect(() => {
      getPasswordResetByToken(A_STRING);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when token is missing', () => {
    expect(() => {
      getPasswordResetByToken();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null token', () => {
    expect(() => {
      getPasswordResetByToken(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
