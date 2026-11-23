# ADR-003: Session Security and Deployment Topology

- **Status:** Accepted
- **Date:** 2026-10-31
- **Scope:** `@rittick/auth/backend`, `/frontend`, `/core`; consuming Express/React applications
- **Related:** ADR-001 (package boundaries); ADR-002 (identity lifecycle); ADR-004 (persistence)

## Context

Rittick authentication is embedded in independently deployed applications, using application-owned persistence rather than a central authentication service. Sessions must work securely in browser-based React applications and across multiple Express instances, with RBAC changes taking effect promptly.

## Decision

### Supported deployment topologies

1. **Same origin (preferred):** React and API served through one public origin, potentially via reverse proxy.
2. **Same-site subdomains:** Distinct frontend and API origins under the same site are supported with explicit credentialed CORS, origin validation, and API-host cookies.
3. **Unrelated cross-site deployments:** Use an application-controlled backend-for-frontend (BFF) or reverse proxy; third-party cookie operation is not a supported dependency.

### Session model and cookies

- Use server-side, opaque sessions with at least 256 bits of CSPRNG entropy per bearer token; store only cryptographic token hashes in the persistence adapter. Token comparison and lookup must avoid leaks.
- Production cookie default: `__Host-rittick.sid=<token>; Secure; HttpOnly; Path=/; SameSite=Lax`. Never set `Domain`. `SameSite=Strict` may be configured. The name may be configured while retaining the `__Host-` constraints.
- `Secure` is mandatory in production. An explicitly separate localhost development mode may use a non-prefixed, non-Secure cookie over HTTP; never mislabel it `__Host-`.
- The cookie is issued by the API host and sent to that host on credentialed browser requests. It is never read by frontend JavaScript. Do not use parent-domain session cookies.
- Multiple simultaneous device sessions are allowed. Support current-session revocation, per-device revocation, and revoke-all.

### Expiration

- Default idle expiration: 12 hours. Default absolute expiration: 7 days. Remember-me is opt-in, disabled by default, with an absolute maximum of 30 days when enabled.
- A session is valid only while unrevoked and before both its idle and absolute deadlines. Activity may slide idle expiration, never the absolute deadline. Renewal updates must be throttled and concurrency-safe.
- On expired or revoked sessions, reject access and clear the browser cookie where applicable. Cookie expiry is not the server-side security boundary.

### CSRF and origin enforcement

- For unsafe browser requests using cookie authentication, require both a trusted `Origin` and a session-bound CSRF token (e.g., synchronizer token delivered via a protected endpoint and submitted via a custom header). Validate both server-side.
- Explicitly protect login and other session-establishing flows against login CSRF, using pre-authentication origin checks and a suitable pre-auth CSRF mechanism. Registration, OTP issuance and recovery require origin validation and independent abuse protections; their exact challenges are defined in later security ADRs.
- Reject unexpected or ambiguous origins for browser unsafe requests. Fetch Metadata may supplement, not replace, origin and CSRF checks. Non-browser clients require separately designed authentication; do not weaken browser rules through broad exemptions.
- Never confuse CORS with authentication or authorization.

### Rotation and revocation

- Always issue a fresh authenticated session on successful password or OTP login and after required registration verification. Pre-authentication tokens must never be promoted to authenticated bearer tokens.
- Rotate the current session on re-authentication and on sensitive credential/identifier transitions.
- On password or verified-identifier changes, rotate current session and revoke other sessions by default. On password reset, revoke all existing sessions and require a new login.
- Logout revokes current session; logout everywhere revokes all sessions. Role elevation requires recent re-authentication and current-session rotation.
- Role changes must be enforced promptly: protected requests check current authorization state or a monotonic authorization version; invalidation works across instances. Role revocation must not rely on long-lived embedded session claims.
- Persistence operations must make rotation/revocation concurrency-safe, preventing old tokens from being revived by renewal or racing writes. Detailed atomicity mechanisms are delegated to ADR-004.

### Proxy and CORS

- Consuming applications explicitly configure trusted proxies/hops. Do not broadly enable `trust proxy` or trust arbitrary forwarded headers. Validate expected public origins independently.
- For cross-origin same-site frontends, allow only explicit HTTPS origins and credentials; never wildcard `Access-Control-Allow-Origin` with credentials. Limit allowed headers/methods as appropriate. Same-origin deployments do not need CORS.

### Session records and observability

- Persistence must support a stable session ID, user ID, token hash, creation/last-seen/idle/absolute expiry, revocation status, and authorization freshness information. Optional device metadata must be privacy-aware.
- Device-management APIs expose only safe metadata, never raw tokens, token hashes, or secret CSRF material.
- Security events for login, rotation, revocation, invalid CSRF, and anomalous session activity must be auditable without logging secrets.

## Consequences

- Consuming apps must configure HTTPS, origin allowlists, cookie behavior, trusted proxies and durable session storage correctly.
- Multi-instance deployments need consistent persistence and revocation semantics.
- Subdomain deployments require explicit credentialed fetch and CORS configuration.
- Native clients and cross-site browser deployments require separately specified integration patterns.

## Rejected alternatives

- Stateless long-lived JWT as primary browser session.
- LocalStorage bearer tokens for browser session management.
- Parent-domain session cookies by default.
- Trusting `SameSite` or CORS alone as CSRF protection.
- Process-local-only session revocation.

## Verification / acceptance criteria

1. Test packed package in same-origin React/Express and same-site subdomain consumer deployments.
2. Verify `__Host-` cookie invariants in HTTPS production and explicit localhost development behavior.
3. Verify authenticated unsafe requests fail with absent/wrong origin or missing/invalid CSRF token, including malicious sibling subdomain scenarios.
4. Verify login CSRF defenses and pre-auth/session fixation resistance.
5. Verify idle, absolute, and remember-me expiration, including boundary/race cases.
6. Verify token rotation, password-reset global revocation, device-specific revocation, and concurrent renewal/revocation races.
7. Verify cross-instance revocation and immediate RBAC authorization freshness.
8. Verify trusted proxy configuration rejects spoofed forwarding headers; CORS rejects unauthorized origins.
9. Verify SSR/frontend imports do not expose session secrets and logs do not contain raw tokens.

## Deferred implementation details (not blockers to acceptance)

- Exact session-store transaction primitives: ADR-004.
- Exact CSRF token format, rotation cadence and endpoint names: backend implementation stories, subject to this ADR's invariants.
- OTP, CAPTCHA and recovery abuse thresholds: later security ADRs.
- Authorization version storage and tenant-scoped invalidation: RBAC and persistence ADRs.

## Roadmap impact

No new stories. Applies to existing AUTH core/backend/frontend stories and integration/security tests. The master roadmap remains 195 stories.
