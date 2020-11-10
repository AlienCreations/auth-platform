'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenant = require('../../../../server/core/controllers/api/tenant/createTenant'),
      commonMocks  = require('../../../_helpers/commonMocks');

const FAKE_TENANT_DATA                               = {
        domain      : 'newtesttenant',
        title       : 'New Test Tenant',
        description : 'A new tenant for testing createTenant',
        logo        : 'foo.png',
        email       : 'new@testtenant.com',
        phone       : '925-555-0000',
        fax         : '',
        address1    : '123 Test Avenue',
        address2    : '',
        city        : 'Brentwood',
        state       : 'CA',
        zip         : '94513',
        country     : 'US',
        status      : 1,
        url         : 'http://www.newtesttenant.com'
      },
      FAKE_TENANT_DATA_INCOMPLETE                    = R.omit(['domain'], FAKE_TENANT_DATA),
      FAKE_TENANT_DATA_WITH_KNOWN_TEST_TENANT_DOMAIN = R.assoc(['domain'], 'nyt', FAKE_TENANT_DATA);

let mergeInsertId;

describe('tenantCtrl.createTenant', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.prop('id'), R.last)(data));
      done();
    });
  });

  it('returns FAKE_TENANT_DATA when creating an tenant with all correct params', done => {
    createTenant(FAKE_TENANT_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(mergeInsertId(FAKE_TENANT_DATA));
        done();
      });
  });

  it('throws an error when creating an tenant with incomplete params', done => {
    createTenant(FAKE_TENANT_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenant (domain should be unique)', done => {
    createTenant(FAKE_TENANT_DATA_WITH_KNOWN_TEST_TENANT_DOMAIN)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});
