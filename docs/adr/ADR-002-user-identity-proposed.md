# ADR-002 — User Identity and Identifier Lifecycle

- **Date:** 2026-10-31
- **Status:** Proposed — security-critical decisions outstanding
- **Scope:** `@rittick/auth/core`, `/backend`, `/frontend`; application-owned persistence
- **Predecessor:** ADR-001 (Accepted)

## Context

Authentication supports email-only, phone-only, either, or both registration, mandatory verification, password and passwordless OTP login, secure recovery, and organization-scoped RBAC. Identifiers must not be conflated with immutable user IDs.

## Confirmed decisions

1. A user has a stable opaque internal ID and at most one email and one phone identity in v1. Identity verification, credentials, sessions, and role assignments are distinct records or logically distinct aggregates.
2. Identifier uniqueness is enforced within an application authentication realm, not across unrelated applications. An RBAC organization is not automatically a separate authentication realm.
3. Email: trim surrounding whitespace; normalize the domain conservatively (IDNA/ASCII and lowercase); preserve local-part case; do not remove dots, plus tags, or apply provider-specific alias rules. Persist a canonical comparison key and display representation. The application must use the same comparison semantics in all database adapters.
4. Phone: parse with explicit region context and store E.164. Number parsing is not proof of ownership; verification is required.
5. Pending registrations expire after 24 hours. OTP challenge lifetime is separately configurable (proposed 10-minute default), with purpose binding, single-use verification, hashing, rate limits and cooldowns.
6. No automatic or manual account merging in v1. An identifier owned by another account cannot be linked or merged; role and order data never transfer through identifier reuse.
7. Account states: `pending`, `active`, `restricted`, `disabled`, `deletion_pending`, `deleted`. Account state is distinct from each identifier's verification state.
8. Identifier replacement requires a recent high-assurance authentication step or approved recovery path, verification of the new identifier, uniqueness enforcement, atomic commit, security notifications where possible, and audit events. The old verified identifier remains active until commit.
9. Passwordless login channel: verified email-only => email OTP; verified phone-only => SMS OTP; email+phone => email OTP only. An attached unverified email blocks SMS-login fallback. Phone OTP can still be used for permitted verification or recovery purposes. No verified identifier => no passwordless login.
10. Public-facing responses should resist account enumeration. Database uniqueness and security checks remain authoritative server-side.

## Security-critical questions still open

1. **Pending-claim contention and denial of registration:** Can multiple pending claims coexist for an identifier, or is one pending claim exclusive? What prevents indefinite reservation through retries? Proposed: bounded claims that never establish permanent ownership, abuse-protected retries, atomic first verified claimant, and no renewal-based indefinite lockout.
2. **Activation policy for `both` and `either`:** Is `both` activated only after both identifiers verify? Does an unverified optional second identifier prevent activation under `either`? Proposed: `both` requires both; `either` requires one verified permitted identifier, while unverified secondary identifiers grant no login or recovery rights.
3. **Replacement races:** How are concurrent pending replacement and registration claims arbitrated? Proposed: verify new identifier then atomically claim it, retain old identity until commit, fail safely on uniqueness conflict.
4. **Deletion and reuse:** When are identifiers released from deleted accounts, and what retention or fraud controls apply? Proposed: configurable release policy, never inherit prior account data, roles, sessions, or recovery factors.
5. **Restricted-state semantics:** Which remediation endpoints remain accessible? Proposed: default deny normal login and protected resources; explicitly allow only secure remediation paths.

## Further design notes (not blocking this ADR if covered by later ADRs)

- OTP entropy, attempt limits, and rate-limit thresholds belong to ADR-006/007.
- Session revocation and reauthentication assurance belong to ADR-003.
- Storage transaction guarantees and adapter concurrency behavior belong to ADR-004.
- RBAC scope enforcement belongs to ADR-005.
- Recovery for lost identifiers belongs to ADR-006.

## Required validation

- Verify uniqueness and canonicalization equivalence across Prisma/Postgres and MongoDB adapters, including concurrency.
- Test pending registration expiry, repeated reservation abuse, and competing verification claims.
- Test all four registration policies and activation conditions.
- Test OTP email-priority rules, including attached unverified email.
- Test identifier replacement races and disabled/restricted/deleted account access.
- Test account enumeration resistance and lack of automatic account merging.

## Decision status

**Not Accepted.** The confirmed choices are recorded; the five security-critical questions above require explicit approval before promotion to Accepted.
