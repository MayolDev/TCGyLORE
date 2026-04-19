## 2025-04-19 - Fix Unrestricted File Upload Stored XSS
**Vulnerability:** Laravel's default 'image' validation rule permits SVG files, which can contain embedded JavaScript, leading to Stored XSS.
**Learning:** The 'image' rule isn't sufficient for security; it just checks if it's an image format Laravel recognizes, which includes SVG.
**Prevention:** Override the 'image' validation rule with explicit MIME type restrictions using 'mimes:jpeg,png,jpg,gif,webp'.
