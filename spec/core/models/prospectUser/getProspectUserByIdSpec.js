'use strict';

const R = require('ramda');

const getProspectUserById = require('../../../../server/core/models/prospectUser/methods/getProspectUserById'),
      commonMocks         = require('../../../_helpers/commonMocks');

const KNOWN_TEST_PROSPECT_USER_UD = 1;

describe('getProspectUserById', () => {
  it('gets an account when given an id of type Number', done => {
    getProspectUserById(KNOWN_TEST_PROSPECT_USER_UD)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(R.prop('id', data)).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getProspectUserById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an id of type String', () => {
    expect(() => {
      getProspectUserById('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative id', () => {
    expect(() => {
      getProspectUserById(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null id', () => {
    expect(() => {
      getProspectUserById(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
