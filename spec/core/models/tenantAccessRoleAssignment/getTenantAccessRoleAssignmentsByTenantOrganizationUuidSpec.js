'use strict';

const R                          = require('ramda'),
      path                       = require('path'),
      CSVConverter               = require('csvtojson').Converter,
      tenantAccessRolesConverter = new CSVConverter({});

const getTenantAccessRoleAssignmentsByTenantOrganizationUuid = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantOrganizationUuid'),
      commonMocks                                            = require('../../../_helpers/commonMocks');

let KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID;

describe('getTenantAccessRoleAssignmentsByTenantOrganizationUuid', () => {
  beforeAll(done => {
    tenantAccessRolesConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID = R.compose(
        R.prop('tenantOrganizationUuid'),
        R.head,
        R.filter(R.prop('tenantOrganizationUuid')),
        commonMocks.transformDbColsToJsProps,
        commonMocks.ensureTrueNullInCsvData
      )(data);

      done();
    });
  });

  it('gets a list of tenantAccessRoleAssignments when given a valid tenantOrganizationUuid', done => {
    getTenantAccessRoleAssignmentsByTenantOrganizationUuid(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(data.length > 0).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantOrganizationUuid', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationUuid', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
