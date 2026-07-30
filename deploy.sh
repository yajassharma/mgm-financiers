#!/bin/bash
set -e

# ============================================================
#  MGM Financiers — Deploy Script
#
#  Flow: Build images locally → Ship to server → Deploy
#  Server has NO source code — only Docker images + containers
#
#  Usage:
#    ./deploy.sh                    # deploy all
#    ./deploy.sh --api-only         # deploy only API
#    ./deploy.sh --admin-only       # deploy only admin
#    ./deploy.sh --web-only         # deploy only website
#    ./deploy.sh --consent-only     # deploy only consent frontend
# ============================================================

SERVER="root@72.61.244.222"
REMOTE_DIR="/opt/mgm"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DOMAIN="72.61.244.222.sslip.io"
TAG="${IMAGE_TAG:-latest}"

build_image() {
  local name=$1
  local context=$2
  local build_args=$3
  echo "  Building $name..."
  docker build -t "$name:$TAG" $build_args "$context" 2>&1 | tail -1
}

save_image() {
  local name=$1
  docker save "$name:$TAG" | gzip > "/tmp/$name-$TAG.tar.gz"
  echo "  Saved $name ($(du -h /tmp/$name-$TAG.tar.gz | cut -f1))"
}

ship_file() {
  local src=$1
  local dst=$2
  scp "$src" "$SERVER:$dst" 2>/dev/null
}

# ============================================================
# Parse args
# ============================================================
DEPLOY_ALL=true
DEPLOY_API=false
DEPLOY_ADMIN=false
DEPLOY_WEB=false
DEPLOY_CONSENT=false

for arg in "$@"; do
  case $arg in
    --api-only) DEPLOY_ALL=false; DEPLOY_API=true ;;
    --admin-only) DEPLOY_ALL=false; DEPLOY_ADMIN=true ;;
    --web-only) DEPLOY_ALL=false; DEPLOY_WEB=true ;;
    --consent-only) DEPLOY_ALL=false; DEPLOY_CONSENT=true ;;
  esac
done

echo ""
echo "=========================================="
echo "  MGM Financiers — Deploy"
echo "  Server:  $SERVER"
echo "  Domain:  $DOMAIN"
echo "=========================================="
echo ""

# ============================================================
# Step 1: Build images locally
# ============================================================
echo "[1/4] Building Docker images..."
cd "$PROJECT_DIR"

if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_API" = true ]; then
  build_image "mgm-api" "./api"
fi

if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_ADMIN" = true ]; then
  build_image "mgm-admin" "./admin" "--build-arg VITE_APP_BASE_URL=https://api-mgm.$DOMAIN --build-arg VITE_APP_AUTH_NAME=mgm_admin_auth"
fi

if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_WEB" = true ]; then
  build_image "mgm-web" "./app"
fi

if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_CONSENT" = true ]; then
  build_image "mgm-consent" "./consent" "--build-arg VITE_API_URL=https://api-mgm.$DOMAIN"
fi

echo "  All images built."
echo ""

# ============================================================
# Step 2: Save images as tarballs
# ============================================================
echo "[2/4] Packaging images..."
cd /tmp

if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_API" = true ]; then
  save_image "mgm-api"
fi
if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_ADMIN" = true ]; then
  save_image "mgm-admin"
fi
if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_WEB" = true ]; then
  save_image "mgm-web"
fi
if [ "$DEPLOY_ALL" = true ] || [ "$DEPLOY_CONSENT" = true ]; then
  save_image "mgm-consent"
fi

echo ""

# ============================================================
# Step 3: Ship to server
# ============================================================
echo "[3/4] Shipping to server..."

# Ship docker-compose.yml and .env
ship_file "$PROJECT_DIR/docker-compose.yml" "$REMOTE_DIR/docker-compose.yml"
ship_file "$PROJECT_DIR/.env" "$REMOTE_DIR/.env"

# Ship image tarballs
for img in mgm-api mgm-admin mgm-web mgm-consent; do
  if [ -f "/tmp/$img-$TAG.tar.gz" ]; then
    scp "/tmp/$img-$TAG.tar.gz" "$SERVER:/tmp/" 2>/dev/null
    rm -f "/tmp/$img-$TAG.tar.gz"
  fi
done

echo "  Files shipped."

# ============================================================
# Step 4: Load images and deploy on server
# ============================================================
echo "[4/4] Deploying on server..."
ssh "$SERVER" bash << REMOTE
set -e

# Load images
for img in mgm-api mgm-admin mgm-web mgm-consent; do
  if [ -f "/tmp/\$img-$TAG.tar.gz" ]; then
    echo "  Loading \$img..."
    docker load < "/tmp/\$img-$TAG.tar.gz"
    rm -f "/tmp/\$img-$TAG.tar.gz"
  fi
done

# Deploy
cd $REMOTE_DIR
export DOMAIN=$DOMAIN
export IMAGE_TAG=$TAG
docker compose up -d --force-recreate

echo ""
echo "Containers:"
docker compose ps
REMOTE

echo ""
echo "=========================================="
echo "  Deployed!"
echo ""
echo "  Website:  https://mgm.$DOMAIN"
echo "  Consent:  https://consent.$DOMAIN"
echo "  Admin:    https://admin-mgm.$DOMAIN"
echo "  API:      https://api-mgm.$DOMAIN"
echo "=========================================="
echo ""
