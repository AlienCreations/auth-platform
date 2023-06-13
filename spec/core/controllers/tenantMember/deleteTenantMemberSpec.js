'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const commonMocks        = require('../../../_helpers/commonMocks'),
      deleteTenantMember = require('../../../../server/core/controllers/api/tenantMember/deleteTenantMember');

const FAKE_UNKNOWN_TENANT_MEMBER_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_MEMBER_UUID;

describe('tenantMemberCtrl.deleteTenantMember', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, tenantMemberData) => {
      KNOWN_TEST_TENANT_MEMBER_UUID = R.compose(
        R.prop('uuid'),
        R.last
      )(tenantMemberData);

      done();
    });
  });

  it('successfully deletes an tenantMember', done => {
    deleteTenantMember(KNOWN_TEST_TENANT_MEMBER_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an tenantMember that is not in the database', done => {
    deleteTenantMember(FAKE_UNKNOWN_TENANT_MEMBER_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantMember with no params', done => {
    deleteTenantMember()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantMember with null params', done => {
    deleteTenantMember(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
