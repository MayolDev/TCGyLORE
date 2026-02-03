## 2026-02-03 - Insecure File Upload (Stored XSS via SVG)
**Vulnerability:** The application allowed file uploads using the generic `image` validation rule. This rule permits SVG files, which can contain malicious JavaScript (Stored XSS). If these files are served from the same domain without strict Content-Security-Policy or Content-Disposition headers, the script executes in the victim's browser.
**Learning:** Laravel's `image` validation rule inherently allows SVG files. Simply trusting "it's an image" is insufficient for security when user-generated content is involved.
**Prevention:** Explicitly whitelist safe MIME types or extensions (e.g., `mimes:jpeg,png,jpg,gif,webp`) instead of using the broad `image` rule.
