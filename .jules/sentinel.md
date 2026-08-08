
## 2026-01-23 - Unrestricted SVG Upload
**Vulnerability:** File upload endpoints in `CardController` and `LocationController` relied on the `image` validation rule, which allows SVG files. SVGs can contain malicious JavaScript (Stored XSS).
**Learning:** The Laravel `image` validation rule includes SVG. When allowing image uploads, we must explicitly whitelist safe MIME types (jpeg, png, gif, webp) if we cannot sanitize SVGs.
**Prevention:** Always use `mimes:jpeg,png,jpg,gif,webp` in addition to or instead of `image` for public uploads.
