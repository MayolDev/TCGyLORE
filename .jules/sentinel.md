## 2025-01-01 - Prevent Stored XSS via File Uploads
**Vulnerability:** Laravel's default 'image' validation rule permits SVG files, which can contain JavaScript and lead to Stored Cross-Site Scripting (XSS).
**Learning:** In a codebase allowing file uploads, relying solely on standard framework rules may not be restrictive enough against specific attack vectors like XSS in SVGs.
**Prevention:** Override the default 'image' rule with explicit MIME type restrictions (e.g., 'mimes:jpeg,png,jpg,gif,webp') to explicitly exclude potentially dangerous formats.
