'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMembersByTenantUuid = require('../../../../server/core/controllers/api/tenantMember/getTenantMembersByTenantUuid');

const FAKE_UNKNOWN_TENANT_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_UUID = 'foo';

let KNOWN_TEST_TENANT_MEMBER_DATA,
    KNOWN_TEST_TENANT_UUID;

describe('tenantMemberCtrl.getTenantMembersByTenantUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_TENANT_MEMBER_DATA = R.compose(commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_UUID        = KNOWN_TEST_TENANT_MEMBER_DATA[0].tenantUuid;
      done();
    });
  });

  it('returns memberData when looking for members by tenantUuid', done => {
    getTenantMembersByTenantUuid(KNOWN_TEST_TENANT_UUID)
      .then(res => {
        const refIds = R.pluck('id');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_TENANT_MEMBER_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for members from a tenant that does not exist', done => {
    getTenantMembersByTenantUuid(FAKE_UNKNOWN_TENANT_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantUuid', done => {
    getTenantMembersByTenantUuid(FAKE_MALFORMED_TENANT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an member without a tenantUuid', done => {
    getTenantMembersByTenantUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantMembersByTenantUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
