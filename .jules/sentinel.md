## 2026-01-27 - Preventing Stored XSS via SVG Uploads
**Vulnerability:** The `image` validation rule in Laravel (depending on driver/configuration) may accept SVG files. SVG files can contain JavaScript (`<script>`) which executes when viewed in a browser, leading to Stored XSS.
**Learning:** Simply using `image` validation rule is insufficient for preventing Stored XSS if SVGs are not explicitly intended and sanitized. The `image` rule verifies the file is an image, and SVG *is* an image format.
**Prevention:** Explicitly define allowed MIME types using `mimes:jpeg,png,jpg,gif,webp` to exclude `svg` unless a secure sanitization pipeline (like `svg-sanitizer`) is in place.
