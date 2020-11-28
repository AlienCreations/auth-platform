-- phpMyAdmin SQL Dump
-- version 4.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Oct 27, 2015 at 10:46 PM
-- Server version: 5.5.38
-- PHP Version: 5.5.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "America/Los_Angeles";
-- SET time_zone          = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

--
-- Database: `*-auth-platform-core`
--

--
-- Table structure for table `tenants`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenants` (
  `id`          INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `domain`      VARCHAR(30)         NOT NULL DEFAULT '',
  `title`       VARCHAR(40)         NOT NULL DEFAULT '',
  `description` VARCHAR(1024)       NOT NULL DEFAULT '',
  `logo`        VARCHAR(30)         NOT NULL DEFAULT '',
  `email`       VARCHAR(60)         NOT NULL DEFAULT '',
  `phone`       VARCHAR(16)         NOT NULL DEFAULT '0',
  `fax`         VARCHAR(16)         NOT NULL DEFAULT '0',
  `address_1`   VARCHAR(50)         NOT NULL DEFAULT '',
  `address_2`   VARCHAR(40)         NOT NULL DEFAULT '',
  `city`        VARCHAR(40)         NOT NULL DEFAULT '',
  `state`       CHAR(2)             NOT NULL DEFAULT '',
  `zip`         VARCHAR(10)         NOT NULL DEFAULT '0',
  `country`     CHAR(2)             NOT NULL DEFAULT 'US',
  `status`      TINYINT(3) UNSIGNED NOT NULL DEFAULT '1',
  `url`         VARCHAR(255)        NOT NULL,
  `created`     TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`   TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `domain` (`domain`)
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `prospect_tenants`
--

CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`prospect_tenants` (
  `id`           INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `first_name`   VARCHAR(40)         NOT NULL DEFAULT '',
  `last_name`    VARCHAR(40)         NOT NULL DEFAULT '',
  `email`        VARCHAR(60)         NOT NULL DEFAULT '',
  `phone`        VARCHAR(16)         NOT NULL DEFAULT '',
  `zip`          VARCHAR(10)         NOT NULL DEFAULT '0',
  `tenant_title` VARCHAR(40)         NOT NULL DEFAULT '',
  `token`        CHAR(60)            NOT NULL,
  `status`       TINYINT(3) UNSIGNED NOT NULL DEFAULT '1',
  `created`      TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`    TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_token` (`email`, `token`)
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `agents`
-- These will be the gym lens applications and
-- firmware instances in the field that will make API calls.
--

CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`agents` (
  `id`        INT(10) UNSIGNED        NOT NULL AUTO_INCREMENT,
  `tenant_id` INT(10) UNSIGNED        NOT NULL,
  `key`       VARCHAR(60)
              COLLATE utf8_unicode_ci NOT NULL
              COMMENT 'public key / jwt client id',
  `secret`    CHAR(60)
              COLLATE utf8_unicode_ci NOT NULL
              COMMENT 'private key / jwt client secret',
  `name`      VARCHAR(30)
              COLLATE utf8_unicode_ci NOT NULL,
  `status`    TINYINT(4)              NOT NULL DEFAULT '1'
              COMMENT '0:inactive, 1:active',
  `created`   TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp` TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`),
  CONSTRAINT `FK_agent_tenants` FOREIGN KEY (`tenant_id`) REFERENCES `__CORE_DB_NAME__`.`tenants` (`id`)
    ON DELETE CASCADE
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `cloud_users`
--

CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`cloud_users` (
  `id`               INT(10) UNSIGNED          NOT NULL AUTO_INCREMENT,
  `strategy_refs`    JSON                      NOT NULL,
  `auth_config`      JSON                      NOT NULL,
  `first_name`       VARCHAR(40)               NOT NULL DEFAULT '',
  `last_name`        VARCHAR(40)               NOT NULL DEFAULT '',
  `middle_initial`   CHAR(1)                   NOT NULL DEFAULT '',
  `gender`           ENUM ('M', 'F', 'T', 'X') NOT NULL DEFAULT 'X',
  `email`            VARCHAR(60)               NOT NULL DEFAULT '',
  `password`         CHAR(60)                  NOT NULL DEFAULT '',
  `phone`            VARCHAR(25)               NOT NULL DEFAULT '0',
  `alternate_phone`  VARCHAR(25)               NOT NULL DEFAULT '',
  `address_1`        VARCHAR(50)               NOT NULL DEFAULT '',
  `address_2`        VARCHAR(40)               NOT NULL DEFAULT '0',
  `city`             VARCHAR(40)               NOT NULL DEFAULT '',
  `state`            CHAR(2)                   NOT NULL DEFAULT '',
  `zip`              VARCHAR(10)               NOT NULL DEFAULT '0',
  `country`          CHAR(2)                   NOT NULL DEFAULT '',
  `occupation`       VARCHAR(40)               NOT NULL DEFAULT '',
  `language`         VARCHAR(5)                NOT NULL DEFAULT 'en',
  `portrait`         VARCHAR(255)              NOT NULL DEFAULT '',
  `status`           TINYINT(3) UNSIGNED       NOT NULL DEFAULT '1',
  `birthday`         DATE                               DEFAULT NULL,
  `meta_json`        JSON                      NOT NULL,
  `created`          TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`        TIMESTAMP                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `prospect_users`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`prospect_users` (
  `id`          INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `first_name`  VARCHAR(40)         NOT NULL DEFAULT '',
  `last_name`   VARCHAR(40)         NOT NULL DEFAULT '',
  `email`       VARCHAR(60)         NOT NULL DEFAULT '',
  `zip`         VARCHAR(10)         NOT NULL DEFAULT '0',
  `token`       CHAR(60)            NOT NULL,
  `status`      TINYINT(3) UNSIGNED NOT NULL DEFAULT '1',
  `created`     TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`   TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_token` (`email`, `token`)
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `tenant_connections`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenant_connections` (
  `id`                     INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `tenant_id`              INT(10) UNSIGNED    NOT NULL,
  `tenant_organization_id` INT(10) UNSIGNED    NOT NULL,
  `title`                  VARCHAR(40)         NOT NULL DEFAULT '',
  `description`            VARCHAR(1024)       NOT NULL DEFAULT '',
  `protocol`               VARCHAR(8)          NOT NULL DEFAULT 'mongodb',
  `host`                   VARCHAR(64)         NOT NULL,
  `port`                   INT(10) UNSIGNED    NOT NULL DEFAULT '27017',
  `user`                   VARCHAR(64)         NOT NULL,
  `password`               VARCHAR(255)        NOT NULL,
  `type`                   TINYINT             NOT NULL DEFAULT '1',
  `strategy`               VARCHAR(64)         NOT NULL DEFAULT 'common/mongoDb',
  `meta_json`              JSON                NOT NULL,
  `status`                 TINYINT(3) UNSIGNED NOT NULL DEFAULT '1',
  `created`                TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`              TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT `FK_tenant_connections_tenants` FOREIGN KEY (`tenant_id`) REFERENCES `__CORE_DB_NAME__`.`tenants` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `FK_tenant_connections_tenant_organizations` FOREIGN KEY (`tenant_organization_id`) REFERENCES `__CORE_DB_NAME__`.`tenant_organizations` (`id`)
    ON DELETE CASCADE,

  PRIMARY KEY (`id`)
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `tenant_organizations`
--

CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenant_organizations` (
  `id`        INT(10) UNSIGNED    NOT NULL AUTO_INCREMENT,
  `tenant_id` INT(10) UNSIGNED    NOT NULL DEFAULT '0',
  `title`     VARCHAR(40)         NOT NULL DEFAULT '',
  `email`     VARCHAR(60)         NOT NULL DEFAULT '',
  `password`  CHAR(60)            NOT NULL DEFAULT '',
  `phone`     VARCHAR(16)         NOT NULL DEFAULT '0',
  `fax`       VARCHAR(16)         NOT NULL DEFAULT '0',
  `address_1` VARCHAR(50)         NOT NULL DEFAULT '',
  `address_2` VARCHAR(40)         NOT NULL DEFAULT '',
  `city`      VARCHAR(40)         NOT NULL DEFAULT '',
  `state`     CHAR(2)             NOT NULL DEFAULT '',
  `zip`       VARCHAR(10)         NOT NULL DEFAULT '0',
  `country`   CHAR(2)             NOT NULL DEFAULT 'US',
  `tax_rate`  DECIMAL(10, 5)      NOT NULL DEFAULT '0.00000',
  `subdomain` VARCHAR(30)         NOT NULL,
  `meta_json` JSON,
  `status`    TINYINT(3) UNSIGNED NOT NULL DEFAULT '1',
  `created`   TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp` TIMESTAMP           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  CONSTRAINT `FK_tenant_organization_tenants` FOREIGN KEY (`tenant_id`) REFERENCES `__CORE_DB_NAME__`.`tenants` (`id`)
    ON DELETE CASCADE
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `tenant_members`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenant_members` (
  `id`            INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tenant_id`     INT(10) UNSIGNED NOT NULL,
  `cloud_user_id` INT(10) UNSIGNED NOT NULL,
  `reference_id`  VARCHAR(64)      NOT NULL DEFAULT '',
  `status`        INT(3)  UNSIGNED NOT NULL DEFAULT '1',
  `created`       TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_member_reference_id` (`tenant_id`, `reference_id`),

  CONSTRAINT `FK_tenant_members_tenants` FOREIGN KEY (`tenant_id`) REFERENCES `__CORE_DB_NAME__`.`tenants` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `FK_tenant_members_cloud_users` FOREIGN KEY (`cloud_user_id`) REFERENCES `__CORE_DB_NAME__`.`cloud_users` (`id`)
    ON DELETE CASCADE
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `tenant_access_roles`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenant_access_roles` (
  `id`                     INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tenant_id`              INT(10) UNSIGNED NOT NULL,
  `tenant_organization_id` INT(10) UNSIGNED          DEFAULT NULL,
  `title`                  VARCHAR(255)     NOT NULL,
  `status`                 INT(3)  UNSIGNED NOT NULL DEFAULT '1',
  `created`                TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`              TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY `tenant_access_role_title` (`tenant_id`, `tenant_organization_id`, `title`),

  CONSTRAINT `FK_tenant_access_roles_tenants` FOREIGN KEY (`tenant_id`) REFERENCES `__CORE_DB_NAME__`.`tenants` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `FK_tenant_access_roles_tenant_organizations` FOREIGN KEY (`tenant_organization_id`) REFERENCES `__CORE_DB_NAME__`.`tenant_organizations` (`id`)
    ON DELETE CASCADE,

  PRIMARY KEY (`id`)
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `tenant_access_role_assignments`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenant_access_role_assignments` (
  `id`                    INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tenant_access_role_id` INT(10) UNSIGNED NOT NULL,
  `cloud_user_id`         INT(10) UNSIGNED NOT NULL,
  `status`                INT(3)  UNSIGNED NOT NULL DEFAULT '1',
  `created`               TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`             TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `cloud_user_role_assignment` (`cloud_user_id`, `tenant_access_role_id`),

  CONSTRAINT `FK_tenant_access_role_assignments_role_id` FOREIGN KEY (`tenant_access_role_id`) REFERENCES `__CORE_DB_NAME__`.`tenant_access_roles` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `FK_tenant_access_role_assignments_cloud_users` FOREIGN KEY (`cloud_user_id`) REFERENCES `__CORE_DB_NAME__`.`cloud_users` (`id`)
    ON DELETE CASCADE
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `tenant_access_resources`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenant_access_resources` (
  `id`                     INT(10) UNSIGNED                           NOT NULL AUTO_INCREMENT,
  `tenant_id`              INT(10) UNSIGNED                                    DEFAULT NULL,
  `tenant_organization_id` INT(10) UNSIGNED                                    DEFAULT NULL,
  `title`                  VARCHAR(150)                               NOT NULL,
  `key`                    VARCHAR(150)                               NOT NULL,
  `uri`                    VARCHAR(255)                               NOT NULL,
  `method`                 ENUM ('POST', 'PUT', 'GET', 'DELETE', '*') NOT NULL,
  `status`                 INT(3) UNSIGNED                            NOT NULL DEFAULT '1',
  `created`                TIMESTAMP                                  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`              TIMESTAMP                                  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),

  UNIQUE KEY `tenant_access_resource_key`        (`key`),
  UNIQUE KEY `tenant_access_resource_title`      (`tenant_id`, `tenant_organization_id`, `title`),
  UNIQUE KEY `tenant_access_resource_uri_method` (`tenant_id`, `tenant_organization_id`, `uri`, `method`),

  -- Reminder these constraints are ONLY to prevent the "list all resources" dashboard from showing other tenants' login resources.

  CONSTRAINT `FK_tenant_access_resources_tenants` FOREIGN KEY (`tenant_id`) REFERENCES `__CORE_DB_NAME__`.`tenants` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `FK_tenant_access_resources_tenant_organizations` FOREIGN KEY (`tenant_organization_id`) REFERENCES `__CORE_DB_NAME__`.`tenant_organizations` (`id`)
    ON DELETE CASCADE

)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `tenant_access_permissions`
--
CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`tenant_access_permissions` (
  `id`                        INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tenant_access_role_id`     INT(10) UNSIGNED NOT NULL,
  `tenant_access_resource_id` INT(10) UNSIGNED NOT NULL,
  `status`                    INT(3)  UNSIGNED NOT NULL DEFAULT '1',
  `created`                   TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`                 TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `tenant_access_role_resource` (`tenant_access_resource_id`, `tenant_access_role_id`),

  CONSTRAINT `FK_tenant_access_permissions_role_id` FOREIGN KEY (`tenant_access_role_id`) REFERENCES `__CORE_DB_NAME__`.`tenant_access_roles` (`id`)
    ON DELETE CASCADE,

  CONSTRAINT `FK_tenant_access_permissions_resource_id` FOREIGN KEY (`tenant_access_resource_id`) REFERENCES `__CORE_DB_NAME__`.`tenant_access_resources` (`id`)
    ON DELETE CASCADE
)
  ENGINE          = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE         = utf8_unicode_ci
  AUTO_INCREMENT  = 1;

-- --------------------------------------------------------
--
-- Table structure for table `password_resets`
--

CREATE TABLE IF NOT EXISTS `__CORE_DB_NAME__`.`password_resets` (
  `cloud_user_email` VARCHAR(255) NOT NULL,
  `token`            CHAR(60)     NOT NULL,
  `created`          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timestamp`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`cloud_user_email`),
  UNIQUE KEY `token` (`token`),
  CONSTRAINT `FK_password_resets_users` FOREIGN KEY (`cloud_user_email`) REFERENCES `__CORE_DB_NAME__`.`cloud_users` (`email`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

-- --------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 1;
