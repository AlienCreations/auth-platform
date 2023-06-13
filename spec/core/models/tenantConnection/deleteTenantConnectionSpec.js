'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantConnection = require('../../../../server/core/models/tenantConnection/methods/deleteTenantConnection'),
      commonMocks            = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'asd';

let KNOWN_TEST_UUID;

describe('deleteTenantConnection', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('deletes an tenantConnection record when given a known tenantConnection uuid', done => {
    deleteTenantConnection(KNOWN_TEST_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an unknown tenantConnection uuid', done => {
    deleteTenantConnection(FAKE_UNKNOWN_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  // ID
  it('throws an error when uuid is missing', () => {
    expect(() => {
      deleteTenantConnection();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      deleteTenantConnection(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
