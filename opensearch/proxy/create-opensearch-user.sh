#!/usr/bin/env bash

# Do nothing if in local development environment
if [ -n "$LOCAL" ];
then
  exit 0
fi

credentials=$MASTER_USER:$MASTER_PASSWORD

res=$(curl -s -o /dev/null -w '%{http_code}\n' -u "$credentials" https://"$OPENSEARCH_URI"/_plugins/_security/api/internalusers/"$APPLICATION_USERNAME" --retry 10)

if ((res == 404));
then
    echo "User not found, creating..."

    REQUEST_BODY=$( jq -n \
       --arg password "$APPLICATION_PASSWORD" \
       '{password: $password, backend_roles: ["readall"]}')

    curl -XPUT -u "$credentials" https://"$OPENSEARCH_URI"/_plugins/_security/api/internalusers/"$APPLICATION_USERNAME" -H 'Content-Type: application/json' \
    -d "$REQUEST_BODY" --retry 10
else
    echo "User already exists, exiting..."
fi