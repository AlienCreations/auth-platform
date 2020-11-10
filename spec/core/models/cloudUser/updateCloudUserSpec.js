'use strict';

const R = require('ramda');

const updateCloudUser  = require('../../../../server/core/models/cloudUser/methods/updateCloudUser'),
      getCloudUserById = require('../../../../server/core/models/cloudUser/methods/getCloudUserById'),
      commonMocks      = require('../../../_helpers/commonMocks');

const KNOWN_TEST_ID                  = 1,
      FAKE_UNKNOWN_ID                = 1337,
      FAKE_UPDATE_PERMISSIONS_JSON   = JSON.stringify({ foo : 'bar' }),
      FAKE_MALFORMED_JSON            = 'foo',
      FAKE_UPDATE_FIRST_NAME         = 'newfoo',
      FAKE_UPDATE_MIDDLE_INITIAL     = 'N',
      FAKE_UPDATE_LAST_NAME          = 'newbar',
      FAKE_UPDATE_GENDER             = 'F',
      FAKE_UNSUPPORTED_GENDER        = 'J',
      FAKE_UPDATE_PORTRAIT           = 'http://cdn.fooz.com/assets/images/photos/whatever/fooz.jpg',
      FAKE_UPDATE_EMAIL              = 'newfoo@newbar.com',
      FAKE_UPDATE_PLAINTEXT_PASSWORD = 'xyzasdasd',
      FAKE_UPDATE_PHONE              = '555-555-8888',
      FAKE_UPDATE_ADDRESS            = '123 B Street',
      FAKE_UPDATE_ADDRESS_2          = '5th floor',
      FAKE_UPDATE_CITY               = 'Maple Grove',
      FAKE_UPDATE_STATE              = 'MN',
      FAKE_UPDATE_ZIP                = '55369',
      FAKE_UPDATE_COUNTRY            = 'FR',
      FAKE_UPDATE_STATUS             = 2;

const A_POSITIVE_NUMBER = 1337,
      A_NEGATIVE_NUMBER = -10,
      A_STRING          = 'foo';

const assertUpdatesIfValid = (field, value) => {
  it('updates a cloudUser when given a valid ' + field, done => {
    updateCloudUser(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getCloudUserById(KNOWN_TEST_ID)
        .then(res => {
          expect(R.prop(field, res)).toBe(value);
          done();
        });
    });
  });
};

describe('updateCloudUser', () => {

  it('fails gracefully when given an unknown cloudUser id to update', done => {
    updateCloudUser(FAKE_UNKNOWN_ID, {
      firstName : FAKE_UPDATE_FIRST_NAME
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('fails gracefully when given no data', done => {
    updateCloudUser(KNOWN_TEST_ID, null).then(data => {
      expect(data).toBe(false);
      done();
    });
  });

  it('throws an error when updating a cloudUser with null id', () => {
    expect(() => {
      updateCloudUser(null, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateCloudUser(A_STRING, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given malformed JSON for permissionsJson', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        permissionsJson : FAKE_MALFORMED_JSON
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates a cloudUser when given a valid permissionsJson', done => {
    updateCloudUser(KNOWN_TEST_ID, {
      permissionsJson : FAKE_UPDATE_PERMISSIONS_JSON
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getCloudUserById(KNOWN_TEST_ID)
        .then(res => {
          expect(JSON.parse(res.permissionsJson)).toEqual(JSON.parse(FAKE_UPDATE_PERMISSIONS_JSON));
          done();
        });
    });
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        firstName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('firstName', FAKE_UPDATE_FIRST_NAME);

  it('throws an error when given a middleInitial of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        middleInitial : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('middleInitial', FAKE_UPDATE_MIDDLE_INITIAL);

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        lastName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('lastName', FAKE_UPDATE_LAST_NAME);

  it('throws an error when given a gender of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        gender : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-enum recognized gender string', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        gender : FAKE_UNSUPPORTED_GENDER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('gender', FAKE_UPDATE_GENDER);

  it('throws an error when given a password of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        password : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates a cloudUser when given a valid password', done => {
    updateCloudUser(KNOWN_TEST_ID, {
      password : FAKE_UPDATE_PLAINTEXT_PASSWORD
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getCloudUserById(KNOWN_TEST_ID)
        .then((cloudUser) => {
          expect(R.length(R.prop('password', cloudUser))).toBe(60);
          done();
        });
    });
  });

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        email : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('email', FAKE_UPDATE_EMAIL);

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        phone : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('phone', FAKE_UPDATE_PHONE);

  it('throws an error when given an address1 of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        address1 : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('address1', FAKE_UPDATE_ADDRESS);

  it('throws an error when given an address2 of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        address2 : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('address2', FAKE_UPDATE_ADDRESS_2);

  it('throws an error when given a portrait of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        portrait : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('portrait', FAKE_UPDATE_PORTRAIT);

  it('throws an error when given a city of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        city : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('city', FAKE_UPDATE_CITY);

  it('throws an error when given a state of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        state : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('state', FAKE_UPDATE_STATE);

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        zip : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('zip', FAKE_UPDATE_ZIP);

  it('throws an error when given a country of type other than String', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        country : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('country', FAKE_UPDATE_COUNTRY);

  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        status : A_STRING
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateCloudUser(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
