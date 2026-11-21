# ADR-004: Persistence Adapters and Transaction Semantics

- **Status:** Accepted
- **Date:** 2026-10-31
- **Scope:** `@rittick/auth/core`, `/backend`, and optional persistence adapters
- **Related:** ADR-001, ADR-002, ADR-003; ADR-005 (forthcoming)

## Context

`@rittick/auth` is installed into independently deployed applications. It does not operate a central identity service or database. PostgreSQL (via Prisma) and MongoDB must provide equivalent security invariants despite different transaction and indexing APIs. Authentication and authorization workflows include concurrent identifier verification, single-use OTP consumption, session rotation/revocation, role assignments, durable audit, and email/SMS delivery.

## Decision

1. **Application-owned storage.** The consuming application owns the database, credentials, infrastructure, deployment and migration execution. Rittick supplies versioned schema/migration assets and guidance; it does not silently migrate at startup. Auth-specific tables/collections may reside in the application's database.
2. **Contract boundary.** `@rittick/auth/core` defines framework-neutral repositories, transaction semantics and explicit atomic security operations. The Express backend orchestrates services through these contracts. Optional database adapters implement them without importing unused drivers. CRUD-only implementations are insufficient where atomic security operations are required.
3. **No degraded security mode.** Adapters must enforce strict atomicity for security-critical operations. Startup compatibility checks reject missing capabilities, incompatible schema versions or unsupported deployments. Capability flags alone do not establish correctness; common integration/concurrency tests are mandatory.
4. **PostgreSQL/Prisma.** Enforce realm-scoped committed-identifier ownership with database uniqueness constraints. Use transactions, conditional writes/locking and appropriate isolation for concurrent mutations. Retry serialization/deadlock conflicts only when safe and bounded. Consumers review and apply supplied migrations.
5. **MongoDB.** Require a transaction-capable replica set or sharded cluster, appropriate unique indexes, multi-document transactions and documented read/write concerns (majority durability for security-critical commits). Standalone MongoDB is not a supported official adapter deployment. Handle transient transaction errors and unknown commit results safely.
6. **Transaction retries and idempotency.** Use bounded retries only for operations designed to be idempotent; use operation-specific idempotency identifiers and durable reconciliation for uncertain commits. Never rerun irreversible external side effects inside a retried database transaction. Permanent uniqueness conflicts produce typed failures.
7. **Transactional outbox.** Persist notification intent and corresponding auth state atomically. Workers deliver email/SMS asynchronously at least once, with deduplication, provider idempotency when available, bounded exponential backoff, retry caps, dead-letter handling and monitoring. Exactly-once external delivery is not guaranteed.
8. **Audit consistency.** Privileged mutations, authorization-version changes and authoritative audit records must commit atomically. Failure to write the authoritative audit record fails the mutation. Non-authoritative telemetry may be asynchronous.
9. **Failure handling.** Fail closed on database unavailability, incompatible schema, transaction uncertainty that cannot be reconciled, and failed revocation writes. Never report successful logout, role change, or identifier ownership transfer before the required durable commit.

## Required invariants

- **Identity ownership:** Competing pending claims are permitted under ADR-002; only a successful atomic verification can establish unique committed ownership within a realm. The challenge must be bound to the claim, identifier, purpose and expiration, and consumed once.
- **Account activation:** Registration verification and activation state must be consistent with the realm's `email-only`, `phone-only`, `either`, or `both` policy. Unverified identifiers never become authentication or recovery factors.
- **Identifier replacement:** Preserve the old verified identifier until the new one is verified and committed atomically; conflicting ownership fails safely.
- **OTP:** Atomic compare-and-consume under concurrency. Delivery delays or retries do not extend OTP validity, revive consumed challenges or confer extra attempts.
- **Sessions:** Rotation atomically invalidates the old token and establishes the replacement. Revocation cannot be undone by a concurrent renewal. Global revocation is cross-instance and concurrency-safe, including newly created sessions racing with the operation.
- **RBAC:** Role assignment checks current authorization and realm/tenant scope within a concurrency-safe mutation. Role updates, authorization-version changes and authoritative audit records are committed consistently. Stale administrative privileges cannot authorize elevation after revocation.
- **Deletion:** Identifier release follows verified completion of account deletion and applicable retention rules; reused identifiers never inherit old sessions, roles, purchases, or other account data.
- **Outbox:** Provider calls occur only after commit, never inside retryable transaction callbacks. Worker concurrency and retry behavior must not grant extra authentication privileges.

## Adapter implementation guidance

The exact TypeScript interfaces and migration formats are finalized in implementation stories. The interfaces should distinguish ordinary repositories from security-critical atomic commands, including claim-and-verify identity, consume challenge, rotate/revoke sessions, and authorize-and-assign roles. Commands should carry realm scope, correlation/idempotency identifiers and expected state/version where appropriate. Transaction boundaries must include all state whose consistency is required; cross-database distributed transactions are not implicitly supported.

Schema version checks occur before accepting authentication traffic. Upgrades should prefer backward-compatible expand/contract changes where feasible. Retryable errors, conflicts, unavailable dependencies and incompatible schema are exposed as typed errors without leaking account existence through public responses.

## Verification and release gates

- Shared adapter contract suite against PostgreSQL/Prisma and transaction-capable MongoDB.
- Parallel verification of identical identifiers: exactly one committed owner.
- Parallel OTP consumption: at most one success.
- Rotation/revocation races: no resurrected token or unauthorized session.
- Concurrent admin revocation and role grant: no stale-authority escalation.
- Crash/retry and unknown-commit simulations: idempotent outcomes and no untracked privileged changes.
- Outbox crash, duplicate delivery, provider outage and dead-letter tests.
- Incompatible schema and unsupported MongoDB deployment fail-start tests.
- Clean-consumer migration, startup and adapter-isolation tests.

## Consequences

The SDK gains portability without sacrificing consistency, but adapter authors must implement nontrivial transactional operations and consumers must operate a database with appropriate capabilities. Asynchronous delivery introduces worker operations and monitoring. Migrations are explicitly controlled by each consuming application.

## Deferred to later ADRs / implementation

ADR-005 specifies RBAC roles, scopes and administrative privilege policies. Later ADRs specify OTP limits, recovery, CAPTCHA and testing/release gates. Concrete indexes, retry budgets, outbox retention and migration tooling are implementation decisions constrained by the invariants above, not permission to weaken them.
