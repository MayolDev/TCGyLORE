## 2024-03-11 - File Upload XSS via SVG
**Vulnerability:** The default `image` validation rule in Laravel allows SVG files. SVGs can contain embedded JavaScript, which could lead to Stored Cross-Site Scripting (XSS) if users upload malicious SVG files that are later rendered by the application.
**Learning:** Depending solely on Laravel's default `image` rule is insufficient when file uploads are rendered directly on the frontend without sanitization or CSP restrictions. The application must restrict uploads to safe image MIME types.
**Prevention:** Override the default `image` validation rule with explicit MIME type restrictions (`mimes:jpeg,png,jpg,gif,webp`) wherever file uploads are processed.
