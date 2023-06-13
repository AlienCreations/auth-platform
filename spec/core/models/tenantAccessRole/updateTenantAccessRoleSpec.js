'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessRole    = require('../../../../server/core/models/tenantAccessRole/methods/updateTenantAccessRole'),
      getTenantAccessRoleByUuid = require('../../../../server/core/models/tenantAccessRole/methods/getTenantAccessRoleByUuid'),
      commonMocks               = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER          = 1337,
      A_NEGATIVE_NUMBER          = -10,
      STRING_ONE_CHAR            = 'a',
      STRING_THREE_HUNDRED_CHARS = '*'.repeat(300);

const FAKE_UNKNOWN_UUID  = commonMocks.COMMON_UUID,
      FAKE_UPDATE_TITLE  = 'xxx',
      FAKE_UPDATE_STATUS = 2;

let KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    KNOWN_TEST_TENANT_UUID,
    KNOWN_TEST_TITLE,
    KNOWN_TEST_UPDATE_TENANT_UUID,
    KNOWN_TEST_UPDATE_TENANT_ORGANIZATION_UUID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantAccessRole when given a valid ' + field, done => {
    updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
      [field] : value
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getTenantAccessRoleByUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID)
          .then((tenantAccessRole) => {
            expect(R.prop(field, tenantAccessRole)).toBe(value);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });
};

describe('updateTenantAccessRole', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      const knownProp = prop => from => R.compose(R.prop(prop), R[from], commonMocks.transformDbColsToJsProps)(data);

      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID = knownProp('uuid')('head');
      KNOWN_TEST_TENANT_UUID             = knownProp('tenantUuid')('head');
      KNOWN_TEST_TITLE                   = knownProp('title')('head');

      KNOWN_TEST_UPDATE_TENANT_UUID              = knownProp('tenantUuid')('last');
      KNOWN_TEST_UPDATE_TENANT_ORGANIZATION_UUID = knownProp('tenantOrganizationUuid')('last');
      done();
    });
  });

  // UUID AS PARAM
  it('fails gracefully when given an unknown tenantAccessRole id to update', done => {
    updateTenantAccessRole(FAKE_UNKNOWN_UUID, {
      title : FAKE_UPDATE_TITLE
    })
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating a tenantAccessRole with null id', () => {
    expect(() => {
      updateTenantAccessRole(null, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantAccessRole(STRING_ONE_CHAR, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TITLE IN BODY
  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a title that is too long', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
        title : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  it('does not update anything when no req body is provided', done => {
    updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantAccessRoleByUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID)
          .then(tenantAccessRole => {
            expect(tenantAccessRole.tenantUuid).toBe(KNOWN_TEST_TENANT_UUID);
            expect(tenantAccessRole.title).toBe(KNOWN_TEST_TITLE);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  // TENANT_UUID IN BODY
  it('throws an error when given an unknown tenantUuid value', done => {
    updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
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
      updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
        tenantUuid : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('waits for beforeAll and ', () => {
    assertUpdatesIfValid('tenantUuid', KNOWN_TEST_UPDATE_TENANT_UUID);
  });

  // TENANT_ORGANIZATION_UUID IN BODY
  it('throws an error when given an unknown tenantOrganizationUuid value', done => {
    updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
      tenantOrganizationUuid : FAKE_UNKNOWN_UUID
    })
      .then(done.fail)
      .catch(({ code }) => {
        expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
        done();
      });
  });

  it('throws an error when given a malformed tenantOrganizationUuid', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
        tenantOrganizationUuid : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('waits for beforeAll and ', () => {
    assertUpdatesIfValid('tenantOrganizationUuid', KNOWN_TEST_UPDATE_TENANT_ORGANIZATION_UUID);
  });

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
