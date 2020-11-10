'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessRoleAssignment  = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/updateTenantAccessRoleAssignment'),
      getTenantAccessRoleAssignmentById = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentById'),
      commonMocks                       = require('../../../_helpers/commonMocks');

const A_NEGATIVE_NUMBER = -10,
      STRING_ONE_CHAR   = 'a';

const FAKE_UNKNOWN_ID    = 9999,
      FAKE_UPDATE_STATUS = 2;

let KNOWN_TEST_ID,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ID,
    KNOWN_TEST_CLOUD_USER_ID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantAccessRoleAssignment when given a valid ' + field, done => {
    updateTenantAccessRoleAssignment(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantAccessRoleAssignmentById(KNOWN_TEST_ID)
        .then((tenantAccessRoleAssignment) => {
          expect(R.prop(field, tenantAccessRoleAssignment)).toBe(value);
          done();
        });
    });
  });
};

describe('updateTenantAccessRoleAssignment', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_ID                    = knownProp('id');
      KNOWN_TEST_TENANT_ACCESS_ROLE_ID = knownProp('tenant_access_role_id');
      KNOWN_TEST_CLOUD_USER_ID         = knownProp('cloud_user_id');

      done();
    });
  });

  // ID AS PARAM
  it('fails gracefully when given an unknown tenantAccessRoleAssignment id to update', done => {
    updateTenantAccessRoleAssignment(FAKE_UNKNOWN_ID, {
      status : FAKE_UPDATE_STATUS
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('throws an error when updating a tenantAccessRoleAssignment with null id', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(null, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(STRING_ONE_CHAR, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('does not update anything when no req body is provided', done => {
    updateTenantAccessRoleAssignment(KNOWN_TEST_ID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantAccessRoleAssignmentById(KNOWN_TEST_ID)
          .then(tenantAccessRoleAssignment => {
            expect(tenantAccessRoleAssignment.tenantAccessRoleId).toBe(KNOWN_TEST_TENANT_ACCESS_ROLE_ID);
            expect(tenantAccessRoleAssignment.cloudUserId).toBe(KNOWN_TEST_CLOUD_USER_ID);
            done();
          });
      });
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantAccessRoleAssignment(KNOWN_TEST_ID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      });
  });

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(KNOWN_TEST_ID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantAccessRoleAssignment(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
