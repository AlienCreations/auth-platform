'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionByUuid = require('../../../../server/core/controllers/api/tenantConnection/getTenantConnectionByUuid');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const FAKE_UNKNOWN_TENANT_CONNECTION_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_CONNECTION_UUID = 'foo';

let KNOWN_TEST_TENANT_CONNECTION_DATA,
    KNOWN_TEST_TENANT_CONNECTION_UUID;

describe('tenantConnectionCtrl.getTenantConnectionByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_CONNECTION_DATA = R.compose(
        R.omit(privateFields),
        R.head,
        commonMocks.transformDbColsToJsProps
      )(data);

      KNOWN_TEST_TENANT_CONNECTION_UUID = KNOWN_TEST_TENANT_CONNECTION_DATA.uuid;
      done();
    });
  });

  it('returns tenantConnectionData when looking for a tenantConnection by uuid', done => {
    getTenantConnectionByUuid(KNOWN_TEST_TENANT_CONNECTION_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANT_CONNECTION_DATA);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for a tenantConnection that does not exist', done => {
    getTenantConnectionByUuid(FAKE_UNKNOWN_TENANT_CONNECTION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid', done => {
    getTenantConnectionByUuid(FAKE_MALFORMED_TENANT_CONNECTION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for a tenantConnection without an uuid', done => {
    getTenantConnectionByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantConnectionByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
