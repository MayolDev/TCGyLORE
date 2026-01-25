# Sentinel's Journal

## 2026-01-25 - Stored XSS via SVG Upload
**Vulnerability:** The application used the `image` validation rule for file uploads (`CardController` and `LocationController`), which by default allows SVG files. SVG files can contain malicious JavaScript that executes when viewed in a browser, leading to Stored XSS attacks.
**Learning:** Standard validation rules like `image` may be too permissive for security-critical contexts. The assumption that "image" means "safe visual content" is incorrect when vector graphics (SVG) are involved.
**Prevention:** Always explicitly whitelist allowed MIME types using the `mimes` rule (e.g., `mimes:jpeg,png,jpg,gif,webp`) when accepting image uploads, unless SVG support is strictly required and properly sanitized.
