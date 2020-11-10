'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantAccessResourceId = require('../../../../server/core/models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantAccessResourceId'),
      commonMocks                                        = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID;

describe('getTenantAccessPermissionsByTenantAccessResourceId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID = R.compose(R.prop('tenantAccessResourceId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessPermissions when given a tenantAccessResourceId of type Number', done => {
    getTenantAccessPermissionsByTenantAccessResourceId(KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(
        R.compose(
          R.all(R.equals(KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)),
          R.pluck('tenantAccessResourceId')
        )(data)
      ).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantAccessResourceId of type String', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantAccessResourceId', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantAccessResourceId', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantAccessResourceId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
