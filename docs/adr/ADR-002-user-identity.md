# ADR-002: User Identity and Identifier Lifecycle

- **Status:** Accepted
- **Date:** 2026-10-31
- **Scope:** `@rittick/auth/core`, `/backend`, `/frontend`, application-owned persistence adapters
- **Supersedes:** Proposed ADR-002 draft

## Context

Consuming applications require configurable email-only, phone-only, either, or both registration, verified identities, password and purpose-scoped OTP authentication, secure recovery, RBAC and tenant-aware authorization. Identifiers must not become permanent user IDs or allow takeover through unverified claims.

## Decision

### Identity and uniqueness

1. Each account has a stable opaque internal user ID. Email, phone, credentials, sessions and role assignments are separate records tied to it.
2. In v1, each user has at most one attached email and one attached phone. The registration policy determines which are required; an account cannot have neither.
3. Normalized identifiers are unique among committed owners within an **application authentication realm**. A realm is the application-owned identity namespace, not an RBAC organization; users may belong to multiple organizations.
4. Database constraints or equivalent atomic persistence operations enforce ownership. Application-only prechecks are insufficient.
5. No automatic or manual account merging in v1. Linking an identifier already committed to another account is rejected; no roles, orders, sessions or data are transferred.

### Normalization

6. Email: trim surrounding whitespace, canonicalize the domain using IDNA and lowercase its ASCII representation; preserve local-part spelling and case for the canonical comparison key and preserve a display value. Do not collapse dots, plus tags, or provider aliases. Database collation must not silently override the comparison policy.
7. Phone: parse with an explicit country/region context when national format is supplied and persist canonical E.164. Structural validity does not imply ownership; verification does.

### Registration and verification

8. Registration policies: `email-only`, `phone-only`, `either`, `both`. Supplied identifiers have independent verification states. `both` requires both verified before account activation; `either` requires at least one verified. Email-only and phone-only require their respective verified identifier.
9. A supplied but unverified identifier grants no login, recovery or ownership privileges, even when the account is active through another verified identifier.
10. Pending registration lifetime defaults to **24 hours**. Pending claims are temporary, bounded and abuse-protected; competing claims may exist. They must not be renewed indefinitely to block a legitimate registrant.
11. Only successful, purpose-bound verification followed by an atomic uniqueness/ownership commit establishes identifier ownership. First successful atomic commit wins; other competing attempts fail safely. OTP challenges are bound to the precise claim, identifier, realm and purpose, and are single-use.
12. OTP challenge expiry, resend limits, attempt limits and abuse controls are defined in the OTP/security ADRs; an initial proposed OTP expiry is 10 minutes, not an acceptance condition of this ADR.

### Account lifecycle

13. Account states: `pending`, `active`, `restricted`, `disabled`, `deletion_pending`, `deleted`. Account status and each identifier's verification status are independent.
14. `pending`: verification and explicitly permitted onboarding actions only; no fully authenticated application session. `active`: normal authentication subject to policy. `restricted`: deny normal login and protected resources; permit only expressly authorized remediation. `disabled`: deny login and revoke active sessions. `deletion_pending`: limited actions per deletion policy. `deleted`: no login and no inherited privileges.
15. Identifier replacement requires an authenticated and appropriately recently re-authenticated or equivalently high-assurance workflow, verification of the new identifier, uniqueness recheck, atomic commit, audit, and security notification to prior verified contact where feasible. The old verified identifier remains in place until successful commit; a pending replacement has no login/recovery rights.
16. Account deletion must complete under applicable retention rules before identifiers are released for reuse. Reuse creates no association with previous account data, roles, orders, sessions or recovery factors. Retained audit records must respect retention and privacy policies.

### Passwordless OTP channel policy

17. Email-only accounts: verified email OTP login. Phone-only accounts: verified SMS OTP login. Accounts with attached email and phone: **email OTP login only** when the email is verified; SMS OTP login is forbidden. If attached email is unverified, do not fall back to SMS login; require email verification or approved secure recovery. No verified permitted identifier means no passwordless login.
18. SMS OTP may still be used for permitted phone verification, phone changes and recovery, subject to the corresponding security policy. OTPs are strictly purpose-scoped.
19. Public registration, login and recovery responses must avoid account enumeration; internal duplicate handling remains deterministic.

## Consequences

- Persistence adapters must support realm-scoped atomic uniqueness and race-safe verification/replacement.
- Account state and identifier state must be modeled separately.
- API clients cannot determine login channels solely from user-provided identifiers; the backend enforces channel policy without leaking account existence.
- Cross-organization membership does not imply separate identities or global administrator privileges.
- Identity merging and multiple identifiers of one type are explicitly out of scope for v1.

## Required validation

- Parallel registration/verification for identical identifiers: exactly one committed owner.
- Pending claims expire after 24 hours; abuse protections prevent indefinite denial of registration.
- All four registration policies and activation thresholds.
- Unverified secondary identifiers never grant login or recovery access.
- Email local-part case preservation and domain IDNA normalization; E.164 normalization.
- Replacement races and failed transactions preserve the old verified identifier.
- No cross-realm ownership leakage; no cross-organization privilege transfer.
- Restricted/disabled/deleted states block normal authentication; remediation is explicitly allowlisted.
- Deleted identifier reuse does not inherit previous account resources or permissions.
- Email-priority OTP login and no SMS fallback with attached unverified email.
- Public flows avoid identifier enumeration.

## Related ADRs

- ADR-001: Package architecture and ESM distribution (Accepted)
- ADR-003: Session security and deployment topology (next)
- ADR-004: Persistence adapters and transaction semantics
- ADR-005: RBAC and authorization
- ADR-006: OTP and recovery
- ADR-007: CAPTCHA and abuse protection

## Implementation note

This ADR is authoritative for identity semantics. Precise transaction mechanisms, session revocation details, OTP thresholds, and retention schedules are specified by subsequent ADRs or application policy; they must not weaken these invariants. No application implementation is assumed complete.
