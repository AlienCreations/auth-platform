'use strict';

const R = require('ramda');

const updateTenantOrganization  = require('../../../../server/core/models/tenantOrganization/methods/updateTenantOrganization'),
      getTenantOrganizationById = require('../../../../server/core/models/tenantOrganization/methods/getTenantOrganizationById'),
      commonMocks               = require('../../../_helpers/commonMocks');

const KNOWN_TEST_ID                  = 1,
      FAKE_UNKNOWN_ID                = 9999,
      FAKE_UPDATE_TITLE              = 'Test TenantOrganization',
      FAKE_UPDATE_EMAIL              = 'test@user.com',
      FAKE_MALFORMED_EMAIL           = 'test',
      FAKE_UPDATE_PLAINTEXT_PASSWORD = 'somenewpassword',
      FAKE_UPDATE_PHONE              = '123-422-1234',
      FAKE_UPDATE_FAX                = '123-234-5667',
      FAKE_UPDATE_ADDRESS_1          = '213 test address',
      FAKE_UPDATE_ADDRESS_2          = 'suite 2',
      FAKE_UPDATE_CITY               = 'Los Angeles',
      FAKE_UPDATE_STATE              = 'CA',
      FAKE_UPDATE_ZIP                = '90121',
      FAKE_UPDATE_COUNTRY            = 'US',
      FAKE_UPDATE_TAX_RATE           = 0.04,
      FAKE_UPDATE_SUBDOMAIN          = 'testsubdomain',
      FAKE_UPDATE_META_JSON          = JSON.stringify({
        '1st floor' : [
          { foo : 'bar', baz : 'bat' }, {
            foo : 'bar',
            baz : 'bat'
          }
        ],
        '2nd floor' : [
          { foo : 'bar', baz : 'bat' }, {
            foo : 'bar',
            baz : 'bat'
          }
        ]
      }),
      FAKE_UPDATE_STATUS             = 1;

const A_POSITIVE_NUMBER = 1337,
      A_NEGATIVE_NUMBER = -10,
      A_STRING          = 'foo';

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantOrganization when given a valid ' + field, done => {
    updateTenantOrganization(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantOrganizationById(KNOWN_TEST_ID)
        .then(res => {
          expect(R.prop(field, res)).toBe(value);
          done();
        })
        .catch(done.fail);
    })
      .catch(done.fail);
  });
};

describe('updateTenantOrganization', () => {

  it('fails gracefully when given an unknown tenantOrganization id to update', done => {
    updateTenantOrganization(FAKE_UNKNOWN_ID, {
      title : FAKE_UPDATE_TITLE
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('fails gracefully when given no data', done => {
    updateTenantOrganization(KNOWN_TEST_ID, null).then(data => {
      expect(data).toBe(false);
      done();
    });
  });

  it('throws an error when updating a tenantOrganization with null id', () => {
    expect(() => {
      updateTenantOrganization(null, {
        title : FAKE_UPDATE_TITLE
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantOrganization(A_STRING, {
        title : FAKE_UPDATE_TITLE
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        email : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        email : FAKE_MALFORMED_EMAIL
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('email', FAKE_UPDATE_EMAIL);

  it('throws an error when given a password of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        password : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates a tenantOrganization when given a valid password', done => {
    updateTenantOrganization(KNOWN_TEST_ID, {
      password : FAKE_UPDATE_PLAINTEXT_PASSWORD
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantOrganizationById(KNOWN_TEST_ID)
        .then((tenantOrganization) => {
          expect(R.length(R.prop('password', tenantOrganization))).toBe(60);
          done();
        });
    });
  });

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        phone : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('phone', FAKE_UPDATE_PHONE);

  it('throws an error when given a fax of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        fax : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('fax', FAKE_UPDATE_FAX);

  it('throws an error when given a address1 of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        address1 : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('address1', FAKE_UPDATE_ADDRESS_1);

  it('throws an error when given a address2 of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        address2 : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('address2', FAKE_UPDATE_ADDRESS_2);

  it('throws an error when given a city of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        city : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('city', FAKE_UPDATE_CITY);

  it('throws an error when given a state of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        state : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('state', FAKE_UPDATE_STATE);

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        zip : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('zip', FAKE_UPDATE_ZIP);

  it('throws an error when given a country of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        country : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('country', FAKE_UPDATE_COUNTRY);

  it('throws an error when given a taxRate of type other than Number', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        taxRate : A_STRING
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('taxRate', FAKE_UPDATE_TAX_RATE);

  it('throws an error when given a subdomain of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        subdomain : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('subdomain', FAKE_UPDATE_SUBDOMAIN);

  it('throws an error when given a metaJson of type other than String', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        metaJson : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates a tenantOrganization when given a valid metaJson', done => {
    updateTenantOrganization(KNOWN_TEST_ID, {
      metaJson : FAKE_UPDATE_META_JSON
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantOrganizationById(KNOWN_TEST_ID)
        .then(res => {
          expect(JSON.parse(res.metaJson)).toEqual(JSON.parse(FAKE_UPDATE_META_JSON));
          done();
        });
    });
  });

  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        status : A_STRING
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantOrganization(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);

});
