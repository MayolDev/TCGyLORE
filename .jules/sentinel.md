## 2025-01-20 - Stored XSS via SVG Image Upload
**Vulnerability:** The application used Laravel's default `image` validation rule for file uploads. This rule allows SVG files, which can contain embedded JavaScript (Stored XSS).
**Learning:** Laravel's `image` validation rule is insufficient on its own to prevent XSS if the uploaded files are later served directly to users, because SVGs execute scripts when viewed in a browser.
**Prevention:** Always combine the `image` validation rule with an explicit `mimes` restriction (e.g., `mimes:jpeg,png,jpg,gif,webp`) to block dangerous vector image formats like SVG.
