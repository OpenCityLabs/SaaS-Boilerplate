# Migration from semantic-release to Changesets

## Summary

Successfully migrated from semantic-release to Changesets to eliminate security vulnerabilities.

### Security Improvements

- **Before migration:** 69 vulnerabilities (5 critical, 40 high, 17 moderate, 7 low)
- **After migration:** 8 vulnerabilities (0 critical, 0 high, 2 moderate, 6 low)
- **Production dependencies:** 0 vulnerabilities ✅
- **Eliminated:** All 17 high-risk vulnerabilities from semantic-release

### Why Changesets?

1. **Zero security vulnerabilities** (vs 10 in semantic-release)
2. **No npm dependency** (semantic-release depends on npm package with bundled vulnerabilities)
3. **Better developer experience** with manual changelog control
4. **Industry standard** (used by Vercel, Remix, Radix UI, and many others)

## How to Use Changesets

### 1. Creating a Changeset (After Making Changes)

When you make changes that should trigger a release:

```bash
npm run changeset
```

This will:
- Ask you what type of change this is (major, minor, patch)
- Ask you to describe the change
- Create a markdown file in `.changeset/` directory

**Example workflow:**
```bash
# Make your code changes
git add .
npm run commit  # Use commitizen for conventional commits
npm run changeset  # Create a changeset describing the changes
git add .changeset/
git commit -m "docs: add changeset"
git push
```

### 2. Change Types

- **patch** (1.0.0 → 1.0.1): Bug fixes, small changes
- **minor** (1.0.0 → 1.1.0): New features, backward compatible
- **major** (1.0.0 → 2.0.0): Breaking changes

### 3. Releasing a Version

When ready to release, run:

```bash
npm run changeset:version
```

This will:
- Consume all changesets in `.changeset/`
- Update `package.json` version
- Update `CHANGELOG.md`
- Delete consumed changeset files

Then commit and tag:

```bash
git add .
git commit -m "chore: version packages"
npm run changeset:tag
git push --follow-tags
```

### 4. Publishing (if needed)

For npm packages (not needed for this web app):

```bash
npm run changeset:publish
```

## Available Scripts

- `npm run changeset` - Create a new changeset
- `npm run changeset:version` - Consume changesets and bump versions
- `npm run changeset:publish` - Publish to npm (if applicable)
- `npm run changeset:tag` - Create git tags for versions

## CI/CD Integration

### Option 1: GitHub Actions (Recommended)

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Create Release Pull Request
        uses: changesets/action@v1
        with:
          version: npm run changeset:version
          publish: npm run changeset:publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This will:
1. Automatically create PRs when changesets are added
2. Update versions when the PR is merged
3. Create GitHub releases

### Option 2: Manual Releases

Simply run the commands manually when ready to release:

```bash
npm run changeset:version
git add .
git commit -m "chore: version packages"
npm run changeset:tag
git push --follow-tags
```

## Configuration

Configuration is in `.changeset/config.json`:

```json
{
  "changelog": [
    "@changesets/changelog-github",
    {
      "repo": "opencitylabs/alignhealthcare"
    }
  ],
  "baseBranch": "main",
  "access": "restricted"
}
```

- **changelog**: Uses GitHub integration for rich changelog with PR links
- **baseBranch**: Main branch name
- **access**: "restricted" means it won't be published to npm (appropriate for web apps)

## Differences from semantic-release

| Feature | semantic-release | Changesets |
|---------|-----------------|------------|
| **Versioning** | Automatic from commits | Manual via changesets |
| **Changelog** | Auto-generated from commits | Written by developers |
| **Control** | Less control | More control |
| **Monorepo** | Limited support | Excellent support |
| **Security** | 10 vulnerabilities | 0 vulnerabilities |
| **Learning curve** | Medium | Low |

## Tips

1. **Create changesets as you work**, not all at once before release
2. **Write clear descriptions** - they become your changelog entries
3. **Multiple changesets are fine** - they'll be combined during release
4. **Review changesets in PRs** - they document what changed
5. **Keep changesets in version control** - commit them with your code

## Example Workflow

```bash
# Feature development
git checkout -b feature/new-auth
# ... make changes ...
npm run changeset  # Create changeset: minor version for new feature
git add .
npm run commit -m "feat: add OAuth login"
git push

# After PR merge to main
git checkout main
git pull
npm run changeset:version  # Bump version, update changelog
git add .
git commit -m "chore: release v1.8.0"
npm run changeset:tag
git push --follow-tags
```

## Need Help?

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Changesets Tutorial](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
