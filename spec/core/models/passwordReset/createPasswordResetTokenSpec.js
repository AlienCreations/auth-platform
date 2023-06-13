'use strict';

const R = require('ramda');

const createPasswordResetToken = require('../../../../server/core/models/passwordReset/methods/createPasswordResetToken'),
      commonMocks              = require('../../../_helpers/commonMocks');

const A_STRING = 'foo';

const KNOWN_TEST_USER_EMAIL                 = 'chuck@norris.com',
      KNOWN_TEST_USER_EMAIL_HAS_RESET_TOKEN = 'test@user.com',
      FAKE_UNKNOWN_USER_EMAIL               = 'foo@bar.com';

const MYSQL_REPLACE_INTO_AFFECTED_ROWS = 2;

const fullPasswordResetDataForQuery = {
  cloudUserEmail : KNOWN_TEST_USER_EMAIL
};

const fullPasswordResetDataSwapIn = commonMocks.override(fullPasswordResetDataForQuery);

describe('createPasswordResetToken', () => {
  it('creates password reset token and inserts record when given a known email', done => {
    createPasswordResetToken(fullPasswordResetDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('re-creates a token when given an email which already has a valid token', done => {
    createPasswordResetToken(fullPasswordResetDataSwapIn('cloudUserEmail', KNOWN_TEST_USER_EMAIL_HAS_RESET_TOKEN))
      .then(data => {
        expect(data.affectedRows).toBe(MYSQL_REPLACE_INTO_AFFECTED_ROWS);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createPasswordResetToken(fullPasswordResetDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // USER_EMAIL
  it('throws an error when cloudUserEmail is missing', () => {
    expect(() => {
      createPasswordResetToken(fullPasswordResetDataSwapIn('cloudUserEmail', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a cloudUserEmail of type other than Number', () => {
    expect(() => {
      createPasswordResetToken(fullPasswordResetDataSwapIn('cloudUserEmail', A_STRING));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unknown cloudUserEmail', done => {
    createPasswordResetToken(fullPasswordResetDataSwapIn('cloudUserEmail', FAKE_UNKNOWN_USER_EMAIL))
      .then(done.fail)
      .catch(err => {
        expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
        done();
      });
  });
});
