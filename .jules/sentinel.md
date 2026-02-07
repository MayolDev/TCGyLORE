## 2026-02-07 - Insecure SVG Uploads via Default Image Rule
**Vulnerability:** The default `image` validation rule in Laravel allows SVG files, which can contain malicious JavaScript (Stored XSS).
**Learning:** In environments without `libxml` or specific PHP extensions, `image` validation may behave inconsistently or fail to sanitize SVGs.
**Prevention:** Explicitly restrict file types using `mimes:jpeg,png,jpg,gif,webp` for all image uploads to prevent SVG execution.
