'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessRoleAssignment    = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/updateTenantAccessRoleAssignment'),
      getTenantAccessRoleAssignmentByUuid = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentByUuid'),
      commonMocks                         = require('../../../_helpers/commonMocks');

const A_NEGATIVE_NUMBER = -10,
      STRING_ONE_CHAR   = 'a';

const FAKE_UNKNOWN_UUID  = commonMocks.COMMON_UUID,
      FAKE_UPDATE_STATUS = 2;

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID,
    KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    KNOWN_TEST_CLOUD_USER_UUID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantAccessRoleAssignment when given a valid ' + field, done => {
    updateTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID, {
      [field] : value
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getTenantAccessRoleAssignmentByUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
          .then((tenantAccessRoleAssignment) => {
            expect(R.prop(field, tenantAccessRoleAssignment)).toBe(value);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });
};

describe('updateTenantAccessRoleAssignment', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID = knownProp('uuid');
      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID            = knownProp('tenant_access_role_uuid');
      KNOWN_TEST_CLOUD_USER_UUID                    = knownProp('cloud_user_uuid');

      done();
    });
  });

  // UUID AS PARAM
  it('fails gracefully when given an unknown tenantAccessRoleAssignment uuid to update', done => {
    updateTenantAccessRoleAssignment(FAKE_UNKNOWN_UUID, {
      status : FAKE_UPDATE_STATUS
    })
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating a tenantAccessRoleAssignment with null uuid', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(null, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when updating by a malformed uuid', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(STRING_ONE_CHAR, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('does not update anything when no req body is provided', done => {
    updateTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantAccessRoleAssignmentByUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
          .then(tenantAccessRoleAssignment => {
            expect(tenantAccessRoleAssignment.tenantAccessRoleUuid).toBe(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID);
            expect(tenantAccessRoleAssignment.cloudUserUuid).toBe(KNOWN_TEST_CLOUD_USER_UUID);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      });
  });

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
