'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantConnection = require('../../../../server/core/controllers/api/tenantConnection/createTenantConnection'),
      commonMocks            = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const FAKE_TENANT_CONNECTION_DATA            = {
        tenantId             : 1,
        tenantOrganizationId : 1,
        title                : 'fake title',
        description          : 'fake description',
        protocol             : 'https',
        host                 : 'foo.com',
        user                 : 'testuser',
        password             : 'testpassword',
        port                 : 80,
        type                 : 1,
        metaJson             : JSON.stringify({ foo : 'bar' }),
        strategy             : 'common/mongodb',
        status               : 1
      },
      FAKE_TENANT_CONNECTION_DATA_INCOMPLETE = R.omit(['title'], FAKE_TENANT_CONNECTION_DATA);

let mergeInsertId;

describe('tenantConnectionCtrl.createTenantConnection', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.prop('id'), R.last)(data));
      done();
    });
  });

  it('returns FAKE_TENANT_CONNECTION_DATA when creating an tenantConnection with all correct params', done => {
    createTenantConnection(FAKE_TENANT_CONNECTION_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.compose(
            R.omit(privateFields),
            mergeInsertId,
            R.over(R.lensProp('metaJson'), JSON.parse)
          )(FAKE_TENANT_CONNECTION_DATA));
        done();
      });
  });

  it('throws an error when creating an tenantConnection with incomplete params', done => {
    createTenantConnection(FAKE_TENANT_CONNECTION_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

});
