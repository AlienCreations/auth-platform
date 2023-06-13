'use strict';

const R = require('ramda');

const getCloudUserById = require('../../../../server/core/models/cloudUser/methods/getCloudUserById'),
      commonMocks      = require('../../../_helpers/commonMocks');

const FAKE_SEEDED_USER_ID = 1;

describe('getCloudUserById', () => {
  it('gets an account when given an id of type Number', done => {
    getCloudUserById(FAKE_SEEDED_USER_ID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(R.prop('id', data)).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getCloudUserById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an id of type String', () => {
    expect(() => {
      getCloudUserById('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative id', () => {
    expect(() => {
      getCloudUserById(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null id', () => {
    expect(() => {
      getCloudUserById(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
