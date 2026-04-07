## 2026-04-07 - Fix Stored XSS via File Uploads
**Vulnerability:** Laravel default `image` validation rule permits SVG files, which can execute javascript when loaded directly leading to Stored XSS.
**Learning:** In contexts where user uploads are rendered without proper sanitization, permitting SVG formats introduces significant security vulnerabilities due to their ability to embed `<script>` tags.
**Prevention:** Override the default Laravel `image` validation rule with explicit safe MIME type restrictions using `mimes:jpeg,png,jpg,gif,webp` anywhere image uploads are handled.
