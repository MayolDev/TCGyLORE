## 2025-05-18 - Prevent Stored XSS via File Uploads
**Vulnerability:** The application allowed uploading SVG and BMP files via `Card` and `Location` creation forms. SVG files can contain embedded JavaScript (Stored XSS).
**Learning:** The default Laravel `image` validation rule depends on the underlying PHP extension (GD/Imagick) and might allow SVGs or BMPs if the driver supports them. It is not sufficient for security-critical strict image validation.
**Prevention:** Explicitly use `mimes:jpeg,png,jpg,gif,webp` in validation rules to whitelist safe raster image formats. This provides a consistent security posture regardless of the server environment.
