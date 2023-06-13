'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMemberById = require('../../../../server/core/controllers/api/tenantMember/getTenantMemberById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_MEMBER_ID   = 9999,
      FAKE_MALFORMED_TENANT_MEMBER_ID = 'foo';

let KNOWN_TEST_TENANT_MEMBER_DATA,
    KNOWN_TEST_TENANT_MEMBER_ID;

describe('tenantMemberCtrl.getTenantMemberById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_TENANT_MEMBER_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_MEMBER_ID   = KNOWN_TEST_TENANT_MEMBER_DATA.id;
      done();
    });
  });

  it('returns tenantMemberData when looking for an tenantMember by id', done => {
    getTenantMemberById(KNOWN_TEST_TENANT_MEMBER_ID)
      .then(res => {
        expect(res.referenceId)
          .toEqual(KNOWN_TEST_TENANT_MEMBER_DATA.referenceId);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an tenantMember that does not exist', done => {
    getTenantMemberById(FAKE_UNKNOWN_TENANT_MEMBER_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantMemberById(FAKE_MALFORMED_TENANT_MEMBER_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantMember without an id', done => {
    getTenantMemberById()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantMemberById(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
