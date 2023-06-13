'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessResource = require('../../../../server/core/models/tenantAccessResource/methods/deleteTenantAccessResource'),
      commonMocks                = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'asd';

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID;

describe('deleteTenantAccessResource', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('deletes a tenantAccessResource record when given a known tenantAccessResource uuid', done => {
    deleteTenantAccessResource(KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown tenantAccessResource uuid', done => {
    deleteTenantAccessResource(FAKE_UNKNOWN_UUID).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // ID
  it('throws an error when id is missing', () => {
    expect(() => {
      deleteTenantAccessResource();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      deleteTenantAccessResource(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
