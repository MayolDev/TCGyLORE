## 2026-04-12 - File Upload Validation
**Vulnerability:** Default Laravel 'image' rule allows SVG uploads which can contain malicious JavaScript leading to Stored XSS.
**Learning:** Relying solely on Laravel's 'image' rule for uploads is insufficient if SVG files are not strictly needed, as they pose an XSS risk when served to clients.
**Prevention:** Always restrict uploaded image files to explicit safe MIME types (e.g., `mimes:jpeg,png,jpg,gif,webp`) when parsing user-submitted files.
