#!/bin/bash

# Create main data directory
mkdir -p data

# Create configuration directories
mkdir -p data/conf/nginx
mkdir -p data/conf/rspamd/dynmaps
mkdir -p data/conf/rspamd/meta_exporter
mkdir -p data/conf/phpfpm/sogo-sso
mkdir -p data/conf/phpfpm/php-fpm.d
mkdir -p data/conf/dovecot
mkdir -p data/conf/postfix

# Create asset directories
mkdir -p data/assets/ssl
mkdir -p data/web

# Create mail storage directories
mkdir -p data/vmail
mkdir -p data/indexes

# Create database directory
mkdir -p data/db/mysql

# Set appropriate permissions
chmod -R 755 data
chmod -R 777 data/vmail data/indexes data/db/mysql

echo "Mailcow directories initialized successfully!" 