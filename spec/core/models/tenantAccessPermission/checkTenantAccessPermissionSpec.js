'use strict';

const checkTenantAccessPermission = require('../../../../server/core/models/tenantAccessPermission/methods/checkTenantAccessPermission');

const KNOWN_TEST_PLATFORM_ROOT_USER_ID  = 1,
      KNOWN_TEST_PRIVILEGED_USER_ID     = 3,
      KNOWN_TEST_UNPRIVILEGED_USER_ID   = 4,
      KNOWN_TEST_TENANT_ID              = 2,
      KNOWN_TEST_TENANT_ORGANIZATION_ID = 2;

describe('checkTenantAccessPermission', () => {
  it('confirms that the platform root user has permission against a core resource', done => {
    checkTenantAccessPermission(
      '/api/v1/auth/deviceType',
      'POST',
      KNOWN_TEST_PLATFORM_ROOT_USER_ID,
      undefined,
      undefined
    ).then(({ hasPermission }) => {
      expect(!!hasPermission).toBe(true);
      done();
    });
  });

  it('confirms that a privileged tenant user has permission against a core resource', done => {
    checkTenantAccessPermission(
      '/api/v1/auth/deviceType',
      'POST',
      KNOWN_TEST_PRIVILEGED_USER_ID,
      KNOWN_TEST_TENANT_ID,
      undefined
    ).then(({ hasPermission }) => {
      expect(!!hasPermission).toBe(true);
      done();
    });
  });

  it('confirms that an unprivileged tenant user does NOT have permission against a core resource', done => {
    checkTenantAccessPermission(
      '/api/v1/auth/deviceType/id/:id',
      'DELETE',
      KNOWN_TEST_UNPRIVILEGED_USER_ID,
      KNOWN_TEST_TENANT_ID,
      undefined
    ).then(({ hasPermission }) => {
      expect(!!hasPermission).toBe(false);
      done();
    });
  });

  it('confirms that a privileged tenant user has permission against a tenant resource', done => {
    checkTenantAccessPermission(
      '/auth/login/cnn/*',
      'POST',
      KNOWN_TEST_PRIVILEGED_USER_ID,
      KNOWN_TEST_TENANT_ID,
      undefined
    ).then(({ hasPermission }) => {
      expect(!!hasPermission).toBe(true);
      done();
    });
  });

  it('confirms that an unprivileged tenant user does NOT have permission against a tenant resource', done => {
    checkTenantAccessPermission(
      '/auth/login/cnn/*',
      'POST',
      KNOWN_TEST_UNPRIVILEGED_USER_ID,
      KNOWN_TEST_TENANT_ID,
      undefined
    ).then(({ hasPermission }) => {
      expect(!!hasPermission).toBe(false);
      done();
    });
  });

  it('confirms that a privileged tenant user has permission against a tenant organization resource', done => {
    checkTenantAccessPermission(
      '/auth/login/cnn/brentwood',
      'POST',
      KNOWN_TEST_PRIVILEGED_USER_ID,
      KNOWN_TEST_TENANT_ID,
      KNOWN_TEST_TENANT_ORGANIZATION_ID
    ).then(({ hasPermission }) => {
      expect(!!hasPermission).toBe(true);
      done();
    });
  });

  it('confirms that an unprivileged tenant user does NOT have permission against a tenant organization resource', done => {
    checkTenantAccessPermission(
      '/auth/login/cnn/brentwood',
      'POST',
      KNOWN_TEST_UNPRIVILEGED_USER_ID,
      KNOWN_TEST_TENANT_ID,
      KNOWN_TEST_TENANT_ORGANIZATION_ID
    ).then(({ hasPermission }) => {
      expect(!!hasPermission).toBe(false);
      done();
    });
  });


});
