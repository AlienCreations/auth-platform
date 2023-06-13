'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMemberByTenantUuidAndReferenceId = require('../../../../server/core/models/tenantMember/methods/getTenantMemberByTenantUuidAndReferenceId'),
      commonMocks                               = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID         = commonMocks.COMMON_UUID,
      FAKE_UNKNOWN_REFERENCE_ID = 'xxx',
      FAKE_MALFORMED_UUID       = 'xxx';

let KNOWN_TEST_TENANT_UUID,
    KNOWN_TEST_REFERENCE_ID;

describe('getTenantMemberByTenantUuidAndReferenceId', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_TENANT_UUID  = R.compose(R.prop('tenant_uuid'), R.head)(data);
      KNOWN_TEST_REFERENCE_ID = R.compose(R.prop('reference_id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantMember when given known values', done => {
    getTenantMemberByTenantUuidAndReferenceId(KNOWN_TEST_TENANT_UUID, KNOWN_TEST_REFERENCE_ID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unknown tenantUuid', done => {
    getTenantMemberByTenantUuidAndReferenceId(FAKE_UNKNOWN_UUID, KNOWN_TEST_REFERENCE_ID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given an unknown referenceId', done => {
    getTenantMemberByTenantUuidAndReferenceId(KNOWN_TEST_TENANT_UUID, FAKE_UNKNOWN_REFERENCE_ID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed tenantUuid', () => {
    expect(() => {
      getTenantMemberByTenantUuidAndReferenceId(FAKE_MALFORMED_UUID, KNOWN_TEST_REFERENCE_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });


  it('throws an error when tenantUuid is set to null', () => {
    expect(() => {
      getTenantMemberByTenantUuidAndReferenceId(null, KNOWN_TEST_REFERENCE_ID);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when referenceId is set to null', () => {
    expect(() => {
      getTenantMemberByTenantUuidAndReferenceId(KNOWN_TEST_TENANT_UUID, null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
