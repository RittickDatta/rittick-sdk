# ADR-008: UI Theming and Visual-Style Architecture

- **Status:** Accepted
- **Date:** 2026-10-31
- **Package:** `@rittick/ui`
- **Related ADRs:** ADR-001, ADR-009, ADR-010

## Context

`@rittick/ui` is an independent React 19 / TypeScript design system. It must support six distinct visual styles, consumer branding, light/dark/system modes, nested themes, component overrides, accessible components, React SSR and portals. Consumers must not need to install or configure Tailwind CSS.

## Decision

### 1. Token model

Maintain three independent, layered token categories:

1. **Brand tokens** for consumer identity, including primary/accent colors and typography.
2. **Semantic tokens** for foreground, background, surfaces, borders, focus, muted, success, warning and danger meanings.
3. **Visual-style tokens and recipes** for elevation, shadows, borders, radii, blur, texture and motion.

Expose stable, `rittick`-namespaced CSS custom properties and typed theme configuration. Internal Tailwind utility classes and implementation DOM details are not stable public APIs. Switching visual style must not silently change the application's brand or semantic status meanings.

### 2. Visual styles and precedence

Support all six styles in v1: **Claymorphism** (default), **Neumorphism**, **Skeuomorphism**, **Glassmorphism**, **Cyberpunk**, and **Neubrutalism**.

Visual-style resolution order is:

1. Explicit component `visualStyle` override;
2. Nearest `ThemeProvider` explicitly supplied style;
3. Ancestor `ThemeProvider` values;
4. Claymorphism library default.

Brand, semantic overrides, color mode and accessibility preferences inherit independently. Nested providers override only explicitly supplied values. A component style override changes the complete visual treatment of that component, including interactive states, but does not reset unrelated inherited tokens. Support light, dark and system color modes.

### 3. CSS build and isolation

Use Tailwind CSS v4 at build time and publish one compiled stylesheet at `@rittick/ui/styles.css`. Consumers do not require Tailwind configuration or compilation. The package must preserve the CSS file in published artifacts and mark CSS imports as side effects.

Scope selectors to library-owned elements and theme scopes; namespace CSS custom properties and data attributes. Do not include Tailwind's global Preflight reset or style bare HTML elements globally. Avoid collisions with consumer utilities. Multiple visual styles must coexist on one page with a single stylesheet.

### 4. SSR, hydration and persistence

Rendering must be deterministic under React 19 SSR. System color mode should resolve through CSS `prefers-color-scheme` where possible. Explicit light/dark preferences may be provided by the consuming application from server-readable state to avoid hydration mismatches and flashes. No browser globals may be accessed during server render. Do not implicitly read or write `localStorage` or other global persistence; preference persistence is optional and application-controlled.

### 5. Portals and overlays

Library-managed Radix-based dialogs, popovers, menus and tooltips must preserve resolved brand, semantic, visual-style and color-mode scope even when rendered outside the provider's DOM subtree. Support configurable portal containers and nested theme scopes. Test inheritance, focus behavior and hydration with portals.

### 6. Accessibility and customization

Target WCAG 2.2 AA for supported default themes, with keyboard operation, visible focus, sufficient contrast, reduced motion, forced-colors support, perceivable disabled/error states and usable target sizes. Accessibility requirements take precedence over decorative effects, including glass transparency, low-contrast neumorphic depth and cyberpunk glow.

Support public component variants, sizes, typed theme configuration, semantic tokens, `className`, `style`, and accessible composition patterns where appropriate. Do not guarantee arbitrary overrides of internal DOM or private Tailwind classes.

### 7. Performance and quality

Prefer one accessible behavior implementation per component, with CSS-driven visual recipes rather than six runtime component implementations. Publish tree-shakable ESM and avoid duplicate React. Establish measured JavaScript and CSS size baselines and enforce regression budgets once measured.

Require visual regression coverage for all six styles in light and dark modes, including interaction, focus, disabled, loading and error states. Include reduced-motion and forced-colors checks, CSS isolation tests, SSR/hydration tests, portal theme tests and clean-consumer installation tests.

## Security and correctness invariants

- Theme switching must not override semantic status meaning or consumer brand identity without explicit configuration.
- Component visual-style overrides must be self-consistent across states and must not leak into siblings or ancestors.
- CSS must not introduce global resets or consumer style collisions.
- SSR markup must be deterministic and not depend on browser-only APIs.
- Portaled content must retain the intended theme and accessibility behavior.
- Decorative effects must not degrade essential contrast, focus or interaction.

## Consequences

The package maintains a stable public token contract and a single compiled CSS distribution, while incurring test-matrix complexity across six styles, color modes and interactive states. Detailed token names, TypeScript interfaces, baseline screenshots and numerical size thresholds are implementation deliverables, not additional architecture decisions.

## Acceptance gates

1. Verify all six styles can coexist in one app with one stylesheet.
2. Verify nested providers and per-component overrides preserve independent brand and mode inheritance.
3. Verify CSS does not apply global Preflight or modify unrelated consumer elements.
4. Verify React 19 SSR and hydration for system and explicit color modes.
5. Verify portal theme inheritance with default and custom containers.
6. Verify keyboard, focus, contrast, reduced-motion and forced-colors behavior.
7. Verify compiled CSS export, tree-shaking, package side effects and clean consumer builds.
8. Verify visual regression and measured bundle-size gates.

## Implementation status

Architecture accepted; no implementation has started. This ADR does not change the 195-story roadmap.
