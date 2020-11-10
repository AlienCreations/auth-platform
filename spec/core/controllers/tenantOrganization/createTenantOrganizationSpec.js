'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantOrganization = require('../../../../server/core/controllers/api/tenantOrganization/createTenantOrganization'),
      commonMocks              = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const FAKE_TENANT_ORGANIZATION_DATA            = {
        tenantId  : 1,
        title     : 'fake title',
        email     : 'fake@email.com',
        password  : 'somepassword',
        phone     : '123-1234',
        fax       : '',
        address1  : '123 B street',
        address2  : '',
        city      : 'Antioch',
        state     : 'CA',
        zip       : '94513',
        country   : 'US',
        taxRate   : 0.08,
        subdomain : 'testtenant',
        metaJson  : JSON.stringify({ '1st floor' : [{ foo : 'bar', baz : 'bat' }, { foo : 'bar', baz : 'bat' }] }),
        status    : 1
      },
      FAKE_TENANT_ORGANIZATION_DATA_INCOMPLETE = R.omit(['email'], FAKE_TENANT_ORGANIZATION_DATA);

let mergeInsertId;

describe('tenantOrganizationCtrl.createTenantOrganization', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.prop('id'), R.last)(data));
      done();
    });
  });

  it('returns FAKE_TENANT_ORGANIZATION_DATA when creating a tenantOrganization with all correct params', done => {
    createTenantOrganization(FAKE_TENANT_ORGANIZATION_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.compose(
            R.omit(privateFields),
            mergeInsertId,
            R.over(R.lensProp('metaJson'), JSON.parse))(FAKE_TENANT_ORGANIZATION_DATA)
          );
        done();
      });
  });

  it('throws an error when creating an tenantOrganization with incomplete params', done => {
    createTenantOrganization(FAKE_TENANT_ORGANIZATION_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

});
