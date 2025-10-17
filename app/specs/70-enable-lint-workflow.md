# Enable Lint Workflow and Fix Linter Errors

https://github.com/kwila-cloud/bintraq/issues/70

## Plan

Enable automated linting on pull requests and fix existing linter errors to ensure code quality and consistency.

- [x] Add ESLint rules for arrow function style to `eslint.config.ts`
- [x] Create GitHub workflow for linting (currently disabled)
- [x] Update ESLint configuration to ignore `.vite/deps/` directory
- [x] Fix unused imports in component files:
  - [x] `MenuModal.vue`: Remove unused 'Icon' import
  - [x] `ManagePickersView.vue`: Remove unused 'Icon' and 'getOrganization' imports
  - [x] `PendingBinsView.vue`: Remove unused 'getOrganization' import
- [x] Replace TypeScript `any` types with proper types:
  - [x] `PageLayout.vue`: Fix multiple `any` types in props
  - [x] `bin.ts`: Replace `any` type in model
  - [x] `LoginPage.vue`: Fix multiple `any` types
  - [x] `ManagePickersView.vue`: Fix multiple `any` types
  - [x] `SmsUsageView.vue`: Fix `any` type
- [x] Enable lint workflow in `.github/workflows/lint.yml`
- [ ] Test workflow on a pull request to ensure it works correctly
