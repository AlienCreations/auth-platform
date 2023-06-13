'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantAccessResourceUuid = require('../../../../server/core/models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantAccessResourceUuid'),
      commonMocks                                          = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID;

describe('getTenantAccessPermissionsByTenantAccessResourceUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID = R.compose(R.prop('tenantAccessResourceUuid'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessPermissions when given a valid tenantAccessResourceUuid', done => {
    getTenantAccessPermissionsByTenantAccessResourceUuid(KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(
          R.compose(
            R.all(R.equals(KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)),
            R.pluck('tenantAccessResourceUuid')
          )(data)
        ).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantAccessResourceUuid', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null tenantAccessResourceUuid', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
