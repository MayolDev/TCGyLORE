## 2025-03-31 - [Fix Stored XSS via File Uploads]
**Vulnerability:** The application was allowing potentially dangerous file types (like SVG) to be uploaded by solely relying on Laravel's default 'image' validation rule, creating a vector for Stored Cross-Site Scripting (XSS).
**Learning:** Laravel's default 'image' rule is not sufficient for complete file upload security as it allows SVGs, which can contain embedded executable JavaScript.
**Prevention:** Override the default 'image' rule with explicit MIME type restrictions like `mimes:jpeg,png,jpg,gif,webp` to whitelist only safe image formats.
