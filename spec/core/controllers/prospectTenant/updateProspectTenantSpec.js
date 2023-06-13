'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateProspectTenant = require('../../../../server/core/controllers/api/prospectTenant/updateProspectTenant');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_PRIVATE_FIELDS = R.path(['api', 'TENANT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_PRIVATE_FIELDS);

const FAKE_PROSPECT_TENANT_UPDATE_DATA = {
        firstName : 'foo',
        lastName  : 'bar'
      },
      FAKE_UNKNOWN_UUID                = commonMocks.COMMON_UUID;

let KNOWN_TEST_PROSPECT_TENANT_DATA,
    KNOWN_TEST_EXISTING_EMAIL,
    FAKE_PROSPECT_TENANT_UPDATE_DATA_EXISTING_EMAIL,
    KNOWN_TEST_UUID,
    updatedProspectTenantData;

const emailLens = R.lensPath(['email']);

describe('prospectTenantCtrl.updateProspectTenant', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, data) => {

      KNOWN_TEST_PROSPECT_TENANT_DATA = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_UUID                 = KNOWN_TEST_PROSPECT_TENANT_DATA.uuid;

      KNOWN_TEST_EXISTING_EMAIL                       = R.compose(R.prop('email'), R.last, commonMocks.transformDbColsToJsProps)(data);
      FAKE_PROSPECT_TENANT_UPDATE_DATA_EXISTING_EMAIL = R.set(emailLens, KNOWN_TEST_EXISTING_EMAIL, R.omit(['id', 'uuid'], KNOWN_TEST_PROSPECT_TENANT_DATA));

      updatedProspectTenantData = R.omit(privateFields, R.mergeDeepRight(KNOWN_TEST_PROSPECT_TENANT_DATA, FAKE_PROSPECT_TENANT_UPDATE_DATA));

      done();
    });
  });

  it('updates a prospectTenant when provided an id and new properties to update', done => {
    updateProspectTenant(FAKE_PROSPECT_TENANT_UPDATE_DATA, KNOWN_TEST_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(updatedProspectTenantData);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating a prospectTenant that does not exist', done => {
    updateProspectTenant(FAKE_PROSPECT_TENANT_UPDATE_DATA, FAKE_UNKNOWN_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an existing email', done => {
    updateProspectTenant(FAKE_PROSPECT_TENANT_UPDATE_DATA_EXISTING_EMAIL, KNOWN_TEST_UUID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});
