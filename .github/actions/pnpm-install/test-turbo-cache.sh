#!/bin/bash

# Script to test Turbo cache functionality for typecheck

echo "🚀 Testing Turbo cache for typecheck..."
echo "======================================="

# Clean existing cache
echo "🧹 Clearing existing cache..."
pnpm turbo clean
rm -rf .turbo

# First run (should be slow - cache miss)
echo "📦 First typecheck run (cold cache)..."
time pnpm turbo typecheck --cache-dir=.turbo

# Second run (should be fast - cache hit)
echo ""
echo "⚡ Second typecheck run (warm cache)..."
time pnpm turbo typecheck --cache-dir=.turbo

# Show cache information
echo ""
echo "📊 Turbo cache information:"
echo "Cache directory: .turbo"
ls -la .turbo/ 2>/dev/null || echo "No .turbo directory found"

echo ""
echo "✅ Turbo typecheck cache test completed!"
echo ""
echo "💡 Expected behavior:"
echo "   - First run: Full typecheck execution (MISS)"
echo "   - Second run: Cache hit (FULL TURBO)"
echo ""
echo "ℹ️  Note: Biome runs directly (no cache needed - it's already super fast!)" 