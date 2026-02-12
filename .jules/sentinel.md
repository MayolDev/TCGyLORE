## 2025-05-20 - Prevent Stored XSS via Explicit Image Validation
**Vulnerability:** Default `image` validation rule in Laravel may allow SVG uploads if drivers are present, or fail unexpectedly if missing. SVGs can contain malicious scripts (Stored XSS).
**Learning:** Relying on implicit validation or environment limitations is fragile.
**Prevention:** Explicitly use `mimes:jpeg,png,jpg,gif,webp` to prohibit SVG uploads regardless of environment configuration.
