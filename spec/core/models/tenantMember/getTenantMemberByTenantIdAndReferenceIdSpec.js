'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMemberByTenantIdAndReferenceId = require('../../../../server/core/models/tenantMember/methods/getTenantMemberByTenantIdAndReferenceId'),
      commonMocks                             = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID           = 99999,
      FAKE_UNKNOWN_REFERENCE_ID = 'xxx',
      FAKE_MALFORMED_ID         = 'xxx';

let KNOWN_TEST_TENANT_ID,
    KNOWN_TEST_REFERENCE_ID;

describe('getTenantMemberByTenantIdAndReferenceId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ID    = R.compose(R.prop('tenant_id'),    R.head)(data);
      KNOWN_TEST_REFERENCE_ID = R.compose(R.prop('reference_id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantMember when given known ids', done => {
    getTenantMemberByTenantIdAndReferenceId(KNOWN_TEST_TENANT_ID, KNOWN_TEST_REFERENCE_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown tenantId', done => {
    getTenantMemberByTenantIdAndReferenceId(FAKE_UNKNOWN_ID, KNOWN_TEST_REFERENCE_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given an unknown referenceId', done => {
    getTenantMemberByTenantIdAndReferenceId(KNOWN_TEST_TENANT_ID, FAKE_UNKNOWN_REFERENCE_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed tenantId', () => {
    expect(() => {
      getTenantMemberByTenantIdAndReferenceId(FAKE_MALFORMED_ID, KNOWN_TEST_REFERENCE_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });


  it('throws an error when tenantId is set to null', () => {
    expect(() => {
      getTenantMemberByTenantIdAndReferenceId(null, KNOWN_TEST_REFERENCE_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when referenceId is set to null', () => {
    expect(() => {
      getTenantMemberByTenantIdAndReferenceId(KNOWN_TEST_TENANT_ID, null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
