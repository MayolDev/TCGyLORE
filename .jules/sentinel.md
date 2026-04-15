## 2026-04-15 - Prevent Stored XSS in File Uploads
**Vulnerability:** Allowed SVG files to be uploaded which could execute Stored XSS when served.
**Learning:** The default Laravel `image` validation rule allows SVG files, meaning checking for 'image' is insufficient against XSS. Only specific, safe formats like `mimes:jpeg,png,jpg,gif,webp` should be allowed.
**Prevention:** Replace the `image` rule with explicit safe `mimes` constraints.
