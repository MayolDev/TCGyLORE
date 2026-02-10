# Sentinel Journal - Security Learnings

## 2026-02-10 - Stored XSS Prevention in File Uploads
**Vulnerability:** Allowed upload of SVG files in `CardController` and `LocationController` which can contain Stored XSS payloads.
**Learning:** The default `image` validation rule in Laravel may be ambiguous regarding SVG support depending on environment/driver. It's crucial to explicitly whitelist allowed MIME types (`mimes:jpeg,png,jpg,gif,webp`) to prevent SVG uploads unless strictly required and sanitized.
**Prevention:** Always use explicit `mimes` rule alongside `image` rule for file uploads. Explicitly exclude `svg` unless a sanitization mechanism is in place.

## 2026-02-10 - CI Stability & React Purity
**Vulnerability:** Flaky CI/CD pipelines due to missing frontend assets in tests and React purity violations.
**Learning:**
1. Inertia feature tests require the Vite manifest. Always run `npm run build` before backend tests if frontend assets are involved.
2. React components using `Math.random()` during render (e.g., for visual effects like particles) trigger `react-hooks/purity` errors in linting.
3. Tests for features that have been removed (e.g., Registration when `register.tsx` is deleted) must also be removed to prevent CI failures.
**Prevention:**
1. Ensure CI pipelines run build steps before testing.
2. Use `// eslint-disable-next-line react-hooks/purity` for visual-only random effects in React, or move logic to `useEffect`.
3. Keep test suites synchronized with available features; delete tests for removed pages.
