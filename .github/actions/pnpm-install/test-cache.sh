#!/bin/bash

# Script to test pnpm cache functionality

echo "🚀 Testing pnpm cache..."
echo "============================="

# Clear existing cache
echo "🧹 Clearing existing cache..."
pnpm store prune

# First installation (should be slow)
echo "📦 First installation (cold cache)..."
time pnpm install --frozen-lockfile

# Second installation (should be fast)
echo "⚡ Second installation (warm cache)..."
time pnpm install --frozen-lockfile --prefer-offline

# Show cache information
echo "📊 Cache information:"
pnpm store path
pnpm store prune --dry-run

echo "✅ Test completed!" 