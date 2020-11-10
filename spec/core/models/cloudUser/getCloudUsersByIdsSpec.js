'use strict';

const R = require('ramda');

const getCloudUserByIds = require('../../../../server/core/models/cloudUser/methods/getCloudUsersByIds'),
      commonMocks      = require('../../../_helpers/commonMocks');

const FAKE_SEEDED_USER_IDS = [1, 2];

describe('getCloudUserByIds', () => {
  it('gets cloudUsers when given an ids of type Array', done => {
    getCloudUserByIds(FAKE_SEEDED_USER_IDS).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(R.pluck('id', data)).toEqual(FAKE_SEEDED_USER_IDS);
      done();
    });
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getCloudUserByIds();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an ids of type String', () => {
    expect(() => {
      getCloudUserByIds('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null ids', () => {
    expect(() => {
      getCloudUserByIds(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
