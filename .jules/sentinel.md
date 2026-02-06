## 2026-02-06 - SVG Upload Vulnerability in Laravel
**Vulnerability:** Laravel's default `image` validation rule permits SVG files, which can contain malicious JavaScript (Stored XSS).
**Learning:** Even though `image` rule might fail in some environments without proper SVG support (like this one), relying on environment limitations is not security. Explicit MIME type validation is required.
**Prevention:** Always use `mimes:jpeg,png,jpg,gif,webp` in addition to `image` rule to strictly whitelist safe image formats.
