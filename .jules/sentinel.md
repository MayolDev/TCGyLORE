## 2026-01-05 - Implicit SVG Allowance in 'image' Validation
**Vulnerability:** The Laravel `image` validation rule implicitly allows SVG files, which can contain malicious scripts (Stored XSS).
**Learning:** Developers often assume `image` only allows raster formats like JPG/PNG. SVG support must be explicitly blocked if not intended.
**Prevention:** Use `mimes:jpeg,png,jpg,gif,webp` instead of `image` when handling user uploads to prevent SVG execution.
