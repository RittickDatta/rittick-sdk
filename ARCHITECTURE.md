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

Status: Completed.

- Private ESM npm workspace root.
- npm workspaces under `packages/*`.
- Private `@rittick/ui` workspace package.
- Root dependency lockfile.
- Node.js 22.x and 24.x compatibility baseline.
- Workspace validation command.

### TypeScript foundation — UI-002

Status: Completed.

- TypeScript 5.9.3 pinned as a development dependency.
- Shared strict TypeScript configuration.
- UI-specific TypeScript configuration.
- ES2022 language target.
- React JSX transform configuration.
- Bundler-oriented UI typechecking.
- Root typecheck command.

### Library build and package exports — UI-003

Status: Completed.

Implemented, technically verified, and merged into main
on 2026-11-23 through pull request #2.

Merge commit:

`ec2b5dd90cef21358c37468f5aea865e0ab705a2`

Final completion documentation:

`deb40ab9fe76c377e0920259884bf71fb80db7b5`

#### Library build

The library uses the existing TypeScript compiler to
generate ESM JavaScript, TypeScript declarations, and
JavaScript source maps.

Build configuration:

- `packages/ui/tsconfig.build.json`
- NodeNext module and module resolution settings.
- Strict compiler options inherited from UI-002.
- Build output under `packages/ui/dist/`.
- Clean distribution directory before every build.
- No emission when compilation errors occur.
- Declaration generation.
- Source maps with inline source content.

The build is invoked from the repository root:

`npm run build`

The package also builds automatically before npm packing.

#### Package entry point

Source entry point:

`packages/ui/src/index.ts`

Distribution entry points:

- `dist/index.js`
- `dist/index.d.ts`
- `dist/index.js.map`

The public root export is:

`@rittick/ui`

The current entry point is intentionally empty.

Public components and utilities will be introduced
through their original implementation stories.

#### Package boundaries

- ESM-only distribution.
- Explicit conditional exports.
- Matching JavaScript and declaration entry points.
- No CommonJS distribution.
- No wildcard exports.
- No supported private deep imports.
- React and ReactDOM 19.x required peers.
- No dependency on `@rittick/auth`.
- Distribution files controlled through an npm
  package allowlist.
- CSS side-effect metadata configured.
- Publishing disabled through `private: true`.

The stylesheet export is not yet implemented.

#### Validation

Implemented validation commands:

- `npm run check:workspace`
- `npm run typecheck`
- `npm run build`
- `npm run check:package`

Local validation on Node.js 24.16.0 passed before merge.

The actual npm tarball was generated and inspected.

The tarball was successfully installed in an isolated
consumer outside the source workspace.

Native Node ESM import passed.

The validated packed artifact contains:

- `package.json`
- `dist/index.js`
- `dist/index.d.ts`
- `dist/index.js.map`

The current package validation script is specific to
the bootstrap public API and distribution layout.

It must evolve when components, utilities, and
additional assets are introduced.

Full React, SSR, browser, TypeScript consumer, and
Node.js compatibility-matrix validation remain
mandatory future release gates.

### Code quality tooling — UI-004

Status: Implementation verified and merged.

Completion documentation is reconciled through this
checkpoint.

Merged into main on 2026-11-23 through pull request #3.

Final implementation commit:

`2366e5bd7f2f3b909c27e42d4b05a2fb0c732fde`

Merge commit:

`82f8aeaefca2c577c862150bd09c731e5ce93a2f`

#### Configuration files

- `eslint.config.mjs`
- `.prettierrc.json`
- `.prettierignore`
- `.editorconfig`
- `.gitattributes`

#### Linting architecture

UI-004 establishes shared repository-level development
tooling for JavaScript, TypeScript, and React source code.

Implemented capabilities:

- ESLint 10 flat configuration using native `defineConfig`.
- Recommended JavaScript linting rules.
- Recommended TypeScript linting rules.
- Explicit any rejection.
- Consistent TypeScript type imports.
- Unused variable validation.
- React validation using `@eslint-react/eslint-plugin`.
- Separate JavaScript JSX and TypeScript JSX presets.
- React Hooks validation across UI source files.
- Explicit Node.js globals for development tooling.
- Browser globals scoped to UI source files.
- Generated-artifact exclusions.
- Exact development dependency versions.
- ESLint and Prettier compatibility configuration.

The official `eslint-plugin-react-hooks` plugin is
responsible for Hooks ordering and dependency validation.

The duplicate `@eslint-react/rules-of-hooks` rule is
disabled for UI JSX and TSX files.

Other React plugin diagnostics remain enabled.

Type-aware ESLint rules are not enabled at this stage.

Strict TypeScript compilation remains a separate
mandatory validation step.

Future authentication packages will receive their own
environment-specific linting configuration.

#### Dependency baseline

| Development dependency      | Version |
| --------------------------- | ------- |
| eslint                      | 10.15.0 |
| @eslint/js                  | 10.0.1  |
| @eslint-react/eslint-plugin | 5.30.6  |
| eslint-plugin-react-hooks   | 7.1.1   |
| eslint-config-prettier      | 10.1.8  |
| typescript-eslint           | 8.73.0  |
| prettier                    | 3.10.1  |
| globals                     | 16.5.0  |
| typescript                  | 5.9.3   |

The initial ESLint 9 implementation passed functional
validation but was replaced after npm reported that
the version was unsupported.

The legacy React linting plugin was replaced because
its declared peer dependency range did not include
ESLint 10.

The development tooling remains a root-level concern
and does not introduce new public SDK APIs.

#### Formatting architecture

Linting and formatting are separate responsibilities.

Prettier controls source formatting.

Formatting conventions:

- Two-space indentation.
- Double quotes.
- Semicolons.
- Trailing commas where supported.
- Preferred line width of 100 characters.
- LF line endings.
- Parenthesized arrow function parameters.

Generated artifacts, npm lockfiles, and environment
files are excluded from Prettier formatting.

EditorConfig provides shared editor conventions.

#### Repository line-ending policy

The `.gitattributes` configuration establishes:

- Automatic text detection.
- LF line endings for text files.
- CRLF exceptions for Windows batch and command scripts.
- Binary classification for selected binary asset types.

This policy reduces cross-platform line-ending
differences but does not eliminate semantic merge
conflicts.

#### Development commands

- `npm run lint`
- `npm run lint:fix`
- `npm run format`
- `npm run format:check`

Lint validation treats warnings as failures.

Formatting validation is separate from automatic
formatting correction.

#### Validation

The final ESLint 10 toolchain passed local installation,
linting, and formatting validation.

Behavior tests confirmed:

- Explicit any rejection.
- Conditional React Hook rejection.
- Missing React list key rejection.
- Incorrect formatting rejection.
- Automatic formatting correction.
- Valid React component acceptance.
- Duplicate Hooks diagnostic removal.

Previous workspace, TypeScript, build, and package
validation checks passed during the migration.

The final tarball retained the four expected
distribution files.

No development tooling configuration was included in
the observed package artifact.

GitHub source inspection confirmed the final ESLint
configuration, pinned development dependencies, and
repository line-ending policy.

Independent CI execution and Node.js 22 validation
remain unverified.

See `DEVELOPMENT_PROGRESS.md` for detailed evidence
and verification limitations.

#### ADR integrity

Formatting changes to ADR-002 proposed, ADR-003, and
ADR-007 were reviewed through GitHub pull request
patches.

No architectural decision text was changed.

No accepted ADR amendment was required.

## Toolchain baseline

### Package runtime compatibility

- Supported Node.js release lines: 22.x and 24.x.
- TypeScript development version: 5.9.3.
- React and ReactDOM peer range: 19.x.
- ESM-only package distribution.

The approved package runtime compatibility policy
remains unchanged.

### Development environment

The ESLint 10 development toolchain requires:

- Node.js 22.13.0 or later within the Node.js 22 line.
- Or Node.js 24.x under the approved SDK policy.

The root manifest currently declares `^22 || ^24`.

The stricter development minimum is documented here
but is not yet enforced by that root engine range.

Node.js 22 execution compatibility must be validated
when establishing the CI compatibility matrix.

Declared npm package manager:

`npm@10.9.2`

The local UI-003 and UI-004 validation environments
used npm 12.2.0.

The declared npm baseline remains unchanged.

Reproducible CI and release environments must enforce
the approved toolchain.

## Planned architecture — not implemented

### Development tooling

- Vitest and React Testing Library.
- Storybook.
- Automated accessibility testing.
- Browser and visual regression testing.
- Type-aware ESLint rules where appropriate.

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
- Component documentation.
- Full React and SSR consumer applications.

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
