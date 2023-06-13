'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantMember    = require('../../../../server/core/models/tenantMember/methods/updateTenantMember'),
      getTenantMemberByUuid = require('../../../../server/core/models/tenantMember/methods/getTenantMemberByUuid'),
      commonMocks           = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER    = 1337,
      A_NEGATIVE_NUMBER    = -10,
      STRING_ONE_CHAR      = 'a',
      STRING_SEVENTY_CHARS = '*'.repeat(70);

const FAKE_UNKNOWN_UUID        = commonMocks.COMMON_UUID,
      FAKE_UPDATE_REFERENCE_ID = 'xxx',
      FAKE_UPDATE_STATUS       = 2;

let KNOWN_TEST_TENANT_MEMBER_UUID,
    KNOWN_TEST_TENANT_UUID,
    KNOWN_TEST_REFERENCE_ID,
    KNOWN_TEST_UPDATE_CLOUD_USER_UUID,
    KNOWN_TEST_UPDATE_TENANT_UUID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantMember when given a valid ' + field, done => {
    updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
      [field] : value
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getTenantMemberByUuid(KNOWN_TEST_TENANT_MEMBER_UUID)
          .then((tenantMember) => {
            expect(R.prop(field, tenantMember)).toBe(value);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });
};

describe('updateTenantMember', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      const knownProp = prop => from => R.compose(R.prop(prop), R[from], commonMocks.transformDbColsToJsProps)(data);

      KNOWN_TEST_TENANT_MEMBER_UUID = knownProp('uuid')('head');
      KNOWN_TEST_TENANT_UUID        = knownProp('tenantUuid')('head');
      KNOWN_TEST_REFERENCE_ID       = knownProp('referenceId')('head');

      KNOWN_TEST_UPDATE_CLOUD_USER_UUID = knownProp('cloudUserUuid')('last');
      KNOWN_TEST_UPDATE_TENANT_UUID     = knownProp('tenantUuid')('last');

      done();
    });
  });

  // UUID AS PARAM
  it('fails gracefully when given an unknown tenantMember uuid to update', done => {
    updateTenantMember(FAKE_UNKNOWN_UUID, {
      referenceId : FAKE_UPDATE_REFERENCE_ID
    })
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating a tenantMember with null uuid', () => {
    expect(() => {
      updateTenantMember(null, {
        id : FAKE_UNKNOWN_UUID
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when updating by a malformed uuid', () => {
    expect(() => {
      updateTenantMember(STRING_ONE_CHAR, {
        id : FAKE_UNKNOWN_UUID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // REFERENCE_ID IN BODY
  it('throws an error when given a referenceId of type other than String', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
        referenceId : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a referenceId that is too long', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
        referenceId : STRING_SEVENTY_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('referenceId', FAKE_UPDATE_REFERENCE_ID);

  it('does not update anything when no req body is provided', done => {
    updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantMemberByUuid(KNOWN_TEST_TENANT_MEMBER_UUID)
          .then(tenantMember => {
            expect(tenantMember.tenantUuid).toBe(KNOWN_TEST_TENANT_UUID);
            expect(tenantMember.referenceId).toBe(KNOWN_TEST_REFERENCE_ID);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  // CLOUD_USER_UUID IN BODY
  it('throws an error when given an unknown cloudUserUuid value', done => {
    updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
      cloudUserUuid : FAKE_UNKNOWN_UUID
    })
      .then(done.fail)
      .catch(({ code }) => {
        expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
        done();
      });
  });

  it('throws an error when given a malformed cloudUserUuid', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
        cloudUserUuid : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('waits for beforeAll and ', () => {
    assertUpdatesIfValid('cloudUserUuid', KNOWN_TEST_UPDATE_CLOUD_USER_UUID);
  });

  // TENANT_UUID IN BODY
  it('throws an error when given an unknown tenantUuid value', done => {
    updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
      tenantUuid : FAKE_UNKNOWN_UUID
    })
      .then(done.fail)
      .catch(({ code }) => {
        expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
        done();
      });
  });

  it('throws an error when given a malformed tenantUuid', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
        tenantUuid : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('waits for beforeAll and ', () => {
    assertUpdatesIfValid('tenantUuid', KNOWN_TEST_UPDATE_TENANT_UUID);
  });

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
