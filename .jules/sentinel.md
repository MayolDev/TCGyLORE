## 2025-02-23 - Prevent Stored XSS via File Uploads
**Vulnerability:** Laravel's default 'image' validation rule permits SVG files, which can contain embedded JavaScript that executes when viewed directly in a browser (Stored XSS).
**Learning:** Depending solely on the 'image' rule for file uploads is insecure if files are served directly without sanitization.
**Prevention:** Override the 'image' rule with explicit MIME type restrictions using 'mimes:jpeg,png,jpg,gif,webp' to strictly limit allowed file types.
