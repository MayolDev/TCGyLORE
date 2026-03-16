## 2024-03-16 - Stored XSS via SVG Uploads
**Vulnerability:** The default Laravel 'image' validation rule permits SVG file uploads, which can contain embedded JavaScript and lead to Stored XSS when served directly to users.
**Learning:** Relying on generic validation rules (like 'image') without verifying their exact behavior can introduce security holes, as Laravel's definition of an image includes SVGs.
**Prevention:** Override the default 'image' validation rule with explicit MIME type restrictions (e.g., 'mimes:jpeg,png,jpg,gif,webp') on all endpoints handling image uploads.
