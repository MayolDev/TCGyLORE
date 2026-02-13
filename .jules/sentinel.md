## 2025-01-22 - [Stored XSS via SVG Uploads]
**Vulnerability:** The `image` validation rule in Laravel allows SVG files, which can contain malicious JavaScript (Stored XSS). The application relied solely on `image` for file uploads in `CardController` and `LocationController`, potentially allowing attackers to upload crafted SVG files that execute scripts when viewed by other users.
**Learning:** The `image` rule validates that a file is an image (including SVG) but does not guarantee it is safe for direct display. SVGs are valid images but dangerous in web contexts.
**Prevention:** Always combine `image` validation with explicit MIME type restrictions using `mimes:jpeg,png,jpg,gif,webp` to exclude SVG files unless they are strictly sanitized or served with a safe Content-Security-Policy.
