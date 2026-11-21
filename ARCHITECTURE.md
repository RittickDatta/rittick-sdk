# Implemented architecture

- A private ESM npm workspace root exists.
- A private `packages/ui` workspace placeholder reserves the future `@rittick/ui` package name.
- No runtime UI code, TypeScript build, package exports, compiled CSS, authentication package, or release pipeline has been implemented.

## Planned architecture (not implemented)

See `docs/adr/ADR-001-package-architecture.md` through ADR-011 for accepted decisions. `@rittick/ui` and `@rittick/auth` will eventually be independently published packages.
