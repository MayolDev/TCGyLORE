## 2023-10-27 - Stored XSS via File Upload (Image Validation Rule Bypass)
**Vulnerability:** The default Laravel `'image'` validation rule allows SVG files, which can contain embedded JavaScript that executes in the browser when viewed, leading to Stored XSS.
**Learning:** Laravel's `'image'` validation rule does not sufficiently restrict file types to safe image formats in security-critical contexts where user-uploaded images are served directly.
**Prevention:** Override the `'image'` rule with explicit MIME type restrictions (`'mimes:jpeg,png,jpg,gif,webp'`) to prevent Stored XSS vectors via SVG files.
