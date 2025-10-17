## Current Task

- Working on issue #63 - spec: `app/specs/63-experimental-daily-count-ui.md`

## Project Knowledge

### Component Architecture

- **PageLayout**: Reusable layout component for consistent page structure. Handles loading states, error states, title display, header actions, and description content through slots and props.
- **ToggleSettingItem**: Reusable toggle component with v-model support. Use `v-model:value` for two-way binding.
- **ActionButton**: Standard button component with icon, text, and color props.
- **ComponentSwitcher**: Component designed specifically for dynamic routing in Vue Router. Bridges the gap between static router configuration and runtime component selection. Use when you need route-level conditional rendering based on application state (feature flags, user roles, A/B tests, etc.).

### Styling Conventions

- Uses Tailwind CSS classes with custom CSS variables
- Primary color is blue (`text-blue-500`)
- Background colors: `bg-slate-800` for cards, `bg-slate-700` for inputs
- Consistent spacing with `gap-2`, `gap-4`, `p-4`
- Responsive design with `md:gap-4` for medium screens

### App Versioning

- Version in `app/src/lib/utils.ts` follows format: `YYYY.MM.DD.RELEASE_INDEX`
- **ALWAYS update version for each new pull request.**
  - Exception: pull requests that have ZERO user-facing impact.
- **MANDATORY: Bump version before creating pull request - this is a critical step that must not be forgotten.**

### localStorage Usage

- Settings stored in localStorage for client-side persistence
- Use `onMounted` to load stored values
- Use `watch` to save changes automatically

### Code Style

- **Arrow Functions**: Prefer simple arrow functions without return keyword when possible
  - ✅ Good: `() => isEnabled ? EnabledComponent : DisabledComponent`
  - ✅ Good: `() => props.getComponent()`
  - ❌ Avoid: `() => { return isEnabled ? EnabledComponent : DisabledComponent }`
  - Use multi-line arrow functions only when necessary for complex logic

### Git Workflow

- Feature branches for issues (e.g., `63-new-setting`)
- Use GitHub CLI for PR creation: `gh pr create`
- Commit messages follow conventional format: `feat:`, `refactor:`, `chore:`

### Issue Specifications

- **File Naming**: Use format `{issue-number}-{brief-description}.md` in `app/specs/`
- **Structure**: 
  - Title with issue link: `# Title\n\nhttps://github.com/kwila-cloud/bintraq/issues/{number}`
  - Brief plan description
  - Checklist format using `[ ]` for pending and `[x]` for completed
- **Style**: 
  - ✅ Good: Simple, scannable checklist format
  - ✅ Good: Group related items logically
  - ❌ Avoid: Verbose descriptions, detailed explanations, multiple sections
- **Example**: See `app/specs/63-experimental-daily-count-ui.md` for reference
