'use strict';

const R = require('ramda');

const updateProspectTenant  = require('../../../../server/core/models/prospectTenant/methods/updateProspectTenant'),
      getProspectTenantById = require('../../../../server/core/models/prospectTenant/methods/getProspectTenantById'),
      commonMocks           = require('../../../_helpers/commonMocks');

const KNOWN_TEST_ID            = 1,
      FAKE_UNKNOWN_ID          = 1337,
      FAKE_UPDATE_FIRST_NAME   = 'newfoo',
      FAKE_UPDATE_LAST_NAME    = 'newbar',
      FAKE_UPDATE_EMAIL        = 'newfoo@newbar.com',
      FAKE_UPDATE_PHONE        = '555-333-1231',
      FAKE_UPDATE_ZIP          = '12345',
      FAKE_UPDATE_TENANT_TITLE = 'some new title';

const A_POSITIVE_NUMBER = 1337,
      A_STRING          = 'foo';

const assertUpdatesIfValid = (field, value) => {
  it('updates a prospectTenant when given a valid ' + field, done => {
    updateProspectTenant(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getProspectTenantById(KNOWN_TEST_ID)
        .then((prospectTenant) => {
          expect(R.prop(field, prospectTenant)).toBe(value);
          done();
        });
    });
  });
};

describe('updateProspectTenant', () => {

  it('fails gracefully when given an unknown prospectTenant id to update', done => {
    updateProspectTenant(FAKE_UNKNOWN_ID, {
      firstName : FAKE_UPDATE_FIRST_NAME
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('fails gracefully when given no data', done => {
    updateProspectTenant(KNOWN_TEST_ID, null).then(data => {
      expect(data).toBe(false);
      done();
    });
  });

  it('throws an error when updating a prospectTenant with null id', () => {
    expect(() => {
      updateProspectTenant(null, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateProspectTenant(A_STRING, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_ID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_ID, {
        firstName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('firstName', FAKE_UPDATE_FIRST_NAME);

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_ID, {
        lastName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('lastName', FAKE_UPDATE_LAST_NAME);

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_ID, {
        email : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('email', FAKE_UPDATE_EMAIL);

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_ID, {
        phone : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('phone', FAKE_UPDATE_PHONE);

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_ID, {
        zip : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('zip', FAKE_UPDATE_ZIP);

  it('throws an error when given a tenantTitle of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_ID, {
        tenantTitle : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('tenantTitle', FAKE_UPDATE_TENANT_TITLE);

});
