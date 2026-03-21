## 2026-03-21 - Prevent Stored XSS in File Uploads
**Vulnerability:** Laravel's default 'image' validation rule allows SVG files to be uploaded, which can contain malicious <script> tags leading to Stored XSS.
**Learning:** The default validation is too permissive for untrusted uploads. Relying solely on 'image' validation can lead to security vulnerabilities when files are served directly.
**Prevention:** Replace 'image' validation with a strict 'mimes' rule allowing only safe, non-vector image formats (e.g., 'mimes:jpeg,png,jpg,gif,webp').
