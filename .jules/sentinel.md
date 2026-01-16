
## 2026-01-16 - Stored XSS via File Upload
**Vulnerability:** The application allowed SVG uploads via the `image` validation rule in Laravel, which can contain malicious JavaScript.
**Learning:** The default `image` validation rule in Laravel includes SVG, which is a known vector for Stored XSS.
**Prevention:** Explicitly use `mimes:jpeg,png,jpg,gif,webp` to restrict allowed file types and exclude SVG unless proper sanitization is implemented.
