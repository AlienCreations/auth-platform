'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessRole  = require('../../../../server/core/models/tenantAccessRole/methods/updateTenantAccessRole'),
      getTenantAccessRoleById = require('../../../../server/core/models/tenantAccessRole/methods/getTenantAccessRoleById'),
      commonMocks             = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER          = 1337,
      A_NEGATIVE_NUMBER          = -10,
      STRING_ONE_CHAR            = 'a',
      STRING_THREE_HUNDRED_CHARS = '*'.repeat(300);

const FAKE_UNKNOWN_ID                    = 9999,
      FAKE_UPDATE_TITLE                  = 'xxx',
      FAKE_UPDATE_TENANT_ID              = 2,
      FAKE_UPDATE_TENANT_ORGANIZATION_ID = 1,
      FAKE_UPDATE_STATUS                 = 2;

let KNOWN_TEST_ID,
    KNOWN_TEST_TENANT_ID,
    KNOWN_TEST_TITLE;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantAccessRole when given a valid ' + field, done => {
    updateTenantAccessRole(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantAccessRoleById(KNOWN_TEST_ID)
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
      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_ID        = knownProp('id');
      KNOWN_TEST_TENANT_ID = knownProp('tenant_id');
      KNOWN_TEST_TITLE     = knownProp('title');

      done();
    });
  });

  // ID AS PARAM
  it('fails gracefully when given an unknown tenantAccessRole id to update', done => {
    updateTenantAccessRole(FAKE_UNKNOWN_ID, {
      title : FAKE_UPDATE_TITLE
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('throws an error when updating a tenantAccessRole with null id', () => {
    expect(() => {
      updateTenantAccessRole(null, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantAccessRole(STRING_ONE_CHAR, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TITLE IN BODY
  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a title that is too long', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        title : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  it('does not update anything when no req body is provided', done => {
    updateTenantAccessRole(KNOWN_TEST_ID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantAccessRoleById(KNOWN_TEST_ID)
          .then(tenantAccessRole => {
            expect(tenantAccessRole.tenantId).toBe(KNOWN_TEST_TENANT_ID);
            expect(tenantAccessRole.title).toBe(KNOWN_TEST_TITLE);
            done();
          });
      });
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantAccessRole(KNOWN_TEST_ID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      });
  });

  // TENANT_ID IN BODY
  it('throws an error when given an unknown tenantId value', done => {
    updateTenantAccessRole(KNOWN_TEST_ID, {
      tenantId : FAKE_UNKNOWN_ID
    }).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  it('throws an error when given a malformed tenantId', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        tenantId : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative tenantId', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        tenantId : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('tenantId', FAKE_UPDATE_TENANT_ID);

  // TENANT_ORGANIZATION_ID IN BODY
  it('throws an error when given an unknown tenantOrganizationId value', done => {
    updateTenantAccessRole(KNOWN_TEST_ID, {
      tenantOrganizationId : FAKE_UNKNOWN_ID
    }).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  it('throws an error when given a malformed tenantOrganizationId', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        tenantOrganizationId : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative tenantOrganizationId', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        tenantOrganizationId : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('tenantOrganizationId', FAKE_UPDATE_TENANT_ORGANIZATION_ID);

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantAccessRole(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
