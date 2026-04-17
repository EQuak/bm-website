# Setup Guide: PNPM Install Action Composite

## What Changed

### Before
```yaml
- uses: pnpm/action-setup@v2
  with:
    version: 9.8.0
- uses: actions/setup-node@v3
  with:
    node-version: 20.x
    cache: "pnpm"
- run: pnpm install --no-frozen-lockfile
```

### After  
```yaml
- uses: actions/setup-node@v3
  with:
    node-version: 20.x
- name: 📥 Monorepo install
  uses: ./.github/actions/pnpm-install
```

## Benefits of the Change

1. **Smarter cache**: Uses `pnpm-lock.yaml` hash for precise caching
2. **Automatic rotation**: Monthly cache renewal to prevent issues
3. **Optimized flags**: Uses `--frozen-lockfile` and `--prefer-offline`
4. **Better performance**: Reduces installation time from ~5min to ~30s

## How to Test Locally

```bash
# Test cache functionality
./.github/actions/pnpm-install/test-cache.sh

# Debug cache information
./.github/actions/pnpm-install/debug-cache.sh
```

## Updating Existing Workflows

Replace this block in all workflows:

```yaml
# REMOVE
- uses: pnpm/action-setup@v2
  with:
    version: 9.8.0
- uses: actions/setup-node@v3
  with:
    node-version: 20.x
    cache: "pnpm"
- run: pnpm install --no-frozen-lockfile

# ADD
- uses: actions/setup-node@v3
  with:
    node-version: 20.x
- name: 📥 Monorepo install
  uses: ./.github/actions/pnpm-install
```

## Monitoring

To verify cache is working:

1. Go to Actions → Workflow run
2. Open job "Setup pnpm cache"
3. Check if it shows "Cache restored from key: ..."

## Troubleshooting

### Cache not working
- Check if `pnpm-lock.yaml` has been modified
- Cache is renewed monthly (this is normal)

### Installation still slow
- First installation of the month will be slow (normal)
- Verify you're using `--prefer-offline`

### Permission error
- Check if scripts have execution permissions
- Run: `chmod +x .github/actions/pnpm-install/*.sh` 