'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantAccessRoleId = require('../../../../server/core/models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantAccessRoleId'),
      commonMocks                                        = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ACCESS_ROLE_ID;

describe('getTenantAccessPermissionsByTenantAccessRoleId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_ID = R.compose(R.prop('tenantAccessRoleId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessPermissions when given a tenantAccessRoleId of type Number', done => {
    getTenantAccessPermissionsByTenantAccessRoleId(KNOWN_TEST_TENANT_ACCESS_ROLE_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(
        R.compose(
          R.all(R.equals(KNOWN_TEST_TENANT_ACCESS_ROLE_ID)),
          R.pluck('tenantAccessRoleId')
        )(data)
      ).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantAccessRoleId of type String', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessRoleId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessRoleId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantAccessRoleId', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessRoleId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessRoleId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantAccessRoleId', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessRoleId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
