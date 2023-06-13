'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessPermissionsByTenantOrganizationUuid = require('../../../../server/core/models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantOrganizationUuid'),
      commonMocks                                        = require('../../../_helpers/commonMocks');

let KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID;

describe('getTenantAccessPermissionsByTenantOrganizationUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID = R.compose(
        R.prop('uuid'),
        R.head
      )(data);
      done();
    });
  });

  it('gets a list of tenantAccessPermissions when given a valid tenantOrganizationUuid', done => {
    getTenantAccessPermissionsByTenantOrganizationUuid(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(data.length > 0).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantOrganizationUuid', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationUuid', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
