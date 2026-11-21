# ADR-010: Testing, Security and Release Gates

- **Status:** Accepted
- **Date:** 2026-10-31
- **Applies to:** `@rittick/ui`, `@rittick/auth`, official persistence adapters, and published artifacts
- **Depends on:** ADR-001 through ADR-009

## Context

The Rittick packages must provide reliable React UI components and security-sensitive authentication primitives across multiple runtimes and consumer applications. Passing tests inside the monorepo alone cannot demonstrate published-package correctness, database concurrency safety, accessibility, or resistance to security regressions. This ADR establishes enforceable test and release requirements.

## Decision

### 1. Test layers

Maintain unit, integration, browser end-to-end, security, concurrency/fault-injection, visual-regression, accessibility, and clean packed-consumer tests. Use Vitest and React Testing Library for appropriate UI tests; Playwright for browser, accessibility automation and visual tests; and actual database deployments for adapter integration. Mock providers and repositories where appropriate for unit testing, but never substitute mocks for transactional guarantees.

### 2. Coverage and invariant requirements

- Enforce at least **80% line and 80% branch coverage** separately for each applicable general package; `@rittick/auth/core` requires **90% line and 90% branch coverage**.
- Document exclusions for generated code, declarations, fixtures and third-party sources. Do not pool unrelated package coverage to conceal deficiencies.
- For all security-critical code, explicitly enumerate and test applicable invariants with positive, negative, boundary, failure and concurrency cases; numerical coverage is not a substitute.
- Changed critical paths must include targeted regression tests, and coverage must not fall below thresholds.

### 3. Mandatory security invariants

Release-blocking tests must cover, where applicable:

- Registration ownership races, bounded pending claims, verification requirements, and identifier changes.
- OTP and recovery-code expiration, single use, attempt exhaustion, replay and concurrent consumption.
- Session creation, fixation resistance, CSRF/origin protections, rotation, idle/absolute expiry, logout and cross-instance revocation.
- Tenant/resource isolation, permission denial, role delegation bounds, concurrent privilege revocation and last-administrator protection.
- CAPTCHA verification, action/hostname mismatch, replay, outage fail-closed behavior, risk authority and distributed rate limiting.
- MFA/TOTP replay protection and lost-factor recovery assurance.
- Transactional atomicity of privileged mutations, authorization versions, authoritative audit events, identifier ownership, and outbox state; safe recovery after ambiguous commits.
- No unexpected secrets or backend-only code in browser bundles.

**No release waiver, quarantine, or retry-based clearance is permitted for a failed or unverified security invariant.**

### 4. Real database and concurrency gates

Run official adapter contract tests against real PostgreSQL/Prisma and MongoDB deployments. MongoDB tests require a transaction-capable replica set or sharded cluster, appropriate unique indexes and majority durability; standalone MongoDB is insufficient. Exercise parallel transactions, contention, retries, rollback, crash/fault injection, uncertain commit acknowledgments, and outbox redelivery. Verify that revoked sessions cannot resurrect, OTPs cannot be double-consumed, claims cannot produce duplicate committed ownership, and audit failure prevents privileged mutation. Every officially supported adapter must pass before its release.

### 5. Test data and secret safety

Use synthetic users, organizations and identifiers; test-only encryption keys, session secrets, TOTP seeds and recovery material; deterministic clocks and controlled OTP generation; fake email/SMS/CAPTCHA providers for most CI; and isolated ephemeral data stores. Provider-specific integration tests must not require production credentials. Redact passwords, cookies, OTPs, CAPTCHA tokens, recovery codes and other secrets from logs, traces, screenshots and artifacts. Test-only bypasses must not be exposed or enabled in production distributions.

### 6. Browser, accessibility and visual quality

- Use Playwright in Chromium, Firefox and WebKit for representative browser flows.
- Maintain visual snapshots for all six visual styles in both light and dark modes, including representative hover, focus, disabled, error and loading states; cover reduced motion and forced colors.
- Use axe-core/Playwright automated accessibility checks plus manual keyboard and representative assistive-technology reviews for complex controls.
- Treat known supported-component accessibility regressions, especially keyboard operation, semantics and focus visibility, as release blockers. Automated tools do not alone prove WCAG 2.2 AA conformance.
- Test React 19 SSR, hydration, nested themes, portaled content and theme preference behavior.

### 7. CI and compatibility matrix

Use tiered execution: fast required PR checks, fuller main-branch suites, and a complete mandatory release-candidate suite. A release candidate must have passing results tied to its exact source commit and packed artifact. The release suite covers Node 22 and 24; React 19 SPA and SSR; Express 5; framework-neutral ESM core; official PostgreSQL and MongoDB adapters; TypeScript NodeNext and bundler resolution; browser matrix; CSS inclusion and isolation; tree-shaking; dependency boundaries; and package exports/types. Install actual `npm pack` tarballs in clean consumer fixtures, not workspace-linked packages. Typecheck, lint, tests, packaging, security and compatibility gates all pass before publishing.

### 8. Flaky tests and exceptions

A retry does not erase the initial failure; preserve evidence and investigate. Security and concurrency correctness tests cannot be quarantined or bypassed for release. Confirmed non-security infrastructure flakiness or limited visual issues may receive narrowly scoped exceptions only with a recorded issue, named approver/owner, rationale, expiry and replacement assurance where necessary. Exceptions cannot mask security, critical accessibility or published-package compatibility failures. Emergency security patches may use expedited scheduling but must pass all relevant security and packed-consumer gates.

### 9. Performance and bundle budgets

Measure initial representative baselines for UI JavaScript imports, CSS size (raw/compressed), tree-shaking, SSR/hydration, auth middleware latency and database query growth. Approve and version budgets with the baselines. Review unexplained regressions greater than 10%; this is a review trigger, not automatic approval of smaller regressions. Enforce the documented release budgets once established, and require explicit non-security exception governance for any permitted deviation.

### 10. Release decision and evidence

A release is blocked on any failed mandatory gate, known security-invariant failure, critical accessibility regression, missing published artifact, invalid public export, or incompatible supported consumer. Retain CI results, test reports, coverage, visual diffs, dependency/security scan findings, package contents, artifact hashes and approved exceptions as release evidence. Publish only after the artifact and source revision have been verified under ADR-009.

## Consequences

The release pipeline is more expensive than unit-only testing and requires database infrastructure, browser runners and careful fixture isolation. In exchange, maintainers obtain explicit evidence for critical security properties, cross-runtime compatibility, visual consistency and package integrity. Test thresholds and budgets may be refined through documented follow-on implementation decisions, but cannot silently weaken these accepted release guarantees.

## Acceptance criteria

- [ ] Package-specific coverage thresholds enforced.
- [ ] Security invariant inventory mapped to automated tests.
- [ ] Real transactional adapter concurrency and fault-injection suites run.
- [ ] Browser, accessibility, six-style visual and SSR/hydration checks run.
- [ ] Full supported runtime and clean packed-consumer matrix passes.
- [ ] Test secrets are synthetic and artifacts redact sensitive values.
- [ ] Performance baselines and release budgets are recorded.
- [ ] No failed mandatory security gate can be waived.
- [ ] Release evidence is tied to the tested publish artifact.

## Related decisions

ADR-001 (package boundaries), ADR-003 (session security), ADR-004 (persistence), ADR-005 (RBAC), ADR-006 (OTP/recovery), ADR-007 (CAPTCHA), ADR-008 (UI theming), ADR-009 (publishing).
