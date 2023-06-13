'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const commonMocks              = require('../../../_helpers/commonMocks'),
      deleteTenantOrganization = require('../../../../server/core/controllers/api/tenantOrganization/deleteTenantOrganization');

const FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ORGANIZATION_UUID = 'foo';

let KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('tenantOrganizationCtrl.deleteTenantOrganization', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, tenantMemberData) => {
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(
        R.prop('uuid'),
        R.last
      )(tenantMemberData);

      done();
    });
  });

  it('successfully deletes an tenantOrganization', done => {
    deleteTenantOrganization(KNOWN_TEST_TENANT_ORGANIZATION_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an tenantOrganization that is not in the database', done => {
    deleteTenantOrganization(FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantOrganization with null params', done => {
    deleteTenantOrganization(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantOrganization with a malformed uuid', done => {
    deleteTenantOrganization(FAKE_MALFORMED_TENANT_ORGANIZATION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantOrganization with no params', done => {
    deleteTenantOrganization()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
