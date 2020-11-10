'use strict';

const deletePasswordResetToken = require('../../../../server/core/models/passwordReset/methods/deletePasswordResetToken'),
      commonMocks              = require('../../../_helpers/commonMocks');

const KNOWN_TEST_TOKEN     = '$2a$10$JKPLCeIZ8jCF36Q/vRWth.NVO.wnpPNJXD7Upq5uCUSgbhj7F8286',
      FAKE_UNKNOWN_TOKEN   = 'xxxxxx$JKPLCeIZ8jCF36Q/vRWth.NVO.wnpPNJXD7Upq5uCUSgbhj7F8286',
      FAKE_MALFORMED_TOKEN = 'foo',
      A_POSITIVE_NUMBER    = 1000;

describe('deletePasswordResetToken', () => {

  it('deletes a reset token when given a known token', done => {
    deletePasswordResetToken(KNOWN_TEST_TOKEN).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown reset token', done => {
    deletePasswordResetToken(FAKE_UNKNOWN_TOKEN).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // TOKEN
  it('throws an error when aud is missing', () => {
    expect(() => {
      deletePasswordResetToken();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a token of type other than String', () => {
    expect(() => {
      deletePasswordResetToken(A_POSITIVE_NUMBER);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed token', () => {
    expect(() => {
      deletePasswordResetToken(FAKE_MALFORMED_TOKEN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
