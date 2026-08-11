# Sentinel Journal

## 2024-05-23 - Stored XSS via SVG Upload
**Vulnerability:** The `image` validation rule in Laravel allows SVG files by default. When these files are stored in the public disk and served directly to users, they can execute arbitrary JavaScript (Stored XSS).
**Learning:** Standard validation rules often favor flexibility over strict security. Always verify what "image" or "file" actually implies in the framework documentation.
**Prevention:** Explicitly define allowed MIME types (`mimes:jpeg,png,jpg,gif,webp`) when handling file uploads, especially for public-facing assets.
