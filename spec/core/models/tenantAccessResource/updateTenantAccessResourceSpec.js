'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessResource    = require('../../../../server/core/models/tenantAccessResource/methods/updateTenantAccessResource'),
      getTenantAccessResourceByUuid = require('../../../../server/core/models/tenantAccessResource/methods/getTenantAccessResourceByUuid'),
      commonMocks                   = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER          = 1337,
      A_NEGATIVE_NUMBER          = -10,
      STRING_ONE_CHAR            = 'a',
      STRING_THREE_HUNDRED_CHARS = '*'.repeat(300);

const FAKE_UNKNOWN_UUID              = commonMocks.COMMON_UUID,
      FAKE_UPDATE_TITLE              = 'xxx',
      FAKE_UPDATE_URI                = 'boo/boo',
      FAKE_UPDATE_KEY                = 'x-x-x',
      FAKE_UPDATE_METHOD_SUPPORTED   = 'POST',
      FAKE_UPDATE_METHOD_UNSUPPORTED = 'BAR',
      FAKE_UPDATE_STATUS             = 2;

let KNOWN_TEST_UUID,
    KNOWN_TEST_TITLE;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantAccessResource when given a valid ' + field, done => {
    updateTenantAccessResource(KNOWN_TEST_UUID, {
      [field] : value
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getTenantAccessResourceByUuid(KNOWN_TEST_UUID)
          .then(tenantAccessResource => {
            expect(R.prop(field, tenantAccessResource)).toBe(value);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });
};

describe('updateTenantAccessResource', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {
      const data = R.map(commonMocks.ensureTrueNullInCsvData, _data);

      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_UUID  = knownProp('uuid');
      KNOWN_TEST_TITLE = knownProp('title');

      done();
    });
  });

  // ID AS PARAM
  it('fails gracefully when given an unknown tenantAccessResource id to update', done => {
    updateTenantAccessResource(FAKE_UNKNOWN_UUID, {
      title : FAKE_UPDATE_TITLE
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('throws an error when updating a tenantAccessResource with null id', () => {
    expect(() => {
      updateTenantAccessResource(null, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantAccessResource(STRING_ONE_CHAR, {
        status : FAKE_UPDATE_STATUS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TITLE IN BODY
  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a title that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        title : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  // TITLE IN BODY
  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a title that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        title : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  // TENANT_UUID IN BODY
  it('throws an error when given a tenantUuid (unsupported for update)', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        tenantUuid : FAKE_UNKNOWN_UUID
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TENANT_ORGANIZATION_UUID IN BODY
  it('throws an error when given a tenantOrganizationUuid (unsupported for update)', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        tenantOrganizationUuid : FAKE_UNKNOWN_UUID
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // KEY IN BODY
  it('throws an error when given a key of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        key : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a key that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        key : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('key', FAKE_UPDATE_KEY);

  // URI IN BODY
  it('throws an error when given a uri of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        uri : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a uri that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        uri : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('uri', FAKE_UPDATE_URI);

  // METHOD IN BODY
  it('throws an error when given a method of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        method : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a method that is not supported', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        method : FAKE_UPDATE_METHOD_UNSUPPORTED
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('method', FAKE_UPDATE_METHOD_SUPPORTED);

  it('does not update anything when no req body is provided', done => {
    updateTenantAccessResource(KNOWN_TEST_UUID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantAccessResourceByUuid(KNOWN_TEST_UUID)
          .then((tenantAccessResource) => {
            expect(tenantAccessResource.title).toBe(KNOWN_TEST_TITLE);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantAccessResource(KNOWN_TEST_UUID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_UUID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
