'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectTenantByUuid = require('../../../../server/core/models/prospectTenant/methods/getProspectTenantByUuid'),
      commonMocks           = require('../../../_helpers/commonMocks');

let KNOWN_TEST_PROSPECT_TENANT_UUID;

describe('getProspectTenantByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_TENANT_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets an account when given a valid uuid', done => {
    getProspectTenantByUuid(KNOWN_TEST_PROSPECT_TENANT_UUID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(R.prop('id', data)).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getProspectTenantByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given malformed uuid', () => {
    expect(() => {
      getProspectTenantByUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null uuid', () => {
    expect(() => {
      getProspectTenantByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
