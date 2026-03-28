## 2025-01-20 - Fix Stored XSS via File Uploads
**Vulnerability:** Allowed SVG file uploads could execute malicious scripts in users' browsers.
**Learning:** Laravel's default 'image' validation rule is overly permissive and allows `.svg` files, which are vector graphics that can embed JavaScript.
**Prevention:** Override the 'image' rule with explicit MIME type restrictions using 'mimes:jpeg,png,jpg,gif,webp'.
