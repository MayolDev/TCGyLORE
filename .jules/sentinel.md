## 2024-03-10 - Disallow SVG Image Uploads
**Vulnerability:** Laravel's default `image` validation rule permits SVG files, which could potentially contain malicious scripts resulting in Stored Cross-Site Scripting (XSS).
**Learning:** Found usage of the `image` rule on endpoints accepting images (e.g. `CardController`, `LocationController`) without an accompanying `mimes` rule restricting the allowed types, potentially permitting the upload of SVGs.
**Prevention:** Override the default image allowed types for file uploads by explicitly using `mimes:jpeg,png,jpg,gif,webp`.
