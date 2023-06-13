'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateProspectTenant    = require('../../../../server/core/models/prospectTenant/methods/updateProspectTenant'),
      getProspectTenantByUuid = require('../../../../server/core/models/prospectTenant/methods/getProspectTenantByUuid'),
      commonMocks             = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID        = commonMocks.COMMON_UUID,
      FAKE_UPDATE_FIRST_NAME   = 'newfoo',
      FAKE_UPDATE_LAST_NAME    = 'newbar',
      FAKE_UPDATE_EMAIL        = 'newfoo@newbar.com',
      FAKE_UPDATE_PHONE        = '555-333-1231',
      FAKE_UPDATE_ZIP          = '12345',
      FAKE_UPDATE_TENANT_TITLE = 'some new title';

const A_POSITIVE_NUMBER = 1337,
      A_STRING          = 'foo';

let KNOWN_TEST_PROSPECT_TENANT_UUID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a prospectTenant when given a valid ' + field, done => {
    updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
      [field] : value
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getProspectTenantByUuid(KNOWN_TEST_PROSPECT_TENANT_UUID)
          .then((prospectTenant) => {
            expect(R.prop(field, prospectTenant)).toBe(value);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });
};

describe('updateProspectTenant', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_TENANT_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('fails gracefully when given an unknown prospectTenant id to update', done => {
    updateProspectTenant(FAKE_UNKNOWN_UUID, {
      firstName : FAKE_UPDATE_FIRST_NAME
    })
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when given no data', done => {
    updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, null)
      .then(data => {
        expect(data).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating a prospectTenant with null id', () => {
    expect(() => {
      updateProspectTenant(null, {
        firstName : FAKE_UPDATE_FIRST_NAME
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
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
      updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
        firstName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('firstName', FAKE_UPDATE_FIRST_NAME);

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
        lastName : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('lastName', FAKE_UPDATE_LAST_NAME);

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
        email : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('email', FAKE_UPDATE_EMAIL);

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
        phone : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('phone', FAKE_UPDATE_PHONE);

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
        zip : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('zip', FAKE_UPDATE_ZIP);

  it('throws an error when given a tenantTitle of type other than String', () => {
    expect(() => {
      updateProspectTenant(KNOWN_TEST_PROSPECT_TENANT_UUID, {
        tenantTitle : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('tenantTitle', FAKE_UPDATE_TENANT_TITLE);
});
