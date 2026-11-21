# ADR-009: Runtime Compatibility, Builds and Publishing

- **Status:** Accepted
- **Date:** 2026-10-31
- **Packages:** `@rittick/ui`, `@rittick/auth`
- **Related:** ADR-001, ADR-008; ADR-010 will specify detailed testing gates.

## Context

The Rittick packages must be independently consumable, framework-boundary-safe, secure to publish, and reliable as npm tarballs rather than only as monorepo source. The auth package exposes framework-neutral, backend, frontend, and optional persistence-adapter entry points. The UI package distributes precompiled CSS without requiring Tailwind in consumers.

## Decision

### 1. Runtime and language baseline

- ESM-only packages; no CommonJS distribution or compatibility promise.
- Support Node.js 22.x and 24.x LTS (`engines` equivalent to `^22.0.0 || ^24.0.0`). Test both.
- React and ReactDOM 19.x where applicable; Express 5.x for backend integration.
- Strict TypeScript, initial supported compiler range TypeScript 5.8+ within major version 5.
- Tailwind CSS v4 is a UI build-time dependency, not a required consumer build tool.
- Document supported modern browser targets and verify browser/SSR compatibility.
- Changes to this baseline require a superseding ADR or explicit revision of ADR-001.

### 2. Public exports and resolution

- Explicit ESM export maps with matching declaration files for each public entry point; no wildcard exports exposing private files or supported private deep imports.
- `@rittick/ui` exposes the component API and `@rittick/ui/styles.css`.
- `@rittick/auth` exposes `/core`, `/backend`, `/frontend`, and explicitly declared optional `/adapters/*` paths as they are implemented. No mandatory root auth export.
- `/core` must not import React, Express, database drivers, or Node-only APIs; `/frontend` must not pull backend-only dependencies into browser bundles; optional adapter imports must be isolated.
- Test exports, declaration resolution, and ESM relative imports under NodeNext and bundler module resolution, including browser-oriented bundling of `/core`.

### 3. Peer dependencies and optional integrations

- React/ReactDOM 19 are peers where required and must never be bundled as duplicate runtimes.
- Express 5 and adapter-specific dependencies are required only by the corresponding integrations. Because npm peer metadata is package-wide, use optional peer metadata as necessary to avoid forcing unrelated dependencies on core-only consumers; document per-subpath installation requirements.
- Importing an unrelated subpath must not eagerly resolve optional frameworks or database packages.
- Verify actual installation behavior in clean consumers, not only static import graphs.

### 4. CSS assets

- Publish a single precompiled, scoped `@rittick/ui/styles.css`, explicitly imported by consumers.
- Export the stylesheet and mark CSS files as side effects to prevent incorrect tree-shaking.
- Do not inject CSS implicitly at runtime, require consumer Tailwind configuration, or ship a global Tailwind Preflight reset.
- Validate CSS presence, scope, import resolution, and styles in the packed artifact.

### 5. Reproducible build and artifact identity

- Commit a lockfile, pin the package manager and build toolchain, and use clean locked installations in CI.
- Generate declarations and distributions deterministically where practical; inspect manifests and package file allowlists.
- Run release validation against the actual `npm pack` output. Publish that tested artifact or verify identical artifact contents and integrity if the publishing mechanism repackages it.
- Fail release if expected exports/assets are missing, secrets or unrelated files are present, or build output differs unexpectedly.

### 6. Versioning and release process

- Independent SemVer versions and Changesets for `@rittick/ui` and `@rittick/auth`; dependencies between them must be updated consistently.
- Protect release branches and require reviewed release changes and successful CI gates.
- Prefer npm trusted publishing with OIDC and provenance where supported; avoid routine long-lived automation tokens.
- Restrict workflow permissions, publishing identities and secrets to least privilege. Untrusted pull requests cannot invoke privileged publishing.
- Validate package name, organization scope, version, provenance settings, export map, dependency metadata, contents and integrity before publication.
- Use vulnerability scanning, dependency review and supply-chain checks without treating scanner results as substitutes for review.

### 7. Rollback and remediation

- Published versions are immutable; never overwrite a released version.
- Prefer patch-forward corrective releases and actionable deprecation messages for defective versions.
- Use unpublishing only exceptionally under registry policy, not as normal rollback.
- For security incidents, publish affected-version information, mitigation, advisories and migration guidance. Document the maintenance policy for supported versions.

### 8. Mandatory packed-artifact consumer gates

Every release must validate clean installations and builds using the packed tarballs in at least:

1. React 19 Vite SPA: public components, CSS, tree-shaking and no duplicate React.
2. React 19 SSR: server imports, rendering, hydration and absence of browser globals during module evaluation.
3. Node ESM + Express 5: `/backend` initialization and middleware imports.
4. Framework-neutral Node ESM: `/core` without React or Express, plus browser-oriented core bundling.
5. Prisma and MongoDB consumers for implemented optional adapters, with adapter dependency isolation.
6. TypeScript NodeNext and bundler resolution: types and runtime export parity.
7. Tarball checks: CSS assets, export targets, package side effects, no secrets, no unexpected files, and no unsupported deep-import reliance.

Any failed mandatory gate blocks publication. ADR-010 will define the detailed test pyramid, security and concurrency checks, and release thresholds.

## Security and architectural invariants

- A core-only installation does not require unrelated frameworks or drivers.
- Public export maps are authoritative; private paths are not compatibility promises.
- Browser bundles do not import backend-only modules, and React is not duplicated.
- The artifact published is the artifact tested, or its identity is cryptographically verified.
- Missing declarations, broken consumers, exposed secrets, missing CSS or unresolved security failures block release.

## Consequences

**Benefits:** predictable consumption, smaller integration surfaces, safe optional dependencies, repeatable releases, and stronger supply-chain assurance.

**Costs:** more packaging metadata, CI matrix maintenance, adapter isolation work and stricter release operations.

## Deferred implementation details

Exact build tooling, CI service, browser target list, artifact hash comparison mechanism, numerical bundle-size budgets and optional-adapter implementation order are implementation choices constrained by this ADR. They are not permission to weaken the accepted invariants.

## Acceptance

This ADR is **Accepted** on 2026-10-31. No implementation has started. The master roadmap remains at 195 stories.
