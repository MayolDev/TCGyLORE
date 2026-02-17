## 2026-02-17 - Stored XSS via SVG Upload
**Vulnerability:** The application allowed SVG uploads via the standard `image` validation rule in `CardController` and `LocationController`. SVG files can contain malicious JavaScript that executes when viewed by other users (Stored XSS).
**Learning:** Laravel's `image` validation rule allows SVG by default if the environment supports it. Relying on environment configuration (e.g., lack of GD SVG support) is not a robust security control.
**Prevention:** Explicitly restrict allowed MIME types using `mimes:jpeg,png,jpg,gif,webp` for all public-facing image uploads. Added specific tests in `tests/Feature/Admin/Security/FileUploadSecurityTest.php` to verify this restriction.
