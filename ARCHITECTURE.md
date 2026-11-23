
# Rittick SDK architecture

## Architecture governance

The accepted architectural decisions are maintained in
`docs/adr/`.

ADR-001 through ADR-011 govern package boundaries,
runtime compatibility, security, testing, publishing,
theming, and story execution.

The original 195-story roadmap remains unchanged.

## Implemented architecture

### Repository foundation — UI-001

- Private ESM npm workspace root.
- npm workspaces under `packages/*`.
- Private `@rittick/ui` workspace package.
- Root dependency lockfile.
- Node.js 22.x and 24.x compatibility baseline.
- Workspace validation command.

### TypeScript foundation — UI-002

- TypeScript 5.9.3 pinned as a development dependency.
- Shared strict TypeScript configuration.
- UI-specific TypeScript configuration.
- ES2022 language target.
- React JSX transform configuration.
- Bundler-oriented UI typechecking.
- Root typecheck command.

## UI-003 implementation checkpoint

Status: Implementation pending verification.

### Library build

The proposed UI-003 build uses the existing TypeScript
compiler to generate ESM JavaScript, TypeScript
declarations, and JavaScript source maps.

Build configuration:

- `packages/ui/tsconfig.build.json`
- NodeNext module and module resolution settings.
- Strict compiler options inherited from the UI
  TypeScript configuration.
- Build output under `packages/ui/dist/`.
- Clean distribution directory before each build.
- No emission when compilation errors occur.

### Package entry point

Source entry point:

`packages/ui/src/index.ts`

Distribution entry points:

- `dist/index.js`
- `dist/index.d.ts`

The public root export is `@rittick/ui`.

The initial entry point is intentionally empty.
Public components and utilities will be added through
their original implementation stories.

### Package boundaries

- ESM-only distribution.
- Explicit conditional exports.
- No CommonJS distribution.
- No wildcard exports.
- No supported private deep imports.
- React and ReactDOM 19.x declared as required peers.
- No dependency on `@rittick/auth`.
- Distribution files controlled through an npm
  package allowlist.
- Publishing disabled while the package is private.

### Validation

The proposed validation commands are:

- `npm run check:workspace`
- `npm run typecheck`
- `npm run build`
- `npm run check:package`

Packed-artifact validation is required before
publishing any release.

UI-003 validation evidence will be recorded in
`DEVELOPMENT_PROGRESS.md`.

## Planned architecture — not implemented

### UI package

- React 19 component library.
- Radix-based accessible primitives.
- Brand, semantic, and visual-style tokens.
- Six visual styles:
  - Claymorphism (default).
  - Neumorphism.
  - Skeuomorphism.
  - Glassmorphism.
  - Cyberpunk.
  - Neubrutalism.
- Light, dark, and system themes.
- ThemeProvider and visual-style inheritance.
- Tailwind CSS v4 build integration.
- Compiled stylesheet at `@rittick/ui/styles.css`.
- Component documentation and Storybook.
- Unit, integration, browser, accessibility,
  and visual regression tests.

### Authentication package

The independently versioned `@rittick/auth` package
will provide explicit entry points:

- `@rittick/auth/core`
- `@rittick/auth/backend`
- `@rittick/auth/frontend`
- Optional persistence adapter subpaths.

Authentication implementation remains governed by
the accepted authentication ADRs.

### Release infrastructure

Not yet implemented:

- CI compatibility matrix.
- Changesets and independent release workflows.
- Trusted npm publishing.
- Full packed-consumer release validation.
- Production release automation.

No package is approved for publication at this stage.
