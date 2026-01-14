## 2026-01-14 - Block SVG Uploads for Stored XSS Prevention
**Vulnerability:** Laravel's `image` validation rule allows SVG files, which can contain malicious JavaScript (Stored XSS).
**Learning:** The default `image` validation rule is insufficient for preventing XSS via file uploads if the files are served directly.
**Prevention:** Explicitly use `mimes:jpeg,png,jpg,gif,webp` to whitelist safe image formats.
