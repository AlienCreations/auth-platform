'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleById = require('../../../../server/core/models/tenantAccessRole/methods/getTenantAccessRoleById'),
      commonMocks             = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'xxx';

let KNOWN_TEST_ID;

describe('getTenantAccessRoleById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantAccessRole when given a known id', done => {
    getTenantAccessRoleById(KNOWN_TEST_ID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unknown id', done => {
    getTenantAccessRoleById(FAKE_UNKNOWN_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      getTenantAccessRoleById(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when id is missing', () => {
    expect(() => {
      getTenantAccessRoleById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when id is set to null', () => {
    expect(() => {
      getTenantAccessRoleById(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
