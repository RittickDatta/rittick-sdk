# Rittick development recovery checkpoint

## Project baseline

- Repository: https://github.com/RittickDatta/rittick-sdk
- Default branch: `main`
- Master roadmap: **195 original stories**
- Completed: **4**
- Verified (awaiting completion): **0**
- In progress: **0**
- Blocked: **0**
- Planned: **191**
- Overall completion: **2.05%**
- Accepted ADRs: ADR-001 through ADR-011.
- Last completed story: `UI-004`
- Current active story: None.
- Next eligible story: `UI-005`
- Latest verified merge: `82f8aeaefca2c577c862150bd09c731e5ce93a2f`

---

## UI-001 — Initialize repository and npm project

**Status: Completed**

**Completion date:** 2026-11-21

### Git evidence

- Implementation: `a95ff8987d78ce9bd5889f0a8ab1420bb14123b4`
- Initial documentation checkpoint: `db5daa7c592a42849906c9fd238258e09f7b18c9`
- Completion evidence: `9d72c82870b9f057dba42aedcffb9968ed9ab981`
- Final reconciliation: `cd19591b84a16f3346199bf96d5d9ba484eed0fb`

### Implemented scope

- Private ESM npm workspace.
- Root npm workspace configuration.
- Root package manifest and lockfile.
- Private `@rittick/ui` workspace placeholder.
- Workspace validation script.
- Architecture and progress documentation.
- Accepted ADR records.

### Local validation evidence

Date: 2026-11-21.

- Node.js: `v24.16.0`.
- npm: `12.2.0`.
- `git pull` — already up to date.
- `npm ci` — PASS.
- `npm run check:workspace` — PASS.
- Output: `UI-001 workspace checks passed`.

Repository contents and commits were verified through GitHub.

GitHub Actions CI was not independently verified.

**Final lifecycle status: Completed.**

---

## UI-002 — Configure strict TypeScript

**Status: Completed**

**Completion date:** 2026-11-21

### Prerequisites

- [x] UI-001 completed.
- [x] npm workspace available.
- [x] UI package placeholder available.
- [x] Relevant ADR-001 requirements reviewed.

### Git evidence

- Feature branch: `2/rittick-sdk/ui/configure-strict-typescript`
- Implementation: `8f48a7122a2ea409cc1e0ae0e98b92ba241f45a8`
- Implementation message: `chore(ui): configure strict TypeScript (UI-002)`
- Verification documentation: `3b1822692a7b2a5b2794b3527208948e0de7d7a2`
- Merge commit: `bf6fa37344fde17b276b934174e5ab3081c45b49`
- Completion documentation: `14d12fca554600663cc9bf266b1c3b167beb2517`
- Conflict resolution: `7ef638013086dc065025eaf11c25e9a2fddb13ae`
- Pull request: https://github.com/RittickDatta/rittick-sdk/pull/1

### Files changed

- `package.json` — pinned TypeScript and added typecheck command.
- `package-lock.json` — updated dependency lockfile.
- `tsconfig.base.json` — shared strict compiler configuration.
- `packages/ui/tsconfig.json` — UI-specific compiler configuration.
- `packages/ui/src/typecheck.ts` — temporary compilation sentinel.
- `PROGRESS.md` — implementation and completion status.
- `DEVELOPMENT_PROGRESS.md` — recovery and validation evidence.

### Architecture decisions

- TypeScript 5.8+ within major version 5.
- Exact installed version: `5.9.3`.
- ES2022 target.
- ESNext modules.
- Bundler module resolution for UI typechecking.
- React JSX transform.
- Strict compiler checking.
- No JavaScript emission during typechecking.

Configured strictness includes:

- `strict`
- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `noImplicitOverride`
- `noFallthroughCasesInSwitch`
- `noUnusedLocals`
- `noUnusedParameters`
- `isolatedModules`
- `verbatimModuleSyntax`
- `forceConsistentCasingInFileNames`

The shared configuration is not a final backend compilation contract.

No accepted ADR amendment was required.

### Local verification evidence

Date: 2026-11-21.

Environment:

- Git Bash / MINGW64.
- npm: `12.2.0`.
- TypeScript: `5.9.3`, confirmed by the user.

Commands and observed results:

- `git pull` — already up to date.
- `npm ci` — PASS; added 2 packages in 1s.
- `npm run check:workspace` — PASS.
- `npm run typecheck` — PASS; no compiler errors.
- `git status -sb` — clean working tree.
- TypeScript version confirmed by user.

The initial mistyped `pm ci` command failed before the corrected `npm ci` command passed.

The command `npm tsc --version` reported npm 12.2.0 rather than the compiler version. TypeScript was subsequently confirmed separately.

### GitHub verification

The implementation and verification documentation commits were verified.

PR #1 was merged into main.

At the initial merge inspection, the feature branch was zero commits ahead and one commit behind main.

Completion documentation was subsequently pushed.

A documentation merge conflict was resolved and pushed.

### Acceptance checklist

- [x] Prerequisites verified.
- [x] TypeScript dependency pinned.
- [x] Compiler version requirement satisfied.
- [x] Shared strict configuration created.
- [x] UI-specific configuration created.
- [x] Compilation sentinel created.
- [x] Root typecheck script added.
- [x] Lockfile updated.
- [x] Clean installation passed.
- [x] Workspace check passed.
- [x] Strict typecheck passed.
- [x] Implementation committed and pushed.
- [x] GitHub implementation verified.
- [x] Verification documentation committed.
- [x] Pull request merged.
- [x] Completion documentation reconciled.
- [x] Documentation conflict resolved.

### Test limitations

UI-002 used an empty TypeScript module.

Actual React components, public declarations, browser tests, build tests, and packed-consumer tests were outside UI-002 scope.

GitHub Actions CI was not independently verified.

### Documentation reconciliation

The UI-002 merge-conflict resolution introduced duplicate entries in both progress documents.

The UI-003 verification checkpoint removed those duplicate entries while retaining historical evidence.

The corrected documentation was confirmed on main after PR #2 was merged.

### Risks and blockers

No outstanding UI-002 implementation or merge blocker.

**Final lifecycle status: Completed.**

---

## UI-003 — Configure library build and package exports

**Status: Completed**

**Verification date:** 2026-11-23

**Completion date:** 2026-11-23

### Prerequisites

- [x] UI-001 completed.
- [x] UI-002 completed.
- [x] Original UI-003 roadmap definition confirmed.
- [x] ADR-001 reviewed.
- [x] ADR-009 reviewed.
- [x] Existing workspace and TypeScript configuration inspected.

### Git evidence

- Feature branch: `3/rittick-sdk/ui/configure-library-build-and-package-exports`
- Starting main revision: `7ef638013086dc065025eaf11c25e9a2fddb13ae`
- Implementation: `68c5440174edebc28bedc04d1ce27d203240b4bd`
- Implementation Part 2: `409f977e053832ef03dfa0a11fb55d0ee22661f2`
- Validated local HEAD: `409f977e053832ef03dfa0a11fb55d0ee22661f2`
- Verification documentation: `3723c17b284ac3e455a7136f1361e98dc3e0152f`
- Merge commit: `ec2b5dd90cef21358c37468f5aea865e0ab705a2`
- Completion documentation: `deb40ab9fe76c377e0920259884bf71fb80db7b5`
- Pull request: https://github.com/RittickDatta/rittick-sdk/pull/2
- Merge timestamp: `2026-11-23T06:12:28Z`.

Implementation messages:

- `build(ui): configure library build and package exports (UI-003)`
- `build(ui): configure library build and package exports (UI-003) - Part 2`
- `docs(ui): record UI-003 verification and recovery checkpoint`

GitHub confirmed that both implementation commits and the verification documentation commit were incorporated into main.

Before verification documentation, the feature branch was two commits ahead, zero commits behind, with nine changed files.

The UI-003 completion documentation revision was subsequently identified as the base revision of PR #3.

### Architecture decisions

UI-003 uses the existing TypeScript compiler instead of introducing a separate JavaScript bundler.

Build configuration:

- ESM-only distribution.
- NodeNext module resolution.
- Strict compiler options inherited from UI-002.
- ES2022 target.
- JavaScript emission enabled for builds.
- Declaration generation enabled.
- Source map generation enabled.
- Inline source content in source maps.
- No emission on compilation errors.
- Clean output directory before every build.

Package configuration:

- Public root import: `@rittick/ui`.
- Runtime entry: `dist/index.js`.
- Declaration entry: `dist/index.d.ts`.
- Explicit `types` and `import` export conditions.
- No wildcard exports.
- No CommonJS distribution.
- React and ReactDOM 19.x required peers.
- CSS side-effect metadata.
- npm file allowlist restricted to `dist`.
- `private: true` retained.
- `prepack` executes the library build.

The public entry point is intentionally empty.

The stylesheet export will be introduced when the compiled stylesheet is implemented.

No accepted ADR amendment was required.

### Files changed

- `package.json` — root build and package validation commands.
- `package-lock.json` — React peer dependency resolution.
- `packages/ui/package.json` — exports, peers, scripts, and distribution metadata.
- `packages/ui/tsconfig.build.json` — library build configuration.
- `packages/ui/src/index.ts` — public package entry point.
- Removed `packages/ui/src/typecheck.ts`.
- `scripts/check-ui-package.mjs` — package assertions, ESM import, and deep-import rejection.
- `.gitignore` — generated-artifact exclusions.
- `ARCHITECTURE.md` — implementation architecture.
- `PROGRESS.md` — story progress.
- `DEVELOPMENT_PROGRESS.md` — recovery checkpoint.

### Dependency evidence

| Dependency | Version |
| ---------- | ------- |
| TypeScript | 5.9.3   |
| React      | 19.3.1  |
| ReactDOM   | 19.3.1  |
| Scheduler  | 0.28.0  |

Declared React and ReactDOM peer ranges: `^19.0.0`.

### Local validation environment

Date: 2026-11-23.

- Windows Git Bash / MINGW64.
- Node.js: `v24.16.0`.
- npm: `12.2.0`.
- TypeScript: `5.9.3`.
- Validated HEAD: `409f977e053832ef03dfa0a11fb55d0ee22661f2`.

### Commands and observed results

- `node --version` — `v24.16.0`.
- `npm --version` — `12.2.0`.
- `npm ci` — PASS; added 5 packages in 1s.
- `npx tsc --version` — `Version 5.9.3`.
- `npm run check:workspace` — PASS.
- `npm run typecheck` — PASS.
- `npm run build` — PASS.
- `npm run check:package` — PASS.
- `npm pack --workspace=@rittick/ui` — PASS.
- `tar -tzf rittick-ui-0.0.0.tgz` — PASS.
- Isolated consumer installation — PASS.
- Native Node ESM import — PASS.
- `git diff --check` — PASS.
- `git status -sb` — clean working tree.
- `git rev-parse HEAD` — matched inspected implementation commit.

Package validation output:

`UI-003 package checks passed`

Packed consumer output:

`Packed ESM import passed []`

The isolated consumer installation added 4 packages, audited 5 packages, and reported zero known vulnerabilities.

The initial `npx --version` command reported the npm/npx version. The correct compiler-version command was subsequently executed.

### Packed artifact evidence

- Package: `@rittick/ui@0.0.0`
- Tarball: `rittick-ui-0.0.0.tgz`
- Packed size: 659 bytes.
- Unpacked size: 959 bytes.
- Total files: 4.
- SHA-1: `a13f283606e4a53c01425aa74a7b4f8c2c71bbe6`

| File                        | Size      |
| --------------------------- | --------- |
| `package/dist/index.d.ts`   | 11 bytes  |
| `package/dist/index.js`     | 44 bytes  |
| `package/dist/index.js.map` | 152 bytes |
| `package/package.json`      | 752 bytes |

No unexpected standalone source files, environment files, unrelated workspace files, or development scripts were included.

Source maps intentionally include inline source content.

### Acceptance checklist

- [x] Original story scope confirmed.
- [x] Prerequisites and relevant ADRs reviewed.
- [x] ESM library build configured.
- [x] JavaScript, declarations, and source maps generated.
- [x] Explicit package exports configured.
- [x] React peer dependencies configured.
- [x] Clean installation passed.
- [x] Compiler version confirmed.
- [x] Workspace validation passed.
- [x] Strict typechecking passed.
- [x] Library build passed.
- [x] Package validation passed.
- [x] Actual npm tarball generated and inspected.
- [x] Isolated consumer installation passed.
- [x] Packed ESM import passed.
- [x] Unsupported deep imports rejected.
- [x] Git diff check passed.
- [x] Working tree clean at validation.
- [x] Local HEAD matched GitHub implementation HEAD.
- [x] Implementation committed and pushed.
- [x] GitHub source review completed.
- [x] Verification documentation committed.
- [x] Pull request merged into main.
- [x] Completion documentation reconciled.

### Test limitations

- Public API is intentionally empty.
- No actual React components are tested.
- Full browser and SSR compatibility is not established.
- Packed TypeScript declaration resolution is not yet tested.
- Node.js 22 execution was not independently verified.
- Independent GitHub Actions CI was not verified.
- GitHub commit status inspection returned no individual statuses.
- The npm audit result is not a comprehensive security assessment.
- The package validation script must evolve when new exports are introduced.
- No separate post-merge execution is claimed.

Full packed-artifact consumer validation remains a mandatory release gate under ADR-001, ADR-009, and ADR-010.

### Toolchain observation

The declared package manager is npm 10.9.2.

Local validation used npm 12.2.0.

No package manager baseline change has been approved.

### Risks and blockers

No known outstanding UI-003 implementation or merge blocker.

**Final lifecycle status: Completed.**

---

## UI-004 — Configure ESLint and Prettier

**Status: Completed**

**Verification date:** 2026-11-23

**Completion date:** 2026-11-23

### Prerequisites

- [x] UI-001 completed.
- [x] UI-002 completed.
- [x] UI-003 completed.
- [x] UI workspace and strict TypeScript configuration available.
- [x] Existing library build and package validation available.

### Git evidence

Feature branch:

`4/rittick-sdk/ui/configure-eslint-and-prettier`

Starting main revision:

`deb40ab9fe76c377e0920259884bf71fb80db7b5`

Initial implementation commit:

`71cfecc7dc79f6682a289e9672a06c8c14ebecf9`

Implementation message:

`chore(ui): configure ESLint and Prettier (UI-004)`

ESLint 10 migration commit:

`f9087a30a4adcd73bc7a0bcc0975b63db7ff988e`

Migration message:

`chore(ui): finalize ESLint 10 and line-ending configuration (UI-004)`

Final implementation commit:

`2366e5bd7f2f3b909c27e42d4b05a2fb0c732fde`

Final implementation message:

`chore(ui): finalize ESLint 10 and line-ending configuration (UI-004) - Part 2`

Merge commit:

`82f8aeaefca2c577c862150bd09c731e5ce93a2f`

Pull request:

https://github.com/RittickDatta/rittick-sdk/pull/3

Merge timestamp:

`2026-11-23T07:31:51Z`

GitHub confirmed:

- All three implementation commits exist.
- PR #3 is closed and merged.
- Target branch is main.
- The merge commit exists on main.
- The feature branch is zero commits ahead and one commit behind main.
- The final ESLint configuration contains the Hooks deduplication override.
- The root manifest contains the expected exact dependency versions.
- The repository contains the new `.gitattributes` file.

Completion documentation commit:

Pending publication of this checkpoint. Record the actual SHA in a subsequent checkpoint.

### Architecture decisions

- ESLint 10 flat configuration using native `defineConfig`.
- Recommended JavaScript and TypeScript rules.
- React JSX and TSX validation.
- Official React Hooks linting.
- Explicit any rejection.
- Consistent TypeScript type imports.
- Unused variable validation.
- Node.js globals for development tooling.
- Browser globals scoped to UI source files.
- Prettier 3 formatting.
- ESLint compatibility with Prettier.
- Generated-artifact exclusions.
- Exact development dependency versions.
- Zero-warning lint validation.
- Shared EditorConfig conventions.
- Repository-level line-ending normalization.

Type-aware ESLint rules are deferred.

Strict TypeScript compilation remains a separate mandatory validation step.

No intentional public SDK API change was introduced.

### Dependency migration

The initial ESLint 9 implementation passed its functional tests.

However, npm reported ESLint 9.39.5 as unsupported.

Dependency compatibility metadata was inspected before migration.

The legacy `eslint-plugin-react` package did not declare ESLint 10 compatibility.

The implementation was migrated to ESLint 10 and `@eslint-react/eslint-plugin`.

The React Hooks plugin was upgraded to version 7.1.1.

The final dependency versions are:

| Dependency                  | Version |
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

React and ReactDOM remained at the locally resolved version 19.3.1.

Clean installation added 235 packages before migration and 162 packages after migration.

This represents 73 fewer installed packages in the observed local development environment.

### Duplicate Hooks diagnostic correction

The replacement React preset and official React Hooks plugin initially both reported conditional Hooks violations.

The final configuration disables:

`@eslint-react/rules-of-hooks`

The override applies to UI JSX and TSX files.

The following official rules remain active:

- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`

The independent `@eslint-react/use-state` warning remains enabled.

The repeated conditional Hooks probe confirmed one error, one warning, and exit code 1.

### Files changed

PR #3 contains 19 changed files.

Development tooling:

- `.editorconfig`
- `.gitattributes`
- `.prettierignore`
- `.prettierrc.json`
- `eslint.config.mjs`
- `package.json`
- `package-lock.json`

Existing package and compiler files affected by the formatting pass:

- `packages/ui/package.json`
- `packages/ui/src/index.ts`
- `packages/ui/tsconfig.build.json`
- `packages/ui/tsconfig.json`
- `tsconfig.base.json`

Existing validation scripts affected by the formatting pass:

- `scripts/check-ui-package.mjs`
- `scripts/check-workspace.mjs`

Documentation:

- `ARCHITECTURE.md`
- `PROGRESS.md`
- `DEVELOPMENT_PROGRESS.md`

ADR formatting:

- `docs/adr/ADR-002-user-identity-proposed.md`
- `docs/adr/ADR-003-session-security.md`
- `docs/adr/ADR-007-captcha-abuse-protection.md`

### ADR review

GitHub pull request patches were inspected for all three changed ADR files.

ADR-002 proposed and ADR-003 received blank lines after headings.

ADR-007 received Markdown table alignment changes.

No architectural decision text was changed.

No accepted ADR amendment was required.

### Local validation environment

Date: 2026-11-23.

- Windows Git Bash / MINGW64.
- Node.js: `v24.16.0`.
- npm: `12.2.0`.
- TypeScript: `5.9.3`.
- ESLint: `10.15.0`.
- Prettier: `3.10.1`.
- Feature branch: `4/rittick-sdk/ui/configure-eslint-and-prettier`.

The local validation screenshots show the feature branch but do not capture the final HEAD SHA.

### Commands and observed results

1. `npm ci`
   - PASS.
   - Added 162 packages after migration.
   - No deprecation warning visible in the supplied output.

2. `npm ls --depth=0`
   - Expected top-level dependencies displayed.
   - Legacy React plugin no longer displayed.

3. `npx eslint --version`
   - Output: `v10.15.0`.

4. `npx tsc --version`
   - Output: `Version 5.9.3`.

5. `npx prettier --version`
   - Output: `3.10.1`.

6. `npm run lint:fix`
   - No lint errors shown.

7. `npm run format`
   - Formatting completed.
   - Subsequent formatting check passed.

8. `npm run lint`
   - PASS.
   - Executed `eslint . --max-warnings 0`.

9. `npm run format:check`
   - PASS.
   - All matched files use Prettier code style.

10. `npm run check:workspace`
    - PASS.
    - Output: `UI-001 workspace checks passed`.

11. `npm run typecheck`
    - PASS.
    - No compiler errors shown.

12. `npm run build`
    - PASS.
    - Subsequent npm packing also completed the prepack build.

13. `npm run check:package`
    - PASS before final Hooks deduplication.
    - Output: `UI-003 package checks passed`.
    - Final repeated output after deduplication was cropped.

14. `npm pack --workspace=@rittick/ui`
    - PASS after final Hooks deduplication.

15. `tar -tzf rittick-ui-0.0.0.tgz`
    - PASS.
    - Four expected files confirmed.

### Behavior validation

#### Explicit any rejection

Input:

```typescript
export const unsafe: any = 42;
```

Observed rule:

`@typescript-eslint/no-explicit-any`

Observed exit code: `1`.

Result: PASS.

#### Conditional React Hook rejection

A component calling `useState` conditionally was submitted through ESLint stdin.

Final observed diagnostics:

- `react-hooks/rules-of-hooks` — error.
- `@eslint-react/use-state` — warning.

Observed exit code: `1`.

Result: PASS.

Duplicate ordering diagnostics were successfully eliminated.

#### Missing React list key rejection

A component rendering mapped elements without keys was submitted through ESLint stdin.

Observed rule:

`@eslint-react/no-missing-key`

Observed exit code: `1`.

Result: PASS.

#### Formatting rejection

Input:

```javascript
const value = { x: 1, y: 2 };
```

Prettier check rejected the input.

Observed exit code: `1`.

Result: PASS.

#### Formatting correction

Expected and observed output:

```javascript
const value = { x: 1, y: 2 };
```

Result: PASS.

#### Valid React component

A valid button component was submitted through ESLint stdin with zero allowed warnings.

Observed exit code: `0`.

Result: PASS.

The behavior probes used stdin rather than creating persistent source files.

### Line-ending policy

The committed `.gitattributes` file establishes:

- Automatic text detection.
- LF line endings for text files.
- CRLF exceptions for Windows batch and command scripts.
- Binary classification for selected binary asset extensions.

The user initially executed `git check-attr` without arguments.

Git reported that no attribute was specified.

The corrected command is:

```bash
git check-attr text eol -- package.json
```

Expected output:

```text
package.json: text: auto
package.json: eol: lf
```

The corrected local command output was not supplied.

The policy itself was confirmed through GitHub source inspection.

### Final packed artifact evidence

- Package: `@rittick/ui@0.0.0`
- Tarball: `rittick-ui-0.0.0.tgz`
- Packed size: 664 bytes.
- Unpacked size: 961 bytes.
- Total files: 4.
- SHA-1: `2a34411f026837344197cf8fc33b00afb912fd8b`

| File                        | Size      |
| --------------------------- | --------- |
| `package/dist/index.d.ts`   | 11 bytes  |
| `package/dist/index.js`     | 44 bytes  |
| `package/dist/index.js.map` | 155 bytes |
| `package/package.json`      | 751 bytes |

No linting or formatting configuration files were included in the observed tarball.

The package remains private and is not approved for publication.

### Acceptance checklist

- [x] Previous story prerequisites completed.
- [x] ESLint configured.
- [x] Unsupported ESLint 9 replaced.
- [x] React linting plugin replaced.
- [x] React Hooks plugin upgraded.
- [x] TypeScript version preserved.
- [x] Prettier configured.
- [x] Clean installation passed.
- [x] Lint validation passed.
- [x] Formatting validation passed.
- [x] Explicit any rejection passed.
- [x] Conditional Hooks rejection passed.
- [x] Missing list key rejection passed.
- [x] Invalid formatting rejection passed.
- [x] Formatting correction passed.
- [x] Valid React component accepted.
- [x] Duplicate Hooks diagnostics eliminated.
- [x] Previous story regression checks passed.
- [x] Final tarball generated and inspected.
- [x] Git line-ending policy committed.
- [x] ADR changes inspected.
- [x] Implementation committed and pushed.
- [x] GitHub implementation verified.
- [x] Pull request merged into main.
- [ ] Completion documentation publication verified.

### Verification limitations

- Node.js 22 execution has not been verified.
- Node.js 22 development requires at least version 22.13.0 for ESLint 10.
- The root manifest still declares `^22 || ^24`; the development minimum is documented separately.
- Local npm 12.2.0 differs from the declared npm 10.9.2 baseline.
- Independent GitHub Actions CI was not verified.
- GitHub combined status was pending with zero individual statuses.
- Final local Git whitespace and attribute-check outputs were not supplied.
- The final package-check output after Hooks deduplication was cropped.
- The local validation screenshots do not explicitly establish the final implementation SHA.
- No independent post-merge execution is claimed.
- Type-aware ESLint rules remain deferred.
- Full browser, SSR, accessibility, and release-matrix testing remain future gates.

### Risks and blockers

No known functional implementation blocker remains.

The development Node.js minimum and npm baseline must be considered when establishing reproducible CI.

The final completion documentation must be committed and verified before beginning UI-005.

### Lifecycle decision

UI-004 implementation and merge were verified through GitHub.

The supplied local evidence establishes the intended linting and formatting behavior.

**Final lifecycle status: Completed upon publication of this checkpoint.**

UI-004 contributes one completed original story to the master roadmap.

Total completed original stories: **4**.

Remaining planned stories: **191**.

---

## Recovery instructions

### Resume from the completed UI-004 baseline

From an existing local checkout:

```bash
git switch main
git pull --ff-only origin main
git status -sb
git log -5 --oneline

npm ci
npm ls --depth=0

node --version
npm --version
npx tsc --version
npx eslint --version
npx prettier --version

npm run lint
npm run format:check
npm run check:workspace
npm run typecheck
npm run build
npm run check:package

git check-attr text eol -- package.json
git diff --check
```

Expected versions:

- TypeScript: `5.9.3`
- ESLint: `10.15.0`
- Prettier: `3.10.1`

Expected validation output:

- `UI-001 workspace checks passed`
- `UI-003 package checks passed`

### Repeat package inspection

```bash
npm pack --workspace=@rittick/ui
tar -tzf rittick-ui-0.0.0.tgz
```

Expected contents:

- `package/package.json`
- `package/dist/index.js`
- `package/dist/index.d.ts`
- `package/dist/index.js.map`

### Repeat isolated packed consumer validation

Run from the repository root using Git Bash:

```bash
(
  set -e

  TARBALL="$PWD/rittick-ui-0.0.0.tgz"
  CONSUMER_DIR="$(mktemp -d)"

  trap 'rm -rf "$CONSUMER_DIR"' EXIT

  cd "$CONSUMER_DIR"

  npm init -y
  npm install "$TARBALL"

  node --input-type=module -e \
    "import * as ui from '@rittick/ui'; console.log('Packed ESM import passed', Object.keys(ui));"
)
```

Expected output:

`Packed ESM import passed []`

Remove the generated archive after validation:

```bash
rm -f rittick-ui-0.0.0.tgz
```

Recovery commands are instructions, not claims of additional execution.

### Recovery reference documents

Review:

- `ARCHITECTURE.md`
- `PROGRESS.md`
- `DEVELOPMENT_PROGRESS.md`
- Original 195-story master roadmap.
- Relevant accepted ADRs.
- Latest GitHub commits and pull requests.

Investigate and record any validation failure before starting the next story.

---

## Story branch and documentation workflow

For every new story:

1. Synchronize local main with origin/main.
2. Create a dedicated feature branch.
3. Implement only the approved story scope.
4. Execute relevant acceptance tests.
5. Commit and push implementation.
6. Verify implementation through GitHub.
7. Update progress and architecture documentation on the same feature branch.
8. Review the documentation diff.
9. Synchronize with main if it has changed.
10. Merge through a pull request.
11. Verify the merged revision.
12. Reconcile final completion status.
13. Synchronize local main before starting the next story.

If implementation has already been merged before documentation reconciliation, create the completion checkpoint from the latest main.

Use the latest repository documentation as the source of truth.

Preserve historical evidence and avoid duplicate sections.

Never resolve documentation conflicts by blindly retaining both conflicting copies.

Do not start a new story branch from an outdated main revision.

## Next story

**UI-005 — Configure Vitest and React Testing Library**

Prerequisites:

- UI-001 completed.
- UI-002 completed.
- UI-003 completed.
- UI-004 completed.
- UI-004 completion documentation committed and verified.
- Latest main synchronized.

Review the original roadmap, accepted ADRs, and current repository configuration before implementation.

## Mandatory checkpoint for every future story

Record:

- Story ID and lifecycle status.
- Verified prerequisites.
- Repository and branch.
- Actual implementation commit SHA.
- Files added, modified, or removed.
- Commands actually executed.
- Test outcomes and evidence.
- Acceptance results.
- Blockers and risks.
- Architecture and ADR implications.
- Git commit, push, merge, and CI evidence.
- Recovery and resume commands.
- Next eligible story.

After every story, provide complete copy-ready contents of:

1. `PROGRESS.md`
2. `DEVELOPMENT_PROGRESS.md`

Update `ARCHITECTURE.md` whenever implemented architecture changes.

Only completed original story IDs count toward the 195-story roadmap.

Never invent commits, tests, results, or implemented files.

Never store secrets or credentials.
