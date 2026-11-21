# ADR-001: Package Architecture, ESM Distribution, and Consumer Compatibility

- **Status:** Accepted
- **Decision date:** 2026-10-31
- **Scope:** `@rittick/ui`, `@rittick/auth`
- **Supersedes:** None
- **Roadmap:** Existing 195 stories unchanged; implement requirements in relevant foundation/build/testing stories.

## Context

Rittick will publish an independent React design system and a reusable authentication package with framework-independent core, Express backend, and React frontend entry points. Consumers must be able to install only the integrations they use, with predictable runtime and styling behavior. Authentication uses each application's database rather than a centralized auth service.

## Decision

### 1. Package layout and dependency boundaries

- Publish **two independently versioned npm packages**: `@rittick/ui` and `@rittick/auth`.
- `@rittick/ui` is independent of `@rittick/auth`.
- `@rittick/auth` exposes only `./core`, `./backend`, and `./frontend` as primary public entry points, plus explicit optional adapter subpaths (for example `./adapters/prisma`, `./adapters/mongodb`) when implemented. No wildcard exports or unsupported root import.
- Core contains portable contracts, schemas, policies and shared algorithms. It does not import React, Express, Node-only modules, native password hashers or database clients. Backend and frontend may import core, but not each other.
- Backend implements Express-specific integration and owns server-only cryptography, sessions, authorization enforcement, and persistence coordination. Frontend implements React integrations and composes `@rittick/ui`; frontend must not import server-only code.
- No central authentication service or mandatory shared database. Consuming applications own their identity/session/role data through adapters.

### 2. Module and TypeScript distribution

- **ESM-only** for both packages (`"type": "module"`); do not ship CommonJS.
- Publish JavaScript, TypeScript declarations, source maps where useful, and explicit conditional `exports` (`types` and `import`). Use Node-compatible `.js` extensions in emitted relative backend imports.
- Keep internal modules private. Tree-shaking and package isolation must be validated with packed artifacts.
- Use strict TypeScript, with TypeScript **5.8+ within major version 5** as initial development baseline, revisited at implementation and tested against supported compiler versions. This is a tooling baseline, not an assertion that consumers must install TypeScript at runtime.

### 3. Runtime compatibility baseline

- **React and React DOM 19.x only** for UI and auth frontend.
- **Node.js 22.x and 24.x LTS** for backend, publishing and supported Node consumers; test both. Set `engines.node` to `>=22 <25` initially, noting that this numerical range also includes Node 23; CI support is explicitly limited to 22 and 24. If strict exclusion is needed, use `^22 || ^24`.
- **Express 5.x** for auth backend.
- Tailwind CSS **4.x** is a UI build-time tool, not a required dependency for applications consuming compiled UI CSS.
- Modern evergreen browsers for UI/auth frontend; precise browser matrix to be established in CI.
- Revisit runtime support via a new ADR when lifecycle or security requirements change.

### 4. Dependencies and optional integrations

- UI declares `react` and `react-dom` as required peers; Radix and Lucide may be regular runtime dependencies when directly used, with versions pinned/managed by the library.
- Auth declares `react`, `react-dom`, `@rittick/ui`, and `express` as **optional peers** at package level, so unrelated subpaths do not require them. Each relevant subpath requires the corresponding peer at runtime and documents it explicitly.
- Database-specific adapters are exported as **optional dedicated subpaths inside `@rittick/auth`**. Their driver/ORM peers are optional and must not be imported by core, backend base entry point, or unrelated adapters. Validate npm package-manager behavior; if peer metadata, size, or isolation becomes problematic, reconsider companion packages in a future ADR.
- Auth frontend must declare a tested compatible peer range of `@rittick/ui`. Avoid bundling React or duplicating the UI package.

### 5. CSS and visual styling

- UI ships a compiled stylesheet available at `@rittick/ui/styles.css`; importing it must not require consumer-side Tailwind compilation.
- Publish `sideEffects` metadata preserving CSS imports during bundling.
- Do not inject an uncontrolled global reset. Expose documented semantic brand tokens and theme variables; Claymorphism is the default visual style, with other agreed styles implemented through appearance recipes and per-component overrides.
- Portal-based components must inherit the effective theme and visual style; validate SSR/hydration and reduced-motion behavior.

### 6. Release management

- Independently version `@rittick/ui` and `@rittick/auth` using SemVer and Changesets; no lockstep releases.
- Use prerelease npm tags and explicit compatibility matrices. Breaking UI changes must be tested against auth frontend before publishing compatible auth versions.
- Publish only packed, inspected artifacts; no secrets, accidental private source exports, or unbuilt imports.

### 7. Consumer validation (mandatory release gate)

Install `npm pack` tarballs into clean applications, not source-linked workspaces, and validate:

1. **React + Vite:** UI, compiled CSS, themes, auth frontend, TypeScript, no consumer Tailwind requirement.
2. **React SSR application:** server rendering, hydration, portals, CSS integration, and no premature browser-global access.
3. **Native Node ESM + Express 5:** backend imports and runs without bundlers, React, or frontend UI installed.
4. **Framework-independent Node ESM:** core imports without React, Express, database drivers, or backend crypto implementation.
5. **Optional adapter isolation:** each adapter resolves with its documented optional peers, and unused adapters do not load their drivers.

Also verify public `exports`/types, dependency duplication, no Node-only code in frontend bundles, security-sensitive package contents, supported Node 22/24 and React 19 combinations, and expected errors for unsupported imports.

## Consequences

**Benefits:** Clear dependency direction; modern ESM packaging; independently reusable UI; application-owned authentication storage; predictable consumer installs; controlled release compatibility.

**Tradeoffs:** No legacy CommonJS or React 18 support; optional peers are package-wide metadata despite subpath isolation; supporting multiple database adapters and Node LTS lines adds CI work; compiled CSS needs careful isolation to avoid global conflicts.

## Validation and implementation mapping

- UI-001–UI-015C: repository/build/export/style/consumer validation foundations.
- AUTH-001–AUTH-002 and AUTH-015: package boundaries and subpath exports.
- AUTH-030–AUTH-031 and associated adapter tests: optional database adapters.
- AUTH-035 and AUTH-046: clean backend/frontend consumers, integration examples and release validation.
- CI release gates are mandatory before any stable npm publish.

## Explicitly deferred to later ADRs

- ADR-002: identity and identifier lifecycle.
- ADR-003: session cookies, CSRF and deployment topology.
- ADR-004: adapter transaction semantics.
- ADR-005: RBAC scope and privilege assignment.
- ADR-008: detailed design-token and visual-style contracts.
- ADR-009/010: exact tooling matrix, CI implementation and release security checks.

## Approval

Accepted by project owner on 2026-10-31: ESM-only; React 19.x; Node 22.x/24.x LTS; optional dedicated database adapter subpaths within `@rittick/auth`; dependency boundaries, compiled CSS, explicit exports, independent versions, and packed consumer validation as specified above.
