## 2024-05-24 - [HIGH] Fix Stored XSS vulnerability in image uploads
**Vulnerability:** Stored XSS via SVG file uploads bypassing Laravel's 'image' validation rule.
**Learning:** Laravel's 'image' validation rule permits SVG files, which can contain executable JavaScript leading to Stored XSS when served.
**Prevention:** Override the default 'image' rule with explicit MIME type restrictions using 'mimes:jpeg,png,jpg,gif,webp'.
