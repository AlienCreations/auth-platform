'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionsByTenantUuid = require('../../../../server/core/controllers/api/tenantConnection/getTenantConnectionsByTenantUuid');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

let KNOWN_TEST_TENANT_CONNECTIONS,
    KNOWN_TEST_TENANT_UUID;

describe('tenantConnectionCtrl.getTenantConnectionsByTenantUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_UUID = R.compose(R.prop('tenant_uuid'), R.head)(data);

      KNOWN_TEST_TENANT_CONNECTIONS = R.compose(
        R.sortBy(R.prop('id')),
        R.map(R.omit(privateFields)),
        R.filter(R.propEq(KNOWN_TEST_TENANT_UUID, 'tenantUuid')),
        commonMocks.transformDbColsToJsProps
      )(data);

      done();
    });
  });

  it('returns all tenantConnections for a tenant', done => {
    getTenantConnectionsByTenantUuid(KNOWN_TEST_TENANT_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANT_CONNECTIONS);
        done();
      })
      .catch(done.fail);
  });
});
