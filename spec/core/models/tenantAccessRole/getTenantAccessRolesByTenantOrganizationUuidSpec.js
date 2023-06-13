'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantOrganizationUuid = require('../../../../server/core/models/tenantAccessRole/methods/getTenantAccessRolesByTenantOrganizationUuid'),
      commonMocks                                  = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('getTenantAccessRolesByTenantOrganizationUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(R.prop('tenantOrganizationUuid'), R.last, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoles when given a valid tenantOrganizationUuid', done => {
    getTenantAccessRolesByTenantOrganizationUuid(KNOWN_TEST_TENANT_ORGANIZATION_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(
          R.compose(
            R.all(R.equals(KNOWN_TEST_TENANT_ORGANIZATION_UUID)),
            R.pluck('tenantOrganizationUuid')
          )(data)
        ).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantOrganizationUuid', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationUuid', () => {
    expect(() => {
      getTenantAccessRolesByTenantOrganizationUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
