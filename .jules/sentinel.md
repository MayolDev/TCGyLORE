## 2024-05-23 - Stored XSS via SVG Upload
**Vulnerability:** The application allowed file uploads using the `image` validation rule without restricting MIME types. This permits SVG uploads, which can contain malicious JavaScript (Stored XSS).
**Learning:** The Laravel `image` validation rule considers SVGs as valid images. Relying solely on `image` is insufficient for preventing XSS in file uploads.
**Prevention:** Always explicitly define allowed MIME types using the `mimes:jpeg,png,jpg,gif,webp` rule when handling image uploads, unless SVG support is strictly required and properly sanitized.
