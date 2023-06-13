'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionForTenantOrganizationByType = require('../../../../server/core/models/tenantConnection/methods/getTenantConnectionsForTenantOrganizationByType'),
      commonMocks                                    = require('../../../_helpers/commonMocks');

const KNOWN_TEST_CONNECTION_TYPE = 1;

let KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('getTenantConnectionForTenantOrganizationByType', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(R.prop('tenantOrganizationUuid'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a tenantConnections when given a valid tenantOrganizationUuid', done => {
    getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_UUID, KNOWN_TEST_CONNECTION_TYPE)
      .then(data => {
        expect(R.is(Object, data[0])).toBe(true);
        expect(data[0].tenantOrganizationUuid).toBe(KNOWN_TEST_TENANT_ORGANIZATION_UUID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a tenantOrganizationUuid of type String', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType('1', KNOWN_TEST_CONNECTION_TYPE);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a connection type of type String', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_UUID, '1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative connectionType', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_UUID, -22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed tenantOrganizationUuid', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType('foo', KNOWN_TEST_CONNECTION_TYPE);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string for connectionType', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_UUID, 'bar');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationUuid', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(null, KNOWN_TEST_CONNECTION_TYPE);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null connectionType', () => {
    expect(() => {
      getTenantConnectionForTenantOrganizationByType(KNOWN_TEST_TENANT_ORGANIZATION_UUID, null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
