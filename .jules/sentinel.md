## 2024-05-23 - Stored XSS via SVG Upload
**Vulnerability:** The application allowed uploading `image/*` files, which includes SVGs. SVGs can contain malicious JavaScript (`<script>`) that executes when the image is viewed directly in the browser, leading to Stored XSS.
**Learning:** Laravel's `image` validation rule permits SVGs by default. File uploads that are served publicly must strictly whitelist safe MIME types (jpeg, png, gif, webp).
**Prevention:** Always use `mimes:jpeg,png,jpg,gif,webp` in addition to `image` rule for file uploads. Explicitly exclude `svg` unless sanitized.
