#!/usr/bin/env bash
set -euo pipefail

PROFILE="mca-admin-beacons"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! aws sts get-caller-identity --profile "$PROFILE" &>/dev/null; then
  echo "AWS SSO session not active. Run: aws sso login --profile $PROFILE"
  exit 1
fi

echo "Pulling secrets from Parameter Store..."

aws ssm get-parameter \
  --name "/beacons/dev/webapp/env-local" \
  --with-decryption \
  --profile "$PROFILE" \
  --query "Parameter.Value" \
  --output text > "$REPO_ROOT/webapp/.env.local"

echo "Written: webapp/.env.local"

aws ssm get-parameter \
  --name "/beacons/dev/microsoft-graph" \
  --with-decryption \
  --profile "$PROFILE" \
  --query "Parameter.Value" \
  --output text > "$REPO_ROOT/.envrc"

echo "" >> "$REPO_ROOT/.envrc"
echo "export BEACONS_LOCAL_AUTH=false" >> "$REPO_ROOT/.envrc"

echo "Written: .envrc"

direnv allow "$REPO_ROOT"

