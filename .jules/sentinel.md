## 2025-02-14 - Prevent Stored XSS via File Uploads
**Vulnerability:** The default `image` validation rule in Laravel (`image` or `mimes:jpeg,png,bmp,gif,svg,webp`) permits the upload of `svg` files. If an application allows SVG file uploads and serves them directly back to users, malicious users can embed JavaScript within the SVG, leading to Stored Cross-Site Scripting (XSS).
**Learning:** We must not rely blindly on the generic `image` rule when handling untrusted user file uploads, especially if the uploaded files are to be displayed in a browser context.
**Prevention:** Override the default `image` rule with an explicit `mimes` list that deliberately excludes `svg` (e.g., `mimes:jpeg,png,jpg,gif,webp`).
