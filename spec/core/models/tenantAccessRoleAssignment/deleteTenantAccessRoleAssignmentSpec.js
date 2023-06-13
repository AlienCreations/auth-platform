'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessRoleAssignment = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/deleteTenantAccessRoleAssignment'),
      commonMocks                      = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'asd';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID;

describe('deleteTenantAccessRoleAssignment', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('deletes an tenantAccessRoleAssignment record when given a known tenantAccessRoleAssignment uuid', done => {
    deleteTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an unknown tenantAccessRoleAssignment uuid', done => {
    deleteTenantAccessRoleAssignment(FAKE_UNKNOWN_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  // ID
  it('throws an error when uuid is missing', () => {
    expect(() => {
      deleteTenantAccessRoleAssignment();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      deleteTenantAccessRoleAssignment(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
