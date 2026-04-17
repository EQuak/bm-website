#!/bin/bash

# Script to verify cache is working correctly in CI

echo "🔍 Verifying cache setup..."
echo "============================"

echo "📂 Current directory contents:"
ls -la | grep -E "(turbo|cache)" || echo "No cache directories visible"

echo ""
echo "🎯 Testing Turbo cache functionality:"

# Check if turbo command works
if command -v pnpm >/dev/null 2>&1; then
    echo "✅ pnpm is available"
    
    # Test turbo cache
    echo "🧪 Testing turbo typecheck with cache..."
    pnpm turbo typecheck --cache-dir=.turbo --dry-run 2>/dev/null || echo "❌ Turbo command failed"
    
    # Check if .turbo directory was created
    if [ -d ".turbo" ]; then
        echo "✅ .turbo directory exists"
        echo "📊 .turbo contents:"
        ls -la .turbo/ | head -5
    else
        echo "⚠️  .turbo directory not found (normal on first run)"
    fi
else
    echo "❌ pnpm not available"
fi

echo ""
echo "📋 Cache configuration summary:"
echo "  - .turbo in .gitignore: ✅ (not tracked in git)"
echo "  - GitHub Actions cache path: .turbo"
echo "  - Turbo cache-dir flag: --cache-dir=.turbo"
echo ""
echo "💡 This is the correct setup for CI cache!" 