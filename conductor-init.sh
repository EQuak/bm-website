#!/usr/bin/env sh
set -e

# Cores para o logging
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo "${BLUE}➜${NC} $1"; }
log_success() { echo "${GREEN}✔${NC} $1"; }
log_warn() { echo "${YELLOW}⚠${NC} $1"; }

copy_if_exists() {
  SRC="$CONDUCTOR_ROOT_PATH/$1"
  DEST="$2"
  
  if [ -f "$SRC" ]; then
    # Cria o diretório de destino se não existir
    mkdir -p "$(dirname "$DEST")"
    cp "$SRC" "$DEST"
    log_success "Copied $1 to $DEST"
  else
    log_warn "Skipped $1 (file not found)"
  fi
}

echo ""
log_info "Starting environment setup..."
echo "--------------------------------"

# Copy Environment Files
log_info "Processing environment files..."
copy_if_exists ".env.local" ".env.local"
copy_if_exists ".env" ".env"
copy_if_exists "apps/mobile/.env" "apps/mobile/.env"
copy_if_exists "supabase/.env" "supabase/.env"

# Copy Tool Configs
echo ""
log_info "Processing tool configurations..."
copy_if_exists ".claude/.mcp.json" ".claude/.mcp.json"
copy_if_exists ".claude/settings.local.json" ".claude/settings.local.json"
copy_if_exists ".mcp.json" ".mcp.json"

echo ""
log_info "Installing dependencies..."
pnpm install

echo "--------------------------------"
log_success "Setup completed successfully!"
echo ""
