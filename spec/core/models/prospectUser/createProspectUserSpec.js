'use strict';

const R    = require('ramda'),
      uuid = require('uuid/v4');

const createProspectUser = require('../../../../server/core/models/prospectUser/methods/createProspectUser'),
      commonMocks        = require('../../../_helpers/commonMocks');

const FAKE_FIRST_NAME      = 'Testfirstname',
      FAKE_MALFORMED_EMAIL = 'foo',
      FAKE_ZIP             = '12345',
      FAKE_TOKEN           = uuid(),
      FAKE_LAST_NAME       = 'Testlastname';

const A_NUMBER = 1337;

const makeFakeProspectUserData = includeOptional => {
  const fakeRequiredProspectUserData = {
    firstName : FAKE_FIRST_NAME,
    lastName  : FAKE_LAST_NAME,
    email     : `${uuid()}@test.com`,
    zip       : FAKE_ZIP
  };

  const fakeOptionalProspectUserData = {
    token : FAKE_TOKEN
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalProspectUserData, fakeRequiredProspectUserData) : fakeRequiredProspectUserData;
};

const fakeFullProspectUserDataForQuery     = makeFakeProspectUserData(false),
      fakeRequiredProspectUserDataForQuery = makeFakeProspectUserData(true);

const fullProspectUserDataSwapIn = commonMocks.override(fakeFullProspectUserDataForQuery);

describe('createProspectUser', () => {
  it('creates a prospect user record when given expected data for all fields', done => {
    createProspectUser(fakeFullProspectUserDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a prospect user record when given expected data for required fields', done => {
    createProspectUser(fakeRequiredProspectUserDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given no data', () => {
    expect(() => {
      createProspectUser();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('firstName', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when firstName is missing', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('firstName', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('lastName', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when lastName is missing', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('lastName', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('email', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('email', FAKE_MALFORMED_EMAIL));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      createProspectUser(fullProspectUserDataSwapIn('email', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
