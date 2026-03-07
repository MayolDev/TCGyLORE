## 2024-05-24 - SVG Upload XSS Risk
**Vulnerability:** Laravel's default `image` validation rule permits SVG files, which can contain and execute malicious JavaScript when served directly to users.
**Learning:** Even when restricting uploads to 'images', SVG files pose a unique Stored XSS threat.
**Prevention:** Always explicitly define allowed MIME types for image uploads using the `mimes:jpeg,png,jpg,gif,webp` rule *before* the `image` rule to strictly restrict files to safe, raster formats.
