SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`agents`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`cloud_users`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`prospect_users`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenants`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`prospect_tenants`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenant_connections`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenant_organizations`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenant_access_roles`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenant_access_resources`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenant_access_role_assignments`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenant_access_permissions`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`tenant_members`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`migrations`;
DROP TABLE IF EXISTS `__CORE_DB_NAME__`.`password_resets`;

SET FOREIGN_KEY_CHECKS = 1;
