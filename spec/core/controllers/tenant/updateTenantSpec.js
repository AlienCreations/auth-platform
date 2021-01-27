'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenant = require('../../../../server/core/controllers/api/tenant/updateTenant');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const FAKE_TENANT_UPDATE_DATA = {
        title  : 'Updated body',
        domain : 'newdomain'
      },
      FAKE_UNKNOWN_TENANT_ID = 9999;

let KNOWN_TEST_TENANT_DATA,
    KNOWN_TEST_EXISTING_DOMAIN,
    KNOWN_TEST_TENANT_ID,
    FAKE_TENANT_UPDATE_DATA_EXISTING_DOMAIN,
    updatedTenantData;

describe('tenantCtrl.updateTenant', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {

      KNOWN_TEST_TENANT_DATA                  = R.compose(R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_EXISTING_DOMAIN              = R.compose(R.prop('domain'), R.last, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ID                    = R.prop('id', KNOWN_TEST_TENANT_DATA);
      FAKE_TENANT_UPDATE_DATA_EXISTING_DOMAIN = R.objOf('domain', KNOWN_TEST_EXISTING_DOMAIN);

      updatedTenantData = R.omit(privateFields, R.mergeDeepRight(KNOWN_TEST_TENANT_DATA, FAKE_TENANT_UPDATE_DATA));

      done();
    });
  });

  it('updates an tenant when provided an id and new properties to update', done => {
    updateTenant(FAKE_TENANT_UPDATE_DATA, KNOWN_TEST_TENANT_ID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(updatedTenantData);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating an tenant that does not exist', done => {
    updateTenant(FAKE_TENANT_UPDATE_DATA, FAKE_UNKNOWN_TENANT_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an existing domain', done => {
    updateTenant(FAKE_TENANT_UPDATE_DATA_EXISTING_DOMAIN, KNOWN_TEST_TENANT_ID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});
