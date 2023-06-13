'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantOrganization = require('../../../../server/core/models/tenantOrganization/methods/deleteTenantOrganization'),
      commonMocks              = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'asd';

let KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('deleteTenantOrganization', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('deletes an tenantOrganization record when given a known tenantOrganization uuid', done => {
    deleteTenantOrganization(KNOWN_TEST_TENANT_ORGANIZATION_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an unknown tenantOrganization uuid', done => {
    deleteTenantOrganization(FAKE_UNKNOWN_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  // ID
  it('throws an error when uuid is missing', () => {
    expect(() => {
      deleteTenantOrganization();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      deleteTenantOrganization(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
