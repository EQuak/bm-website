# Commit Message Guide

## Allowed Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code formatting, missing semi-colons, etc. (no code changes)
- **refactor**: Refactoring code (neither fixes a bug nor adds a feature)
- **test**: Adding or updating tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

## Commit Message Format

```
<type>: <subject>

<body> (optional)
```

### Examples

#### Good Commit Messages

- `feat: add user registration feature`
- `fix: resolve login form validation error`
- `docs: update README with installation instructions`
- `style: format code with Prettier`
- `refactor: reorganize user authentication logic`
- `test: add unit tests for login component`
- `chore: update dependencies`

#### Bad Commit Messages

- `fixed bugs`
- `added new feature`
- `update`
- `changed something`
- `refactored code`
- `improvements`

### Notes

- **Subject**: Use the imperative, present tense: “change” not “changed” nor “changes”
- **Subject**: Don’t capitalize the first letter
- **Subject**: No dot (.) at the end
- **Body**: Just as in the subject, use the imperative, present tense: “change” not “changed” nor “changes”
- **Body**: Explain the motivation for the change and contrast with previous behavior

### Type Explanation

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation changes
- `style:` Code formatting, missing semi-colons, etc. (no code changes)
- `refactor:` Refactoring code (neither fixes a bug nor adds a feature)
- `test:` Adding or updating tests
- `chore:` Changes to the build process or auxiliary tools and libraries such as documentation generation

### PNPM Scripts

- `pnpm lint:check` - Check for linting errors
- `pnpm format:check` - Check for formatting errors
- `pnpm typecheck` - Check for type errors

### GitHub Actions

- `ci` - CI workflow
- `format:check` - Check for formatting errors
- `lint:check` - Check for linting errors
- `typecheck` - Check for type errors
