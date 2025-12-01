#!/bin/bash

set -e

ENV=$1

if [ -z "$ENV" ]; then
  echo "Usage: ./terraform/scripts/deploy-assets.sh <environment>"
  echo "Available environments: dev, staging, production"
  exit 1
fi

if [[ ! "$ENV" =~ ^(dev|staging|production)$ ]]; then
  echo "Invalid environment. Must be: dev, staging, or production"
  exit 1
fi

BUCKET="mca-beacons-b2c-assets-$ENV"

echo "Deploying assets to $ENV environment..."
echo "Bucket: s3://$BUCKET"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

aws s3 sync "$REPO_ROOT/webapp/public/assets" s3://$BUCKET/assets \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "*.json"

aws s3 sync "$REPO_ROOT/webapp/public/assets" s3://$BUCKET/assets \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "*.json"

echo "Assets deployed successfully to $ENV!"
echo "Assets available at: https://$BUCKET.s3.amazonaws.com"
