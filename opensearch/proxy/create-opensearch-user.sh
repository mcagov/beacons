#!/usr/bin/env bash

# Log function for standard logging
log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - $1"
}

# Log function for error logging
error_log() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') - ERROR: $1" >&2
}

log "Script started..."

# Do nothing if in local development environment
if [ -n "$LOCAL" ]; then
  log "In local development environment. Exiting..."
  exit 0
fi

credentials="$MASTER_USER:$MASTER_PASSWORD"
log "Attempting to check user existence..."

res=$(curl -s -o /dev/null -w '%{http_code}\n' -u "$credentials" "https://$OPENSEARCH_DOMAIN/_plugins/_security/api/internalusers/$APPLICATION_USERNAME" --retry 10)

if ((res == 404)); then
  log "User not found, creating..."

  # Construct request body
  REQUEST_BODY=$(jq -n --arg password "$APPLICATION_PASSWORD" '{password: $password, opendistro_security_roles: ["readall_and_monitor"]}')

  # Attempt to create user
  res=$(curl -s -o /dev/null -w '%{http_code}\n' -XPUT -u "$credentials" "https://$OPENSEARCH_DOMAIN/_plugins/_security/api/internalusers/$APPLICATION_USERNAME" -H 'Content-Type: application/json' -d "$REQUEST_BODY" --retry 10)

  if ((res == 201)); then
    log "User created successfully. Exiting..."
    exit 0
  else
    error_log "Failed to create user. HTTP Status: $res"
    exit 1
  fi

elif ((res >= 200 && res < 300)); then
  log "User already exists. Exiting..."
  exit 0
else
  error_log "Something went wrong while accessing: https://$OPENSEARCH_DOMAIN/_plugins/_security/api/internalusers/$APPLICATION_USERNAME"
  error_log "HTTP Status: $res"
  error_log "Curl command executed: curl -s -o /dev/null -w '%{http_code}\n' -u \"$credentials\" \"https://$OPENSEARCH_DOMAIN/_plugins/_security/api/internalusers/$APPLICATION_USERNAME\" --retry 10"
  exit 1
fi
