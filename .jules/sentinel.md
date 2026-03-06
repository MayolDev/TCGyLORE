## 2026-03-06 - Prevent XSS in Image Uploads
**Vulnerability:** File upload endpoints (like `admin.locations.store` and `admin.cards.store`) only validated using the `image` rule. By default, this rule permits SVG files, which can contain embedded JavaScript, creating a risk for Stored Cross-Site Scripting (XSS).
**Learning:** The generic `image` rule in Laravel relies on driver configurations and can be permissive regarding file extensions that pose XSS risks.
**Prevention:** Explicitly use the `mimes:jpeg,png,jpg,gif,webp` rule *before* the `image` rule to strictly enforce safe file types and trigger accurate validation errors.
