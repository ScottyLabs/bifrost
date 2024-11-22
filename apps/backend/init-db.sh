#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE resource;
    CREATE DATABASE auth;
    GRANT ALL PRIVILEGES ON DATABASE resource TO bifrost_user;
EOSQL
