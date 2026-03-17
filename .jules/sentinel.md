
## 2025-01-05 - Stored XSS via SVG File Uploads
**Vulnerability:** Laravel's default 'image' validation rule permits SVG files, which can contain embedded `<script>` tags, leading to a Stored XSS vulnerability when these images are later rendered by the application without sanitization.
**Learning:** Depending solely on the 'image' validation rule is insufficient for preventing malicious script execution via file uploads, as it only validates the file format, not its contents.
**Prevention:** To prevent Stored XSS via file uploads, override Laravel's default 'image' validation rule with explicit MIME type restrictions using 'mimes:jpeg,png,jpg,gif,webp'.
