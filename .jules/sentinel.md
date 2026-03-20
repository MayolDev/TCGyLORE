## 2024-03-20 - Stored XSS via SVG Image Uploads
**Vulnerability:** Laravel's default `image` validation rule permits SVG files, which can contain executable JavaScript. When these files are uploaded and later rendered by other users, it creates a Stored XSS vulnerability.
**Learning:** The default `image` rule is insufficient for preventing malicious script execution via image uploads. It only checks if the file is an image type, and SVG is considered a valid image format.
**Prevention:** To prevent Stored XSS via file uploads, override Laravel's default `image` validation rule with explicit MIME type restrictions using `mimes:jpeg,png,jpg,gif,webp`.
