## 2024-04-03 - Stored XSS via Laravel's Image Validation Rule
**Vulnerability:** The default `image` validation rule in Laravel allows SVG files to be uploaded, which can contain embedded JavaScript that executes when viewed in a browser, leading to Stored Cross-Site Scripting (XSS).
**Learning:** Depending solely on the `image` rule in Laravel is insufficient for secure file uploads if SVG support is not explicitly required and sanitized.
**Prevention:** Always combine the `image` rule with an explicit `mimes` restriction (e.g., `mimes:jpeg,png,jpg,gif,webp`) to prevent the upload of potentially malicious SVG files.
