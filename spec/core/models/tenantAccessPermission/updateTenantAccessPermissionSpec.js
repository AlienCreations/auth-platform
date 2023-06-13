'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessPermission  = require('../../../../server/core/models/tenantAccessPermission/methods/updateTenantAccessPermission'),
      getTenantAccessPermissionByUuid = require('../../../../server/core/models/tenantAccessPermission/methods/getTenantAccessPermissionByUuid'),
      commonMocks                   = require('../../../_helpers/commonMocks');

const A_NEGATIVE_NUMBER = -10,
      STRING_ONE_CHAR   = 'a';

const FAKE_UNKNOWN_UUID  = commonMocks.COMMON_UUID,
      FAKE_UPDATE_STATUS = 2;

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID,
    KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    KNOWN_TEST_CLOUD_USER_UUID;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantAccessPermission when given a valid ' + field, done => {
    updateTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID, {
      [field] : value
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getTenantAccessPermissionByUuid(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID)
          .then((tenantAccessPermission) => {
            expect(R.prop(field, tenantAccessPermission)).toBe(value);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });
};

describe('updateTenantAccessPermission', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID = knownProp('uuid');
      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID       = knownProp('tenant_access_role_uuid');
      KNOWN_TEST_CLOUD_USER_UUID               = knownProp('cloud_user_uuid');

      done();
    });
  });

  // ID AS PARAM
  it('fails gracefully when given an unknown tenantAccessPermission id to update', done => {
    updateTenantAccessPermission(FAKE_UNKNOWN_UUID, {
      status : FAKE_UPDATE_STATUS
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('throws an error when updating a tenantAccessPermission with null id', () => {
    expect(() => {
      updateTenantAccessPermission(null, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantAccessPermission(STRING_ONE_CHAR, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('does not update anything when no req body is provided', done => {
    updateTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantAccessPermissionByUuid(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID)
          .then((tenantAccessPermission) => {
            expect(tenantAccessPermission.tenantAccessRoleUuid).toBe(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID);
            expect(tenantAccessPermission.cloudUserUuid).toBe(KNOWN_TEST_CLOUD_USER_UUID);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
