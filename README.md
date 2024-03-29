Auth Platform
========

## Overview

Provides API endpoints to manage authorization via [JWT](https://jwt.io/). 

The routes for this API are located at the bottom of `./server/core/core.js` and expand into their own respective route definitions from there. 
Many of them require a signed JWT. This app signs all JWTs with a common private key and issues both a JWT as well as a refresh token. 
The refresh token includes the JWT payload and is encrypted with an internal key and the user's email address. We save the refresh token 
in the app memory and the front-end can send that up to re-authenticate a user and avoid prompting a username/password UI interruption.

This platform recognizes JWTs from both users and services - services are typically the other platforms in the microservice suite, but could potentially 
be another third party service that needs to make API calls to us. The services should sign their own tokens with their own private key, but all JWTs can 
be verified with a sister-library to this repo called [node-authenticator](https://github.com/aliencreations/node-authenticator). All JWTs will use RS256 
public/private key signing, so it's important that services for which this app wants to support incoming traffic provide their public keys 
to a `PUBLIC_KEYS` environment variable dictionary. Ideally this is a shared dictionary stored in AWS that all the platforms would receive on start-up. 

## Prerequisites

1. Node 12.18.x

2. yarn

3. Docker

## Build

- Access to the Alien Creations Git Packages repository is required. See [NPM Access](#npm_access) below
- run `yarn install`

### NPM Access

**option 1**:
Log in to the NPM server using this command:
```bash
npm login --scope=@aliencreations --registry=https://npm.pkg.github.com/
```

**option 2**:
- add these lines to `~/.npmrc`:
```bash
@aliencreations:registry=https://npm.pkg.github.com/
```
- define NPM_TOKEN in your shell:
```bash
export NPM_TOKEN='your_npm_token_value_here'
```

## Dependencies

### System Components

#### MySQL
For local development, MySQL is provided in the `docker-compose` suite. For production, it will be available in 
AWS or RDS, but the code will work the same and will leverage the [node-mysql-connector](https://github.com/aliencreations/node-mysql-connector) library.

## Configuration

### Database

1. The schema identified by CORE_DB_NAME must be created and must have full privileges granted to CORE_DB_USER

2. Tables must be created using the script defined in `./migrations/coreDb/20151119234015-initialSchema-up.sql`.
Migration instructions can be found below.

### Environment Variables

#### Required

These variables need to be provided by a .env or exported into the context. 

See `./run/env/demo/.env` for some more example values.

variable | description | values/format | example/suggested value
---------|-------------|---------------|--------
NODE_ENV | mode the API should run in | test, demo, production |  
BUILD_NUM | Hash or something to represent the deployed build, can be viewed in the health check page | string | uuid
CORE_DB_NAME | MySQL schema name | string | auth_platform_core
PLATFORMS | List of known services capable of authenticating | JSON array (string) | 
PRIVATE_KEY | RSA private key from JWT signing key pair | PEM format string | 
PUBLIC_KEYS | RSA public keys for validation of JWTs signed by this and other services | JSON map related services names (from PLATFORMS env. var.) to PEM format public keys | 
WHITELIST | Subset of PLATFORMS permitted to make calls to the Auth API | JSON map of service to list of services from which it will accept calls. All services must match names on PLATFORMS list | 
NODE_AUTHENTICATOR_RELATIVE_CHECK_PERMISSION_PATH | Relative path from project root to the `checkTenantAccessPermission` controller. This should be set for the auth platform only to avoid making API calls to itself to check permission on requests | file path | '../../../server/core/controllers/api/tenantAccessPermission/checkTenantAccessPermission'
NODE_AUTHENTICATOR_RELATIVE_CACHE_PATH | Relative path to a folder where we should store `flat-cache` containing refresh token references | file path | './cache'

#### Optional

The app will use default values for the following variables if they are not provided at start-up.
* Production most likely does not want to use most of these default values, so they should be overridden at start-up *

variable | description | values/format | default
---------|-------------|---------------|--------
NODE_PORTS | comma-delimited list of ports to listen on | comma-delimited list of int | 1337,1338,1339
THIS_SERVICE_NAME | | | platform
THIS_PROCESS_NAME | Optional param if we want to pass along to logger | |
CORE_DB_HOST | domain name for MySQL database | string | localhost
CORE_DB_USER | MySQL application user name | string | root
CORE_DB_PASSWORD | MySQL application user password | string | root
CORE_DB_PORT | MySQL listening port | integer | 3306
TENANT_CONNECTION_ENCRYPTION_KEY | Key to allow us to connect to a tenant database, provided by said tenant | | 
ALLOW_DEBUG | This flag is mainly used by the `node-logger` to include a deeper stacktrace in the logs | | undefined
JWT_TTL | Length of time for which JWTs signed by this service will be valid | string - integer followed by time unit abbreviation | 20s
LOG_LEVEL | The pino logging level to use.  If not set, defaults to `info` | string | trace, debug, info, warn, error, fatal, silent
KEEP_ALIVE_TIMEOUT | Idle timeout for keep alive setting for HTTP sockets, in milliseconds. Must be > load balancer idle timeout | integer | 120000

## Maintenance

This project uses the NPM library `db-migrate` to manage the database schema over time. 
It creates a `migrations` table in the schema, which tracks what migrations have been applied. 
Migrations have been defined in code at `sql/migrations/coreDb`. 
You may need to also install `db-migrate-mysql`. 

#### Create a new migration
Say you need to add a new column to a table. An example is adding a `source` column to the `coreDb.documents` table. 

Simply run this command : 

```bash
yarn create-migration documentSource coreDb CORE_DB
```

Three files will be generated for you :
```text
./migrations/coreDb/*-documentSource.js
./sql/migrations/coreDb/*-documentSource-down.sql
./sql/migrations/coreDb/*-documentSource-up.sql
```

Any logic you need to apply to the migration file itself - interpolation, etc - can be added to the js file. 
Any SQL changes you want to apply to the database moving forward should be added to the `*-up.sql` file.
Any SQL changes you would want to roll back if something bad happened should be added to the `*-down.sql` file.

*Example 20180503214105-documentSource-up.sql*
```sql
ALTER TABLE `__CORE_DB_NAME__`.`documents` ADD COLUMN `source` VARCHAR(50) NOT NULL DEFAULT '' AFTER `title`;
```

*Example 20180503214105-documentSource-down.sql*
```sql
ALTER TABLE `__CORE_DB_NAME__`.`documents` DROP COLUMN `source`;
```

### Run migrations
Migrating up will run all migrations which have not been applied to bring you to the latest database state. 
Migrating down will roll back one at a time, per command. 

Assume `coreDb` is up to date, and assume the environment is `demo`:

```bash
yarn migrate demo down coreDb # coreDb is now one migration behind
yarn migrate demo down coreDb # coreDb is now two migrations behind
yarn migrate demo down coreDb # coreDb is now three migrations behind
yarn migrate demo up coreDb   # coreDb is now current again
```

You can migrate multiple databases at once (example with `production` env): 
```bash
yarn migrate production up coreDb legacyDb fooDb
```
This assumes each of those `coreDb`, `legacyDb`, `fooDb` examples have at least an initial migration 
script in `migrations/{dbName}/{here}` respectively,


## Test

### Lint 
Run `yarn lint`

### Unit Tests
Run `yarn test`
- Unit tests require install, and configuration of environment variables and database as described above.
- Unit tests will give a pass/fail report as well as a coverage report
- Unit tests destroy/rebuild the database every spec, so it's much faster if MySQL is mounted to memory when 
running the tests.

### Health Check
Navigate to `http://auth-platform.test:1337/health` to see a list of supported infrastructure connections (ex: MySQL) 
and any connection errors that may be occurring. 

### Ping
Simply `curl http://auth-platform.test:1337/ping --insecure` to check that the express server is up and running. It will 
return a `pong` response with a timestamp. 

* _The `--insecure` flag is an optional, quick way to avoid providing curl with an SSL 
key to satisfy the https connection and should only be used for smoke screen testing._


## Development

### General Dependencies
* [Environment Variables](#environment-variables)
* [NodeJS](#nodejs)
* [MySQL](#mysql)

### Optional Dependencies
* [Nginx](#nginx)

 
### NPM
This project includes a few private modules, which come from the Alien Creations Git Packages.
The following command will update your `.npmrc` file to include a token.
```
npm login --scope=@aliencreations --registry=https://npm.pkg.github.com/
```

### Environment Variables
The required environment variables will be enforce d by the node package [dotenv-safe](https://www.npmjs.com/package/dotenv-safe). As you add required 
env vars. A local `.env` file has been provided for `demo` and `test` environments in `./run/env/demo/` or `./run/env/test` respectively.

A project root `.env.example` outlines which vars are required and do not fail-over to defaults in the app config. 
You can override any of these by adding a project-root `.env` file, which 
has been added to the `.gitignore` so it isn't inadvertently committed to the repo.  

* note: production _MUST_ have its own environment variables provided to it after deployment, either from a `.env` created on the machine or through some CD 
injection.

### NodeJS
Make sure [Node is installed](https://nodejs.org/en/download/). This app requires at least version 12.x with latest yarn or npm.
Make sure you are the owner of the folder in which NPM needs to install any global dependencies: ([article with more information](http://howtonode.org/introduction-to-npm)).
On OSX/Unix, this command should work:
```
$ sudo chown -R $USER /usr/local
```  
* note: Depending on how much is in that directory, that command may take a bit of time to run.

### MySQL
This app uses MySQL as the database. It is included in the `docker-compose`. If you want to visually manage the database for local 
development, we include [phpmyadmin](https://en.wikipedia.org/wiki/PhpMyAdmin) which can typically be viewed 
at `http://localhost:8080` and accessed with username `root` and password `root`. This tool should _not_ be deployed to AWS. Local dev _only_.

### Source Code
Clone the app (make sure you are added as a collaborator)

*https*
```bash
git clone https://yourusername@github.com/aliencreations/auth-platform.git
```

*ssh*
```bash
git clone git@github.com/aliencreations/auth-platform.git
```

### Install the Node dependencies
If you have [yarn](https://yarnpkg.com/lang/en/docs/install/), use it, otherwise use npm.
On OSX, you can easily install Yarn with Homebrew:

```bash
brew update
brew install yarn
```

With Windows there is an [msi file](https://yarnpkg.com).

Regardless, install the dependencies:

```bash
yarn install # or npm install
```

### Local Development DNS
Do this, for `.test` domain. Do NOT use `.dev` (Substitute all .dev references with .test)
 - https://gist.github.com/ogrrd/5831371
 
Local dev needs `*.auth-platform.test` since the platform API will use `http://platform.auth-platform.test` and tenant-specific 
API endpoints will use their respective subdomain, for example a POST to `http://cnn-media.auth-platform.test/api/v1/document` 
where `cnn` would be the tenant domain for `Cable News Network` and `media` would be the organization domain.

### Local Development Nginx
If you want to use port 80 for local dev, you can install or configure Nginx as follows. This is completely optional, as the app will work 
just fine with port specification in the urls. Copy the `/etc/nginx/auth-platform.conf` from this repo into your appropriate `sites_enabled` folder 
from your Nginx install location. Ideally it will live at `/etc/nginx/sites_enabled/auth-platform.conf` and will then be included 
automatically from the `/Applications/MAMP/conf/etc/nginx.conf` file.

Consider this excerpt from the `./etc/auth-platform.conf` file for an understanding of the proxy: 

``` 
upstream auth-platform {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
    #server 127.0.0.1:3003;
}

# The Nginx server instance.
server {
    listen 80;
    server_name *.auth-platform.test auth-platform;
    access_log  /var/log/nginx/auth-platform.log;

```

### Docker Services
This app has a `docker-compose.yml` to pull down all the required third-party services it needs to function properly. 
This yml file requires that some environment variables have been set ahead of time. Again, these are pulled in from 
the appropriate run space, meaning that `NODE_ENV=test` and `NODE_ENV=demo` will populate the `docker-compose.yml` file 
differently. 

The app has helper commands to make this easy, which can be scaled in the `package.json` scripts section: 

For example, the following command will start the docker services where `NODE_ENV=demo` : 
```bash
yarn docker demo up
```
 
... and for unit tests : 

```bash
yarn docker test up
```

To stop these services, simply replace `up` with `down`.

* Note: You might need to increase the default memory to 4gb. https://stackoverflow.com/a/39720010/353802
* Note: If you need to free up any memory between demo and test toggles, simply restart the Docker daemon. 

After running the `demo` compose, simply wait for the docker logs to settle down to give you an indication all the services 
are finished booting up. 

### Run the tests
Don't forget to have already run `yarn docker test up` in *another terminal* so your services are available. 

The unit tests invoke models which contain SQL. The test process tears down, rebuilds, and reseeds MySQL with mock 
data every spec so there are no side-effects. For MySQL in particular, the db volume is mounted to RAM for ludicrous speed.

```bash
yarn test 
```

### Start the app
Assuming you just ran the tests, first stop the test services with `yarn docker test down` and then start the demo 
services with `yarn docker demo up`. That command is in terminal 1.

In terminal 2, run the app in the appropriate local environment setting. For example, to run a demo : 

```bash
yarn demo
```

More local environments may be supported in the future, for long term development in which the data should persist and 
simply migrate up, it would make sense to support this, but at this point that is not implemented. An example supplemented 
environment might be : 

```bash
yarn dev
```

# Demo
The demo environment mentioned above will bootstrap fresh every time you run `yarn demo`. This merely acts as a 
working API to support any clients that need it (web dashboards, mobile apps, etc). 

# Deployment
Basic deploy script on `demo` environment/AWS : 

```bash
sudo yarn docker demo up -d
sudo pm2 start ./run/env/demo/run.sh --name demo-platform
```

Deployment on a persistent server would not want to run demo scripts because those will destroy/rebuild the 
database. Instead, do something like this : 

```bash
pm2 start ./server/platform.js --name platform
```

This would assume you have all the dependencies up and running : 
 - MySQL
 - S3

This also assumes that environment variables are available on the process. Please see `./env.example` for a list of 
required env vars. Since we use `demo` and `test` for local development usually, if `./.env.example` is missing any 
required variables, please reference `./run/env/demo/.env` as a working file and fill in any gaps to the example file.

# Debugging
Docker has logs for each of the processes in the compose file, which should still be tailing in terminal 1. If that terminal was closed, 
simply run `docker logs`

To ssh into a container to debug or to see pm2 logs in the data modeler for example:

 - List the containers

```bash
docker ps
```

 - SSH into a container. (Example container id 2d94ed9a8491)

```bash
docker exec -it 2d94ed9a8491 /bin/bash
```

For containers running pm2, simply run `pm2 logs` from within the container. 
