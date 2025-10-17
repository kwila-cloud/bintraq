# Enable Lint Workflow and Fix Linter Errors

https://github.com/kwila-cloud/bintraq/issues/70

## Issue Description

The lint workflow has been created but disabled due to existing linter errors that need to be fixed before it can be enabled on pull requests.

## Current Status

- ✅ ESLint rules for arrow function style have been added to `eslint.config.ts`
- ✅ GitHub workflow for linting has been created but disabled
- ❌ 58 linter errors need to be fixed

## Linter Errors to Fix

### Arrow Function Style Rules (Already Applied)
- `arrow-body-style`: ['error', 'as-needed'] - Enforces concise arrow functions
- `prefer-arrow-callback`: 'error' - Prefers arrow functions over function expressions

### Existing Errors to Address

1. **Unused imports/variables**:
   - `MenuModal.vue`: 'Icon' is defined but never used
   - `ManagePickersView.vue`: 'Icon' and 'getOrganization' are defined but never used
   - `PendingBinsView.vue`: 'getOrganization' is defined but never used

2. **TypeScript `any` types**:
   - `PageLayout.vue`: Multiple `any` types in props
   - `bin.ts`: `any` type in model
   - `LoginPage.vue`: Multiple `any` types
   - `ManagePickersView.vue`: Multiple `any` types
   - `SmsUsageView.vue`: `any` type

3. **Vite dependency files**:
   - Multiple errors in `.vite/deps/` files (these are generated files, should be ignored)

## Tasks

### 1. Update ESLint Configuration
- [ ] Add ignore patterns for `.vite/deps/` directory
- [ ] Consider adding rules for unused variables and explicit `any` types

### 2. Fix Code Issues
- [ ] Remove unused imports in component files
- [ ] Replace `any` types with proper TypeScript types
- [ ] Fix unused variables

### 3. Enable Workflow
- [ ] Uncomment and enable the lint workflow
- [ ] Test the workflow on a pull request

## Implementation Plan

1. **Update ESLint config** to ignore generated files and add stricter rules
2. **Fix component files** to remove unused imports and improve type safety
3. **Enable workflow** once all errors are resolved
4. **Test** the workflow on a PR to ensure it works correctly

## Benefits

- ✅ Consistent code style across the project
- ✅ Automated code quality checks on PRs
- ✅ Better TypeScript type safety
- ✅ Cleaner, more maintainable codebase

## Files to Modify

- `app/eslint.config.ts` - Update ignore patterns and rules
- `app/src/components/MenuModal.vue` - Remove unused import
- `app/src/components/PageLayout.vue` - Fix `any` types and unused variables
- `app/src/models/bin.ts` - Replace `any` type
- `app/src/views/LoginPage.vue` - Fix `any` types
- `app/src/views/ManagePickersView.vue` - Remove unused imports and fix `any` types
- `app/src/views/PendingBinsView.vue` - Remove unused import
- `app/src/views/SmsUsageView.vue` - Fix `any` type
- `.github/workflows/lint.yml` - Enable workflow