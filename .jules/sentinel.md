# Sentinel Journal - Security Learnings

## 2026-02-10 - Stored XSS Prevention in File Uploads
**Vulnerability:** Allowed upload of SVG files in `CardController` and `LocationController` which can contain Stored XSS payloads.
**Learning:** The default `image` validation rule in Laravel may be ambiguous regarding SVG support depending on environment/driver. It's crucial to explicitly whitelist allowed MIME types (`mimes:jpeg,png,jpg,gif,webp`) to prevent SVG uploads unless strictly required and sanitized.
**Prevention:** Always use explicit `mimes` rule alongside `image` rule for file uploads. Explicitly exclude `svg` unless a sanitization mechanism is in place.
