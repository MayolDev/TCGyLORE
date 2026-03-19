## 2025-02-18 - Fix Stored XSS via SVG file uploads
**Vulnerability:** The application allowed uploading SVG files as images. SVGs can contain arbitrary JavaScript, leading to Stored XSS when the image is viewed by other users.
**Learning:** Laravel's default 'image' validation rule permits SVG files, which are a common vector for XSS attacks if not properly sanitized or restricted.
**Prevention:** Override the 'image' rule with explicit MIME type restrictions (e.g., `mimes:jpeg,png,jpg,gif,webp`) to prevent SVG uploads.
