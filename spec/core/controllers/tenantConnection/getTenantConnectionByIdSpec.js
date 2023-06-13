'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionById = require('../../../../server/core/controllers/api/tenantConnection/getTenantConnectionById');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const KNOWN_TEST_TENANT_CONNECTION_ID     = 1,
      FAKE_UNKNOWN_TENANT_CONNECTION_ID   = 999,
      FAKE_MALFORMED_TENANT_CONNECTION_ID = 'foo';

let KNOWN_TEST_TENANT_CONNECTION_DATA;

describe('tenantConnectionCtrl.getTenantConnectionById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_CONNECTION_DATA = R.compose(
        R.omit(privateFields),
        R.find(R.propEq(KNOWN_TEST_TENANT_CONNECTION_ID, 'id')),
        commonMocks.transformDbColsToJsProps
      )(data);
      done();
    });
  });

  it('returns tenantConnectionData when looking for a tenantConnection by id', done => {
    getTenantConnectionById(KNOWN_TEST_TENANT_CONNECTION_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANT_CONNECTION_DATA);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a tenantConnection that does not exist', done => {
    getTenantConnectionById(FAKE_UNKNOWN_TENANT_CONNECTION_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantConnectionById(FAKE_MALFORMED_TENANT_CONNECTION_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a tenantConnection without an id', done => {
    getTenantConnectionById()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantConnectionById(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
