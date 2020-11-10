'use strict';

const commonMocks            = require('../../../_helpers/commonMocks'),
      deleteTenantConnection = require('../../../../server/core/controllers/api/tenantConnection/deleteTenantConnection');

const KNOWN_TEST_TENANT_CONNECTION_ID   = 1,
      FAKE_UNKNOWN_TENANT_CONNECTION_ID = 9999;

describe('tenantConnectionCtrl.deleteTenantConnection', () => {

  it('successfully deletes an tenantConnection', done => {
    deleteTenantConnection(KNOWN_TEST_TENANT_CONNECTION_ID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      });
  });

  it('throws an error when attempting to delete an tenantConnection that is not in the database', done => {
    deleteTenantConnection(FAKE_UNKNOWN_TENANT_CONNECTION_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantConnection with null params', done => {
    deleteTenantConnection()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantConnection with no params', done => {
    deleteTenantConnection(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
