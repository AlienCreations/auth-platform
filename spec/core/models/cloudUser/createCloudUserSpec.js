'use strict';

const R    = require('ramda'),
      cuid = require('cuid');

const createCloudUser = require('../../../../server/core/models/cloudUser/methods/createCloudUser'),
      commonMocks     = require('../../../_helpers/commonMocks');

const FAKE_FIRST_NAME         = 'Testfirstname',
      FAKE_MIDDLE_INITIAL     = 'T',
      FAKE_MALFORMED_EMAIL    = 'foo',
      FAKE_LAST_NAME          = 'Testlastname',
      FAKE_PLAINTEXT_PASSWORD = 'abcd',
      FAKE_GENDER             = 'M',
      FAKE_UNSUPPORTED_GENDER = 'J',
      FAKE_PORTRAIT           = 'http://cdn.foo.com/assets/images/photos/whatever/foo.jpg',
      FAKE_PHONE              = '555-555-5555',
      FAKE_ADDRESS            = '123 A Street',
      FAKE_ADDRESS_2          = '4th floor',
      FAKE_CITY               = 'Beverly Hills',
      FAKE_STATE              = 'CA',
      FAKE_ZIP                = '90210',
      FAKE_COUNTRY            = 'US',
      FAKE_STRATEGY_REFS      = '{ "legacyUser":2 }';

const A_NUMBER = 1337;

const makeFakeCloudUserData = includeOptional => {
  const fakeRequiredCloudUserData = {
    firstName : FAKE_FIRST_NAME,
    lastName  : FAKE_LAST_NAME,
    password  : FAKE_PLAINTEXT_PASSWORD,
    email     : cuid() + '@test.com'
  };
  const fakeOptionalCloudUserData = {
    middleInitial : FAKE_MIDDLE_INITIAL,
    phone         : FAKE_PHONE,
    address2      : FAKE_ADDRESS_2,
    portrait      : FAKE_PORTRAIT,
    gender        : FAKE_GENDER,
    address1      : FAKE_ADDRESS,
    city          : FAKE_CITY,
    state         : FAKE_STATE,
    zip           : FAKE_ZIP,
    country       : FAKE_COUNTRY,
    strategyRefs  : FAKE_STRATEGY_REFS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalCloudUserData, fakeRequiredCloudUserData) : fakeRequiredCloudUserData;
};

const fakeFullCloudUserDataForQuery     = makeFakeCloudUserData(false),
      fakeRequiredCloudUserDataForQuery = makeFakeCloudUserData(true);

const fullCloudUserDataSwapIn = commonMocks.override(fakeFullCloudUserDataForQuery);

describe('createCloudUser', () => {
  it('creates a cloud user record when given expected data for all fields', done => {
    createCloudUser(fakeFullCloudUserDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a cloud user record when given expected data for only required fields', done => {
    createCloudUser(fakeRequiredCloudUserDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given no data', () => {
    expect(() => {
      createCloudUser();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('firstName', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when firstName is missing', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('firstName', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a middleInitial of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('middleInitial', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('lastName', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when lastName is missing', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('lastName', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('email', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('email', FAKE_MALFORMED_EMAIL));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('email', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a password of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('password', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when password is missing', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('password', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a gender of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('gender', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported gender', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('gender', FAKE_UNSUPPORTED_GENDER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a address1 of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('address1', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a address2 of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('address2', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('phone', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a portrait of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('portrait', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a city of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('city', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a state of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('state', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('zip', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a country of type other than String', () => {
    expect(() => {
      createCloudUser(fullCloudUserDataSwapIn('country', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
