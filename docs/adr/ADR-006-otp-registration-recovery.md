# ADR-006: OTP, Registration, and Recovery Policies

- **Status:** Accepted
- **Date:** 2026-10-31
- **Project:** `@rittick/auth`
- **Related decisions:** ADR-001 through ADR-005; ADR-007 (CAPTCHA and abuse protection)

## Context

`@rittick/auth` must support application-configurable registration by email, phone, either, or both; password and opt-in passwordless OTP login; optional policy-enforced TOTP and recovery codes; and secure recovery without weakening identity ownership, session security, or RBAC. The application owns persistence and delivery infrastructure. Security-critical state transitions must satisfy ADR-004 atomicity requirements.

## Decision

### Registration and identity activation

- Registration policies: `email-only`, `phone-only`, `either`, and `both`.
- `email-only` requires a verified email; `phone-only` requires a verified phone; `either` requires at least one verified permitted identifier; `both` requires both verified identifiers.
- A supplied but unverified identifier confers no login or recovery privilege. Pending registration claims expire after 24 hours (ADR-002), independently of OTP expiry. Resends must not extend claim lifetime indefinitely.
- Identifier ownership is established only by atomic verification and uniqueness enforcement, never merely by requesting a challenge.

### OTP issuance and verification

- OTPs contain six cryptographically random numeric digits, expire five minutes after issuance, and are single-use.
- Persist a keyed cryptographic digest of each OTP, not a recoverable plaintext OTP or unsalted fast hash. Manage the digest key outside the database and support safe key rotation.
- Bind each challenge to the authentication realm, identifier, purpose, challenge ID, and user or pending operation. A challenge cannot be repurposed for login, verification, password reset, MFA reset, or identifier replacement.
- Permit at most five failed verification attempts per challenge. Count attempts and consume or invalidate challenges atomically, including under concurrent requests.
- Enforce a 60-second resend cooldown and no more than five issuances per normalized identifier and purpose per hour by default, plus application-configurable daily and risk-based limits across account, IP/network, and device signals where available.
- A resend creates a new challenge and atomically invalidates the preceding challenge for the same purpose and operation. Rate limits and cooldowns must not be bypassed by changing sessions, IPs, or pending claims.
- An exhausted, expired, consumed, superseded, or invalidated challenge is never accepted.

### Delivery and transactional outbox

- Commit challenge issuance and delivery intent atomically through the ADR-004 transactional outbox; provider calls occur outside database transactions.
- OTP delivery payloads are encrypted with keys stored outside the database, strictly access-controlled, short-lived, and purged after processing or expiry. Do not place plaintext OTPs in logs, audit events, metrics, or persistent dead-letter records.
- Outbox delivery is at least once with provider deduplication where available, bounded retries, backoff, and safe dead-letter handling.
- Delivery retries never extend OTP expiry. Workers must check current challenge status and expiry before delivery and discard stale/superseded messages. A delivered duplicate does not create a new authentication privilege.
- Provider failures produce generic public responses while retaining operational diagnostics internally.

### Password and passwordless authentication

- Passwordless OTP login is disabled unless explicitly enabled by the consuming application. Password login and passwordless login are separate first-factor methods; both obey the same configured required MFA policy.
- **Email-priority rule:** If an email identity is attached to the account, email is the only permissible passwordless-login channel. Email OTP login requires that email to be verified. An attached unverified email blocks SMS fallback, even if the phone is verified.
- If no email is attached, SMS OTP login is permitted only for a verified phone identity. If no eligible verified identifier exists, passwordless login is unavailable.
- SMS remains available for phone verification, authorized identifier changes, and policy-approved recovery; this does not constitute SMS login fallback.
- Successful login creates a fresh server-side session only after all required authentication factors have been satisfied (ADR-003).

### MFA and recovery

- Support standards-compatible TOTP and high-entropy single-use recovery codes. Enforcement is application-configurable; TOTP is not universally mandatory.
- Encrypt TOTP secrets at rest, constrain clock skew, prevent reuse of accepted TOTP time steps where feasible, and require verified enrollment before enabling the factor.
- Show recovery codes only when issued or regenerated; persist secure hashes, consume atomically, and invalidate prior codes on regeneration.
- Recovery follows explicit, operation-specific policies: approved recovery codes or approved combinations of verified factors, followed by higher-assurance workflows for lost factors. No automatic fallback to weaker or unverified identifiers.
- Password reset and lost-factor recovery revoke existing sessions and require fresh authentication. MFA changes are durably audited; lost-factor MFA reset revokes all sessions. Trusted in-session MFA changes rotate the current session and revoke other sessions according to ADR-003.
- Changing email or phone requires the separate secure replacement and atomic ownership policy in ADR-002; no automatic account merging.
- If no approved recovery path is available, automated recovery fails closed and the application may offer its separately authorized support process.

### Anti-enumeration and abuse protection

- Public registration, login, challenge issuance, resend, and recovery endpoints must avoid revealing whether an account or identifier exists. Use generic responses, consistent response shapes, practical timing controls, and multilayer rate limits.
- Do not reveal the selected login channel, delivery status, cooldown state, or challenge identifiers in a way that discloses account existence or allows a weaker factor to be selected.
- CAPTCHA enforcement and risk-based escalation are governed by ADR-007; any configured server-side gate must fail closed.
- Test observable differences between existing and nonexistent identifiers, including throttled and provider-failure paths.

## Mandatory invariants

1. Challenges are purpose-bound, identifier-bound, operation-bound, time-limited, and consumed at most once.
2. A pending registration's 24-hour expiry and an OTP's five-minute expiry are independent.
3. Unverified identifiers never authorize login or recovery.
4. Email-bearing accounts never use SMS passwordless-login fallback.
5. Required MFA cannot be bypassed by switching from password to OTP login.
6. Recovery never silently downgrades assurance or restores revoked sessions.
7. No database transaction performs an external email/SMS provider call.
8. Expired or superseded OTPs are not dispatched by the outbox worker.
9. Sensitive recovery and MFA mutations preserve ADR-003 session-revocation and ADR-004 atomic-audit guarantees.

## Implementation and test gates

- Concurrent OTP verification and resend races; atomic attempt exhaustion and challenge consumption.
- Registration policies for all four modes; verified/unverified combinations; pending claim expiry.
- Email-only, phone-only, both, and unverified-email-plus-verified-phone passwordless channel tests.
- Password and OTP flows with mandatory MFA; no MFA bypass.
- Provider outages, retry delays, duplicate outbox dispatch, encrypted payload retention and expired-message suppression.
- Recovery-code replay, TOTP replay/skew, MFA reset, password reset and global session revocation.
- Enumeration behavior under success, failure, cooldown, unknown account, and delivery outage.
- Adapter integration tests across PostgreSQL/Prisma and transaction-capable MongoDB.

## Consequences and deferred implementation details

- Five-minute OTP validity prioritizes security over delayed delivery convenience; controlled resend is required.
- The SDK must provide safe defaults and configurable risk controls without claiming uniform delivery reliability.
- Exact provider adapters, cryptographic key-management integration, recovery-policy configuration schema, and risk scoring thresholds are implementation details constrained by this ADR and ADR-007; none may weaken the accepted invariants.

## Approval

The user explicitly approved the initial and final policies on 2026-10-31. No security-critical architectural choice remains unresolved for this ADR.
