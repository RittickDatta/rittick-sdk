# ADR-005 — RBAC, Authorization Scopes and Privilege Management

- **Status:** Accepted
- **Date:** 2026-10-31
- **Packages:** `@rittick/auth/core`, `@rittick/auth/backend`, `@rittick/auth/frontend`
- **Related:** ADR-001 through ADR-004; AUTH-RBAC-001 through AUTH-RBAC-014

## Context

The authentication package must support application-wide and organization-specific permissions in independently hosted applications with application-owned databases. A user's administrative authority in one organization must not confer authority in another. Frontend authorization improves usability but cannot enforce security. Role management, bootstrap and emergency recovery are sensitive privilege-escalation surfaces.

## Decision

1. **Scopes.** Support global roles and organization-scoped roles within an application authentication realm. An organization-scoped role is always bound to a trusted organization identifier. Global roles have only explicitly assigned global permissions and do not implicitly bypass tenant isolation.
2. **Permissions.** Use explicit namespaced resource-action permission identifiers (for example `orders:update`), extensible by consuming applications. Unknown roles, permissions, actions, scopes or malformed authorization context deny by default. Backend authorization evaluates current role assignments, action, resource, trusted ownership, organization membership and scope. A user may have multiple flat role assignments; role inheritance is excluded from v1.
3. **Isolation.** Treat realm, organization and resource ownership separately. Request-supplied organization IDs are untrusted selectors. Apply trusted tenant filters to persistence queries where possible and validate actual resource ownership; cross-tenant operations require separately defined global permissions. Optional database row-level security is defense in depth, not a substitute for backend checks.
4. **Provisioning.** Public registration grants only a configured low-privilege default role, never administrator privileges. Initial administrators are created exclusively through an authenticated, trusted, explicitly invoked provisioning process, with audit and least privilege.
5. **Delegation.** Role grants, revocations, role-definition edits and permission edits require explicit management permissions, a grantable-role policy, and authorized target scope. No implicit right to delegate one's own privileges. Self-elevation is denied by default. Editing a role's permissions or using another organization cannot circumvent grantability rules. Protect the last authorized administrator in each managed scope; genuine lockouts use a separate trusted recovery process.
6. **Emergency access.** No hardcoded master credentials, universal bypass or permanently privileged emergency account. Trusted emergency provisioning must authenticate the operator, create narrowly scoped, time-limited grants, audit the event and revoke on expiry. Ordinary policy enforcement continues to apply to the resulting grant.
7. **Revocation.** Role or membership revocation and permission changes invalidate effective authorization immediately across application instances. Protected operations validate current authorization state or a strongly consistent authorization version, never rely on stale session claims. Disabled accounts and high-risk events trigger session revocation according to ADR-003; ordinary role changes do not require universal logout.
8. **Audit and atomicity.** Successful privileged mutations, relevant authorization-version changes and authoritative audit records commit atomically under ADR-004. The actor's authorization must remain valid through commit; use transactional locking, compare-and-swap/version checks or equivalent controls. Rejected high-risk attempts should be audited where feasible, but audit failure never converts a denial into approval.
9. **Frontend/backend.** Frontend hooks, guards and role-management components may hide or disable controls for UX, but never authorize requests. Backend Express middleware and services enforce every protected action, resource ownership and tenant scope.

## Required invariants and edge cases

- No privilege laundering through role edits, role chains, self-assignment, impersonated tenant identifiers or stale caches.
- Grant/revoke races, concurrent administrator removal and simultaneous role-definition edits cannot violate the grantable-role policy or last-administrator protection.
- Cross-tenant resource IDs cannot be used to read, mutate or infer unauthorized data; denial responses must avoid unnecessary disclosure.
- Global permission grants are explicitly scoped and audited; global administration does not imply unrestricted access to tenant data.
- Permission catalog evolution and unknown permissions fail closed. An application cannot silently grant permissions by introducing a new identifier.
- Emergency grants expire under server-enforced time checks and remain visible to audit; no client-controlled extension.
- All administrative APIs use ADR-003 session, CSRF and re-authentication protections appropriate to their risk.

## Implementation guidance

Define core policy contracts and permission evaluation in `/core`, enforce authoritative decisions in `/backend`, and expose advisory permission hooks and management components in `/frontend` composed with `@rittick/ui`. Persist role definitions, assignments, membership, authorization versions and audit events through ADR-004 atomic adapter operations. Keep policy extensibility explicit, testable and deny-by-default. Exact storage schema, API naming, administrative re-authentication thresholds and audit retention are implementation/configuration details constrained by these invariants.

## Acceptance tests

- Cross-organization read/write attempts are denied despite valid roles in another organization.
- Unknown permissions and malformed scopes deny; frontend bypass attempts do not succeed.
- Public registration cannot assign or request privileged roles.
- Unauthorized delegation, self-elevation and role-definition privilege laundering are denied.
- Last-administrator protections survive concurrent revocations and role edits.
- Revoked permissions cease authorizing subsequent operations across instances and existing sessions.
- Concurrent role grant versus actor revocation cannot commit an unauthorized grant.
- Privileged writes roll back if authoritative audit/version updates cannot commit.
- Emergency provisioning is authenticated, scoped, time-bound and audited; expiry is enforced.

## Consequences

This design prioritizes security and auditability over implicit role hierarchy or permissive administrative shortcuts. Applications must define their permission catalog and explicit delegation policy. Database adapters must satisfy strong consistency requirements for privileged mutations. Future role inheritance or more complex policy models require a separate ADR.

## Follow-up

Proceed to **ADR-006 — OTP, Registration and Recovery Policies**. ADR-005 is Accepted; ADR-006 remains Proposed until explicitly approved.
