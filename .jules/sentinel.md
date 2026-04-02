## 2024-04-02 - Override Laravel Image Rule to Prevent Stored XSS via SVG
**Vulnerability:** The default `image` validation rule in Laravel allows SVG files. SVGs can contain embedded JavaScript, creating a vector for Stored XSS if these files are viewed directly in the browser.
**Learning:** This is a framework-specific nuance where a built-in convenience rule (`image`) isn't strictly safe by default for user-generated content because it maps to MIME types that include `image/svg+xml`.
**Prevention:** Always combine or replace the `image` rule with an explicit `mimes` restriction (e.g., `mimes:jpeg,png,jpg,gif,webp`) when handling user uploads to ensure only safe raster image formats are accepted.
