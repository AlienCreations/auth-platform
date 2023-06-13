'use strict';

const checkTenantAccessPermission = require('../../../../server/core/models/tenantAccessPermission/methods/checkTenantAccessPermission');

const KNOWN_TEST_PLATFORM_ROOT_USER_UUID  = '3a16a792-7cf3-4e10-b3ac-7be4bc82b14b',
      KNOWN_TEST_PRIVILEGED_USER_UUID     = 'dcd1f790-3423-4f89-9182-0a9a330e490f',
      KNOWN_TEST_UNPRIVILEGED_USER_UUID   = '52ddc779-c8e4-4d76-9f29-5ccf698b3077',
      KNOWN_TEST_TENANT_UUID              = '7fd8ce45-2523-4d42-bd66-81c1ec3820dd',
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = '189ab6b2-efae-4a0c-b083-ad23929890b6';

describe('checkTenantAccessPermission', () => {
  it('confirms that the platform root user has permission against a core resource', done => {
    checkTenantAccessPermission(
      '/api/v1/auth/deviceType',
      'POST',
      KNOWN_TEST_PLATFORM_ROOT_USER_UUID,
      undefined,
      undefined
    )
      .then(({ hasPermission }) => {
        expect(!!hasPermission).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('confirms that a privileged tenant user has permission against a core resource', done => {
    checkTenantAccessPermission(
      '/api/v1/auth/deviceType',
      'POST',
      KNOWN_TEST_PRIVILEGED_USER_UUID,
      KNOWN_TEST_TENANT_UUID,
      undefined
    )
      .then(({ hasPermission }) => {
        expect(!!hasPermission).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('confirms that an unprivileged tenant user does NOT have permission against a core resource', done => {
    checkTenantAccessPermission(
      '/api/v1/auth/deviceType/id/:id',
      'DELETE',
      KNOWN_TEST_UNPRIVILEGED_USER_UUID,
      KNOWN_TEST_TENANT_UUID,
      undefined
    )
      .then(({ hasPermission }) => {
        expect(!!hasPermission).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  it('confirms that a privileged tenant user has permission against a tenant resource', done => {
    checkTenantAccessPermission(
      '/auth/login/cnn/*',
      'POST',
      KNOWN_TEST_PRIVILEGED_USER_UUID,
      KNOWN_TEST_TENANT_UUID,
      undefined
    )
      .then(({ hasPermission }) => {
        expect(!!hasPermission).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('confirms that an unprivileged tenant user does NOT have permission against a tenant resource', done => {
    checkTenantAccessPermission(
      '/auth/login/cnn/*',
      'POST',
      KNOWN_TEST_UNPRIVILEGED_USER_UUID,
      KNOWN_TEST_TENANT_UUID,
      undefined
    )
      .then(({ hasPermission }) => {
        expect(!!hasPermission).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  it('confirms that a privileged tenant user has permission against a tenant organization resource', done => {
    checkTenantAccessPermission(
      '/auth/login/gutfit/brentwood',
      'POST',
      KNOWN_TEST_PRIVILEGED_USER_UUID,
      KNOWN_TEST_TENANT_UUID,
      KNOWN_TEST_TENANT_ORGANIZATION_UUID
    )
      .then(({ hasPermission }) => {
        expect(!!hasPermission).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('confirms that an unprivileged tenant user does NOT have permission against a tenant organization resource', done => {
    checkTenantAccessPermission(
      '/auth/login/cnn/brentwood',
      'POST',
      KNOWN_TEST_UNPRIVILEGED_USER_UUID,
      KNOWN_TEST_TENANT_UUID,
      KNOWN_TEST_TENANT_ORGANIZATION_UUID
    )
      .then(({ hasPermission }) => {
        expect(!!hasPermission).toBe(false);
        done();
      })
      .catch(done.fail);
  });
});
