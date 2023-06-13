'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const commonMocks            = require('../../../_helpers/commonMocks'),
      deleteTenantConnection = require('../../../../server/core/controllers/api/tenantConnection/deleteTenantConnection');

const FAKE_UNKNOWN_TENANT_CONNECTION_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_CONNECTION_UUID;

describe('tenantConnectionCtrl.deleteTenantConnection', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_CONNECTION_UUID = R.compose(R.prop('uuid'), R.last)(data);
      done();
    });
  });

  it('successfully deletes an tenantConnection', done => {
    deleteTenantConnection(KNOWN_TEST_TENANT_CONNECTION_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an tenantConnection that is not in the database', done => {
    deleteTenantConnection(FAKE_UNKNOWN_TENANT_CONNECTION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantConnection with missing params', done => {
    deleteTenantConnection()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantConnection with null params', done => {
    deleteTenantConnection(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
