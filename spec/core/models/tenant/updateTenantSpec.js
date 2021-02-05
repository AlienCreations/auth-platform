'use strict';

const R = require('ramda');

const updateTenant  = require('../../../../server/core/models/tenant/methods/updateTenant'),
      getTenantById = require('../../../../server/core/models/tenant/methods/getTenantById'),
      commonMocks   = require('../../../_helpers/commonMocks');

const KNOWN_TEST_ID           = 1,
      FAKE_UNKNOWN_ID         = 1337,
      FAKE_UPDATE_TITLE       = 'Test Tenant',
      FAKE_UPDATE_DOMAIN      = 'newdomain',
      FAKE_UPDATE_DESCRIPTION = 'A good test tenant',
      FAKE_UPDATE_LOGO        = 'testtenant.png',
      FAKE_UPDATE_EMAIL       = 'test@testtenant.com',
      FAKE_UPDATE_PHONE       = '555-123-4567',
      FAKE_UPDATE_FAX         = '555-123-4568',
      FAKE_UPDATE_ADDRESS_1   = '123 test street',
      FAKE_UPDATE_ADDRESS_2   = '4th floor',
      FAKE_UPDATE_CITY        = 'San Andreas',
      FAKE_UPDATE_STATE       = 'CA',
      FAKE_UPDATE_ZIP         = '90432',
      FAKE_UPDATE_COUNTRY     = 'US',
      FAKE_UPDATE_STATUS      = 1,
      FAKE_UPDATE_URL         = 'https://www.testtenant2.com';

const A_POSITIVE_NUMBER = 1337,
      A_NEGATIVE_NUMBER = -10,
      A_STRING          = 'foo';

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenant when given a valid ' + field, done => {
    updateTenant(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantById(KNOWN_TEST_ID)
        .then(tenant => {
          expect(R.prop(field, tenant)).toBe(value);
          done();
        })
        .catch(done.fail);
    })
      .catch(done.fail);
  });
};

describe('updateTenant', () => {

  it('fails gracefully when given an unknown tenant id to update', done => {
    updateTenant(FAKE_UNKNOWN_ID, {
      title : FAKE_UPDATE_TITLE
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('fails gracefully when given no data', done => {
    updateTenant(KNOWN_TEST_ID, null).then(data => {
      expect(data).toBe(false);
      done();
    });
  });

  it('throws an error when updating a tenant with null id', () => {
    expect(() => {
      updateTenant(null, {
        title : FAKE_UPDATE_TITLE
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenant(A_STRING, {
        title : FAKE_UPDATE_TITLE
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  it('throws an error when given a domain of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        domain : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('domain', FAKE_UPDATE_DOMAIN);

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        email : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('email', FAKE_UPDATE_EMAIL);

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        phone : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('phone', FAKE_UPDATE_PHONE);

  it('throws an error when given an address1 of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        address1 : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('address1', FAKE_UPDATE_ADDRESS_1);

  it('throws an error when given an address2 of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        address2 : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('address2', FAKE_UPDATE_ADDRESS_2);

  it('throws an error when given a city of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        city : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('city', FAKE_UPDATE_CITY);

  it('throws an error when given a state of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        state : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('state', FAKE_UPDATE_STATE);

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        zip : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('zip', FAKE_UPDATE_ZIP);

  it('throws an error when given a country of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        country : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('country', FAKE_UPDATE_COUNTRY);

  it('throws an error when given a description of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        description : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('description', FAKE_UPDATE_DESCRIPTION);

  it('throws an error when given a logo of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        logo : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('logo', FAKE_UPDATE_LOGO);

  it('throws an error when given a fax of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        fax : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('fax', FAKE_UPDATE_FAX);

  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        status : A_STRING
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);

  it('throws an error when given a url of type other than String', () => {
    expect(() => {
      updateTenant(KNOWN_TEST_ID, {
        url : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('url', FAKE_UPDATE_URL);

});
