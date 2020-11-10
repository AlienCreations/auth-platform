'use strict';

const R = require('ramda');

const getProspectTenantById = require('../../../../server/core/models/prospectTenant/methods/getProspectTenantById'),
      commonMocks             = require('../../../_helpers/commonMocks');

const FAKE_SEEDED_USER_ID = 1;

describe('getProspectTenantById', () => {
  it('gets an account when given an id of type Number', done => {
    getProspectTenantById(FAKE_SEEDED_USER_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      expect(R.prop('id', data)).toBe(1);
      done();
    });
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getProspectTenantById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an id of type String', () => {
    expect(() => {
      getProspectTenantById('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative id', () => {
    expect(() => {
      getProspectTenantById(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null id', () => {
    expect(() => {
      getProspectTenantById(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
