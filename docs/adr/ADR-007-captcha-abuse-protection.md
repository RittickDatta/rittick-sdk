# ADR-007: CAPTCHA and Abuse Protection

- **Status:** Accepted
- **Date:** 2026-10-31
- **Project:** `@rittick/auth`
- **Supersedes:** None
- **Related:** ADR-001 through ADR-006; AUTH-CAPTCHA-001 through AUTH-CAPTCHA-004

## Context

`@rittick/auth` supports application-owned Express 5 authentication with registration, OTP issuance, password and passwordless login, recovery, and MFA. Automated abuse can cause account creation spam, credential attacks, OTP flooding, enumeration and provider cost exhaustion. CAPTCHA is an additional abuse defense, not proof of identity or a replacement for authentication, verification, MFA, CSRF protection, authorization or rate limiting.

## Decision

1. **Provider boundary.** Provide a provider-neutral CAPTCHA verification contract, with Cloudflare Turnstile as the preferred built-in adapter. Secrets remain on the server. Frontend components use a provider-neutral integration contract.
2. **Enforcement.** Support `always`, `risk-based`, and explicitly configured `off` modes. Default to CAPTCHA required for public registration before creating an account or issuing a registration OTP. Login, OTP issuance and recovery use server-controlled risk-based CAPTCHA by default. A client cannot lower enforcement.
3. **Risk engine.** A server-controlled policy returns `allow`, `challenge`, or `deny`. Application-configurable thresholds and trusted additional signals are supported. Missing risk information is handled conservatively. A valid CAPTCHA can satisfy `challenge`, never override `deny` or a rate limit.
4. **Verification.** Verify tokens server-side using the provider. Check provider success, expected action, exact allowed hostname, expiration and single-use semantics. Reject absent, invalid, expired, replayed or mismatched tokens whenever CAPTCHA is required. Expected action and hostname come from trusted server configuration, not client assertions.
5. **Replay resistance.** Respect provider single-use semantics and add application-backed short-lived consumption tracking where needed for concurrent requests or the configured threat model. Uncertain verification is not success. Test concurrent replay across instances.
6. **Distributed limits.** Production enforcement uses shared, atomic rate-limit state across instances. Layer limits by IP/network, normalized identifier, account, operation, pending claim and failure patterns as applicable. Protect identifiers used in keys. CAPTCHA success never bypasses limits. If a required abuse-control store is unavailable, fail closed for affected security-sensitive operations.
7. **Failure policy.** Fail closed whenever CAPTCHA is required and provider verification is unavailable, times out or returns an uncertain result. Allow only bounded, retry-safe verification attempts. Return safe public errors, emit operational alerts, and never silently switch to `off`.
8. **Privacy.** Do not transmit passwords, OTPs, session tokens, email addresses or phone numbers as CAPTCHA action labels or metadata. Redact raw CAPTCHA tokens from logs, minimize retained network information, and document application-owned privacy disclosures and third-party processing responsibilities.
9. **Accessibility.** Provide accessible challenge, failure and retry experiences. Applications may configure separately secured alternative verification or support workflows with independent assurance, rate limiting and auditing; no automatic bypass.
10. **Public behavior.** Maintain anti-enumeration properties across registration, login, OTP and recovery responses, including resend/cooldown and provider-failure paths.

## Architecture boundaries

- `@rittick/auth/core`: provider-neutral policy and verification result contracts, no Turnstile or Express runtime dependency.
- `@rittick/auth/backend`: server-authoritative policy evaluation, CAPTCHA verification orchestration, distributed rate-limit enforcement and audit/telemetry hooks.
- Turnstile adapter: provider-specific server verification and response mapping, with no client secret exposure.
- `@rittick/auth/frontend`: accessible integration and challenge rendering, never the authority for enforcement.
- Consuming application: provider keys, allowed hostnames/actions, privacy disclosures, risk thresholds, trusted infrastructure and secure alternative workflows.

## Mandatory invariants

- CAPTCHA is checked before a protected side effect, including registration creation or registration OTP issuance.
- `deny` remains denied regardless of CAPTCHA success.
- One token cannot authorize multiple operations; mismatched action or hostname always fails.
- Server configuration controls risk, hostname and action; untrusted request data cannot downgrade enforcement.
- A missing or failed required provider or shared rate-limit control cannot fail open.
- CAPTCHA does not replace identity verification, OTP controls, CSRF, sessions, MFA, ownership checks or RBAC.
- Sensitive tokens and secrets never appear in application logs or browser-delivered server configuration.

## Failure and recovery behavior

| Condition | Required result |
|---|---|
| Missing/expired/invalid token when required | Reject, allow controlled retry |
| Wrong hostname/action | Reject and record security signal |
| Token replay or concurrent reuse | Reject subsequent/replayed operation |
| Provider timeout, outage or uncertain response | Fail closed when required; safe public error and operational alert |
| Shared rate-limit state unavailable | Fail closed for operations relying on the required limit |
| CAPTCHA success but independent rate limit exceeded | Deny or throttle |
| Challenge UI inaccessible/unavailable | Accessible error/retry or separately secured alternative, never automatic bypass |

## Acceptance and test gates

- Unit and integration tests for policy modes, risk outcomes and server-only authority.
- Provider adapter tests for success, failure, expiration, malformed responses, action/hostname mismatch, timeouts and bounded retries.
- Concurrent replay tests across multiple application instances.
- Distributed rate-limit and fail-closed infrastructure outage tests.
- Registration/OTP/recovery bypass and enumeration behavior tests.
- Privacy tests for secret handling, token redaction and minimal provider metadata.
- Accessibility tests for challenge, retry, failure and alternate-workflow UX.
- Clean Express 5 / React 19 consumer tests consistent with ADR-001.

## Consequences

This design increases integration and operational complexity, requiring a shared rate-limit store and reliable provider verification. In return it provides consistent, testable abuse protection without a mandatory single CAPTCHA vendor. Applications remain responsible for provider configuration, privacy obligations and their own operational risk thresholds.

## Deferred implementation details (not unresolved architectural decisions)

Concrete provider adapter method names, default numeric risk thresholds, consumption-record storage mechanics, alert destinations and deployment-specific provider settings will be defined during implementation and documented without weakening the invariants above.

## Decision record

Approved by the project owner on 2026-10-31 following explicit approval of provider architecture, registration and risk-based defaults, fail-closed behavior, token binding and replay defense, privacy, accessibility, distributed enforcement, provider failures and required security tests.
