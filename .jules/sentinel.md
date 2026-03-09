## 2026-03-09 - [XSS] Fix SVG image uploads
**Vulnerability:** Laravel's default 'image' validation rule allows SVG files, which can contain malicious JavaScript.
**Learning:** Overriding the default 'image' rule with explicit 'mimes:jpeg,png,jpg,gif,webp' is necessary to prevent XSS via file uploads.
**Prevention:** Always use explicit MIME type validation for user-uploaded images, avoiding vector formats like SVG unless strictly necessary and sanitized.
