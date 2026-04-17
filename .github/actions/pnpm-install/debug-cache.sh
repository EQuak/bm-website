#!/bin/bash

# Script to debug pnpm cache
# Shows information about current cache

echo "🔍 PNPM Cache Debug"
echo "===================="

echo "📅 Current date: $(date)"
echo "🗓️  Rotation key: $(date -u "+%Y%m")"
echo "📂 PNPM Store Path: $(pnpm store path)"
echo "🔢 pnpm-lock.yaml hash: $(sha256sum pnpm-lock.yaml | cut -d' ' -f1)"

echo ""
echo "🔑 Cache key that would be used:"
echo "$(uname -s)-pnpm-store-cache-$(date -u "+%Y%m")-$(sha256sum pnpm-lock.yaml | cut -d' ' -f1)"

echo ""
echo "📊 Store status:"
pnpm store prune --dry-run

echo ""
echo "📋 Installed packages:"
pnpm list --depth=0 