'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationByUuid = require('../../../../server/core/models/tenantOrganization/methods/getTenantOrganizationByUuid'),
      commonMocks                 = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('getTenantOrganizationByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a tenantOrganization when given a valid uuid', done => {
    getTenantOrganizationByUuid(KNOWN_TEST_TENANT_ORGANIZATION_UUID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(data.uuid).toBe(KNOWN_TEST_TENANT_ORGANIZATION_UUID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getTenantOrganizationByUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantOrganizationByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null uuid', () => {
    expect(() => {
      getTenantOrganizationByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
