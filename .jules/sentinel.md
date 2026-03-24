## 2024-05-23 - Prevent Stored XSS via File Uploads
**Vulnerability:** Laravel's default 'image' validation rule permits SVG files, which can contain executable JavaScript leading to Stored XSS.
**Learning:** In a codebase allowing file uploads, relying solely on 'image' validation rule is unsafe if SVGs are permitted and served.
**Prevention:** Override the 'image' validation rule with explicit MIME type restrictions like `mimes:jpeg,png,jpg,gif,webp`.
