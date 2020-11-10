'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentById = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentById'),
      commonMocks                       = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'xxx';

let KNOWN_TEST_ID;

describe('getTenantAccessRoleAssignmentById', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantAccessRoleAssignment when given a known id', done => {
    getTenantAccessRoleAssignmentById(KNOWN_TEST_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown id', done => {
    getTenantAccessRoleAssignmentById(FAKE_UNKNOWN_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      getTenantAccessRoleAssignmentById(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when id is missing', () => {
    expect(() => {
      getTenantAccessRoleAssignmentById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when id is set to null', () => {
    expect(() => {
      getTenantAccessRoleAssignmentById(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
