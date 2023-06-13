'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessPermission = require('../../../../server/core/models/tenantAccessPermission/methods/deleteTenantAccessPermission'),
      commonMocks                  = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'asd';

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID;

describe('deleteTenantAccessPermission', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('deletes an tenantAccessPermission record when given a known tenantAccessPermission uuid', done => {
    deleteTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an unknown tenantAccessPermission uuid', done => {
    deleteTenantAccessPermission(FAKE_UNKNOWN_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  // ID
  it('throws an error when id is missing', () => {
    expect(() => {
      deleteTenantAccessPermission();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      deleteTenantAccessPermission(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
