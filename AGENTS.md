## Current Task

- Working on issue #63 - spec: `specs/63-experimental-daily-count-ui.md`

## Project Knowledge

### Component Architecture

- **PageLayout**: Reusable layout component for consistent page structure. Handles loading states, error states, title display, header actions, and description content through slots and props.
- **ToggleSettingItem**: Reusable toggle component with v-model support. Use `v-model:value` for two-way binding.
- **ActionButton**: Standard button component with icon, text, and color props.

### Styling Conventions

- Uses Tailwind CSS classes with custom CSS variables
- Primary color is blue (`text-blue-500`)
- Background colors: `bg-slate-800` for cards, `bg-slate-700` for inputs
- Consistent spacing with `gap-2`, `gap-4`, `p-4`
- Responsive design with `md:gap-4` for medium screens

### App Versioning

- Version in `app/src/lib/utils.ts` follows format: `YYYY.MM.DD.RELEASE_INDEX`
- Update version for each new pull request.
  - Exception: pull requests that have ZERO user-facing impact.

### localStorage Usage

- Settings stored in localStorage for client-side persistence
- Use `onMounted` to load stored values
- Use `watch` to save changes automatically

### Git Workflow

- Feature branches for issues (e.g., `63-new-setting`)
- Use GitHub CLI for PR creation: `gh pr create`
- Commit messages follow conventional format: `feat:`, `refactor:`, `chore:`
