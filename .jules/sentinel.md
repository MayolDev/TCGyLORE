## 2026-04-26 - [Restrict Image Upload MIME Types]
**Vulnerability:** Allowed arbitrary SVG files to be uploaded which could contain executable JavaScript, resulting in a Stored XSS vulnerability.
**Learning:** The default Laravel `image` validation rule is too permissive and includes SVG by default, making it dangerous when serving user-uploaded content on the same domain without CSP constraints.
**Prevention:** Instead of using the generic `image` rule, always use strict `mimes` definitions (e.g. `mimes:jpeg,png,jpg,gif,webp`) when validating image file uploads to exclude unsafe formats like SVG.
