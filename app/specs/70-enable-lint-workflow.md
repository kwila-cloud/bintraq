# Enable Lint Workflow and Fix Linter Errors

https://github.com/kwila-cloud/bintraq/issues/70

## Plan

Enable automated linting on pull requests and fix existing linter errors to ensure code quality and consistency.

- [x] Add ESLint rules for arrow function style to `eslint.config.ts`
- [x] Create GitHub workflow for linting (currently disabled)
- [ ] Update ESLint configuration to ignore `.vite/deps/` directory
- [ ] Fix unused imports in component files:
  - [ ] `MenuModal.vue`: Remove unused 'Icon' import
  - [ ] `ManagePickersView.vue`: Remove unused 'Icon' and 'getOrganization' imports
  - [ ] `PendingBinsView.vue`: Remove unused 'getOrganization' import
- [ ] Replace TypeScript `any` types with proper types:
  - [ ] `PageLayout.vue`: Fix multiple `any` types in props
  - [ ] `bin.ts`: Replace `any` type in model
  - [ ] `LoginPage.vue`: Fix multiple `any` types
  - [ ] `ManagePickersView.vue`: Fix multiple `any` types
  - [ ] `SmsUsageView.vue`: Fix `any` type
- [ ] Enable lint workflow in `.github/workflows/lint.yml`
- [ ] Test workflow on a pull request to ensure it works correctly