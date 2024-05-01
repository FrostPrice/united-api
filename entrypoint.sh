#!/bin/sh

date=$(date)
echo $date

echo Starting Rust Actix Web Template

# Clear file if exists
echo "#Starting env file" >.env

# Add Host config to .env file
if [ -z ${APP_HOST} ]; then
    echo Host not defined, using default: 0.0.0.0
    echo APP_HOST=0.0.0.0 >>.env
else
    echo Host: $APP_HOST
    echo APP_HOST=$APP_HOST >>.env
fi

# Add Port config to .env file
if [ -z ${APP_PORT} ]; then
    echo Port not defined, using default: 8000
    echo APP_PORT=8000 >>.env
else
    echo Port: $APP_PORT
    echo APP_PORT=$APP_PORT >>.env
fi

# Add Database config to .env file
if [ -z ${DATABASE_URL} ]; then
    echo Fatal error: Database not defined
    exit 1
else
    echo Database: $DATABASE_URL
    echo DATABASE_URL=$DATABASE_URL >>.env
fi

# Add Default Username to .env file
if [ -z ${DEFAULT_USERNAME} ]; then
    echo Fatal error: DEFAULT_USERNAME not defined
    exit 1
else
    echo Default Username: $DEFAULT_USERNAME
    echo DEFAULT_USERNAME=$DEFAULT_USERNAME >>.env
fi

# Add Default Password to .env file
if [ -z ${DEFAULT_PASSWORD} ]; then
    echo Fatal error: DEFAULT_PASSWORD not defined
    exit 1
else
    echo Default Password: $DEFAULT_PASSWORD
    echo DEFAULT_PASSWORD=$DEFAULT_PASSWORD >>.env
fi

# Add Default Email to .env file
if [ -z ${DEFAULT_EMAIL} ]; then
    echo Fatal error: DEFAULT_EMAIL not defined
    exit 1
else
    echo Default Email: $DEFAULT_EMAIL
    echo DEFAULT_EMAIL=$DEFAULT_EMAIL >>.env
fi

exec ./rust-actix-web-template
