'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMembersByTenantId = require('../../../../server/core/controllers/api/tenantMember/getTenantMembersByTenantId');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ID   = 999,
      FAKE_MALFORMED_TENANT_ID = 'foo';

let KNOWN_TEST_MEMBER_DATA,
    KNOWN_TEST_TENANT_ID;

describe('tenantMemberCtrl.getTenantMembersByTenantId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ID   = R.compose(R.prop('tenantId'), R.head)(data);
      KNOWN_TEST_MEMBER_DATA = R.filter(R.propEq('tenantId', KNOWN_TEST_TENANT_ID), data);

      done();
    });
  });

  it('returns memberData when looking for members by tenantId', done => {
    getTenantMembersByTenantId(KNOWN_TEST_TENANT_ID)
      .then(res => {
        const refIds = R.pluck('referenceId');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_MEMBER_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for members from a tenant that does not exist', done => {
    getTenantMembersByTenantId(FAKE_UNKNOWN_TENANT_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantId', done => {
    getTenantMembersByTenantId(FAKE_MALFORMED_TENANT_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an member without a tenantId', done => {
    getTenantMembersByTenantId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantMembersByTenantId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
