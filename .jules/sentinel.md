## 2025-05-23 - Stored XSS via Image Upload
**Vulnerability:** The application allowed file uploads with the `image` validation rule, which permits SVG files by default. SVGs can contain malicious JavaScript that executes when viewed directly by a user (Stored XSS).
**Learning:** Laravel's `image` validation rule is insufficient for preventing XSS because it considers SVG a valid image type. Using `image` without `mimes` allows SVGs.
**Prevention:** Always explicitly whitelist safe MIME types for image uploads using `mimes:jpeg,png,jpg,gif,webp`. Never allow SVG uploads unless strictly necessary and properly sanitized.
