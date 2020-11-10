'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMemberByTenantIdAndReferenceId = require('../../../../server/core/controllers/api/tenantMember/getTenantMemberByTenantIdAndReferenceId');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNMAPPED_TENANT_ID   = 9999,
      FAKE_UNKNOWN_REFERENCE_ID = 'xxx';

let KNOWN_TEST_TENANT_MEMBER_DATA,
    KNOWN_TEST_MAPPED_TENANT_ID,
    KNOWN_TEST_REFERENCE_ID;

describe('tenantMemberCtrl.getTenantMemberByTenantIdAndReferenceId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_TENANT_MEMBER_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_REFERENCE_ID       = R.prop('referenceId', KNOWN_TEST_TENANT_MEMBER_DATA);
      KNOWN_TEST_MAPPED_TENANT_ID   = R.prop('tenantId',    KNOWN_TEST_TENANT_MEMBER_DATA);
      done();
    });
  });

  it('returns tenantMemberData when looking for an tenantMember by tenantId and referenceId', done => {
    getTenantMemberByTenantIdAndReferenceId(KNOWN_TEST_MAPPED_TENANT_ID, KNOWN_TEST_REFERENCE_ID)
      .then(res => {
        expect(res.referenceId)
          .toEqual(KNOWN_TEST_TENANT_MEMBER_DATA.referenceId);
        done();
      });
  });

  it('throws an error when looking for an tenantMember with a referenceId that does not exist', done => {
    getTenantMemberByTenantIdAndReferenceId(KNOWN_TEST_MAPPED_TENANT_ID, FAKE_UNKNOWN_REFERENCE_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantMember with a known referenceId but an unknown/unmapped tenant', done => {
    getTenantMemberByTenantIdAndReferenceId(FAKE_UNMAPPED_TENANT_ID, KNOWN_TEST_REFERENCE_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

});
