# Sentinel's Journal

## 2026-02-04 - Stored XSS via SVG Uploads
**Vulnerability:** The application used the `image` validation rule for file uploads, which by default allows SVG files. SVG files can contain embedded JavaScript (Stored XSS).
**Learning:** Laravel's `image` rule is not sufficient for preventing XSS in image uploads because it considers SVGs as valid images.
**Prevention:** Always use `mimes:jpeg,png,jpg,gif,webp` (excluding `svg`) when validating image uploads, unless strict SVG sanitization is implemented.
