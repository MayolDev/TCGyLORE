## 2026-02-20 - SVG Uploads Allowed by `image` Rule
**Vulnerability:** Admin file uploads (`Location` and `Card`) relied solely on the `image` validation rule, which permits SVG files. This could allow Stored XSS if malicious SVGs are uploaded and served directly.
**Learning:** Laravel's `image` rule includes SVG as a valid image type. Developers may assume `image` implies only safe raster formats (JPG, PNG).
**Prevention:** Always combine `image` validation with explicit `mimes:jpeg,png,jpg,gif,webp` restriction when SVG uploads are not intended or safely handled.
