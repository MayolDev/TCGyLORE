## 2026-02-28 - Prevent XSS via SVG Image Uploads
**Vulnerability:** Laravel's `image` validation rule relies on FileInfo and allows `.svg` files by default. If an attacker uploads a malicious SVG containing embedded JavaScript, it can lead to Stored Cross-Site Scripting (XSS) when rendered by users.
**Learning:** In this project, `CardController` and `LocationController` lacked explicit MIME type restrictions, exposing the application to this risk.
**Prevention:** Always prepend the `mimes` validation rule (e.g., `mimes:jpeg,png,jpg,gif,webp`) *before* the `image` rule in Laravel to strictly allowlist safe image formats and reject SVGs.
