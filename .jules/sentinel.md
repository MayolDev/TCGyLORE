## 2026-04-10 - Fix Stored XSS via File Uploads
**Vulnerability:** Stored XSS via Laravel's default 'image' validation rule, which permits SVG uploads containing executable JavaScript.
**Learning:** Laravel's built-in 'image' rule is not inherently safe against vector formats like SVG, making any generic image upload endpoint a potential XSS vector if SVGs are served without strict Content-Security-Policy or sanitization.
**Prevention:** Override the 'image' rule with explicit 'mimes' restrictions (e.g., 'mimes:jpeg,png,jpg,gif,webp') to strictly enforce safe, pixel-based formats across all upload endpoints.
