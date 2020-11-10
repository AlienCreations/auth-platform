'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionsByTenantId = require('../../../../server/core/controllers/api/tenantConnection/getTenantConnectionsByTenantId');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const KNOWN_TEST_TENANT_ID = 1;

let KNOWN_TEST_TENANT_CONNECTIONS;

describe('tenantConnectionCtrl.getTenantConnectionsByTenantId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_CONNECTIONS = R.compose(
        R.sortBy(R.prop('id')),
        R.map(R.omit(privateFields)),
        R.filter(R.propEq('tenantId', KNOWN_TEST_TENANT_ID)),
        commonMocks.transformDbColsToJsProps
      )(data);

      done();
    });
  });

  it('returns all tenantConnections for a tenant', done => {
    getTenantConnectionsByTenantId(KNOWN_TEST_TENANT_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_TENANT_CONNECTIONS);
        done();
      });
  });

});
