'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantMember  = require('../../../../server/core/models/tenantMember/methods/updateTenantMember'),
      getTenantMemberById = require('../../../../server/core/models/tenantMember/methods/getTenantMemberById'),
      commonMocks         = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER    = 1337,
      A_NEGATIVE_NUMBER    = -10,
      STRING_ONE_CHAR      = 'a',
      STRING_SEVENTY_CHARS = '*'.repeat(70);

const FAKE_UNKNOWN_ID           = 9999,
      FAKE_UPDATE_REFERENCE_ID  = 'xxx',
      FAKE_UPDATE_CLOUD_USER_ID = 1,
      FAKE_UPDATE_TENANT_ID     = 2,
      FAKE_UPDATE_STATUS        = 2;

let KNOWN_TEST_ID,
    KNOWN_TEST_TENANT_ID,
    KNOWN_TEST_REFERENCE_ID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantMember when given a valid ' + field, done => {
    updateTenantMember(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantMemberById(KNOWN_TEST_ID)
        .then((tenantMember) => {
          expect(R.prop(field, tenantMember)).toBe(value);
          done();
        });
    });
  });
};

describe('updateTenantMember', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_ID           = knownProp('id');
      KNOWN_TEST_TENANT_ID    = knownProp('tenant_id');
      KNOWN_TEST_REFERENCE_ID = knownProp('reference_id');

      done();
    });
  });

  // ID AS PARAM
  it('fails gracefully when given an unknown tenantMember id to update', done => {
    updateTenantMember(FAKE_UNKNOWN_ID, {
      referenceId : FAKE_UPDATE_REFERENCE_ID
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('throws an error when updating a tenantMember with null id', () => {
    expect(() => {
      updateTenantMember(null, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantMember(STRING_ONE_CHAR, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // REFERENCE_ID IN BODY
  it('throws an error when given a referenceId of type other than String', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        referenceId : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a referenceId that is too long', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        referenceId : STRING_SEVENTY_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('referenceId', FAKE_UPDATE_REFERENCE_ID);

  it('does not update anything when no req body is provided', done => {
    updateTenantMember(KNOWN_TEST_ID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantMemberById(KNOWN_TEST_ID)
          .then(tenantMember => {
            expect(tenantMember.tenantId).toBe(KNOWN_TEST_TENANT_ID);
            expect(tenantMember.referenceId).toBe(KNOWN_TEST_REFERENCE_ID);
            done();
          });
      });
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantMember(KNOWN_TEST_ID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      });
  });

  // CLOUD_USER_ID IN BODY
  it('throws an error when given an unknown cloudUserId value', done => {
    updateTenantMember(KNOWN_TEST_ID, {
      cloudUserId : FAKE_UNKNOWN_ID
    }).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  it('throws an error when given a malformed cloudUserId', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        cloudUserId : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative cloudUserId', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        cloudUserId : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('cloudUserId', FAKE_UPDATE_CLOUD_USER_ID);

  // TENANT_ID IN BODY
  it('throws an error when given an unknown tenantId value', done => {
    updateTenantMember(KNOWN_TEST_ID, {
      tenantId : FAKE_UNKNOWN_ID
    }).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  it('throws an error when given a malformed tenantId', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        tenantId : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative tenantId', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        tenantId : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('tenantId', FAKE_UPDATE_TENANT_ID);

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
