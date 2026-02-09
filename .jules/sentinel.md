## 2025-05-27 - Stored XSS via SVG Upload
**Vulnerability:** The application allowed SVG file uploads in `CardController` and `LocationController` using the `image` validation rule, which can lead to Stored XSS if the SVG contains malicious scripts.
**Learning:** The `image` validation rule in Laravel allows SVG files. To strictly prevent SVG uploads while allowing other image formats, use `mimes:jpeg,png,jpg,gif,webp`.
**Prevention:** Always explicitly whitelist allowed MIME types for file uploads, especially for public-facing images, and consider if SVG support is truly necessary given its security risks.
